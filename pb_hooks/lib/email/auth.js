/// Auth email helpers (required inside PB JSVM hook callbacks).
/// Templates are resolved by the registry in templates.js — these builders
/// only assemble the correct vars and enqueue through the queue.

function SITE_BASE(app) {
  return (app.settings().meta.appURL || "https://www.nairobi-powerbikes.co.ke")
}

function authVars(app, user, extra) {
  const tpl = require(__hooks + "/lib/email/templates.js")
  const name = (user && (user.getString("name") || user.getString("email"))) || "there"
  return tpl.deepMergeVars(tpl.DEFAULT_VARS(app), Object.assign({
    customerName: name,
    firstName: name.split(" ")[0],
    email: user ? user.getString("email") : "",
  }, extra || {}))
}

function enqueueAuth(e, template, category, subject, body, vars, idemKey, relatedType) {
  try {
    const queue = require(__hooks + "/lib/email/queue.js")
    const r = e.record
    queue.enqueueEmail(e.app, {
      recipient: r.getString("email"),
      recipientName: r.getString("name"),
      template,
      category,
      priority: "high",
      payload: { subject, body, vars },
      idempotencyKey: idemKey,
      relatedType,
      relatedId: r.id,
    })
  } catch (err) {
    e.app.logger().error("email_auth enqueue: " + (err && err.message))
  }
}

function buildVerify(e) {
  const vars = authVars(e.app, e.record, { actionUrl: SITE_BASE(e.app) + "/login" })
  enqueueAuth(e, "auth_verify", "authentication", "Verify your Nairobi PowerBikes account", "", vars, "auth-verify:" + e.record.id, "user")
}

function buildWelcome(e, r) {
  const vars = authVars(e.app, r)
  enqueueAuth(e, "auth_welcome", "authentication", "Welcome to Nairobi Powerbikes, " + vars.firstName, "", vars, "welcome:" + r.id, "user")
}

function buildPasswordReset(e) {
  const vars = authVars(e.app, e.record, { actionUrl: SITE_BASE(e.app) + "/login" })
  enqueueAuth(e, "auth_password_reset", "authentication", "Reset your Nairobi PowerBikes password", "", vars, "auth-pwdreset:" + e.record.id, "user")
}

function buildPasswordChanged(e) {
  const vars = authVars(e.app, e.record)
  enqueueAuth(e, "auth_password_changed", "authentication", "Your Nairobi PowerBikes password was changed", "", vars, "auth-pwdchanged:" + e.record.id, "user")
}

function buildEmailChange(e, newEmail) {
  const vars = authVars(e.app, e.record, { newEmail })
  enqueueAuth(e, "auth_email_change", "authentication", "Confirm your new Nairobi PowerBikes email", "", vars, "auth-emailchange:" + e.record.id, "user")
}

/// Best-effort "New sign-in detected" email.
/// Device/browser/OS are parsed from the request User-Agent; at most one
/// email per user per day is sent (idempotency key).
function buildNewLogin(e, ua) {
  try {
    const r = e.record
    const uaStr = String(ua || "")
    const os = (() => {
      if (/iphone|ipad|ios/i.test(uaStr)) return "iOS"
      if (/android/i.test(uaStr)) return "Android"
      if (/macintosh|mac os|macos/i.test(uaStr)) return "macOS"
      if (/windows/i.test(uaStr)) return "Windows"
      if (/linux/i.test(uaStr)) return "Linux"
      return "—"
    })()
    const browser = (() => {
      if (/edg(e)?\//i.test(uaStr)) return "Edge"
      if (/opr\//i.test(uaStr) || /opera/i.test(uaStr)) return "Opera"
      if (/firefox/i.test(uaStr)) return "Firefox"
      if (/chrome|crios/i.test(uaStr)) return "Chrome"
      if (/safari/i.test(uaStr)) return "Safari"
      return "—"
    })()
    const device = /mobi|android|iphone|ipad/i.test(uaStr) ? "Mobile" : "Desktop"
    const now = new Date()
    const dayKey = now.toISOString().slice(0, 10)
    const vars = authVars(e.app, r, {
      loginDate: now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
      loginTime: now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) + " EAT",
      loginDevice: browser + " on " + os + " (" + device + ")",
      loginBrowser: browser,
      loginLocation: "Nairobi, Kenya",
    })
    enqueueAuth(e, "auth_new_login", "authentication", "New sign-in to your Nairobi PowerBikes account", "", vars, "new-login:" + r.id + ":" + dayKey, "user")
  } catch (err) {
    e.app.logger().error("email new-login: " + (err && err.message))
  }
}

function markWelcomeFlag(e) {
  try {
    const r = e.record
    if (r.getBool("verified")) {
      let prev = null
      try { prev = e.app.findRecordById("users", r.id) } catch (err) {}
      const prevVerified = prev ? prev.getBool("verified") : false
      if (!prev || !prevVerified) {
        e.app.store().set("npb_welcome_" + r.id, true)
      }
    }
  } catch (err) {
    e.app.logger().error("welcome flag err: " + (err && err.message))
  }
}

function consumeWelcomeFlag(e, r) {
  const flag = e.app.store().get("npb_welcome_" + r.id)
  e.app.store().remove("npb_welcome_" + r.id)
  if (flag && r.getBool("verified")) {
    buildWelcome(e, r)
  }
}

module.exports = {
  buildVerify,
  buildWelcome,
  buildPasswordReset,
  buildPasswordChanged,
  buildEmailChange,
  buildNewLogin,
  markWelcomeFlag,
  consumeWelcomeFlag,
}