/// <reference path="../pb_data/types.d.ts" />

/// Authentication emails.
/// Thin hook registrations — all logic lives in lib/email/auth.js and is
/// required inside each callback (PB JSVM callbacks are isolated).

// --- Verification email (request-verification endpoint) ---
onRecordRequestVerificationRequest((e) => {
  e.next()
  try {
    const auth = require(__hooks + "/lib/email/auth.js")
    auth.buildVerify(e)
  } catch (err) {
    e.app.logger().error("auth_verify: " + (err && err.message))
  }
}, "_pb_users_auth_")

// --- Welcome email after the user actually verifies ---
onRecordUpdateRequest((e) => {
  try {
    const auth = require(__hooks + "/lib/email/auth.js")
    auth.markWelcomeFlag(e)
  } catch (err) {
    e.app.logger().error("welcome flag: " + (err && err.message))
  }
  e.next()
}, "_pb_users_auth_")

onRecordAfterUpdateSuccess((e) => {
  try {
    const auth = require(__hooks + "/lib/email/auth.js")
    auth.consumeWelcomeFlag(e, e.record)
  } catch (err) {
    e.app.logger().error("auth_welcome: " + (err && err.message))
  }
  e.next()
}, "_pb_users_auth_")

// --- Password reset requested ---
onRecordRequestPasswordResetRequest((e) => {
  e.next()
  try {
    const auth = require(__hooks + "/lib/email/auth.js")
    auth.buildPasswordReset(e)
  } catch (err) {
    e.app.logger().error("auth_pwdreset: " + (err && err.message))
  }
}, "_pb_users_auth_")

// --- Password changed (on confirm-password-reset) ---
onRecordConfirmPasswordResetRequest((e) => {
  e.next()
  try {
    const auth = require(__hooks + "/lib/email/auth.js")
    auth.buildPasswordChanged(e)
  } catch (err) {
    e.app.logger().error("auth_pwdchanged: " + (err && err.message))
  }
}, "_pb_users_auth_")

// --- Email change requested (new address confirmation) ---
onRecordRequestEmailChangeRequest((e) => {
  e.next()
  try {
    const auth = require(__hooks + "/lib/email/auth.js")
    auth.buildEmailChange(e, e.newEmail)
  } catch (err) {
    e.app.logger().error("auth_emailchange: " + (err && err.message))
  }
}, "_pb_users_auth_")

// --- New sign-in detected (valid password auth) ---
onRecordAuthWithPasswordRequest((e) => {
  // Suspended staff/customers are blocked at the backend, before any session
  // is issued or email is sent. This must NOT be swallowed by the try below.
  if (e.record && e.record.getString("status") === "inactive") {
    throw new BadRequestError("Your account has been suspended. Please contact an administrator.")
  }
  try {
    const auth = require(__hooks + "/lib/email/auth.js")
    if (!e.record) { e.next(); return } // failed auth -> no user matched
    // Staff invitations require a password change before the account is used.
    if (e.record.getBool("must_change_password") && e.record.getString("role") !== "customer") {
      e.app.store().set("npb_just_invited_" + e.record.id, true)
    }
    let ua = ""
    try {
      const header = e.httpContext.request().Header
      if (header && header.Get) ua = header.Get("User-Agent") || ""
    } catch (err) { /* UA is best-effort */ }
    auth.buildNewLogin(e, ua)
    // Track last login for staff/reporting (best-effort; record may be saved
    // again right after by the auth request anyway).
    try {
      e.record.set("last_login", new Date().toISOString())
      e.app.save(e.record)
    } catch (err) { /* non-fatal */ }
  } catch (err) {
    e.app.logger().error("auth_newlogin: " + (err && err.message))
  }
  e.next()
}, "_pb_users_auth_")
