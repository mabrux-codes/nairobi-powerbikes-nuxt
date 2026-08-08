/// Shared helpers for the notifications hooks.
/// NOTE: handlers run in isolated contexts, so cross-hook state is kept in
/// $app.store() as JSON strings (safe for concurrent access).
///
/// Delivery model:
///   - Personal: data.user set -> 1 record for that recipient.
///   - Role/global broadcast: materialize one record PER recipient so that
///     `read` / `delete` stay per-user (see also notifications collection rules).

function createNotification(app, data) {
  const collection = app.findCollectionByNameOrId("notifications")
  const n = new Record(collection)
  n.set("title", data.title || "Notification")
  n.set("message", data.message || "")
  n.set("link", data.link || "")
  n.set("type", data.type || "system")
  n.set("read", false)
  if (data.user) n.set("user", data.user)
  if (data.broadcast) n.set("broadcast", true)
  if (data.role) n.set("role", data.role)
  app.save(n)
  return n
}

/// Deliver to every active user of a specific role (admin | customer | staff).
function broadcastToRole(app, role, data) {
  const users = app.findRecordsByFilter("users", "role = {:r} && status != {:s}", "", 500, 0, { r: role, s: "inactive" })
  let count = 0
  for (const u of users) {
    createNotification(app, {
      title: data.title,
      message: data.message,
      link: data.link,
      type: data.type,
      user: u.id,
      broadcast: true,
      role: role,
    })
    count++
  }
  return count
}

/// Deliver to every active authenticated user (global announcement).
function broadcastToAll(app, data) {
  const users = app.findRecordsByFilter("users", "status != {:s}", "", 500, 0, { s: "inactive" })
  let count = 0
  for (const u of users) {
    createNotification(app, {
      title: data.title,
      message: data.message,
      link: data.link,
      type: data.type,
      user: u.id,
      broadcast: true,
      role: "",
    })
    count++
  }
  return count
}

function humanizeStatus(s) {
  return String(s || "").replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim() || "Updated"
}

/// Human, per-status notification copy. Test ride statuses use the approved
/// wording; other statuses fall back to a generic "is now <Status>" message.
function statusMessage(isTestRide, newStatus, motorcycle) {
  if (!isTestRide) {
    return "Your " + (motorcycle ? "service booking for " + motorcycle : "service booking") + " is now " + humanizeStatus(newStatus)
  }
  const copy = {
    pending: "Your test ride request has been received.",
    awaiting_verification: "Your test ride request is now under review.",
    confirmed: "Your test ride has been confirmed.",
    rescheduled: "Your test ride has been rescheduled.",
    cancelled: "Your test ride has been cancelled.",
    rejected: "Your test ride request was rejected.",
  }
  return copy[newStatus] || "Your test ride is now " + humanizeStatus(newStatus)
}

function cacheStatusChange(app, recordId, data) {
  app.store().set("npb_pending_status_" + recordId, JSON.stringify(data))
}

function consumeStatusChange(app, recordId) {
  const key = "npb_pending_status_" + recordId
  const raw = app.store().get(key)
  if (raw) app.store().remove(key)
  if (!raw) return null
  try { return JSON.parse(raw) } catch (err) { return null }
}

module.exports = { createNotification, broadcastToRole, broadcastToAll, humanizeStatus, statusMessage, cacheStatusChange, consumeStatusChange }
