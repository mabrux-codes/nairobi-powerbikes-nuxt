/// Shared helpers for the blog hooks.
///
/// NOTE: PB JSVM hook callbacks run in isolated contexts and cannot access
/// module-level bindings, so callbacks must `require` this file explicitly.

function estimateReadingTime(content) {
  const words = String(content || "").split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function normalizePost(e) {
  const { slugify, ensureUnique } = require(__hooks + "/lib/slug_utils.js")
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
    const base = slugify(r.getString("title"))
    if (base) {
      r.set("slug", ensureUnique(e.app, "blog_posts", base, r.id))
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
    try {
      const marketing = require(__hooks + "/lib/email/marketing.js")
      const tpl = require(__hooks + "/lib/email/templates.js")
      const site = marketing.siteBase(e.app)
      const image = (() => {
        try {
          const multi = e.app.findRecordById("blog_posts", r.id)
          const imgs = multi ? multi.getStringSlice("images") : []
          if (imgs.length > 0) return e.app.files().getURL(multi, imgs[0], { thumb: "800x0" })
          if (r.getString("image")) return e.app.files().getURL(r, r.getString("image"), { thumb: "800x0" })
        } catch (err) {}
        return ""
      })()
      const vars = tpl.deepMergeVars({}, {
        blogTitle: r.getString("title") || "A fresh read",
        blogExcerpt: r.getString("excerpt") || "",
        blogCategory: r.getString("category") || "Riding Culture",
        blogReadingTime: String(r.getInt("reading_time") || 3) + " min read",
        blogUrl: site + "/blog/" + (r.getString("slug") || r.id),
        blogImage: image,
      })
      marketing.broadcastMarketing(e.app, {
        template: "new_blog_article",
        campaignCategory: "blog",
        subject: "New from the garage: " + vars.blogTitle,
        vars,
        idempotencyKey: "blog-published:" + r.id,
        relatedType: "blog_post",
        relatedId: r.id,
      })
    } catch (err) {
      e.app.logger().error("blog email: " + (err && err.message))
    }
  }
}

module.exports = { estimateReadingTime, normalizePost, unfeatureOthers, notifyIfPublished }