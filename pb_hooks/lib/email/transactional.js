/// Transactional email builders for bookings, test rides, sales, payments,
/// financing and stock reminders. Required inside PB JSVM hook callbacks.

const tplMod = () => require(__hooks + "/lib/email/templates.js")
const queueMod = () => require(__hooks + "/lib/email/queue.js")

function baseVars(app, extra) {
  const t = tplMod()
  return t.deepMergeVars(t.DEFAULT_VARS(app), extra || {})
}

// Enqueue to every active user of a role (admin routing).
function enqueueAdminRole(app, role, opts) {
  const q = queueMod()
  const admins = app.findRecordsByFilter("users", "role = {:r} && status != {:s}", "", 500, 0, { r: role, s: "inactive" })
  let count = 0
  for (const u of admins) {
    const email = u.getString("email")
    if (!email || email.indexOf("@") < 0) continue
    const res = q.enqueueEmail(app, Object.assign({}, opts, {
      recipient: email,
      recipientName: u.getString("name"),
      idempotencyKey: opts.idempotencyKey + ":" + u.id,
    }))
    if (res.ok && res.enqueued) count++
  }
  return { ok: true, enqueued: count }
}

function bookingPayload(b) {
  return {
    bookingReference: b.id || "",
    customerName: b.getString("name") || "",
    firstName: (b.getString("name") || "").split(" ")[0],
    motorcycleName: b.getString("motorcycle") || "your motorcycle",
    serviceType: b.getString("service_type") || "",
    bookingDate: b.getString("preferred_date") || "",
    bookingTime: b.getString("preferred_time") || "",
    branchName: b.getString("branch") || "Main Branch",
    bookingStatus: b.getString("status") || "pending",
    notes: b.getString("description") || b.getString("notes") || "",
  }
}

function bookingRecipient(b) {
  const email = b.getString("email")
  if (email && email.indexOf("@") > 0) return email
  const uid = b.getString("user")
  if (uid) {
    try {
      const u = b.app.findRecordById("users", uid)
      const ue = u.getString("email")
      if (ue) return ue
    } catch (e) {}
  }
  return ""
}

function enqueueBooking(app, b, template, category, subject, body, idemKey) {
  const q = queueMod()
  const vars = baseVars(app, bookingPayload(b))
  const recipient = bookingRecipient(b)
  if (!recipient) return { ok: false, reason: "no-recipient" }
  return q.enqueueEmail(app, {
    recipient,
    recipientName: b.getString("name") || "",
    template,
    category,
    priority: "high",
    payload: { subject, body, vars },
    idempotencyKey: idemKey,
    relatedType: "service_booking",
    relatedId: b.id,
  })
}

// --- Service booking received (customer) ---
function bookingReceived(app, b) {
  const t = tplMod()
  const vars = baseVars(app, bookingPayload(b))
  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>Booking request received</h2>" +
    "<p>Hi " + vars.firstName + ",</p>" +
    "<p>Thank you for booking with Nairobi Powerbikes. Here's a summary of your request:</p>" +
    "<table role='presentation' width='100%' cellpadding='6' cellspacing='0' style='background:#1a1a1f;border:1px solid #26262b;border-radius:12px;margin:12px 0;font-size:13px;color:#c9c9d1;'>" +
    "<tr><td style='color:#8b8b94;'>Motorcycle</td><td>" + vars.motorcycleName + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Service</td><td>" + (vars.serviceType || "—") + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Date</td><td>" + vars.bookingDate + " · " + (vars.bookingTime || "Flexible") + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Branch</td><td>" + vars.branchName + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Reference</td><td>" + vars.bookingReference + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Status</td><td style='color:#fbbf24;'>Pending confirmation</td></tr>" +
    "</table>" +
    "<p>Our team will confirm your slot shortly.</p>"
  return enqueueBooking(app, b, "booking_received", "bookings", "Booking request received — " + vars.customerName, body, "booking-received:" + b.id)
}

// --- Admin notified of a new booking ---
function bookingNewAdmin(app, b) {
  const t = tplMod()
  const vars = baseVars(app, bookingPayload(b))
  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>New booking request</h2>" +
    "<p>A new booking was submitted:</p>" +
    "<table role='presentation' width='100%' cellpadding='6' cellspacing='0' style='background:#1a1a1f;border:1px solid #26262b;border-radius:12px;margin:12px 0;font-size:13px;color:#c9c9d1;'>" +
    "<tr><td style='color:#8b8b94;'>Customer</td><td>" + vars.customerName + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Motorcycle</td><td>" + vars.motorcycleName + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Service</td><td>" + (vars.serviceType || "—") + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Date</td><td>" + vars.bookingDate + " · " + (vars.bookingTime || "Flexible") + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Branch</td><td>" + vars.branchName + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Reference</td><td>" + vars.bookingReference + "</td></tr>" +
    "</table>"
  const subject = "New booking: " + vars.customerName + " — " + vars.motorcycleName
  // Send to every active admin (role-based routing)
  return enqueueAdminRole(app, "admin", {
    template: "booking_new_admin",
    category: "bookings",
    priority: "high",
    payload: { subject, body, vars },
    idempotencyKey: "booking-new-admin:" + b.id,
    relatedType: "service_booking",
    relatedId: b.id,
  })
}

// --- Booking status changed (customer) ---
function bookingStatusChanged(app, b, oldStatus) {
  const status = b.getString("status") || "pending"
  const isTestRide = b.getString("type") === "test_ride"
  const copy = {
    pending: "Your booking is being reviewed.",
    confirmed: "Your booking has been confirmed. See you at the branch!",
    awaiting_approval: "Your service requires your approval before we proceed.",
    diagnosed: "Your motorcycle is currently being diagnosed.",
    in_progress: "Your motorcycle is now being worked on.",
    ready: "Your motorcycle is ready for collection.",
    completed: "Your service has been completed. Thank you!",
    cancelled: "Your booking has been cancelled.",
    rescheduled: "Your booking has been rescheduled.",
  }
  const t = tplMod()
  const vars = baseVars(app, bookingPayload(b))
  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>" + (isTestRide ? "Test ride" : "Booking") + " update</h2>" +
    "<p>Hi " + vars.firstName + ",</p>" +
    "<p>Your " + (isTestRide ? "test ride" : "service booking") + " for <strong style='color:#fff'>" + vars.motorcycleName + "</strong> is now <strong style='color:#ef2a2a;'>" + String(status).replace(/_/g, " ") + "</strong>.</p>" +
    "<p>" + (copy[status] || "Status updated.") + "</p>" +
    "<table role='presentation' width='100%' cellpadding='6' cellspacing='0' style='background:#1a1a1f;border:1px solid #26262b;border-radius:12px;margin:12px 0;font-size:13px;color:#c9c9d1;'>" +
    "<tr><td style='color:#8b8b94;'>Date</td><td>" + vars.bookingDate + " · " + (vars.bookingTime || "Flexible") + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Branch</td><td>" + vars.branchName + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Reference</td><td>" + vars.bookingReference + "</td></tr>" +
    "</table>"
  return enqueueBooking(app, b, "booking_status_" + status, "bookings", "Your " + (isTestRide ? "test ride" : "booking") + " is now " + String(status).replace(/_/g, " "), body, "booking-status:" + b.id + ":" + status)
}

// --- Sale confirmation ---
function saleConfirmation(app, sale) {
  const q = queueMod()
  const t = tplMod()
  const customerId = sale.getString("customer")
  if (!customerId) return { ok: false, reason: "no-customer" }
  let customer = null
  try { customer = app.findRecordById("users", customerId) } catch (e) {}
  if (!customer) return { ok: false, reason: "no-customer" }
  const email = customer.getString("email")
  if (!email) return { ok: false, reason: "no-email" }
  const bikeName = (() => { try { return app.findRecordById("motorcycles", sale.getString("motorcycle")).getString("name") } catch (e) { return "Motorcycle" } })()
  const vars = baseVars(app, {
    customerName: customer.getString("name") || customer.getString("email"),
    firstName: (customer.getString("name") || "").split(" ")[0],
    motorcycleName: bikeName,
    saleReference: sale.id || "",
    amountPaid: t.money(sale.get("amount_paid")),
    outstandingBalance: t.money(sale.get("outstanding")),
    totalPayable: t.money(sale.get("total_payable")),
    paymentMethod: sale.getString("payment_method") || "",
    saleDate: sale.getString("sale_date") || sale.getString("created"),
  })
  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>Purchase confirmation</h2>" +
    "<p>Hi " + vars.firstName + ",</p>" +
    "<p>Thank you for your purchase at Nairobi Powerbikes. Here are the details:</p>" +
    "<table role='presentation' width='100%' cellpadding='6' cellspacing='0' style='background:#1a1a1f;border:1px solid #26262b;border-radius:12px;margin:12px 0;font-size:13px;color:#c9c9d1;'>" +
    "<tr><td style='color:#8b8b94;'>Motorcycle</td><td>" + vars.motorcycleName + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Total</td><td>" + vars.totalPayable + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Paid</td><td style='color:#10b981;'>" + vars.amountPaid + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Outstanding</td><td>" + vars.outstandingBalance + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Method</td><td>" + vars.paymentMethod + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Reference</td><td>" + vars.saleReference + "</td></tr>" +
    "</table>"
  return q.enqueueEmail(app, {
    recipient: email,
    recipientName: customer.getString("name"),
    template: "sale_confirmation",
    category: "sales",
    priority: "high",
    payload: { subject: "Your Nairobi PowerBikes purchase — " + vars.motorcycleName, body, vars },
    idempotencyKey: "sale-confirmation:" + sale.id,
    relatedType: "sale",
    relatedId: sale.id,
  })
}

// --- Payment received (customer) ---
function paymentReceipt(app, payment, sale) {
  const q = queueMod()
  const t = tplMod()
  const customerId = sale ? sale.getString("customer") : ""
  if (!customerId) return { ok: false, reason: "no-customer" }
  let customer = null
  try { customer = app.findRecordById("users", customerId) } catch (e) {}
  if (!customer) return { ok: false, reason: "no-customer" }
  const email = customer.getString("email")
  if (!email) return { ok: false, reason: "no-email" }
  const bikeName = (() => { try { return app.findRecordById("motorcycles", sale.getString("motorcycle")).getString("name") } catch (e) { return "Motorcycle" } })()
  const vars = baseVars(app, {
    customerName: customer.getString("name") || customer.getString("email"),
    firstName: (customer.getString("name") || "").split(" ")[0],
    motorcycleName: bikeName,
    amountReceived: t.money(payment.get("amount")),
    amountPaid: t.money(sale.get("amount_paid")),
    outstandingBalance: t.money(sale.get("outstanding")),
    totalPayable: t.money(sale.get("total_payable")),
    paymentMethod: payment.getString("payment_method") || "",
    saleReference: sale.id || "",
  })
  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>Payment received</h2>" +
    "<p>Hi " + vars.firstName + ",</p>" +
    "<p>We've received a payment for your purchase:</p>" +
    "<table role='presentation' width='100%' cellpadding='6' cellspacing='0' style='background:#1a1a1f;border:1px solid #26262b;border-radius:12px;margin:12px 0;font-size:13px;color:#c9c9d1;'>" +
    "<tr><td style='color:#8b8b94;'>Motorcycle</td><td>" + vars.motorcycleName + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Amount received</td><td style='color:#10b981;'>" + vars.amountReceived + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Total paid</td><td>" + vars.amountPaid + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Outstanding</td><td>" + vars.outstandingBalance + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Method</td><td>" + vars.paymentMethod + "</td></tr>" +
    "</table>" +
    "<p>Thank you for riding with Nairobi Powerbikes.</p>"
  return q.enqueueEmail(app, {
    recipient: email,
    recipientName: customer.getString("name"),
    template: "payment_receipt",
    category: "payments",
    priority: "high",
    payload: { subject: "Payment received — Nairobi PowerBikes", body, vars },
    idempotencyKey: "payment-receipt:" + payment.id,
    relatedType: "payment",
    relatedId: payment.id,
  })
}

// --- Financing activated (customer) ---
function financingActivated(app, finance, sale) {
  const q = queueMod()
  const t = tplMod()
  const customerId = sale ? sale.getString("customer") : ""
  if (!customerId) return { ok: false, reason: "no-customer" }
  let customer = null
  try { customer = app.findRecordById("users", customerId) } catch (e) {}
  if (!customer) return { ok: false, reason: "no-customer" }
  const email = customer.getString("email")
  if (!email) return { ok: false, reason: "no-email" }
  const bikeName = (() => { try { return app.findRecordById("motorcycles", sale.getString("motorcycle")).getString("name") } catch (e) { return "Motorcycle" } })()
  const vars = baseVars(app, {
    customerName: customer.getString("name") || customer.getString("email"),
    firstName: (customer.getString("name") || "").split(" ")[0],
    motorcycleName: bikeName,
    financedAmount: t.money(finance.get("amount_financed")),
    deposit: t.money(finance.get("deposit")),
    installments: finance.getString("installments") || "0",
    frequency: finance.getString("frequency") || "monthly",
    installmentAmount: t.money(finance.get("installment_amount")),
    totalPayable: t.money(finance.get("total_payable")),
    provider: finance.getString("provider") || "Nairobi Powerbikes",
  })
  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>Your financing plan is active</h2>" +
    "<p>Hi " + vars.firstName + ",</p>" +
    "<p>Great news — your financing plan is now active for your <strong style='color:#fff'>" + vars.motorcycleName + "</strong>.</p>" +
    "<table role='presentation' width='100%' cellpadding='6' cellspacing='0' style='background:#1a1a1f;border:1px solid #26262b;border-radius:12px;margin:12px 0;font-size:13px;color:#c9c9d1;'>" +
    "<tr><td style='color:#8b8b94;'>Provider</td><td>" + vars.provider + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Deposit</td><td>" + vars.deposit + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Financed</td><td>" + vars.financedAmount + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Installments</td><td>" + vars.installments + " × " + vars.installmentAmount + " (" + vars.frequency + ")</td></tr>" +
    "</table>" +
    "<p>We'll remind you before each installment is due.</p>"
  return q.enqueueEmail(app, {
    recipient: email,
    recipientName: customer.getString("name"),
    template: "financing_activated",
    category: "sales",
    priority: "high",
    payload: { subject: "Your Nairobi PowerBikes financing plan", body, vars },
    idempotencyKey: "financing-activated:" + finance.id,
    relatedType: "financing",
    relatedId: finance.id,
  })
}

// --- New sale admin alert ---
function saleNewAdmin(app, sale) {
  const t = tplMod()
  const customerId = sale.getString("customer")
  let customerName = "Walk-in"
  if (customerId) {
    try { customerName = app.findRecordById("users", customerId).getString("name") || customerName } catch (e) {}
  }
  const bikeName = (() => { try { return app.findRecordById("motorcycles", sale.getString("motorcycle")).getString("name") } catch (e) { return "Motorcycle" } })()
  const vars = baseVars(app, {
    customerName,
    motorcycleName: bikeName,
    totalPayable: t.money(sale.get("total_payable")),
    amountPaid: t.money(sale.get("amount_paid")),
    outstandingBalance: t.money(sale.get("outstanding")),
    paymentMethod: sale.getString("payment_method") || "",
    saleReference: sale.id || "",
  })
  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>New sale</h2>" +
    "<p>A new sale was recorded:</p>" +
    "<table role='presentation' width='100%' cellpadding='6' cellspacing='0' style='background:#1a1a1f;border:1px solid #26262b;border-radius:12px;margin:12px 0;font-size:13px;color:#c9c9d1;'>" +
    "<tr><td style='color:#8b8b94;'>Customer</td><td>" + vars.customerName + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Motorcycle</td><td>" + vars.motorcycleName + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Total</td><td>" + vars.totalPayable + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Paid</td><td>" + vars.amountPaid + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Outstanding</td><td>" + vars.outstandingBalance + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Method</td><td>" + vars.paymentMethod + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Reference</td><td>" + vars.saleReference + "</td></tr>" +
    "</table>"
  return enqueueAdminRole(app, "admin", {
    template: "sale_new_admin",
    category: "sales",
    priority: "high",
    payload: { subject: "New sale: " + vars.customerName + " — " + vars.motorcycleName, body, vars },
    idempotencyKey: "sale-new-admin:" + sale.id,
    relatedType: "sale",
    relatedId: sale.id,
  })
}

// --- New payment admin alert ---
function paymentNewAdmin(app, payment, sale) {
  const t = tplMod()
  let customerName = "Customer"
  if (sale) {
    const customerId = sale.getString("customer")
    if (customerId) {
      try { customerName = app.findRecordById("users", customerId).getString("name") || customerName } catch (e) {}
    }
  }
  const bikeName = sale ? (() => { try { return app.findRecordById("motorcycles", sale.getString("motorcycle")).getString("name") } catch (e) { return "Motorcycle" } })() : "Sale"
  const vars = baseVars(app, {
    customerName,
    motorcycleName: bikeName,
    amountReceived: t.money(payment.get("amount")),
    paymentMethod: payment.getString("payment_method") || "",
    paymentReference: payment.getString("reference") || "",
  })
  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>Payment received</h2>" +
    "<p>A payment was recorded:</p>" +
    "<table role='presentation' width='100%' cellpadding='6' cellspacing='0' style='background:#1a1a1f;border:1px solid #26262b;border-radius:12px;margin:12px 0;font-size:13px;color:#c9c9d1;'>" +
    "<tr><td style='color:#8b8b94;'>Customer</td><td>" + vars.customerName + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Motorcycle</td><td>" + vars.motorcycleName + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Amount</td><td style='color:#10b981;'>" + vars.amountReceived + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Method</td><td>" + vars.paymentMethod + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Reference</td><td>" + vars.paymentReference + "</td></tr>" +
    "</table>"
  return enqueueAdminRole(app, "admin", {
    template: "payment_new_admin",
    category: "payments",
    priority: "high",
    payload: { subject: "Payment received — " + vars.amountReceived, body, vars },
    idempotencyKey: "payment-new-admin:" + payment.id,
    relatedType: "payment",
    relatedId: payment.id,
  })
}

module.exports = {
  bookingReceived,
  bookingNewAdmin,
  bookingStatusChanged,
  saleConfirmation,
  saleNewAdmin,
  paymentReceipt,
  paymentNewAdmin,
  financingActivated,
  enqueueAdminRole,
}
