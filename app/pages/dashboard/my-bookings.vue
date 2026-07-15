<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6">
        <h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Bookings</span></h1>
        <p class="mt-1 text-sm text-brand-grey">Your service and test ride bookings</p>
      </div>

      <div class="mb-4 flex flex-wrap gap-3">
        <select v-model="typeFilter" class="input-field w-40"><option value="">All Types</option><option value="service">Service</option><option value="test_ride">Test Ride</option></select>
        <select v-model="statusFilter" class="input-field w-40"><option value="">All Status</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="in_progress">In Progress</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option></select>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10" /><div class="mt-2 h-4 w-40 rounded bg-brand-grey/10" /></div>
      </div>

      <div v-else-if="filtered.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
        <Calendar class="mx-auto h-12 w-12 text-brand-grey/40" />
        <p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Bookings Found</p>
        <p class="mt-2 text-sm text-brand-grey/60">You haven't made any bookings yet</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="b in filtered" :key="b.id" class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-5 transition-all hover:border-brand-red/30">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-display text-lg tracking-display text-white">{{ b.type === 'service' ? (b.service_type || 'Service Booking') : 'Test Ride' }}</h3>
                <Badge :variant="b.type === 'service' ? 'default' : 'secondary'">{{ b.type === 'service' ? 'Service' : 'Test Ride' }}</Badge>
              </div>
              <p class="text-xs text-brand-grey">{{ formatDate(b.created) }}</p>
            </div>
            <Badge :variant="statusVariant(b.status)">{{ b.status }}</Badge>
          </div>
          <div class="mt-3 grid gap-2 sm:grid-cols-3">
            <div v-if="b.type === 'service'"><p class="text-xs text-brand-grey">Service Type</p><p class="text-sm text-white">{{ b.service_type || 'General Service' }}</p></div>
            <div v-if="b.type === 'test_ride'"><p class="text-xs text-brand-grey">Motorcycle</p><p class="text-sm text-white">{{ b.motorcycle || 'N/A' }}</p></div>
            <div><p class="text-xs text-brand-grey">Branch</p><p class="text-sm text-white">{{ b.branch || 'N/A' }}</p></div>
            <div><p class="text-xs text-brand-grey">Preferred Date</p><p class="text-sm text-white">{{ formatDate(b.preferred_date) || 'N/A' }}</p></div>
          </div>
          <p v-if="b.notes" class="mt-2 text-sm text-brand-grey/70">Notes: {{ b.notes }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Calendar } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'My Bookings - Nairobi Powerbikes' })

const pb = usePB(); const auth = useAuthStore()
const loading = ref(true)
const allBookings = ref<any[]>([])
const typeFilter = ref(''); const statusFilter = ref('')

function formatDate(d: string) { return d ? new Date(d).toLocaleDateString() : 'N/A' }
function statusVariant(s: string) { const map: Record<string, string> = { pending: 'warning', new: 'warning', confirmed: 'secondary', in_progress: 'default', completed: 'success', cancelled: 'danger' }; return map[s] || 'outline' }

function bookingType(b: any) { return b.type === 'test_ride' ? 'test_ride' : 'service' }

const filtered = computed(() => allBookings.value.filter(b => {
  const t = bookingType(b)
  if (typeFilter.value && t !== typeFilter.value) return false
  if (statusFilter.value && b.status !== statusFilter.value) return false
  return true
}))

onMounted(async () => {
  try {
    const uid = auth.user?.id
    const res = await pb.collection('service_bookings').getList(1, 100, { filter: `user = "${uid}"`, sort: '-created' }).catch(() => ({ items: [] }))
    allBookings.value = res.items as any[]
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})
</script>
