/// Centralized slug enforcement for every CMS-managed public entity.
///
/// Guarantees:
/// - every record has a non-empty, URL-safe slug
/// - slugs are unique within their collection (sequential -2, -3 suffixing)
/// - existing slugs are NEVER rewritten automatically when a title changes
/// - explicitly changed slugs are uniquified before saving
///
/// Collections with public detail pages / shareable URLs:
/// motorcycles, accessories, apparel, blog_posts, brands, categories,
/// branches, legal_pages
///
/// NOTE: PB JSVM hook callbacks run in isolated contexts and cannot access
/// module-level bindings, so callbacks must `require` this file explicitly.

/// Centralized slug enforcement for every CMS-managed public entity.
///
/// Guarantees:
/// - every record has a non-empty, URL-safe slug
/// - slugs are unique within their collection (sequential -2, -3 suffixing)
/// - existing slugs are NEVER rewritten automatically when a title changes
/// - explicitly changed slugs are uniquified before saving
///
/// Collections with public detail pages / shareable URLs:
/// motorcycles, accessories, apparel, blog_posts, brands, categories,
/// branches, legal_pages
///
/// NOTE: PB JSVM hook callbacks run in isolated contexts and cannot access
/// module-level bindings, so callbacks must `require` this file explicitly.

// legal_pages shares one slug across versions (the slug identifies the
// DOCUMENT, the version field identifies the record) -> uniqueness handled
// in slug_utils via UNIQUE_EXEMPT (no closures: hook callbacks run in
// isolated contexts and cannot see module-level bindings).
const COLLECTIONS = [
  "motorcycles", "accessories", "apparel", "blog_posts",
  "brands", "categories", "branches", "legal_pages",
]

for (const name of COLLECTIONS) {
  onRecordCreateRequest(handler, name)
  onRecordUpdateRequest(handler, name)
}

function handler(e) {
  const { normalizeSlug } = require(__hooks + "/lib/slug_utils.js")
  normalizeSlug(e)
  e.next()
}
