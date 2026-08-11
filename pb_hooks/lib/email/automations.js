/// Payment + booking reminder automations (cron + manual trigger).
/// Vars mirror the branded design-system templates in templates_ops.js.

const tplMod = () => require(__hooks + "/lib/email/templates.js")
const queueMod = () => require(__hooks + "/lib/email/queue.js")
const txMod = () => require(__hooks + "/lib/email/transactional.js")

/** Run payment reminders for active financing plans. */
function runPaymentReminders(app) {
  const q = queueMod()
  const t = tplMod()
  const tx = txMod()
  const financing = app.findRecordsByFilter("financing", "status = {:s}", "", 500, 0, { s: "active" })
  let enqueued = 0
  for (const f of financing) {
    const frequency = f.getString("frequency") || "monthly"
    const installments = f.getInt("installments")
    const start = f.getString("start_date")
    const startMs = start ? new Date(start).getTime() : Date.now()
    if (!startMs || isNaN(startMs)) continue

    const stepMs = (() => {
      if (frequency === "weekly") return 7 * 86400000
      if (frequency === "biweekly") return 14 * 86400000
      if (frequency === "quarterly") return 91 * 86400000
      return 30 * 86400000
    })()

    const nowMs = Date.now()
    const elapsed = nowMs - startMs
    const currentInstallment = Math.max(1, Math.min(installments, Math.floor(elapsed / stepMs) + 1))

    const dueMs = startMs + (currentInstallment - 1) * stepMs
    const daysToDue = Math.round((dueMs - nowMs) / 86400000)
    const overdue = daysToDue < 0

    const saleId = f.getString("sale")
    if (!saleId) continue
    let sale = null
    try { sale = app.findRecordById("sales", saleId) } catch (e) { continue }
    if (!sale) continue
    const customerId = sale.getString("customer")
    if (!customerId) continue
    let customer = null
    try { customer = app.findRecordById("users", customerId) } catch (e) { continue }
    if (!customer) continue
    const email = customer.getString("email")
    if (!email) continue

    const name = customer.getString("name") || email
    const product = tx.resolveMotorcycle(app, sale.getString("motorcycle"))
    const vars = t.deepMergeVars(t.DEFAULT_VARS(app), Object.assign({}, product, {
      customerName: name,
      firstName: name.split(" ")[0],
      installmentAmount: t.money(f.get("installment_amount")),
      totalPayable: t.money(f.get("total_payable")),
      outstandingBalance: t.money(sale.get("outstanding")),
      dueDate: new Date(dueMs).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }),
      saleReference: "PB-SALE-" + String(sale.id || "").slice(-6).toUpperCase(),
      frequency: frequency,
      installments: String(installments),
      financeUrl: (app.settings().meta.appURL || "") + "/dashboard",
    }))
    const template = overdue ? "payment_overdue" : "payment_due"
    const subject = overdue
      ? "Your installment is overdue — " + vars.installmentAmount
      : "Your next installment is due soon — " + vars.installmentAmount

    const res = q.enqueueEmail(app, {
      recipient: email,
      recipientName: name,
      template,
      category: "finance",
      priority: "high",
      payload: { subject, body: "", vars },
      idempotencyKey: (overdue ? "payment-overdue:" : "payment-reminder:") + f.id + ":" + currentInstallment,
      relatedType: "financing",
      relatedId: f.id,
    })
    if (res.ok && res.enqueued) enqueued++
  }
  return { enqueued }
}

/** Run all configured automations. */
function runAll(app) {
  try {
    runPaymentReminders(app)
  } catch (err) {
    app.logger().error("automation payment-reminder: " + (err && err.message))
  }

  // Booking reminders: confirmed bookings happening today.
  try {
    const q = queueMod()
    const t = tplMod()
    const tx = txMod()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const bookings = app.findRecordsByFilter(
      "service_bookings",
      "status = {:s} && preferred_date = {:d}",
      "",
      200,
      0,
      { s: "confirmed", d: today.toISOString().slice(0, 10) },
    )
    for (const b of bookings) {
      const product = tx.resolveMotorcycle(app, b.getString("motorcycle"))
      const vars = t.deepMergeVars(t.DEFAULT_VARS(app), tx.bookingPayload(app, b, product))
      const recipient = tx.bookingRecipient(b)
      if (!recipient) continue
      q.enqueueEmail(app, {
        recipient,
        recipientName: b.getString("name") || "",
        template: "booking_reminder",
        category: "bookings",
        priority: "high",
        payload: { subject: "Reminder: your booking is today — " + vars.motorcycleName, body: "", vars },
        idempotencyKey: "booking-reminder:" + b.id + ":" + today.toISOString().slice(0, 10),
        relatedType: "service_booking",
        relatedId: b.id,
      })
    }
  } catch (err) {
    app.logger().error("automation booking-reminder: " + (err && err.message))
  }
}

module.exports = { runPaymentReminders, runAll }