/// Auth email helpers (required inside PB JSVM hook callbacks).

function SITE_BASE(app) {
  return (app.settings().meta.appURL || "https://nairobipowerbikes.com")
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
  const tpl = require(__hooks + "/lib/email/templates.js")
  const vars = authVars(e.app, e.record)
  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>Verify your email</h2>" +
    "<p>Hi " + vars.firstName + ",</p>" +
    "<p>Thanks for joining Nairobi Powerbikes. Confirm your email address to activate your account and start exploring our lineup.</p>" +
    tpl.buttonBlock("Go to my account", SITE_BASE(e.app) + "/login") +
    "<p style='font-size:12px;color:#8b8b94;'>Your account is waiting — just sign in and follow the verification prompt. If you didn't create this account, you can ignore this email.</p>"
  enqueueAuth(e, "auth_verify", "authentication", "Verify your Nairobi PowerBikes account", body, vars, "auth-verify:" + e.record.id, "user")
}

function buildWelcome(e, r) {
  const tpl = require(__hooks + "/lib/email/templates.js")
  const vars = authVars(e.app, r)
  const siteUrl = vars.siteUrl
  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>Welcome to the family, " + vars.firstName + "!</h2>" +
    "<p>Your account is verified and ready. Here's where to start:</p>" +
    tpl.buttonBlock("Browse motorcycles", siteUrl + "/motorcycles") +
    tpl.buttonBlock("Book a test ride", siteUrl + "/service/test-ride") +
    tpl.buttonBlock("Book a service", siteUrl + "/service/booking") +
    "<p>Manage your account, bookings and preferences from your dashboard.</p>"
  enqueueAuth(e, "auth_welcome", "authentication", "Welcome to Nairobi Powerbikes, " + vars.firstName, body, vars, "welcome:" + r.id, "user")
}

function buildPasswordReset(e) {
  const tpl = require(__hooks + "/lib/email/templates.js")
  const vars = authVars(e.app, e.record)
  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>Reset your password</h2>" +
    "<p>Hi " + vars.firstName + ",</p>" +
    "<p>We received a request to reset the password for your Nairobi Powerbikes account.</p>" +
    "<p>Follow the reset link in the email we sent alongside this one (check your inbox) or return to the sign-in page to request a new link.</p>" +
    "<p style='font-size:12px;color:#8b8b94;'>Reset links expire in 24 hours. If you didn't request this, ignore this email.</p>"
  enqueueAuth(e, "auth_password_reset", "authentication", "Reset your Nairobi PowerBikes password", body, vars, "auth-pwdreset:" + e.record.id, "user")
}

function buildPasswordChanged(e) {
  const tpl = require(__hooks + "/lib/email/templates.js")
  const vars = authVars(e.app, e.record)
  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>Your password was changed</h2>" +
    "<p>Hi " + vars.firstName + ",</p>" +
    "<p>The password for your Nairobi Powerbikes account was just changed. If this was you, no further action is needed.</p>" +
    "<p style='font-size:12px;color:#8b8b94;'>If you didn't make this change, reset your password immediately and contact support.</p>"
  enqueueAuth(e, "auth_password_changed", "authentication", "Your Nairobi PowerBikes password was changed", body, vars, "auth-pwdchanged:" + e.record.id, "user")
}

function buildEmailChange(e, newEmail) {
  const tpl = require(__hooks + "/lib/email/templates.js")
  const vars = authVars(e.app, e.record)
  const body =
    "<h2 style='color:#fff;margin:0 0 12px;'>Confirm your new email</h2>" +
    "<p>Hi " + vars.firstName + ",</p>" +
    "<p>Please confirm the change of your account email to <strong style='color:#fff'>" + newEmail + "</strong>.</p>" +
    "<p style='font-size:12px;color:#8b8b94;'>If you didn't request this change, contact us immediately.</p>"
  enqueueAuth(e, "auth_email_change", "authentication", "Confirm your new Nairobi PowerBikes email", body, vars, "auth-emailchange:" + e.record.id, "user")
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
  markWelcomeFlag,
  consumeWelcomeFlag,
}
