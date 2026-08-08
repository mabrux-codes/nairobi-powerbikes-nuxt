import { defineStore } from 'pinia'
import { usePB } from '~/composables/usePocketBase'

export type AnnouncementPriority = 'highest' | 'high' | 'normal' | 'low'
export type AnnouncementStatus = 'draft' | 'published' | 'scheduled' | 'expired' | 'archived'

export interface Announcement {
  id: string
  title: string
  message: string
  icon: string
  priority: AnnouncementPriority
  status: AnnouncementStatus
  enabled: boolean
  publishImmediately: boolean
  scheduledStart: string
  scheduledEnd: string
  createdBy: string
  updatedBy: string
  created: string
  updated: string
}

const PRIORITY_RANK: Record<string, number> = { highest: 4, high: 3, normal: 2, low: 1 }
const CONFIG_KEY = 'announcements_enabled'

function toLocalISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}

// Real-time announcement system shared by the public bar and the admin console.
// The public client only ever receives published+enabled records (listRule);
// admins see everything. All announcement events are streamed so that edits,
// disable/enable, unpublish and expiry are reflected instantly.
export const useAnnouncementsStore = defineStore('announcements', () => {
  const pb = usePB()

  const items = ref<Announcement[]>([])
  const masterEnabled = ref(true)
  const ready = ref(false)
  const now = ref(Date.now())

  let subscribed = false
  let fetchPromise: Promise<void> | null = null
  let tickerTimer: ReturnType<typeof setInterval> | null = null

  function mapRecord(r: any): Announcement {
    return {
      id: r.id,
      title: r.title || '',
      message: r.message || '',
      icon: r.icon || '',
      priority: (r.priority as AnnouncementPriority) || 'normal',
      status: (r.status as AnnouncementStatus) || 'draft',
      enabled: !!r.enabled,
      publishImmediately: !!r.publishImmediately,
      scheduledStart: r.scheduledStart || '',
      scheduledEnd: r.scheduledEnd || '',
      createdBy: r.createdBy || '',
      updatedBy: r.updatedBy || '',
      created: r.created || '',
      updated: r.updated || '',
    }
  }

  function sortItems(list: Announcement[]) {
    return list.slice().sort((a, b) => {
      const pa = PRIORITY_RANK[a.priority] || 0
      const pb = PRIORITY_RANK[b.priority] || 0
      if (pa !== pb) return pb - pa
      const ta = a.created ? new Date(a.created).getTime() : 0
      const tb = b.created ? new Date(b.created).getTime() : 0
      return tb - ta
    })
  }

  // Only announcements that should appear on the public bar
  const visibleAnnouncements = computed(() => {
    return sortItems(items.value.filter((a) => {
      if (!a.enabled) return false
      const start = a.scheduledStart ? new Date(a.scheduledStart).getTime() : null
      const end = a.scheduledEnd ? new Date(a.scheduledEnd).getTime() : null
      const n = now.value
      if (start !== null && start > n) return false
      if (end !== null && end < n) return false
      if (a.status === 'published') return true
      // scheduled announcements whose start has arrived count as visible until cron catches up
      if (a.status === 'scheduled' && start !== null && start <= n) return true
      return false
    }))
  })

  const isEnabled = computed(() => masterEnabled.value && visibleAnnouncements.value.length > 0)

  async function readMasterToggle() {
    try {
      const res = await pb.collection('site_config').getList(1, 1, {
        filter: pb.filter('key = {:k}', { k: CONFIG_KEY }),
      })
      const rec = (res.items as any[])[0]
      masterEnabled.value = rec ? rec.value !== 'false' : true
    } catch { /* best effort */ }
  }

  async function doFetch() {
    try {
      const res = await pb.collection('announcements').getList(1, 200, { sort: '-created' })
      items.value = sortItems((res.items as any[]).map(mapRecord))
    } catch { /* best effort */ }
    await readMasterToggle()
    ready.value = true
  }

  function load(): Promise<void> {
    if (fetchPromise) return fetchPromise
    fetchPromise = doFetch().finally(() => { fetchPromise = null })
    return fetchPromise
  }

  function handleRealtime(e: { action: string; record: any }) {
    const rec = e.record as any
    if (e.action === 'delete') {
      items.value = items.value.filter(a => a.id !== rec.id)
    } else if (e.action === 'create') {
      if (!items.value.some(a => a.id === rec.id)) {
        items.value = sortItems([mapRecord(rec), ...items.value])
      }
    } else if (e.action === 'update') {
      const idx = items.value.findIndex(a => a.id === rec.id)
      const mapped = mapRecord(rec)
      if (idx >= 0) items.value[idx] = mapped
      else items.value = sortItems([mapped, ...items.value])
    }
  }

  async function subscribe() {
    if (subscribed) return
    try {
      await pb.collection('announcements').subscribe('*', handleRealtime)
      await pb.collection('site_config').subscribe('*', (e) => {
        const rec = e.record as any
        if (rec?.key === CONFIG_KEY) {
          masterEnabled.value = e.action === 'delete' ? true : rec.value !== 'false'
        }
      })
      subscribed = true
    } catch { /* best effort */ }
  }

  async function init() {
    await load()
    await subscribe()
    if (!tickerTimer) {
      tickerTimer = setInterval(() => { now.value = Date.now() }, 30000)
    }
  }

  return {
    items,
    ready,
    masterEnabled,
    isEnabled,
    visibleAnnouncements,
    init,
    load,
    toLocalISO,
  }
})

export { toLocalISO }
