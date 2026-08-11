/// <reference path="../pb_data/types.d.ts" />

/// Email automations — scheduled reminders & follow-ups.
/// A daily cron evaluates email_automations config + built-in rules.
/// Admin can also trigger a manual run via POST /api/email/automations/run.

// --- daily automation pass ---
cronAdd("email-automations", "0 6 * * *", () => {
  try {
    const auto = require(__hooks + "/lib/email/automations.js")
    auto.runAll($app)
  } catch (e) {
    $app.logger().error("email-automations cron: " + (e && e.message))
  }
})

// --- admin manual run ---
routerAdd("POST", "/api/email/automations/run", (c) => {
  const info = c.requestInfo()
  const auth = info.auth
  const isAdmin = !!auth && (auth.getString("role") === "admin" || auth.collection().name === "_superusers")
  if (!isAdmin) return c.json(401, { message: "Not authorized." })
  try {
    const auto = require(__hooks + "/lib/email/automations.js")
    auto.runAll($app)
    return c.json(200, { ok: true, message: "Automations run complete." })
  } catch (err) {
    return c.json(500, { message: (err && err.message) || "Automations run failed." })
  }
})
