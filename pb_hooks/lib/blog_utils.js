/// Shared helpers for the blog hooks.
///
/// NOTE: PB JSVM hook callbacks run in isolated contexts and cannot access
/// module-level bindings, so callbacks must `require` this file explicitly.

function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function estimateReadingTime(content) {
  const words = String(content || "").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function normalizePost(e) {
  const r = e.record
  let status = r.getString("status") || (r.getBool("published") ? "published" : "draft")
  if (!["draft", "published", "scheduled", "archived"].includes(status)) status = "draft"
  r.set("status", status)

  const rawDate = r.getString("published_at")
  let pubDate = null
  if (rawDate) {
    const d = new Date(rawDate)
    if (!isNaN(d.getTime())) pubDate = d
  }

  const visible = status === "published" || (status === "scheduled" && pubDate && pubDate <= new Date())
  r.set("published", visible)
  if (status === "scheduled" && pubDate && pubDate <= new Date()) {
    r.set("status", "published")
  }

  if (!r.getString("slug")) {
    let slug = slugify(r.getString("title"))
    if (slug) {
      const dup = e.app.findRecordsByFilter("blog_posts", "slug = {:s}", "", 1, 0, { s: slug })
      if (dup.length > 0 && dup[0].id !== r.id) slug = slug + "-" + Math.random().toString(36).slice(2, 6)
      r.set("slug", slug)
    }
  }

  if (r.getInt("reading_time") <= 0) {
    r.set("reading_time", estimateReadingTime(r.getString("content")))
  }
}

function unfeatureOthers(e) {
  const others = e.app.findRecordsByFilter("blog_posts", "featured = true", "", 10, 0)
  others.forEach((o) => {
    if (o.id !== e.record.id) {
      o.set("featured", false)
      e.app.save(o)
    }
  })
}

function notifyIfPublished(e) {
  const { broadcastToRole } = require(__hooks + "/lib/notif_utils.js")
  const prev = e.app.store().get("npb_blog_prev_" + e.record.id)
  e.app.store().remove("npb_blog_prev_" + e.record.id)
  const wasPublished = prev ? prev.published : false
  const r = e.record
  if (r.getBool("published") && !wasPublished) {
    try {
      broadcastToRole(e.app, "admin", {
        type: "blog",
        title: "New Blog Article",
        message: `"${r.getString("title") || "Untitled"}" is now live on the website.`,
        link: "/dashboard/blog",
      })
    } catch (_) {}
  }
}

module.exports = { slugify, estimateReadingTime, normalizePost, unfeatureOthers, notifyIfPublished }