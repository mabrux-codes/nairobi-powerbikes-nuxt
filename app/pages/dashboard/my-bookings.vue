<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-8">
      <h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Service Bookings</span></h1>
      <div class="mt-2 h-1 w-24 bg-brand-red" />
      <p class="mt-3 text-sm text-brand-grey">Track your motorcycle service requests from booking to completion.</p>
    </div>

    <div class="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
      <div class="relative flex-1">
        <Search class="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-brand-grey/50" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by reference, bike, service..."
          class="input-field h-11 w-full pl-11"
        />
      </div>
      <div class="flex gap-3">
        <select v-model="statusFilter" class="input-field h-11 w-auto min-w-44">
          <option value="">All Statuses</option>
          <option v-for="(meta, key) in STATUS" :key="key" :value="key">{{ meta.label }}</option>
        </select>
        <select v-model="sortOrder" class="input-field h-11 w-auto min-w-36">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="space-y-5">
      <div v-for="i in 3" :key="i" class="animate-pulse rounded-xl border border-brand-grey/15 p-6">
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-3">
            <div class="h-5 w-44 rounded bg-brand-grey/10" />
            <div class="h-4 w-64 rounded bg-brand-grey/10" />
          </div>
          <div class="h-6 w-24 rounded bg-brand-grey/10" />
        </div>
        <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div v-for="j in 4" :key="j" class="h-12 rounded bg-brand-grey/10" />
        </div>
      </div>
    </div>

    <div v-else-if="filtered.length === 0" class="rounded-xl border border-dashed border-brand-grey/20 bg-brand-black/40 p-14 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10">
        <Wrench class="h-8 w-8 text-brand-red" />
      </div>
      <p class="mt-5 font-heading text-2xl text-white">No service bookings found.</p>
      <p class="mt-2 text-sm text-brand-grey">Book a service appointment and track it here in real time.</p>
      <Button to="/service/booking" class="mt-6"><CalendarClock class="h-5 w-5" />Book a Service</Button>
    </div>

    <div v-else class="space-y-5">
      <div
        v-for="b in filtered"
        :key="b.id"
        class="group rounded-xl border border-brand-grey/15 bg-brand-black/80 transition-all duration-300 hover:border-brand-red/40 hover:shadow-lg hover:shadow-brand-red/5"
        :class="expanded[b.id] ? 'border-brand-red/40' : ''"
      >
        <div class="cursor-pointer p-5 sm:p-6" @click="toggleExpand(b.id)">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-3">
                <span class="font-display text-lg tracking-display text-white">{{ bookingRef(b) }}</span>
                <span
                  class="inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-0.5 text-xs font-display tracking-display uppercase"
                  :class="statusMeta(b.status).classes"
                >
                  <span class="h-1.5 w-1.5 rounded-full" :class="statusMeta(b.status).dot" />
                  {{ statusMeta(b.status).label }}
                </span>
              </div>
              <p class="mt-1 text-sm text-brand-grey">
                {{ serviceTypeLabel(b.service_type) }}
                <template v-if="b.motorcycle">&middot; {{ b.motorcycle }}</template>
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span class="flex items-center gap-1.5 text-xs text-brand-grey/60">
                <Clock class="h-3.5 w-3.5" />
                {{ formatDateTime(b.created) }}
              </span>
              <button
                class="flex h-9 w-9 items-center justify-center rounded-full border border-brand-grey/20 text-brand-grey transition-all duration-300 group-hover:border-brand-red/50 group-hover:text-brand-red"
                :class="expanded[b.id] ? 'rotate-180 border-brand-red/50 text-brand-red' : ''"
                aria-label="Toggle details"
              >
                <ChevronDown class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div v-if="b.motorcycle" class="flex items-start gap-2.5 rounded-lg border border-brand-grey/10 bg-white/[0.02] p-3">
              <Bike class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
              <div class="min-w-0"><p class="text-[10px] font-display tracking-display text-brand-grey uppercase">Bike</p><p class="truncate text-sm text-white">{{ b.motorcycle }}</p></div>
            </div>
            <div v-if="b.branch" class="flex items-start gap-2.5 rounded-lg border border-brand-grey/10 bg-white/[0.02] p-3">
              <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
              <div class="min-w-0"><p class="text-[10px] font-display tracking-display text-brand-grey uppercase">Branch</p><p class="truncate text-sm text-white">{{ b.branch }}</p></div>
            </div>
            <div v-if="b.preferred_date" class="flex items-start gap-2.5 rounded-lg border border-brand-grey/10 bg-white/[0.02] p-3">
              <CalendarClock class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
              <div class="min-w-0"><p class="text-[10px] font-display tracking-display text-brand-grey uppercase">Preferred Date</p><p class="text-sm text-white">{{ formatDate(b.preferred_date) }}<span v-if="b.preferred_time" class="ml-1 text-brand-grey">at {{ formatTime(b.preferred_time) }}</span></p></div>
            </div>
            <div v-if="b.created" class="flex items-start gap-2.5 rounded-lg border border-brand-grey/10 bg-white/[0.02] p-3">
              <FileText class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
              <div class="min-w-0"><p class="text-[10px] font-display tracking-display text-brand-grey uppercase">Submitted</p><p class="text-sm text-white">{{ formatDateTime(b.created) }}</p></div>
            </div>
          </div>
        </div>

        <div class="grid transition-all duration-500 ease-in-out" :class="expanded[b.id] ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
          <div class="overflow-hidden">
            <div class="border-t border-brand-grey/10 px-5 pt-5 pb-6 sm:px-6">
              <div class="space-y-5">
                <section v-if="bikeRows(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <Bike class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Motorcycle Information</h3>
                  </div>
                  <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="row in bikeRows(b)" :key="row.label">
                      <p class="text-[10px] font-display tracking-display text-brand-grey uppercase">{{ row.label }}</p>
                      <p class="mt-0.5 text-sm text-white">{{ row.value }}</p>
                    </div>
                  </div>
                </section>

                <section v-if="requestRows(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <ClipboardCheck class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Service Request</h3>
                  </div>
                  <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    <div v-for="row in requestRows(b)" :key="row.label" :class="row.full ? 'sm:col-span-2' : ''">
                      <p class="text-[10px] font-display tracking-display text-brand-grey uppercase">{{ row.label }}</p>
                      <p class="mt-0.5 text-sm whitespace-pre-line text-white">{{ row.value }}</p>
                    </div>
                  </div>
                </section>

                <section v-if="apptRows(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <CalendarClock class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Appointment Details</h3>
                  </div>
                  <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div v-for="row in apptRows(b)" :key="row.label">
                      <p class="text-[10px] font-display tracking-display text-brand-grey uppercase">{{ row.label }}</p>
                      <p class="mt-0.5 text-sm text-white">{{ row.value }}</p>
                    </div>
                  </div>
                </section>

                <section class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-5 flex items-center gap-2">
                    <History class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Booking Progress</h3>
                  </div>
                  <div class="relative">
                    <div
                      v-if="b.status === 'cancelled'"
                      class="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-brand-black/70 backdrop-blur-[2px]"
                    >
                      <span class="rounded-sm border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400">This booking was cancelled</span>
                    </div>
                    <ol class="space-y-0">
                      <li v-for="(s, i) in STAGES" :key="s.key" class="relative flex gap-4 pb-7 last:pb-0">
                        <div class="flex flex-col items-center">
                          <div
                            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-all duration-300"
                            :class="stageDotClass(b, i)"
                          >
                            <Check v-if="stageState(b, i) === 'done'" class="h-4 w-4" />
                            <span v-else-if="stageState(b, i) === 'current'" class="h-2 w-2 rounded-full bg-brand-red" />
                            <span v-else>{{ i + 1 }}</span>
                          </div>
                          <div
                            v-if="i < STAGES.length - 1"
                            class="mt-1 w-0.5 flex-1 rounded-full transition-colors duration-500"
                            :class="stageState(b, i) === 'done' ? 'bg-emerald-500/60' : 'bg-brand-grey/15'"
                          />
                        </div>
                        <div class="min-w-0 pb-1">
                          <p class="text-sm font-medium" :class="stageState(b, i) === 'pending' ? 'text-brand-grey/50' : 'text-white'">{{ s.label }}</p>
                          <p v-if="stageTime(b, i)" class="mt-0.5 text-xs text-brand-grey/60">{{ stageTime(b, i) }}</p>
                          <p v-if="i === currentStageIndex(b) && b.notes" class="mt-1.5 rounded-md border border-brand-red/20 bg-brand-red/5 px-3 py-2 text-xs text-brand-grey/80">
                            <span class="font-semibold text-brand-red">Admin note:</span> {{ b.notes }}
                          </p>
                        </div>
                      </li>
                    </ol>
                  </div>
                </section>

                <section v-if="diagnosisRows(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <Stethoscope class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Diagnosis</h3>
                  </div>
                  <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                    <div v-for="row in diagnosisRows(b)" :key="row.label" :class="row.full ? 'sm:col-span-2' : ''">
                      <p class="text-[10px] font-display tracking-display text-brand-grey uppercase">{{ row.label }}</p>
                      <p class="mt-0.5 text-sm whitespace-pre-line text-white">{{ row.value }}</p>
                    </div>
                  </div>
                </section>

                <section class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <Receipt class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Quotation</h3>
                  </div>
                  <div v-if="quoteRows(b).length">
                    <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div v-for="row in quoteRows(b)" :key="row.label">
                        <p class="text-[10px] font-display tracking-display text-brand-grey uppercase">{{ row.label }}</p>
                        <p class="mt-0.5 text-sm font-semibold text-white">{{ row.value }}</p>
                      </div>
                    </div>
                    <div class="mt-5 flex flex-wrap items-center gap-3">
                      <Button size="sm" :disabled="quoteDecision[b.id] === 'approved'" @click="approveQuote(b)"><Check class="h-4 w-4" />{{ quoteDecision[b.id] === 'approved' ? 'Approved' : 'Approve Quote' }}</Button>
                      <Button size="sm" variant="danger" :disabled="quoteDecision[b.id] === 'rejected'" @click="rejectQuote(b)"><X class="h-4 w-4" />{{ quoteDecision[b.id] === 'rejected' ? 'Rejected' : 'Reject Quote' }}</Button>
                      <Button size="sm" variant="ghost" @click="downloadQuote(b)"><Download class="h-4 w-4" />Download Quote</Button>
                    </div>
                  </div>
                  <p v-else class="text-sm text-brand-grey/70">Quotation will be available after diagnosis.</p>
                </section>

                <section v-if="costRows(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <Wallet class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Cost Summary</h3>
                  </div>
                  <div class="grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div v-for="row in costRows(b)" :key="row.label">
                      <p class="text-[10px] font-display tracking-display text-brand-grey uppercase">{{ row.label }}</p>
                      <p class="mt-0.5 text-sm font-semibold" :class="row.highlight ? 'text-brand-red' : 'text-white'">{{ row.value }}</p>
                    </div>
                  </div>
                </section>

                <section v-if="uploadedDocs(b).length || docImages(b).length" class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <ImageIcon class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Uploaded Images &amp; Documents</h3>
                  </div>
                  <div v-if="docImages(b).length" class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    <button
                      v-for="img in docImages(b)"
                      :key="img"
                      class="group/img relative overflow-hidden rounded-lg border border-brand-grey/15"
                      @click="openPreview(b, img)"
                    >
                      <img :src="fileUrl(b, img)" :alt="img" class="h-28 w-full object-cover transition-transform duration-300 group-hover/img:scale-105" />
                      <span class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover/img:opacity-100">
                        <Eye class="h-5 w-5 text-white" />
                      </span>
                    </button>
                  </div>
                  <div v-if="uploadedDocs(b).length" class="mt-3 space-y-2">
                    <a
                      v-for="doc in uploadedDocs(b)"
                      :key="doc.name"
                      :href="fileUrl(b, doc.file)"
                      target="_blank"
                      rel="noopener"
                      class="flex items-center justify-between gap-3 rounded-lg border border-brand-grey/15 bg-brand-black/60 px-4 py-3 transition-colors hover:border-brand-red/40"
                    >
                      <span class="flex items-center gap-2 text-sm text-white"><FileText class="h-4 w-4 text-brand-red" />{{ doc.name }}</span>
                      <Download class="h-4 w-4 text-brand-grey/50" />
                    </a>
                  </div>
                </section>

                <section class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <Users class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Admin Activity</h3>
                  </div>
                  <ol v-if="activityEvents(b).length" class="relative space-y-5">
                    <li v-for="(ev, i) in activityEvents(b)" :key="i" class="relative flex gap-4">
                      <div class="flex flex-col items-center">
                        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-brand-grey/15 bg-white/[0.03] text-brand-grey">
                          <component :is="activityIcon(ev.type)" class="h-4 w-4" />
                        </div>
                        <div v-if="i < activityEvents(b).length - 1" class="mt-1 w-0.5 flex-1 bg-brand-grey/15" />
                      </div>
                      <div class="min-w-0 pb-1">
                        <p class="text-sm font-medium text-white">{{ ev.title }}</p>
                        <p class="mt-0.5 text-xs text-brand-grey/60">
                          {{ formatDateTime(ev.date) }}<span v-if="ev.staff" class="ml-2">by {{ ev.staff }}</span>
                        </p>
                        <p v-if="ev.note" class="mt-1.5 text-xs text-brand-grey/80">{{ ev.note }}</p>
                      </div>
                    </li>
                  </ol>
                </section>

                <section class="rounded-lg border border-brand-grey/10 bg-white/[0.02] p-4 sm:p-5">
                  <div class="mb-4 flex items-center gap-2">
                    <Zap class="h-4 w-4 text-brand-red" />
                    <h3 class="font-display text-sm tracking-display text-white uppercase">Quick Actions</h3>
                  </div>
                  <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <Button variant="secondary" @click="downloadInvoice(b)"><Receipt class="h-4 w-4" />Download Invoice</Button>
                    <Button variant="ghost" @click="downloadJobCard(b)"><ClipboardCheck class="h-4 w-4" />Download Job Card</Button>
                    <Button variant="ghost" to="/contact"><Phone class="h-4 w-4" />Contact Service Team</Button>
                    <Button to="/service/booking"><Plus class="h-4 w-4" />Book Another Service</Button>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="preview" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4" @click.self="preview = null">
        <div class="relative max-h-full max-w-4xl">
          <img :src="fileUrl(preview.booking, preview.file)" class="max-h-[80vh] w-auto rounded-lg border border-brand-grey/30 object-contain" />
          <div class="mt-4 flex items-center justify-center gap-3">
            <Button size="sm" variant="ghost" @click="preview = null">Close</Button>
            <a :href="fileUrl(preview.booking, preview.file)" target="_blank" rel="noopener" download>
              <Button size="sm"><Download class="h-4 w-4" />Download</Button>
            </a>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import {
  Search, Wrench, Bike, CalendarClock, ClipboardCheck, History, Stethoscope, Receipt,
  Wallet, Image as ImageIcon, Users, Zap, ChevronDown, Clock, Check, X, Download, Eye,
  FileText, MapPin, Phone, Plus, CalendarPlus,
} from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import { formatDate, formatTime, formatDateTime } from '~/composables/useFormat'
import { ref, computed, onMounted, onUnmounted } from 'vue'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'My Service Bookings - Nairobi Powerbikes' })

type Booking = Record<string, any>

const pb = usePB()
const auth = useAuthStore()
const toast = useToast()
const loading = ref(true)
const allBookings = ref<Booking[]>([])
const searchQuery = ref('')
const statusFilter = ref('')
const sortOrder = ref('newest')
const expanded = ref<Record<string, boolean>>({})
const quoteDecision = ref<Record<string, string>>({})
const preview = ref<{ booking: Booking; file: string } | null>(null)

const STATUS: Record<string, { label: string; classes: string; dot: string }> = {
  pending: { label: 'Pending', classes: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400' },
  confirmed: { label: 'Confirmed', classes: 'bg-sky-500/15 text-sky-400 border-sky-500/30', dot: 'bg-sky-400' },
  diagnosed: { label: 'Diagnosed', classes: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
  awaiting_approval: { label: 'Awaiting Approval', classes: 'bg-orange-500/15 text-orange-400 border-orange-500/30', dot: 'bg-orange-400' },
  approved: { label: 'Approved', classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  in_progress: { label: 'In Progress', classes: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', dot: 'bg-cyan-400' },
  quality_check: { label: 'Quality Check', classes: 'bg-violet-500/15 text-violet-400 border-violet-500/30', dot: 'bg-violet-400' },
  ready: { label: 'Ready for Collection', classes: 'bg-teal-500/15 text-teal-400 border-teal-500/30', dot: 'bg-teal-400' },
  completed: { label: 'Completed', classes: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', dot: 'bg-emerald-400' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-400' },
}

const STAGES = [
  { key: 'pending', label: 'Booking Submitted' },
  { key: 'confirmed', label: 'Booking Confirmed' },
  { key: 'diagnosed', label: 'Diagnosed' },
  { key: 'awaiting_approval', label: 'Awaiting Approval' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'quality_check', label: 'Quality Check' },
  { key: 'ready', label: 'Ready for Collection' },
  { key: 'completed', label: 'Completed' },
]

const STAGE_INDEX: Record<string, number> = {
  pending: 0, confirmed: 1, diagnosed: 2, awaiting_approval: 3, approved: 4,
  in_progress: 4, quality_check: 5, ready: 6, completed: 7, cancelled: -1,
}

const SERVICE_TYPES: Record<string, string> = {
  routine: 'Routine Service', major: 'Major Service', repair: 'Repair',
  inspection: 'Pre-Purchase Inspection', customization: 'Customization',
}

function has(v: any) {
  if (v === null || v === undefined) return false
  if (typeof v === 'string') return v.trim() !== ''
  if (Array.isArray(v)) return v.length > 0
  return true
}

function pick(b: Booking, keys: string[]) {
  for (const k of keys) {
    if (has(b[k])) return b[k]
  }
  return ''
}

function statusMeta(s: string) {
  return STATUS[s] || { label: s || 'Unknown', classes: 'bg-brand-grey/15 text-brand-grey border-brand-grey/30', dot: 'bg-brand-grey' }
}

function serviceTypeLabel(t: string) {
  return SERVICE_TYPES[t] || t || 'Service Booking'
}

function bookingRef(b: Booking) {
  return `NPB-${(b.id || '').slice(-6).toUpperCase()}`
}

function toggleExpand(id: string) {
  expanded.value[id] = !expanded.value[id]
}

function currentStageIndex(b: Booking) {
  return STAGE_INDEX[b.status] ?? -1
}

function stageState(b: Booking, i: number) {
  const idx = currentStageIndex(b)
  if (b.status === 'cancelled') return 'pending'
  if (i < idx) return 'done'
  if (i === idx) return 'current'
  return 'pending'
}

function stageDotClass(b: Booking, i: number) {
  const state = stageState(b, i)
  if (state === 'done') return 'border-emerald-500/60 bg-emerald-500/15 text-emerald-400'
  if (state === 'current') return 'border-brand-red bg-brand-red/15 text-brand-red ring-4 ring-brand-red/10'
  return 'border-brand-grey/25 bg-brand-black text-brand-grey/50'
}

function stageTime(b: Booking, i: number) {
  const idx = currentStageIndex(b)
  if (i === 0 && b.created) return formatDateTime(b.created)
  if (i === idx && b.updated && b.updated !== b.created) return formatDateTime(b.updated)
  return ''
}

function bikeRows(b: Booking) {
  const defs: [string, string[]][] = [
    ['Manufacturer', ['manufacturer', 'maker', 'make']],
    ['Model', ['model', 'motorcycle_model', 'motorcycle']],
    ['Year', ['year', 'model_year']],
    ['Registration Number', ['reg_number', 'registration_number', 'plate_number']],
    ['VIN', ['vin', 'chassis_number', 'frame_number']],
    ['Mileage', ['mileage', 'odometer']],
    ['Colour', ['colour', 'color']],
  ]
  return buildRows(b, defs)
}

function requestRows(b: Booking) {
  const defs: [string, string[]][] = [
    ['Requested Service', ['service_type']],
    ['Problem Description', ['problem_description', 'description', 'issue']],
    ['Symptoms', ['symptoms']],
    ['Warning Lights', ['warning_lights']],
    ['Previous Repairs', ['previous_repairs']],
    ['Accident History', ['accident_history']],
    ['Additional Notes', ['notes']],
  ]
  return buildRows(b, defs).map(r => (r.label === 'Additional Notes' || r.label === 'Problem Description' ? { ...r, full: true } : r))
}

function apptRows(b: Booking) {
  const defs: [string, string[]][] = [
    ['Preferred Branch', ['branch']],
    ['Preferred Date', ['preferred_date']],
    ['Preferred Time', ['preferred_time']],
    ['Alternative Date', ['alternative_date', 'alt_date']],
    ['Alternative Time', ['alternative_time', 'alt_time']],
    ['Pickup Required', ['pickup_required', 'pickup']],
    ['Drop-off Required', ['dropoff_required', 'drop_off']],
  ]
  return buildRows(b, defs)
}

function diagnosisRows(b: Booking) {
  const defs: [string, string[]][] = [
    ['Mechanic Notes', ['mechanic_notes', 'diagnosis_notes']],
    ['Problems Found', ['problems_found']],
    ['Recommended Repairs', ['recommended_repairs']],
    ['Labour Hours', ['labour_hours', 'labor_hours']],
    ['Estimated Completion', ['estimated_completion']],
  ]
  return buildRows(b, defs).map(r => (r.label === 'Problems Found' || r.label === 'Recommended Repairs' ? { ...r, full: true } : r))
}

function buildRows(b: Booking, defs: [string, string[]][]) {
  const rows: { label: string; value: string; full?: boolean }[] = []
  for (const [label, keys] of defs) {
    const raw = pick(b, keys)
    if (has(raw)) {
      let value: string
      if (label === 'Preferred Date') {
        value = formatDate(String(raw))
      } else if (label === 'Preferred Time') {
        value = formatTime(String(raw))
      } else if (label === 'Pickup Required' || label === 'Drop-off Required') {
        value = raw === true || String(raw).toLowerCase() === 'yes' ? 'Yes' : String(raw).toLowerCase() === 'no' ? 'No' : String(raw)
      } else {
        value = String(raw)
      }
      rows.push({ label, value })
    }
  }
  return rows
}

function money(v: any) {
  return `KSh ${Number(v).toLocaleString()}`
}

function quoteRows(b: Booking) {
  const defs: [string, string[]][] = [
    ['Labour', ['quotation_labour', 'labour_cost']],
    ['Parts', ['quotation_parts', 'parts_cost']],
    ['Tax', ['quotation_tax', 'tax']],
    ['Discount', ['quotation_discount', 'discount']],
    ['Total', ['quotation_total', 'quotation']],
  ]
  return buildRows(b, defs).map(r => ({ ...r, value: money(r.value.replace(/[^\d.]/g, '')) }))
}

function costRows(b: Booking) {
  const rows: { label: string; value: string; highlight?: boolean }[] = []
  if (has(b.cost)) rows.push({ label: 'Estimated Cost', value: money(b.cost), highlight: true })
  const deposit = has(b.deposit_paid) ? Number(b.deposit_paid) : null
  if (deposit !== null) rows.push({ label: 'Deposit Paid', value: money(deposit) })
  if (deposit !== null && has(b.cost)) rows.push({ label: 'Outstanding Balance', value: money(Math.max(0, Number(b.cost) - deposit)) })
  if (has(b.final_cost)) rows.push({ label: 'Final Cost', value: money(b.final_cost), highlight: true })
  if (has(b.payment_status)) rows.push({ label: 'Payment Status', value: String(b.payment_status) })
  return rows
}

function docImages(b: Booking) {
  const files: string[] = []
  for (const f of ['images', 'photos', 'service_photos']) {
    const v = b[f]
    if (!v) continue
    const arr = Array.isArray(v) ? v : String(v).split(',').filter(Boolean)
    for (const file of arr) {
      if (/\.(jpe?g|png|webp|gif|avif)$/i.test(String(file))) files.push(String(file))
    }
  }
  return files
}

function uploadedDocs(b: Booking) {
  const docs: { file: string; name: string }[] = []
  for (const f of ['id_document', 'drivers_license']) {
    if (has(b[f])) docs.push({ file: b[f], name: f === 'id_document' ? 'ID Document' : "Driver's License" })
  }
  return docs
}

function fileUrl(b: Booking, file: string) {
  return pb.files.getURL(b, file)
}

function activityEvents(b: Booking) {
  const events: { type: string; title: string; date: string; staff?: string; note?: string }[] = []
  if (b.created) events.push({ type: 'received', title: 'Booking received', date: b.created })
  if (b.updated && b.created && new Date(b.updated).getTime() - new Date(b.created).getTime() > 1000) {
    events.push({
      type: 'status',
      title: `Status updated to ${statusMeta(b.status).label.toLowerCase()}`,
      date: b.updated,
      staff: b.assigned_to || 'Service Team',
      note: b.notes || undefined,
    })
  }
  return events
}

function activityIcon(type: string) {
  const icons: Record<string, object> = { received: CalendarPlus, status: Wrench }
  return icons[type] || Wrench
}

const filtered = computed(() => {
  let list = [...allBookings.value]
  if (statusFilter.value) list = list.filter(b => b.status === statusFilter.value)
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(b => {
      const refText = bookingRef(b)
      const hay = [refText, b.name, b.motorcycle, serviceTypeLabel(b.service_type), statusMeta(b.status).label, b.branch]
        .filter(Boolean).join(' ').toLowerCase()
      return hay.includes(q)
    })
  }
  list.sort((a, b) => {
    const ta = new Date(a.created).getTime()
    const tb = new Date(b.created).getTime()
    return sortOrder.value === 'oldest' ? ta - tb : tb - ta
  })
  return list
})

function handleRealtime(e: any) {
  const record = e.record as Booking
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
      allBookings.value = [record, ...allBookings.value]
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
    allBookings.value = res.items as Booking[]
    if (uid) {
      pb.collection('service_bookings').subscribe('*', handleRealtime, { filter: `user = "${uid}"` })
    }
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})

onUnmounted(() => {
  pb.collection('service_bookings').unsubscribe('*')
})

function openPreview(b: Booking, file: string) {
  preview.value = { booking: b, file }
}

function approveQuote(b: Booking) {
  quoteDecision.value[b.id] = 'approved'
  toast.add({ type: 'success', title: 'Quotation approved', message: `You have approved the quotation for ${bookingRef(b)}. The service team will proceed.` })
}

function rejectQuote(b: Booking) {
  quoteDecision.value[b.id] = 'rejected'
  toast.add({ type: 'warning', title: 'Quotation rejected', message: `You have rejected the quotation for ${bookingRef(b)}. The service team will contact you.` })
}

function downloadQuote(b: Booking) {
  printDocument(`Quotation - ${bookingRef(b)}`, b, quoteRows(b))
}

function downloadInvoice(b: Booking) {
  printDocument(`Invoice - ${bookingRef(b)}`, b, costRows(b))
}

function downloadJobCard(b: Booking) {
  printDocument(`Job Card - ${bookingRef(b)}`, b, [
    ...bikeRows(b),
    ...requestRows(b),
    ...apptRows(b),
  ])
}

function escapeHtml(v: string) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function printDocument(title: string, b: Booking, rows: { label: string; value: string }[]) {
  const lines = [
    ...rows.map(r => `<tr><td style="padding:8px 10px;border:1px solid #ddd;color:#555;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">${escapeHtml(r.label)}</td><td style="padding:8px 10px;border:1px solid #ddd;font-weight:600;">${escapeHtml(r.value)}</td></tr>`),
  ].join('')
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>
    body{font-family:Arial,Helvetica,sans-serif;color:#111;max-width:720px;margin:0 auto;padding:40px 24px;}
    .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #dc2626;padding-bottom:16px;}
    .brand{font-size:22px;font-weight:800;letter-spacing:1px;color:#111;}
    .brand span{color:#dc2626;}
    .doc{font-size:12px;color:#555;text-align:right;text-transform:uppercase;letter-spacing:1px;}
    .ref{font-size:13px;color:#555;margin:6px 0 0;}
    .meta{display:flex;gap:24px;font-size:12px;color:#555;margin:8px 0 20px;}
    table{width:100%;border-collapse:collapse;margin-top:8px;}
    th{text-align:left;padding:8px 10px;border:1px solid #ddd;background:#fafafa;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:#111;}
    .foot{margin-top:28px;font-size:11px;color:#888;border-top:1px solid #ddd;padding-top:12px;text-align:center;}
  </style></head><body>
    <div class="hdr">
      <div>
        <div class="brand">NAIROBI <span>POWERBIKES</span></div>
        <div class="ref">Ref: ${escapeHtml(bookingRef(b))}</div>
      </div>
      <div class="doc">${escapeHtml(title)}</div>
    </div>
    <div class="meta">
      <span>Customer: ${escapeHtml(b.name || auth.user?.name || '')}</span>
      <span>Email: ${escapeHtml(b.email || auth.user?.email || '')}</span>
      <span>Phone: ${escapeHtml(b.phone || '')}</span>
      <span>Branch: ${escapeHtml(b.branch || '')}</span>
      <span>Submitted: ${escapeHtml(b.created ? formatDateTime(b.created) : '')}</span>
    </div>
    <table><thead><tr><th style="width:45%;">Item</th><th>Details</th></tr></thead><tbody>${lines}</tbody></table>
    <div class="foot">Nairobi Powerbikes &middot; DTB Centre Annex 2, Mombasa Road, Nairobi &middot; +254 712 345 678</div>
  </body></html>`
  const w = window.open('', '_blank', 'width=820,height=960')
  if (!w) return
  w.document.write(html)
  w.document.close()
  w.focus()
  setTimeout(() => w.print(), 300)
}
</script>
