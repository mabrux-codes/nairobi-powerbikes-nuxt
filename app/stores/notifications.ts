import { defineStore } from 'pinia'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'

export type NotificationType =
  | 'booking' | 'service' | 'test_ride' | 'testimonial' | 'contact'
  | 'offer' | 'system' | 'message' | 'general' | 'media' | 'user' | 'staff'
  | 'auth' | 'motorcycle' | 'ecommerce'
  | 'stock' | 'sale' | 'payment' | 'finance' | 'blog'

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
  broadcast?: boolean
  role?: string
  user?: string
}

// Role-aware, per-user notification inbox.
// Every record in PB belongs to exactly one recipient (user = auth.id);
// broadcasts are materialized per recipient server-side, so `read` stays per-user.
// No localStorage persistence: state is always refetched from PocketBase on login.
export const useNotificationStore = defineStore('notifications', () => {
  const pb = usePB()
  const toast = useToast()
  const auth = useAuthStore()

  const notifications = ref<NotificationItem[]>([])
  const ready = ref(false)

  let subscribed = false
  let fetchPromise: Promise<void> | null = null

  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  function ownFilter() {
    return pb.filter('user = {:uid}', { uid: auth.user?.id })
  }

  function isMine(r: any): boolean {
    return !!auth.user?.id && r?.user === auth.user.id
  }

  function mapRecord(r: any): NotificationItem {
    return {
      id: r.id,
      type: (r.type as NotificationType) || 'system',
      title: r.title || '',
      message: r.message || '',
      read: !!r.read,
      createdAt: r.created || new Date().toISOString(),
      link: r.link || '',
      broadcast: !!r.broadcast,
      role: r.role || '',
      user: r.user || '',
    }
  }

  async function doFetch() {
    const uid = auth.user?.id
    if (!uid) return
    try {
      const res = await pb.collection('notifications').getList(1, 100, {
        filter: ownFilter(),
        sort: '-created',
      })
      notifications.value = (res.items as any[]).map(mapRecord)
    } catch { /* best effort */ }
    ready.value = true
  }

  function load(): Promise<void> {
    if (fetchPromise) return fetchPromise
    fetchPromise = doFetch().finally(() => { fetchPromise = null })
    return fetchPromise
  }

  function handleRealtime(e: { action: string; record: any }) {
    // double-check ownership even though the server-side subscribe filter limits the stream
    if (!isMine(e.record)) return
    if (e.action === 'create') {
      const n = mapRecord(e.record)
      if (!notifications.value.some(x => x.id === n.id)) {
        notifications.value = [n, ...notifications.value]
      }
      toast.add({ type: 'info', title: n.title, message: n.message || undefined, to: n.link || undefined, key: 'notif:' + n.id })
    } else if (e.action === 'update') {
      const idx = notifications.value.findIndex(x => x.id === e.record.id)
      if (idx >= 0) notifications.value[idx] = mapRecord(e.record)
    } else if (e.action === 'delete') {
      notifications.value = notifications.value.filter(x => x.id !== e.record.id)
    }
  }

  async function subscribe() {
    const uid = auth.user?.id
    if (!uid || subscribed) return
    try {
      await pb.collection('notifications').subscribe('*', handleRealtime, { filter: ownFilter() })
      subscribed = true
    } catch { /* best effort */ }
  }

  async function unsubscribe() {
    if (!subscribed) return
    // On logout the auth handlers tear down the realtime connection; skip the
    // server call once auth is gone to avoid a 403 with a cleared token.
    if (!auth.isAuthenticated) return
    try { await pb.collection('notifications').unsubscribe('*') } catch { /* best effort */ }
    subscribed = false
  }

  async function init() {
    if (auth.isAuthenticated) {
      await load()
      await subscribe()
    }
  }

  function reset() {
    notifications.value = []
    ready.value = false
    subscribed = false
  }

  async function markRead(id: string) {
    const n = notifications.value.find(x => x.id === id)
    if (!n || n.read) return
    n.read = true
    try { await pb.collection('notifications').update(id, { read: true }) } catch { /* best effort */ }
  }

  async function markAllRead() {
    const unread = notifications.value.filter(n => !n.read)
    if (!unread.length) return
    notifications.value.forEach(n => { n.read = true })
    await Promise.allSettled(unread.map(n => pb.collection('notifications').update(n.id, { read: true })))
  }

  async function setRead(id: string, read: boolean) {
    const n = notifications.value.find(x => x.id === id)
    if (!n || n.read === read) return
    n.read = read
    try { await pb.collection('notifications').update(id, { read }) } catch { /* best effort */ }
  }

  async function remove(id: string) {
    notifications.value = notifications.value.filter(x => x.id !== id)
    try { await pb.collection('notifications').delete(id) } catch { /* best effort */ }
  }

  async function clearAll() {
    const ids = notifications.value.map(n => n.id)
    notifications.value = []
    await Promise.allSettled(ids.map(id => pb.collection('notifications').delete(id)))
  }

  // On login/switch -> load + subscribe own stream. On logout -> reset.
  watch(() => auth.user?.id, (uid) => {
    if (uid) init()
    else { reset(); unsubscribe() }
  }, { immediate: true })

  return {
    notifications,
    ready,
    unreadCount,
    load,
    init,
    markRead,
    markAllRead,
    setRead,
    remove,
    clearAll,
    reset,
  }
})
