/// Transactional email builders for bookings, test rides, sales, payments,
/// financing and stock reminders. Required inside PB JSVM hook callbacks.
///
/// Builders only assemble template keys + vars; rendering is handled by the
/// branded design system in templates.js.

const tplMod = () => require(__hooks + "/lib/email/templates.js")
const queueMod = () => require(__hooks + "/lib/email/queue.js")

function baseVars(app, extra) {
  const t = tplMod()
  return t.deepMergeVars(t.DEFAULT_VARS(app), extra || {})
}

/// Resolve a motorcycle reference (relation id or model name string) into
/// product vars used by the email cards. Falls back to the raw name.
function resolveMotorcycle(app, value) {
  const t = tplMod()
  const out = { motorcycleName: String(value || "a Nairobi Powerbikes motorcycle") }
  const v = String(value || "").trim()
  if (!v) return out
  let bike = null
  try { bike = app.findRecordById("motorcycles", v) } catch (e) {}
  if (!bike) {
    try {
      const found = app.findRecordsByFilter("motorcycles", "name = {:n}", "", 1, 0, { n: v })
      if (found.length > 0) bike = found[0]
    } catch (e) {}
  }
  if (!bike) return out
  const price = bike.get("sale_price") || bike.get("price") || 0
  const imgs = bike.get("images")
  out.motorcycleName = bike.getString("name") || out.motorcycleName
  out.motorcyclePrice = t.money(price)
  if (bike.get("sale_price")) out.motorcycleOldPrice = t.money(bike.get("price"))
  try {
    const bid = bike.getString("brand")
    if (bid) out.motorcycleBrand = app.findRecordById("brands", bid).getString("name") || "Powerbikes"
  } catch (e) {}
  out.motorcycleUrl = (app.settings().meta.appURL || "") + "/motorcycles/" + (bike.getString("slug") || bike.id)
  if (Array.isArray(imgs) && imgs.length > 0) {
    try { out.motorcycleImage = app.files().getURL(bike, imgs[0], { thumb: "800x0" }) } catch (e) {}
  }
  return out
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

function bookingPayload(app, b, product) {
  const t = tplMod()
  const isTestRide = b.getString("type") === "test_ride"
  return Object.assign({
    bookingType: isTestRide ? "test_ride" : "service",
    bookingReference: (isTestRide ? "PB-TR-" : "PB-SVC-") + String(b.id || "").slice(-6).toUpperCase(),
    customerName: b.getString("name") || "",
    firstName: (b.getString("name") || "").split(" ")[0],
    serviceType: b.getString("service_type") || "",
    bookingDate: b.getString("preferred_date") || "",
    bookingTime: b.getString("preferred_time") || "",
    branchName: b.getString("branch") || "Main Branch",
    bookingStatus: b.getString("status") || "pending",
    notes: b.getString("description") || b.getString("notes") || "",
    bookingUrl: (app.settings().meta.appURL || "") + (isTestRide ? "/dashboard/my-test-rides" : "/dashboard/my-bookings"),
    saleUrl: (app.settings().meta.appURL || "") + "/dashboard",
    financeUrl: (app.settings().meta.appURL || "") + "/dashboard",
  }, product || {})
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

function enqueueBooking(app, b, template, category, subject, idemKey) {
  const q = queueMod()
  const t = tplMod()
  const isTestRide = b.getString("type") === "test_ride"
  const product = resolveMotorcycle(app, b.getString("motorcycle"))
  const vars = baseVars(app, bookingPayload(app, b, product))
  const recipient = bookingRecipient(b)
  if (!recipient) return { ok: false, reason: "no-recipient" }
  return q.enqueueEmail(app, {
    recipient,
    recipientName: b.getString("name") || "",
    template,
    category,
    priority: "high",
    payload: { subject, body: "", vars },
    idempotencyKey: idemKey,
    relatedType: "service_booking",
    relatedId: b.id,
  })
}

// --- Service booking / test ride received (customer) ---
function bookingReceived(app, b) {
  const t = tplMod()
  const isTestRide = b.getString("type") === "test_ride"
  const key = t.bookingTemplateKey("pending", isTestRide)
  return enqueueBooking(
    app, b, key, isTestRide ? "test_rides" : "bookings",
    (isTestRide ? "Test ride" : "Booking") + " request received — " + (b.getString("name") || ""),
    "booking-received:" + b.id,
  )
}

// --- Admin notified of a new booking ---
function bookingNewAdmin(app, b) {
  const t = tplMod()
  const isTestRide = b.getString("type") === "test_ride"
  const product = resolveMotorcycle(app, b.getString("motorcycle"))
  const vars = baseVars(app, bookingPayload(app, b, product))
  const subject = "New " + (isTestRide ? "test ride" : "booking") + ": " + vars.customerName + " — " + vars.motorcycleName
  return enqueueAdminRole(app, "admin", {
    template: "booking_new_admin",
    category: "bookings",
    priority: "high",
    payload: { subject, body: "", vars },
    idempotencyKey: "booking-new-admin:" + b.id,
    relatedType: "service_booking",
    relatedId: b.id,
  })
}

// --- Booking / test ride status changed (customer) ---
function bookingStatusChanged(app, b, oldStatus) {
  const t = tplMod()
  const status = b.getString("status") || "pending"
  const isTestRide = b.getString("type") === "test_ride"
  const key = t.bookingTemplateKey(status, isTestRide)
  const label = String(status).replace(/_/g, " ").toUpperCase()
  return enqueueBooking(
    app, b, key, isTestRide ? "test_rides" : "bookings",
    "Your " + (isTestRide ? "test ride" : "booking") + " is now " + label.toLowerCase(),
    "booking-status:" + b.id + ":" + status,
  )
}

// --- Sale confirmation (customer) ---
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
  const product = resolveMotorcycle(app, sale.getString("motorcycle"))
  const vars = baseVars(app, Object.assign({
    customerName: customer.getString("name") || customer.getString("email"),
    firstName: (customer.getString("name") || "").split(" ")[0],
    saleReference: "PB-SALE-" + String(sale.id || "").slice(-6).toUpperCase(),
    amountReceived: t.money(sale.get("amount_paid")),
    amountPaid: t.money(sale.get("amount_paid")),
    outstandingBalance: t.money(sale.get("outstanding")),
    totalPayable: t.money(sale.get("total_payable")),
    paymentMethod: sale.getString("payment_method") || "",
    saleDate: (sale.getString("sale_date") || sale.getString("created") || "").slice(0, 10),
    saleUrl: (app.settings().meta.appURL || "") + "/dashboard",
  }, product))
  return q.enqueueEmail(app, {
    recipient: email,
    recipientName: customer.getString("name"),
    template: "sale_confirmation",
    category: "sales",
    priority: "high",
    payload: { subject: "Your new ride awaits — " + vars.motorcycleName, body: "", vars },
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
  const product = resolveMotorcycle(app, sale.getString("motorcycle"))
  const vars = baseVars(app, Object.assign({
    customerName: customer.getString("name") || customer.getString("email"),
    firstName: (customer.getString("name") || "").split(" ")[0],
    amountReceived: t.money(payment.get("amount")),
    amountPaid: t.money(sale.get("amount_paid")),
    outstandingBalance: t.money(sale.get("outstanding")),
    totalPayable: t.money(sale.get("total_payable")),
    paymentMethod: payment.getString("payment_method") || "",
    paymentReference: payment.getString("reference") || "—",
    paymentDate: (payment.getString("created") || "").slice(0, 10),
    saleReference: "PB-SALE-" + String(sale.id || "").slice(-6).toUpperCase(),
    saleUrl: (app.settings().meta.appURL || "") + "/dashboard",
  }, product))
  return q.enqueueEmail(app, {
    recipient: email,
    recipientName: customer.getString("name"),
    template: "payment_receipt",
    category: "payments",
    priority: "high",
    payload: { subject: "Payment received — " + vars.amountReceived, body: "", vars },
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
  const product = resolveMotorcycle(app, sale.getString("motorcycle"))
  const vars = baseVars(app, Object.assign({
    customerName: customer.getString("name") || customer.getString("email"),
    firstName: (customer.getString("name") || "").split(" ")[0],
    financedAmount: t.money(finance.get("amount_financed")),
    deposit: t.money(finance.get("deposit")),
    installments: String(finance.getInt("installments") || 0),
    frequency: finance.getString("frequency") || "monthly",
    installmentAmount: t.money(finance.get("installment_amount")),
    totalPayable: t.money(finance.get("total_payable")),
    provider: finance.getString("provider") || "Nairobi Powerbikes",
    financeReference: finance.getString("finance_reference") || "PB-FIN-" + String(finance.id || "").slice(-6).toUpperCase(),
    financeUrl: (app.settings().meta.appURL || "") + "/dashboard",
  }, product))
  return q.enqueueEmail(app, {
    recipient: email,
    recipientName: customer.getString("name"),
    template: "financing_activated",
    category: "sales",
    priority: "high",
    payload: { subject: "Your Nairobi PowerBikes financing plan", body: "", vars },
    idempotencyKey: "financing-activated:" + finance.id,
    relatedType: "financing",
    relatedId: finance.id,
  })
}

// --- Financing status change (declined / completed) ---
function financingStatusChanged(app, finance, sale, oldStatus) {
  const status = finance.getString("status") || ""
  if (status === oldStatus) return { ok: false, reason: "no-change" }
  if (status !== "completed" && status.indexOf("declin") < 0 && status !== "rejected" && status !== "defaulted") return { ok: false, reason: "not-notified" }
  const q = queueMod()
  const t = tplMod()
  const customerId = sale ? sale.getString("customer") : ""
  if (!customerId) return { ok: false, reason: "no-customer" }
  let customer = null
  try { customer = app.findRecordById("users", customerId) } catch (e) {}
  if (!customer) return { ok: false, reason: "no-customer" }
  const email = customer.getString("email")
  if (!email) return { ok: false, reason: "no-email" }
  const product = resolveMotorcycle(app, sale.getString("motorcycle"))
  const done = status === "completed"
  const vars = baseVars(app, Object.assign({
    customerName: customer.getString("name") || customer.getString("email"),
    firstName: (customer.getString("name") || "").split(" ")[0],
    financedAmount: t.money(finance.get("amount_financed")),
    totalPayable: t.money(finance.get("total_payable")),
    financeUrl: (app.settings().meta.appURL || "") + "/dashboard",
  }, product))
  return q.enqueueEmail(app, {
    recipient: email,
    recipientName: customer.getString("name"),
    template: done ? "financing_completed" : "financing_declined",
    category: "finance",
    priority: "high",
    payload: { subject: done ? "You own it outright!" : "An update on your financing application", body: "", vars },
    idempotencyKey: "financing-status:" + finance.id + ":" + status,
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
  const product = resolveMotorcycle(app, sale.getString("motorcycle"))
  const vars = baseVars(app, Object.assign({
    customerName,
    amountReceived: t.money(sale.get("amount_paid")),
    amountPaid: t.money(sale.get("amount_paid")),
    outstandingBalance: t.money(sale.get("outstanding")),
    totalPayable: t.money(sale.get("total_payable")),
    paymentMethod: sale.getString("payment_method") || "",
    saleReference: "PB-SALE-" + String(sale.id || "").slice(-6).toUpperCase(),
  }, product))
  return enqueueAdminRole(app, "admin", {
    template: "sale_new_admin",
    category: "sales",
    priority: "high",
    payload: { subject: "New sale: " + vars.customerName + " — " + vars.motorcycleName, body: "", vars },
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
  const product = sale ? resolveMotorcycle(app, sale.getString("motorcycle")) : {}
  const vars = baseVars(app, Object.assign({
    customerName,
    amountReceived: t.money(payment.get("amount")),
    paymentMethod: payment.getString("payment_method") || "",
    paymentReference: payment.getString("reference") || "—",
  }, product))
  return enqueueAdminRole(app, "admin", {
    template: "payment_new_admin",
    category: "payments",
    priority: "high",
    payload: { subject: "Payment received — " + vars.amountReceived, body: "", vars },
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
  financingStatusChanged,
  enqueueAdminRole,
  resolveMotorcycle,
}