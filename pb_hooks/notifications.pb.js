/// Notifications server-side hooks (PocketBase JSVM)
/// Signature: onHook(handler, ...tags). ALL handlers must call e.next().
/// Handlers run in isolated contexts: shared helpers are loaded via require().

// --- notify admins when a customer submits a booking ---
onRecordAfterCreateSuccess((e) => {
  const utils = require(__hooks + "/lib/notif_utils.js")
  const r = e.record
  const type = r.getString("type")
  const name = r.getString("name") || "A customer"
  if (type === "test_ride") {
    utils.createNotification(e.app, {
      type: "test_ride",
      title: "New Test Ride Booking",
      message: name + " booked a test ride" + (r.getString("motorcycle") ? " for " + r.getString("motorcycle") : ""),
      link: "/dashboard/test-rides",
    })
  } else {
    utils.createNotification(e.app, {
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
  utils.createNotification(e.app, {
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
  utils.createNotification(e.app, {
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
      message: "Your " + (data.isTestRide ? "test ride" : "service booking") + (data.motorcycle ? " for " + data.motorcycle : "") + " is now " + utils.humanizeStatus(data.newStatus),
      link: data.isTestRide ? "/dashboard/my-test-rides" : "/dashboard/my-bookings",
    })
  } else if (data.isOwner) {
    utils.createNotification(e.app, {
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
