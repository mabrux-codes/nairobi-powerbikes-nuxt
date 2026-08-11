/// <reference path="../pb_data/types.d.ts" />

/// Marketing email infrastructure.
/// - Public no-login unsubscribe endpoint.
/// - Subscriber record sync on user registration / sign-in.
/// - Admin campaign send route.

// --- Public unsubscribe (no login required) ---
routerAdd("GET", "/api/email/unsubscribe", (c) => {
  const info = c.requestInfo()
  const query = info.query || {}
  const token = String(query.token || "").trim()
  const email = String(query.email || "").trim().toLowerCase()
  if (!token && !email) return c.json(400, { message: "An unsubscribe token or email is required." })

  try {
    let subscriber = null
    if (token) {
      const found = $app.findRecordsByFilter("subscribers", "unsubscribeToken = {:t}", "", 1, 0, { t: token })
      if (found.length > 0) subscriber = found[0]
    }
    if (!subscriber && email) {
      const found = $app.findRecordsByFilter("subscribers", "email = {:e}", "", 1, 0, { e: email })
      if (found.length > 0) subscriber = found[0]
    }
    if (!subscriber) {
      // Create an unsubscribed record to remember the preference.
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
    return c.json(200, { ok: true, message: "You have been unsubscribed from Nairobi Powerbikes marketing emails." })
  } catch (err) {
    return c.json(500, { message: (err && err.message) || "Unsubscribe failed." })
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

// --- Admin campaign send route ---
routerAdd("POST", "/api/email/campaign/send", (c) => {
  const info = c.requestInfo()
  const auth = info.auth
  const isAdmin = !!auth && (auth.getString("role") === "admin" || auth.collection().name === "_superusers")
  if (!isAdmin) return c.json(401, { message: "Not authorized." })
  const body = info.body || {}
  const campaignId = String(body.id || "")
  if (!campaignId) return c.json(400, { message: "Campaign id is required." })

  try {
    const campaign = $app.findRecordById("email_campaigns", campaignId)
    const subject = campaign.getString("subject")
    const html = campaign.getString("html")
    const audience = campaign.getString("audience") || "all_subscribers"
    if (!subject || !html) return c.json(400, { message: "Campaign needs a subject and body." })

    // Resolve recipients by audience
    let recipients = []
    if (audience === "all_subscribers") {
      recipients = $app.findRecordsByFilter("subscribers", "status = {:s} && marketingConsent = true", "", 2000, 0, { s: "subscribed" })
    } else if (audience === "customers") {
      recipients = $app.findRecordsByFilter("users", "role = {:r} && status != {:s}", "", 2000, 0, { r: "customer", s: "inactive" })
    } else {
      // Fallback: all subscribers
      recipients = $app.findRecordsByFilter("subscribers", "status = {:s} && marketingConsent = true", "", 2000, 0, { s: "subscribed" })
    }

    const queue = require(__hooks + "/lib/email/queue.js")
    const tpl = require(__hooks + "/lib/email/templates.js")
    let enqueued = 0
    for (const r of recipients) {
      const email = r.getString("email")
      if (!email || email.indexOf("@") < 0) continue
      const name = r.getString("name") || r.getString("firstName") || ""
      const vars = tpl.deepMergeVars(tpl.DEFAULT_VARS($app), {
        customerName: name || email,
        firstName: (name || "").split(" ")[0] || "",
        email,
        unsubLink: ($app.settings().meta.appURL || "") + "/api/email/unsubscribe?token=" + (r.getString("unsubscribeToken") || ""),
      })
      const bodyWithUnsub = html + tpl.buttonBlock("Unsubscribe", vars.unsubLink)
      const res = queue.enqueueEmail($app, {
        recipient: email,
        recipientName: name,
        template: "campaign_" + campaignId,
        category: "marketing",
        priority: "low",
        payload: { subject, body: bodyWithUnsub, vars },
        idempotencyKey: "campaign:" + campaignId + ":" + (r.id || email),
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
