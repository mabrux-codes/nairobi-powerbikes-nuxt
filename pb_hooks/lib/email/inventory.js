/// Inventory email builders (restock notifications, wishlist).
/// Required inside PB JSVM hook callbacks.

const tplMod = () => require(__hooks + "/lib/email/templates.js")
const queueMod = () => require(__hooks + "/lib/email/queue.js")

/**
 * Detect a restock transition (old <= 0 -> new > 0) via the store cache and
 * email everyone on the waiting list for that motorcycle.
 */
function handleRestockEmails(app, e, prevQty, newQty) {
  if (prevQty > 0 || newQty <= 0) return { ok: true, sent: 0 }
  const t = tplMod()
  const q = queueMod()
  const bike = e.record
  const name = bike.getString("name") || "Motorcycle"
  const slug = bike.getString("slug") || bike.id
  const price = bike.get("sale_price") || bike.get("price") || 0
  const link = (app.settings().meta.appURL || "") + "/motorcycles/" + slug
  const imageUrl = (() => {
    try {
      const imgs = bike.get("images")
      if (Array.isArray(imgs) && imgs.length > 0) return app.files().getURL(bike, imgs[0])
      return ""
    } catch (err) { return "" }
  })()

  const vars = t.deepMergeVars(t.DEFAULT_VARS(app), {
    motorcycleName: name,
    motorcyclePrice: t.money(price),
    stockCount: String(newQty),
    motorcycleLink: link,
  })

  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>Good news — " + name + " is back in stock!</h2>" +
    (imageUrl ? "<img src='" + imageUrl + "' alt='" + name + "' style='width:100%;max-width:480px;border-radius:12px;margin:8px 0 16px;' />" : "") +
    "<p>Hi {{firstName}},</p>" +
    "<p>The motorcycle you were waiting for is available again.</p>" +
    "<table role='presentation' width='100%' cellpadding='6' cellspacing='0' style='background:#1a1a1f;border:1px solid #26262b;border-radius:12px;margin:12px 0;font-size:13px;color:#c9c9d1;'>" +
    "<tr><td style='color:#8b8b94;'>Motorcycle</td><td>" + name + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>Price</td><td style='color:#ef2a2a;'>" + t.money(price) + "</td></tr>" +
    "<tr><td style='color:#8b8b94;'>In stock</td><td style='color:#10b981;'>" + newQty + "</td></tr>" +
    "</table>" +
    t.buttonBlock("View motorcycle", link)

  const reminders = app.findRecordsByFilter("stock_reminders", "motorcycle = {:m} && status = {:s}", "", 500, 0, { m: bike.id, s: "active" })
  let sent = 0
  for (const r of reminders) {
    // Resolve the email: prefer the account's email, else the guest email.
    let email = r.getString("email")
    const uid = r.getString("user")
    if (uid) {
      try {
        const u = app.findRecordById("users", uid)
        const ue = u.getString("email")
        if (ue) email = ue
      } catch (err) {}
    }
    if (!email || email.indexOf("@") < 0) continue
    const fname = (r.getString("name") || "").split(" ")[0] || ""
    const varsFor = t.deepMergeVars(vars, { customerName: r.getString("name") || email, firstName: fname, email })
    const res = q.enqueueEmail(app, {
      recipient: email,
      recipientName: r.getString("name"),
      template: "restock_notification",
      category: "inventory",
      priority: "high",
      payload: { subject: "Good news — " + name + " is back in stock", body: t.substitute(body, varsFor), vars: varsFor },
      idempotencyKey: "restock:" + bike.id + ":" + (uid || email),
      relatedType: "motorcycle",
      relatedId: bike.id,
    })
    if (res.ok && res.enqueued) sent++
  }
  return { ok: true, sent }
}

module.exports = { handleRestockEmails }
