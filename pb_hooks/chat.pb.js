/// Live chat server-side hooks (PocketBase JSVM)
/// - Guest access via token-based API routes (guests have no PB auth)
/// - Realtime relay for guests on topic "chat_<convId>"
/// - Typing events relayed on topic "chat_typing_<convId>"
/// - Business hours + resolved/closed read-only enforcement
/// - Notifications: new enquiry -> staff; replies/transfers/resolve -> customer
///
/// NB: handlers run in isolated contexts -> shared helpers via require().

/* --------------------------- guest API routes --------------------------- */

// Start a new chat as a guest -> creates conversation + first message
routerAdd("POST", "/api/chat/guest/start", (c) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  try {
    const data = c.requestInfo().body || {}
    const name = String(data.guest_name || "").trim().slice(0, 120)
    const email = String(data.guest_email || "").trim().slice(0, 160)
    const phone = String(data.guest_phone || "").trim().slice(0, 40)
    const subject = String(data.subject || "").trim().slice(0, 160)
    const message = String(data.message || "").trim().slice(0, 5000)

    if (!name || !email || !message) {
      return c.json(400, { message: "Name, email and message are required." })
    }
    if (!chat.isOpenNow($app)) {
      return c.json(400, { message: "Our support team is currently offline. Please try again during business hours." })
    }

    let guestToken = String(data.token || "").trim()
    if (guestToken) {
      const existing = $app.findRecordsByFilter("chat_conversations", "guest_token = {:t}", "", 1, 0, { t: guestToken })
      if (!existing.length) guestToken = ""
    }
    if (!guestToken) guestToken = $security.randomString(32)

    const conv = new Record($app.findCollectionByNameOrId("chat_conversations"))
    conv.set("subject", subject || message.slice(0, 120))
    conv.set("guest_name", name)
    conv.set("guest_email", email)
    conv.set("guest_phone", phone)
    conv.set("guest_token", guestToken)
    conv.set("status", "waiting")
    conv.set("priority", "normal")
    conv.set("agent_joined", false)
    $app.save(conv)

    const msg = new Record($app.findCollectionByNameOrId("chat_messages"))
    msg.set("conversation", conv.id)
    msg.set("sender_type", "customer")
    msg.set("body", message)
    $app.save(msg)

    return c.json(200, { conversation: chat.publicConv(conv), message: chat.publicMsg(msg), token: conv.getString("guest_token") })
  } catch (err) {
    return c.json(400, { message: String(err && err.message ? err.message : err) })
  }
})

// List guest conversations
routerAdd("GET", "/api/chat/guest/conversations", (c) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const token = String(c.requestInfo().query.token || "")
  if (!token) return c.json(400, { message: "Missing token." })
  const convs = $app.findRecordsByFilter("chat_conversations", "guest_token = {:t}", "-created", 100, 0, { t: token })
  return c.json(200, { items: convs.map(chat.publicConv) })
})

// List messages of a guest conversation (ascending, paginated, no internal notes)
routerAdd("GET", "/api/chat/guest/messages", (c) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const q = c.requestInfo().query
  const token = String(q.token || "")
  const convId = String(q.conversation || "")
  let conv = null
  try {
    conv = $app.findRecordById("chat_conversations", convId)
  } catch (err) {
    return c.json(404, { message: "Conversation not found." })
  }
  if (conv.getString("guest_token") !== token) return c.json(403, { message: "Not authorized." })
  const page = Math.max(1, parseInt(q.page, 10) || 1)
  const perPage = Math.min(100, Math.max(1, parseInt(q.perPage, 10) || 50))
  const messages = $app.findRecordsByFilter("chat_messages", "conversation = {:c}", "+created", perPage, (page - 1) * perPage, { c: convId })
  const items = messages
    .filter((m) => m.getString("sender_type") !== "note")
    .map(chat.publicMsg)
  return c.json(200, { items, page, perPage, hasMore: items.length === perPage })
})

// Send a message as a guest (multipart/form-data; supports attachments)
routerAdd("POST", "/api/chat/guest/message", (c) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  try {
  const token = c.request.formValue("token") || ""
  const convId = c.request.formValue("conversation") || ""
  const body = (c.request.formValue("body") || "").trim().slice(0, 5000)

  let conv = null
  try {
    conv = $app.findRecordById("chat_conversations", convId)
  } catch (err) {
    return c.json(404, { message: "Conversation not found." })
  }
  if (conv.getString("guest_token") !== token) return c.json(403, { message: "Not authorized." })

  const status = conv.getString("status")
  if (status === "resolved" || status === "closed") {
    return c.json(400, { message: "This conversation has been resolved. Please start a new conversation." })
  }
  if (!chat.isOpenNow($app)) {
    return c.json(400, { message: "Our support team is currently offline. Please try again during business hours." })
  }

  const files = []
  try {
    const filePair = c.request.formFile("attachments")
    if (filePair && filePair[1]) files.push($filesystem.fileFromMultipart(filePair[1]))
  } catch (err) {
    // no attachment provided
  }
  if (!body && !files.length) return c.json(400, { message: "Message is empty." })

  const msg = new Record($app.findCollectionByNameOrId("chat_messages"))
  msg.set("conversation", convId)
  msg.set("sender_type", "customer")
  if (body) msg.set("body", body)
  if (files.length === 1) msg.set("attachments", files[0])
  else if (files.length > 1) msg.set("attachments", files)
  $app.save(msg)

  let fresh = msg
  try {
    fresh = $app.findRecordById("chat_messages", msg.id)
  } catch (err) {
    fresh = msg
  }
  return c.json(200, { message: chat.publicMsg(fresh) })
  } catch (err) {
    console.log("CHAT DEBUG msg error:", String(err && err.stack ? err.stack : err))
    return c.json(400, { message: String(err) })
  }
})

// Public support availability (business hours) for the chat widgets
routerAdd("GET", "/api/chat/availability", (c) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  return c.json(200, { open: chat.isOpenNow($app), config: chat.getHoursConfig($app) })
})

// Resolve an authenticated attachment download URL.
// Guests pass their token; signed-in customers / staff are checked via their auth record.
routerAdd("GET", "/api/chat/attachment", (c) => {
  const q = c.requestInfo().query
  const convId = String(q.conversation || "")
  const msgId = String(q.message || "")
  const file = String(q.file || "")
  const token = String(q.token || "")
  if (!convId || !msgId || !file) return c.json(400, { message: "Missing parameters." })

  let conv = null
  try {
    conv = $app.findRecordById("chat_conversations", convId)
  } catch (err) {
    return c.json(404, { message: "Conversation not found." })
  }

  const info = c.requestInfo()
  const auth = info.auth
  const authId = auth && auth.getString ? auth.getString("id") : ""
  const isStaff = authId !== "" && auth.getString("role") !== "customer"

  let allowed = false
  if (isStaff) allowed = true
  else if (token && conv.getString("guest_token") === token) allowed = true
  else if (authId !== "" && conv.getString("customer") === authId) allowed = true
  if (!allowed) return c.json(403, { message: "Not authorized." })

  let msg = null
  try {
    msg = $app.findRecordById("chat_messages", msgId)
  } catch (err) {
    return c.json(404, { message: "Message not found." })
  }
  if (msg.getString("conversation") !== convId) return c.json(403, { message: "Not authorized." })

  const names = msg.getStringSlice("attachments")
  if (!names.includes(file)) return c.json(404, { message: "Attachment not found." })

  const base = "/api/files/" + msg.collection().id + "/" + msg.id + "/" + encodeURIComponent(file)
  const download = String(q.download || "") === "1"
  return c.json(200, { url: download ? base + "?download=1" : base, filename: file, allowed: true })
})

// Mark all agent messages of a guest conversation as read by the customer
routerAdd("POST", "/api/chat/guest/read", (c) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const data = c.requestInfo().body || {}
  const token = String(data.token || "")
  const convId = String(data.conversation || "")
  let conv = null
  try {
    conv = $app.findRecordById("chat_conversations", convId)
  } catch (err) {
    return c.json(404, { message: "Conversation not found." })
  }
  if (conv.getString("guest_token") !== token) return c.json(403, { message: "Not authorized." })
  const msgs = $app.findRecordsByFilter("chat_messages", "conversation = {:c} && sender_type = {:t} && customer_read_at = \"\"", "", 200, 0, { c: convId, t: "agent" })
  const now = new Date()
  for (const m of msgs) {
    m.set("customer_read_at", now)
    $app.save(m)
  }
  return c.json(200, { ok: true, updated: msgs.length })
})

// Guest typing indicator relay
routerAdd("POST", "/api/chat/guest/typing", (c) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const data = c.requestInfo().body || {}
  const token = String(data.token || "")
  const convId = String(data.conversation || "")
  const typing = !!data.typing
  let conv = null
  try {
    conv = $app.findRecordById("chat_conversations", convId)
  } catch (err) {
    return c.json(404, { message: "Conversation not found." })
  }
  if (conv.getString("guest_token") !== token) return c.json(403, { message: "Not authorized." })
  chat.realtimeSend($app, "chat_typing_" + convId, {
    conversation: convId,
    user: { id: "guest", name: conv.getString("guest_name") || "Customer", role: "customer" },
    typing,
    at: Date.now(),
  })
  return c.json(200, { ok: true })
})

// Agent joins a waiting conversation -> emits a one-time system event (deduped via agent_joined)
routerAdd("POST", "/api/chat/join", (c) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const info = c.requestInfo()
  const auth = info.auth
  if (!auth || !auth.getString("id") || auth.getString("role") === "customer") return c.json(401, { message: "Not authorized." })
  const convId = String((info.body || {}).conversation || "")
  if (!convId) return c.json(400, { message: "Missing conversation." })
  let conv = null
  try {
    conv = $app.findRecordById("chat_conversations", convId)
  } catch (err) {
    return c.json(404, { message: "Conversation not found." })
  }
  const name = auth.getString("name") || "Support"
  if (!conv.getBool("agent_joined")) {
    conv.set("agent_joined", true)
    if (!conv.getString("assigned_to")) {
      conv.set("assigned_to", auth.id)
      if (conv.getString("status") === "waiting") conv.set("status", "assigned")
    }
    $app.save(conv)
    chat.addSystemMessage($app, convId, name + " joined the conversation.")
    chat.notifyUser($app, conv.getString("customer"), {
      type: "message",
      title: "Support joined your chat",
      message: name + " has joined your conversation.",
      link: "",
    })
    chat.realtimeSend($app, "chat_" + convId, { action: "update", record: chat.publicConv(conv) })
  }
  return c.json(200, { ok: true, joined: true, agent: name })
})

// Transfer a conversation to another online staff member
routerAdd("POST", "/api/chat/transfer", (c) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const info = c.requestInfo()
  const auth = info.auth
  if (!auth || !auth.getString("id") || auth.getString("role") === "customer") return c.json(401, { message: "Not authorized." })
  const body = info.body || {}
  const convId = String(body.conversation || "")
  const targetId = String(body.to || "")
  if (!convId || !targetId) return c.json(400, { message: "Missing conversation or target." })
  let conv = null
  try {
    conv = $app.findRecordById("chat_conversations", convId)
  } catch (err) {
    return c.json(404, { message: "Conversation not found." })
  }
  if (conv.getString("assigned_to") === targetId) return c.json(200, { ok: true, message: "Already assigned." })
  let target = null
  try {
    target = $app.findRecordById("users", targetId)
  } catch (err) {
    return c.json(404, { message: "Target agent not found." })
  }
  if (!chat.isStaffOnline($app, target)) return c.json(400, { message: "Target agent is not online." })

  const prevName = ""
  const targetName = target.getString("name") || "Support"
  conv.set("assigned_to", targetId)
  conv.set("status", conv.getString("status") === "resolved" || conv.getString("status") === "closed" ? conv.getString("status") : "assigned")
  $app.save(conv)

  const customer = conv.getString("customer")
  if (customer) {
    chat.notifyUser($app, customer, {
      type: "message",
      title: "Conversation Transferred",
      message: "Your conversation has been transferred to " + targetName + ". They will respond shortly.",
      link: "",
    })
  }
  chat.notifyUser($app, targetId, {
    type: "message",
    title: "Chat Assigned To You",
    message: (targetName || "A support agent") + " — \"" + (conv.getString("subject") || "New support enquiry") + "\"",
    link: "/dashboard/chats?conv=" + conv.id,
  })
  chat.addSystemMessage($app, convId, "Conversation transferred to " + targetName + ".")
  chat.realtimeSend($app, "chat_" + convId, { action: "update", record: chat.publicConv(conv) })
  return c.json(200, { ok: true, message: "Transferred to " + targetName })
})

// Customer/guest heartbeat -> tracks online presence for the admin console
routerAdd("POST", "/api/chat/heartbeat", (c) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const info = c.requestInfo()
  const body = info.body || {}
  const convId = String(body.conversation || "")
  if (!convId) return c.json(400, { message: "Missing conversation." })
  let conv = null
  try {
    conv = $app.findRecordById("chat_conversations", convId)
  } catch (err) {
    return c.json(404, { message: "Conversation not found." })
  }
  const token = String(body.token || "")
  const authId = info.auth && info.auth.getString ? info.auth.getString("id") : ""
  const isGuestOk = token && conv.getString("guest_token") === token
  const isCustomerOk = authId !== "" && conv.getString("customer") === authId
  const isStaff = authId !== "" && info.auth.getString("role") !== "customer"
  if (!isGuestOk && !isCustomerOk && !isStaff) return c.json(403, { message: "Not authorized." })
  const now = new Date()
  if (conv.getString("customer_last_seen") !== now.toISOString()) {
    conv.set("customer_last_seen", now)
    $app.save(conv)
    chat.realtimeSend($app, "chat_" + convId, { action: "update", record: chat.publicConv(conv) })
  }
  return c.json(200, { ok: true })
})

// Staff availability update (Online / Away / Offline)
routerAdd("POST", "/api/chat/availability", (c) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const info = c.requestInfo()
  const auth = info.auth
  if (!auth || !auth.getString("id") || auth.getString("role") === "customer") return c.json(401, { message: "Not authorized." })
  const value = String((info.body || {}).availability || "online")
  if (!["online", "away", "busy", "offline"].includes(value)) return c.json(400, { message: "Invalid availability." })
  const rec = $app.findRecordById("users", auth.id)
  rec.set("availability", value)
  $app.save(rec)
  chat.broadcastStaffPresence($app, rec)
  return c.json(200, { ok: true, availability: value })
})

// List online staff available for transfer
routerAdd("GET", "/api/chat/staff", (c) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const info = c.requestInfo()
  const auth = info.auth
  if (!auth || !auth.getString("id") || auth.getString("role") === "customer") return c.json(401, { message: "Not authorized." })
  const staff = $app.findRecordsByFilter("users", "role != {:r}", "-created", 200, 0, { r: "customer" })
  const items = []
  for (const u of staff) {
    const online = chat.isStaffOnline($app, u)
    const active = u.getString("status") !== "inactive"
    const workload = $app.findRecordsByFilter("chat_conversations", "assigned_to = {:u} && status != {:s} && status != {:s2}", "", 100, 0, { u: u.id, s: "resolved", s2: "closed" }).length
    items.push({
      id: u.id,
      name: u.getString("name") || u.getString("email"),
      email: u.getString("email"),
      role: u.getString("role"),
      availability: u.getString("availability") || "offline",
      status: u.getString("status") || "active",
      online,
      active,
      workload,
    })
  }
  items.sort((a, b) => Number(b.online) - Number(a.online) || a.workload - b.workload)
  return c.json(200, { items })
})

// Signed-in typing indicator relay (staff + customers)
routerAdd("POST", "/api/chat/typing", (c) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const info = c.requestInfo()
  const auth = info.auth
  if (!auth || !auth.getString("id")) return c.json(401, { message: "Not authorized." })
  const data = info.body || {}
  const convId = String(data.conversation || "")
  const typing = !!data.typing
  let conv = null
  try {
    conv = $app.findRecordById("chat_conversations", convId)
  } catch (err) {
    return c.json(404, { message: "Conversation not found." })
  }
  const role = auth.getString("role")
  const isStaff = role !== "customer"
  const isOwner = role === "customer" && conv.getString("customer") === auth.id
  if (!isStaff && !isOwner) return c.json(403, { message: "Not authorized." })
  chat.realtimeSend($app, "chat_typing_" + convId, {
    conversation: convId,
    user: { id: auth.id, name: auth.getString("name") || (isStaff ? "Support" : "Customer"), role },
    typing,
    at: Date.now(),
  })
  return c.json(200, { ok: true })
})

// Broadcast staff availability changes so customer widgets update in real time
onRecordAfterUpdateSuccess((e) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const rec = e.record
  try {
    const role = rec.getString("role")
    if (role && role !== "customer") chat.broadcastStaffPresence(e.app, rec)
  } catch (err) {
    // ignore
  }
  e.next()
}, "users")

/* --------------------------- record hooks --------------------------- */

// Enforce business hours + read-only resolved conversations for customers/guests
onRecordCreate((e) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const app = e.app
  const auth = e.auth
  const isStaff = auth && auth.getString("id") !== "" && auth.getString("role") !== "customer"
  const st = e.record.getString("sender_type")
  if (isStaff || st === "system" || st === "note") {
    e.next()
    return
  }
  const convId = e.record.getString("conversation")
  let conv = null
  try {
    conv = app.findRecordById("chat_conversations", convId)
  } catch (err) {
    throw new BadRequestError("Conversation not found.")
  }
  const status = conv.getString("status")
  if (status === "resolved" || status === "closed") {
    throw new BadRequestError("This conversation has been resolved. Please start a new conversation.")
  }
  if (!chat.isOpenNow(app)) {
    throw new BadRequestError("Our support team is currently offline. Please try again during business hours.")
  }
  e.next()
}, "chat_messages")

// Customers can only start new conversations during business hours
onRecordCreate((e) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const auth = e.auth
  if (auth && auth.getString("role") === "customer" && !chat.isOpenNow(e.app)) {
    throw new BadRequestError("Our support team is currently offline. Please try again during business hours.")
  }
  e.next()
}, "chat_conversations")

// Notify staff about new enquiries
onRecordAfterCreateSuccess((e) => {
  const utils = require(__hooks + "/lib/notif_utils.js")
  const app = e.app
  const conv = e.record
  const name = conv.getString("guest_name") || ""
  const customer = conv.getString("customer") || ""
  const subject = conv.getString("subject") || "New support enquiry"
  let customerName = ""
  if (customer) {
    try {
      customerName = app.findRecordById("users", customer).getString("name") || ""
    } catch (err) {
      customerName = ""
    }
  }
  const staff = app.findRecordsByFilter("users", "role != {:r} && status != {:s}", "-created", 200, 0, { r: "customer", s: "inactive" })
  for (const u of staff) {
    utils.createNotification(app, {
      type: "message",
      user: u.id,
      title: "New Support Enquiry",
      message: (customerName || name ? customerName || name + ": " : "") + "\"" + subject + "\"",
      link: "/dashboard/chats?conv=" + conv.id,
    })
  }
  e.next()
}, "chat_conversations")

// Update conversation metadata on new message + notify + relay
onRecordAfterCreateSuccess((e) => {
  const utils = require(__hooks + "/lib/notif_utils.js")
  const chat = require(__hooks + "/lib/chat_utils.js")
  const app = e.app
  const msg = e.record
  const st = msg.getString("sender_type")
  const body = msg.getString("body") || ""
  const convId = msg.getString("conversation")
  let conv = null
  try {
    conv = app.findRecordById("chat_conversations", convId)
  } catch (err) {
    e.next()
    return
  }
  if (st !== "note") {
    conv.set("last_message_at", new Date())
    if (body) conv.set("last_message_preview", body.slice(0, 90))
  }
  if (st === "agent" && !conv.getString("first_response_at")) {
    const createdMs = new Date(conv.getString("created")).getTime()
    const nowMs = Date.now()
    conv.set("first_response_at", new Date(nowMs))
    conv.set("first_response_seconds", Math.max(0, Math.round((nowMs - createdMs) / 1000)))
  }
  app.save(conv)

  if (st === "agent" && conv.getString("customer")) {
    utils.createNotification(app, {
      type: "message",
      user: conv.getString("customer"),
      title: "New reply from PowerBikes Support",
      message: body ? body.slice(0, 140) : "You received a message with an attachment.",
      link: "",
    })
  }

  if (conv.getString("guest_token")) {
    chat.realtimeSend(app, "chat_" + convId, { action: "create", record: chat.publicMsg(msg) })
  }
  e.next()
}, "chat_messages")

// Relay message updates (read receipts / delivered) to guests
onRecordAfterUpdateSuccess((e) => {
  const chat = require(__hooks + "/lib/chat_utils.js")
  const app = e.app
  const msg = e.record
  const convId = msg.getString("conversation")
  try {
    const conv = app.findRecordById("chat_conversations", convId)
    if (conv.getString("guest_token")) {
      chat.realtimeSend(app, "chat_" + convId, { action: "update", record: chat.publicMsg(msg) })
    }
  } catch (err) {
    // conversation missing -> nothing to relay
  }
  e.next()
}, "chat_messages")

// Cache conversation update intent so AfterUpdateSuccess can notify on real changes
onRecordUpdateRequest((e) => {
  const utils = require(__hooks + "/lib/notif_utils.js")
  try {
    const old = e.app.findRecordById("chat_conversations", e.record.id)
    utils.cacheStatusChange(e.app, "chat_conv_" + e.record.id, {
      oldStatus: old.getString("status"),
      oldAssigned: old.getString("assigned_to"),
    })
  } catch (err) {
    // fallback: no baseline
  }
  e.next()
}, "chat_conversations")

// Notify on resolve / transfer / assignment + relay conversation updates to guests
onRecordAfterUpdateSuccess((e) => {
  const utils = require(__hooks + "/lib/notif_utils.js")
  const chat = require(__hooks + "/lib/chat_utils.js")
  const app = e.app
  const conv = e.record
  const data = utils.consumeStatusChange(app, "chat_conv_" + conv.id)
  const status = conv.getString("status")
  const assigned = conv.getString("assigned_to") || ""
  const customer = conv.getString("customer") || ""

  if (data) {
    if (data.oldStatus !== "resolved" && status === "resolved") {
      chat.addSystemMessage(app, conv.id, "This conversation has been resolved by our support team.")
      if (customer) {
        utils.createNotification(app, {
          type: "message",
          user: customer,
          title: "Conversation Resolved",
          message: "Your enquiry has been resolved by our support team. If you need further assistance, please start a new conversation.",
          link: "",
        })
      }
    }
    if (data.oldAssigned !== assigned && data.oldAssigned && customer) {
      utils.createNotification(app, {
        type: "message",
        user: customer,
        title: "Support Transfer",
        message: "Your conversation has been transferred to another support agent. The team is on it.",
        link: "",
      })
    }
    if (data.oldAssigned !== assigned && assigned) {
      let name = ""
      try {
        name = app.findRecordById("users", assigned).getString("name") || ""
      } catch (err) {
        name = ""
      }
      utils.createNotification(app, {
        type: "message",
        user: assigned,
        title: "Chat Assigned To You",
        message: (name || "A support agent") + " — \"" + (conv.getString("subject") || "New support enquiry") + "\"",
        link: "/dashboard/chats?conv=" + conv.id,
      })
    }
  }

  if (conv.getString("guest_token")) {
    chat.realtimeSend(app, "chat_" + conv.id, { action: "update", record: chat.publicConv(conv) })
  }
  e.next()
}, "chat_conversations")