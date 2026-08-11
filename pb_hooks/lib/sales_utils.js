/// Shared helpers for the sales & inventory hooks (required() inside handlers
/// because hook callbacks run in isolated contexts).

const DEDUCTING_STATUSES = ["confirmed", "financed", "partially_paid", "fully_paid", "completed"]

function num(v) {
  if (v === null || v === undefined || v === "") return 0
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function money(v) {
  const n = num(v)
  return Math.max(0, Math.round(n * 100) / 100)
}

function isDeducting(status) {
  return DEDUCTING_STATUSES.indexOf(status || "") >= 0
}

function uidOf(record) {
  return record ? record.id : ""
}

/// Sum of all confirmed payments for a sale.
function sumPayments(app, saleId) {
  const recs = app.findRecordsByFilter("payments", "sale = {:s}", "", 500, 0, { s: saleId })
  let total = 0
  for (const p of recs) total += num(p.get("amount"))
  return Math.round(total * 100) / 100
}

/// Recompute amount_paid / outstanding on the sale and synchronize its status
/// when the payment totals no longer match the current stage.
function syncSalePayments(app, saleId) {
  const sale = app.findRecordById("sales", saleId)
  const paid = sumPayments(app, saleId)
  const total = money(sale.get("total_payable"))
  const outstanding = Math.max(0, Math.round((total - paid) * 100) / 100)
  sale.set("amount_paid", paid)
  sale.set("outstanding", outstanding)
  const status = sale.getString("status")
  if (outstanding <= 0 && status !== "cancelled" && status !== "draft") {
    sale.set("status", "fully_paid")
  } else if (!isDeducting(status) && status !== "cancelled") {
    if (paid <= 0) {
      sale.set("status", num(sale.get("quantity")) > 0 ? "pending" : "draft")
    } else {
      sale.set("status", "partially_paid")
    }
  } else if (status === "fully_paid" && outstanding > 0) {
    sale.set("status", "partially_paid")
  }
  app.save(sale)
  return { paid, outstanding }
}

/// Reserve (delta = +qty) or release (delta = -qty) stock on the motorcycle.
function applyReservation(app, sale, delta) {
  if (delta === 0) return
  const bike = app.findRecordById("motorcycles", sale.getString("motorcycle"))
  const reserved = Math.max(0, num(bike.get("reserved_quantity")) + delta)
  bike.set("reserved_quantity", reserved)
  app.save(bike)
}

/// Deduct stock for a sale entering a stock-deducting status. Throws
/// BadRequestError when the motorcycle has insufficient available stock.
/// Writes an audit record and alerts admins when the bike sells out.
/// NOTE: does not save the sale itself (the caller flips stock_deducted).
function deductStock(app, sale, performedById) {
  const bike = app.findRecordById("motorcycles", sale.getString("motorcycle"))
  const qty = Math.max(1, Math.round(num(sale.get("quantity"))))
  const available = num(bike.get("stock_quantity")) - num(bike.get("reserved_quantity"))
  if (available < qty) {
    throw new BadRequestError("Not enough stock available to confirm this sale.")
  }
  const before = num(bike.get("stock_quantity"))
  const after = before - qty
  bike.set("stock_quantity", after)
  bike.set("in_stock", after > 0)
  bike.set("units_sold", num(bike.get("units_sold")) + qty)
  app.save(bike)

  const tx = new Record(app.findCollectionByNameOrId("inventory_transactions"))
  tx.set("motorcycle", bike.id)
  tx.set("type", "sold")
  tx.set("quantity_before", before)
  tx.set("quantity_change", -qty)
  tx.set("quantity_after", after)
  tx.set("reason", "Sale " + sale.id + (sale.getString("status") ? " (" + sale.getString("status") + ")" : ""))
  tx.set("related_sale", sale.id)
  tx.set("performed_by", performedById || uidOf(sale.get("sold_by")))
  app.save(tx)

  if (after <= 0) {
    try {
      const name = bike.getString("name") || "A motorcycle"
      const notif = require(__hooks + "/lib/notif_utils.js")
      notif.broadcastToRole(app, "admin", {
        type: "stock",
        title: name + " is out of stock",
        message: name + " has just sold out (via sale " + sale.id + "). Adjust stock or order more units.",
        link: "/dashboard/sales-inventory",
      })
    } catch (err) { /* notifications are best-effort */ }
  }
  return { before, after, bike }
}

/// Restore stock for a cancelled sale (only when it was previously deducted).
/// NOTE: does not save the sale itself (the caller flips stock_deducted).
function restoreStock(app, sale) {
  const bike = app.findRecordById("motorcycles", sale.getString("motorcycle"))
  const qty = Math.max(1, Math.round(num(sale.get("quantity"))))
  const before = num(bike.get("stock_quantity"))
  const after = before + qty
  bike.set("stock_quantity", after)
  bike.set("in_stock", after > 0)
  bike.set("units_sold", Math.max(0, num(bike.get("units_sold")) - qty))
  app.save(bike)

  const tx = new Record(app.findCollectionByNameOrId("inventory_transactions"))
  tx.set("motorcycle", bike.id)
  tx.set("type", "correction")
  tx.set("quantity_before", before)
  tx.set("quantity_change", qty)
  tx.set("quantity_after", after)
  tx.set("reason", "Sale cancelled — stock restored (" + sale.id + ")")
  tx.set("related_sale", sale.id)
  tx.set("performed_by", uidOf(sale.get("sold_by")))
  app.save(tx)
  return { before, after, bike }
}

/// Derive units_sold from the live (non-cancelled, stock-deducted) sales so
/// the counter can never drift from the source of truth. inFlightDelta covers
/// the record being saved right now (whose flag is not committed yet).
function recomputeUnitsSold(app, motorcycleId, inFlightDelta) {
  let total = num(inFlightDelta)
  const recs = app.findRecordsByFilter("sales", 'motorcycle = {:m} && status != "cancelled" && status != "draft" && stock_deducted = true', "", 500, 0, { m: motorcycleId })
  for (const s of recs) total += Math.max(1, Math.round(num(s.get("quantity"))))
  const bike = app.findRecordById("motorcycles", motorcycleId)
  if (num(bike.get("units_sold")) !== total) {
    bike.set("units_sold", total)
    app.save(bike)
  }
  return total
}

function motorcycleName(app, sale) {
  try {
    const bike = app.findRecordById("motorcycles", sale.getString("motorcycle"))
    return bike.getString("name") || "Motorcycle"
  } catch (err) {
    return "Motorcycle"
  }
}

function notifyCustomer(app, sale, data) {
  const customer = sale.getString("customer")
  if (!customer) return
  const app2 = app
  const notif = require(__hooks + "/lib/notif_utils.js")
  notif.createNotification(app2, {
    type: data.type || "sale",
    user: customer,
    title: data.title,
    message: data.message,
    link: data.link || "",
  })
}

module.exports = {
  DEDUCTING_STATUSES,
  num,
  money,
  isDeducting,
  uidOf,
  sumPayments,
  syncSalePayments,
  applyReservation,
  deductStock,
  restoreStock,
  motorcycleName,
  recomputeUnitsSold,
  notifyCustomer,
}