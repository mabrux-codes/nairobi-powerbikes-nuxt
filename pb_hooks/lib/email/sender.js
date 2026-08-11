/// Email sender: processes a queue record with retries + logging.

const MAX_ATTEMPTS = 3

/** Send one queue record. Returns { status, error }. */
function sendQueued(app, queueRecord) {
  const id = queueRecord.id
  const recipient = queueRecord.getString("recipient")
  const recipientName = queueRecord.getString("recipientName")
  const template = queueRecord.getString("template")
  const category = queueRecord.getString("category")
  const tpl = require(__hooks + "/lib/email/templates.js")
  const payload = tpl.readJson(queueRecord.get("payload"))
  const attempts = queueRecord.getInt("attempts")

  // Build the message (may fall back to payload.subject/body for ad-hoc sends)
  const vars = tpl.deepMergeVars(tpl.DEFAULT_VARS(app), payload.vars || {})
  vars.customerName = vars.customerName || payload.customerName || recipientName || recipient.split("@")[0]
  vars.firstName = vars.firstName || (vars.customerName || "").split(" ")[0]
  vars.previewText = vars.previewText || payload.previewText || ""

  const resolved = tpl.resolveTemplate(
    app,
    template,
    vars,
    String(payload.subject || "Message from Nairobi Powerbikes"),
    String(payload.body || ""),
  )
  let subject = resolved.subject
  let html = resolved.html
  let text = resolved.text

  if (!html) html = payload.body || ""
  if (html && html.indexOf("<!DOCTYPE") !== 0) html = tpl.layout(html, vars)

  const meta = app.settings().meta
  const message = new MailerMessage({
    from: { address: meta.senderAddress, name: meta.senderName || meta.appName },
    to: [{ address: recipient, name: recipientName || "" }],
    subject: subject,
    html: html,
    text: text,
  })

  try {
    app.newMailClient().send(message)
    queueRecord.set("status", "sent")
    queueRecord.set("sentAt", new Date().toISOString())
    queueRecord.set("lastError", "")
    queueRecord.set("attempts", attempts + 1)
    app.save(queueRecord)
    writeLog(app, {
      queueId: id,
      recipient,
      subject,
      template,
      category,
      status: "sent",
      attempts: attempts + 1,
      sentAt: new Date().toISOString(),
      relatedType: queueRecord.getString("relatedType"),
      relatedId: queueRecord.getString("relatedId"),
      idempotencyKey: queueRecord.getString("idempotencyKey"),
    })
    return { status: "sent" }
  } catch (err) {
    const error = (err && err.message) || String(err)
    const newAttempts = attempts + 1
    if (newAttempts >= MAX_ATTEMPTS) {
      queueRecord.set("status", "failed")
      queueRecord.set("failedAt", new Date().toISOString())
      queueRecord.set("lastError", error)
      queueRecord.set("attempts", newAttempts)
      app.save(queueRecord)
      writeLog(app, {
        queueId: id,
        recipient,
        subject,
        template,
        category,
        status: "failed",
        attempts: newAttempts,
        failedAt: new Date().toISOString(),
        error,
        relatedType: queueRecord.getString("relatedType"),
        relatedId: queueRecord.getString("relatedId"),
        idempotencyKey: queueRecord.getString("idempotencyKey"),
      })
      return { status: "failed", error }
    }
    // Retry later
    queueRecord.set("status", "queued")
    queueRecord.set("lastError", error)
    queueRecord.set("attempts", newAttempts)
    // backoff: + (10 min * attempts) for normal priority
    const backoffMin = queueRecord.getString("priority") === "high" ? 2 : 10
    const next = new Date(Date.now() + newAttempts * backoffMin * 60 * 1000)
    queueRecord.set("scheduledFor", next.toISOString())
    app.save(queueRecord)
    return { status: "retry", error, attempts: newAttempts }
  }
}

function writeLog(app, data) {
  try {
    const col = app.findCollectionByNameOrId("email_logs")
    const r = new Record(col)
    r.set("queueId", String(data.queueId || ""))
    r.set("recipient", String(data.recipient || ""))
    r.set("subject", String(data.subject || ""))
    r.set("template", String(data.template || ""))
    r.set("category", String(data.category || ""))
    r.set("status", String(data.status || "sent"))
    r.set("attempts", Number(data.attempts || 0))
    if (data.sentAt) r.set("sentAt", data.sentAt)
    if (data.failedAt) r.set("failedAt", data.failedAt)
    r.set("error", String(data.error || ""))
    r.set("relatedType", String(data.relatedType || ""))
    r.set("relatedId", String(data.relatedId || ""))
    r.set("idempotencyKey", String(data.idempotencyKey || ""))
    app.save(r)
  } catch (e) {
    // logging must never break the queue
  }
}

/** Find due queued/retry jobs and process them (in priority order). */
function processDue(app, limit) {
  const now = new Date().toISOString()
  const max = Math.max(1, limit || 25)
  const due = app.findRecordsByFilter(
    "email_queue",
    "status = {:s1} || status = {:s2}",
    "-priority,created",
    max,
    0,
    { s1: "queued", s2: "processing" },
  ).filter((r) => {
    const sched = r.getString("scheduledFor")
    if (!sched) return true
    const d = new Date(sched)
    return !isNaN(d.getTime()) && d.getTime() <= Date.now()
  })

  const results = { sent: 0, retry: 0, failed: 0, error: "" }
  for (const r of due) {
    const res = sendQueued(app, r)
    if (res.status === "sent") results.sent++
    else if (res.status === "retry") results.retry++
    else { results.failed++; results.error = res.error || results.error }
  }
  return results
}

module.exports = { sendQueued, processDue, writeLog, MAX_ATTEMPTS }
