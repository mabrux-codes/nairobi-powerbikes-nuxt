import { defineStore } from 'pinia'
import { usePB } from '~/composables/usePocketBase'

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: string
  image: string[]
  image_categories?: string[]
  main_image?: number
  tags: string
  published: boolean
  status: string
  featured: boolean
  category: string
  reading_time: number
  seo_title: string
  seo_description: string
  published_at: string
  created: string
  updated: string
}

export const useBlogStore = defineStore('blog', () => {
  const pb = usePB()

  const ready = ref(false)
  const status = ref<'connecting' | 'connected' | 'reconnecting'>('connecting')
  const lastUpdated = ref('')

  const posts = ref<BlogPost[]>([])

  let refCount = 0
  let initPromise: Promise<void> | null = null
  let subscribed = false

  function applyDelta(action: string, record: any) {
    if (!record) return
    const idx = posts.value.findIndex((r: any) => r.id === record.id)
    if (action === 'create') {
      if (idx === -1) posts.value.unshift(record)
    } else if (action === 'update') {
      if (idx > -1) posts.value[idx] = record
      else posts.value.unshift(record)
    } else if (action === 'delete') {
      if (idx > -1) posts.value.splice(idx, 1)
    }
  }

  function fetchAll() {
    return pb.collection('blog_posts').getFullList({ sort: '-created' }).then((rows: any[]) => {
      posts.value = rows as BlogPost[]
      lastUpdated.value = new Date().toLocaleString()
    }).catch(() => [])
  }

  function init() {
    if (initPromise) return initPromise
    initPromise = (async () => {
      status.value = 'connecting'
      try {
        pb.realtime.onDisconnect = () => { status.value = 'reconnecting' }
      } catch { /* realtime unavailable */ }

      try {
        await pb.collection('blog_posts').subscribe('PB_CONNECT', () => {
          status.value = 'connected'
          if (!ready.value) fetchAll().then(() => { ready.value = true }).catch(() => {})
        })
      } catch { /* ignore */ }

      await fetchAll()

      if (!subscribed) {
        subscribed = true
        try {
          pb.collection('blog_posts').subscribe('*', (e: any) => {
            applyDelta(e.action, e.record)
          })
        } catch { /* ignore */ }
      }

      status.value = 'connected'
      ready.value = true
    })()
    return initPromise
  }

  async function ensureActive() {
    refCount++
    await init()
  }

  function release() {
    refCount = Math.max(0, refCount - 1)
    if (refCount === 0 && subscribed) {
      subscribed = false
      try {
        pb.collection('blog_posts').unsubscribe('*')
      } catch { /* ignore */ }
      try {
        pb.realtime.onDisconnect = undefined
      } catch { /* ignore */ }
      ready.value = false
      initPromise = null
    }
  }

  async function refresh() {
    try {
      await fetchAll()
      status.value = 'connected'
    } catch { /* keep existing data */ }
  }

  return {
    ready, status, lastUpdated, posts,
    ensureActive, release, refresh,
  }
})
