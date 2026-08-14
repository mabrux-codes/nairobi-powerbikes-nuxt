<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <!-- Header -->
    <motion.div :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4 }" class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <span class="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] font-display tracking-[0.25em] text-amber-400 uppercase">
          <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          Operations
        </span>
        <h1 class="mt-3 font-heading text-3xl sm:text-4xl text-white">Test Ride <span class="text-brand-red">Bookings</span></h1>
        <p class="mt-1 text-sm text-brand-grey">Live ride requests, check-ins and follow-ups</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-brand-grey/70">Updated {{ store.lastUpdated }}</span>
        <RealtimeStatus />
      </div>
    </motion.div>

    <!-- Stats -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div v-for="card in stats" :key="card.label" class="group relative overflow-hidden rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-500/40">
        <span v-if="card.dot" class="absolute top-0 left-0 h-0.5 w-0 bg-amber-400 transition-all duration-300 group-hover:w-full" />
        <div class="flex items-center justify-between">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg" :class="card.iconBg">
            <component :is="card.icon" class="h-5 w-5" :class="card.iconColor" />
          </span>
          <span class="font-heading text-2xl text-white">{{ card.value }}</span>
        </div>
        <p class="mt-3 font-display text-xs tracking-display text-brand-grey uppercase">{{ card.label }}</p>
      </div>
    </div>

    <!-- Filters + view toggle -->
    <motion.div :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.08, duration: 0.4 }" class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-grey/50" />
        <input v-model="searchQuery" type="text" placeholder="Search customer, bike, email…" class="w-full h-9 pl-9 pr-3 text-sm text-white bg-white/[0.04] border border-brand-grey/15 rounded-lg placeholder:text-brand-grey/50 focus:outline-none focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 transition-all" />
      </div>
      <select v-model="statusFilter" class="h-9 text-sm bg-brand-black/60 border border-brand-grey/15 rounded-lg text-white px-3 focus:outline-none focus:border-amber-500/60">
        <option value="">All Status</option>
        <option v-for="s in ['pending', 'confirmed', 'completed', 'cancelled']" :key="s" :value="s">{{ s }}</option>
      </select>
      <div class="flex items-center rounded-lg border border-brand-grey/15 p-0.5">
        <button class="h-8 px-3 text-xs font-semibold rounded-md transition-colors" :class="view === 'list' ? 'bg-brand-red text-white' : 'text-brand-grey hover:text-white'" @click="view = 'list'">
          <List class="h-3.5 w-3.5 inline mr-1" />List
        </button>
        <button class="h-8 px-3 text-xs font-semibold rounded-md transition-colors" :class="view === 'calendar' ? 'bg-brand-red text-white' : 'text-brand-grey hover:text-white'" @click="view = 'calendar'">
          <CalendarDays class="h-3.5 w-3.5 inline mr-1" />Calendar
        </button>
      </div>
      <button v-if="hasFilters" class="h-9 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 rounded-lg transition-colors" @click="resetFilters">
        Clear <X class="h-3.5 w-3.5 inline -ml-0.5" />
      </button>
    </motion.div>

    <!-- List view -->
    <template v-if="view === 'list'">
      <div v-if="!store.ready" class="space-y-3">
        <div v-for="i in 5" :key="i" class="animate-pulse rounded-xl border border-brand-grey/15 bg-brand-black/60 p-5">
          <div class="h-4 w-56 rounded bg-brand-grey/10" />
          <div class="mt-3 h-3 w-40 rounded bg-brand-grey/10" />
        </div>
      </div>
      <div v-else-if="paginated.length === 0" class="rounded-2xl border border-dashed border-brand-grey/20 bg-brand-black/40 p-14 text-center">
        <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10">
          <CalendarCheck2 class="h-8 w-8 text-amber-400/60" />
        </div>
        <p class="font-display text-xl tracking-display text-brand-grey">No test rides found</p>
        <p class="mt-2 text-sm text-brand-grey/60">New ride requests appear here automatically.</p>
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
                <th class="sticky top-0 px-5 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95">Docs</th>
                <th class="sticky top-0 px-5 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95">Status</th>
                <th class="sticky top-0 px-5 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-brand-grey/10">
              <tr v-for="r in paginated" :key="r.id" class="group cursor-pointer transition-colors hover:bg-white/[0.03]" @click="openDrawer(r)">
                <td class="px-5 py-4">
                  <div class="flex items-center gap-3">
                    <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/40 to-brand-grey/30 text-xs font-bold text-white">{{ (r.name || r.expand?.user?.name || '?').slice(0, 2).toUpperCase() }}</span>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-white truncate">{{ r.name || r.expand?.user?.name || 'Guest' }}</p>
                      <p class="text-xs text-brand-grey truncate">{{ r.phone || r.email || 'No contact' }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-3.5"><p class="text-sm text-brand-grey truncate">{{ r.motorcycle || 'N/A' }}</p></td>
                <td class="px-5 py-3.5"><p class="text-xs text-brand-grey">{{ r.branch || 'N/A' }}</p></td>
                <td class="px-5 py-3.5">
                  <p class="text-sm text-brand-grey whitespace-nowrap">{{ formatDate(r.preferred_date) }}</p>
                  <p class="text-[11px] text-brand-grey/60">{{ r.preferred_time || 'Flexible' }}</p>
                </td>
                <td class="px-5 py-3.5">
                  <div v-if="r.id_document || r.drivers_license" class="flex gap-1">
                    <span class="inline-flex items-center gap-1 h-6 px-2 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold"><FileCheck2 class="h-3 w-3" />{{ r.id_document && r.drivers_license ? '2' : '1' }}</span>
                  </div>
                  <span v-else class="inline-flex items-center gap-1 h-6 px-2 rounded-md bg-brand-grey/10 text-brand-grey/70 text-[10px] font-semibold"><FileX2 class="h-3 w-3" />None</span>
                </td>
                <td class="px-5 py-3.5"><StatusChip :status="r.status || 'pending'" /></td>
                <td class="px-5 py-3.5 text-right">
                  <span class="inline-flex items-center gap-1 text-xs font-semibold text-brand-red opacity-0 group-hover:opacity-100 transition-opacity">Open <ChevronRight class="h-4 w-4" /></span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-brand-grey/15 px-5 py-3">
          <p class="text-xs text-brand-grey">Showing <span class="text-white font-semibold">{{ pageStart + 1 }}–{{ pageEnd }}</span> of <span class="text-white font-semibold">{{ filtered.length }}</span></p>
          <div class="flex gap-2">
            <button :disabled="page === 1" class="h-8 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg transition-colors" @click="page--">Prev</button>
            <button :disabled="page >= totalPages" class="h-8 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg transition-colors" @click="page++">Next</button>
          </div>
        </div>
      </motion.div>
    </template>

    <!-- Calendar view -->
    <template v-else>
      <motion.div :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.1, duration: 0.4 }" class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 class="font-display text-xl tracking-display text-white">{{ calendarLabel }}</h2>
          <div class="flex items-center gap-2">
            <button class="h-9 w-9 flex items-center justify-center text-brand-grey hover:text-white hover:bg-white/5 rounded-lg transition-colors" @click="shiftMonth(-1)"><ChevronLeft class="h-4 w-4" /></button>
            <button class="h-9 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 rounded-lg transition-colors" @click="goToday">Today</button>
            <button class="h-9 w-9 flex items-center justify-center text-brand-grey hover:text-white hover:bg-white/5 rounded-lg transition-colors" @click="shiftMonth(1)"><ChevronRight class="h-4 w-4" /></button>
          </div>
        </div>

        <div class="grid grid-cols-7 gap-1.5 text-center">
          <div v-for="d in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']" :key="d" class="pb-2 text-[10px] font-display tracking-[0.2em] text-brand-grey/60 uppercase">{{ d }}</div>
        </div>
        <div class="grid grid-cols-7 gap-1.5">
          <div v-for="(cell, i) in calendarCells" :key="i" class="min-h-[76px] rounded-lg border transition-all duration-200"
            :class="cell.day
              ? isToday(cell.date) ? 'border-amber-500/60 bg-amber-500/5' : selectedDateKey === dayKey(cell.date) ? 'border-brand-red/60 bg-brand-red/5' : 'border-brand-grey/15 hover:border-amber-500/40 bg-white/[0.02]'
              : 'border-brand-grey/10 bg-transparent'">
            <button v-if="cell.day" class="w-full h-full p-2 text-left" @click="selectDay(cell.date)">
              <span class="flex items-center justify-between">
                <span class="text-xs font-semibold" :class="isToday(cell.date) ? 'text-amber-400' : 'text-brand-grey'">{{ cell.date.getDate() }}</span>
                <span v-if="ridesOnDay(cell.date).length" class="flex -space-x-1">
                  <span v-for="(r, ri) in ridesOnDay(cell.date).slice(0, 3)" :key="ri" class="h-4 w-4 rounded-full border border-brand-black flex items-center justify-center text-[8px] font-bold" :class="r.status === 'completed' ? 'bg-emerald-500 text-white' : r.status === 'cancelled' ? 'bg-brand-grey/40 text-white' : 'bg-amber-400 text-black'">{{ ri + 1 }}</span>
                  <span v-if="ridesOnDay(cell.date).length > 3" class="h-4 w-4 rounded-full bg-brand-black border border-brand-grey/40 text-[8px] text-brand-grey flex items-center justify-center">+</span>
                </span>
              </span>
              <span class="mt-2 block h-1.5 w-full overflow-hidden rounded-full bg-brand-grey/10">
                <span class="block h-full rounded-full bg-amber-400" :style="{ width: Math.min(100, ridesOnDay(cell.date).length * 25) + '%' }" />
              </span>
            </button>
          </div>
        </div>

        <div v-if="selectedDate" class="mt-5 border-t border-brand-grey/15 pt-5">
          <p class="mb-3 font-display text-sm tracking-[0.2em] text-brand-grey uppercase">{{ selectedDateLabel }}</p>
          <div v-if="ridesOnDay(selectedDate).length === 0" class="rounded-lg border border-dashed border-brand-grey/20 p-8 text-center">
            <p class="text-sm text-brand-grey/70">No rides scheduled on this day.</p>
          </div>
          <div v-else class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <button v-for="r in ridesOnDay(selectedDate)" :key="r.id" class="flex flex-col items-start gap-2 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-4 text-left transition-all duration-200 hover:border-amber-500/40 hover:bg-amber-500/5" @click="openDrawer(r)">
              <div class="flex w-full items-center justify-between">
                <span class="text-sm font-medium text-white truncate">{{ r.name || r.expand?.user?.name || 'Guest' }}</span>
                <StatusChip :status="r.status || 'pending'" size="sm" />
              </div>
              <span class="text-xs text-brand-grey truncate">{{ r.motorcycle || 'N/A' }}</span>
              <span class="text-[11px] text-brand-grey/60">{{ r.preferred_time || 'Flexible' }} · {{ r.branch || 'Main Branch' }}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </template>

    <!-- Drawer -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="drawerOpen" class="fixed inset-0 z-[70]">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="drawerOpen = false" />
          <div class="absolute right-0 top-0 h-full w-full max-w-2xl bg-brand-black border-l border-brand-grey/20 shadow-2xl shadow-black/60 flex flex-col">
            <div class="flex items-center justify-between border-b border-brand-grey/15 px-6 py-4 shrink-0">
              <div class="flex items-center gap-3">
                <StatusChip :status="drawerItem?.status || 'pending'" />
                <h2 class="font-display text-lg tracking-display text-white">Test Ride</h2>
              </div>
              <button class="p-2 text-brand-grey hover:text-white hover:bg-white/5 rounded-lg transition-colors" @click="drawerOpen = false" aria-label="Close"><X class="h-5 w-5" /></button>
            </div>

            <div class="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin" v-if="drawerItem">
              <div>
                <div class="flex items-center gap-3">
                  <span class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-500/40 to-brand-grey/30 text-sm font-bold text-white">{{ (drawerItem.name || drawerItem.expand?.user?.name || '?').slice(0, 2).toUpperCase() }}</span>
                  <div>
                    <p class="font-display text-xl tracking-display text-white">{{ drawerItem.name || drawerItem.expand?.user?.name || 'Guest' }}</p>
                    <p class="text-xs text-brand-grey">{{ drawerItem.phone || 'No phone' }} · {{ drawerItem.email || 'No email' }}</p>
                  </div>
                </div>

                <div class="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <InfoTile label="Motorcycle" :value="drawerItem.motorcycle || 'N/A'" />
                  <InfoTile label="Branch" :value="drawerItem.branch || 'N/A'" />
                  <InfoTile label="Salesperson" :value="drawerItem.assigned_to || 'Unassigned'" accent />
                  <InfoTile label="Date" :value="formatDate(drawerItem.preferred_date)" />
                  <InfoTile label="Time" :value="drawerItem.preferred_time || 'Flexible'" />
                  <InfoTile label="Customer ID" :value="drawerItem.expand?.user?.name ? 'Verified' : 'Guest'" />
                </div>

                <div class="mt-4 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-4">
                  <div class="flex items-center gap-2 mb-3">
                    <ShieldCheck class="h-4 w-4 text-amber-400" />
                    <span class="font-display text-xs tracking-[0.2em] text-brand-grey uppercase">Check-in Documents</span>
                  </div>
                  <div v-if="drawerItem.id_document || drawerItem.drivers_license" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div v-if="drawerItem.id_document">
                      <p class="mb-1 text-xs text-brand-grey">ID Document</p>
                      <img v-if="isImage(drawerItem.id_document)" :src="filesUrl(drawerItem, drawerItem.id_document)" class="max-h-40 w-full rounded-lg border border-brand-grey/20 object-contain cursor-pointer hover:opacity-80 transition-opacity" @click="previewImg = filesUrl(drawerItem, drawerItem.id_document)" />
                      <a v-else :href="filesUrl(drawerItem, drawerItem.id_document)" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-white"><FileText class="h-4 w-4" /> View</a>
                    </div>
                    <div v-if="drawerItem.drivers_license">
                      <p class="mb-1 text-xs text-brand-grey">Driver's License</p>
                      <img v-if="isImage(drawerItem.drivers_license)" :src="filesUrl(drawerItem, drawerItem.drivers_license)" class="max-h-40 w-full rounded-lg border border-brand-grey/20 object-contain cursor-pointer hover:opacity-80 transition-opacity" @click="previewImg = filesUrl(drawerItem, drawerItem.drivers_license)" />
                      <a v-else :href="filesUrl(drawerItem, drawerItem.drivers_license)" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-white"><FileText class="h-4 w-4" /> View</a>
                    </div>
                  </div>
                  <p v-else class="text-sm text-brand-grey/60 italic">No documents uploaded yet.</p>
                </div>

                <div v-if="drawerItem.notes" class="mt-4 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-4">
                  <p class="text-sm text-brand-grey whitespace-pre-wrap">{{ drawerItem.notes }}</p>
                </div>

                <div class="mt-6">
                  <div class="flex items-center gap-2 mb-3">
                    <UserCog class="h-4 w-4 text-brand-red" />
                    <span class="font-display text-xs tracking-[0.2em] text-brand-grey uppercase">Update Ride</span>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Status</label>
                      <select v-model="form.status" class="input-field h-11 w-full">
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                    <div>
                      <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Salesperson</label>
                      <input v-model="form.assigned_to" type="text" placeholder="Assign staff" class="input-field h-11 w-full" />
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

    <Teleport to="body">
      <div v-if="previewImg" class="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4" @click="previewImg = ''">
        <div class="relative max-h-[90vh] max-w-[90vw]">
          <button @click="previewImg = ''" class="absolute -right-3 -top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand-red text-white"><X class="h-4 w-4" /></button>
          <img :src="previewImg" class="max-h-[90vh] max-w-[90vw] rounded-lg object-contain" />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import {
  Search, X, CalendarCheck2, Clock3, CheckCircle2, XCircle, List, CalendarDays,
  ChevronLeft, ChevronRight, FileText, FileCheck2, FileX2, ShieldCheck, UserCog, MapPin,
} from 'lucide-vue-next'
import StatusChip from '~/components/dashboard/StatusChip.vue'
import RealtimeStatus from '~/components/dashboard/RealtimeStatus.vue'
import InfoTile from '~/components/dashboard/InfoTile.vue'
import { useAdminDataStore } from '~/stores/adminData'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { formatDate, formatTime } from '~/composables/useFormat'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Test Ride Bookings - Nairobi Powerbikes' })

const store = useAdminDataStore()
const pb = usePB()
const toast = useToast()
const route = useRoute()

const view = ref<'list' | 'calendar'>('list')
const searchQuery = ref((route.query.q as string) || '')
const statusFilter = ref('')
const page = ref(1)
const PAGE_SIZE = 8

const drawerOpen = ref(false)
const saving = ref(false)
const drawerItem = ref<any>(null)
const form = ref({ status: 'pending', notes: '', assigned_to: '' })
const previewImg = ref('')

const calendarAnchor = ref(new Date())
const selectedDate = ref<Date | null>(null)

const stats = computed(() => {
  const all = store.testRides
  const count = (p: (b: any) => boolean) => all.filter(p).length
  const today = new Date().toISOString().slice(0, 10)
  return [
    { label: 'Total Rides', value: all.length, icon: CalendarCheck2, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400', dot: true },
    { label: 'Today', value: count(b => b.preferred_date === today), icon: Clock3, iconBg: 'bg-sky-500/15', iconColor: 'text-sky-400' },
    { label: 'Pending', value: count(b => b.status === 'pending'), icon: XCircle, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
    { label: 'Completed', value: count(b => b.status === 'completed'), icon: CheckCircle2, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
    { label: 'Cancelled', value: count(b => b.status === 'cancelled'), icon: XCircle, iconBg: 'bg-rose-500/15', iconColor: 'text-rose-400' },
  ]
})

const hasFilters = computed(() => searchQuery.value || statusFilter.value)

const filtered = computed(() => {
  let list = store.testRides.slice()
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(r => [r.name, r.motorcycle, r.email, r.phone].some(v => String(v || '').toLowerCase().includes(q)))
  }
  if (statusFilter.value) list = list.filter(r => r.status === statusFilter.value)
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const pageStart = computed(() => (page.value - 1) * PAGE_SIZE)
const pageEnd = computed(() => Math.min(page.value * PAGE_SIZE, filtered.value.length))
const paginated = computed(() => filtered.value.slice(pageStart.value, pageEnd.value))

watch([searchQuery, statusFilter], () => { page.value = 1 })

function resetFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
}

function filesUrl(rec: any, file: string) { return pb.files.getURL(rec, file) }

function isImage(filename: string) { return /\.(jpe?g|png)$/i.test(filename) }

function openDrawer(r: any) {
  drawerItem.value = r
  form.value = { status: r.status || 'pending', notes: r.notes || '', assigned_to: r.assigned_to || '' }
  drawerOpen.value = true
}

async function save() {
  if (!drawerItem.value) return
  saving.value = true
  try {
    const payload: any = { status: form.value.status, notes: form.value.notes }
    if (form.value.assigned_to) payload.assigned_to = form.value.assigned_to
    await pb.collection('test_rides').update(drawerItem.value.id, payload)
    toast.add({ type: 'success', title: 'Test ride updated' })
    drawerOpen.value = false
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Update failed', message: e?.message || 'Something went wrong' })
  } finally {
    saving.value = false
  }
}

const calendarLabel = computed(() => calendarAnchor.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))

const calendarCells = computed(() => {
  const y = calendarAnchor.value.getFullYear()
  const m = calendarAnchor.value.getMonth()
  const first = new Date(y, m, 1)
  const startOffset = first.getDay()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const cells: { date: Date | null; day: boolean }[] = []
  for (let i = 0; i < startOffset; i++) cells.push({ date: null, day: false })
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(y, m, d), day: true })
  while (cells.length % 7 !== 0) cells.push({ date: null, day: false })
  return cells
})

function dayKey(d: Date) { return d.toISOString().slice(0, 10) }

function isToday(d: Date) { return dayKey(d) === new Date().toISOString().slice(0, 10) }

function ridesOnDay(d: Date) {
  return store.testRides.filter(r => {
    if (!r.preferred_date) return false
    const pd = new Date(r.preferred_date)
    return pd.getFullYear() === d.getFullYear() && pd.getMonth() === d.getMonth() && pd.getDate() === d.getDate()
  })
}

function selectDay(d: Date) { selectedDate.value = d }

function shiftMonth(dir: number) {
  calendarAnchor.value = new Date(calendarAnchor.value.getFullYear(), calendarAnchor.value.getMonth() + dir, 1)
  selectedDate.value = null
}

function goToday() {
  calendarAnchor.value = new Date()
  selectedDate.value = new Date()
}

const selectedDateLabel = computed(() => selectedDate.value?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) || '')

onMounted(async () => {
  await store.ensureActive()
  const editId = route.query.edit as string
  if (editId) {
    const found = store.testRides.find(b => b.id === editId)
    if (found) openDrawer(found)
  }
})

onUnmounted(() => { store.release() })

watch([drawerOpen, previewImg], ([d, p]) => {
  document.body.style.overflow = d || p ? 'hidden' : ''
})
</script>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.25s ease; }
.drawer-enter-active .absolute.right-0, .drawer-leave-active .absolute.right-0 { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .absolute.right-0 { transform: translateX(100%); }
.drawer-leave-to .absolute.right-0 { transform: translateX(100%); }
</style>