<template>
  <div class="min-h-screen bg-brand-black pb-24">
    <PageHeader
      eyebrow="Expert Maintenance"
      title="Book a"
      accent="Service"
      description="Schedule your next service appointment with our certified technicians in minutes — no phone calls, no queues."
      :crumbs="[{ label: 'Services', to: '/service/booking' }, { label: 'Book a Service' }]"
    />

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <div class="mt-10 grid gap-8 lg:grid-cols-[280px_1fr_340px]">
        <!-- Step rail -->
        <aside class="hidden lg:block">
          <div class="sticky top-28 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
            <p class="mb-4 font-display text-xs font-bold tracking-[0.2em] text-brand-grey uppercase">Booking Progress</p>
            <ol class="space-y-1">
              <li v-for="(s, i) in steps" :key="s.id">
                <button
                  class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200"
                  :class="step > i ? 'cursor-pointer hover:bg-white/[0.04]' : step === i ? 'bg-brand-red/10' : ''"
                  :disabled="step < i"
                  :aria-current="step === i ? 'step' : undefined"
                  @click="goTo(i)"
                >
                  <span
                    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                    :class="step > i ? 'border-brand-red bg-brand-red text-white' : step === i ? 'border-brand-red text-brand-red' : 'border-white/15 text-brand-grey'"
                  >
                    <Check v-if="step > i" class="h-3.5 w-3.5" />
                    <template v-else>{{ i + 1 }}</template>
                  </span>
                  <span>
                    <span class="block text-sm font-semibold" :class="step >= i ? 'text-white' : 'text-brand-grey'">{{ s.label }}</span>
                    <span class="block text-[11px] text-brand-grey">{{ s.hint }}</span>
                  </span>
                </button>
              </li>
            </ol>
          </div>
        </aside>

        <!-- Wizard card -->
        <div class="min-w-0">
          <div class="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 sm:p-9">
            <div class="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-red/8 blur-3xl" aria-hidden="true" />

            <!-- Mobile progress -->
            <div class="mb-7 lg:hidden">
              <div class="mb-2 flex items-center justify-between">
                <p class="font-display text-xs font-bold tracking-[0.2em] text-brand-grey uppercase">Step {{ step + 1 }} of {{ steps.length }}</p>
                <p class="text-xs font-semibold text-brand-red">{{ steps[step].label }}</p>
              </div>
              <div class="flex h-1.5 gap-1.5 overflow-hidden rounded-full">
                <div v-for="(s, i) in steps" :key="s.id" class="flex-1 rounded-full transition-all duration-300" :class="i <= step ? 'bg-brand-red' : 'bg-white/10'" />
              </div>
            </div>

            <Transition name="wizard" mode="out-in">
              <!-- Step 1: Motorcycle info -->
              <div v-if="step === 0" key="s1">
                <h2 class="font-heading text-3xl text-white">Your <span class="text-brand-red">Motorcycle</span></h2>
                <p class="mt-2 text-sm text-brand-grey">Tell us which machine needs attention.</p>

                <div class="mt-7">
                  <label for="svc-bike" class="mb-2 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Motorcycle Model</label>
                  <select id="svc-bike" v-model="form.bike" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errors.bike }">
                    <option value="">Select your motorcycle…</option>
                    <option v-for="b in motorcycles" :key="b.id" :value="b.name">{{ b.name }}<template v-if="b.year"> ({{ b.year }})</template></option>
                    <option value="other">Other / not listed</option>
                  </select>
                  <p v-if="errors.bike" class="mt-1.5 text-xs text-brand-red">{{ errors.bike }}</p>

                  <div v-if="form.bike === 'other'" class="mt-4">
                    <label for="svc-bike-other" class="mb-2 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Make &amp; Model</label>
                    <input id="svc-bike-other" v-model="form.bikeOther" type="text" placeholder="e.g. Tekken 250N" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" />
                  </div>
                </div>

                <div class="mt-8 flex items-center justify-between">
                  <p class="text-xs text-brand-grey">Autosaved locally — you can continue later.</p>
                  <Button size="md" variant="primary" trailing-arrow @click="nextStep">Continue</Button>
                </div>
              </div>

              <!-- Step 2: Service required -->
              <div v-else-if="step === 1" key="s2">
                <h2 class="font-heading text-3xl text-white">Service <span class="text-brand-red">Required</span></h2>
                <p class="mt-2 text-sm text-brand-grey">What does your motorcycle need?</p>

                <div class="mt-7 grid gap-4 sm:grid-cols-2">
                  <button
                    v-for="s in serviceTypes"
                    :key="s.value"
                    class="group flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200"
                    :class="form.serviceType === s.value ? 'border-brand-red/60 bg-brand-red/10 shadow-lg shadow-brand-red/10' : 'border-white/[0.08] bg-white/[0.02] hover:border-brand-red/40'"
                    :aria-pressed="form.serviceType === s.value"
                    @click="form.serviceType = s.value"
                  >
                    <span class="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200" :class="form.serviceType === s.value ? 'border-brand-red bg-brand-red text-white' : 'border-white/10 text-brand-grey'">
                      <component :is="s.icon" class="h-5 w-5" />
                    </span>
                    <span>
                      <span class="block font-display font-bold tracking-display text-white">{{ s.label }}</span>
                      <span class="mt-1 block text-xs leading-relaxed text-brand-grey">{{ s.desc }}</span>
                    </span>
                  </button>
                </div>
                <p v-if="errors.serviceType" class="mt-3 text-xs text-brand-red">{{ errors.serviceType }}</p>

                <div class="mt-8 flex items-center justify-between">
                  <Button variant="ghost" @click="step = 0"><ArrowLeft class="h-4 w-4" />Back</Button>
                  <Button size="md" variant="primary" trailing-arrow @click="nextStep">Continue</Button>
                </div>
              </div>

              <!-- Step 3: Appointment -->
              <div v-else-if="step === 2" key="s3">
                <h2 class="font-heading text-3xl text-white">Pick Your <span class="text-brand-red">Appointment</span></h2>
                <p class="mt-2 text-sm text-brand-grey">Choose a branch, date and time that suits you.</p>

                <div class="mt-7 grid gap-6 sm:grid-cols-2">
                  <div>
                    <label for="svc-branch" class="mb-2 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Branch</label>
                    <select id="svc-branch" v-model="form.branch" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25">
                      <option v-for="b in branches" :key="b.id" :value="b.name">{{ b.name }}</option>
                    </select>
                  </div>
                  <div>
                    <label for="svc-date" class="mb-2 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Preferred Date</label>
                    <input id="svc-date" v-model="form.date" type="date" :min="minDate" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errors.date }" @change="loadBookedTimes" />
                    <p v-if="errors.date" class="mt-1.5 text-xs text-brand-red">{{ errors.date }}</p>
                  </div>
                  <div class="sm:col-span-2">
                    <p class="mb-2 font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Preferred Time</p>
                    <div class="grid grid-cols-3 gap-2 sm:grid-cols-6">
                      <button
                        v-for="slot in timeSlots"
                        :key="slot"
                        class="rounded-xl border py-2.5 text-sm font-semibold transition-all duration-200"
                        :class="bookedTimes.has(slot)
                          ? 'cursor-not-allowed border-white/[0.06] text-brand-grey/40 line-through'
                          : form.time === slot
                            ? 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/25'
                            : 'border-white/10 text-white hover:border-brand-red/50 hover:text-brand-red'"
                        :disabled="bookedTimes.has(slot)"
                        :aria-label="bookedTimes.has(slot) ? `${slot} already booked` : `Choose ${slot}`"
                        @click="form.time = slot"
                      >
                        {{ slot }}
                      </button>
                    </div>
                    <p v-if="bookedTimes.size && form.date && timeSlots.length && timeSlots.every(s => bookedTimes.has(s))" class="mt-2 text-xs text-amber-400">Fully booked for this date — try another day.</p>
                    <p v-else-if="form.date" class="mt-2 text-xs text-brand-grey/70">{{ timeSlots.length - availableCount }} of {{ timeSlots.length }} slots taken</p>
                    <p v-if="errors.time" class="mt-1.5 text-xs text-brand-red">{{ errors.time }}</p>
                  </div>
                </div>

                <div class="mt-8 flex items-center justify-between">
                  <Button variant="ghost" @click="step = 1"><ArrowLeft class="h-4 w-4" />Back</Button>
                  <Button size="md" variant="primary" trailing-arrow @click="nextStep">Continue</Button>
                </div>
              </div>

              <!-- Step 4: Additional information -->
              <div v-else-if="step === 3" key="s4">
                <h2 class="font-heading text-3xl text-white">Additional <span class="text-brand-red">Information</span></h2>
                <p class="mt-2 text-sm text-brand-grey">
                  <template v-if="isLoggedIn">Signed in as <span class="font-semibold text-white">{{ authUser?.name || authUser?.email }}</span> — we'll use your account details.</template>
                  <template v-else>Almost there — just a few contact details.</template>
                </p>

                <template v-if="!isLoggedIn">
                  <div class="mt-7 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label for="svc-name" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Full Name</label>
                      <input id="svc-name" v-model="form.name" type="text" placeholder="John Doe" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errors.name }" />
                      <p v-if="errors.name" class="mt-1.5 text-xs text-brand-red">{{ errors.name }}</p>
                    </div>
                    <div>
                      <label for="svc-phone" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Phone</label>
                      <input id="svc-phone" v-model="form.phone" type="tel" placeholder="+254 7XX XXX XXX" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errors.phone }" />
                      <p v-if="errors.phone" class="mt-1.5 text-xs text-brand-red">{{ errors.phone }}</p>
                    </div>
                    <div class="sm:col-span-2">
                      <label for="svc-email" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Email</label>
                      <input id="svc-email" v-model="form.email" type="email" placeholder="you@example.com" class="input-field h-12 rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25" :class="{ 'border-brand-red/70': errors.email }" />
                      <p v-if="errors.email" class="mt-1.5 text-xs text-brand-red">{{ errors.email }}</p>
                    </div>
                  </div>
                </template>

                <div class="mt-6">
                  <label for="svc-notes" class="mb-1.5 block font-display text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Notes for the Technicians</label>
                  <textarea id="svc-notes" v-model="form.notes" rows="4" placeholder="e.g. unusual noise when accelerating, brake pads feel worn…" class="input-field min-h-[120px] rounded-xl border-white/10 bg-white/[0.03] focus:border-brand-red focus:ring-2 focus:ring-brand-red/25"></textarea>
                </div>

                <div class="mt-8 flex items-center justify-between">
                  <Button variant="ghost" @click="step = 2"><ArrowLeft class="h-4 w-4" />Back</Button>
                  <Button size="md" variant="primary" trailing-arrow @click="nextStep">Review Booking</Button>
                </div>
              </div>

              <!-- Step 5: Review -->
              <div v-else-if="step === 4" key="s5">
                <h2 class="font-heading text-3xl text-white">Review Your <span class="text-brand-red">Booking</span></h2>
                <p class="mt-2 text-sm text-brand-grey">Check everything looks right before confirming.</p>

                <dl class="mt-7 divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-white/[0.02]">
                  <div v-for="row in reviewRows" :key="row.label" class="flex items-start justify-between gap-6 px-5 py-4">
                    <dt class="flex items-center gap-2.5 text-sm text-brand-grey">
                      <component :is="row.icon" class="h-4 w-4 text-brand-red" />{{ row.label }}
                    </dt>
                    <dd class="text-right text-sm font-semibold text-white">{{ row.value }}</dd>
                  </div>
                </dl>

                <div class="mt-8 flex items-center justify-between">
                  <Button variant="ghost" @click="step = 3"><ArrowLeft class="h-4 w-4" />Back</Button>
                  <Button size="md" variant="primary" :loading="submitting" @click="submitBooking">
                    <CalendarCheck class="h-5 w-5" />Confirm Booking
                  </Button>
                </div>
                <p v-if="submitError" class="mt-4 rounded-xl border border-brand-red/30 bg-brand-red/10 p-3.5 text-center text-sm text-brand-red">{{ submitError }}</p>
              </div>

              <!-- Step 6: Confirmation -->
              <div v-else key="s6">
                <div class="py-6 text-center">
                  <motion.div
                    class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-green-500/40 bg-green-500/15"
                    :initial="{ scale: 0.6, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }" :transition="{ type: 'spring', stiffness: 220, damping: 16 }"
                  >
                    <CheckCircle2 class="h-10 w-10 text-green-400" />
                  </motion.div>
                  <h2 class="font-heading text-4xl text-white">Booking <span class="text-brand-red">Confirmed</span></h2>
                  <p class="mx-auto mt-3 max-w-md text-sm leading-relaxed text-brand-grey">
                    Your service appointment is booked. A confirmation has been sent to
                    <span class="font-semibold text-white">{{ submittedEmail }}</span>. Our team will call to verify within business hours.
                  </p>

                  <dl class="mx-auto mt-8 max-w-md divide-y divide-white/[0.06] rounded-2xl border border-white/[0.08] bg-white/[0.02] text-left">
                    <div v-for="row in reviewRows" :key="row.label" class="flex items-center justify-between gap-6 px-5 py-3.5">
                      <dt class="text-sm text-brand-grey">{{ row.label }}</dt>
                      <dd class="text-sm font-semibold text-white">{{ row.value }}</dd>
                    </div>
                  </dl>

                  <div class="mt-9 flex flex-wrap justify-center gap-4">
                    <Button to="/dashboard" variant="primary"><LayoutDashboard class="h-5 w-5" />My Dashboard</Button>
                    <Button to="/" variant="ghost">Back to Home</Button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Live summary -->
        <aside class="hidden lg:block">
          <div class="sticky top-28 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-6">
            <p class="mb-4 font-display text-xs font-bold tracking-[0.2em] text-brand-grey uppercase">Booking Summary</p>
            <dl class="space-y-3.5 text-sm">
              <div class="flex items-center justify-between gap-4">
                <dt class="text-brand-grey">Motorcycle</dt>
                <dd class="font-semibold text-white">{{ summaryBike }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4">
                <dt class="text-brand-grey">Service</dt>
                <dd class="font-semibold text-white">{{ summaryService }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4">
                <dt class="text-brand-grey">Branch</dt>
                <dd class="text-right font-semibold text-white">{{ form.branch }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4">
                <dt class="text-brand-grey">Date</dt>
                <dd class="font-semibold text-white">{{ form.date ? formatDate(form.date) : '—' }}</dd>
              </div>
              <div class="flex items-center justify-between gap-4">
                <dt class="text-brand-grey">Time</dt>
                <dd class="font-semibold text-white">{{ form.time ? formatTime(form.time) : '—' }}</dd>
              </div>
            </dl>

            <div class="mt-6 border-t border-white/[0.06] pt-5">
              <p class="mb-2 flex items-center gap-2 text-xs text-brand-grey/80">
                <CloudCheck class="h-4 w-4 text-emerald-400" />
                <span :class="{ 'text-green-400': autosaved }">{{ autosaved ? 'Draft saved' : 'Autosaving…' }}</span>
              </p>
              <p class="text-xs leading-relaxed text-brand-grey/60">
                A 50% service deposit may be requested on arrival. Cancel anytime free of charge up to 24 hours before your slot.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import {
  ArrowLeft, CalendarCheck, Check, CheckCircle2, CloudCheck, LayoutDashboard,
  Wrench, Cog, AlertTriangle, SearchCheck, Sparkles, Bike,
  MapPin as MapPinIcon, Calendar as CalendarIcon, Clock as ClockIcon, User as UserIcon, Phone as PhoneIcon,
} from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useDebounceFn } from '@vueuse/core'
import { formatDate, formatTime } from '~/composables/useFormat'
import { useAuthStore } from '~/stores/auth'

useHead({
  title: 'Book a Service - Nairobi Powerbikes',
  meta: [{ name: 'description', content: 'Schedule a service appointment at Nairobi Powerbikes. Our certified technicians will keep your ride in top condition.' }],
})

const pb = usePB()
const auth = useAuthStore()
const route = useRoute()

const steps = [
  { id: 'bike', label: 'Motorcycle Information', hint: 'Which machine is it?' },
  { id: 'service', label: 'Service Required', hint: 'What does it need?' },
  { id: 'appointment', label: 'Appointment', hint: 'Branch, date & time' },
  { id: 'info', label: 'Additional Information', hint: 'Contact & notes' },
  { id: 'review', label: 'Review', hint: 'Confirm your booking' },
  { id: 'done', label: 'Confirmation', hint: 'You are booked in' },
]

const step = ref(0)
const submitting = ref(false)
const submitError = ref('')
const autosaved = ref(true)
const submittedEmail = ref('')

const form = reactive({
  bike: '', bikeOther: '', serviceType: '', branch: 'Mombasa Road Branch',
  date: '', time: '', name: '', phone: '', email: '', notes: '',
})
const errors = reactive<Record<string, string>>({})

const isLoggedIn = computed(() => auth.isAuthenticated)
const authUser = computed(() => auth.user as any)

const motorcycles = ref<any[]>([])
const branches = ref<any[]>([])
const serviceTypes = ref<{ value: string; label: string; desc: string; icon: any }[]>([])
const bookedTimes = ref<Set<string>>(new Set())
const allTimeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

const fallbackServiceTypes = [
  { value: 'routine', label: 'Routine Service', desc: 'Oil, filters, fluid levels & multi-point health check', icon: Wrench },
  { value: 'major', label: 'Major Service', desc: 'Full service incl. valves, brakes & drivetrain inspection', icon: Cog },
  { value: 'repair', label: 'Repair', desc: 'Fault diagnosis and repair by factory-trained technicians', icon: AlertTriangle },
  { value: 'inspection', label: 'Pre-Purchase Inspection', desc: '100-point inspection report before you buy', icon: SearchCheck },
  { value: 'customization', label: 'Customization', desc: 'Exhausts, lighting, performance & styling upgrades', icon: Sparkles },
]
const iconMap: Record<string, any> = {
  'Routine Service': Wrench, 'Major Service': Cog, Repair: AlertTriangle, 'Pre-Purchase Inspection': SearchCheck, Customization: Sparkles,
}

const minDate = computed(() => new Date().toISOString().split('T')[0])

const timeSlots = computed(() => {
  const now = new Date()
  return allTimeSlots.filter(slot => {
    const [h] = slot.split(':').map(Number)
    if (form.date === now.toISOString().split('T')[0] && h <= now.getHours()) return false
    return true
  })
})

const availableCount = computed(() => timeSlots.value.filter(s => !bookedTimes.value.has(s)).length)

const summaryBike = computed(() => form.bike === 'other' ? form.bikeOther || 'Other' : form.bike || '—')
const summaryService = computed(() => serviceTypes.value.find(s => s.value === form.serviceType)?.label || '—')

const reviewRows = computed(() => [
  { label: 'Motorcycle', value: summaryBike.value, icon: Bike },
  { label: 'Service', value: summaryService.value, icon: Wrench },
  { label: 'Branch', value: form.branch, icon: MapPinIcon },
  { label: 'Date', value: form.date ? formatDate(form.date) : '—', icon: CalendarIcon },
  { label: 'Time', value: form.time ? formatTime(form.time) : '—', icon: ClockIcon },
  ...(!isLoggedIn.value ? [{ label: 'Name', value: form.name || '—', icon: UserIcon }, { label: 'Contact', value: `${form.phone || '—'}${form.email ? ` · ${form.email}` : ''}`, icon: PhoneIcon }] : []),
])

function validateStep(i: number): boolean {
  Object.keys(errors).forEach(k => delete errors[k])
  if (i === 0) {
    if (!form.bike) errors.bike = 'Please select your motorcycle'
    if (form.bike === 'other' && !form.bikeOther.trim()) errors.bike = 'Please tell us the make & model'
  }
  if (i === 1 && !form.serviceType) errors.serviceType = 'Please choose a service'
  if (i === 2) {
    if (!form.date) errors.date = 'Choose a preferred date'
    if (!form.time) errors.time = 'Choose a preferred time'
  }
  if (i === 3 && !isLoggedIn.value) {
    if (form.name.trim().length < 2) errors.name = 'Name required'
    if (form.phone.trim().length < 8) errors.phone = 'Valid phone required'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Valid email required'
  }
  return Object.keys(errors).length === 0
}

function nextStep() {
  if (validateStep(step.value)) step.value++
}
function goTo(i: number) {
  if (i < step.value) { step.value = i; return }
  let ok = true
  for (let s = step.value; s < i; s++) {
    if (!validateStep(s)) { ok = false; break }
  }
  if (ok) step.value = i
}

async function loadBookedTimes() {
  bookedTimes.value = new Set()
  form.time = ''
  if (!form.date) return
  try {
    const res = await pb.collection('service_bookings').getList(1, 50, {
      filter: `preferred_date = "${form.date}" && type = "service"`,
      fields: 'preferred_time',
    })
    bookedTimes.value = new Set(res.items.map((b: any) => b.preferred_time))
  } catch { bookedTimes.value = new Set() }
}

async function loadData() {
  try {
    motorcycles.value = await pb.collection('motorcycles').getFullList({ sort: 'name', filter: 'status!="sold"' })
  } catch { motorcycles.value = [] }
  try {
    branches.value = await pb.collection('branches').getFullList({ sort: 'name' })
    if (branches.value.length) form.branch = branches.value[0].name
  } catch { branches.value = [] }
  try {
    const types = await pb.collection('service_types').getFullList({ sort: 'name' })
    if (types.length) {
      serviceTypes.value = types.map((t: any) => ({ value: t.name, label: t.name, desc: t.description || '', icon: iconMap[t.name] || Wrench }))
      return
    }
  } catch { /* fallback */ }
  serviceTypes.value = fallbackServiceTypes
}

const DRAFT_KEY = 'npb_service_draft'
function saveDraft() {
  if (step.value === 5) return
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...form, step: step.value }))
  autosaved.value = true
}
const debouncedSave = useDebounceFn(saveDraft, 600)
watch(form, () => { autosaved.value = false; debouncedSave() }, { deep: true })
watch(step, () => saveDraft())

function restoreDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return
    const d = JSON.parse(raw)
    Object.assign(form, d)
    if (typeof d.step === 'number' && d.step > 0 && d.step < 5) step.value = d.step
  } catch { /* ignore */ }
}

async function submitBooking() {
  submitting.value = true
  submitError.value = ''
  try {
    const res = await pb.collection('service_bookings').getList(1, 1, {
      filter: `preferred_date = "${form.date}" && preferred_time = "${form.time}" && type = "service"`,
    })
    if (res.totalItems > 0) {
      submitError.value = 'This time slot has just been taken. Please pick another.'
      step.value = 2
      form.time = ''
      return
    }
    const userId = pb.authStore.model?.id || null
    const created = await pb.collection('service_bookings').create({
      type: 'service',
      name: form.name || (authUser.value?.name as string) || '',
      phone: form.phone || (authUser.value?.phone as string) || '',
      email: form.email || (authUser.value?.email as string) || '',
      service_type: form.serviceType,
      motorcycle: summaryBike.value,
      branch: form.branch,
      preferred_date: form.date,
      preferred_time: form.time,
      notes: form.notes || '',
      status: 'pending',
      user: userId,
    })
    submittedEmail.value = form.email || (authUser.value?.email as string) || ''
    form.bike = ''; form.bikeOther = ''; form.serviceType = ''
    form.date = ''; form.time = ''; form.name = ''; form.phone = ''; form.email = ''; form.notes = ''
    bookedTimes.value = new Set()
    localStorage.removeItem(DRAFT_KEY)
    step.value = 5
  } catch (err: any) {
    submitError.value = err?.data?.message || err?.message || 'Booking failed. Please try again.'
  } finally { submitting.value = false }
}

onMounted(async () => {
  restoreDraft()
  await loadData()
  await applyQueryPrefill()
  pb.collection('service_bookings').subscribe('*', () => loadBookedTimes())
})

async function applyQueryPrefill() {
  const q = route.query
  if (!q.date || !q.time) return
  const date = String(q.date)
  const time = String(q.time)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !ALL_SLOTS_VALID.includes(time)) return
  form.date = date
  if (q.branch && branches.value.some(b => b.name === String(q.branch))) form.branch = String(q.branch)
  await loadBookedTimes()
  if (bookedTimes.value.has(time)) {
    errors.time = 'This slot was just taken — pick another time.'
  } else {
    form.time = time
  }
  step.value = 2
}

const ALL_SLOTS_VALID = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

onUnmounted(() => {
  pb.collection('service_bookings').unsubscribe('*')
})
</script>

<style scoped>
.wizard-enter-active, .wizard-leave-active { transition: all 0.28s ease; }
.wizard-enter-from { opacity: 0; transform: translateX(26px); }
.wizard-leave-to { opacity: 0; transform: translateX(-18px); }
</style>