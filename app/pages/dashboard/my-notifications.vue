<template>
  <div class="mx-auto max-w-4xl">
    <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-heading text-3xl text-white sm:text-4xl">My <span class="text-brand-red">Notifications</span></h1>
        <div class="mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-3 text-sm text-brand-grey">Updates on your bookings, test rides and more from the team.</p>
      </div>
      <Button v-if="store.unreadCount > 0" variant="ghost" size="sm" class="h-11 sm:h-9" @click="markAllRead">
        <CheckCheck class="h-4 w-4" />Mark All as Read
      </Button>
    </div>

    <div v-if="!store.ready" class="space-y-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-xl border border-brand-grey/15 p-5">
        <div class="flex items-start gap-4">
          <div class="h-10 w-10 rounded-full bg-brand-grey/10" />
          <div class="flex-1 space-y-2.5">
            <div class="h-4 w-1/2 rounded bg-brand-grey/10" />
            <div class="h-3 w-3/4 rounded bg-brand-grey/10" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="groups.length === 0" class="rounded-xl border border-dashed border-brand-grey/20 bg-brand-black/40 p-14 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10">
        <Bell class="h-8 w-8 text-brand-red" />
      </div>
      <p class="mt-5 font-heading text-2xl text-white">You're all caught up.</p>
      <p class="mt-2 text-sm text-brand-grey">Notifications about your services and test rides will land here.</p>
    </div>

    <div v-else class="space-y-8">
      <div v-for="group in groups" :key="group.label">
        <p class="mb-3 flex items-center gap-3 text-[10px] font-display tracking-[0.25em] text-brand-grey/60 uppercase">
          {{ group.label }}
          <span class="h-px flex-1 bg-brand-grey/15" />
        </p>
        <div class="space-y-3">
          <motion.div
            v-for="(n, i) in group.items"
            :key="n.id"
            :initial="{ opacity: 0, y: 16 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: Math.min(i * 0.04, 0.3), duration: 0.35 }"
            class="group relative flex items-start gap-4 rounded-xl border p-5 transition-all duration-300"
            :class="n.read ? 'border-brand-grey/15 bg-brand-black/60' : 'border-brand-red/30 bg-gradient-to-br from-brand-red/[0.07] to-brand-black/80 hover:border-brand-red/50'"
          >
            <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-transform duration-300 group-hover:scale-110" :class="n.read ? 'border-brand-grey/25 bg-white/[0.03] text-brand-grey' : notifBadgeClass(n.type)">
              <component :is="notifIcon(n.type)" class="h-5 w-5" />
            </span>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <p class="truncate text-sm font-semibold text-white">{{ n.title }}</p>
                <Badge v-if="n.broadcast" size="sm" variant="secondary" class="shrink-0">{{ audienceLabel(n) }}</Badge>
                <span v-if="!n.read" class="h-2 w-2 shrink-0 rounded-full bg-brand-red shadow-[0_0_8px_rgba(214,0,28,0.8)]" />
              </div>
              <p v-if="n.message" class="mt-1 text-sm text-brand-grey/80">{{ n.message }}</p>
              <div class="mt-1.5 flex flex-wrap items-center gap-2">
                <span class="text-[11px] text-brand-grey/50">{{ formatDateTime(n.createdAt) }}</span>
                <span v-if="entityLabel(n)" class="rounded-full border border-brand-grey/20 px-2 py-0.5 text-[10px] text-brand-grey/70">{{ entityLabel(n) }}</span>
              </div>
            </div>
            <div class="flex shrink-0 flex-col items-end gap-2">
              <Button v-if="!n.read" size="sm" variant="ghost" class="h-11 sm:h-9" @click="markRead(n)"><Check class="h-3.5 w-3.5" />Read</Button>
              <button
                v-if="n.link"
                class="text-[10px] font-semibold text-brand-red hover:text-white transition-colors"
                @click="openLink(n)"
              >
                View details
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Bell, Check, CheckCheck } from 'lucide-vue-next'
import { useNotificationStore, type NotificationItem } from '~/stores/notifications'
import { notifMeta } from '~/utils/notificationMeta'
import { useToast } from '~/composables/useToast'
import { formatDateTime } from '~/composables/useFormat'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'Notifications - Nairobi Powerbikes' })

const store = useNotificationStore()
const toast = useToast()

function notifIcon(type: string) {
  return notifMeta(type).icon
}

function notifBadgeClass(type: string) {
  return notifMeta(type).bg
}

function audienceLabel(n: NotificationItem) {
  if (!n.broadcast) return ''
  if (n.role) return `${n.role.charAt(0).toUpperCase()}${n.role.slice(1)} Broadcast`
  return 'Announcement'
}

function entityLabel(n: NotificationItem) {
  return notifMeta(n.type).label
}

const groups = computed(() => {
  const dayStart = (ts: string) => {
    const d = new Date(ts)
    return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
  }
  const todayStart = new Date().setHours(0, 0, 0, 0)
  const yesterdayStart = todayStart - 86400000

  const buckets: Record<string, NotificationItem[]> = { Today: [], Yesterday: [], Earlier: [] }
  for (const n of store.notifications) {
    const start = dayStart(n.createdAt)
    if (start >= todayStart) buckets.Today.push(n)
    else if (start >= yesterdayStart) buckets.Yesterday.push(n)
    else buckets.Earlier.push(n)
  }
  return Object.entries(buckets)
    .filter(([, list]) => list.length)
    .map(([label, items]) => ({ label, items }))
})

function markRead(n: NotificationItem) {
  store.markRead(n.id)
}

async function markAllRead() {
  await store.markAllRead()
  toast.add({ type: 'success', title: 'All notifications marked as read' })
}

function openLink(n: NotificationItem) {
  if (n.link) navigateTo(n.link)
}

onMounted(() => {
  store.init()
})
</script>
