/// <reference path="../pb_data/types.d.ts" />

/// Blog post lifecycle hooks.
///
/// - slug auto-generation + unique suffixing
/// - status normalization (scheduled -> published once the date passes)
/// - reading_time estimate
/// - single-featured exclusivity
/// - admin notification when a post becomes live
///
/// NOTE: PB JSVM hook callbacks run in isolated contexts and cannot see
/// module-level bindings, so everything is required/declared inside callbacks.

onRecordCreateRequest((e) => {
  const { normalizePost, unfeatureOthers } = require(__hooks + "/lib/blog_utils.js")
  normalizePost(e)
  if (e.record.getBool("featured")) unfeatureOthers(e)
  e.next()
}, "blog_posts")

onRecordUpdateRequest((e) => {
  const { normalizePost, unfeatureOthers } = require(__hooks + "/lib/blog_utils.js")
  e.app.store().set("npb_blog_prev_" + e.record.id, {
    status: e.record.getString("status"),
    published: e.record.getBool("published"),
  })
  normalizePost(e)
  if (e.record.getBool("featured")) unfeatureOthers(e)
  e.next()
}, "blog_posts")

onRecordAfterUpdateSuccess((e) => {
  const { notifyIfPublished } = require(__hooks + "/lib/blog_utils.js")
  notifyIfPublished(e)
  e.next()
}, "blog_posts")

onRecordAfterCreateSuccess((e) => {
  const { notifyIfPublished } = require(__hooks + "/lib/blog_utils.js")
  notifyIfPublished(e)
  e.next()
}, "blog_posts")