/// Notifications server-side hooks (PocketBase JSVM)
/// Signature: onHook(handler, ...tags). ALL handlers must call e.next().
/// Handlers run in isolated contexts: shared helpers are loaded via require().
///
/// Delivery model: broadcasts are materialized per recipient by the utils
/// (broadcastToRole / broadcastToAll), so every notification record belongs to
/// exactly one user and `read` stays per-user.

// --- notify admins when a customer submits a booking (and notify the customer of their own Test Ride booking) ---
onRecordAfterCreateSuccess((e) => {
  const utils = require(__hooks + "/lib/notif_utils.js")
  const r = e.record
  const type = r.getString("type")
  const name = r.getString("name") || "A customer"
  if (type === "test_ride") {
    const branch = r.getString("branch")
    utils.broadcastToRole(e.app, "admin", {
      type: "test_ride",
      title: "New Test Ride Booking",
      message:
        name +
        " has submitted a test ride request" +
        (r.getString("motorcycle") ? " for " + r.getString("motorcycle") : "") +
        (branch ? " at " + branch : "") +
        ".",
      link: "/dashboard/test-rides",
    })
    const customerId = r.getString("user")
    if (customerId) {
      utils.createNotification(e.app, {
        type: "test_ride",
        user: customerId,
        title: "Test Ride Booking Confirmed",
        message:
          "Your test ride request for " +
          (r.getString("motorcycle") || "your chosen motorcycle") +
          " has been successfully received. Our team will contact you to confirm your available slot.",
        link: "/dashboard/my-test-rides",
      })
    }
  } else {
    utils.broadcastToRole(e.app, "admin", {
      type: "service",
      title: "New Service Booking",
      message: name + " booked a " + (r.getString("service_type") || "service") + " appointment",
      link: "/dashboard/service-bookings",
    })
  }
  e.next()
}, "service_bookings")

// --- notify admins when a testimonial is submitted ---
onRecordAfterCreateSuccess((e) => {
  const utils = require(__hooks + "/lib/notif_utils.js")
  const r = e.record
  utils.broadcastToRole(e.app, "admin", {
    type: "testimonial",
    title: "New Testimonial",
    message: (r.getString("name") || "Someone") + " submitted a testimonial",
    link: "/dashboard/testimonials",
  })
  e.next()
}, "testimonials")

// --- notify admins when a contact message is submitted ---
onRecordAfterCreateSuccess((e) => {
  const utils = require(__hooks + "/lib/notif_utils.js")
  const r = e.record
  utils.broadcastToRole(e.app, "admin", {
    type: "contact",
    title: "New Contact Message",
    message: (r.getString("name") || "Someone") + " sent a message: " + (r.getString("subject") || "General Inquiry"),
    link: "/dashboard/contacts",
  })
  e.next()
}, "contacts")

// --- detect booking status changes: cache intent, notify only if the save succeeds ---
onRecordUpdateRequest((e) => {
  const utils = require(__hooks + "/lib/notif_utils.js")
  const newStatus = e.record.getString("status")
  let oldStatus = newStatus
  try {
    oldStatus = e.app.findRecordById("service_bookings", e.record.id).getString("status")
  } catch (err) {
    // fallback: treat as no change
  }
  if (oldStatus === newStatus) {
    e.next()
    return
  }

  const auth = e.auth || null
  const userId = e.record.getString("user")
  if (auth && userId) {
    let isAdmin = false
    try {
      isAdmin = auth.getString("role") === "admin" || auth.collection().name === "_superusers"
    } catch (err) {
      isAdmin = false
    }
    const isOwner = auth.id === userId && auth.getString("role") === "customer"
    if (isAdmin || isOwner) {
      utils.cacheStatusChange(e.app, e.record.id, {
        isTestRide: e.record.getString("type") === "test_ride",
        newStatus,
        userId,
        name: e.record.getString("name"),
        motorcycle: e.record.getString("motorcycle"),
        isAdmin,
        isOwner,
      })
    }
  }
  e.next()
}, "service_bookings")

onRecordAfterUpdateSuccess((e) => {
  const utils = require(__hooks + "/lib/notif_utils.js")
  const data = utils.consumeStatusChange(e.app, e.record.id)
  if (!data) {
    e.next()
    return
  }
  if (data.isAdmin && data.userId) {
    utils.createNotification(e.app, {
      type: data.isTestRide ? "test_ride" : "service",
      user: data.userId,
      title: data.isTestRide ? "Test Ride Update" : "Service Booking Update",
      message: utils.statusMessage(data.isTestRide, data.newStatus, data.motorcycle),
      link: data.isTestRide ? "/dashboard/my-test-rides" : "/dashboard/my-bookings",
    })
  } else if (data.isOwner) {
    utils.broadcastToRole(e.app, "admin", {
      type: "system",
      title: "Customer updated booking",
      message: (data.name || "A customer") + " updated their booking to " + utils.humanizeStatus(data.newStatus),
      link: data.isTestRide ? "/dashboard/test-rides" : "/dashboard/service-bookings",
    })
  }
  e.next()
}, "service_bookings")

onRecordAfterUpdateError((e) => {
  const utils = require(__hooks + "/lib/notif_utils.js")
  utils.consumeStatusChange(e.app, e.record.id)
  e.next()
}, "service_bookings")

// --- admin send tool: deliver to a user, a role, or globally ---
// Server-side delivery guarantees ownership + lets the admin see delivery counts.
routerAdd("POST", "/api/notifications/send", (c) => {
  const utils = require(__hooks + "/lib/notif_utils.js")
  const info = c.requestInfo()
  const auth = info.auth
  const isAdmin = !!auth && (auth.getString("role") === "admin" || auth.collection().name === "_superusers")
  if (!isAdmin) return c.json(401, { message: "Not authorized." })

  const body = info.body || {}
  const title = String(body.title || "").trim()
  if (!title) return c.json(400, { message: "Title is required." })
  const type = String(body.type || "system")
  const message = String(body.message || "")
  const link = String(body.link || "")
  const audience = String(body.audience || "user")

  let delivered = 0
  if (audience === "role") {
    const role = String(body.role || "")
    if (!["admin", "customer", "staff"].includes(role)) return c.json(400, { message: "Invalid role." })
    delivered = utils.broadcastToRole($app, role, { type, title, message, link })
  } else if (audience === "global") {
    delivered = utils.broadcastToAll($app, { type, title, message, link })
  } else {
    const uid = String(body.user || "")
    if (!uid) return c.json(400, { message: "Recipient is required." })
    utils.createNotification($app, { type, title, message, link, user: uid })
    delivered = 1
  }
  return c.json(200, { ok: true, delivered })
})
