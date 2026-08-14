import { shareText, currentShareUrl, type ShareData, type ShareType } from '~/utils/share'

// Global share modal state. A single <ShareModal /> is mounted in app.vue and
// observes this ref, so any component anywhere on the site can open the same
// share experience without wiring up its own modal.

interface ShareState {
  open: boolean
  data: ShareData | null
}

const state = ref<ShareState>({ open: false, data: null })

function metaContent(selector: string): string {
  if (!import.meta.client) return ''
  try {
    return document.querySelector(selector)?.getAttribute('content') || ''
  } catch {
    return ''
  }
}

function inferType(path: string): ShareType {
  if (path.startsWith('/motorcycles')) return 'motorcycle'
  if (path.startsWith('/accessories')) return 'accessory'
  if (path.startsWith('/apparel')) return 'apparel'
  if (path.startsWith('/blog')) return 'blog'
  if (path.includes('/service/booking')) return 'service'
  if (path.includes('/service/test-ride')) return 'test-ride'
  return 'page'
}

function cleanTitle(t: string): string {
  return t
    .replace(/\s+[–|-]\s*Nairobi Powerbikes\s*$/i, '')
    .replace(/\s+\|\s*Nairobi Powerbikes\s*$/i, '')
    .trim()
}

export function useShare() {
  function open(input: Partial<ShareData> = {}) {
    if (!import.meta.client) return
    const path = window.location.pathname
    const url = input.url || currentShareUrl()
    const type: ShareType = input.type || inferType(path)
    const title = (input.title || cleanTitle(document.title) || 'Nairobi Powerbikes').trim()
    const description = input.description || metaContent('meta[name="description"]')
    const image = input.image || metaContent('meta[property="og:image"]')
    const data: ShareData = {
      title,
      description,
      url,
      image,
      type,
      text: input.text || shareText({ title, type }),
    }
    state.value = { open: true, data }
  }

  function close() {
    state.value = { open: false, data: null }
  }

  return { state, open, close }
}