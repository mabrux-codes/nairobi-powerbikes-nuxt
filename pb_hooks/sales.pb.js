/// Sales & inventory hooks (PocketBase JSVM)
/// Handlers run in isolated contexts, so helpers live in pb_hooks/lib/sales_utils.js
///
/// Responsibilities:
///  - Normalize sale numbers and derive totals on create/update.
///  - Reserve stock for `reserved` sales (reserved_hold), release on exit.
///  - Atomic stock deduction when a sale becomes stock-deducting
///    (confirmed/financed/partially_paid/fully_paid/completed), guarded by
///    the `stock_deducted` flag so it happens exactly once.
///  - Stock restore on cancel (only if it was deducted), with audit rows.
///  - Payments: validate + dedupe, recompute amount_paid/outstanding, and
///    sync the sale status; notify the customer on every new payment.
///  - Financing: validate sums, tag the sale as financing, deduce stock on
///    activation via the sale update handler.
///  - Role notifications: new sale / payment / financing to the customer and
///    stock-out alerts to admins.
///  - Audit: every stock change writes an inventory_transactions record.

// ---------------------------------------------------------------------------
// SALES
// ---------------------------------------------------------------------------

onRecordCreateRequest((e) => {
  const utils = require(__hooks + "/lib/sales_utils.js")
  const r = e.record
  const quantity = Math.max(1, Math.round(utils.num(r.get("quantity"))))
  r.set("quantity", quantity)
  const original = utils.money(r.get("original_price"))
  const discount = utils.money(r.get("unit_discount"))
  const extra = utils.money(r.get("additional_charges"))
  if (r.get("unit_price") === null || r.get("unit_price") === undefined || r.get("unit_price") === "") {
    r.set("unit_price", original)
  }
  const unitPrice = utils.money(r.get("unit_price"))
  r.set("original_price", original)
  r.set("unit_discount", discount)
  r.set("additional_charges", extra)
  r.set("unit_price", unitPrice)
  r.set("sale_value", Math.round(unitPrice * quantity * 100) / 100)
  r.set("total_payable", Math.round((unitPrice * quantity + extra) * 100) / 100)
  r.set("amount_paid", utils.num(r.get("amount_paid")))
  r.set("outstanding", Math.max(0, Math.round((utils.money(r.get("total_payable")) - utils.num(r.get("amount_paid"))) * 100) / 100))
  if (!r.getString("sale_date")) {
    r.set("sale_date", new Date().toISOString())
  }
  e.next()
}, "sales")

onRecordUpdateRequest((e) => {
  const utils = require(__hooks + "/lib/sales_utils.js")
  const r = e.record
  const prev = e.app.findRecordById("sales", r.id)
  const prevStatus = prev.getString("status")
  const prevHold = prev.getBool("reserved_hold")
  const status = r.getString("status") || prevStatus
  const hold = r.getBool("reserved_hold")

  // price edits before stock was deducted are safe to renormalize
  if (!prev.getBool("stock_deducted")) {
    const quantity = Math.max(1, Math.round(utils.num(r.get("quantity"))))
    r.set("quantity", quantity)
    const original = utils.money(r.get("original_price"))
    const discount = utils.money(r.get("unit_discount"))
    const extra = utils.money(r.get("additional_charges"))
    const unitPrice = utils.money(r.get("unit_price") || original)
    r.set("original_price", original)
    r.set("unit_discount", discount)
    r.set("additional_charges", extra)
    r.set("unit_price", unitPrice)
    r.set("sale_value", Math.round(unitPrice * quantity * 100) / 100)
    r.set("total_payable", Math.round((unitPrice * quantity + extra) * 100) / 100)
  }

  // reservation lifecycle
  if (prevHold && (!hold || status !== "reserved")) {
    utils.applyReservation(e.app, prev, -Math.max(1, Math.round(utils.num(prev.get("quantity")))))
  }
  if (hold && status === "reserved" && !prevHold) {
    utils.applyReservation(e.app, r, Math.max(1, Math.round(utils.num(r.get("quantity")))))
  }

  // stock deducting transitions (exactly once)
  const willDeductNow = utils.isDeducting(status) && !prev.getBool("stock_deducted")
  if (willDeductNow) {
    utils.deductStock(e.app, r, utils.uidOf(e.requestInfo().auth || r.get("sold_by")))
    r.set("stock_deducted", true)
    r.set("reserved_hold", false)
  }

  // cancellation restores stock
  const cancelledNow = status === "cancelled" && prevStatus !== "cancelled"
  const restoreNow = cancelledNow && prev.getBool("stock_deducted")
  if (restoreNow) {
    utils.restoreStock(e.app, prev)
    r.set("stock_deducted", false)
  }

  // keep the sold-units counter exact (flag not committed yet -> pass delta)
  if (r.getString("motorcycle") && (willDeductNow || restoreNow)) {
    const qty = Math.max(1, Math.round(utils.num(r.get("quantity"))))
    utils.recomputeUnitsSold(e.app, r.getString("motorcycle"), willDeductNow ? qty : -qty)
  }

  if (cancelledNow && prevHold) {
    utils.applyReservation(e.app, prev, -Math.max(1, Math.round(utils.num(prev.get("quantity")))))
  }

  // customer notifications on lifecycle transitions
  if (cancelledNow) {
    utils.notifyCustomer(e.app, r, {
      type: "sale",
      title: "Purchase cancelled",
      message: "Your purchase of " + utils.motorcycleName(e.app, r) + " was cancelled" + (r.getString("cancel_reason") ? " (" + r.getString("cancel_reason") + ")" : "") + ".",
      link: "/dashboard/sales-inventory",
    })
  } else if (willDeductNow && (status === "confirmed" || status === "financed")) {
    utils.notifyCustomer(e.app, r, {
      type: "sale",
      title: status === "financed" ? "Purchase financed — confirmed" : "Purchase confirmed",
      message: "Your purchase of " + utils.motorcycleName(e.app, r) + " is confirmed. Thank you for shopping with Nairobi PowerBikes!",
      link: "/dashboard/sales-inventory",
    })
  }

  e.next()
}, "sales")

// ---------------------------------------------------------------------------
// PAYMENTS
// ---------------------------------------------------------------------------

onRecordCreateRequest((e) => {
  const utils = require(__hooks + "/lib/sales_utils.js")
  const r = e.record
  const saleId = r.getString("sale")
  if (!saleId) throw new BadRequestError("A sale is required.")
  try {
    const sale = e.app.findRecordById("sales", saleId)
    const status = sale.getString("status")
    if (status === "cancelled" || status === "draft") {
      throw new BadRequestError("Payments cannot be recorded for a " + status + " sale.")
    }
    const reference = String(r.getString("reference") || "").trim()
    r.set("reference", reference)
    const amount = utils.money(r.get("amount"))
    if (amount <= 0) throw new BadRequestError("Payment amount must be greater than zero.")
    r.set("amount", amount)
    const method = r.getString("payment_method")
    if (!r.getString("payment_date")) {
      r.set("payment_date", new Date().toISOString())
    }
    if (reference && method) {
      const dupes = e.app.findRecordsByFilter("payments", "sale = {:s} && reference = {:r} && payment_method = {:m}", "", 1, 0, { s: saleId, r: reference, m: method })
      if (dupes.length > 0) throw new BadRequestError("A payment with this reference and method already exists for this sale.")
    }
  } catch (err) {
    if (err instanceof BadRequestError) throw err
    throw new BadRequestError("Sale not found.")
  }
  r.set("recorded_by", utils.uidOf(e.requestInfo().auth))
  e.next()
}, "payments")

onRecordAfterCreateSuccess((e) => {
  const utils = require(__hooks + "/lib/sales_utils.js")
  e.next()
  const saleId = e.record.getString("sale")
  try {
    const sale = e.app.findRecordById("sales", saleId)
    utils.syncSalePayments(e.app, saleId)
    const refreshed = e.app.findRecordById("sales", saleId)
    utils.notifyCustomer(e.app, refreshed, {
      type: "payment",
      title: "Payment received",
      message: "KSh " + Number(e.record.get("amount")).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " received for your purchase of " + utils.motorcycleName(e.app, refreshed) + ".",
      link: "/dashboard/sales-inventory",
    })
  } catch (err) { /* sale may have been removed */ }
}, "payments")

onRecordAfterUpdateSuccess((e) => {
  const utils = require(__hooks + "/lib/sales_utils.js")
  e.next()
  try {
    utils.syncSalePayments(e.app, e.record.getString("sale"))
  } catch (err) { /* sale missing */ }
}, "payments")

onRecordAfterDeleteSuccess((e) => {
  const utils = require(__hooks + "/lib/sales_utils.js")
  e.next()
  try {
    utils.syncSalePayments(e.app, e.record.getString("sale"))
  } catch (err) { /* sale missing */ }
}, "payments")

// ---------------------------------------------------------------------------
// FINANCING
// ---------------------------------------------------------------------------

onRecordCreateRequest((e) => {
  const utils = require(__hooks + "/lib/sales_utils.js")
  const r = e.record
  let sale = null
  try {
    sale = e.app.findRecordById("sales", r.getString("sale"))
  } catch (err) {
    throw new BadRequestError("A valid sale is required for financing.")
  }
  const status = sale.getString("status")
  if (status === "cancelled" || status === "draft") {
    throw new BadRequestError("Financing cannot be added to a " + status + " sale.")
  }
  const existing = e.app.findRecordsByFilter("financing", "sale = {:s}", "", 1, 0, { s: r.getString("sale") })
  if (existing.length > 0) throw new BadRequestError("This sale already has a financing plan.")
  const deposit = utils.money(r.get("deposit"))
  const financed = utils.money(r.get("amount_financed"))
  const interest = utils.money(r.get("interest_charges"))
  const installments = Math.max(1, Math.round(utils.num(r.get("installments"))))
  if (deposit <= 0 && financed <= 0) throw new BadRequestError("A deposit or financed amount is required.")
  r.set("deposit", deposit)
  r.set("amount_financed", financed)
  r.set("interest_charges", interest)
  r.set("installments", installments)
  r.set("total_payable", Math.round((financed + interest) * 100) / 100)
  if (!r.getString("start_date")) r.set("start_date", new Date().toISOString())
  if (!r.getString("status")) r.set("status", "active")

  // tag the sale as financing; internal app.save() does not trigger request
  // hooks, so when this activates the sale we must deduct stock here directly
  sale.set("payment_type", "financing")
  if (!utils.isDeducting(status)) {
    sale.set("status", "financed")
    utils.deductStock(e.app, sale, utils.uidOf(e.requestInfo().auth))
    sale.set("stock_deducted", true)
    sale.set("reserved_hold", false)
    utils.recomputeUnitsSold(e.app, sale.getString("motorcycle"), Math.max(1, Math.round(utils.num(sale.get("quantity")))))
  }
  e.app.save(sale)
  e.next()
}, "financing")

onRecordAfterCreateSuccess((e) => {
  const utils = require(__hooks + "/lib/sales_utils.js")
  e.next()
  try {
    const sale = e.app.findRecordById("sales", e.record.getString("sale"))
    utils.notifyCustomer(e.app, sale, {
      type: "finance",
      title: "Financing activated",
      message: "Your financing plan for " + utils.motorcycleName(e.app, sale) + " is active (" + e.record.getString("frequency") + " x" + e.record.getString("installments") + ").",
      link: "/dashboard/sales-inventory",
    })
  } catch (err) { /* sale missing */ }
}, "financing")

// ---------------------------------------------------------------------------
// INVENTORY TRANSACTIONS (audit) — direct writes must be consistent
// ---------------------------------------------------------------------------

onRecordCreateRequest((e) => {
  const utils = require(__hooks + "/lib/sales_utils.js")
  const r = e.record
  const mcid = r.getString("motorcycle")
  if (!mcid) throw new BadRequestError("Motorcycle is required.")
  const before = utils.num(r.get("quantity_before"))
  const change = utils.num(r.get("quantity_change"))
  const after = utils.num(r.get("quantity_after"))
  if (after !== before + change) throw new BadRequestError("quantity_after must equal quantity_before + quantity_change.")
  e.next()
}, "inventory_transactions")

