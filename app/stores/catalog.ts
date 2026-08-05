import { defineStore } from 'pinia'
import { usePB } from '~/composables/usePocketBase'

export interface CatalogRecord {
  id: string
  [key: string]: any
}

export const useCatalogStore = defineStore('catalog', () => {
  const pb = usePB()

  const ready = ref(false)
  const status = ref<'connecting' | 'connected' | 'reconnecting'>('connecting')
  const lastUpdated = ref('')

  const motorcycles = ref<CatalogRecord[]>([])
  const brands = ref<CatalogRecord[]>([])
  const categories = ref<CatalogRecord[]>([])
  const accessories = ref<CatalogRecord[]>([])
  const apparel = ref<CatalogRecord[]>([])

  let refCount = 0
  let initPromise: Promise<void> | null = null
  let subscribed = false

  const COLLECTIONS = {
    motorcycles,
    brands,
    categories,
    accessories,
    apparel,
  }

  function sortBy(arr: any[], key: string, dir: 1 | -1 = -1) {
    return [...arr].sort((a, b) => {
      const va = a[key] ?? ''
      const vb = b[key] ?? ''
      return va > vb ? dir : va < vb ? -dir : 0
    })
  }

  function applyDelta(coll: keyof typeof COLLECTIONS, action: string, record: any) {
    if (!record) return
    const list = COLLECTIONS[coll]
    const idx = list.value.findIndex((r: any) => r.id === record.id)
    if (action === 'create') {
      if (idx === -1) list.value.unshift(record)
    } else if (action === 'update') {
      if (idx > -1) list.value[idx] = record
      else list.value.unshift(record)
    } else if (action === 'delete') {
      if (idx > -1) list.value.splice(idx, 1)
    }
  }

  function handleEvent(coll: string, action: string, record: any) {
    applyDelta(coll as keyof typeof COLLECTIONS, action, record)
  }

  function fetchAll() {
    const opts = { sort: '-created' }
    return Promise.all([
      pb.collection('motorcycles').getFullList({ ...opts, expand: 'brand,category' }).catch(() => []),
      pb.collection('brands').getFullList({ sort: 'name' }).catch(() => []),
      pb.collection('categories').getFullList({ sort: 'name' }).catch(() => []),
      pb.collection('accessories').getFullList(opts).catch(() => []),
      pb.collection('apparel').getFullList(opts).catch(() => []),
    ]).then(([mc, br, ca, ac, ap]: any[]) => {
      motorcycles.value = sortBy(mc, 'created', -1)
      brands.value = sortBy(br, 'name', 1)
      categories.value = sortBy(ca, 'name', 1)
      accessories.value = sortBy(ac, 'created', -1)
      apparel.value = sortBy(ap, 'created', -1)
      lastUpdated.value = new Date().toLocaleString()
    })
  }

  function init() {
    if (initPromise) return initPromise
    initPromise = (async () => {
      status.value = 'connecting'
      try {
        pb.realtime.onDisconnect = () => { status.value = 'reconnecting' }
      } catch { /* realtime unavailable */ }

      try {
        await pb.collection('motorcycles').subscribe('PB_CONNECT', () => {
          status.value = 'connected'
          if (!ready.value) fetchAll().then(() => { ready.value = true }).catch(() => {})
        })
      } catch { /* ignore */ }

      await fetchAll()

      if (!subscribed) {
        subscribed = true
        for (const coll of Object.keys(COLLECTIONS)) {
          try {
            pb.collection(coll).subscribe('*', (e: any) => {
              handleEvent(coll, e.action, e.record)
            })
          } catch { /* ignore */ }
        }
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
        pb.collection('motorcycles').unsubscribe('*')
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
    ready, status, lastUpdated,
    motorcycles, brands, categories, accessories, apparel,
    ensureActive, release, refresh,
  }
})
