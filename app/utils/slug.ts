/** Central slug generation for all CMS-managed public content.
 *  Single source of truth on the frontend; pb_hooks/lib/slug_utils.js mirrors it
 *  on the PocketBase side. Keep the two implementations in sync. */

const MAX_SLUG_LENGTH = 80

/** Normalize a title/name into a URL-safe slug.
 *  - lowercase, NFD-normalized (accented chars stripped to ASCII)
 *  - punctuation/symbols removed, runs of separators collapsed to single hyphens
 *  - leading/trailing hyphens removed
 *  - capped at MAX_SLUG_LENGTH
 *  - never returns an empty string (falls back to `fallback`) */
export function slugify(text: string, fallback = 'item'): string {
  const base = String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, MAX_SLUG_LENGTH)
  return base || slugify(fallback, 'item')
}

/** Append a numeric suffix until the slug is not present in `taken`.
 *  qj-motor-srt-800 -> qj-motor-srt-800-2 -> qj-motor-srt-800-3 ... */
export function ensureUniqueSlug(base: string, taken: string[]): string {
  if (!taken.includes(base)) return base
  const root = base.replace(/-\d+$/, '')
  let i = 2
  let candidate = `${root}-${i}`
  while (taken.includes(candidate)) {
    i += 1
    candidate = `${root}-${i}`
  }
  return candidate
}

/** True when the value looks like a safe, well-formed slug. */
export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= MAX_SLUG_LENGTH
}
