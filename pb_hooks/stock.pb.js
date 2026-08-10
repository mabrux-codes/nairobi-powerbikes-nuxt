/// Stock & arrival-reminder hooks (PocketBase JSVM)
/// Signature: onHook(handler, ...tags). ALL handlers must call e.next().
///
/// Handlers run in isolated contexts, so shared helpers live in
/// pb_hooks/lib/stock_utils.js and are required() inside each handler.
///
/// Responsibilities:
///  - Validate stock_quantity (whole numbers >= 0, no negatives/decimals).
///  - Derive the legacy `in_stock` boolean from stock_quantity so every
///    existing filter/flag keeps working without code changes.
///  - Detect restock events (0 -> >0): notify waiting customers.
///  - Detect stock-outs (>0 -> 0): reactivate notified reminders so customers
///    get notified again on a FUTURE restock.
///  - POST /api/stock/reminders: one-click subscribe (logged-in) / email
///    subscribe (guest) with dedupe + guest->account conversion.
///  - onRecordCreateRequest guard for any direct collection writes.

// --- validate + normalize stock on motorcycle create/update ---
onRecordCreateRequest((e) => {
  const utils = require(__hooks + "/lib/stock_utils.js")
  utils.applyStockToRecord(e.record, true)
  e.next()
}, "motorcycles")

onRecordUpdateRequest((e) => {
  const utils = require(__hooks + "/lib/stock_utils.js")
  let oldQty = null
  try {
    oldQty = e.app.findRecordById("motorcycles", e.record.id).get("stock_quantity")
  } catch (err) { /* record missing */ }
  utils.applyStockToRecord(e.record, false)
  const newQty = e.record.get("stock_quantity")
  if (oldQty !== null && Number(newQty) !== Number(oldQty)) {
    e.app.store().set("npb_stock_prev_" + e.record.id, JSON.stringify({ old: Number(oldQty), new: Number(newQty) }))
  }
  e.next()
}, "motorcycles")

// --- restock / stockout transitions ---
onRecordAfterUpdateSuccess((e) => {
  const cache = e.app.store().get("npb_stock_prev_" + e.record.id)
  e.app.store().remove("npb_stock_prev_" + e.record.id)
  e.next()
  if (!cache) return
  let prev = null
  try { prev = JSON.parse(cache) } catch (err) { return }
  const newQty = Number(e.record.get("stock_quantity") || 0)
  const utils = require(__hooks + "/lib/notif_utils.js")

  if (prev.old <= 0 && newQty > 0) {
    // RESTOCK: notify everyone currently waiting
    const name = e.record.getString("name") || "Motorcycle"
    const slug = e.record.getString("slug") || e.record.id
    const reminders = e.app.findRecordsByFilter("stock_reminders", 'motorcycle = {:m} && status = "active"', "", 500, 0, { m: e.record.id })
    for (const r of reminders) {
      const uid = r.getString("user")
      if (uid) {
        utils.createNotification(e.app, {
          type: "stock",
          user: uid,
          title: name + " is back in stock",
          message: "Good news! The " + name + " is back in stock. The motorcycle you requested an arrival reminder for is now available.",
          link: "/motorcycles/" + slug,
        })
      }
      r.set("status", "notified")
      r.set("notified_at", Date.now() / 1000)
      e.app.save(r)
    }
  } else if (prev.old > 0 && newQty <= 0) {
    // STOCK-OUT: re-arm previously notified reminders
    const reminders = e.app.findRecordsByFilter("stock_reminders", 'motorcycle = {:m} && status = "notified"', "", 500, 0, { m: e.record.id })
    for (const r of reminders) {
      r.set("status", "active")
      r.set("notified_at", "")
      e.app.save(r)
    }
  }
}, "motorcycles")

// clean the cached transition if the update failed
onRecordAfterUpdateError((e) => {
  e.app.store().remove("npb_stock_prev_" + e.record.id)
  e.next()
}, "motorcycles")

// --- subscribe endpoint: logged-in customers use their profile, others email ---
routerAdd("POST", "/api/stock/reminders", (c) => {
  const info = c.requestInfo()
  const auth = info.auth
  const body = info.body || {}
  const motorcycle = String(body.motorcycle || "")
  if (!motorcycle) return c.json(400, { message: "Motorcycle is required." })

  const bike = c.app.findRecordById("motorcycles", motorcycle)
  if (!bike) return c.json(404, { message: "Motorcycle not found." })

  const email = String(body.email || "").trim().toLowerCase()
  const utils = require(__hooks + "/lib/stock_utils.js")

  // guest path requires a valid email
  if (!auth) {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return c.json(400, { message: "Please provide a valid email address." })
    }
    const existing = utils.findReminder(c.app, motorcycle, "", email)
    if (existing.length > 0) {
      const rec = existing[0]
      if (rec.getString("status") === "cancelled") {
        rec.set("status", "active")
        rec.set("notified_at", "")
        c.app.save(rec)
      }
      return c.json(200, { ok: true, code: "already", id: rec.id })
    }
    const collection = c.app.findCollectionByNameOrId("stock_reminders")
    const rec = new Record(collection)
    rec.set("motorcycle", motorcycle)
    rec.set("email", email)
    rec.set("status", "active")
    c.app.save(rec)
    return c.json(200, { ok: true, code: "created", id: rec.id })
  }

  // authenticated (customer or admin)
  const uid = auth.id
  const createdEmail = String(auth.getString("email") || body.email || "").trim().toLowerCase()

  const mine = utils.findReminder(c.app, motorcycle, uid, "")
  if (mine.length > 0) {
    const rec = mine[0]
    if (rec.getString("status") === "cancelled") {
      rec.set("status", "active")
      rec.set("notified_at", "")
      c.app.save(rec)
    }
    return c.json(200, { ok: true, code: "already", id: rec.id })
  }

  // convert an existing guest (email) reminder into an account reminder
  const asGuest = utils.findReminder(c.app, motorcycle, "", createdEmail)
  if (asGuest.length > 0) {
    const rec = asGuest[0]
    rec.set("user", uid)
    rec.set("status", "active")
    rec.set("notified_at", "")
    c.app.save(rec)
    return c.json(200, { ok: true, code: "already", id: rec.id })
  }

  const collection = c.app.findCollectionByNameOrId("stock_reminders")
  const rec = new Record(collection)
  rec.set("motorcycle", motorcycle)
  rec.set("user", uid)
  rec.set("email", createdEmail)
  rec.set("status", "active")
  c.app.save(rec)
  return c.json(200, { ok: true, code: "created", id: rec.id })
})

// --- guard for any direct collection writes (defense in depth) ---
onRecordCreateRequest((e) => {
  const utils = require(__hooks + "/lib/stock_utils.js")
  const r = e.record
  const mcid = r.getString("motorcycle")
  if (!mcid) throw new BadRequestError("Motorcycle is required.")

  const email = String(r.getString("email") || "").trim().toLowerCase()
  r.set("email", email)
  const uid = r.getString("user")

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BadRequestError("Please provide a valid email address.")
  }

  if (uid) {
    const existing = e.app.findRecordsByFilter("stock_reminders", "motorcycle = {:m} && user = {:u}", "", 1, 0, { m: mcid, u: uid })
    if (existing.length > 0) throw new BadRequestError("You already have an arrival reminder for this motorcycle.")
    if (email) {
      const guest = e.app.findRecordsByFilter("stock_reminders", "motorcycle = {:m} && email = {:e} && user = \"\"", "", 1, 0, { m: mcid, e: email })
      if (guest.length > 0) {
        guest[0].set("user", uid)
        guest[0].set("status", "active")
        guest[0].set("notified_at", "")
        e.app.save(guest[0])
        throw new BadRequestError("You already have an arrival reminder for this motorcycle.")
      }
    }
  } else if (email) {
    const existing = e.app.findRecordsByFilter("stock_reminders", "motorcycle = {:m} && email = {:e}", "", 1, 0, { m: mcid, e: email })
    if (existing.length > 0) throw new BadRequestError("You already have an arrival reminder for this motorcycle.")
  }

  e.next()
}, "stock_reminders")