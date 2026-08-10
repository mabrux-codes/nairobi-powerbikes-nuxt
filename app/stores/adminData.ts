import { defineStore } from 'pinia'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'

export type AdminToastType = 'booking' | 'test_ride' | 'contact' | 'user' | 'motorcycle' | 'stock' | 'gear'

export const useAdminDataStore = defineStore('adminData', () => {
  const pb = usePB()
  const toast = useToast()

  const ready = ref(false)
  const status = ref<'connecting' | 'connected' | 'reconnecting'>('connecting')
  const lastUpdated = ref('')

  const bookings = ref<any[]>([])
  const motorcycles = ref<any[]>([])
  const accessories = ref<any[]>([])
  const apparel = ref<any[]>([])
  const users = ref<any[]>([])
  const contacts = ref<any[]>([])
  const subscribers = ref<any[]>([])
  const brands = ref<any[]>([])
  const categories = ref<any[]>([])
  const reminders = ref<any[]>([])

  const serviceBookings = computed(() => bookings.value.filter(b => (b.type || 'service') === 'service'))
  const testRides = computed(() => bookings.value.filter(b => b.type === 'test_ride'))
  const subscriberCount = computed(() => subscribers.value.length)
  const unreadContacts = computed(() => contacts.value.filter(c => !c.read).length)

  let refCount = 0
  let initPromise: Promise<void> | null = null
  let subscribed = false

  function sortCreated(arr: any[]) {
    return arr.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
  }

  function applyDelta(coll: keyof typeof COLLECTIONS, action: string, record: any) {
    const list = COLLECTIONS[coll]
    const idx = list.value.findIndex((r: any) => r.id === record?.id)
    if (action === 'create') {
      if (idx === -1) list.value.unshift(record)
    } else if (action === 'update') {
      if (idx > -1) list.value[idx] = record
      else list.value.unshift(record)
    } else if (action === 'delete') {
      if (idx > -1) list.value.splice(idx, 1)
    }
  }

  const COLLECTIONS = {
    service_bookings: bookings,
    motorcycles,
    accessories,
    apparel,
    users,
    contacts,
    subscribers,
    brands,
    categories,
    stock_reminders: reminders,
  }

  function enqueueToast(t: { type: AdminToastType; title: string; message: string; to?: string }, key?: string) {
    // All realtime admin toasts flow through the single global toast system.
    toast.add({
      type: t.type as any,
      title: t.title,
      message: t.message,
      to: t.to,
      duration: 7000,
      key,
    })
  }

  function toastForBooking(record: any) {
    const name = record.expand?.user?.name || record.name || 'Guest'
    if ((record.type || 'service') === 'test_ride') {
      enqueueToast({
        type: 'test_ride',
        title: 'New Test Ride Request',
        message: `${name} requested a test ride${record.motorcycle ? ` on ${record.motorcycle}` : ''}.`,
        to: `/dashboard/test-rides?edit=${record.id}`,
      }, `test_ride:${record.id}`)
    } else {
      enqueueToast({
        type: 'booking',
        title: 'New Service Booking',
        message: `${name} booked a service${record.service_type ? ` (${record.service_type})` : ''}.`,
        to: `/dashboard/service-bookings?edit=${record.id}`,
      }, `booking:${record.id}`)
    }
  }

  function handleEvent(coll: string, action: string, record: any) {
    applyDelta(coll as keyof typeof COLLECTIONS, action, record)
    if (!record) return

    if (coll === 'service_bookings' && action === 'create') {
      toastForBooking(record)
    } else if (coll === 'contacts' && action === 'create') {
      enqueueToast({
        type: 'contact',
        title: 'New Inquiry',
        message: `${record.name || record.email} sent a message${record.category ? ` (${record.category})` : ''}.`,
        to: '/dashboard/messages',
      }, `contact:${record.id}`)
    } else if (coll === 'users' && action === 'create' && record.role === 'customer') {
      enqueueToast({
        type: 'user',
        title: 'Customer Registered',
        message: `${record.name || record.email} just created an account.`,
        to: '/dashboard/staff',
      }, `user:${record.id}`)
    } else if (coll === 'motorcycles' && action === 'create') {
      enqueueToast({
        type: 'motorcycle',
        title: 'Motorcycle Added',
        message: `${record.name} was added to the inventory.`,
        to: `/dashboard/motorcycles?edit=${record.id}`,
      }, `motorcycle:${record.id}`)
    } else if ((coll === 'accessories' || coll === 'apparel') && action === 'update') {
      if (record.in_stock === false) {
        enqueueToast({
          type: 'stock',
          title: 'Out of Stock',
          message: `${record.name} is now out of stock.`,
          to: coll === 'accessories' ? `/dashboard/accessories?edit=${record.id}` : `/dashboard/apparel?edit=${record.id}`,
        }, `stock:${record.id}`)
      }
    }
  }

  async function fetchAll() {
    const opts: any = { sort: '-created' }
    const [b, m, a, ap, u, c, s, br, ca, r] = await Promise.all([
      pb.collection('service_bookings').getFullList({ ...opts, expand: 'user' }).catch(() => []),
      pb.collection('motorcycles').getFullList(opts).catch(() => []),
      pb.collection('accessories').getFullList(opts).catch(() => []),
      pb.collection('apparel').getFullList(opts).catch(() => []),
      pb.collection('users').getFullList(opts).catch(() => []),
      pb.collection('contacts').getFullList(opts).catch(() => []),
      pb.collection('subscribers').getFullList(opts).catch(() => []),
      pb.collection('brands').getFullList({ sort: 'name' }).catch(() => []),
      pb.collection('categories').getFullList({ sort: 'name' }).catch(() => []),
      pb.collection('stock_reminders').getFullList({ ...opts, expand: 'user' }).catch(() => []),
    ])
    bookings.value = sortCreated(b as any[])
    motorcycles.value = sortCreated(m as any[])
    accessories.value = sortCreated(a as any[])
    apparel.value = sortCreated(ap as any[])
    users.value = sortCreated(u as any[])
    contacts.value = sortCreated(c as any[])
    subscribers.value = s as any[]
    brands.value = br as any[]
    categories.value = ca as any[]
    reminders.value = sortCreated(r as any[])
    lastUpdated.value = new Date().toLocaleString()
  }

  async function init() {
    if (initPromise) return initPromise
    initPromise = (async () => {
      status.value = 'connecting'
      try {
        pb.realtime.onDisconnect = () => { status.value = 'reconnecting' }
      } catch { /* realtime unavailable */ }

      try {
        await pb.collection('service_bookings').subscribe('PB_CONNECT', () => {
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

  async function release() {
    refCount = Math.max(0, refCount - 1)
    if (refCount === 0 && subscribed) {
      subscribed = false
      try {
        pb.collection('service_bookings').unsubscribe('*')
      } catch { /* ignore */ }
      try {
        pb.realtime.onDisconnect = undefined
      } catch { /* ignore */ }
      ready.value = false
      initPromise = null
    }
  }

  async function refreshData() {
    try {
      await fetchAll()
      status.value = 'connected'
    } catch { /* keep existing data */ }
  }

  return {
    ready, status, lastUpdated,
    bookings, motorcycles, accessories, apparel, users, contacts, subscribers, brands, categories, reminders,
    serviceBookings, testRides, subscriberCount, unreadContacts,
    enqueueToast,
    ensureActive, release, refreshData,
  }
})
