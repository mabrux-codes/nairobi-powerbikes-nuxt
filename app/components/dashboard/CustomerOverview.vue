<template>
  <div class="mx-auto max-w-7xl space-y-8">
    <!-- Hero -->
    <motion.div
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.5 }"
      class="relative overflow-hidden rounded-2xl border border-brand-grey/15 bg-brand-black"
    >
      <div class="absolute inset-0 asphalt-grid opacity-60" />
      <div class="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-brand-red/20 blur-[120px]" />
      <div class="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-brand-red/10 blur-[100px]" />

      <div class="relative flex flex-col gap-8 p-6 sm:p-10 lg:flex-row lg:items-center">
        <div class="flex-1">
          <span class="inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-[10px] font-display tracking-[0.25em] text-brand-red uppercase">
            <span class="h-1.5 w-1.5 rounded-full bg-brand-red animate-pulse" />
            Owner Portal
          </span>
          <h1 class="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl text-white">
            {{ greeting }}, <span class="text-brand-red">{{ firstName }}</span>
          </h1>
          <p class="mt-3 max-w-xl text-sm sm:text-base text-brand-grey">
            {{ heroSubtitle }}
          </p>

          <div class="mt-7 flex flex-wrap items-center gap-3">
            <Button to="/service/test-ride" trailing-arrow>
              <Bike class="h-4 w-4" />Book a Test Ride
            </Button>
            <Button to="/service/booking" variant="secondary">
              <Wrench class="h-4 w-4" />Book a Service
            </Button>
            <Button to="/motorcycles" variant="ghost">
              <Sparkles class="h-4 w-4" />Browse Motorcycles
            </Button>
          </div>
        </div>

        <div v-if="heroBike" class="hidden lg:block relative shrink-0">
          <div class="absolute inset-0 rounded-2xl bg-gradient-to-t from-brand-black via-transparent to-transparent" />
          <img
            :src="heroBike.url"
            :alt="heroBike.name"
            class="h-44 w-full max-w-md object-cover rounded-2xl border border-brand-grey/20 duotone-red opacity-80"
          />
          <div class="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <p class="text-[10px] font-display tracking-[0.25em] text-brand-grey/80 uppercase">{{ heroBike.brand }}</p>
              <p class="font-display text-lg tracking-display text-white">{{ heroBike.name }}</p>
            </div>
            <NuxtLink :to="heroBike.path" class="text-xs font-semibold text-brand-red hover:text-white transition-colors flex items-center gap-1">
              View <ChevronRight class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </motion.div>

    <!-- Stats -->
    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-xl border border-brand-grey/15 bg-brand-black/60 p-5">
        <div class="h-10 w-10 rounded-lg bg-brand-grey/10" />
        <div class="mt-4 h-8 w-14 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3 w-24 rounded bg-brand-grey/10" />
      </div>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <motion.div
        v-for="(card, i) in statCards"
        :key="card.label"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.08 + i * 0.07, duration: 0.4 }"
        :to="card.to"
        class="group relative overflow-hidden rounded-xl border border-brand-grey/15 bg-brand-black/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lg hover:shadow-brand-red/5"
      >
        <NuxtLink :to="card.to" class="absolute inset-0 z-10" :aria-label="card.label" />
        <div class="flex items-center justify-between">
          <span class="flex h-10 w-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110" :class="card.iconBg">
            <component :is="card.icon" class="h-5 w-5" :class="card.iconColor" />
          </span>
          <span class="font-heading text-3xl text-white transition-transform duration-300 group-hover:scale-110">{{ card.count }}</span>
        </div>
        <p class="mt-4 font-display text-sm tracking-display text-white uppercase">{{ card.label }}</p>
        <p class="mt-1 text-xs text-brand-grey">{{ card.desc }}</p>
        <span class="absolute top-0 left-0 h-0.5 w-0 bg-brand-red transition-all duration-300 group-hover:w-full" />
      </motion.div>
    </div>

    <!-- Appointments + Activity -->
    <div class="grid gap-6 lg:grid-cols-3">
      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.15, duration: 0.4 }"
        class="lg:col-span-2 rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-display text-lg tracking-display text-white">Upcoming Appointments</h2>
            <p class="mt-0.5 text-xs text-brand-grey">Your next service and test ride slots</p>
          </div>
          <NuxtLink to="/dashboard/my-bookings" class="text-xs font-semibold text-brand-red hover:text-white transition-colors flex items-center gap-1">
            View all <ChevronRight class="h-3.5 w-3.5" />
          </NuxtLink>
        </div>

        <div v-if="loading" class="mt-5 grid gap-4 sm:grid-cols-2">
          <div v-for="i in 2" :key="i" class="animate-pulse rounded-lg border border-brand-grey/15 p-4">
            <div class="h-4 w-32 rounded bg-brand-grey/10" />
            <div class="mt-3 h-6 w-48 rounded bg-brand-grey/10" />
            <div class="mt-3 h-3 w-36 rounded bg-brand-grey/10" />
          </div>
        </div>

        <div v-else-if="nextService || nextRide" class="mt-5 grid gap-4 sm:grid-cols-2">
          <div
            v-if="nextService"
            class="group relative overflow-hidden rounded-xl border border-brand-grey/15 bg-gradient-to-br from-white/[0.04] to-transparent p-5 transition-all duration-300 hover:border-brand-red/40 hover:shadow-lg hover:shadow-brand-red/5"
          >
            <div class="flex items-start justify-between">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15">
                <Wrench class="h-5 w-5 text-amber-400" />
              </span>
              <Badge :variant="serviceStatusVariant(nextService.status)">{{ serviceStatusLabel(nextService.status) }}</Badge>
            </div>
            <p class="mt-4 text-[10px] font-display tracking-[0.25em] text-brand-grey/70 uppercase">Service</p>
            <p class="font-display text-base tracking-display text-white">{{ serviceTypeLabel(nextService.service_type) }}</p>
            <p class="mt-1 text-xs text-brand-grey">{{ nextService.motorcycle || 'Motorcycle' }}</p>
            <div class="mt-4 space-y-1.5 text-xs text-brand-grey">
              <p class="flex items-center gap-1.5"><CalendarClock class="h-3.5 w-3.5 text-brand-red" />{{ formatDate(nextService.preferred_date) }}<span v-if="nextService.preferred_time">at {{ formatTime(nextService.preferred_time) }}</span></p>
              <p v-if="nextService.branch" class="flex items-center gap-1.5"><MapPin class="h-3.5 w-3.5 text-brand-red" />{{ nextService.branch }}</p>
            </div>
            <span v-if="daysUntil(nextService.preferred_date) !== null" class="absolute top-4 right-4 hidden sm:block">
              <span class="text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">{{ daysUntil(nextService.preferred_date) === 0 ? 'Today' : `In ${daysUntil(nextService.preferred_date)} days` }}</span>
            </span>
          </div>

          <div
            v-if="nextRide"
            class="group relative overflow-hidden rounded-xl border border-brand-grey/15 bg-gradient-to-br from-white/[0.04] to-transparent p-5 transition-all duration-300 hover:border-brand-red/40 hover:shadow-lg hover:shadow-brand-red/5"
          >
            <div class="flex items-start justify-between">
              <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/15">
                <Bike class="h-5 w-5 text-sky-400" />
              </span>
              <Badge :variant="testRideStatusVariant(nextRide.status)">{{ testRideStatusLabel(nextRide.status) }}</Badge>
            </div>
            <p class="mt-4 text-[10px] font-display tracking-[0.25em] text-brand-grey/70 uppercase">Test Ride</p>
            <p class="font-display text-base tracking-display text-white">{{ nextRide.motorcycle || 'Motorcycle' }}</p>
            <p class="mt-1 text-xs text-brand-grey">{{ nextRide.name || '' }}</p>
            <div class="mt-4 space-y-1.5 text-xs text-brand-grey">
              <p class="flex items-center gap-1.5"><CalendarClock class="h-3.5 w-3.5 text-brand-red" />{{ formatDate(nextRide.preferred_date) }}<span v-if="nextRide.preferred_time">at {{ formatTime(nextRide.preferred_time) }}</span></p>
              <p v-if="nextRide.branch" class="flex items-center gap-1.5"><MapPin class="h-3.5 w-3.5 text-brand-red" />{{ nextRide.branch }}</p>
            </div>
            <span v-if="daysUntil(nextRide.preferred_date) !== null" class="absolute top-4 right-4 hidden sm:block">
              <span class="text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">{{ daysUntil(nextRide.preferred_date) === 0 ? 'Today' : `In ${daysUntil(nextRide.preferred_date)} days` }}</span>
            </span>
          </div>
        </div>

        <div v-else class="mt-5 rounded-xl border border-dashed border-brand-grey/20 p-8 text-center">
          <CalendarClock class="mx-auto h-9 w-9 text-brand-grey/40" />
          <p class="mt-3 font-display text-base tracking-display text-brand-grey">No upcoming appointments</p>
          <p class="mt-1 text-xs text-brand-grey/60">Book a service or test ride and track it here in real time.</p>
          <div class="mt-4 flex flex-wrap justify-center gap-3">
            <Button size="sm" to="/service/booking">Book a Service</Button>
            <Button size="sm" variant="secondary" to="/service/test-ride">Book a Test Ride</Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.2, duration: 0.4 }"
        class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6"
      >
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg tracking-display text-white">Recent Activity</h2>
          <NuxtLink to="/dashboard/my-notifications" class="text-xs font-semibold text-brand-red hover:text-white transition-colors flex items-center gap-1">
            View all <ChevronRight class="h-3.5 w-3.5" />
          </NuxtLink>
        </div>

        <div v-if="loading" class="mt-5 space-y-5">
          <div v-for="i in 4" :key="i" class="animate-pulse flex gap-3">
            <div class="h-9 w-9 rounded-full bg-brand-grey/10" />
            <div class="flex-1 space-y-2">
              <div class="h-3.5 w-3/4 rounded bg-brand-grey/10" />
              <div class="h-3 w-1/2 rounded bg-brand-grey/10" />
            </div>
          </div>
        </div>

        <div v-else-if="activity.length" class="mt-5 relative">
          <div class="absolute left-[17px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-red/40 via-brand-grey/15 to-transparent" />
          <div class="space-y-5">
            <div v-for="(ev, i) in activity" :key="i" class="relative flex gap-4">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110" :class="ev.color">
                <component :is="ev.icon" class="h-4 w-4" />
              </div>
              <div class="min-w-0 pb-1">
                <p class="text-sm font-medium text-white">{{ ev.title }}</p>
                <p class="mt-0.5 text-xs text-brand-grey">{{ ev.sub }}</p>
                <p class="mt-0.5 text-[10px] text-brand-grey/50">{{ ev.time }}</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="mt-5 rounded-xl border border-dashed border-brand-grey/20 p-8 text-center">
          <Activity class="mx-auto h-9 w-9 text-brand-grey/40" />
          <p class="mt-3 font-display text-base tracking-display text-brand-grey">No activity yet</p>
          <p class="mt-1 text-xs text-brand-grey/60">Bookings and status updates will appear here.</p>
        </div>
      </motion.div>
    </div>

    <!-- Featured Motorcycles -->
    <motion.div
      v-if="featuredBikes.length"
      :initial="{ opacity: 0, y: 20 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ delay: 0.25, duration: 0.4 }"
    >
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="font-display text-lg tracking-display text-white">Featured Motorcycles</h2>
          <p class="mt-0.5 text-xs text-brand-grey">Handpicked for you from the showroom floor</p>
        </div>
        <NuxtLink to="/motorcycles" class="text-xs font-semibold text-brand-red hover:text-white transition-colors flex items-center gap-1">
          Browse all <ChevronRight class="h-3.5 w-3.5" />
        </NuxtLink>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="(b, i) in featuredBikes"
          :key="b.id"
          :to="bikePath(b)"
          class="group relative overflow-hidden rounded-xl border border-brand-grey/15 bg-brand-black/80 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lg hover:shadow-brand-red/5"
        >
          <div class="aspect-[16/10] overflow-hidden bg-brand-black">
            <img
              v-if="b.images?.length"
              :src="pb.files.getURL(b, b.images[0])"
              :alt="b.name"
              class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div v-else class="h-full w-full flex items-center justify-center bg-white/[0.02]">
              <Bike class="h-10 w-10 text-brand-grey/40" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-brand-black via-transparent to-transparent opacity-80" />
            <span class="absolute top-3 left-3 rounded-md bg-brand-red/90 px-2.5 py-1 text-[10px] font-display tracking-[0.2em] text-white uppercase">
              {{ b.brand_name || 'Nairobi Powerbikes' }}
            </span>
            <span v-if="b.sale_price" class="absolute top-3 right-3 rounded-md bg-emerald-500/90 px-2.5 py-1 text-[10px] font-display tracking-[0.2em] text-white uppercase">
              Sale
            </span>
          </div>
          <div class="p-4">
            <div class="flex items-baseline justify-between gap-2">
              <h3 class="font-display text-lg tracking-display text-white truncate">{{ b.name }}</h3>
              <span class="flex items-center gap-1 text-xs text-brand-red transition-transform duration-300 group-hover:translate-x-1">
                View <ChevronRight class="h-3.5 w-3.5" />
              </span>
            </div>
            <p class="mt-0.5 text-xs text-brand-grey">{{ b.year || '' }}<template v-if="b.engine_cc">&middot; {{ b.engine_cc }}cc</template><template v-if="b.type">&middot; {{ b.type }}</template></p>
            <div class="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <p class="font-heading text-xl font-bold tracking-tight text-brand-red sm:text-2xl">{{ formatPriceKes(currentPrice(b)) }}</p>
              <p v-if="currentPrice(b) < originalPrice(b)" class="text-xs font-semibold text-brand-grey/70 line-through">KES {{ originalPrice(b).toLocaleString('en-KE') }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { CalendarClock, Wrench, Bike, Heart, Bell, MapPin, ChevronRight, Sparkles, Activity, CheckCircle2 } from 'lucide-vue-next'
import { notifMeta } from '~/utils/notificationMeta'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useNotificationStore } from '~/stores/notifications'
import { useWishlistStore } from '~/stores/wishlist'
import { formatDate, formatTime, formatDateTime } from '~/composables/useFormat'

const pb = usePB()
const auth = useAuthStore()
const notifStore = useNotificationStore()
const wishlistStore = useWishlistStore()
const loading = ref(true)
const stats = ref({ testRides: 0, serviceBookings: 0 })
const testRides = ref<any[]>([])
const serviceBookings = ref<any[]>([])
const featuredBikes = ref<any[]>([])

const TERMINAL = ['completed', 'cancelled', 'rejected', 'no_show']

const SERVICE_TYPES: Record<string, string> = {
  routine: 'Routine Service', major: 'Major Service', repair: 'Repair',
  inspection: 'Pre-Purchase Inspection', customization: 'Customization',
}

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
})

const firstName = computed(() => {
  const name = auth.user?.name || auth.user?.email || 'Rider'
  return name.split(' ')[0]
})

const heroSubtitle = computed(() => {
  if (nextService.value || nextRide.value) {
    const parts: string[] = []
    if (nextService.value) parts.push(`your service is ${serviceStatusLabel(nextService.value.status).toLowerCase()}`)
    if (nextRide.value) parts.push(`your test ride is ${testRideStatusLabel(nextRide.value.status).toLowerCase()}`)
    return `Here's what's happening — ${parts.join(' and ')}. Track everything in one place.`
  }
  return 'Your garage, your rides, your schedule — everything in one place. Book services, schedule test rides and track progress in real time.'
})

const heroBike = computed(() => {
  const b = featuredBikes.value[0]
  if (!b) return null
  return {
    name: b.name,
    brand: b.brand_name || 'Nairobi Powerbikes',
    path: bikePath(b),
    url: b.images?.length ? pb.files.getURL(b, b.images[0]) : '',
  }
})

const statCards = computed(() => [
  { label: 'Test Rides', desc: 'Rides you have booked', icon: Bike, iconBg: 'bg-sky-500/15', iconColor: 'text-sky-400', count: stats.value.testRides, to: '/dashboard/my-test-rides' },
  { label: 'Service Bookings', desc: 'Services in your garage', icon: Wrench, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400', count: stats.value.serviceBookings, to: '/dashboard/my-bookings' },
  { label: 'Wishlist', desc: 'Motorcycles you love', icon: Heart, iconBg: 'bg-rose-500/15', iconColor: 'text-rose-400', count: wishlistStore.count, to: '/dashboard/my-wishlist' },
  { label: 'Unread Notifications', desc: 'Updates from our team', icon: Bell, iconBg: 'bg-brand-red/15', iconColor: 'text-brand-red', count: notifStore.unreadCount, to: '/dashboard/my-notifications' },
])

const nextService = computed(() => {
  return serviceBookings.value.find(b => !TERMINAL.includes(b.status)) || null
})

const nextRide = computed(() => {
  return testRides.value.find(b => !TERMINAL.includes(b.status)) || null
})

const activity = computed(() => {
  const events: { icon: any; color: string; title: string; sub: string; time: string }[] = []

  for (const b of [...serviceBookings.value, ...testRides.value].sort((a, b) => new Date(b.updated || b.created).getTime() - new Date(a.updated || a.created).getTime()).slice(0, 3)) {
    const isRide = b.type === 'test_ride'
    const changed = b.updated && b.created && new Date(b.updated).getTime() - new Date(b.created).getTime() > 1000
    const label = isRide ? `Test ride ${b.motorcycle || ''}` : `Service ${b.service_type || ''}`
    events.push({
      icon: isRide ? Bike : Wrench,
      color: isRide ? 'border-sky-500/40 bg-sky-500/10 text-sky-400' : 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      title: changed ? `Status updated: ${(isRide ? testRideStatusLabel(b.status) : serviceStatusLabel(b.status)).toLowerCase()}` : `New ${isRide ? 'test ride' : 'service booking'} submitted`,
      sub: label,
      time: formatDateTime(changed ? b.updated : b.created),
    })
  }

  for (const n of notifStore.notifications.slice(0, 3)) {
    events.push({
      icon: notifIcon(n.type),
      color: n.read ? 'border-brand-grey/30 bg-white/[0.03] text-brand-grey' : 'border-brand-red/40 bg-brand-red/10 text-brand-red',
      title: n.title,
      sub: n.message || 'Notification',
      time: formatDateTime(n.createdAt),
    })
  }

  return events.slice(0, 6)
})

function notifIcon(type: string) {
  return notifMeta(type).icon
}

function daysUntil(dateStr: string) {
  if (!dateStr) return null
  const [y, m, d] = dateStr.split('-').map(Number)
  if (!y || !m || !d) return null
  const target = new Date(y, m - 1, d)
  const diff = Math.ceil((target.getTime() - Date.now()) / 86400000)
  return diff < 0 ? null : diff
}

function serviceStatusLabel(s: string) {
  const map: Record<string, string> = {
    pending: 'Pending', confirmed: 'Confirmed', diagnosed: 'Diagnosed',
    awaiting_approval: 'Awaiting Approval', approved: 'Approved', in_progress: 'In Progress',
    quality_check: 'Quality Check', ready: 'Ready for Collection', completed: 'Completed', cancelled: 'Cancelled',
  }
  return map[s] || s || 'Unknown'
}

function serviceStatusVariant(s: string) {
  const map: Record<string, string> = {
    pending: 'warning', confirmed: 'default', diagnosed: 'default', awaiting_approval: 'warning',
    approved: 'secondary', in_progress: 'secondary', quality_check: 'secondary',
    ready: 'secondary', completed: 'success', cancelled: 'danger',
  }
  return map[s] || 'outline'
}

function testRideStatusLabel(s: string) {
  const map: Record<string, string> = {
    pending: 'Pending', awaiting_verification: 'Awaiting Verification', confirmed: 'Confirmed',
    ready: 'Ready', checked_in: 'Checked In', in_progress: 'In Progress', completed: 'Completed',
    cancelled: 'Cancelled', rejected: 'Rejected', no_show: 'No Show', rescheduled: 'Rescheduled',
  }
  return map[s] || s || 'Unknown'
}

function testRideStatusVariant(s: string) {
  const map: Record<string, string> = {
    pending: 'warning', awaiting_verification: 'default', confirmed: 'secondary',
    ready: 'secondary', checked_in: 'secondary', in_progress: 'secondary',
    completed: 'success', cancelled: 'danger', rejected: 'danger', no_show: 'danger', rescheduled: 'default',
  }
  return map[s] || 'outline'
}

function serviceTypeLabel(t: string) {
  return SERVICE_TYPES[t] || t || 'Service Booking'
}

function bikePath(m: any) {
  return `/motorcycles/${m.slug || encodeURIComponent(m.name)}`
}

function num(v: any) {
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : 0
}

// Lowest applicable selling price: any discounted price below list wins.
function currentPrice(b: any) {
  const price = num(b.price)
  const discounts = [num(b.sale_price), num(b.offer_price)].filter(d => d > 0 && d < price)
  if (discounts.length) return Math.min(...discounts)
  return price || 0
}

function originalPrice(b: any) {
  return num(b.price)
}

function formatPriceKes(v: number) {
  return `KES ${Number(v).toLocaleString('en-KE')}`
}

async function loadData() {
  const userId = auth.user?.id
  if (!userId) return

  const [testRidesRes, serviceRes] = await Promise.all([
    pb.collection('service_bookings').getList(1, 100, { filter: `type="test_ride" && user = "${userId}"`, sort: '-created' }).catch(() => ({ items: [], totalItems: 0 })),
    pb.collection('service_bookings').getList(1, 100, { filter: `type="service" && user = "${userId}"`, sort: '-created' }).catch(() => ({ items: [], totalItems: 0 })),
  ])

  stats.value = {
    testRides: testRidesRes.totalItems,
    serviceBookings: serviceRes.totalItems,
  }

  testRides.value = (testRidesRes.items as any[]).sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
  serviceBookings.value = (serviceRes.items as any[]).sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
}

async function loadFeaturedBikes() {
  try {
    const res = await pb.collection('motorcycles').getList(1, 3, {
      sort: '-created',
      expand: 'brand',
      filter: 'featured = true',
    }).catch(() => null)
    const items = (res?.items as any[]) || []
    featuredBikes.value = items.map(m => ({ ...m, brand_name: m.expand?.brand?.name || '' }))
  } catch {
    try {
      const res = await pb.collection('motorcycles').getList(1, 3, { sort: '-created', expand: 'brand' })
      featuredBikes.value = (res.items as any[]).map(m => ({ ...m, brand_name: m.expand?.brand?.name || '' }))
    } catch { /* best-effort */ }
  }
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

onMounted(async () => {
  loadFeaturedBikes()
  wishlistStore.load()
  await loadData()
  loading.value = false

  const userId = auth.user?.id
  if (!userId) return

  pb.collection('service_bookings').subscribe('*', handleRealtime, { filter: `user = "${userId}"` })
})

onUnmounted(() => {
  pb.collection('service_bookings').unsubscribe('*')
})
</script>
