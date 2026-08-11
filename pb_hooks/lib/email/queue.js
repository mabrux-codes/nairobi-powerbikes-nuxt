/// Email queue helpers (enqueue + idempotency).
/// Required inside hook callbacks; `app` passed as a parameter.

/**
 * Queue an email. Returns { ok, enqueued, reason } or throws.
 * - idempotencyKey: if a job with the same key already reached 'sent',
 *   the email is skipped (returns { enqueued: false, reason: 'duplicate' }).
 */
function enqueueEmail(app, opts) {
  const recipient = String(opts.recipient || "").trim().toLowerCase()
  if (!recipient || recipient.indexOf("@") < 0) {
    return { ok: false, enqueued: false, reason: "invalid-recipient" }
  }

  const key = String(opts.idempotencyKey || "").trim()
  if (key) {
    // Already delivered?
    const sent = app.findRecordsByFilter("email_logs", "idempotencyKey = {:k} && status = {:s}", "", 1, 0, { k: key, s: "sent" })
    if (sent.length > 0) return { ok: true, enqueued: false, reason: "duplicate" }
    // Avoid piling up queued duplicates of the same event.
    const queued = app.findRecordsByFilter("email_queue", "idempotencyKey = {:k} && status = {:s}", "", 1, 0, { k: key, s: "queued" })
    if (queued.length > 0) return { ok: true, enqueued: false, reason: "already-queued" }
  }

  const col = app.findCollectionByNameOrId("email_queue")
  const r = new Record(col)
  r.set("recipient", recipient)
  r.set("recipientName", String(opts.recipientName || ""))
  r.set("template", String(opts.template || ""))
  r.set("category", String(opts.category || "system"))
  r.set("priority", ["low", "normal", "high"].indexOf(opts.priority) >= 0 ? opts.priority : "normal")
  r.set("status", "queued")
  r.set("attempts", 0)
  r.set("payload", opts.payload || {})
  if (opts.scheduledFor) r.set("scheduledFor", opts.scheduledFor)
  if (opts.relatedType) r.set("relatedType", String(opts.relatedType))
  if (opts.relatedId) r.set("relatedId", String(opts.relatedId))
  if (key) r.set("idempotencyKey", key)
  app.save(r)
  return { ok: true, enqueued: true, id: r.id }
}

module.exports = { enqueueEmail }
