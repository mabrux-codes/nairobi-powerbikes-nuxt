<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-8">
      <h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Dashboard</span></h1>
      <p class="mt-1 text-sm text-brand-grey">Welcome back, {{ auth.user?.name || auth.user?.email }}</p>
    </div>

    <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="h-4 w-24 rounded bg-brand-grey/10" /><div class="mt-2 h-8 w-16 rounded bg-brand-grey/10" /></div>
    </div>

    <div v-else>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="s in stats" :key="s.label" class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <p class="text-xs font-display tracking-display text-brand-grey uppercase">{{ s.label }}</p>
          <p class="mt-2 font-display text-3xl tracking-display text-white">{{ s.value }}</p>
        </div>
      </div>

      <div class="mt-8">
        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg tracking-display text-white">My Bookings &amp; Services</h2>
            <span class="text-xs text-brand-grey">Live updates enabled</span>
          </div>

          <div v-if="allBookings.length === 0" class="mt-4 rounded-sm border border-dashed border-brand-grey/20 p-8 text-center">
            <Calendar class="mx-auto h-12 w-12 text-brand-grey/40" />
            <p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Bookings Yet</p>
            <p class="mt-2 text-sm text-brand-grey/60">Your test ride and service bookings will appear here</p>
          </div>

          <div v-else class="mt-4 space-y-6">
            <div v-for="b in allBookings" :key="b.id" class="border-b border-brand-grey/10 pb-5 last:border-0 last:pb-0">
              <div class="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p class="font-display text-base tracking-display text-white">
                    {{ b.type === 'test_ride' ? 'Test Ride' : (b.service_type || 'Service Booking') }}
                  </p>
                  <p class="text-xs text-brand-grey">{{ formatDate(b.created) }} &middot; {{ b.branch || 'N/A' }}</p>
                </div>
                <Badge :variant="statusVariant(b.status)">{{ b.status }}</Badge>
              </div>

              <div v-if="b.type === 'service'" class="mt-3">
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
                <p v-if="b.notes" class="mt-2 text-xs text-brand-grey/60 italic">Notes: {{ b.notes }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar, Check, ChevronRight } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'

const pb = usePB()
const auth = useAuthStore()
const loading = ref(true)
const stats = ref<any[]>([])
const allBookings = ref<any[]>([])

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

function formatDate(d: string) { return d ? new Date(d).toLocaleDateString() : 'N/A' }

function statusVariant(s: string) {
  const map: Record<string, string> = { pending: 'warning', diagnosed: 'default', in_progress: 'secondary', completed: 'success', cancelled: 'danger' }
  return map[s] || 'outline'
}

async function loadData() {
  const userId = auth.user?.id
  if (!userId) return
  const [bookingsRes, favorites, notifications] = await Promise.all([
    pb.collection('service_bookings').getList(1, 100, { filter: `user = "${userId}"`, sort: '-created' }).catch(() => ({ items: [], totalItems: 0 })),
    pb.collection('favorites').getList(1, 100, { filter: `user = "${userId}"`, sort: '-created' }).catch(() => ({ items: [], totalItems: 0 })),
    pb.collection('notifications').getList(1, 100, { filter: `user = "${userId}"`, sort: '-created' }).catch(() => ({ items: [], totalItems: 0 })),
  ])

  stats.value = [
    { label: 'Total Bookings', value: bookingsRes.totalItems },
    { label: 'Favorites', value: favorites.totalItems },
    { label: 'Notifications', value: notifications.totalItems },
  ]

  allBookings.value = (bookingsRes.items as any[]).sort(
    (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
  )
}

onMounted(async () => {
  await loadData()
  loading.value = false

  const userId = auth.user?.id
  if (!userId) return

  pb.collection('service_bookings').subscribe('*', (e) => {
    const record = e.record as any
    if (record.user !== userId) return
    if (e.action === 'delete') {
      allBookings.value = allBookings.value.filter(b => b.id !== record.id)
    } else {
      const idx = allBookings.value.findIndex(b => b.id === record.id)
      if (idx >= 0) {
        allBookings.value[idx] = { ...allBookings.value[idx], ...record }
        allBookings.value = [...allBookings.value]
      } else {
        allBookings.value = [record as any, ...allBookings.value]
      }
    }
    stats.value[0].value = allBookings.value.length
  }, { filter: `user = "${userId}"` })
})

onUnmounted(() => {
  pb.collection('service_bookings').unsubscribe('*')
})
</script>
