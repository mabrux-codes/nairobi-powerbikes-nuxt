<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6">
        <h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Bookings</span></h1>
        <p class="mt-1 text-sm text-brand-grey">Your service booking forms submitted</p>
      </div>

      <div class="mb-4 flex flex-wrap gap-3">
        <select v-model="statusFilter" class="input-field w-40">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="diagnosed">Diagnosed</option>
          <option value="in_progress">In Progress</option>
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
        <Wrench class="mx-auto h-12 w-12 text-brand-grey/40" />
        <p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Service Bookings</p>
        <p class="mt-2 text-sm text-brand-grey/60">You haven't submitted any service booking forms yet</p>
        <NuxtLink to="/service/booking" class="mt-4 inline-block"><Button>Book a Service</Button></NuxtLink>
      </div>

      <div v-else class="space-y-4">
        <div v-for="b in filtered" :key="b.id" class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-5 transition-all hover:border-brand-red/30">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-display text-lg tracking-display text-white">{{ b.service_type || 'Service Booking' }}</h3>
                <Badge variant="default">Service</Badge>
              </div>
              <p class="text-xs text-brand-grey">{{ b.motorcycle || 'N/A' }} &middot; {{ formatDate(b.preferred_date) || 'N/A' }}</p>
            </div>
            <Badge :variant="statusVariant(b.status)">{{ b.status }}</Badge>
          </div>

          <div class="mt-4">
            <div class="flex items-center gap-1 text-xs text-brand-grey/60">
              <div v-for="(step, i) in serviceSteps" :key="step.key" class="flex items-center gap-1">
                <div class="flex items-center gap-1.5">
                  <div class="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
                    :class="stepStyle(step.key, b.status)"
                  >
                    <Check v-if="stepIndex(b.status) >= i" class="h-3.5 w-3.5" />
                    <span v-else>{{ i + 1 }}</span>
                  </div>
                  <span :class="stepIndex(b.status) >= i ? 'text-white' : 'text-brand-grey/50'">{{ step.label }}</span>
                </div>
                <ChevronRight v-if="i < serviceSteps.length - 1" class="mx-2 h-3 w-3 text-brand-grey/30" />
              </div>
            </div>
          </div>

          <div class="mt-3 grid gap-2 sm:grid-cols-3">
            <div><p class="text-xs text-brand-grey">Branch</p><p class="text-sm text-white">{{ b.branch || 'N/A' }}</p></div>
            <div><p class="text-xs text-brand-grey">Preferred Date</p><p class="text-sm text-white">{{ formatDate(b.preferred_date) || 'N/A' }}</p></div>
            <div><p class="text-xs text-brand-grey">Cost</p><p class="text-sm text-white">{{ b.cost ? `KSh ${b.cost.toLocaleString()}` : 'TBD' }}</p></div>
          </div>
          <p v-if="b.notes" class="mt-2 text-sm text-brand-grey/70">Notes: {{ b.notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Check, ChevronRight, Wrench } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'My Bookings - Nairobi Powerbikes' })

const pb = usePB()
const auth = useAuthStore()
const loading = ref(true)
const allBookings = ref<any[]>([])
const statusFilter = ref('')

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

const filtered = computed(() => {
  if (!statusFilter.value) return allBookings.value
  return allBookings.value.filter(b => b.status === statusFilter.value)
})

function handleRealtime(e: any) {
  const record = e.record as any
  const userId = auth.user?.id
  if (record.user !== userId || record.type !== 'service') return
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
}

onMounted(async () => {
  try {
    const uid = auth.user?.id
    const res = await pb.collection('service_bookings').getList(1, 100, {
      filter: `type="service" && user = "${uid}"`,
      sort: '-created',
    }).catch(() => ({ items: [] }))
    allBookings.value = res.items as any[]
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
