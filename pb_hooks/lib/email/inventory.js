/// Inventory email builders (restock waiting-list + wishlist restock).
/// Required inside PB JSVM hook callbacks. Consent gating lives in marketing.js;
/// rendering comes from the branded design system.

const tplMod = () => require(__hooks + "/lib/email/templates.js")
const marketingMod = () => require(__hooks + "/lib/email/marketing.js")
const txMod = () => require(__hooks + "/lib/email/transactional.js")

function emailForReminder(app, r) {
  let email = r.getString("email")
  const uid = r.getString("user")
  if (uid) {
    try {
      const u = app.findRecordById("users", uid)
      const ue = u.getString("email")
      if (ue) email = ue
    } catch (e) {}
  }
  return email || ""
}

/**
 * Detect a restock transition (old <= 0 -> new > 0) via the store cache and
 * email:
 *  - everyone on the waiting list for that motorcycle (action-based, high prio)
 *  - everyone with the motorcycle in their favourites (consent-gated wishlist)
 */
function handleRestockEmails(app, e, prevQty, newQty) {
  if (prevQty > 0 || newQty <= 0) return { ok: true, sent: 0 }
  const mkt = marketingMod()
  const tx = txMod()
  const t = tplMod()
  const bike = e.record
  const product = tx.resolveMotorcycle(app, bike.id)
  const name = product.motorcycleName || "your motorcycle"
  let sent = 0

  // 1) Waiting-list reminders (they explicitly asked to be told).
  const reminders = app.findRecordsByFilter("stock_reminders", "motorcycle = {:m} && status = {:s}", "", 500, 0, { m: bike.id, s: "active" })
  const emailed = {}
  for (const r of reminders) {
    const email = emailForReminder(app, r)
    if (!email || emailed[email]) continue
    emailed[email] = 1
    const uid = r.getString("user")
    const recipientName = r.getString("name") || ""
    const vars = Object.assign({}, product, {
      customerName: recipientName || email,
      firstName: (recipientName || email).split(" ")[0],
      stockCount: String(newQty),
    })
    const res = mkt.enqueueMarketing(app, {
      recipient: email,
      recipientName,
      template: "restock",
      campaignCategory: "restock",
      category: "inventory",
      priority: "high",
      subject: "Good news — " + name + " is back in stock",
      vars,
      idempotencyKey: "restock:" + bike.id + ":" + (uid || email),
      relatedType: "motorcycle",
      relatedId: bike.id,
    })
    if (res.ok && res.enqueued) sent++
  }

  // 2) Favourites (wishlist restock) — consent-gated via wishlistAlerts pref.
  const favs = app.findRecordsByFilter("favorites", "motorcycle = {:m}", "", 2000, 0, { m: bike.id })
  const favSeen = {}
  for (const f of favs) {
    const uid = f.getString("user")
    if (!uid || favSeen[uid]) continue
    favSeen[uid] = 1
    let email = ""
    try { email = app.findRecordById("users", uid).getString("email") } catch (err) {}
    if (!email) continue
    const res = mkt.enqueueMarketing(app, {
      recipient: email,
      template: "wishlist_restock",
      campaignCategory: "wishlist",
      category: "inventory",
      priority: "low",
      subject: "Your wishlist bike is back in stock — " + name,
      vars: Object.assign({}, product, {
        customerName: email,
        firstName: "",
        stockCount: String(newQty),
      }),
      idempotencyKey: "wishlist-restock:" + bike.id + ":" + uid,
      relatedType: "motorcycle",
      relatedId: bike.id,
    })
    if (res.ok && res.enqueued) sent++
  }

  return { ok: true, sent }
}

module.exports = { handleRestockEmails }