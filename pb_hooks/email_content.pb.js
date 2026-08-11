/// <reference path="../pb_data/types.d.ts" />

/// Content marketing emails: announcements.
/// Sends a branded announcement broadcast whenever a record becomes published
/// for the first time (create or draft/scheduled -> published transition).
///
/// Blog emails live in the existing blog hooks (blog_utils.notifyIfPublished);
/// chat emails live in the existing chat.pb.js handlers.

function announceEmailVars(app, r) {
  const marketing = require(__hooks + "/lib/email/marketing.js")
  const site = marketing.siteBase(app)
  return {
    announcementTitle: r.getString("title") || "Announcement",
    announcementMessage: r.getString("message") || "",
    announcementUrl: site + "/",
    announcementCta: "Learn More",
  }
}

// Created directly in a published state (publishImmediately)
onRecordAfterCreateSuccess((e) => {
  e.next()
  const r = e.record
  try {
    if (r.getString("status") !== "published") return
    const marketing = require(__hooks + "/lib/email/marketing.js")
    marketing.broadcastMarketing(e.app, {
      template: "announcement",
      campaignCategory: "promotions",
      category: "marketing",
      subject: r.getString("title") || "Nairobi Powerbikes announcement",
      vars: announceEmailVars(e.app, r),
      idempotencyKey: "announcement:" + r.id,
      relatedType: "announcement",
      relatedId: r.id,
    })
  } catch (err) {
    e.app.logger().error("announcement email (create): " + (err && err.message))
  }
}, "announcements")

// Transitioned to published on update (manual or cron-triggered)
onRecordAfterUpdateSuccess((e) => {
  e.next()
  const r = e.record
  try {
    if (r.getString("status") !== "published") return
    const prev = e.app.store().get("npb_ann_prev_" + r.id)
    e.app.store().remove("npb_ann_prev_" + r.id)
    if (prev && prev.status === "published") return
    const marketing = require(__hooks + "/lib/email/marketing.js")
    marketing.broadcastMarketing(e.app, {
      template: "announcement",
      campaignCategory: "promotions",
      category: "marketing",
      subject: r.getString("title") || "Nairobi Powerbikes announcement",
      vars: announceEmailVars(e.app, r),
      idempotencyKey: "announcement:" + r.id,
      relatedType: "announcement",
      relatedId: r.id,
    })
  } catch (err) {
    e.app.logger().error("announcement email (update): " + (err && err.message))
  }
}, "announcements")