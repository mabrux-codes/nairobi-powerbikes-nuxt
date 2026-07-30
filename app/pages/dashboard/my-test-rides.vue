<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6">
        <h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Test Rides</span></h1>
        <p class="mt-1 text-sm text-brand-grey">Your test ride bookings and their status</p>
      </div>

      <div class="mb-4 flex flex-wrap gap-3">
        <select v-model="statusFilter" class="input-field w-40">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-4">
          <div class="h-5 w-64 rounded bg-brand-grey/10" />
          <div class="mt-2 h-4 w-40 rounded bg-brand-grey/10" />
        </div>
      </div>

      <div v-else-if="filtered.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
        <Calendar class="mx-auto h-12 w-12 text-brand-grey/40" />
        <p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Test Ride Bookings</p>
        <p class="mt-2 text-sm text-brand-grey/60">You haven't booked any test rides yet</p>
        <NuxtLink to="/service/test-ride" class="mt-4 inline-block"><Button>Book a Test Ride</Button></NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div v-for="b in filtered" :key="b.id" class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-5 transition-all hover:border-brand-red/30">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-display text-lg tracking-display text-white">{{ b.motorcycle || 'Test Ride' }}</h3>
                <Badge variant="secondary">Test Ride</Badge>
              </div>
              <p class="text-xs text-brand-grey">{{ formatDate(b.preferred_date) }} &middot; {{ formatTime(b.preferred_time) }}</p>
            </div>
            <Badge :variant="statusVariant(b.status)">{{ b.status }}</Badge>
          </div>

          <div class="mt-3 grid gap-2 sm:grid-cols-3">
            <div><p class="text-xs text-brand-grey">Branch</p><p class="text-sm text-white">{{ b.branch || 'N/A' }}</p></div>
            <div><p class="text-xs text-brand-grey">Date</p><p class="text-sm text-white">{{ formatDate(b.preferred_date) || 'N/A' }}</p></div>
            <div><p class="text-xs text-brand-grey">Time</p><p class="text-sm text-white">{{ formatTime(b.preferred_time) }}</p></div>
          </div>

          <div class="mt-3">
            <div class="flex items-center gap-1 text-xs text-brand-grey/60">
              <div v-for="(step, i) in testRideSteps" :key="step.key" class="flex items-center gap-1">
                <div class="flex items-center gap-1.5">
                  <div class="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
                    :class="testRideStepStyle(step.key, b.status)"
                  >
                    <Check v-if="testRideStepIndex(b.status) >= i" class="h-3.5 w-3.5" />
                    <span v-else>{{ i + 1 }}</span>
                  </div>
                  <span :class="testRideStepIndex(b.status) >= i ? 'text-white' : 'text-brand-grey/50'">{{ step.label }}</span>
                </div>
                <ChevronRight v-if="i < testRideSteps.length - 1" class="mx-2 h-3 w-3 text-brand-grey/30" />
              </div>
            </div>
          </div>

          <p v-if="b.notes" class="mt-2 text-sm text-brand-grey/70">Notes: {{ b.notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar, Check, ChevronRight } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { formatDate, formatTime } from '~/composables/useFormat'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'My Test Rides - Nairobi Powerbikes' })

const pb = usePB()
const auth = useAuthStore()
const loading = ref(true)
const allTestRides = ref<any[]>([])
const statusFilter = ref('')

const testRideSteps = [
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
]

const testRideStatusOrder: Record<string, number> = { pending: 0, confirmed: 1, completed: 2, cancelled: -1 }

function testRideStepIndex(s: string) { return testRideStatusOrder[s] ?? -1 }

function testRideStepStyle(stepKey: string, bookingStatus: string) {
  const idx = testRideStepIndex(bookingStatus)
  const stepIdx = testRideStatusOrder[stepKey]
  if (bookingStatus === 'cancelled') return 'bg-red-500/30 text-red-400'
  if (idx >= stepIdx) return 'bg-emerald-500/30 text-emerald-400'
  return 'bg-brand-grey/10 text-brand-grey/50'
}



function statusVariant(s: string) {
  const map: Record<string, string> = { pending: 'warning', confirmed: 'secondary', completed: 'success', cancelled: 'danger' }
  return map[s] || 'outline'
}

const filtered = computed(() => {
  if (!statusFilter.value) return allTestRides.value
  return allTestRides.value.filter(b => b.status === statusFilter.value)
})

function handleRealtime(e: any) {
  const record = e.record as any
  const userId = auth.user?.id
  if (record.user !== userId || record.type !== 'test_ride') return
  if (e.action === 'delete') {
    allTestRides.value = allTestRides.value.filter(b => b.id !== record.id)
  } else {
    const idx = allTestRides.value.findIndex(b => b.id === record.id)
    if (idx >= 0) {
      allTestRides.value[idx] = { ...allTestRides.value[idx], ...record }
      allTestRides.value = [...allTestRides.value]
    } else {
      allTestRides.value = [record as any, ...allTestRides.value]
    }
  }
}

onMounted(async () => {
  try {
    const uid = auth.user?.id
    const res = await pb.collection('service_bookings').getList(1, 100, {
      filter: `type="test_ride" && user = "${uid}"`,
      sort: '-created',
    }).catch(() => ({ items: [] }))
    allTestRides.value = res.items as any[]
    if (uid) {
      pb.collection('service_bookings').subscribe('*', handleRealtime, { filter: `user = "${uid}"` })
    }
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})

onUnmounted(() => {
  pb.collection('service_bookings').unsubscribe('*')
})
</script>
