/// <reference path="../pb_data/types.d.ts" />

/// Marketing email infrastructure.
/// - Public unsubscribe + preference center endpoints (token or email, no login).
/// - Subscriber record sync on user registration / sign-in.
/// - Consent-gated admin campaign sends through the branded design system.

// --- Public unsubscribe (no login required) ---
routerAdd("GET", "/api/email/unsubscribe", (c) => {
  const info = c.requestInfo()
  const query = info.query || {}
  const token = String(query.token || "").trim()
  const email = String(query.email || "").trim().toLowerCase()
  if (!token && !email) return c.json(400, { message: "An unsubscribe token or email is required." })

  try {
    const marketing = require(__hooks + "/lib/email/marketing.js")
    let subscriber = token ? (() => {
      const found = $app.findRecordsByFilter("subscribers", "unsubscribeToken = {:t}", "", 1, 0, { t: token })
      return found.length > 0 ? found[0] : null
    })() : null
    if (!subscriber && email) subscriber = marketing.subscriberOf($app, email)

    if (!subscriber) {
      const col = $app.findCollectionByNameOrId("subscribers")
      subscriber = new Record(col)
      subscriber.set("email", email || "unknown")
      subscriber.set("status", "unsubscribed")
      subscriber.set("marketingConsent", false)
      $app.save(subscriber)
    } else {
      subscriber.set("status", "unsubscribed")
      subscriber.set("marketingConsent", false)
      $app.save(subscriber)
    }

    // Also flip the per-category preferences off.
    try {
      const prefs = marketing.preferencesOf($app, subscriber)
      if (!prefs) {
        const col = $app.findCollectionByNameOrId("email_preferences")
        const p = new Record(col)
        const uid = subscriber.getString("customer")
        if (uid) p.set("user", uid)
        p.set("email", subscriber.getString("email"))
        p.set("marketing", false)
        p.set("promotions", false)
        p.set("newMotorcycles", false)
        p.set("blog", false)
        p.set("offers", false)
        p.set("wishlistAlerts", false)
        p.set("restockAlerts", false)
        $app.save(p)
      }
    } catch (e) {}

    return c.json(200, {
      ok: true,
      email: subscriber.getString("email"),
      message: "You have been unsubscribed from Nairobi Powerbikes marketing emails.",
    })
  } catch (err) {
    return c.json(500, { message: (err && err.message) || "Unsubscribe failed." })
  }
})

// --- Resubscribe (clear the unsubscribe state) ---
routerAdd("POST", "/api/email/preferences/resubscribe", (c) => {
  const info = c.requestInfo()
  const body = info.body || {}
  const token = String(body.token || "").trim()
  const email = String(body.email || "").trim().toLowerCase()
  if (!token && !email) return c.json(400, { message: "A token or email is required." })
  const marketing = require(__hooks + "/lib/email/marketing.js")
  let subscriber = null
  if (token) {
    try {
      const found = $app.findRecordsByFilter("subscribers", "unsubscribeToken = {:t}", "", 1, 0, { t: token })
      if (found.length > 0) subscriber = found[0]
    } catch (e) {}
  }
  if (!subscriber && email) subscriber = marketing.subscriberOf($app, email)
  if (!subscriber) return c.json(404, { message: "Subscriber not found." })
  try {
    subscriber.set("status", "subscribed")
    subscriber.set("marketingConsent", true)
    subscriber.set("consentDate", new Date().toISOString())
    $app.save(subscriber)
    return c.json(200, { ok: true, message: "You are subscribed to Nairobi Powerbikes updates again." })
  } catch (err) {
    return c.json(500, { message: (err && err.message) || "Resubscribe failed." })
  }
})

// --- Get email preferences (public, token/email based; falls back to auth) ---
routerAdd("GET", "/api/email/preferences", (c) => {
  const info = c.requestInfo()
  const query = info.query || {}
  const marketing = require(__hooks + "/lib/email/marketing.js")

  let sub = null
  const token = String(query.token || "").trim()
  if (token) {
    try {
      const found = $app.findRecordsByFilter("subscribers", "unsubscribeToken = {:t}", "", 1, 0, { t: token })
      if (found.length > 0) sub = found[0]
    } catch (e) {}
  }
  const auth = info.auth
  if (!sub && auth && auth.getString("email")) sub = marketing.subscriberOf($app, auth.getString("email"))
  if (!sub) {
    const email = String(query.email || "").trim().toLowerCase()
    if (email) sub = marketing.subscriberOf($app, email)
  }
  if (!sub) return c.json(404, { message: "No subscription found for that link." })

  const prefs = marketing.preferencesOf($app, sub)
  return c.json(200, {
    ok: true,
    email: sub.getString("email"),
    name: sub.getString("name") || sub.getString("firstName") || "",
    status: sub.getString("status"),
    marketingConsent: sub.getBool("marketingConsent"),
    prefs: prefs || {
      marketing: sub.getBool("marketingConsent"),
      promotions: true,
      newMotorcycles: true,
      blog: true,
      offers: true,
      wishlistAlerts: true,
      restockAlerts: true,
    },
  })
})

// --- Save email preferences (public) ---
routerAdd("POST", "/api/email/preferences", (c) => {
  const info = c.requestInfo()
  const body = info.body || {}
  const marketing = require(__hooks + "/lib/email/marketing.js")

  let sub = null
  const token = String(body.token || "").trim()
  if (token) {
    try {
      const found = $app.findRecordsByFilter("subscribers", "unsubscribeToken = {:t}", "", 1, 0, { t: token })
      if (found.length > 0) sub = found[0]
    } catch (e) {}
  }
  const auth = info.auth
  if (!sub && auth && auth.getString("email")) sub = marketing.subscriberOf($app, auth.getString("email"))
  if (!sub) {
    const email = String(body.email || "").trim().toLowerCase()
    if (email) sub = marketing.subscriberOf($app, email)
  }
  if (!sub) return c.json(404, { message: "No subscription found for that link." })

  try {
    let prefsRec = null
    const uid = sub.getString("customer")
    let found = []
    if (uid) found = $app.findRecordsByFilter("email_preferences", "user = {:u}", "", 1, 0, { u: uid })
    if (found.length === 0) found = $app.findRecordsByFilter("email_preferences", "email = {:e}", "", 1, 0, { e: sub.getString("email") })
    if (found.length > 0) {
      prefsRec = found[0]
    } else {
      const col = $app.findCollectionByNameOrId("email_preferences")
      prefsRec = new Record(col)
      if (uid) prefsRec.set("user", uid)
      prefsRec.set("email", sub.getString("email"))
    }
    const p = body.prefs || {}
    const bool = (v, dflt) => (v === undefined ? dflt : !!v)
    prefsRec.set("marketing", bool(p.marketing, true))
    prefsRec.set("promotions", bool(p.promotions, true))
    prefsRec.set("newMotorcycles", bool(p.newMotorcycles, true))
    prefsRec.set("blog", bool(p.blog, true))
    prefsRec.set("offers", bool(p.offers, true))
    prefsRec.set("wishlistAlerts", bool(p.wishlistAlerts, true))
    prefsRec.set("restockAlerts", bool(p.restockAlerts, true))
    $app.save(prefsRec)

    // Keep the subscriber consent in sync.
    sub.set("marketingConsent", !!(p.marketing === undefined ? true : p.marketing))
    if (sub.getBool("marketingConsent")) sub.set("status", "subscribed")
    $app.save(sub)

    return c.json(200, { ok: true, message: "Preferences saved." })
  } catch (err) {
    return c.json(500, { message: (err && err.message) || "Saving preferences failed." })
  }
})

// --- Subscriber sync route (frontend calls after registration / sign-in) ---
routerAdd("POST", "/api/email/sync-subscriber", (c) => {
  const info = c.requestInfo()
  const auth = info.auth
  if (!auth) return c.json(401, { message: "Not authenticated." })
  try {
    const email = auth.getString("email")
    if (!email) return c.json(400, { message: "No email on account." })
    const existing = $app.findRecordsByFilter("subscribers", "email = {:e}", "", 1, 0, { e: email })
    if (existing.length > 0) {
      return c.json(200, { ok: true, synced: false, reason: "exists" })
    }
    const chars = "abcdef0123456789"
    let token = ""
    for (let i = 0; i < 24; i++) token += chars[Math.floor(Math.random() * chars.length)]
    const col = $app.findCollectionByNameOrId("subscribers")
    const s = new Record(col)
    s.set("email", email)
    s.set("name", auth.getString("name"))
    s.set("firstName", (auth.getString("name") || "").split(" ")[0])
    s.set("lastName", (auth.getString("name") || "").split(" ").slice(1).join(" "))
    s.set("customer", auth.id)
    s.set("status", "subscribed")
    s.set("marketingConsent", true)
    s.set("consentDate", new Date().toISOString())
    s.set("unsubscribeToken", token)
    s.set("source", "registration")
    $app.save(s)
    return c.json(200, { ok: true, synced: true })
  } catch (err) {
    return c.json(500, { message: (err && err.message) || "Sync failed." })
  }
})

// --- Admin campaign send route (consent-gated, branded) ---
routerAdd("POST", "/api/email/campaign/send", (c) => {
  const info = c.requestInfo()
  const auth = info.auth
  const isAdmin = !!auth && (auth.getString("role") === "admin" || auth.collection().name === "_superusers")
  if (!isAdmin) return c.json(401, { message: "Not authorized." })
  const body = info.body || {}
  const campaignId = String(body.id || "")
  if (!campaignId) return c.json(400, { message: "Campaign id is required." })

  try {
    const marketing = require(__hooks + "/lib/email/marketing.js")
    const campaign = $app.findRecordById("email_campaigns", campaignId)
    const subject = campaign.getString("subject")
    const html = campaign.getString("html")
    const audience = campaign.getString("audience") || "all_subscribers"
    const cc = campaign.getString("category") || "promotions"
    if (!subject) return c.json(400, { message: "Campaign needs a subject." })

    const recipients = marketing.audienceFor($app, audience, cc)
    const tpl = require(__hooks + "/lib/email/templates.js")
    let enqueued = 0
    for (const r of recipients) {
      const vars = tpl.deepMergeVars({}, {
        bodyHtml: html || "",
        campaignHeadline: campaign.getString("previewText") || campaign.getString("name"),
        campaignSubject: subject,
        campaignMessage: (html || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 240),
      })
      const res = marketing.enqueueMarketing($app, {
        recipient: r.email,
        recipientName: r.name,
        template: "campaign",
        category: cc,
        campaignCategory: cc,
        subject,
        vars,
        idempotencyKey: "campaign:" + campaignId + ":" + r.email,
        relatedType: "email_campaign",
        relatedId: campaignId,
      })
      if (res.ok && res.enqueued) enqueued++
    }

    campaign.set("status", "sent")
    campaign.set("sentDate", new Date().toISOString())
    campaign.set("recipientCount", enqueued)
    $app.save(campaign)

    return c.json(200, { ok: true, enqueued })
  } catch (err) {
    return c.json(500, { message: (err && err.message) || "Campaign send failed." })
  }
})

// --- Campaign creation route (admin) ---
routerAdd("POST", "/api/email/campaign/create", (c) => {
  const info = c.requestInfo()
  const auth = info.auth
  const isAdmin = !!auth && (auth.getString("role") === "admin" || auth.collection().name === "_superusers")
  if (!isAdmin) return c.json(401, { message: "Not authorized." })
  const body = info.body || {}
  if (!String(body.name || "").trim() || !String(body.subject || "").trim()) {
    return c.json(400, { message: "Name and subject are required." })
  }
  try {
    const col = $app.findCollectionByNameOrId("email_campaigns")
    const camp = new Record(col)
    camp.set("name", String(body.name))
    camp.set("subject", String(body.subject))
    camp.set("previewText", String(body.previewText || ""))
    camp.set("audience", String(body.audience || "all_subscribers"))
    camp.set("category", String(body.category || "promotions"))
    camp.set("template", String(body.template || ""))
    camp.set("html", String(body.html || ""))
    camp.set("status", "draft")
    if (body.scheduledDate) camp.set("scheduledDate", String(body.scheduledDate))
    $app.save(camp)
    return c.json(200, { ok: true, id: camp.id })
  } catch (err) {
    return c.json(500, { message: (err && err.message) || "Campaign creation failed." })
  }
})