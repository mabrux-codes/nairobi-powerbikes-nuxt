/// Staff invitation & lifecycle hooks (PocketBase JSVM)
/// Helpers live in pb_hooks/lib/staff_utils.js (isolated handler contexts).
///
/// Responsibilities:
///  - POST /api/staff/invite  -> create user (temp password, must_change),
///    invitation row (token/expiry), enqueue branded invite email, audit.
///  - POST /api/staff/resend  -> regenerate token + temp password, re-send.
///  - On first self password change: clear must_change_password, stamp
///    activated_at/password_changed_at, mark invitation accepted.
///  - Block suspended users from refreshing tokens (login already blocked in
///    email_auth.pb.js) and reject further invites for suspended/removed roles.
///  - Audit every lifecycle transition into audit_logs.

// ---------------------------------------------------------------------------
// ADMIN ROUTES
// ---------------------------------------------------------------------------

routerAdd("POST", "/api/staff/invite", (c) => {
  const S = require(__hooks + "/lib/staff_utils.js")
  const info = c.requestInfo()
  const auth = info.auth
  if (!S.isAdminAuth(auth)) return c.json(401, { message: "Not authorized." })
  try {
    const body = info.body || {}
    const out = S.createInvite($app, auth, {
      email: body.email,
      name: body.name,
      phone: body.phone,
      role: body.role,
      branch: body.branch,
    })
    return c.json(200, {
      ok: true,
      invite: { id: out.invite.id, email: out.invite.getString("email"), role: out.invite.getString("role") },
    })
  } catch (err) {
    try { $app.logger().error("staff invite err: " + (err && err.message) + " :: " + (err && err.stack)) } catch (e2) {}
    return c.json(400, { message: (err && err.message) || "Invitation failed." })
  }
})

routerAdd("POST", "/api/staff/resend", (c) => {
  const S = require(__hooks + "/lib/staff_utils.js")
  const info = c.requestInfo()
  const auth = info.auth
  if (!S.isAdminAuth(auth)) return c.json(401, { message: "Not authorized." })
  try {
    const id = String((info.body || {}).id || "")
    if (!id) return c.json(400, { message: "Invitation id is required." })
    const inv = S.resendInvite($app, auth, id)
    return c.json(200, { ok: true, id: inv.id, email: inv.getString("email") })
  } catch (err) {
    const code = err && err.constructor && err.constructor.name
    return c.json(code === "NotFoundError" ? 404 : 400, { message: (err && err.message) || "Resend failed." })
  }
})

routerAdd("POST", "/api/staff/reset-password", (c) => {
  const S = require(__hooks + "/lib/staff_utils.js")
  const info = c.requestInfo()
  const auth = info.auth
  if (!S.isAdminAuth(auth)) return c.json(401, { message: "Not authorized." })
  try {
    const uid = String((info.body || {}).userId || "")
    if (!uid) return c.json(400, { message: "User id is required." })
    const out = S.resetStaffPassword($app, auth, uid)
    return c.json(200, { ok: true, id: out.invite.id, email: out.user.getString("email") })
  } catch (err) {
    const code = err && err.constructor && err.constructor.name
    return c.json(code === "NotFoundError" ? 404 : 400, { message: (err && err.message) || "Reset failed." })
  }
})

// ---------------------------------------------------------------------------
// FIRST-LOGIN PASSWORD FINALIZATION
// ---------------------------------------------------------------------------

/// When a staff member sets a brand-new password on an invited account, clear
/// the must-change flag, stamp activation, and accept the pending invitation.
/// Also stamps suspend/reactivate transitions and audits them.
onRecordUpdateRequest((e) => {
  const S = require(__hooks + "/lib/staff_utils.js")
  const r = e.record
  const isUserCollection = r.collection().name === "users"
  if (!isUserCollection) return e.next()

  const prev = e.app.findRecordById("users", r.id)
  const prevStatus = prev.getString("status")
  const nextStatus = r.getString("status") || prevStatus
  const info = e.requestInfo()
  const auth = info.auth

  // Suspend -> stamp actor + timestamp; reinstate -> clear them.
  if (nextStatus !== prevStatus) {
    if (nextStatus === "inactive") {
      r.set("suspended_at", new Date().toISOString())
      if (auth) r.set("suspended_by", auth.id)
      S.auditLog(e.app, {
        user: (auth && auth.id) || r.id,
        action: "staff.suspended",
        resource: "users",
        resourceId: r.id,
        details: { target_email: r.getString("email"), by: auth ? auth.id : "" },
      })
    } else if (nextStatus === "active") {
      r.set("suspended_at", null)
      r.set("suspended_by", null)
      S.auditLog(e.app, {
        user: (auth && auth.id) || r.id,
        action: "staff.reinstated",
        resource: "users",
        resourceId: r.id,
        details: { target_email: r.getString("email"), by: auth ? auth.id : "" },
      })
    }
  }

  const passwordChanging = (r.getString("password") || "").length > 0

  if (passwordChanging) {
    const selfChange = !!auth && auth.id === r.id
    if (selfChange) {
      r.set("must_change_password", false)
      if (!r.getString("activated_at")) r.set("activated_at", new Date().toISOString())
      r.set("password_changed_at", new Date().toISOString())
      const pending = S.findPendingInvite(e.app, r.id)
      if (pending) {
        pending.set("status", "accepted")
        pending.set("accepted_at", new Date().toISOString())
        e.app.save(pending)
      }
      S.auditLog(e.app, {
        user: r.id,
        action: "staff.password_changed",
        resource: "users",
        resourceId: r.id,
        details: { first_setup: true },
      })
    } else if (S.isAdminAuth(auth)) {
      // Admin resets a staff password -> force another change.
      r.set("must_change_password", true)
      r.set("password_changed_at", null)
      S.auditLog(e.app, {
        user: auth.id,
        action: "staff.password_reset",
        resource: "users",
        resourceId: r.id,
        details: { target_email: r.getString("email") },
      })
    }
  }
  e.next()
}, "_pb_users_auth_")

// ---------------------------------------------------------------------------
// SUSPENSION / LIFECYCLE GUARDS
// ---------------------------------------------------------------------------

/// Suspended accounts must not refresh existing tokens.
onRecordAuthRefreshRequest((e) => {
  if (!e.record) { e.next(); return }
  const r = e.record
  if (r.collection().name !== "users") { e.next(); return }
  if (r.getString("status") === "inactive") {
    throw new BadRequestError("Your account has been suspended. Please contact an administrator.")
  }
  e.next()
}, "_pb_users_auth_")

/// Track last login for reporting + audit (fired inside email_auth.pb.js
/// handler on valid password auth, since this PB build has no after-auth hook).