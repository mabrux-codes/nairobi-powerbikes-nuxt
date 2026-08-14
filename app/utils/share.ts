// Global share service — the single source of truth for sharing content on
// the Nairobi Powerbikes website. Both ShareButton and ShareModal consume this
// module; no page should implement its own share logic.

export type ShareType =
  | 'motorcycle'
  | 'accessory'
  | 'apparel'
  | 'blog'
  | 'service'
  | 'test-ride'
  | 'page'

export interface ShareData {
  title: string
  description?: string
  url: string
  image?: string
  type: ShareType
  text: string
}

export interface SharePlatform {
  id: string
  name: string
  label: string
  brand?: string
  svg?: string
  lucide?: 'Mail' | 'Link2'
}

export const PRODUCTION_ORIGIN = 'https://www.nairobi-powerbikes.co.ke'

// --- Brand icons (simple-icons paths, 24x24 viewBox) ------------------------

const ICON_WHATSAPP = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'
const ICON_FACEBOOK = 'M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z'
const ICON_X = 'M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z'
const ICON_THREADS = 'M18.263 11.097c-.03-3.486-1.92-5.586-5.111-5.586-2.13 0-3.922.963-4.863 2.499l2.062 1.438c.535-.843 1.272-1.543 2.628-1.543 1.528 0 2.318.85 2.544 2.431a15 15 0 0 0-2.236-.173c-4.125 0-6.068 1.867-6.068 4.336s1.943 3.99 4.804 3.99c3.139 0 5.013-2.115 5.781-4.735.798.361 1.348 1.204 1.348 2.47 0 3.387-3.907 5.232-7.22 5.232-4.885 0-8.077-3.207-8.077-8.424 0-6.392 4.223-10.487 9.9-10.487 3.808 0 5.69 1.671 6.97 3.914l2.108-1.475C21.44 2.078 18.331 0 13.663 0 6.227 0 1.168 5.277 1.168 12.934c0 7 4.953 11.066 10.856 11.066 4.878 0 9.809-2.846 9.809-7.716 0-2.545-1.46-4.231-3.569-5.187m-6.33 4.855c-1.077 0-2.026-.512-2.026-1.453 0-1.483 1.822-1.934 3.606-1.934.678 0 1.34.045 1.927.173-.422 1.927-1.671 3.215-3.508 3.214Z'
const ICON_INSTAGRAM = 'M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077'
const ICON_TELEGRAM = 'M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z'
const ICON_LINKEDIN = 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z'

export const BRAND_PATHS: Record<string, string> = {
  whatsapp: ICON_WHATSAPP,
  facebook: ICON_FACEBOOK,
  x: ICON_X,
  threads: ICON_THREADS,
  instagram: ICON_INSTAGRAM,
  telegram: ICON_TELEGRAM,
  linkedin: ICON_LINKEDIN,
}

export const SHARE_PLATFORMS: SharePlatform[] = [
  { id: 'whatsapp', name: 'WhatsApp', label: 'Share on WhatsApp', brand: '#25D366', svg: ICON_WHATSAPP },
  { id: 'facebook', name: 'Facebook', label: 'Share on Facebook', brand: '#1877F2', svg: ICON_FACEBOOK },
  { id: 'x', name: 'X', label: 'Share on X', brand: '#FFFFFF', svg: ICON_X },
  { id: 'threads', name: 'Threads', label: 'Share on Threads', brand: '#FFFFFF', svg: ICON_THREADS },
  { id: 'instagram', name: 'Instagram', label: 'Share on Instagram', brand: '#E4405F', svg: ICON_INSTAGRAM },
  { id: 'telegram', name: 'Telegram', label: 'Share on Telegram', brand: '#26A5E4', svg: ICON_TELEGRAM },
  { id: 'linkedin', name: 'LinkedIn', label: 'Share on LinkedIn', brand: '#0A66C2', svg: ICON_LINKEDIN },
  { id: 'email', name: 'Email', label: 'Share by Email', lucide: 'Mail' },
]

// --- URL helpers -------------------------------------------------------------

/**
 * Absolute URL of the current page, suitable for sharing.
 * Localhost origins are only allowed in development; a production build
 * served from localhost falls back to the public domain so no share link
 * ever leaks a localhost URL to recipients.
 */
export function currentShareUrl(): string {
  if (!import.meta.client) return ''
  try {
    const { href, hostname, pathname, search } = window.location
    const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0'
    if (import.meta.prod && isLocal) {
      let site = ''
      try {
        const config = useRuntimeConfig()
        site = String(config.public.siteUrl || '').replace(/\/$/, '')
      } catch { /* config unavailable */ }
      return `${site || PRODUCTION_ORIGIN}${pathname}${search}`
    }
    return href
  } catch {
    return ''
  }
}

// --- Share text --------------------------------------------------------------

export function shareText(data: { title: string; type: ShareType }): string {
  const t = data.title.trim()
  switch (data.type) {
    case 'motorcycle':
      return `Check out the ${t} at Nairobi Powerbikes.`
    case 'accessory':
      return `Check out this motorcycle accessory from Nairobi Powerbikes: ${t}.`
    case 'apparel':
      return `Check out this riding gear from Nairobi Powerbikes: ${t}.`
    case 'blog':
      return `I found this article from Nairobi Powerbikes: ${t}.`
    case 'service':
      return 'Book a motorcycle service with Nairobi Powerbikes.'
    case 'test-ride':
      return 'Book a test ride with Nairobi Powerbikes.'
    default:
      return `Check out ${t || 'Nairobi Powerbikes'} at Nairobi Powerbikes.`
  }
}

// --- Platform share URLs -----------------------------------------------------

export function platformShareUrl(id: string, data: ShareData): string {
  const u = encodeURIComponent(data.url)
  const t = encodeURIComponent(data.text || data.title)
  switch (id) {
    case 'whatsapp':
      return `https://wa.me/?text=${encodeURIComponent(`${data.text} ${data.url}`)}`
    case 'facebook':
      return `https://www.facebook.com/sharer/sharer.php?u=${u}`
    case 'x':
      return `https://twitter.com/intent/tweet?url=${u}&text=${t}`
    case 'threads':
      return `https://www.threads.net/intent/post?text=${encodeURIComponent(`${data.text} ${data.url}`)}`
    case 'linkedin':
      return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`
    case 'telegram':
      return `https://t.me/share/url?url=${u}&text=${t}`
    case 'email':
      return `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(`${data.text}\n\n${data.url}`)}`
    default:
      return ''
  }
}

// --- Clipboard ---------------------------------------------------------------

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch { /* fall through to legacy path */ }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '-9999px'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    ta.setSelectionRange(0, ta.value.length)
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

// --- Web Share API -----------------------------------------------------------

export function canNativeShare(): boolean {
  return import.meta.client && typeof navigator !== 'undefined' && typeof navigator.share === 'function'
}

export type NativeShareResult = 'shared' | 'cancelled' | 'unavailable' | 'failed'

export async function nativeShare(data: ShareData): Promise<NativeShareResult> {
  if (!canNativeShare()) return 'unavailable'
  try {
    await navigator.share({ title: data.title, text: data.text, url: data.url })
    return 'shared'
  } catch (e: any) {
    if (e && (e.name === 'AbortError' || e.name === 'NotAllowedError')) return 'cancelled'
    return 'failed'
  }
}

/** Open a popup window for URL-based platforms. Returns false on popup block. */
export function openSharePopup(url: string): boolean {
  if (!url) return false
  try {
    const w = window.open(url, '_blank', 'noopener,noreferrer,width=640,height=640')
    return !!w
  } catch {
    return false
  }
}