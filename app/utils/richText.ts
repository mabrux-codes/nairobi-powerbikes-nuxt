/** Structured rich text (ProseMirror JSON) utilities shared by the editor,
 *  the public renderer and the legacy-content migration path.
 *
 *  Content authored with the CMS editor is stored as a JSON document in
 *  `content_json` and rendered client-side through Tiptap's schema. Legacy
 *  markdown (blog) and HTML (legal) content is converted once on the admin
 *  side; the conversion functions below are deterministic and safe by
 *  construction — they only ever map allowlisted tags, so no raw HTML ever
 *  reaches the rendered output from the migration path. */

import { renderMarkdown } from './markdown'
import { generateHTML } from '@tiptap/html'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Link } from '@tiptap/extension-link'
import { TextAlign } from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { Highlight } from '@tiptap/extension-highlight'
import { Image } from '@tiptap/extension-image'
import { Superscript } from '@tiptap/extension-superscript'
import { Subscript } from '@tiptap/extension-subscript'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'

export type RichMark = { type: string; attrs?: Record<string, string | number | boolean> }
export type RichNode = {
  type: string
  attrs?: Record<string, string | number | boolean>
  content?: RichNode[]
  marks?: RichMark[]
  text?: string
}
export type RichDoc = { type: 'doc'; content?: RichNode[] }

const ALLOWED_NODES = new Set([
  'doc', 'paragraph', 'heading', 'bulletList', 'orderedList', 'listItem',
  'blockquote', 'codeBlock', 'horizontalRule', 'hardBreak', 'text', 'image',
  'table', 'tableRow', 'tableCell', 'tableHeader',
])
const ALLOWED_MARKS = new Set([
  'bold', 'italic', 'strike', 'underline', 'code', 'link', 'textStyle',
  'highlight', 'superscript', 'subscript',
])
const MAX_DEPTH = 100
const BLOCK_TAGS = new Set(['H2', 'H3', 'H4', 'P', 'BLOCKQUOTE', 'PRE', 'UL', 'OL', 'LI', 'TABLE', 'TR', 'TD', 'TH', 'HR', 'DIV', 'SECTION', 'HEADER', 'FOOTER', 'MAIN', 'ARTICLE'])
const MARK_TAGS: Record<string, string> = {
  STRONG: 'bold', B: 'bold', EM: 'italic', I: 'italic', U: 'underline',
  S: 'strike', DEL: 'strike', CODE: 'code', SUP: 'superscript', SUB: 'subscript',
  MARK: 'highlight',
}

function safeUrl(raw: string): string {
  const v = String(raw || '').trim().replace(/[\u0000-\u0020\u007f-\u009f]/g, '')
  if (/^(https?:|mailto:|tel:|#)/i.test(v)) return v
  if (v.startsWith('/')) return v
  return ''
}

function parseColor(v: string): string {
  const s = String(v || '').trim()
  if (/^(#[0-9a-f]{3,8}|rgba?\([\d\s,.%]+\)|[\w]+)$/i.test(s)) return s
  return ''
}

/** Structural validation of an untrusted JSON doc before rendering/editing. */
export function isValidRichDoc(value: unknown): value is RichDoc {
  const check = (node: any, depth: number): boolean => {
    if (depth > MAX_DEPTH) return false
    if (!node || typeof node !== 'object' || Array.isArray(node)) return false
    if (typeof node.type !== 'string' || !ALLOWED_NODES.has(node.type)) return false
    if (node.attrs !== undefined && (typeof node.attrs !== 'object' || node.attrs === null)) return false
    if (node.marks !== undefined) {
      if (!Array.isArray(node.marks)) return false
      for (const m of node.marks) {
        if (!m || typeof m !== 'object' || typeof m.type !== 'string' || !ALLOWED_MARKS.has(m.type)) return false
        if (m.attrs !== undefined && (typeof m.attrs !== 'object' || m.attrs === null)) return false
      }
    }
    if (node.type === 'text') return typeof node.text === 'string'
    if (node.content !== undefined && !Array.isArray(node.content)) return false
    return !node.content || node.content.every((c: any) => check(c, depth + 1))
  }
  return !!(value && typeof value === 'object' && (value as any).type === 'doc' && check(value, 0))
}

/** Extract plain text from a validated doc (excerpt/reading-time fallbacks). */
export function richDocToText(doc: unknown): string {
  if (!isValidRichDoc(doc)) return ''
  const parts: string[] = []
  const BLOCK = new Set(['paragraph', 'heading', 'blockquote', 'listItem', 'codeBlock', 'tableCell', 'tableHeader'])
  const walk = (n: RichNode) => {
    if (n.type === 'text' && typeof n.text === 'string') parts.push(n.text)
    if (n.type === 'hardBreak') parts.push(' ')
    if (BLOCK.has(n.type)) parts.push('\n')
    n.content?.forEach(walk)
  }
  walk(doc)
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

/* ------------------------------------------------------------------ */
/* HTML → PM JSON conversion (legacy content migration, safe by allowlist) */

function imageToNode(el: Element): RichNode | null {
  const src = safeUrl(el.getAttribute('src') || '')
  if (!src) return null
  const attrs: Record<string, string> = { src }
  const alt = el.getAttribute('alt')
  const title = el.getAttribute('title')
  if (alt) attrs.alt = alt
  if (title) attrs.title = title
  return { type: 'image', attrs }
}

/** Flatten an element's inline content into text runs with accumulated marks. */
function inlineFrom(el: Node): RichNode[] {
  const out: RichNode[] = []
  for (const c of Array.from(el.childNodes)) {
    if (c.nodeType === Node.TEXT_NODE) {
      const text = (c.textContent || '').replace(/\s+/g, ' ')
      if (text) out.push({ type: 'text', text })
      continue
    }
    if (c.nodeType !== Node.ELEMENT_NODE) continue
    const tag = c.tagName.toUpperCase()
    if (tag === 'BR') { out.push({ type: 'hardBreak' }); continue }
    if (tag === 'IMG') { const n = imageToNode(c as Element); if (n) out.push(n); continue }
    if (tag === 'A') {
      const href = safeUrl((c as Element).getAttribute('href') || '')
      if (!href) continue
      inlineFrom(c).forEach((n) => out.push({ ...n, marks: [...(n.marks || []), { type: 'link', attrs: { href } }] }))
      continue
    }
    if (tag === 'SPAN') {
      const el = c as HTMLElement
      const color = parseColor(el.style?.color || '')
      const bg = parseColor(el.style?.backgroundColor || '')
      const marks: RichMark[] = []
      if (color) marks.push({ type: 'textStyle', attrs: { color } })
      if (bg) marks.push({ type: 'highlight', attrs: { color: bg } })
      inlineFrom(c).forEach((n) => out.push(marks.length ? { ...n, marks: [...(n.marks || []), ...marks] } : n))
      continue
    }
    if (MARK_TAGS[tag]) {
      const mark = { type: MARK_TAGS[tag] }
      inlineFrom(c).forEach((n) => out.push({ ...n, marks: [...(n.marks || []), mark] }))
      continue
    }
    // Unknown inline element: recurse, dropping the element itself.
    inlineFrom(c).forEach((n) => out.push(n))
  }
  return out
}

function inlineParagraph(runs: RichNode[]): RichNode[] {
  if (!runs.length) return []
  // Merge adjacent text runs to keep docs compact.
  const merged: RichNode[] = []
  for (const r of runs) {
    const prev = merged[merged.length - 1]
    if (prev && prev.type === 'text' && r.type === 'text' && JSON.stringify(prev.marks) === JSON.stringify(r.marks)) {
      prev.text = (prev.text || '') + (r.text || '')
    } else {
      merged.push({ ...r })
    }
  }
  return [{ type: 'paragraph', content: merged }]
}

function elementToNodes(el: Element): RichNode[] {
  const tag = el.tagName.toUpperCase()
  const childBlocks = (): RichNode[] => {
    const out: RichNode[] = []
    let run: RichNode[] = []
    const flush = () => { out.push(...inlineParagraph(run)); run = [] }
    for (const c of Array.from(el.childNodes)) {
      if (c.nodeType === Node.ELEMENT_NODE && BLOCK_TAGS.has((c as Element).tagName.toUpperCase())) {
        flush()
        out.push(...elementToNodes(c as Element))
      } else {
        run.push(...inlineFrom(c))
      }
    }
    flush()
    return out
  }

  switch (tag) {
    case 'H2': case 'H3': case 'H4': {
      const level = tag === 'H2' ? 2 : tag === 'H3' ? 3 : 4
      const runs = inlineFrom(el)
      return runs.length ? [{ type: 'heading', attrs: { level }, content: runs }] : []
    }
    case 'P': return inlineParagraph(inlineFrom(el))
    case 'BLOCKQUOTE': return [{ type: 'blockquote', content: childBlocks() }]
    case 'HR': return [{ type: 'horizontalRule' }]
    case 'PRE': {
      const code = Array.from(el.querySelectorAll('code')).pop() || el
      return [{ type: 'codeBlock', content: [{ type: 'text', text: code.textContent || '' }] }]
    }
    case 'UL': return [{ type: 'bulletList', content: childBlocks() }]
    case 'OL': return [{ type: 'orderedList', content: childBlocks() }]
    case 'LI': return [{ type: 'listItem', content: childBlocks() }]
    case 'TABLE': return [{ type: 'table', content: childBlocks() }]
    case 'TR': return [{ type: 'tableRow', content: childBlocks() }]
    case 'TD': return [{ type: 'tableCell', content: childBlocks() }]
    case 'TH': return [{ type: 'tableHeader', content: childBlocks() }]
    default: return childBlocks()
  }
}

/** Convert an arbitrary HTML string to a validated PM doc. Safe by construction. */
export function htmlToRichDoc(html: string): RichDoc | null {
  if (typeof document === 'undefined') return null
  const parsed = new DOMParser().parseFromString(String(html || ''), 'text/html')
  const content = Array.from(parsed.body.childNodes)
    .filter((c) => !(c.nodeType === Node.TEXT_NODE && !(c.textContent || '').trim()))
    .flatMap((c) => (c.nodeType === Node.ELEMENT_NODE ? elementToNodes(c as Element) : inlineParagraph(inlineFrom(c))))
  return { type: 'doc', content: content.length ? content : [{ type: 'paragraph' }] }
}

/** Convert legacy markdown (blog posts) to a validated PM doc. */
export function markdownToRichDoc(md: string): RichDoc | null {
  if (typeof document === 'undefined') return null
  return htmlToRichDoc(renderMarkdown(md))
}

/* ------------------------------------------------------------------ */
/* Rendering */

/** Render a validated doc to HTML (client-side; follows the app's ssr:false). */
export function richDocToHTML(doc: unknown): string {
  if (!isValidRichDoc(doc)) return ''
  const html = generateHTML(doc as any, buildExtensions() as any)
  return sanitizeRichHtml(html)
}

/** Belt-and-braces post-render sanitization: drop event handlers and unsafe hrefs/srcs. */
export function sanitizeRichHtml(html: string): string {
  if (typeof document === 'undefined') return html
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  parsed.querySelectorAll('*').forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (/^on/i.test(attr.name)) el.removeAttribute(attr.name)
    }
    if (el.tagName === 'A') {
      const href = safeUrl(el.getAttribute('href') || '')
      if (href) el.setAttribute('href', href)
      else el.removeAttribute('href')
    }
    if (el.tagName === 'IMG') {
      const src = safeUrl(el.getAttribute('src') || '')
      if (src) el.setAttribute('src', src)
      else el.removeAttribute('src')
      el.removeAttribute('srcset')
      el.removeAttribute('onerror')
    }
  })
  return parsed.body.innerHTML
}

/** Tiptap extensions shared by the editor and the public renderer. */
export function buildExtensions() {
  return [
    StarterKit.configure({ heading: { levels: [2, 3, 4] } }),
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      linkOnClick: false,
      HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      isAllowedUri: (url: string) => /^(https?:\/\/|mailto:|tel:|#|\/)/i.test(url || ''),
    }),
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    TextStyle,
    Color,
    Highlight,
    Image,
    Superscript,
    Subscript,
    Table.configure({ resizable: false }),
    TableRow,
    TableCell,
    TableHeader,
  ]
}
