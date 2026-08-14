/// <reference path="../pb_data/types.d.ts" />

/// CMS architecture migration:
/// - add structured rich-text (ProseMirror JSON) storage: content_json
/// - backfill empty slugs on every slug-bearing collection
/// - enforce unique slugs at the database level
///
/// Existing `content` (blog markdown) and `body` (legal HTML) fields are kept
/// untouched for backward compatibility — the frontend prefers content_json
/// and falls back to the legacy fields for already-published records.

const SLUG_COLLECTIONS = [
  { name: "motorcycles", titleField: "name" },
  { name: "accessories", titleField: "name" },
  { name: "apparel", titleField: "name" },
  { name: "blog_posts", titleField: "title" },
  { name: "brands", titleField: "name" },
  { name: "categories", titleField: "name" },
  { name: "branches", titleField: "name" },
  { name: "legal_pages", titleField: "title" },
]

const MAX_SLUG_LENGTH = 80

function slugify(text) {
  return String(text == null ? "" : text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
}

function backfillSlugs(app, collectionName, titleField) {
  const records = app.findRecordsByFilter(collectionName, "", "", 0, 0)
  const used = new Set(records.map((r) => r.getString("slug")).filter(Boolean))
  let changed = false
  for (const r of records) {
    let slug = r.getString("slug")
    if (!slug) {
      let base = slugify(r.getString(titleField))
      if (!base) base = "item"
      let candidate = base
      let i = 2
      while (used.has(candidate)) {
        const root = base.replace(/-\d+$/, "")
        candidate = root + "-" + i
        i += 1
      }
      r.set("slug", candidate)
      used.add(candidate)
      changed = true
    }
  }
  if (changed) {
    for (const r of records) app.save(r)
  }
}

migrate((app) => {
  // 1. content_json (structured rich text) on blog_posts + legal_pages
  for (const name of ["blog_posts", "legal_pages"]) {
    const c = app.findCollectionByNameOrId(name)
    if (!c.fields.getByName("content_json")) {
      c.fields.add(new JSONField({ name: "content_json", maxSize: 4 * 1024 * 1024, required: false }))
    }
    app.save(c)
  }

  // 2. backfill empty slugs (must run before enabling unique constraints)
  for (const cfg of SLUG_COLLECTIONS) {
    backfillSlugs(app, cfg.name, cfg.titleField)
  }

  // 3. unique slug fields at the database level
  for (const cfg of SLUG_COLLECTIONS) {
    const c = app.findCollectionByNameOrId(cfg.name)
    const slugField = c.fields.getByName("slug")
    if (slugField && slugField.type === "text" && !slugField.unique) {
      slugField.unique = true
      app.save(c)
    }
  }
}, (app) => {
  for (const name of ["blog_posts", "legal_pages"]) {
    const c = app.findCollectionByNameOrId(name)
    c.fields.removeByName("content_json")
    app.save(c)
  }
  for (const cfg of SLUG_COLLECTIONS) {
    const c = app.findCollectionByNameOrId(cfg.name)
    const slugField = c.fields.getByName("slug")
    if (slugField && slugField.type === "text") {
      slugField.unique = false
      app.save(c)
    }
  }
})
