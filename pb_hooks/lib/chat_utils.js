/// Shared helpers for the live chat hooks (loaded per-handler via require()).

const HOURS_KEY = "support_business_hours"

function getHoursConfig(app) {
  try {
    const rec = app.findFirstRecordByFilter("site_config", "key = {:k}", { k: HOURS_KEY })
    if (!rec) return null
    return JSON.parse(rec.getString("value") || "{}")
  } catch (err) {
    return null
  }
}

function isOpenNow(app) {
  const cfg = getHoursConfig(app)
  if (!cfg || !cfg.days) return true
  if (cfg.enabled === false) return false
  const offset = parseInt(cfg.utcOffsetMinutes, 10) || 180
  const nai = new Date(Date.now() + offset * 60000)
  const day = nai.getUTCDay()
  const mins = nai.getUTCHours() * 60 + nai.getUTCMinutes()
  const d = cfg.days.find((x) => x && x.day === day)
  if (!d || !d.enabled) return false
  const [oh, om] = String(d.open || "09:00").split(":").map(Number)
  const [ch, cm] = String(d.close || "18:00").split(":").map(Number)
  const open = (oh || 0) * 60 + (om || 0)
  const close = (ch || 0) * 60 + (cm || 0)
  return mins >= open && mins < close
}

// Send a realtime message to all connected clients subscribed to the topic.
function realtimeSend(app, topic, payload) {
  try {
    const msg = new SubscriptionMessage({ name: topic, data: JSON.stringify(payload) })
    const clients = app.subscriptionsBroker().clients()
    for (const key of Object.keys(clients)) {
      try {
        const client = clients[key]
        const subs = client.subscriptions(topic)
        if (subs && Object.keys(subs).length > 0) client.send(msg)
      } catch (err) {
        // ignore individual client errors
      }
    }
  } catch (err) {
    // relay is best-effort
  }
}

function publicMsg(msg) {
  return {
    id: msg.id,
    collectionId: msg.collection().id,
    conversation: msg.getString("conversation"),
    sender: msg.getString("sender") || "",
    sender_type: msg.getString("sender_type"),
    body: msg.getString("body") || "",
    attachments: msg.getStringSlice("attachments"),
    created: msg.getString("created"),
    updated: msg.getString("updated"),
    delivered_at: msg.getString("delivered_at") || "",
    customer_read_at: msg.getString("customer_read_at") || "",
    agent_read_at: msg.getString("agent_read_at") || "",
  }
}

function publicConv(conv) {
  return {
    id: conv.id,
    subject: conv.getString("subject") || "",
    customer: conv.getString("customer") || "",
    guest_name: conv.getString("guest_name") || "",
    guest_email: conv.getString("guest_email") || "",
    guest_phone: conv.getString("guest_phone") || "",
    status: conv.getString("status") || "waiting",
    assigned_to: conv.getString("assigned_to") || "",
    priority: conv.getString("priority") || "normal",
    agent_joined: conv.getBool("agent_joined"),
    last_message_at: conv.getString("last_message_at") || "",
    last_message_preview: conv.getString("last_message_preview") || "",
    first_response_at: conv.getString("first_response_at") || "",
    first_response_seconds: conv.getInt("first_response_seconds"),
    resolved_at: conv.getString("resolved_at") || "",
    resolved_by: conv.getString("resolved_by") || "",
    customer_last_seen: conv.getString("customer_last_seen") || "",
    created: conv.getString("created"),
    updated: conv.getString("updated"),
  }
}

// Is the given staff user considered online/available for chat transfers & presence?
function isStaffOnline(app, user) {
  if (!user) return false
  try {
    if (user.getString("role") === "customer") return false
    if (user.getString("status") === "inactive") return false
    const avail = user.getString("availability")
    if (avail !== "online") return false
    return true
  } catch (err) {
    return false
  }
}

// Create a system message for a conversation (centered, read-only system event).
function addSystemMessage(app, convId, body, extra) {
  const msg = new Record(app.findCollectionByNameOrId("chat_messages"))
  msg.set("conversation", convId)
  msg.set("sender_type", "system")
  msg.set("body", String(body || "").slice(0, 5000))
  if (extra && typeof extra === "object") {
    for (const k of Object.keys(extra)) {
      msg.set(k, extra[k])
    }
  }
  app.save(msg)
  return msg
}

// Notify a specific user via the notifications collection.
function notifyUser(app, userId, data) {
  try {
    const utils = require(__hooks + "/lib/notif_utils.js")
    utils.createNotification(app, { user: userId, ...data })
  } catch (err) {
    // notifications are best-effort
  }
}

// Broadcast staff presence (availability changes) to all chat clients.
function broadcastStaffPresence(app, user) {
  try {
    realtimeSend(app, "chat_staff_presence", {
      id: user.id,
      name: user.getString("name") || "Support",
      role: user.getString("role"),
      availability: user.getString("availability") || "offline",
      status: user.getString("status") || "active",
      at: Date.now(),
    })
  } catch (err) {
    // best-effort
  }
}

module.exports = { getHoursConfig, isOpenNow, realtimeSend, publicMsg, publicConv, isStaffOnline, addSystemMessage, notifyUser, broadcastStaffPresence }
