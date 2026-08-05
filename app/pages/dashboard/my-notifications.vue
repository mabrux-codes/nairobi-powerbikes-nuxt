<template>
  <div class="mx-auto max-w-4xl">
    <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Notifications</span></h1>
        <div class="mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-3 text-sm text-brand-grey">Updates on your bookings, test rides and more from the team.</p>
      </div>
      <Button v-if="unreadCount > 0" variant="ghost" size="sm" @click="markAllRead">
        <CheckCheck class="h-4 w-4" />Mark All as Read
      </Button>
    </div>

    <div v-if="loading" class="space-y-4">
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
                <Badge v-if="n.broadcast" size="sm" variant="secondary" class="shrink-0">Broadcast</Badge>
                <span v-if="!n.read" class="h-2 w-2 shrink-0 rounded-full bg-brand-red shadow-[0_0_8px_rgba(214,0,28,0.8)]" />
              </div>
              <p v-if="n.message" class="mt-1 text-sm text-brand-grey/80">{{ n.message }}</p>
              <p class="mt-1.5 text-[11px] text-brand-grey/50">{{ formatDateTime(n.created) }}</p>
            </div>
            <div class="flex shrink-0 flex-col items-end gap-2">
              <Button v-if="!n.read" size="sm" variant="ghost" @click="markRead(n)"><Check class="h-3.5 w-3.5" />Read</Button>
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
import { Bell, Check, CheckCheck, Wrench, Bike, Star, Send, ClipboardCheck, Shield, Megaphone, Newspaper, User, Info } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import { formatDateTime } from '~/composables/useFormat'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'Notifications - Nairobi Powerbikes' })

const pb = usePB()
const auth = useAuthStore()
const toast = useToast()
const loading = ref(true)
const items = ref<any[]>([])

const unreadCount = computed(() => items.value.filter(n => !n.read).length)

function notifIcon(type: string) {
  const map: Record<string, any> = {
    booking: ClipboardCheck, service: Wrench, test_ride: Bike,
    offer: Star, testimonial: Star, message: Send, contact: Send,
    media: Newspaper, system: Info, user: User, staff: User, auth: Shield,
    motorcycle: Bike, general: Info,
  }
  return map[type] || Bell
}

function notifBadgeClass(type: string) {
  const map: Record<string, string> = {
    booking: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    service: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
    test_ride: 'border-sky-500/40 bg-sky-500/10 text-sky-400',
    offer: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
    message: 'border-violet-500/40 bg-violet-500/10 text-violet-400',
  }
  return map[type] || 'border-brand-red/40 bg-brand-red/10 text-brand-red'
}

const groups = computed(() => {
  const day = (ts: string) => {
    const d = new Date(ts)
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
    const today = new Date().setHours(0, 0, 0, 0)
    const diff = (today - start) / 86400000
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    if (diff < 7) return d.toLocaleDateString('en-GB', { weekday: 'long' })
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const grouped: Record<string, any[]> = {}
  for (const n of items.value) {
    const label = day(n.created)
    if (!grouped[label]) grouped[label] = []
    grouped[label].push(n)
  }
  return Object.entries(grouped).map(([label, list]) => ({ label, items: list }))
})

function markRead(n: any) {
  if (n.read) return
  pb.collection('notifications').update(n.id, { read: true }).catch(() => {})
  n.read = true
}

async function markAllRead() {
  const unread = items.value.filter(n => !n.read)
  await Promise.allSettled(unread.map(n => pb.collection('notifications').update(n.id, { read: true })))
  items.value = items.value.map(n => ({ ...n, read: true }))
  toast.add({ type: 'success', title: 'All notifications marked as read' })
}

function openLink(n: any) {
  if (n.link) navigateTo(n.link)
}

function handleRealtime(e: any) {
  const record = e.record as any
  const uid = auth.user?.id
  const mine = record.user === uid || record.broadcast
  if (!mine) return
  if (e.action === 'delete') {
    items.value = items.value.filter(n => n.id !== record.id)
  } else {
    const idx = items.value.findIndex(n => n.id === record.id)
    if (idx >= 0) {
      items.value[idx] = { ...items.value[idx], ...record }
      items.value = [...items.value]
    } else {
      items.value = [record, ...items.value]
    }
  }
}

onMounted(async () => {
  try {
    const res = await pb.collection('notifications').getList(1, 50, {
      filter: pb.filter('user = {:uid} || broadcast = true', { uid: auth.user?.id }),
      sort: '-created',
    })
    items.value = res.items as any[]
    if (auth.user?.id) {
      pb.collection('notifications').subscribe('*', handleRealtime)
    }
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})

onUnmounted(() => {
  pb.collection('notifications').unsubscribe('*')
})
</script>
