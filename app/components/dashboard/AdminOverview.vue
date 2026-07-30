<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-8">
      <h1 class="font-heading text-4xl text-white">Admin <span class="text-brand-red">Dashboard</span></h1>
      <p class="mt-1 text-sm text-brand-grey">Overview of your entire business</p>
    </div>

    <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
      <div v-for="i in 5" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-6">
        <div class="mb-3 h-4 w-24 rounded bg-brand-grey/10" />
        <div class="h-8 w-16 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3 w-20 rounded bg-brand-grey/10" />
      </div>
    </div>

    <div v-else>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div v-for="stat in stats" :key="stat.label" class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-all duration-200 hover:border-brand-red/30">
          <div class="flex items-center justify-between">
            <p class="text-xs font-display tracking-display text-brand-grey uppercase">{{ stat.label }}</p>
            <component :is="stat.icon" class="h-5 w-5 text-brand-red" />
          </div>
          <p class="mt-2 font-display text-3xl tracking-display text-white">{{ stat.value }}</p>
          <p class="mt-1 text-xs" :class="stat.change >= 0 ? 'text-emerald-400' : 'text-red-400'">
            {{ stat.change >= 0 ? '+' : '' }}{{ stat.change }}% from last month
          </p>
        </div>
      </div>

      <div class="mt-8 grid gap-8 lg:grid-cols-2">
        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <h2 class="font-display text-lg tracking-display text-white">Test Rides by Status</h2>
          <div v-if="chartData.bookingsByStatus.length" class="mt-4 space-y-3">
            <div v-for="item in chartData.bookingsByStatus" :key="item.label" class="space-y-1">
              <div class="flex justify-between text-xs"><span class="text-brand-grey capitalize">{{ item.label }}</span><span class="text-white">{{ item.count }}</span></div>
              <div class="h-2 rounded-full bg-brand-grey/10"><div class="h-full rounded-full bg-brand-red transition-all" :style="{ width: chartPct(item.count, chartData.bookingsTotal) + '%' }" /></div>
            </div>
          </div>
          <div v-else class="mt-4 text-sm text-brand-grey">No test ride data yet</div>
        </div>

        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <h2 class="font-display text-lg tracking-display text-white">Service Bookings by Status</h2>
          <div v-if="chartData.serviceByStatus.length" class="mt-4 space-y-3">
            <div v-for="item in chartData.serviceByStatus" :key="item.label" class="space-y-1">
              <div class="flex justify-between text-xs"><span class="text-brand-grey capitalize">{{ item.label }}</span><span class="text-white">{{ item.count }}</span></div>
              <div class="h-2 rounded-full bg-brand-grey/10"><div class="h-full rounded-full bg-emerald-500 transition-all" :style="{ width: chartPct(item.count, chartData.serviceTotal) + '%' }" /></div>
            </div>
          </div>
          <div v-else class="mt-4 text-sm text-brand-grey">No service bookings yet</div>
        </div>
      </div>

      <div class="mt-8 grid gap-8 lg:grid-cols-2">
        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <h2 class="font-display text-lg tracking-display text-white">Contacts by Category</h2>
          <div v-if="chartData.contactsByCategory.length" class="mt-4 space-y-3">
            <div v-for="item in chartData.contactsByCategory" :key="item.label" class="space-y-1">
              <div class="flex justify-between text-xs"><span class="text-brand-grey capitalize">{{ item.label }}</span><span class="text-white">{{ item.count }}</span></div>
              <div class="h-2 rounded-full bg-brand-grey/10"><div class="h-full rounded-full bg-amber-500 transition-all" :style="{ width: chartPct(item.count, chartData.contactsTotal) + '%' }" /></div>
            </div>
          </div>
          <div v-else class="mt-4 text-sm text-brand-grey">No contact data yet</div>
        </div>

        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <h2 class="font-display text-lg tracking-display text-white">Recent Activity</h2>
          <div v-if="activities.length === 0" class="mt-4 rounded-sm border border-dashed border-brand-grey/20 p-8 text-center">
            <p class="text-sm text-brand-grey">No recent activity</p>
          </div>
          <div v-else class="mt-4 space-y-3">
            <div v-for="act in activities" :key="act.id" class="flex items-start gap-3 border-b border-brand-grey/10 pb-3 last:border-0 last:pb-0">
              <div class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full" :class="act.bgClass">
                <component :is="act.icon" class="h-4 w-4" :class="act.iconClass" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-white">{{ act.text }}</p>
                <p class="text-xs text-brand-grey">{{ act.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 grid gap-8 lg:grid-cols-2">
        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <h2 class="font-display text-lg tracking-display text-white">Recent Contacts</h2>
          <div v-if="recentContacts.length === 0" class="mt-4 text-sm text-brand-grey">No recent contacts</div>
          <div v-else class="mt-4 space-y-2">
            <div v-for="c in recentContacts" :key="c.id" class="flex items-center justify-between border-b border-brand-grey/10 pb-2 last:border-0 last:pb-0">
              <span class="text-sm text-white truncate">{{ c.name || c.email }}</span>
              <Badge size="sm">{{ c.category || 'general' }}</Badge>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <h2 class="font-display text-lg tracking-display text-white">Subscribers</h2>
          <p class="mt-2 font-display text-4xl tracking-display text-white">{{ subscriberCount }}</p>
          <p class="text-xs text-brand-grey mt-1">Total email subscribers</p>
        </div>
      </div>

      <div class="mt-4 text-xs text-brand-grey/40 text-right">Last updated: {{ lastUpdated }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, Bike, Calendar, Mail, CircleAlert } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

const pb = usePB()
const loading = ref(true)
const stats = ref<any[]>([])
const activities = ref<any[]>([])
const chartData = ref({ bookingsByStatus: [] as any[], bookingsTotal: 0, contactsByCategory: [] as any[], contactsTotal: 0, serviceByStatus: [] as any[], serviceTotal: 0 })
const recentContacts = ref<any[]>([])
const subscriberCount = ref(0)
const lastUpdated = ref('')

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function chartPct(count: number, total: number) { return total > 0 ? Math.round((count / total) * 100) : 0 }

async function safeCount(collection: string, filter?: string) {
  try {
    const opts: any = {}
    if (filter) opts.filter = filter
    const res = await pb.collection(collection).getList(1, 1, opts)
    return res.totalItems
  } catch {
    return 0
  }
}

function pbDate(d: Date) {
  return d.toISOString().replace('T', ' ')
}

async function calcChange(collection: string, filter?: string) {
  const now = new Date()
  const startThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)

  const thisFilter = `created>='${pbDate(startThisMonth)}'${filter ? ' && ' + filter : ''}`
  const lastFilter = `created>='${pbDate(startLastMonth)}' && created<='${pbDate(endLastMonth)}'${filter ? ' && ' + filter : ''}`
  const thisCount = await safeCount(collection, thisFilter)
  const lastCount = await safeCount(collection, lastFilter)
  if (lastCount === 0) return thisCount > 0 ? 100 : 0
  return Math.round(((thisCount - lastCount) / lastCount) * 100)
}

async function fetchList(collection: string, opts: any) {
  try {
    return await pb.collection(collection).getList(1, 100, opts)
  } catch {
    return { items: [] as any[], totalItems: 0 }
  }
}

async function loadOverview() {
  try {
    const userCount = await safeCount('users')
    const bikeCount = await safeCount('motorcycles', 'status="available"')
    const pendingServicesCount = await safeCount('service_bookings', 'type="service" && status="pending"')
    const testRideCount = await safeCount('service_bookings', 'type="test_ride"')
    const subCount = await safeCount('subscribers')

    const contactsRes = await fetchList('contacts', { sort: '-created' })
    const testRidesRes = await fetchList('service_bookings', { sort: '-created', expand: 'user', filter: 'type="test_ride"' })
    const servicesRes = await fetchList('service_bookings', { sort: '-created', filter: 'type="service"' })

    const [userChange, bikeChange, serviceChange, testRideChange, subChange] = await Promise.all([
      calcChange('users'),
      calcChange('motorcycles', 'status="available"'),
      calcChange('service_bookings', 'type="service" && status="pending"'),
      calcChange('service_bookings', 'type="test_ride"'),
      calcChange('subscribers'),
    ])

    stats.value = [
      { label: 'Total Users', value: userCount, icon: Users, change: userChange },
      { label: 'Available Motorcycles', value: bikeCount, icon: Bike, change: bikeChange },
      { label: 'Pending Service Bookings', value: pendingServicesCount, icon: Calendar, change: serviceChange },
      { label: 'Test Rides', value: testRideCount, icon: CircleAlert, change: testRideChange },
      { label: 'Subscribers', value: subCount, icon: Mail, change: subChange },
    ]

    subscriberCount.value = subCount

    const servicesList = servicesRes.items as any[]
    const byStatus: Record<string, number> = {}
    servicesList.forEach((s: any) => { const st = s.status || 'pending'; byStatus[st] = (byStatus[st] || 0) + 1 })
    chartData.value.serviceByStatus = Object.entries(byStatus).map(([label, count]) => ({ label, count }))
    chartData.value.serviceTotal = servicesList.length

    const testRidesList = testRidesRes.items as any[]
    const byStatus2: Record<string, number> = {}
    testRidesList.forEach((b: any) => { const st = b.status || 'pending'; byStatus2[st] = (byStatus2[st] || 0) + 1 })
    chartData.value.bookingsByStatus = Object.entries(byStatus2).map(([label, count]) => ({ label, count }))
    chartData.value.bookingsTotal = testRidesList.length

    const contactsList = contactsRes.items as any[]
    const byCat: Record<string, number> = {}
    contactsList.forEach((c: any) => { const cat = c.category || 'general'; byCat[cat] = (byCat[cat] || 0) + 1 })
    chartData.value.contactsByCategory = Object.entries(byCat).map(([label, count]) => ({ label, count }))
    chartData.value.contactsTotal = contactsList.length

    recentContacts.value = contactsList.slice(0, 5)

    const flat: any[] = []
    for (const b of testRidesList) {
      flat.push({
        id: b.id,
        created: b.created,
        text: `New Test Ride from ${b.expand?.user?.name || b.name || b.email || 'guest'}${b.status === 'pending' ? ' (needs action)' : ''}`,
        time: timeAgo(b.created),
        icon: Calendar,
        bgClass: 'bg-amber-500/20',
        iconClass: 'text-amber-400',
      })
    }
    for (const s of servicesList) {
      flat.push({
        id: s.id,
        created: s.created,
        text: `New Service Booking from ${s.name || s.email || 'guest'}${s.status === 'pending' ? ' (needs action)' : ''}`,
        time: timeAgo(s.created),
        icon: Calendar,
        bgClass: 'bg-emerald-500/20',
        iconClass: 'text-emerald-400',
      })
    }
    flat.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    activities.value = flat.slice(0, 8)

    lastUpdated.value = new Date().toLocaleString()
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadOverview()
  pb.collection('users').subscribe('*', () => loadOverview())
  pb.collection('motorcycles').subscribe('*', () => loadOverview())
  pb.collection('service_bookings').subscribe('*', () => loadOverview())
  pb.collection('contacts').subscribe('*', () => loadOverview())
  pb.collection('subscribers').subscribe('*', () => loadOverview())
})

onUnmounted(() => {
  pb.collection('users').unsubscribe('*')
  pb.collection('motorcycles').unsubscribe('*')
  pb.collection('service_bookings').unsubscribe('*')
  pb.collection('contacts').unsubscribe('*')
  pb.collection('subscribers').unsubscribe('*')
})
</script>
