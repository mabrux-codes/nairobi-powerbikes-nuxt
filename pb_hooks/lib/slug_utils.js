/// Shared slug helpers for the PB hooks.
/// Mirrors app/utils/slug.ts on the frontend — keep both in sync.
///
/// NOTE: PB JSVM hook callbacks run in isolated contexts and cannot access
/// module-level bindings, so callbacks must `require` this file explicitly.

const MAX_SLUG_LENGTH = 80

// Title field per collection — the hook callback runs in an isolated context
// (no closures), so the mapping lives here and is looked up by collection name.
const TITLE_FIELDS = {
  motorcycles: "name",
  accessories: "name",
  apparel: "name",
  blog_posts: "title",
  brands: "name",
  categories: "name",
  branches: "name",
  legal_pages: "title",
}

// Collections whose slug must NOT be unique: the slug identifies the DOCUMENT
// while the record represents a version (legal_pages: terms v1, v2, ...).
const UNIQUE_EXEMPT = {
  legal_pages: true,
}

function slugify(text, fallback) {
  const base = String(text == null ? "" : text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
  return base || slugify(fallback || "item", "item")
}

/// Find a slug that does not collide with any other record in the collection.
/// Sequential numeric suffixing: base, base-2, base-3, ...
function ensureUnique(app, collection, base, selfId, slugField) {
  const field = slugField || "slug"
  let candidate = base
  let i = 2
  // A fixed max loop protects against pathological duplicate sets.
  while (i <= 1000) {
    const rows = app.findRecordsByFilter(collection, field + " = {:v}", "", 1, 0, { v: candidate })
    if (rows.length === 0 || rows[0].id === selfId) return candidate
    const root = base.replace(/-\d+$/, "")
    candidate = root + "-" + i
    i += 1
  }
  return candidate
}

/// Enforce a non-empty, unique slug for a record.
/// - create: generate from the title field when the slug is blank
/// - update: keep an existing slug untouched (never silently rewrite a
///   published URL when a title changes); only generate when blank and only
///   uniquify when the slug was actually changed to a colliding value.
function normalizeSlug(e, opts) {
  const o = opts || {}
  const collection = o.collection || e.collection.name
  const titleField = o.titleField || TITLE_FIELDS[collection] || "name"
  const slugField = o.slugField || "slug"
  const unique = o.unique !== false && !UNIQUE_EXEMPT[collection]
  const r = e.record
  const current = r.getString(slugField)
  if (!current) {
    const base = slugify(r.getString(titleField))
    if (base) {
      r.set(slugField, unique ? ensureUnique(e.app, collection, base, r.id, slugField) : base)
    }
    return
  }
  if (!unique) return
  // If the slug changed (explicit admin action), make sure it is unique.
  let previous = ""
  try {
    previous = e.app.findRecordById(collection, r.id).getString(slugField)
  } catch (err) {
    // create request: record is not persisted yet, no previous value
  }
  if (current !== previous) {
    r.set(slugField, ensureUnique(e.app, collection, slugify(current, "item"), r.id, slugField))
  }
}

function isValidSlug(value) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value || "") && String(value || "").length <= MAX_SLUG_LENGTH
}

module.exports = { slugify, ensureUnique, normalizeSlug, isValidSlug, MAX_SLUG_LENGTH, TITLE_FIELDS, UNIQUE_EXEMPT }
