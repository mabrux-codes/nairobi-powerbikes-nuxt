<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-8">
      <h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Dashboard</span></h1>
      <p class="mt-1 text-sm text-brand-grey">Welcome back, {{ auth.user?.name || auth.user?.email }}</p>
    </div>

    <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-6">
        <div class="h-4 w-24 rounded bg-brand-grey/10" />
        <div class="mt-2 h-8 w-16 rounded bg-brand-grey/10" />
      </div>
    </div>

    <div v-else>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-all hover:border-brand-red/30">
          <p class="text-xs font-display tracking-display text-brand-grey uppercase">Total Test Rides</p>
          <p class="mt-2 font-display text-3xl tracking-display text-white">{{ stats.testRides }}</p>
        </div>
        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-all hover:border-brand-red/30">
          <p class="text-xs font-display tracking-display text-brand-grey uppercase">Total Service Bookings</p>
          <p class="mt-2 font-display text-3xl tracking-display text-white">{{ stats.serviceBookings }}</p>
        </div>
        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-all hover:border-brand-red/30">
          <p class="text-xs font-display tracking-display text-brand-grey uppercase">Favourites / Wishlist</p>
          <p class="mt-2 font-display text-3xl tracking-display text-white">{{ stats.favorites }}</p>
        </div>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg tracking-display text-white">My Test Rides</h2>
            <span class="text-xs text-brand-grey">Live</span>
          </div>

          <div v-if="testRides.length === 0" class="mt-4 rounded-sm border border-dashed border-brand-grey/20 p-8 text-center">
            <Calendar class="mx-auto h-10 w-10 text-brand-grey/40" />
            <p class="mt-3 font-display text-base tracking-display text-brand-grey">No Test Rides</p>
            <NuxtLink to="/service/test-ride" class="mt-3 inline-block"><Button size="sm">Book a Test Ride</Button></NuxtLink>
          </div>

          <div v-else class="mt-4 space-y-3">
            <div v-for="b in testRides" :key="b.id" class="border-b border-brand-grey/10 pb-3 last:border-0 last:pb-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="text-sm text-white">{{ b.motorcycle || 'Motorcycle' }}</p>
                  <p class="text-xs text-brand-grey">{{ formatDate(b.preferred_date) }} &middot; {{ formatTime(b.preferred_time) }}</p>
                </div>
                <Badge :variant="testRideStatusVariant(b.status)">{{ b.status }}</Badge>
              </div>
              <p v-if="b.notes" class="mt-1 text-xs text-brand-grey/60 italic">{{ b.notes }}</p>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg tracking-display text-white">My Service Bookings</h2>
            <span class="text-xs text-brand-grey">Live</span>
          </div>

          <div v-if="serviceBookings.length === 0" class="mt-4 rounded-sm border border-dashed border-brand-grey/20 p-8 text-center">
            <Wrench class="mx-auto h-10 w-10 text-brand-grey/40" />
            <p class="mt-3 font-display text-base tracking-display text-brand-grey">No Service Bookings</p>
            <NuxtLink to="/service/booking" class="mt-3 inline-block"><Button size="sm">Book a Service</Button></NuxtLink>
          </div>

          <div v-else class="mt-4 space-y-4">
            <div v-for="b in serviceBookings" :key="b.id" class="border-b border-brand-grey/10 pb-4 last:border-0 last:pb-0">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="text-sm text-white">{{ b.service_type || 'Service' }}</p>
                  <p class="text-xs text-brand-grey">{{ b.motorcycle || 'N/A' }} &middot; {{ formatDate(b.preferred_date) }}</p>
                </div>
                <Badge :variant="serviceStatusVariant(b.status)">{{ b.status }}</Badge>
              </div>
              <div class="mt-2">
                <div class="flex items-center gap-1 text-xs text-brand-grey/60">
                  <div v-for="(step, i) in serviceSteps" :key="step.key" class="flex items-center gap-1">
                    <div class="flex items-center gap-1.5">
                      <div class="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                        :class="stepStyle(step.key, b.status)"
                      >
                        <Check v-if="stepIndex(b.status) >= i" class="h-3 w-3" />
                        <span v-else>{{ i + 1 }}</span>
                      </div>
                      <span :class="stepIndex(b.status) >= i ? 'text-white' : 'text-brand-grey/50'">{{ step.label }}</span>
                    </div>
                    <ChevronRight v-if="i < serviceSteps.length - 1" class="mx-1 h-3 w-3 text-brand-grey/30" />
                  </div>
                </div>
              </div>
              <p v-if="b.notes" class="mt-1 text-xs text-brand-grey/60 italic">Notes: {{ b.notes }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar, Check, ChevronRight, Wrench } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { formatDate, formatTime } from '~/composables/useFormat'

const pb = usePB()
const auth = useAuthStore()
const loading = ref(true)
const stats = ref({ testRides: 0, serviceBookings: 0, favorites: 0 })
const testRides = ref<any[]>([])
const serviceBookings = ref<any[]>([])

const serviceSteps = [
  { key: 'pending', label: 'Booked' },
  { key: 'diagnosed', label: 'Diagnosed' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
]

const statusOrder: Record<string, number> = { pending: 0, diagnosed: 1, in_progress: 2, completed: 3, cancelled: -1 }

function stepIndex(s: string) { return statusOrder[s] ?? -1 }

function stepStyle(stepKey: string, bookingStatus: string) {
  const idx = stepIndex(bookingStatus)
  const stepIdx = statusOrder[stepKey]
  if (bookingStatus === 'cancelled') return 'bg-red-500/30 text-red-400'
  if (idx >= stepIdx) return 'bg-emerald-500/30 text-emerald-400'
  return 'bg-brand-grey/10 text-brand-grey/50'
}



function testRideStatusVariant(s: string) {
  const map: Record<string, string> = { pending: 'warning', confirmed: 'secondary', completed: 'success', cancelled: 'danger' }
  return map[s] || 'outline'
}

function serviceStatusVariant(s: string) {
  const map: Record<string, string> = { pending: 'warning', diagnosed: 'default', in_progress: 'secondary', completed: 'success', cancelled: 'danger' }
  return map[s] || 'outline'
}

async function loadData() {
  const userId = auth.user?.id
  if (!userId) return

  const [testRidesRes, serviceRes, favRes] = await Promise.all([
    pb.collection('service_bookings').getList(1, 100, { filter: `type="test_ride" && user = "${userId}"`, sort: '-created' }).catch(() => ({ items: [], totalItems: 0 })),
    pb.collection('service_bookings').getList(1, 100, { filter: `type="service" && user = "${userId}"`, sort: '-created' }).catch(() => ({ items: [], totalItems: 0 })),
    pb.collection('favorites').getList(1, 1, { filter: `user = "${userId}"` }).catch(() => ({ totalItems: 0 })),
  ])

  stats.value = {
    testRides: testRidesRes.totalItems,
    serviceBookings: serviceRes.totalItems,
    favorites: favRes.totalItems,
  }

  testRides.value = (testRidesRes.items as any[]).sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  )
  serviceBookings.value = (serviceRes.items as any[]).sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  )
}

function handleRealtime(e: any) {
  const record = e.record as any
  const userId = auth.user?.id
  if (record.user !== userId) return

  if (record.type === 'test_ride') {
    if (e.action === 'delete') {
      testRides.value = testRides.value.filter(b => b.id !== record.id)
    } else {
      const idx = testRides.value.findIndex(b => b.id === record.id)
      if (idx >= 0) {
        testRides.value[idx] = { ...testRides.value[idx], ...record }
        testRides.value = [...testRides.value]
      } else {
        testRides.value = [record as any, ...testRides.value]
      }
    }
    stats.value.testRides = testRides.value.length
  } else if (record.type === 'service') {
    if (e.action === 'delete') {
      serviceBookings.value = serviceBookings.value.filter(b => b.id !== record.id)
    } else {
      const idx = serviceBookings.value.findIndex(b => b.id === record.id)
      if (idx >= 0) {
        serviceBookings.value[idx] = { ...serviceBookings.value[idx], ...record }
        serviceBookings.value = [...serviceBookings.value]
      } else {
        serviceBookings.value = [record as any, ...serviceBookings.value]
      }
    }
    stats.value.serviceBookings = serviceBookings.value.length
  }
}

function handleFavRealtime(e: any) {
  const record = e.record as any
  if (record.user !== auth.user?.id) return
  if (e.action === 'delete') {
    stats.value.favorites = Math.max(0, stats.value.favorites - 1)
  } else {
    stats.value.favorites += 1
  }
}

onMounted(async () => {
  await loadData()
  loading.value = false

  const userId = auth.user?.id
  if (!userId) return

  pb.collection('service_bookings').subscribe('*', handleRealtime, { filter: `user = "${userId}"` })
  pb.collection('favorites').subscribe('*', handleFavRealtime)
})

onUnmounted(() => {
  pb.collection('service_bookings').unsubscribe('*')
  pb.collection('favorites').unsubscribe('*')
})
</script>
