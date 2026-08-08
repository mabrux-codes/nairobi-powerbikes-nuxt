// Lightweight client-side HTML sanitizer for admin-authored announcement messages.
// Allows inline formatting (bold/italic/underline), line breaks and links only.
// Strips scripts, styles, event handlers and any unsafe URL schemes.

const ALLOWED_TAGS = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'BR', 'A', 'SPAN', 'P', 'DIV', 'UL', 'OL', 'LI'])
const ALLOWED_ATTRS: Record<string, string[]> = { A: ['href', 'title', 'target', 'rel'] }

function safeUrl(raw: string): string {
  const v = (raw || '').trim().replace(/[\u0000-\u0020\u007f-\u009f]/g, '')
  if (/^(https?:|mailto:|tel:|#)/i.test(v)) return v
  if (v.startsWith('/')) return v
  return ''
}

export function sanitizeHtml(input: string): string {
  if (typeof window === 'undefined' || !input) return ''
  const doc = new DOMParser().parseFromString(input, 'text/html')
  const walk = (node: Node): Node | null => {
    if (node.nodeType === Node.TEXT_NODE) return node
    if (node.nodeType !== Node.ELEMENT_NODE) return null
    const el = node as HTMLElement
    const tag = el.tagName.toUpperCase()
    if (!ALLOWED_TAGS.has(tag)) {
      // unwrap disallowed containers but keep their safe children inside a <span>
      const holder = document.createElement('span')
      Array.from(el.childNodes).forEach((c) => {
        const kept = walk(c)
        if (kept) holder.appendChild(kept)
      })
      return holder
    }
    const clone = document.createElement(el.tagName.toLowerCase())
    if (tag === 'A') {
      const href = safeUrl(el.getAttribute('href') || '')
      if (href) {
        clone.setAttribute('href', href)
        clone.setAttribute('rel', 'noopener noreferrer')
        if (/^https?:/i.test(href)) clone.setAttribute('target', '_blank')
      }
      const title = el.getAttribute('title')
      if (title) clone.setAttribute('title', title)
    }
    Array.from(el.childNodes).forEach((c) => {
      const kept = walk(c)
      if (kept) clone.appendChild(kept)
    })
    return clone
  }

  const cleaned = walk(doc.body)
  return (cleaned || doc.createElement('span')).innerHTML
}
