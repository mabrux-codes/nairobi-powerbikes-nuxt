<template>
  <Teleport to="body">
    <AnimatePresence>
      <div v-if="open" class="fixed inset-0 z-[95] flex items-end justify-center sm:items-center">
        <!-- Backdrop -->
        <motion.div
          class="fixed inset-0 bg-black/75 backdrop-blur-sm"
          :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }"
          @click="close"
        />

        <!-- Panel -->
        <motion.div
          class="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl border border-white/[0.1] bg-brand-black shadow-2xl shadow-black/70 sm:rounded-3xl"
          role="dialog"
          aria-modal="true"
          aria-label="Service booking availability"
          :initial="{ opacity: 0, y: 60, scale: 0.97 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :exit="{ opacity: 0, y: 40, scale: 0.97 }"
          :transition="{ type: 'spring', damping: 30, stiffness: 300 }"
        >
          <!-- Header -->
          <div class="relative border-b border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent px-6 py-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="font-display text-[11px] font-bold tracking-[0.25em] text-brand-red uppercase">Live Availability</p>
                <h2 class="mt-1 font-heading text-2xl text-white sm:text-3xl">Service <span class="text-brand-red">Calendar</span></h2>
              </div>
              <div class="flex items-center gap-2">
                <span class="hidden items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-[11px] font-semibold text-emerald-400 sm:flex">
                  <span class="relative flex h-2 w-2">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  Live
                </span>
                <button
                  class="flex h-9 w-9 items-center justify-center rounded-full text-brand-grey transition-colors hover:bg-white/[0.06] hover:text-white"
                  aria-label="Close availability calendar"
                  @click="close"
                >
                  <X class="h-5 w-5" />
                </button>
              </div>
            </div>

            <!-- Branch selector (only when multiple branches) -->
            <div v-if="branches.length > 1" class="mt-4 flex flex-wrap items-center gap-2">
              <MapPin class="h-4 w-4 text-brand-red" />
              <span class="font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Branch</span>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="b in branchOptions"
                  :key="b.value"
                  class="rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200"
                  :class="branchFilter === b.value
                    ? 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/25'
                    : 'border-white/10 text-brand-light/80 hover:border-brand-red/50 hover:text-brand-red'"
                  :aria-pressed="branchFilter === b.value"
                  @click="branchFilter = b.value"
                >
                  {{ b.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="grid flex-1 overflow-y-auto lg:grid-cols-[1fr_340px]">
            <!-- Calendar -->
            <div class="border-b border-white/[0.07] p-6 lg:border-b-0 lg:border-r">
              <div class="flex items-center justify-between">
                <h3 class="font-display text-lg font-bold tracking-display text-white">{{ monthLabel }}</h3>
                <div class="flex items-center gap-1.5">
                  <button
                    class="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-brand-light/80 transition-colors hover:border-brand-red/50 hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Previous month"
                    :disabled="!canGoPrev"
                    @click="prevMonth"
                  >
                    <ChevronLeft class="h-4 w-4" />
                  </button>
                  <button
                    class="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-brand-light/80 transition-colors hover:border-brand-red/50 hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Next month"
                    :disabled="!canGoNext"
                    @click="nextMonth"
                  >
                    <ChevronRight class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <!-- Weekday header -->
              <div class="mt-5 grid grid-cols-7 gap-1.5">
                <p v-for="d in weekdayLabels" :key="d" class="py-1 text-center font-display text-[10px] font-bold tracking-[0.16em] text-brand-grey uppercase">
                  {{ d }}
                </p>
              </div>

              <!-- Day grid -->
              <div class="mt-1.5 grid grid-cols-7 gap-1.5">
                <div
                  v-for="cell in calendarCells"
                  :key="cell.key"
                  class="aspect-square"
                >
                  <button
                    v-if="cell.day"
                    class="flex h-full w-full flex-col items-center justify-center gap-1 rounded-xl border text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                    :class="dayClasses(cell)"
                    :disabled="cell.disabled"
                    :aria-label="cell.aria"
                    :aria-pressed="selectedDate === cell.iso"
                    @click="selectDay(cell)"
                  >
                    <span>{{ cell.day }}</span>
                    <span v-if="!cell.disabled" class="flex items-center gap-0.5" aria-hidden="true">
                      <span class="h-1.5 w-1.5 rounded-full" :class="dotClass(cell.status)" />
                      <span v-if="cell.status === 'full'" class="h-1.5 w-1.5 rounded-full bg-brand-red/80" />
                    </span>
                  </button>
                  <div v-else aria-hidden="true" />
                </div>
              </div>

              <!-- Legend -->
              <div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.06] pt-4">
                <span class="flex items-center gap-2 text-xs text-brand-grey"><span class="h-2.5 w-2.5 rounded-full bg-emerald-400" />Available</span>
                <span class="flex items-center gap-2 text-xs text-brand-grey"><span class="h-2.5 w-2.5 rounded-full bg-amber-400" />Limited Availability</span>
                <span class="flex items-center gap-2 text-xs text-brand-grey"><span class="h-2.5 w-2.5 rounded-full bg-brand-red" />Fully Booked</span>
                <span class="ml-auto text-[11px] text-brand-grey/50">Updates live from our bookings</span>
              </div>
            </div>

            <!-- Selected day details -->
            <div class="flex flex-col bg-gradient-to-b from-white/[0.03] to-transparent p-6">
              <template v-if="selectedDate">
                <p class="font-display text-[11px] font-bold tracking-[0.22em] text-brand-grey uppercase">Selected Date</p>
                <p class="mt-1.5 font-heading text-xl text-white">{{ formatSelectedDate }}</p>
                <p class="mt-0.5 text-xs text-brand-grey">{{ branchFilter === 'all' ? 'All branches' : branchLabel }}</p>

                <p class="mt-6 mb-3 font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Time Slots</p>

                <div v-if="daySlots.length" class="grid grid-cols-3 gap-2">
                  <button
                    v-for="slot in daySlots"
                    :key="slot.time"
                    class="rounded-xl border py-2.5 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                    :class="slot.taken
                      ? 'border-white/[0.05] bg-white/[0.01] text-brand-grey/35 line-through'
                      : selectedTime === slot.time
                        ? 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/25'
                        : 'border-emerald-400/25 text-white hover:border-emerald-400/60 hover:text-emerald-300'"
                    :disabled="slot.taken"
                    :aria-label="slot.taken ? `${slot.time} unavailable` : `${slot.time} available`"
                    @click="selectedTime = slot.time"
                  >
                    {{ slot.time }}
                  </button>
                </div>

                <p v-if="selectedStatus === 'full'" class="mt-4 flex items-center gap-2 rounded-xl border border-brand-red/25 bg-brand-red/10 px-4 py-3 text-xs text-brand-red">
                  <CalendarX class="h-4 w-4 shrink-0" />Fully booked — try another date.
                </p>
                <p v-else-if="selectedStatus === 'limited'" class="mt-4 flex items-center gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-xs text-amber-300">
                  <Clock class="h-4 w-4 shrink-0" />Limited slots left for this date.
                </p>
                <p v-else class="mt-4 flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-xs text-emerald-300/90">
                  <CheckCircle class="h-4 w-4 shrink-0" />Open for bookings.
                </p>

                <div class="mt-auto pt-6">
                  <Button
                    variant="primary"
                    size="lg"
                    class="h-12 w-full"
                    :disabled="!selectedTime"
                    @click="bookSlot"
                  >
                    <CalendarCheck class="h-5 w-5" />Book This Slot
                  </Button>
                  <p class="mt-2.5 text-center text-[11px] text-brand-grey/60">Nothing is confirmed yet — you'll review your details next.</p>
                </div>
              </template>

              <template v-else>
                <div class="flex flex-1 flex-col items-center justify-center py-10 text-center">
                  <CalendarDays class="h-10 w-10 text-brand-grey/40" />
                  <p class="mt-3 font-display text-lg tracking-display text-brand-grey">Select a date</p>
                  <p class="mt-1 max-w-[220px] text-xs leading-relaxed text-brand-grey/60">Pick a day above to see its available time slots.</p>
                </div>
              </template>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  </Teleport>
</template>

<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'
import {
  X, MapPin, ChevronLeft, ChevronRight, CalendarX, Clock, CheckCircle, CalendarCheck, CalendarDays,
} from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

const props = withDefaults(defineProps<{ open: boolean }>(), { open: false })
const emit = defineEmits<{ close: [] }>()

const pb = usePB()

const ALL_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
const RANGE_DAYS = 60

interface Branch { id: string; name: string }
interface Booking { id: string; preferred_date: string; preferred_time: string; branch?: string }

const branches = ref<Branch[]>([])
const bookings = ref<Booking[]>([])
const loading = ref(false)

const cursor = ref(new Date())
const selectedDate = ref<string>('')
const selectedTime = ref<string>('')
const branchFilter = ref<'all' | string>('all')

const weekdayLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const todayISO = () => {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
const isoOf = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
const addDays = (base: string, days: number) => {
  const d = new Date(base + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return isoOf(d)
}

const rangeEnd = computed(() => addDays(todayISO(), RANGE_DAYS))

const branchOptions = computed(() => [
  { value: 'all', label: 'All Branches' },
  ...branches.value.map(b => ({ value: b.name, label: b.name })),
])
const branchLabel = computed(() => branchOptions.value.find(o => o.value === branchFilter.value)?.label || '')

const monthLabel = computed(() => cursor.value.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }))
const todayMonthStart = computed(() => isoOf(new Date(new Date().getFullYear(), new Date().getMonth(), 1)))
const canGoPrev = computed(() => cursor.value > new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const canGoNext = computed(() => {
  const m = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + 1, 1)
  return isoOf(m) <= rangeEnd.value
})

function prevMonth() { cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() - 1, 1) }
function nextMonth() { cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + 1, 1) }

interface DayCell {
  key: string
  day: number | null
  iso: string
  disabled: boolean
  status: 'available' | 'limited' | 'full' | 'past'
  aria: string
}

const calendarCells = computed<DayCell[]>(() => {
  const year = cursor.value.getFullYear()
  const month = cursor.value.getMonth()
  const first = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const lead = (first.getDay() + 6) % 7 // Monday-first
  const cells: DayCell[] = []
  const today = todayISO()
  const end = rangeEnd.value

  for (let i = 0; i < lead; i++) cells.push({ key: `pad-${i}`, day: null, iso: '', disabled: true, status: 'past', aria: '' })

  for (let d = 1; d <= daysInMonth; d++) {
    const iso = isoOf(new Date(year, month, d))
    const past = iso < today
    const beyond = iso > end
    const status = past ? 'past' : beyond ? 'past' : dayStatus(iso)
    cells.push({
      key: iso,
      day: d,
      iso,
      disabled: past || beyond,
      status,
      aria: `${iso} — ${status === 'available' ? 'available' : status === 'limited' ? 'limited availability' : status === 'full' ? 'fully booked' : 'not bookable'}`,
    })
  }
  return cells
})

function bookedFor(iso: string): Set<string> {
  const set = new Set<string>()
  for (const b of bookings.value) {
    if (b.preferred_date !== iso) continue
    if (branchFilter.value !== 'all' && b.branch && b.branch !== branchFilter.value) continue
    if (b.preferred_time) set.add(b.preferred_time)
  }
  return set
}

function slotsFor(iso: string) {
  const taken = bookedFor(iso)
  const now = new Date()
  const isToday = iso === todayISO()
  return ALL_SLOTS.map(t => {
    const [h] = t.split(':').map(Number)
    const pastTime = isToday && h <= now.getHours()
    return { time: t, taken: taken.has(t) || pastTime }
  })
}

function dayStatus(iso: string): 'available' | 'limited' | 'full' {
  const slots = slotsFor(iso)
  const takenCount = slots.filter(s => s.taken).length
  if (takenCount === 0) return 'available'
  if (takenCount >= slots.length) return 'full'
  return 'limited'
}

function dayClasses(cell: DayCell): string {
  const base = 'hover:border-brand-red/50 hover:text-brand-red'
  if (cell.disabled) return 'border-transparent text-brand-grey/25'
  if (cell.iso === selectedDate.value) return 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/30'
  switch (cell.status) {
    case 'full': return `border-brand-red/25 bg-brand-red/[0.07] text-brand-light/60 ${base}`
    case 'limited': return `border-amber-400/25 bg-amber-400/[0.06] text-white ${base}`
    default: return `border-emerald-400/25 bg-emerald-400/[0.04] text-white ${base}`
  }
}

function dotClass(status: string): string {
  if (status === 'full') return 'bg-brand-red'
  if (status === 'limited') return 'bg-amber-400'
  return 'bg-emerald-400'
}

const daySlots = computed(() => (selectedDate.value ? slotsFor(selectedDate.value) : []))
const selectedStatus = computed(() => (selectedDate.value ? dayStatus(selectedDate.value) : 'available'))
const formatSelectedDate = computed(() => {
  if (!selectedDate.value) return ''
  return new Date(selectedDate.value + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

function selectDay(cell: DayCell) {
  if (cell.disabled || !cell.iso) return
  selectedDate.value = cell.iso
  selectedTime.value = ''
}

async function loadBookings() {
  try {
    const res = await pb.collection('service_bookings').getFullList<Booking>({
      filter: `type = "service" && preferred_date >= "${todayISO()}" && preferred_date <= "${rangeEnd.value}"`,
      fields: 'id,preferred_date,preferred_time,branch',
      sort: 'preferred_date',
    })
    bookings.value = res
  } catch { bookings.value = [] }
  finally { loading.value = false }
}

async function loadBranches() {
  try {
    branches.value = await pb.collection('branches').getFullList<Branch>({ sort: 'name' })
  } catch { branches.value = [] }
}

let subscribed = false
function subscribe() {
  if (subscribed) return
  subscribed = true
  pb.collection('service_bookings').subscribe('*', () => loadBookings())
}

function bookSlot() {
  if (!selectedDate.value || !selectedTime.value) return
  const params = new URLSearchParams({
    date: selectedDate.value,
    time: selectedTime.value,
    branch: branchFilter.value === 'all' ? '' : branchFilter.value,
  })
  close()
  navigateTo(`/service/booking?${params.toString()}`)
}

function close() {
  selectedDate.value = ''
  selectedTime.value = ''
  if (subscribed) {
    subscribed = false
    pb.collection('service_bookings').unsubscribe('*')
  }
  emit('close')
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.open) close()
}

watch(() => props.open, async (v) => {
  if (!v) return
  selectedDate.value = ''
  selectedTime.value = ''
  cursor.value = new Date()
  loading.value = true
  await Promise.all([loadBranches(), loadBookings()])
  subscribe()
})

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  if (subscribed) {
    subscribed = false
    pb.collection('service_bookings').unsubscribe('*')
  }
})
</script>