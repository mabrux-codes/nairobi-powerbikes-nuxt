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
            Command Center
          </span>
          <h1 class="mt-4 font-heading text-3xl sm:text-4xl lg:text-5xl text-white">
            Welcome back, <span class="text-brand-red">{{ firstName }}</span>
          </h1>
          <p class="mt-3 max-w-xl text-sm sm:text-base text-brand-grey">
            {{ todayLabel }} — everything happening across your dealership at a glance.
          </p>

          <div class="mt-7 flex flex-wrap items-center gap-3">
            <Button to="/dashboard/motorcycles?create=1">
              <Plus class="h-4 w-4" />Add Motorcycle
            </Button>
            <Button to="/dashboard/service-bookings" variant="secondary">
              <CalendarCheck2 class="h-4 w-4" />View Bookings
            </Button>
            <Button to="/dashboard/messages" variant="ghost">
              <MessageSquare class="h-4 w-4" />Inbox
              <span v-if="unreadMessages > 0" class="ml-1 rounded-full bg-brand-red px-1.5 py-0.5 text-[10px] font-bold text-white">{{ unreadMessages }}</span>
            </Button>
            <button
              class="p-2.5 text-brand-grey hover:text-white hover:bg-white/5 rounded-xl border border-brand-grey/15 hover:border-brand-red/40 transition-all duration-200"
              :disabled="refreshing"
              aria-label="Refresh data"
              @click="refresh"
            >
              <RefreshCw class="h-4 w-4" :class="refreshing ? 'animate-spin' : ''" />
            </button>
          </div>
        </div>

        <div class="hidden lg:flex flex-col gap-2 shrink-0 rounded-2xl border border-brand-grey/15 bg-white/[0.03] backdrop-blur p-5 min-w-[280px]">
          <div class="flex items-center justify-between">
            <p class="text-[10px] font-display tracking-[0.25em] text-brand-grey/70 uppercase">{{ rangeLabel }}</p>
            <span class="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">{{ rangePayments }} payments</span>
          </div>
          <p class="font-display text-3xl tracking-display text-white">{{ fmtK(rangeRevenue) }}</p>
          <p class="text-xs text-brand-grey">Revenue from payments received</p>
          <div class="mt-1 flex flex-wrap gap-1.5">
            <button
              v-for="r in ranges"
              :key="r.key"
              class="rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors"
              :class="range === r.key ? 'border-brand-red bg-brand-red/15 text-brand-red' : 'border-brand-grey/20 text-brand-grey hover:border-brand-red/40 hover:text-white'"
              @click="range = r.key"
            >{{ r.label }}</button>
          </div>
          <div class="mt-3 h-px bg-brand-grey/15" />
          <div class="flex items-center justify-between pt-2 text-xs">
            <span class="text-brand-grey">New bookings</span>
            <span class="font-semibold text-white">{{ monthly.bookings }}</span>
          </div>
          <div class="flex items-center justify-between pt-1.5 text-xs">
            <span class="text-brand-grey">Test rides</span>
            <span class="font-semibold text-white">{{ monthly.testRides }}</span>
          </div>
          <div class="flex items-center justify-between pt-1.5 text-xs">
            <span class="text-brand-grey">New customers</span>
            <span class="font-semibold text-white">{{ monthly.customers }}</span>
          </div>
        </div>
      </div>
    </motion.div>

    <!-- KPI cards -->
    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 8" :key="i" class="animate-pulse rounded-xl border border-brand-grey/15 bg-brand-black/60 p-5">
        <div class="h-10 w-10 rounded-lg bg-brand-grey/10" />
        <div class="mt-4 h-8 w-14 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3 w-24 rounded bg-brand-grey/10" />
      </div>
    </div>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <motion.div
        v-for="(card, i) in kpis"
        :key="card.label"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.08 + i * 0.05, duration: 0.4 }"
        class="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lg hover:shadow-brand-red/5"
      >
        <NuxtLink v-if="card.to" :to="card.to" class="absolute inset-0 z-10" :aria-label="card.label" />
        <div class="flex items-start justify-between gap-3">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110" :class="card.iconBg">
            <component :is="card.icon" class="h-5 w-5" :class="card.iconColor" />
          </span>
          <span
            v-if="card.trend !== undefined"
            class="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
            :class="card.trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'"
          >
            <TrendingUp v-if="card.trend >= 0" class="h-3 w-3" />
            <TrendingDown v-else class="h-3 w-3" />
            {{ Math.abs(card.trend) }}%
          </span>
        </div>
        <p class="mt-4 min-w-0 truncate font-heading text-3xl text-white lg:text-[1.45rem] xl:text-3xl">{{ card.display }}</p>
        <p class="mt-1 font-display text-xs tracking-display text-brand-grey/90 uppercase">{{ card.label }}</p>
        <div v-if="card.spark && card.spark.length" class="mt-auto flex h-9 min-w-0 items-end gap-1 overflow-hidden pt-3 sm:h-10" :aria-hidden="true">
          <span v-for="(v, k) in card.spark" :key="k" class="flex h-full min-w-0 flex-1 items-end">
            <span
              class="w-full rounded-t-sm transition-all duration-300"
              :class="v > 0 ? 'bg-brand-red/70' : 'bg-brand-grey/20'"
              :style="{ height: sparkHeight(v, maxSpark(card.spark)) }"
            />
          </span>
        </div>
        <span class="absolute top-0 left-0 h-0.5 w-0 bg-brand-red transition-all duration-300 group-hover:w-full" />
      </motion.div>
    </div>

    <!-- Charts row 1 -->
    <div class="grid gap-6 lg:grid-cols-2">
      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.15, duration: 0.4 }"
        class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-display text-lg tracking-display text-white">Bookings Overview</h2>
            <p class="mt-0.5 text-xs text-brand-grey">Service & test rides per month</p>
          </div>
          <div class="flex items-center gap-3 text-[10px] font-display tracking-[0.15em] uppercase text-brand-grey/70">
            <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-brand-red" />Service</span>
            <span class="flex items-center gap-1.5"><span class="h-2 w-2 rounded-full bg-brand-grey/50" />Test Rides</span>
          </div>
        </div>
        <div class="mt-6">
          <div v-if="!hasChartData(monthlySeries.service) && !hasChartData(monthlySeries.testRide)" class="flex h-48 items-center justify-center text-sm text-brand-grey">
            No booking data yet
          </div>
          <div v-else class="flex items-end justify-between gap-2 h-48">
            <div v-for="(m, idx) in monthLabels" :key="m" class="flex-1 flex flex-col items-center gap-2 group">
              <div class="flex items-end gap-1 h-36 w-full justify-center">
                <div
                  v-for="(v, s) in [monthlySeries.service[idx], monthlySeries.testRide[idx]]"
                  :key="s"
                  class="w-2.5 sm:w-3.5 rounded-t transition-all duration-500 group-hover:opacity-100"
                  :class="s === 0 ? 'bg-brand-red' : 'bg-brand-grey/50'"
                  :style="{ height: barHeight(v, maxOf(monthlySeries.service, monthlySeries.testRide)) }"
                  :title="v + (s === 0 ? ' services' : ' test rides')"
                />
              </div>
              <span class="text-[10px] text-brand-grey/70 font-medium">{{ m }}</span>
            </div>
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
          <div>
            <h2 class="font-display text-lg tracking-display text-white">Revenue</h2>
            <p class="mt-0.5 text-xs text-brand-grey">Payments received per month</p>
          </div>
          <span class="flex h-9 items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 text-xs font-semibold text-emerald-400">
            {{ fmtK(totalRevenue) }} total
          </span>
        </div>
        <div class="mt-6">
          <div v-if="!hasChartData(monthlySeries.revenue)" class="flex h-48 items-center justify-center text-sm text-brand-grey">
            No revenue data yet
          </div>
          <div v-else class="flex items-end justify-between gap-2 h-48">
            <div v-for="(m, idx) in monthLabels" :key="m" class="flex-1 flex flex-col items-center gap-2 group">
              <div class="w-full flex items-end justify-center h-36">
                <div
                  class="w-3.5 sm:w-5 rounded-t bg-gradient-to-t from-brand-red/60 to-brand-red transition-all duration-500 group-hover:from-brand-red group-hover:to-brand-red"
                  :style="{ height: barHeight(monthlySeries.revenue[idx], maxOf(monthlySeries.revenue), 36) }"
                  :title="fmtK(monthlySeries.revenue[idx])"
                />
              </div>
              <span class="text-[10px] text-brand-grey/70 font-medium">{{ m }}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    <!-- Charts row 2 -->
    <div class="grid gap-6 lg:grid-cols-3">
      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.25, duration: 0.4 }"
        class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6"
      >
        <h2 class="font-display text-lg tracking-display text-white">Service Pipeline</h2>
        <p class="mt-0.5 text-xs text-brand-grey">All service bookings by stage</p>
        <div v-if="servicePipeline.length === 0" class="mt-6 flex h-40 items-center justify-center text-sm text-brand-grey">
          No service bookings yet
        </div>
        <template v-else>
          <div class="relative mx-auto mt-6 h-40 w-40">
            <div class="absolute inset-0 rounded-full" :style="{ background: donutStyle }" />
            <div class="absolute inset-5 rounded-full bg-brand-black flex flex-col items-center justify-center">
              <span class="font-heading text-2xl text-white">{{ pipelineTotal }}</span>
              <span class="text-[10px] font-display tracking-[0.2em] text-brand-grey/70 uppercase">Bookings</span>
            </div>
          </div>
          <div class="mt-6 space-y-2.5">
            <div v-for="item in servicePipeline" :key="item.label" class="flex items-center gap-2.5 text-sm">
              <span class="h-2.5 w-2.5 rounded-full shrink-0" :style="{ background: item.color }" />
              <span class="text-brand-grey capitalize flex-1">{{ item.label }}</span>
              <span class="text-white font-semibold">{{ item.count }}</span>
            </div>
          </div>
        </template>
      </motion.div>

      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.3, duration: 0.4 }"
        class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-display text-lg tracking-display text-white">Most Booked Bikes</h2>
            <p class="mt-0.5 text-xs text-brand-grey">Top motorcycles across all bookings</p>
          </div>
          <Trophy class="h-5 w-5 text-amber-400" />
        </div>
        <div v-if="mostBooked.length === 0" class="mt-6 flex h-40 items-center justify-center text-sm text-brand-grey">
          No bookings yet
        </div>
        <div v-else class="mt-6 space-y-4">
          <div v-for="(b, idx) in mostBooked" :key="b.name" class="space-y-1.5">
            <div class="flex items-center justify-between text-sm">
              <span class="flex items-center gap-2 min-w-0">
                <span class="w-5 text-[10px] font-display tracking-wider text-brand-grey/70">{{ idx + 1 }}</span>
                <span class="text-white truncate">{{ b.name }}</span>
              </span>
              <span class="text-brand-grey text-xs shrink-0">{{ b.count }}×</span>
            </div>
            <div class="ml-7 h-1.5 rounded-full bg-brand-grey/10">
              <div class="h-full rounded-full bg-gradient-to-r from-brand-red/70 to-brand-red transition-all duration-700" :style="{ width: pct(b.count, mostBooked[0].count) + '%' }" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.35, duration: 0.4 }"
        class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6"
      >
        <h2 class="font-display text-lg tracking-display text-white">Inventory Health</h2>
        <p class="mt-0.5 text-xs text-brand-grey">Fleet & gear stock snapshot</p>
        <div class="mt-6 space-y-5">
          <div>
            <p class="text-[10px] font-display tracking-[0.2em] text-brand-grey/70 uppercase mb-2.5">Motorcycle fleet</p>
            <div class="space-y-2.5">
              <div v-for="s in fleetHealth" :key="s.label" class="flex items-center gap-3 text-sm">
                <span class="w-24 text-brand-grey capitalize shrink-0">{{ s.label }}</span>
                <div class="flex-1 h-1.5 rounded-full bg-brand-grey/10">
                  <div class="h-full rounded-full transition-all duration-700" :style="{ width: pct(s.count, fleetTotal) + '%', background: s.color }" />
                </div>
                <span class="text-white font-semibold w-6 text-right">{{ s.count }}</span>
              </div>
            </div>
          </div>
          <div>
            <p class="text-[10px] font-display tracking-[0.2em] text-brand-grey/70 uppercase mb-2.5">Gear & apparel</p>
            <div class="space-y-2.5">
              <div class="flex items-center gap-3 text-sm">
                <span class="w-24 text-brand-grey capitalize shrink-0">In stock</span>
                <div class="flex-1 h-1.5 rounded-full bg-brand-grey/10">
                  <div class="h-full rounded-full bg-emerald-500 transition-all duration-700" :style="{ width: pct(gearInStock, gearTotal) + '%' }" />
                </div>
                <span class="text-white font-semibold w-6 text-right">{{ gearInStock }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="w-24 text-brand-grey capitalize shrink-0">Out of stock</span>
                <div class="flex-1 h-1.5 rounded-full bg-brand-grey/10">
                  <div class="h-full rounded-full bg-rose-500 transition-all duration-700" :style="{ width: pct(gearTotal - gearInStock, gearTotal) + '%' }" />
                </div>
                <span class="text-white font-semibold w-6 text-right">{{ gearTotal - gearInStock }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span class="w-24 text-brand-grey capitalize shrink-0">Customers</span>
                <div class="flex-1 h-1.5 rounded-full bg-brand-grey/10">
                  <div class="h-full rounded-full bg-brand-red transition-all duration-700" :style="{ width: pct(customerCount, Math.max(1, totalUsers)) + '%' }" />
                </div>
                <span class="text-white font-semibold w-6 text-right">{{ customerCount }}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    <!-- Activity + Appointments + Quick links -->
    <div class="grid gap-6 lg:grid-cols-3">
      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: 0.35, duration: 0.4 }"
        class="lg:col-span-2 min-w-0 rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6"
      >
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-display text-lg tracking-display text-white">Recent Activity</h2>
            <p class="mt-0.5 text-xs text-brand-grey">Latest bookings and inquiries</p>
          </div>
          <Activity class="h-5 w-5 text-brand-red" />
        </div>
        <div v-if="activities.length === 0" class="mt-6 rounded-xl border border-dashed border-brand-grey/20 p-10 text-center">
          <p class="text-sm text-brand-grey">No activity yet</p>
        </div>
        <div v-else class="mt-5 space-y-1">
          <div v-for="act in activities" :key="act.id" class="flex items-start gap-3.5 rounded-lg p-2.5 transition-colors hover:bg-white/[0.03]">
            <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" :class="act.bgClass">
              <component :is="act.icon" class="h-4 w-4" :class="act.iconClass" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-sm text-white leading-snug">{{ act.text }}</p>
              <p class="mt-0.5 text-xs text-brand-grey">{{ act.time }}</p>
            </div>
            <NuxtLink
              v-if="act.to"
              :to="act.to"
              class="hidden sm:flex items-center gap-1 text-[11px] font-semibold text-brand-red hover:text-white transition-colors shrink-0"
            >
              View <ChevronRight class="h-3 w-3" />
            </NuxtLink>
          </div>
        </div>
      </motion.div>

      <div class="space-y-6 min-w-0">
        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.4, duration: 0.4 }"
          class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6"
        >
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg tracking-display text-white">Upcoming</h2>
            <CalendarDays class="h-5 w-5 text-brand-red" />
          </div>
          <p class="mt-0.5 text-xs text-brand-grey">Next appointments on the calendar</p>
          <div v-if="upcoming.length === 0" class="mt-6 rounded-xl border border-dashed border-brand-grey/20 p-8 text-center">
            <p class="text-sm text-brand-grey">No upcoming appointments</p>
          </div>
          <div v-else class="mt-5 space-y-3">
            <NuxtLink
              v-for="a in upcoming"
              :key="a.id"
              :to="a.to"
              class="flex items-center gap-3 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-3 transition-all duration-200 hover:border-brand-red/40 hover:bg-brand-red/5"
            >
              <div class="flex flex-col items-center justify-center h-11 w-11 rounded-lg shrink-0" :class="a.type === 'test_ride' ? 'bg-amber-500/15' : 'bg-emerald-500/15'">
                <span class="text-[9px] font-display tracking-wider uppercase leading-none" :class="a.type === 'test_ride' ? 'text-amber-400' : 'text-emerald-400'">{{ a.type === 'test_ride' ? 'TR' : 'SV' }}</span>
                <span class="text-xs font-bold text-white mt-0.5">{{ a.day }}</span>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-white truncate">{{ a.title }}</p>
                <p class="text-xs text-brand-grey truncate">{{ a.meta }}</p>
              </div>
              <StatusChip :status="a.status" size="sm" />
            </NuxtLink>
          </div>
        </motion.div>

        <motion.div
          :initial="{ opacity: 0, y: 20 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ delay: 0.45, duration: 0.4 }"
          class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-6"
        >
          <h2 class="font-display text-lg tracking-display text-white">Jump Back In</h2>
          <p class="mt-0.5 text-xs text-brand-grey">Frequently used management pages</p>
          <div class="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            <NuxtLink
              v-for="link in quickLinks"
              :key="link.to"
              :to="link.to"
              class="group flex flex-col items-center gap-2 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-3.5 transition-all duration-200 hover:border-brand-red/40 hover:bg-brand-red/5"
            >
              <component :is="link.icon" class="h-5 w-5 text-brand-grey transition-colors group-hover:text-brand-red" />
              <span class="text-[10px] font-display tracking-[0.1em] uppercase text-brand-grey/70 text-center leading-tight">{{ link.label }}</span>
            </NuxtLink>
          </div>
        </motion.div>
      </div>
    </div>

    <p class="text-right text-xs text-brand-grey/40">Last updated: {{ lastUpdated }}</p>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import {
  Bike, Wrench, Users, Mail, Package, Shirt, Gauge, MessageSquare, Plus, RefreshCw,
  CalendarCheck2, ChevronRight, TrendingUp, TrendingDown, Trophy, Activity, CalendarDays,
  LayoutGrid, Star, Megaphone, Settings, ClipboardList, Wallet,
} from 'lucide-vue-next'
import StatusChip from '~/components/dashboard/StatusChip.vue'
import { useAdminDataStore } from '~/stores/adminData'
import { useAuthStore } from '~/stores/auth'

const store = useAdminDataStore()
const auth = useAuthStore()

const loading = computed(() => !store.ready)
const refreshing = ref(false)
const lastUpdated = computed(() => store.lastUpdated)

const firstName = computed(() => {
  const n = auth.user?.name || auth.user?.email || 'Boss'
  return n.split(' ')[0]
})

const todayLabel = computed(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))

const customerCount = computed(() => store.users.filter(u => u.role === 'customer').length)
const totalUsers = computed(() => store.users.length)
const unreadMessages = computed(() => store.unreadContacts)
const gearInStock = computed(() => store.accessories.filter(a => a.in_stock).length + store.apparel.filter(a => a.in_stock).length)
const gearTotal = computed(() => store.accessories.length + store.apparel.length)

const monthLabels = computed(() => {
  const out: string[] = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    out.push(d.toLocaleDateString('en-US', { month: 'short' }))
  }
  return out
})

function monthIndex(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
  return 5 - diff
}

const range = ref<'today' | 'week' | 'month' | 'year' | 'all'>('month')
const ranges = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
  { key: 'all', label: 'All' },
] as const
const rangeLabel = computed(() => `Revenue · ${ranges.find(r => r.key === range.value)?.label || 'Month'}`)

function paymentDate(p: any) {
  return p.payment_date || p.created
}

const rangePayments = computed(() => {
  const now = new Date()
  const startOf = { today: new Date(now.getFullYear(), now.getMonth(), now.getDate()), week: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()), month: new Date(now.getFullYear(), now.getMonth(), 1), year: new Date(now.getFullYear(), 0, 1) } as Record<string, Date>
  const min = range.value === 'all' ? null : startOf[range.value].getTime()
  return store.payments.filter(p => {
    if (min === null) return true
    const t = new Date(paymentDate(p)).getTime()
    return !isNaN(t) && t >= min
  }).length
})

const rangeRevenue = computed(() => {
  const now = new Date()
  const startOf = { today: new Date(now.getFullYear(), now.getMonth(), now.getDate()), week: new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()), month: new Date(now.getFullYear(), now.getMonth(), 1), year: new Date(now.getFullYear(), 0, 1) } as Record<string, Date>
  const min = range.value === 'all' ? null : startOf[range.value].getTime()
  return store.payments.reduce((sum, p) => {
    if (min !== null) {
      const t = new Date(paymentDate(p)).getTime()
      if (isNaN(t) || t < min) return sum
    }
    return sum + (Number(p.amount) || 0)
  }, 0)
})

const outstandingFinancing = computed(() => {
  return store.sales.reduce((sum, s) => sum + (Number(s.outstanding) || 0), 0)
})

function bucketSeries(list: any[], key: string, predicate?: (it: any) => boolean) {
  const arr = new Array(6).fill(0)
  for (const it of list) {
    const idx = monthIndex(it[key] || it.created)
    if (idx >= 0 && idx < 6 && (!predicate || predicate(it))) arr[idx]++
  }
  return arr
}

const monthlySeries = computed(() => ({
  service: bucketSeries(store.serviceBookings, 'created'),
  testRide: bucketSeries(store.testRides, 'created'),
  revenue: (() => {
    const arr = new Array(6).fill(0)
    for (const p of store.payments) {
      const idx = monthIndex(paymentDate(p))
      if (idx >= 0 && idx < 6) arr[idx] += Number(p.amount) || 0
    }
    return arr
  })(),
}))

const totalRevenue = computed(() => store.payments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0))

const monthly = computed(() => ({
  revenue: monthlySeries.value.revenue[5],
  bookings: monthlySeries.value.service[5] + monthlySeries.value.testRide[5],
  testRides: monthlySeries.value.testRide[5],
  customers: bucketSeries(store.users, 'created', u => u.role === 'customer')[5],
}))

function trend(now: number, prev: number) {
  if (prev === 0) return now > 0 ? 100 : 0
  return Math.round(((now - prev) / prev) * 100)
}

const kpis = computed(() => {
  const svc = monthlySeries.value.service
  const tr = monthlySeries.value.testRide
  const rev = monthlySeries.value.revenue
  const cus = bucketSeries(store.users, 'created', u => u.role === 'customer')
  return [
    { label: 'Revenue', display: fmtK(rangeRevenue.value), icon: Gauge, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', trend: trend(rev[5], rev[4]), spark: rev, to: '/dashboard/sales-inventory' },
    { label: 'Financing Outstanding', display: fmtK(outstandingFinancing.value), icon: Wallet, iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400', trend: 0, spark: [], to: '/dashboard/sales-inventory' },
    { label: 'Service Bookings', display: String(svc[5]), icon: Wrench, iconBg: 'bg-brand-red/15', iconColor: 'text-brand-red', trend: trend(svc[5], svc[4]), spark: svc, to: '/dashboard/service-bookings' },
    { label: 'Test Rides', display: String(tr[5]), icon: CalendarCheck2, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400', trend: trend(tr[5], tr[4]), spark: tr, to: '/dashboard/test-rides' },
    { label: 'Customers', display: String(customerCount.value), icon: Users, iconBg: 'bg-sky-500/15', iconColor: 'text-sky-400', trend: trend(cus[5], cus[4]), spark: cus, to: '/dashboard/staff' },
    { label: 'Available Bikes', display: String(store.motorcycles.filter(m => m.status === 'available').length), icon: Bike, iconBg: 'bg-brand-red/15', iconColor: 'text-brand-red', trend: 0, spark: [], to: '/dashboard/motorcycles' },
    { label: 'Accessories In Stock', display: String(store.accessories.filter(a => a.in_stock).length), icon: Package, iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400', trend: 0, spark: [], to: '/dashboard/accessories' },
    { label: 'Apparel In Stock', display: String(store.apparel.filter(a => a.in_stock).length), icon: Shirt, iconBg: 'bg-pink-500/15', iconColor: 'text-pink-400', trend: 0, spark: [], to: '/dashboard/apparel' },
    { label: 'Unread Messages', display: String(unreadMessages.value), icon: Mail, iconBg: 'bg-rose-500/15', iconColor: 'text-rose-400', trend: 0, spark: [], to: '/dashboard/messages' },
  ]
})

const PIPELINE_COLORS = ['#F59E0B', '#38BDF8', '#10B981', '#8B5CF6', '#F43F5E', '#94A3B8']

const servicePipeline = computed(() => {
  const by: Record<string, number> = {}
  store.serviceBookings.forEach(b => { by[b.status || 'pending'] = (by[b.status || 'pending'] || 0) + 1 })
  return Object.entries(by).map(([label, count], i) => ({ label, count, color: PIPELINE_COLORS[i % PIPELINE_COLORS.length] }))
})

const pipelineTotal = computed(() => servicePipeline.value.reduce((a, b) => a + b.count, 0))

const donutStyle = computed(() => {
  const total = pipelineTotal.value
  if (total === 0) return 'background: #1f1f22'
  let acc = 0
  const stops = servicePipeline.value.map(s => {
    const from = (acc / total) * 360
    acc += s.count
    const to = (acc / total) * 360
    return `${s.color} ${from}deg ${to}deg`
  })
  return `conic-gradient(${stops.join(', ')})`
})

const mostBooked = computed(() => {
  const by: Record<string, number> = {}
  for (const b of [...store.serviceBookings, ...store.testRides]) {
    const name = (b.motorcycle || '').trim()
    if (!name) continue
    const key = name.toLowerCase()
    by[key] = (by[key] || 0) + 1
  }
  return Object.entries(by)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key, count]) => ({ name: key.charAt(0).toUpperCase() + key.slice(1), count }))
})

const fleetHealth = computed(() => {
  const by: Record<string, number> = {}
  store.motorcycles.forEach(m => { by[m.status || 'available'] = (by[m.status || 'available'] || 0) + 1 })
  const colors: Record<string, string> = { available: '#10B981', sold: '#F43F5E', coming_soon: '#F59E0B' }
  return Object.entries(by).map(([label, count]) => ({ label, count, color: colors[label] || '#94A3B8' }))
})

const fleetTotal = computed(() => store.motorcycles.length)

const upcoming = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const flat = [...store.serviceBookings.map(b => ({ ...b, type: 'service' })), ...store.testRides.map(b => ({ ...b, type: 'test_ride' }))]
    .map(b => ({ ...b, _date: new Date(b.preferred_date).getTime() }))
    .filter(b => !isNaN(b._date) && b._date >= today.getTime() && b.status !== 'cancelled')
    .sort((a, b) => a._date - b._date)
    .slice(0, 5)
  return flat.map(b => ({
    id: b.id,
    type: b.type || 'service',
    title: b.motorcycle || b.name || 'Booking',
    meta: `${b.preferred_time || 'Flexible'} · ${b.branch || 'Main Branch'} · ${b.name || 'Guest'}`,
    day: new Date(b.preferred_date).getDate(),
    status: b.status || 'pending',
    to: b.type === 'test_ride' ? `/dashboard/test-rides?edit=${b.id}` : `/dashboard/service-bookings?edit=${b.id}`,
  }))
})

const activities = computed(() => {
  const flat: any[] = []
  for (const b of store.testRides) {
    flat.push({
      id: 'tr' + b.id, created: b.created, type: 'ride',
      text: `${b.expand?.user?.name || b.name || 'Guest'} booked a test ride${b.status === 'pending' ? ' — needs action' : ''}`,
      time: timeAgo(b.created), to: `/dashboard/test-rides?edit=${b.id}`,
      icon: CalendarCheck2, bgClass: 'bg-amber-500/15', iconClass: 'text-amber-400',
    })
  }
  for (const b of store.serviceBookings) {
    flat.push({
      id: 'sv' + b.id, created: b.created, type: 'service',
      text: `${b.expand?.user?.name || b.name || 'Guest'} booked a service${b.status === 'pending' ? ' — needs action' : ''}`,
      time: timeAgo(b.created), to: `/dashboard/service-bookings?edit=${b.id}`,
      icon: Wrench, bgClass: 'bg-emerald-500/15', iconClass: 'text-emerald-400',
    })
  }
  for (const c of store.contacts) {
    flat.push({
      id: 'ct' + c.id, created: c.created, type: 'contact',
      text: `${c.name || c.email} sent an inquiry${c.read ? '' : ' — unread'}`,
      time: timeAgo(c.created), to: '/dashboard/messages',
      icon: MessageSquare, bgClass: 'bg-sky-500/15', iconClass: 'text-sky-400',
    })
  }
  for (const u of store.users.filter(x => x.role === 'customer')) {
    flat.push({
      id: 'us' + u.id, created: u.created, type: 'user',
      text: `${u.name || u.email} registered as a customer`,
      time: timeAgo(u.created), to: '/dashboard/staff',
      icon: Users, bgClass: 'bg-violet-500/15', iconClass: 'text-violet-400',
    })
  }
  flat.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
  return flat.slice(0, 8)
})

const quickLinks = [
  { label: 'Bookings', to: '/dashboard/service-bookings', icon: ClipboardList },
  { label: 'Inventory', to: '/dashboard/motorcycles', icon: LayoutGrid },
  { label: 'Featured', to: '/dashboard/motorcycles?featured=1', icon: Star },
  { label: 'Inbox', to: '/dashboard/messages', icon: MessageSquare },
  { label: 'Broadcast', to: '/dashboard/notifications', icon: Megaphone },
  { label: 'Settings', to: '/dashboard/settings', icon: Settings },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function fmtK(n: number) {
  if (!n) return 'KSh 0'
  if (n >= 1_000_000) return `KSh ${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `KSh ${Math.round(n / 1_000)}K`
  return `KSh ${Math.round(n)}`
}

function hasChartData(arr: number[]) { return arr.some(v => v > 0) }

function maxSpark(arr: number[]) {
  let m = 0
  for (const v of arr) m = Math.max(m, v)
  return m
}

function sparkHeight(v: number, max: number) {
  if (v <= 0 || max <= 0) return '8%'
  return Math.max(8, Math.round((v / max) * 84)) + '%'
}

function maxOf(...arrs: number[][]) {
  let m = 0
  for (const a of arrs) for (const v of a) m = Math.max(m, v)
  return m
}

function barHeight(v: number, max: number, px = 144) {
  return max > 0 ? Math.max(v > 0 ? 6 : 2, (v / max) * px) + 'px' : '2px'
}

function pct(v: number, total: number) {
  if (total <= 0) return 0
  return Math.max(3, Math.round((v / total) * 100))
}

async function refresh() {
  if (refreshing.value) return
  refreshing.value = true
  await store.refreshData()
  refreshing.value = false
}

onMounted(() => {
  store.ensureActive()
})

onUnmounted(() => {
  store.release()
})
</script>
