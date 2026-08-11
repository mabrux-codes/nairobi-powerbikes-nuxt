/// Marketing consent + preference helpers.
///
/// Separates transactional from marketing sends:
///  - transactional → always allowed (queue directly)
///  - marketing     → requires an opted-in subscriber record AND the matching
///                    per-category preference. Every marketing send carries
///                    unsubscribe + preferences links in the footer.

const tplMod = () => require(__hooks + "/lib/email/templates.js")
const queueMod = () => require(__hooks + "/lib/email/queue.js")

const PREFS_CATEGORIES = {
  promotions: "promotions",
  newMotorcycles: "newMotorcycles",
  new_bikes: "newMotorcycles",
  blog: "blog",
  offers: "offers",
  wishlist: "wishlistAlerts",
  restock: "restockAlerts",
}

function siteBase(app) {
  const site = String(app.settings().meta.appURL || "https://www.nairobi-powerbikes.co.ke").replace(/\/+$/, "")
  // Never deliver local/dev hosts — unsubscribe & preferences links must be
  // publicly reachable no matter where the queue node runs.
  const isLocal = /^(?:https?:\/\/)?(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(?::\d+)?(?:\/|$)/i.test(site)
  return isLocal ? "https://www.nairobi-powerbikes.co.ke" : site
}

function subscriberOf(app, email) {
  const e = String(email || "").trim().toLowerCase()
  if (!e) return null
  try {
    const found = app.findRecordsByFilter("subscribers", "email = {:e}", "", 1, 0, { e })
    return found.length > 0 ? found[0] : null
  } catch (err) { return null }
}

function preferencesOf(app, sub) {
  try {
    const user = sub ? sub.getString("customer") : ""
    const email = sub ? sub.getString("email") : ""
    let found = []
    if (user) {
      found = app.findRecordsByFilter("email_preferences", "user = {:u}", "", 1, 0, { u: user })
    }
    if (found.length === 0 && email) {
      found = app.findRecordsByFilter("email_preferences", "email = {:e}", "", 1, 0, { e: email })
    }
    if (found.length === 0) return null
    const p = found[0]
    return {
      marketing: p.getBool("marketing"),
      promotions: p.getBool("promotions"),
      newMotorcycles: p.getBool("newMotorcycles"),
      blog: p.getBool("blog"),
      offers: p.getBool("offers"),
      wishlistAlerts: p.getBool("wishlistAlerts"),
      restockAlerts: p.getBool("restockAlerts"),
    }
  } catch (err) { return null }
}

/// Can this recipient receive a marketing email of this campaign category?
function isAllowed(app, email, campaignCategory) {
  const sub = subscriberOf(app, email)
  if (!sub) return true // no record → not known to have opted out
  if (sub.getString("status") !== "subscribed" || !sub.getBool("marketingConsent")) return false
  const prefs = preferencesOf(app, sub)
  if (!prefs) return true
  const key = PREFS_CATEGORIES[campaignCategory || "promotions"]
  if (prefs.marketing === false) return false
  if (key && prefs[key] === false) return false
  return true
}

function ensureToken(app, sub) {
  let token = sub.getString("unsubscribeToken")
  if (!token) {
    const chars = "abcdef0123456789"
    token = ""
    for (let i = 0; i < 24; i++) token += chars[Math.floor(Math.random() * chars.length)]
    try {
      sub.set("unsubscribeToken", token)
      app.save(sub)
    } catch (e) {}
  }
  return token
}

function marketingVars(app, sub, extra) {
  const t = tplMod()
  const site = siteBase(app)
  const vars = t.deepMergeVars(t.DEFAULT_VARS(app), extra || {})
  if (sub) {
    const token = ensureToken(app, sub)
    vars.unsubscribeUrl = site + "/unsubscribe?token=" + encodeURIComponent(token)
    vars.preferencesUrl = site + "/email-preferences?token=" + encodeURIComponent(token)
    vars.unsubLink = vars.unsubscribeUrl
    vars.prefsLink = vars.preferencesUrl
  } else {
    const email = String(sub ? sub.getString("email") : (extra && extra.email) || "").trim()
    vars.unsubscribeUrl = site + "/unsubscribe?email=" + encodeURIComponent(email)
    vars.preferencesUrl = site + "/email-preferences?email=" + encodeURIComponent(email)
    vars.unsubLink = vars.unsubscribeUrl
    vars.prefsLink = vars.preferencesUrl
  }
  return vars
}

/**
 * Full marketing send pipeline: consent gate → branded vars + footer →
 * low-priority queue entry.
 */
function enqueueMarketing(app, opts) {
  const q = queueMod()
  const t = tplMod()
  const email = String(opts.recipient || "").trim().toLowerCase()
  if (!email || email.indexOf("@") < 0) return { ok: false, reason: "invalid-recipient" }
  const campaignCategory = opts.campaignCategory || opts.category || "promotions"
  if (!isAllowed(app, email, campaignCategory)) {
    return { ok: true, enqueued: false, reason: "no-consent" }
  }
  const sub = subscriberOf(app, email)
  const name = opts.recipientName || (sub ? (sub.getString("name") || sub.getString("firstName") || "") : "")
  const vars = marketingVars(app, sub, t.deepMergeVars({}, opts.vars || {}))
  vars.customerName = vars.customerName || name || email
  vars.firstName = vars.firstName || String(vars.customerName).split(" ")[0] || ""
  return q.enqueueEmail(app, {
    recipient: email,
    recipientName: name,
    template: opts.template,
    category: opts.category || "marketing",
    priority: ["low", "normal", "high"].indexOf(opts.priority) >= 0 ? opts.priority : "low",
    payload: {
      subject: opts.subject,
      body: "",
      vars,
    },
    idempotencyKey: opts.idempotencyKey,
    relatedType: opts.relatedType,
    relatedId: opts.relatedId,
  })
}

/// Resolve the recipients for a campaign audience + category (consent-gated).
function audienceFor(app, audience, campaignCategory) {
  const out = []
  const push = (r) => {
    const email = r.getString("email")
    if (!email || email.indexOf("@") < 0) return
    if (!isAllowed(app, email, campaignCategory)) return
    out.push({
      email,
      name: r.getString("name") || r.getString("firstName") || "",
      sub: r.getString("unsubscribeToken") ? r : subscriberOf(app, email),
    })
  }
  if (audience === "customers") {
    const users = app.findRecordsByFilter("users", "role = {:r} && status != {:s}", "", 2000, 0, { r: "customer", s: "inactive" })
    for (const u of users) push({
      email: u.getString("email"),
      name: u.getString("name"),
      marketingConsent: true,
      status: "subscribed",
      id: u.id,
      getString: (f) => u.getString(f),
      getBool: () => true,
    })
    return out
  }
  const subs = app.findRecordsByFilter("subscribers", "status = {:s} && marketingConsent = true", "", 2000, 0, { s: "subscribed" })
  for (const s of subs) push(s)
  return out
}

/// Bulk broadcast to all consented subscribers for a campaign category.
/// opts: { template, campaignCategory, subject, vars, idempotencyKey,
///         relatedType, relatedId, priority, category }
function broadcastMarketing(app, opts) {
  const t = tplMod()
  const subs = app.findRecordsByFilter("subscribers", "status = {:s} && marketingConsent = true", "", 2000, 0, { s: "subscribed" })
  let sent = 0
  const seen = {}
  for (const s of subs) {
    const email = String(s.getString("email") || "").trim().toLowerCase()
    if (!email || seen[email]) continue
    seen[email] = 1
    const res = enqueueMarketing(app, {
      recipient: email,
      recipientName: s.getString("name") || s.getString("firstName") || "",
      template: opts.template,
      campaignCategory: opts.campaignCategory,
      category: opts.category || "marketing",
      priority: opts.priority || "low",
      subject: opts.subject,
      vars: opts.vars || {},
      idempotencyKey: opts.idempotencyKey ? opts.idempotencyKey + ":" + email : "",
      relatedType: opts.relatedType,
      relatedId: opts.relatedId,
    })
    if (res.ok && res.enqueued) sent++
  }
  return { enqueued: sent }
}

module.exports = {
  PREFS_CATEGORIES, isAllowed, subscriberOf, preferencesOf, marketingVars, enqueueMarketing, audienceFor, siteBase, broadcastMarketing,
}