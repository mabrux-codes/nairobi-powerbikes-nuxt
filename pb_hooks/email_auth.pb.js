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
