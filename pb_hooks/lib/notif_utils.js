/// Shared helpers for the notifications hooks.
/// NOTE: handlers run in isolated contexts, so cross-hook state is kept in
/// $app.store() as JSON strings (safe for concurrent access).

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
  app.save(n)
}

function humanizeStatus(s) {
  return String(s || "").replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).trim() || "Updated"
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

module.exports = { createNotification, humanizeStatus, cacheStatusChange, consumeStatusChange }
