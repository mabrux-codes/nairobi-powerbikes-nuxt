/// Announcements server-side hooks (PocketBase JSVM)
/// - publishImmediately -> force publish on create
/// - scheduled announcements auto-publish when start passes
/// - published announcements auto-expire when end passes (cron, ~every minute)

// Apply status transitions before the first save (createdBy is sent by the client)
onRecordCreate((e) => {
  const r = e.record
  const now = new Date().toISOString()
  if (r.getBool("publishImmediately")) {
    r.set("status", "published")
    r.set("enabled", true)
  } else {
    const start = r.getString("scheduledStart")
    const end = r.getString("scheduledEnd")
    const status = r.getString("status")
    if (status === "scheduled" && start && start <= now) {
      r.set("status", "published")
    } else if (status === "published" && end && end <= now) {
      r.set("status", "expired")
    }
  }
  e.next()
}, "announcements")

// Set updatedBy + apply status transitions on update
onRecordUpdateRequest((e) => {
  const r = e.record
  const auth = e.auth
  // only users collection auth (not _superusers) has a valid relation id
  if (auth && auth.id && auth.collection().name === "users") {
    r.set("updatedBy", auth.id)
  }

  try {
    const old = e.app.findRecordById("announcements", r.id)
    e.app.store().set("npb_ann_prev_" + r.id, {
      status: old.getString("status"),
      enabled: old.getBool("enabled"),
    })
  } catch (err) { /* record missing */ }

  const now = new Date().toISOString()
  if (r.getBool("publishImmediately")) {
    r.set("status", "published")
    r.set("enabled", true)
  } else {
    const start = r.getString("scheduledStart")
    const end = r.getString("scheduledEnd")
    const status = r.getString("status")
    if (status === "scheduled" && start && start <= now) {
      r.set("status", "published")
    } else if (status === "published" && end && end <= now) {
      r.set("status", "expired")
    }
  }
  e.next()
}, "announcements")

// Periodic sweep: auto-publish scheduled + auto-expire published
if (typeof cronAdd === "function") {
  cronAdd("npb_announcements_tick", "* * * * *", () => {
    const s = new Date().toISOString()
    const sched = $app.findRecordsByFilter("announcements", "status = {:st} && scheduledStart != '' && scheduledStart <= {:n}", "", 500, 0, { st: "scheduled", n: s })
    for (const r of sched) {
      r.set("status", "published")
      $app.save(r)
    }
    const exp = $app.findRecordsByFilter("announcements", "status = {:st} && scheduledEnd != '' && scheduledEnd <= {:n}", "", 500, 0, { st: "published", n: s })
    for (const r of exp) {
      r.set("status", "expired")
      $app.save(r)
    }
  })
}
