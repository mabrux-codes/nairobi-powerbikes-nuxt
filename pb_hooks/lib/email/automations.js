/// Payment + booking reminder automation logic (used by cron and manual trigger).

const tplMod = () => require(__hooks + "/lib/email/templates.js")
const queueMod = () => require(__hooks + "/lib/email/queue.js")

/** Run payment reminders for active financing plans. */
function runPaymentReminders(app) {
  const q = queueMod()
  const t = tplMod()
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
    const vars = t.deepMergeVars(t.DEFAULT_VARS(app), {
      customerName: name,
      firstName: name.split(" ")[0],
      installmentAmount: t.money(f.get("installment_amount")),
      totalPayable: t.money(f.get("total_payable")),
      outstandingBalance: t.money(sale.get("outstanding")),
      dueDate: new Date(dueMs).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }),
    })
    let template = "payment_reminder"
    let subject = "Your Nairobi PowerBikes payment is coming up"
    if (overdue) {
      template = "payment_overdue"
      subject = "Your Nairobi PowerBikes payment is overdue"
    }
    const body =
      "<h2 style='color:#fff;margin:0 0 12px;'>" + (overdue ? "Payment overdue" : "Payment reminder") + "</h2>" +
      "<p>Hi " + vars.firstName + ",</p>" +
      "<p>" + (overdue ? "Your installment is now due." : "Your next installment is due soon.") + "</p>" +
      "<table role='presentation' width='100%' cellpadding='6' cellspacing='0' style='background:#1a1a1f;border:1px solid #26262b;border-radius:12px;margin:12px 0;font-size:13px;color:#c9c9d1;'>" +
      "<tr><td style='color:#8b8b94;'>Installment</td><td style='color:#ef2a2a;'>" + vars.installmentAmount + "</td></tr>" +
      "<tr><td style='color:#8b8b94;'>Due date</td><td>" + vars.dueDate + "</td></tr>" +
      "<tr><td style='color:#8b8b94;'>Outstanding</td><td>" + vars.outstandingBalance + "</td></tr>" +
      "</table>" +
      "<p>You can view your financing plan from your dashboard.</p>"

    const res = q.enqueueEmail(app, {
      recipient: email,
      recipientName: name,
      template,
      category: "payments",
      priority: "high",
      payload: { subject, body, vars },
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
      const email = b.getString("email")
      const uid = b.getString("user")
      let recipient = email
      if (!recipient && uid) {
        try { recipient = app.findRecordById("users", uid).getString("email") } catch (e) {}
      }
      if (!recipient) continue
      const name = b.getString("name") || ""
      const vars = t.deepMergeVars(t.DEFAULT_VARS(app), {
        customerName: name,
        firstName: name.split(" ")[0],
        motorcycleName: b.getString("motorcycle") || "your motorcycle",
        bookingDate: b.getString("preferred_date"),
        bookingTime: b.getString("preferred_time") || "Flexible",
        branchName: b.getString("branch") || "Main Branch",
        bookingReference: b.id,
      })
      const body =
        "<h2 style='color:#fff;margin:0 0 12px;'>Your booking is today</h2>" +
        "<p>Hi " + vars.firstName + ",</p>" +
        "<p>A quick reminder that your booking is scheduled for today:</p>" +
        "<table role='presentation' width='100%' cellpadding='6' cellspacing='0' style='background:#1a1a1f;border:1px solid #26262b;border-radius:12px;margin:12px 0;font-size:13px;color:#c9c9d1;'>" +
        "<tr><td style='color:#8b8b94;'>Motorcycle</td><td>" + vars.motorcycleName + "</td></tr>" +
        "<tr><td style='color:#8b8b94;'>Time</td><td>" + vars.bookingTime + "</td></tr>" +
        "<tr><td style='color:#8b8b94;'>Branch</td><td>" + vars.branchName + "</td></tr>" +
        "<tr><td style='color:#8b8b94;'>Reference</td><td>" + vars.bookingReference + "</td></tr>" +
        "</table>" +
        "<p>We look forward to seeing you!</p>"
      q.enqueueEmail(app, {
        recipient,
        recipientName: name,
        template: "booking_reminder",
        category: "bookings",
        priority: "high",
        payload: { subject: "Reminder: your booking is today", body, vars },
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
