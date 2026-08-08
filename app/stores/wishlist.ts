import { defineStore } from 'pinia'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

export type WishlistKind = 'bike' | 'accessory' | 'apparel'

const LS_KEY = 'npb_wishlist'

export const useWishlistStore = defineStore('wishlist', () => {
  const pb = usePB()
  const toast = useToast()
  const auth = useAuthStore()

  // motorcycleId -> favorite record id (server-backed, per authenticated user)
  const favorites = ref<Record<string, string>>({})
  // device-local only (accessories/apparel have no server persistence)
  const local = ref<{ accessory: string[]; apparel: string[] }>({ accessory: [], apparel: [] })
  const ready = ref(false)

  const count = computed(() => Object.keys(favorites.value).length)

  function readLocal() {
    if (!import.meta.client) return { accessory: [], apparel: [] }
    try {
      const data = JSON.parse(localStorage.getItem(LS_KEY) || '{}')
      return { accessory: data.accessory || [], apparel: data.apparel || [] }
    } catch {
      return { accessory: [], apparel: [] }
    }
  }

  function writeLocal() {
    if (!import.meta.client) return
    localStorage.setItem(LS_KEY, JSON.stringify({ accessory: local.value.accessory, apparel: local.value.apparel }))
  }

  function localSet(kind: 'accessory' | 'apparel', id: string, saved: boolean) {
    const arr = local.value[kind] || []
    local.value[kind] = saved
      ? (arr.includes(id) ? arr : [...arr, id])
      : arr.filter(x => x !== id)
    writeLocal()
  }

  function isSaved(kind: WishlistKind, id: string): boolean {
    if (kind === 'bike') return !!favorites.value[id]
    return local.value[kind]?.includes(id) || false
  }

  function clear() {
    favorites.value = {}
    ready.value = false
  }

  function handleRealtime(e: { action: string; record: any }) {
    const uid = auth.user?.id
    if (!uid || e.record?.user !== uid) return
    if (e.action === 'delete') {
      const bikeId = Object.keys(favorites.value).find(k => favorites.value[k] === e.record.id)
      if (bikeId) delete favorites.value[bikeId]
    } else if (e.action === 'create' || e.action === 'update') {
      if (e.record?.motorcycle) favorites.value[e.record.motorcycle] = e.record.id
    }
  }

  async function unsubscribe() {
    // On logout the auth handlers tear down the realtime connection
    // (pb.realtime.disconnect()); skipping the server call avoids firing
    // an unsubscribe with an already-cleared token (403 in the console).
    if (!auth.isAuthenticated) return
    try { await pb.collection('favorites').unsubscribe('*') } catch { /* best effort */ }
  }

  async function subscribe() {
    const uid = auth.user?.id
    if (!uid) return
    try {
      await pb.collection('favorites').subscribe('*', handleRealtime, { filter: `user = "${uid}"` })
    } catch { /* best effort */ }
  }

  let loadPromise: Promise<void> | null = null

  async function doLoad() {
    local.value = readLocal()
    const uid = auth.user?.id
    try {
      if (uid) {
        const res = await pb.collection('favorites').getList(1, 200, { filter: `user = "${uid}"` })
        const map: Record<string, string> = {}
        for (const fav of res.items as any[]) {
          if (fav.motorcycle) map[fav.motorcycle] = fav.id
        }
        favorites.value = map
      } else {
        favorites.value = {}
      }
    } catch {
      favorites.value = {}
    }
    ready.value = true
  }

  function load(): Promise<void> {
    if (loadPromise) return loadPromise
    loadPromise = doLoad().finally(() => { loadPromise = null })
    return loadPromise
  }

  async function toggle(kind: WishlistKind, item: { id: string; name?: string }) {
    const saved = isSaved(kind, item.id)
    try {
      if (kind === 'bike') {
        if (!auth.isAuthenticated) {
          toast.add({ type: 'info', title: 'Please sign in to use your wishlist.' })
          navigateTo('/login')
          return false
        }
        if (saved && favorites.value[item.id]) {
          await pb.collection('favorites').delete(favorites.value[item.id])
          delete favorites.value[item.id]
        } else if (!saved) {
          const rec = await pb.collection('favorites').create({ user: auth.user?.id, motorcycle: item.id })
          favorites.value[item.id] = rec.id
        }
      } else {
        localSet(kind, item.id, !saved)
      }
      toast.add({
        type: 'success',
        title: isSaved(kind, item.id) ? 'Saved to Wishlist' : 'Removed from Wishlist',
        message: item.name ? `${item.name} ${isSaved(kind, item.id) ? 'added to' : 'removed from'} your wishlist.` : undefined,
      })
      return !saved
    } catch (e: any) {
      toast.add({ type: 'error', title: 'Could not update wishlist', message: e?.message || 'Please try again.' })
      return saved
    }
  }

  watch(() => auth.user?.id, (uid) => {
    if (uid) {
      load()
      subscribe()
    } else {
      clear()
      unsubscribe()
    }
  }, { immediate: true })

  return { favorites, local, ready, count, isSaved, load, toggle, clear, subscribe, unsubscribe }
})
