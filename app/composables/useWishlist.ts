import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

export type WishlistKind = 'bike' | 'accessory' | 'apparel'

const LS_KEY = 'npb_wishlist'

// Module-scope shared state so every consumer (cards, navbar badge, wishlist page)
// reads and mutates the same wishlist without re-fetching.
const serverFavorites = ref<Record<string, string>>({}) // motorcycleId -> favorite record id
const local = ref<Record<string, string[]>>({ bike: [], accessory: [], apparel: [] })
const ready = ref(false)

function readLocal(): Record<string, string[]> {
  if (!import.meta.client) return {}
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeLocal(data: Record<string, string[]>) {
  if (!import.meta.client) return
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}

function isSaved(kind: WishlistKind, id: string): boolean {
  const auth = useAuthStore()
  if (kind === 'bike') {
    if (auth.isAuthenticated && auth.isCustomer && serverFavorites.value[id]) return true
    return local.value.bike.includes(id)
  }
  return local.value[kind]?.includes(id) || false
}

function localSet(kind: WishlistKind, id: string, saved: boolean) {
  const arr = local.value[kind] || []
  local.value[kind] = saved
    ? (arr.includes(id) ? arr : [...arr, id])
    : arr.filter(x => x !== id)
  writeLocal({ bike: local.value.bike, accessory: local.value.accessory, apparel: local.value.apparel })
}

export function useWishlist() {
  const pb = usePB()
  const toast = useToast()

  const count = computed(() =>
    (local.value.bike?.length || 0) + (local.value.accessory?.length || 0) + (local.value.apparel?.length || 0),
  )

  async function load() {
    local.value = {
      bike: [],
      accessory: [],
      apparel: [],
      ...readLocal(),
    }
    const auth = useAuthStore()
    if (auth.isAuthenticated && auth.isCustomer) {
      try {
        const res = await pb.collection('favorites').getList(1, 200, {
          filter: `user = "${auth.user?.id}"`,
          expand: 'motorcycle',
        })
        serverFavorites.value = {}
        for (const fav of res.items as any[]) {
          const mcId = fav.motorcycle || fav.expand?.motorcycle?.id
          if (mcId) serverFavorites.value[mcId] = fav.id
        }
        // merge server favorites into local view for consistent UI
        for (const mcId of Object.keys(serverFavorites.value)) {
          if (!local.value.bike.includes(mcId)) local.value.bike.push(mcId)
        }
        writeLocal({ bike: local.value.bike, accessory: local.value.accessory, apparel: local.value.apparel })
      } catch { /* best effort */ }
    }
    ready.value = true
  }

  async function toggle(kind: WishlistKind, item: { id: string; name?: string }) {
    const saved = isSaved(kind, item.id)
    const auth = useAuthStore()
    try {
      if (kind === 'bike' && auth.isAuthenticated && auth.isCustomer) {
        if (saved && serverFavorites.value[item.id]) {
          await pb.collection('favorites').delete(serverFavorites.value[item.id])
          delete serverFavorites.value[item.id]
          localSet('bike', item.id, false)
        } else if (!saved) {
          const rec = await pb.collection('favorites').create({ user: auth.user?.id, motorcycle: item.id })
          serverFavorites.value[item.id] = rec.id
          localSet('bike', item.id, true)
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

  return { isSaved, toggle, load, ready, count }
}
