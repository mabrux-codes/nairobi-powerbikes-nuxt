<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <!-- Header -->
    <motion.div :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4 }" class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <span class="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-[10px] font-display tracking-[0.25em] text-brand-red uppercase">
          <span class="h-1.5 w-1.5 rounded-full bg-brand-red animate-pulse" />
          Operations
        </span>
        <h1 class="mt-3 font-heading text-3xl sm:text-4xl text-white">Service <span class="text-brand-red">Bookings</span></h1>
        <p class="mt-1 text-sm text-brand-grey">Live workshop pipeline — updates in real time</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-brand-grey/70">Updated {{ store.lastUpdated }}</span>
        <RealtimeStatus />
      </div>
    </motion.div>

    <!-- Stat cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div v-for="card in stats" :key="card.label" class="group relative overflow-hidden rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-red/40">
        <span v-if="card.dot" class="absolute top-0 left-0 h-0.5 w-0 bg-brand-red transition-all duration-300 group-hover:w-full" />
        <div class="flex items-center justify-between">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg" :class="card.iconBg">
            <component :is="card.icon" class="h-5 w-5" :class="card.iconColor" />
          </span>
          <span class="font-heading text-2xl text-white">{{ card.value }}</span>
        </div>
        <p class="mt-3 font-display text-xs tracking-display text-brand-grey uppercase">{{ card.label }}</p>
      </div>
    </div>

    <!-- Filters -->
    <motion.div :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.08, duration: 0.4 }" class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-grey/50" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search customer, bike, email…"
          class="w-full h-9 pl-9 pr-3 text-sm text-white bg-white/[0.04] border border-brand-grey/15 rounded-lg placeholder:text-brand-grey/50 focus:outline-none focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/20 transition-all"
        />
      </div>
      <select v-model="statusFilter" class="h-9 text-sm bg-brand-black/60 border border-brand-grey/15 rounded-lg text-white px-3 focus:outline-none focus:border-brand-red/60">
        <option value="">All Status</option>
        <option v-for="s in ['pending', 'diagnosed', 'in_progress', 'completed', 'cancelled']" :key="s" :value="s">{{ s.replace('_', ' ') }}</option>
      </select>
      <select v-model="branchFilter" class="h-9 text-sm bg-brand-black/60 border border-brand-grey/15 rounded-lg text-white px-3 focus:outline-none focus:border-brand-red/60">
        <option value="">All Branches</option>
        <option v-for="b in branches" :key="b" :value="b">{{ b }}</option>
      </select>
      <select v-model="sortBy" class="h-9 text-sm bg-brand-black/60 border border-brand-grey/15 rounded-lg text-white px-3 focus:outline-none focus:border-brand-red/60">
        <option value="newest">Newest</option>
        <option value="date">Earliest date</option>
      </select>
      <button v-if="hasFilters" class="h-9 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 rounded-lg transition-colors" @click="resetFilters">
        Clear <X class="h-3.5 w-3.5 inline -ml-0.5" />
      </button>
    </motion.div>

    <!-- Content -->
    <div v-if="!store.ready" class="space-y-3">
      <div v-for="i in 5" :key="i" class="animate-pulse rounded-xl border border-brand-grey/15 bg-brand-black/60 p-5">
        <div class="h-4 w-56 rounded bg-brand-grey/10" />
        <div class="mt-3 h-3 w-40 rounded bg-brand-grey/10" />
      </div>
    </div>

    <div v-else-if="paginated.length === 0" class="rounded-2xl border border-dashed border-brand-grey/20 bg-brand-black/40 p-14 text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-red/10">
        <Wrench class="h-8 w-8 text-brand-red/60" />
      </div>
      <p class="font-display text-xl tracking-display text-brand-grey">No service bookings found</p>
      <p class="mt-2 text-sm text-brand-grey/60">New bookings from customers appear here automatically.</p>
    </div>

    <motion.div v-else :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.12, duration: 0.4 }" class="rounded-xl border border-brand-grey/15 bg-brand-black/80 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-brand-black/60 border-b border-brand-grey/15">
            <tr>
              <th class="sticky top-0 px-5 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95">Customer</th>
              <th class="sticky top-0 px-5 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95">Motorcycle</th>
              <th class="sticky top-0 px-5 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95">Branch</th>
              <th class="sticky top-0 px-5 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95">Preferred</th>
              <th class="sticky top-0 px-5 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95 text-right">Cost</th>
              <th class="sticky top-0 px-5 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95">Status</th>
              <th class="sticky top-0 px-5 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-grey/10" v-motion-group>
            <BookingRow
              v-for="b in paginated"
              :key="b.id"
              :booking="b"
              :now="nowTs"
              @open="openDrawer"
              @print="printInvoice"
            />
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between border-t border-brand-grey/15 px-5 py-3">
        <p class="text-xs text-brand-grey">Showing <span class="text-white font-semibold">{{ pageStart + 1 }}–{{ pageEnd }}</span> of <span class="text-white font-semibold">{{ filtered.length }}</span></p>
        <div class="flex gap-2">
          <button :disabled="page === 1" class="h-8 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg transition-colors" @click="page--">Prev</button>
          <button :disabled="page >= totalPages" class="h-8 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg transition-colors" @click="page++">Next</button>
        </div>
      </div>
    </motion.div>

    <!-- Drawer -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="drawerOpen" class="fixed inset-0 z-[70]">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="drawerOpen = false" />
          <div class="absolute right-0 top-0 h-full w-full max-w-2xl bg-brand-black border-l border-brand-grey/20 shadow-2xl shadow-black/60 flex flex-col">
            <div class="flex items-center justify-between border-b border-brand-grey/15 px-6 py-4 shrink-0">
              <div class="flex items-center gap-3">
                <StatusChip :status="drawerItem?.status || 'pending'" />
                <h2 class="font-display text-lg tracking-display text-white">Service Booking</h2>
              </div>
              <button class="p-2 text-brand-grey hover:text-white hover:bg-white/5 rounded-lg transition-colors" @click="drawerOpen = false" aria-label="Close"><X class="h-5 w-5" /></button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin">
              <div v-if="drawerItem">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <div class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-sm font-bold text-white">
                      {{ (drawerItem.name || drawerItem.expand?.user?.name || '?').slice(0, 2).toUpperCase() }}
                    </div>
                    <div>
                      <p class="font-display text-xl tracking-display text-white">{{ drawerItem.name || drawerItem.expand?.user?.name || 'Guest' }}</p>
                      <p class="text-xs text-brand-grey">{{ drawerItem.phone || 'No phone' }} · {{ drawerItem.email || 'No email' }}</p>
                    </div>
                  </div>
                  <button class="h-9 px-3.5 text-xs font-semibold text-brand-red border border-brand-red/30 hover:bg-brand-red/10 rounded-lg transition-colors flex items-center gap-1.5" @click="printInvoice(drawerItem)">
                    <Printer class="h-3.5 w-3.5" /> Invoice
                  </button>
                </div>

                <div class="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <InfoTile :label="'Service'" :value="drawerItem.service_type || 'General'" />
                  <InfoTile :label="'Motorcycle'" :value="drawerItem.motorcycle || 'N/A'" />
                  <InfoTile :label="'Branch'" :value="drawerItem.branch || 'N/A'" />
                  <InfoTile :label="'Date'" :value="formatDate(drawerItem.preferred_date)" />
                  <InfoTile :label="'Time'" :value="formatTime(drawerItem.preferred_time)" />
                  <InfoTile :label="'Cost'" :value="drawerItem.cost ? 'KSh ' + Number(drawerItem.cost).toLocaleString() : 'TBD'" accent />
                </div>

                <div class="mt-4 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-4">
                  <div class="flex items-center gap-2 mb-2">
                    <ClipboardList class="h-4 w-4 text-brand-red" />
                    <span class="font-display text-xs tracking-[0.2em] text-brand-grey uppercase">Notes & Description</span>
                  </div>
                  <p v-if="drawerItem.description || drawerItem.notes" class="text-sm text-brand-grey whitespace-pre-wrap">{{ drawerItem.description || drawerItem.notes }}</p>
                  <p v-else class="text-sm text-brand-grey/60 italic">No description provided.</p>
                </div>

                <div class="mt-4 flex flex-wrap gap-2">
                  <a v-if="drawerItem.id_document" :href="filesUrl(drawerItem, drawerItem.id_document)" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold text-white border border-brand-grey/20 rounded-lg hover:border-brand-red/50 transition-colors">
                    <FileText class="h-3.5 w-3.5" /> ID Document
                  </a>
                  <a v-if="drawerItem.drivers_license" :href="filesUrl(drawerItem, drawerItem.drivers_license)" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 h-9 px-3 text-xs font-semibold text-white border border-brand-grey/20 rounded-lg hover:border-brand-red/50 transition-colors">
                    <FileText class="h-3.5 w-3.5" /> Driver's License
                  </a>
                </div>

                <div class="mt-6 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <Clock class="h-4 w-4 text-brand-red" />
                    <span class="font-display text-xs tracking-[0.2em] text-brand-grey uppercase">Timeline</span>
                  </div>
                  <div class="space-y-0">
                    <div class="flex gap-3">
                      <span class="mt-1.5 h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                      <div><p class="text-sm text-white">Booked</p><p class="text-xs text-brand-grey">{{ timeAgo(drawerItem.created) }}</p></div>
                    </div>
                    <div class="ml-1 w-px h-4 bg-brand-grey/20" />
                    <div class="flex gap-3">
                      <span class="mt-1.5 h-2 w-2 rounded-full bg-brand-red shrink-0" />
                      <div><p class="text-sm text-white">Last updated — status: <span class="capitalize">{{ drawerItem.status || 'pending' }}</span></p><p class="text-xs text-brand-grey">{{ timeAgo(drawerItem.updated) }}</p></div>
                    </div>
                  </div>
                </div>

                <div class="mt-6">
                  <div class="flex items-center gap-2 mb-3">
                    <Settings2 class="h-4 w-4 text-brand-red" />
                    <span class="font-display text-xs tracking-[0.2em] text-brand-grey uppercase">Update Booking</span>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Status</label>
                      <select v-model="form.status" class="input-field h-11 w-full">
                        <option value="pending">Pending</option>
                        <option value="diagnosed">Diagnosed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Cost (KSh)</label>
                      <input v-model="form.cost" type="number" class="input-field h-11 w-full" />
                    </div>
                    <div class="sm:col-span-2">
                      <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Mechanic / Assignment</label>
                      <input v-model="form.assigned_to" type="text" placeholder="Technician name" class="input-field h-11 w-full" />
                    </div>
                    <div class="sm:col-span-2">
                      <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Notes</label>
                      <textarea v-model="form.notes" rows="3" class="input-field w-full resize-none" />
                    </div>
                  </div>
                  <div class="mt-4 flex justify-end gap-3">
                    <Button variant="ghost" @click="drawerOpen = false">Close</Button>
                    <Button :disabled="saving" @click="save">{{ saving ? 'Saving…' : 'Save Changes' }}</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Wrench, Search, X, Printer, FileText, ClipboardList, Clock, Settings2, CalendarCheck2, CheckCircle2, Loader2 } from 'lucide-vue-next'
import StatusChip from '~/components/dashboard/StatusChip.vue'
import RealtimeStatus from '~/components/dashboard/RealtimeStatus.vue'
import BookingRow from '~/components/dashboard/BookingRow.vue'
import InfoTile from '~/components/dashboard/InfoTile.vue'
import { useAdminDataStore } from '~/stores/adminData'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { formatDate, formatTime } from '~/composables/useFormat'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Service Bookings - Nairobi Powerbikes' })

const store = useAdminDataStore()
const pb = usePB()
const toast = useToast()
const route = useRoute()

const searchQuery = ref((route.query.q as string) || '')
const statusFilter = ref('')
const branchFilter = ref('')
const sortBy = ref('newest')
const page = ref(1)
const PAGE_SIZE = 8
const nowTs = ref(Date.now())

const drawerOpen = ref(false)
const saving = ref(false)
const drawerItem = ref<any>(null)
const form = ref({ status: 'pending', cost: '', notes: '', assigned_to: '' })

const branches = computed(() => [...new Set(store.serviceBookings.map(b => b.branch).filter(Boolean))].sort())

const stats = computed(() => {
  const all = store.serviceBookings
  const count = (p: (b: any) => boolean) => all.filter(p).length
  return [
    { label: 'Total Bookings', value: all.length, icon: ClipboardList, iconBg: 'bg-brand-red/15', iconColor: 'text-brand-red', dot: true },
    { label: 'Pending', value: count(b => b.status === 'pending'), icon: Loader2, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
    { label: 'Diagnosed', value: count(b => b.status === 'diagnosed'), icon: Search, iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400' },
    { label: 'In Progress', value: count(b => b.status === 'in_progress'), icon: Settings2, iconBg: 'bg-indigo-500/15', iconColor: 'text-indigo-400' },
    { label: 'Completed', value: count(b => b.status === 'completed'), icon: CheckCircle2, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
  ]
})

const hasFilters = computed(() => searchQuery.value || statusFilter.value || branchFilter.value)

const filtered = computed(() => {
  let list = store.serviceBookings.slice()
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(b => [b.name, b.motorcycle, b.email, b.phone, b.service_type].some(v => String(v || '').toLowerCase().includes(q)))
  }
  if (statusFilter.value) list = list.filter(b => b.status === statusFilter.value)
  if (branchFilter.value) list = list.filter(b => b.branch === branchFilter.value)
  if (sortBy.value === 'date') {
    list = list.slice().sort((a, b) => ((a.preferred_date || '9').localeCompare(b.preferred_date || '9')))
  }
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const pageStart = computed(() => (page.value - 1) * PAGE_SIZE)
const pageEnd = computed(() => Math.min(page.value * PAGE_SIZE, filtered.value.length))
const paginated = computed(() => filtered.value.slice(pageStart.value, pageEnd.value))

watch([searchQuery, statusFilter, branchFilter, sortBy], () => { page.value = 1 })
watch(() => store.bookings.length, () => { page.value = Math.min(page.value, totalPages.value) })

function resetFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  branchFilter.value = ''
}

function filesUrl(rec: any, file: string) {
  return pb.files.getURL(rec, file)
}

function openDrawer(b: any) {
  drawerItem.value = b
  form.value = { status: b.status || 'pending', cost: b.cost?.toString() || '', notes: b.notes || '', assigned_to: b.assigned_to || '' }
  drawerOpen.value = true
}

async function save() {
  if (!drawerItem.value) return
  saving.value = true
  try {
    const payload: any = { status: form.value.status, notes: form.value.notes }
    if (form.value.cost) payload.cost = parseFloat(form.value.cost)
    if (form.value.assigned_to) payload.assigned_to = form.value.assigned_to
    await pb.collection('service_bookings').update(drawerItem.value.id, payload)
    toast.add({ type: 'success', title: 'Booking updated' })
    drawerOpen.value = false
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Update failed', message: e?.message || 'Something went wrong' })
  } finally {
    saving.value = false
  }
}

function printInvoice(b: any) {
  const name = b.name || b.expand?.user?.name || 'Customer'
  const w = window.open('', '_blank', 'width=720,height=900')
  if (!w) return
  w.document.write(`<!doctype html><html><head><title>Invoice – ${name}</title><style>
    body{font-family:Georgia,serif;color:#111;padding:40px;max-width:640px;margin:auto}
    .top{display:flex;justify-content:space-between;margin-bottom:32px}
    h1{font-size:20px;margin:0}.sub{color:#666;font-size:12px;margin-top:4px}
    h2{font-size:14px;letter-spacing:2px;text-transform:uppercase;border-top:1px solid #ddd;padding-top:12px;margin:24px 0 8px}
    table{width:100%;border-collapse:collapse;font-size:14px}
    td{padding:6px 0;color:#333}.r{text-align:right}.total{border-top:2px solid #111;font-weight:bold}
    .muted{color:#666;font-size:12px}</style></head><body>
    <div class="top"><div><h1>Nairobi Powerbikes</h1><p class="sub">Service Invoice</p></div><div style="text-align:right"><p class="sub">#${b.id.slice(0, 8).toUpperCase()}</p><p class="sub">${formatDate(b.preferred_date)} ${formatTime(b.preferred_time)}</p></div></div>
    <h2>Bill To</h2><p style="font-size:14px">${name}<br/>${b.phone || ''} ${b.email || ''}</p>
    <h2>Details</h2><table><tr><td>Service</td><td class="r">${b.service_type || 'General Service'}</td></tr>
    <tr><td>Motorcycle</td><td class="r">${b.motorcycle || '—'}</td></tr>
    <tr><td>Branch</td><td class="r">${b.branch || '—'}</td></tr>
    <tr><td>Status</td><td class="r">${(b.status || 'pending').replace('_', ' ')}</td></tr>
    <tr class="total"><td>Amount Due</td><td class="r">KSh ${Number(b.cost || 0).toLocaleString()}</td></tr></table>
    <p class="muted" style="margin-top:40px;border-top:1px solid #ddd;padding-top:12px">Thank you for choosing Nairobi Powerbikes.</p>
  </body></html>`)
  w.document.close()
  w.focus()
  w.print()
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

let clockTimer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  await store.ensureActive()
  clockTimer = setInterval(() => { nowTs.value = Date.now() }, 30000)
  const editId = route.query.edit as string
  if (editId) {
    const found = store.bookings.find(b => b.id === editId)
    if (found) openDrawer(found)
  }
})

onUnmounted(() => {
  store.release()
  if (clockTimer) clearInterval(clockTimer)
})

watch(drawerOpen, (v) => { document.body.style.overflow = v ? 'hidden' : '' })
</script>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.25s ease; }
.drawer-enter-active .absolute.right-0, .drawer-leave-active .absolute.right-0 { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .absolute.right-0 { transform: translateX(100%); }
.drawer-leave-to .absolute.right-0 { transform: translateX(100%); }
</style>