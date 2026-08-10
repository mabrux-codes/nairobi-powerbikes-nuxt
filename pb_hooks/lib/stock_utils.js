/// Shared helpers for the stock hooks (loaded via require() inside each hook,
/// because hook callbacks run in isolated contexts).

function sanitizeStock(value) {
  if (value === null || value === undefined || value === "") return null
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n)) throw new BadRequestError("Stock quantity must be a number.")
  if (!Number.isInteger(n)) throw new BadRequestError("Stock quantity must be a whole number.")
  if (n < 0) throw new BadRequestError("Stock quantity cannot be negative.")
  return n
}

function applyStockToRecord(rec, isCreate) {
  const raw = rec.get("stock_quantity")
  if (raw === null || raw === undefined || raw === "") {
    if (isCreate) rec.set("stock_quantity", rec.getBool("in_stock") ? 10 : 0)
    return null
  }
  const q = sanitizeStock(raw)
  const derived = q > 0
  if (rec.getBool("in_stock") !== derived) {
    rec.set("in_stock", derived)
  }
  return q
}

function findReminder(app, motorcycle, uid, email) {
  const params = { m: motorcycle }
  let filter = "motorcycle = {:m}"
  if (uid) {
    filter += ' && user = {:u}'
    params.u = uid
  }
  if (email) {
    filter += ' && email = {:e}'
    params.e = email
  }
  return app.findRecordsByFilter("stock_reminders", filter, "", 1, 0, params)
}

module.exports = { sanitizeStock, applyStockToRecord, findReminder }