<template>
  <div class="relative" ref="bellRef">
    <button
      class="relative p-2 text-brand-grey hover:text-white transition-colors"
      @click="toggleDropdown"
      aria-label="Notifications"
    >
      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span
        v-if="store.unreadCount > 0"
        class="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brand-red px-1 text-[9px] font-bold text-white"
      >
        {{ store.unreadCount > 99 ? '99+' : store.unreadCount }}
      </span>
    </button>

    <Teleport to="body">
      <Transition name="notif">
        <div
          v-if="open"
          class="fixed right-4 top-16 z-[150] w-80 rounded-xl border border-brand-grey/20 bg-brand-black/95 shadow-2xl shadow-black/50 backdrop-blur-md"
          @click.self
        >
          <div class="flex items-center justify-between border-b border-brand-grey/10 px-4 py-3">
            <h3 class="text-sm font-semibold text-white">Notifications</h3>
            <div class="flex gap-2">
              <button v-if="store.unreadCount > 0" class="text-xs text-brand-grey hover:text-white transition-colors" @click="markAllRead()">Mark all read</button>
              <button v-if="store.notifications.length > 0" class="text-xs text-brand-red/70 hover:text-brand-red transition-colors" @click="clearAll()">Clear all</button>
            </div>
          </div>

          <div class="max-h-80 overflow-y-auto">
            <div v-if="store.notifications.length === 0" class="px-4 py-8 text-center text-sm text-brand-grey">No notifications yet</div>
            <div
              v-for="n in store.notifications"
              :key="n.id"
              class="group flex items-start gap-3 border-b border-brand-grey/5 px-4 py-3 transition-colors hover:bg-white/5"
              :class="{ 'bg-white/3': !n.read }"
            >
              <span class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full" :class="typeBg(n.type)">
                <component :is="typeIcon(n.type)" class="h-3.5 w-3.5" :class="typeColor(n.type)" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-sm font-medium text-brand-red truncate">{{ n.title }}</p>
                  <button
                    v-if="!n.read"
                    class="shrink-0 text-[10px] text-brand-red/60 hover:text-brand-red transition-colors"
                    @click="markRead(n.id)"
                  >Mark read</button>
                </div>
                <p class="mt-0.5 text-xs text-white line-clamp-2">{{ n.message }}</p>
                <p class="mt-1 text-[10px] text-brand-grey/40">{{ timeAgo(n.createdAt) }}</p>
              </div>
              <button
                class="-mr-1 -mt-1 shrink-0 opacity-0 group-hover:opacity-100 text-brand-grey/40 hover:text-white transition-all"
                @click="removeNotification(n.id)"
                aria-label="Delete notification"
              >
                <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore, type NotificationItem } from '~/stores/notifications'
import { useToast } from '~/composables/useToast'
import { useAuthStore } from '~/stores/auth'
import {
  CalendarCheck, Bike, MessageSquare, Newspaper, Users, Shield, Settings, Image, LogIn, Bell,
} from 'lucide-vue-next'

const store = useNotificationStore()
const toast = useToast()
const open = ref(false)
const bellRef = ref<HTMLElement | null>(null)

function toggleDropdown() { open.value = !open.value }

function handleClickOutside(e: MouseEvent) {
  if (bellRef.value && !bellRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  store.loadFromStorage()
  fetchNotifications()
  subscribeToRealtime()
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  try {
    pb.collection('notifications').unsubscribe('*')
  } catch { /* ignore */ }
})

function markAllRead() {
  store.markAllRead()
  try {
    const pbIds = store.notifications.map(n => n.id.replace(/^notif-/, ''))
    pbIds.forEach(id => pb.collection('notifications').update(id, { read: true }))
  } catch { /* ignore */ }
}

function clearAll() {
  store.clearAll()
  try {
    pb.collection('notifications').getList(1, 200, { sort: '-created' }).then((res) => {
      res.items.forEach(r => pb.collection('notifications').delete(r.id))
    })
  } catch { /* ignore */ }
}

function typeIcon(type: string) {
  const icons: Record<string, object> = {
    booking: CalendarCheck, service: CalendarCheck, test_ride: Bike, testimonial: MessageSquare,
    motorcycle: Bike, user: Users, staff: Shield, system: Settings,
    media: Image, auth: LogIn, general: Bell, contact: MessageSquare, offer: Bell, message: Bell,
  }
  return icons[type] || Bell
}

function typeBg(type: string) {
  const map: Record<string, string> = {
    booking: 'bg-blue-500/15', service: 'bg-blue-500/15', test_ride: 'bg-blue-500/15', testimonial: 'bg-green-500/15',
    motorcycle: 'bg-amber-500/15', user: 'bg-purple-500/15', staff: 'bg-purple-500/15',
    system: 'bg-brand-grey/15', media: 'bg-pink-500/15', auth: 'bg-brand-grey/15', general: 'bg-brand-grey/15',
    contact: 'bg-green-500/15', offer: 'bg-amber-500/15', message: 'bg-brand-grey/15',
  }
  return map[type] || 'bg-brand-grey/15'
}

function typeColor(type: string) {
  const map: Record<string, string> = {
    booking: 'text-blue-400', service: 'text-blue-400', test_ride: 'text-blue-400', testimonial: 'text-green-400',
    motorcycle: 'text-amber-400', user: 'text-purple-400', staff: 'text-purple-400',
    system: 'text-brand-grey/60', media: 'text-pink-400', auth: 'text-brand-grey/60', general: 'text-brand-grey/60',
    contact: 'text-green-400', offer: 'text-amber-400', message: 'text-brand-grey/60',
  }
  return map[type] || 'text-brand-grey/60'
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })
}

function markRead(id: string) {
  store.markRead(id)
  try {
    const pbId = id.replace(/^notif-/, '')
    pb.collection('notifications').update(pbId, { read: true })
  } catch { /* ignore */ }
}

function removeNotification(id: string) {
  store.remove(id)
  try {
    const pbId = id.replace(/^notif-/, '')
    pb.collection('notifications').delete(pbId)
  } catch { /* ignore */ }
}

const pb = usePB()
const auth = useAuthStore()

async function fetchNotifications() {
  try {
    const records = await pb.collection('notifications').getList(1, 50, { sort: '-created' })
    const existingIds = new Set(store.notifications.map(n => n.id))
    const items: NotificationItem[] = []
    for (const r of records.items) {
      const id = `notif-${r.id}`
      if (!existingIds.has(id)) {
        items.push({
          id,
          type: (r.type as NotificationItem['type']) || 'general',
          title: r.title || '',
          message: r.message || '',
          link: r.link || '',
          read: r.read || false,
          createdAt: r.created,
          broadcast: r.broadcast || false,
        })
      }
    }
    if (items.length > 0) {
      store.set([...items, ...store.notifications])
    }
  } catch { /* fail silently — PB collection may not exist yet */ }
}

function isVisibleForUser(r: any) {
  if (auth.user?.role === 'admin') return true
  return r?.user === auth.user?.id || r?.broadcast === true
}

function subscribeToRealtime() {
  if (!pb) return
  try {
    const filter = auth.user?.role === 'admin' ? undefined : pb.filter('user = {:uid} || broadcast = true', { uid: auth.user?.id })
    pb.collection('notifications').subscribe('*', (e) => {
      if (!isVisibleForUser(e.record)) return
      if (e.action === 'create') {
        store.addFromPB({
          id: e.record.id,
          type: e.record.type,
          title: e.record.title,
          message: e.record.message,
          link: e.record.link || '',
          read: false,
          created: e.record.created,
          broadcast: e.record.broadcast,
        })
        toast.add({ type: 'info', title: e.record.title, message: e.record.message })
      } else if (e.action === 'update') {
        const existing = store.notifications.find(n => n.id === `notif-${e.record.id}`)
        if (existing) {
          existing.read = e.record.read
          existing.title = e.record.title || existing.title
          existing.message = e.record.message || existing.message
          existing.link = e.record.link || existing.link
        }
      } else if (e.action === 'delete') {
        store.remove(`notif-${e.record.id}`)
      }
    }, filter ? { filter } : undefined)
  } catch { /* realtime not available */ }
}
</script>

<style scoped>
.notif-enter-active { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.notif-leave-active { transition: all 0.15s ease-in; }
.notif-enter-from { opacity: 0; transform: translateY(-8px) scale(0.96); }
.notif-leave-to { opacity: 0; transform: translateY(-4px) scale(0.98); }
</style>
