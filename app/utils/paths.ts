/** Canonical public URL builders. Slugs are preferred; record IDs are kept as
 *  a fallback for legacy links (the detail pages redirect ID URLs to slugs). */

export function bikePath(b: { slug?: string; id: string; name?: string }) {
  return `/motorcycles/${b.slug || encodeURIComponent(b.name || b.id)}`
}

export function accessoryPath(a: { slug?: string; id: string }) {
  return `/accessories/${a.slug || a.id}`
}

export function apparelPath(a: { slug?: string; id: string }) {
  return `/apparel/${a.slug || a.id}`
}

export function blogPath(p: { slug?: string; id?: string }) {
  return `/blog/${p.slug || p.id || ''}`
}
