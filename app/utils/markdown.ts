/** Minimal, dependency-free markdown renderer for blog content.
 *  Supports: headings (##, ###), bold, italic, inline code, fenced/indented
 *  code, ordered/unordered lists, blockquotes, horizontal rules, links and
 *  automatic URL detection. Output is HTML (not escaped) — content comes from
 *  the admin CMS only. */

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function inline(s: string): string {
  return esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/!\[([^\]]*)\]\((https?:\/\/[^)\s]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-brand-red underline underline-offset-4">$1</a>')
    .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener" class="text-brand-red underline underline-offset-4">$1</a>')
}

export function renderMarkdown(src: string): string {
  const text = String(src || '')
  const lines = text.replace(/\r\n/g, '\n').split('\n')
  const out: string[] = []
  let list: { type: 'ul' | 'ol'; items: string[] } | null = null
  let inCode = false
  let codeBuf: string[] = []
  let para: string[] = []

  const closeList = () => {
    if (!list) return
    const tag = list.type
    out.push(`<${tag}>${list.items.map(i => `<li>${i}</li>`).join('')}</${tag}>`)
    list = null
  }
  const closePara = () => {
    if (para.length) {
      out.push(`<p>${para.map(inline).join('<br />')}</p>`)
      para = []
    }
  }
  const flushCode = () => {
    if (!inCode) return
    inCode = false
    out.push(`<pre><code>${esc(codeBuf.join('\n'))}</code></pre>`)
    codeBuf = []
  }

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '')

    if (line.startsWith('```')) {
      closeList()
      closePara()
      if (inCode) flushCode()
      else { inCode = true; codeBuf = [] }
      continue
    }

    if (inCode) { codeBuf.push(line); continue }

    if (/^\s{4}/.test(line)) {
      closeList(); closePara(); inCode = true; codeBuf = [line.replace(/^ {4}/, '')]
      continue
    }

    if (!line.trim()) { closeList(); closePara(); continue }

    const h2 = line.match(/^##\s+(.+)/)
    const h3 = line.match(/^###\s+(.+)/)
    if (h2 || h3) {
      closeList(); closePara()
      const t = inline(h2 ? h2[1] : h3![1])
      out.push(h2 ? `<h2>${t}</h2>` : `<h3>${t}</h3>`)
      continue
    }

    if (/^[-*]\s+/.test(line)) {
      closePara()
      if (!list || list.type !== 'ul') { closeList(); list = { type: 'ul', items: [] } }
      list.items.push(inline(line.replace(/^[-*]\s+/, '')))
      continue
    }

    if (/^\d+\.\s+/.test(line)) {
      closePara()
      if (!list || list.type !== 'ol') { closeList(); list = { type: 'ol', items: [] } }
      list.items.push(inline(line.replace(/^\d+\.\s+/, '')))
      continue
    }

    if (/^>\s*/.test(line)) {
      closeList(); closePara()
      out.push(`<blockquote>${inline(line.replace(/^>\s*/, ''))}</blockquote>`)
      continue
    }

    if (/^(-{3,}|\*{3,})$/.test(line)) {
      closeList(); closePara()
      out.push('<hr />')
      continue
    }

    closeList()
    para.push(line)
  }

  closeList()
  closePara()
  flushCode()
  return out.join('\n')
}
