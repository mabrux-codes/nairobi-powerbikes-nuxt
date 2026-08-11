/// <reference path="../pb_data/types.d.ts" />

/// Email queue processor + admin routes.
/// Runs due queue jobs on a schedule and exposes admin actions.

// --- process due emails every minute ---
cronAdd("email-processor", "*/1 * * * *", () => {
  try {
    const sender = require(__hooks + "/lib/email/sender.js")
    sender.processDue($app, 25)
  } catch (e) {
    $app.logger().error("email-processor: " + (e && e.message))
  }
})

// --- admin: retry a failed / queued email ---
routerAdd("POST", "/api/email/retry", (c) => {
  const info = c.requestInfo()
  const auth = info.auth
  const isAdmin = !!auth && (auth.getString("role") === "admin" || auth.collection().name === "_superusers")
  if (!isAdmin) return c.json(401, { message: "Not authorized." })
  const id = String((info.body || {}).id || "")
  if (!id) return c.json(400, { message: "Queue id is required." })
  try {
    const rec = $app.findRecordById("email_queue", id)
    rec.set("status", "queued")
    rec.set("scheduledFor", "")
    $app.save(rec)
    const sender = require(__hooks + "/lib/email/sender.js")
    const res = sender.sendQueued($app, rec)
    return c.json(200, { ok: true, result: res.status })
  } catch (e) {
    return c.json(404, { message: (e && e.message) || "Not found." })
  }
})

// --- admin: send a test email (template key or raw subject/body) ---
routerAdd("POST", "/api/email/test", (c) => {
  const info = c.requestInfo()
  const auth = info.auth
  const isAdmin = !!auth && (auth.getString("role") === "admin" || auth.collection().name === "_superusers")
  if (!isAdmin) return c.json(401, { message: "Not authorized." })
  const body = info.body || {}
  const to = String(body.to || "").trim().toLowerCase()
  if (!to || to.indexOf("@") < 0) return c.json(400, { message: "A valid recipient is required." })
  const queue = require(__hooks + "/lib/email/queue.js")
  const res = queue.enqueueEmail($app, {
    recipient: to,
    recipientName: String(body.name || ""),
    template: String(body.template || ""),
    category: "test",
    priority: "high",
    payload: {
      subject: String(body.subject || "Test email from Nairobi Powerbikes"),
      body: String(body.body || "<p>This is a test email from the Nairobi Powerbikes email system.</p>"),
      vars: body.vars || {},
    },
    idempotencyKey: "test:" + to + ":" + Date.now(),
  })
  if (!res.ok) return c.json(400, { message: res.reason || "Could not queue." })
  const sender = require(__hooks + "/lib/email/sender.js")
  const queuedRec = $app.findRecordById("email_queue", res.id)
  const sent = sender.sendQueued($app, queuedRec)
  return c.json(200, { ok: true, result: sent.status, queueId: res.id })
})
