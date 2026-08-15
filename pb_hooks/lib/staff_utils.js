/// Staff invitation + lifecycle helpers (required inside PB JSVM callbacks).
/// Handlers run in isolated contexts, so all shared logic lives here.

function nowISO() {
  return new Date().toISOString()
}

function addDaysISO(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString()
}

function SITE_BASE(app) {
  return app.settings().meta.appURL || "https://www.nairobi-powerbikes.co.ke"
}

/// Temporary password: 12 chars, at least one upper, lower, digit, symbol.
function genPassword() {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const lower = "abcdefghijkmnpqrstuvwxyz"
  const digits = "23456789"
  const symbols = "!@#$%*"
  const all = upper + lower + digits + symbols
  let out = ""
  out += upper[Math.floor(Math.random() * upper.length)]
  out += lower[Math.floor(Math.random() * lower.length)]
  out += digits[Math.floor(Math.random() * digits.length)]
  out += symbols[Math.floor(Math.random() * symbols.length)]
  for (let i = 0; i < 8; i++) out += all[Math.floor(Math.random() * all.length)]
  return out
}

/// One-time invitation token (not stored as a usable auth credential — the
/// token is a bearer that proves ownership of the invite email).
function genToken() {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let out = ""
  for (let i = 0; i < 40; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

function isAdminAuth(auth) {
  if (!auth) return false
  try {
    return auth.getString("role") === "admin" || auth.collection().name === "_superusers"
  } catch (err) {
    return false
  }
}

/// Append an audit_logs entry (hook-created records bypass collection rules).
function auditLog(app, data) {
  try {
    const col = app.findCollectionByNameOrId("audit_logs")
    const r = new Record(col)
    if (data.user) {
      try {
        const target = app.findRecordById("users", data.user)
        if (target) r.set("user", data.user)
      } catch (err) { /* superuser or invalid -> leave user empty */ }
    }
    r.set("action", String(data.action || ""))
    if (data.resource) r.set("resource", String(data.resource))
    if (data.resourceId) r.set("resource_id", String(data.resourceId))
    if (data.details) r.set("details", JSON.stringify(data.details))
    if (data.ip) r.set("ip", String(data.ip))
    app.save(r)
    return r
  } catch (err) {
    app.logger().error("audit: " + (err && err.message))
    return null
  }
}

/// Find the pending invitation for a user (latest pending wins).
function findPendingInvite(app, userId) {
  const recs = app.findRecordsByFilter("staff_invitations", "user = {:u} && status = {:s}", "-created", 1, 0, { u: userId, s: "pending" })
  return recs.length ? recs[0] : null
}

/// Enqueue the branded invitation email (temp password + expiry).
function sendInvitationEmail(app, invite, tempPassword) {
  try {
    const queue = require(__hooks + "/lib/email/queue.js")
    const tpl = require(__hooks + "/lib/email/templates.js")
    const name = invite.getString("name") || invite.getString("email")
    const expires = new Date(invite.getString("expires_at") || Date.now() + 7 * 86400000)
    const expiresLabel = expires.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
    const vars = tpl.deepMergeVars(tpl.DEFAULT_VARS(app), {
      customerName: name,
      firstName: name.split(" ")[0],
      email: invite.getString("email"),
      tempPassword: tempPassword,
      actionUrl: SITE_BASE(app) + "/login",
      expiresLabel: expiresLabel,
    })
    queue.enqueueEmail(app, {
      recipient: invite.getString("email"),
      recipientName: name,
      template: "staff_invitation",
      category: "authentication",
      priority: "high",
      payload: { subject: "You've been invited to the Nairobi PowerBikes team", vars },
      idempotencyKey: "staff-invite:" + invite.id,
      relatedType: "staff_invitations",
      relatedId: invite.id,
    })
  } catch (err) {
    app.logger().error("staff invite email: " + (err && err.message))
  }
}

/// Create the user + invitation row + email for a new staff invite.
/// Returns { user, invite, tempPassword } or throws.
function createInvite(app, admin, data) {
  const email = String(data.email || "").trim().toLowerCase()
  if (!email || email.indexOf("@") < 0) throw new BadRequestError("A valid email is required.")
  const role = String(data.role || "salesperson")
  if (["customer", "admin", "salesperson", "manager", "mechanic"].indexOf(role) < 0) {
    throw new BadRequestError("Invalid role.")
  }

  const existing = app.findRecordsByFilter("users", "email = {:e}", "", 1, 0, { e: email })
  if (existing.length > 0) {
    throw new BadRequestError("A user with this email already exists.")
  }

  const tempPassword = genPassword()
  const usersCol = app.findCollectionByNameOrId("users")
  const user = new Record(usersCol)
  user.set("email", email)
  user.set("password", tempPassword)
  user.set("passwordConfirm", tempPassword)
  user.set("name", String(data.name || "").trim() || email.split("@")[0])
  user.set("role", role)
  user.set("branch", String(data.branch || ""))
  user.set("phone", String(data.phone || ""))
  user.set("emailVisibility", true)
  user.set("verified", true)
  user.set("status", "active")
  user.set("availability", "online")
  user.set("must_change_password", true)
  user.set("invited_at", nowISO())
  user.set("invited_by", admin.id)
  app.save(user)

  const token = genToken()
  const invCol = app.findCollectionByNameOrId("staff_invitations")
  const invite = new Record(invCol)
  invite.set("email", email)
  invite.set("name", user.getString("name"))
  invite.set("token", token)
  invite.set("role", role)
  invite.set("branch", String(data.branch || ""))
  invite.set("invited_by", admin.id)
  invite.set("user", user.id)
  invite.set("status", "pending")
  invite.set("expires_at", addDaysISO(7))
  app.save(invite)

  sendInvitationEmail(app, invite, tempPassword)

  auditLog(app, {
    user: admin.id,
    action: "staff.invite",
    resource: "staff_invitations",
    resourceId: invite.id,
    details: { email, role, name: user.getString("name"), expires_at: invite.getString("expires_at") },
  })

  return { user, invite, tempPassword }
}

/// Regenerate token + temp password and re-send the invite email.
function resendInvite(app, admin, inviteId) {
  const inv = app.findRecordById("staff_invitations", inviteId)
  if (!inv) throw new NotFoundError("Invitation not found.")
  const uid = inv.getString("user")
  if (!uid) throw new BadRequestError("Invitation has no linked user.")

  const user = app.findRecordById("users", uid)
  const tempPassword = genPassword()
  user.set("password", tempPassword)
  user.set("passwordConfirm", tempPassword)
  user.set("must_change_password", true)
  user.set("invited_at", nowISO())
  user.set("invited_by", admin.id)
  app.save(user)

  inv.set("token", genToken())
  inv.set("status", "pending")
  inv.set("expires_at", addDaysISO(7))
  app.save(inv)

  sendInvitationEmail(app, inv, tempPassword)

  auditLog(app, {
    user: admin.id,
    action: "staff.invite_resend",
    resource: "staff_invitations",
    resourceId: inv.id,
    details: { email: inv.getString("email"), role: inv.getString("role") },
  })
  return inv
}

/// Admin-initiated password reset for an existing staff account. Generates a
/// new temp password, forces a change on next login, and emails the user.
function resetStaffPassword(app, admin, userId) {
  const user = app.findRecordById("users", userId)
  if (!user) throw new NotFoundError("User not found.")
  if (user.getString("role") === "customer") throw new BadRequestError("Password resets are for staff accounts.")

  const tempPassword = genPassword()
  user.set("password", tempPassword)
  user.set("passwordConfirm", tempPassword)
  user.set("must_change_password", true)
  user.set("password_changed_at", null)
  user.set("activated_at", null)
  app.save(user)

  // Create a fresh pending invitation so the lifecycle + resend stay intact.
  const invCol = app.findCollectionByNameOrId("staff_invitations")
  const invite = new Record(invCol)
  invite.set("email", user.getString("email"))
  invite.set("name", user.getString("name"))
  invite.set("token", genToken())
  invite.set("role", user.getString("role"))
  invite.set("branch", user.getString("branch") || "")
  invite.set("invited_by", admin.id)
  invite.set("user", user.id)
  invite.set("status", "pending")
  invite.set("expires_at", addDaysISO(7))
  app.save(invite)

  sendInvitationEmail(app, invite, tempPassword)

  auditLog(app, {
    user: admin.id,
    action: "staff.password_reset",
    resource: "users",
    resourceId: user.id,
    details: { target_email: user.getString("email"), via: "reset-password" },
  })
  return { user, invite }
}

module.exports = {
  nowISO, addDaysISO, SITE_BASE, genPassword, genToken, isAdminAuth, auditLog,
  findPendingInvite, sendInvitationEmail, createInvite, resendInvite, resetStaffPassword,
}