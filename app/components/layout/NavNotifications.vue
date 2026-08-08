<template>
  <div class="relative" ref="wrapRef">
    <button
      class="relative flex h-10 w-10 items-center justify-center rounded-full text-brand-light/85 transition-colors hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
      :aria-label="`Notifications${store.unreadCount ? `, ${store.unreadCount} unread` : ''}`"
      aria-haspopup="true"
      :aria-expanded="open"
      @click="open = !open"
    >
      <Bell class="h-5 w-5" />
      <Transition name="badge">
        <span
          v-if="store.unreadCount > 0"
          key="badge"
          class="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-red px-1 text-[9px] font-bold text-white shadow-lg shadow-brand-red/40"
        >
          {{ store.unreadCount > 99 ? '99+' : store.unreadCount }}
        </span>
      </Transition>
    </button>

    <Transition name="pop">
      <div
        v-if="open"
        class="absolute right-0 top-[calc(100%+12px)] z-[60] w-80 overflow-hidden rounded-2xl border border-white/10 bg-brand-black/95 shadow-2xl shadow-black/70 backdrop-blur-2xl"
        role="menu"
        aria-label="Notifications menu"
      >
        <div class="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
          <p class="text-sm font-semibold text-white">Notifications</p>
          <div class="flex items-center gap-3">
            <button
              v-if="store.unreadCount > 0"
              class="text-[11px] font-semibold text-brand-grey transition-colors hover:text-brand-red"
              @click="markAllRead"
            >Mark all read</button>
            <NuxtLink
              :to="notificationsRoute"
              class="flex items-center gap-1 text-[11px] font-semibold text-brand-red transition-colors hover:text-white"
              @click="open = false"
            >View all <ChevronRight class="h-3 w-3" /></NuxtLink>
          </div>
        </div>

        <div class="max-h-[320px] overflow-y-auto">
          <div v-if="store.notifications.length === 0" class="px-4 py-10 text-center">
            <BellOff class="mx-auto h-8 w-8 text-brand-grey/40" />
            <p class="mt-3 text-sm text-brand-grey">No notifications yet</p>
          </div>
          <div
            v-for="n in store.notifications.slice(0, 8)"
            :key="n.id"
            class="group flex cursor-pointer items-start gap-3 border-b border-white/[0.04] px-4 py-3 transition-colors last:border-0 hover:bg-white/[0.04]"
            :class="{ 'bg-white/[0.03]': !n.read }"
            role="menuitem"
            tabindex="0"
            @click="openNotification(n)"
            @keydown.enter="openNotification(n)"
          >
            <span class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full" :class="typeBg(n.type)">
              <component :is="typeIcon(n.type)" class="h-3.5 w-3.5" :class="typeColor(n.type)" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-[13px] font-semibold text-white">{{ n.title }}</span>
              <span class="mt-0.5 block truncate text-xs text-brand-grey">{{ n.message || '—' }}</span>
              <span class="mt-1 block text-[10px] text-brand-grey/50">{{ timeAgo(n.createdAt) }}</span>
            </span>
            <span v-if="!n.read" class="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-red shadow-[0_0_8px_rgba(214,0,28,0.8)]" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { Bell, BellOff, ChevronRight, CalendarCheck, Bike, MessageSquare, Users, Shield, Settings, Image, LogIn, Newspaper } from 'lucide-vue-next'
import { useNotificationStore, type NotificationItem } from '~/stores/notifications'
import { useAuthStore } from '~/stores/auth'

const store = useNotificationStore()
const auth = useAuthStore()

const open = ref(false)
const wrapRef = ref<HTMLElement | null>(null)

const notificationsRoute = computed(() => (auth.userRole === 'admin' ? '/dashboard/notifications' : '/dashboard/my-notifications'))

function toggle() { open.value = !open.value }

function handleClickOutside(e: MouseEvent) {
  if (wrapRef.value && !wrapRef.value.contains(e.target as Node)) open.value = false
}
function handleKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleKey)
  store.init()
})
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleKey)
})

function markAllRead() {
  store.markAllRead()
}

function openNotification(n: NotificationItem) {
  if (!n.read) store.markRead(n.id)
  open.value = false
  if (n.link) navigateTo(n.link)
}

function typeIcon(type: string) {
  const icons: Record<string, object> = {
    booking: CalendarCheck, service: CalendarCheck, test_ride: Bike, testimonial: MessageSquare,
    motorcycle: Bike, user: Users, staff: Shield, system: Settings,
    media: Image, auth: LogIn, general: Bell, contact: MessageSquare, offer: Bell, message: MessageSquare,
  }
  return icons[type] || Bell
}

function typeBg(type: string) {
  const map: Record<string, string> = {
    booking: 'bg-blue-500/15', service: 'bg-blue-500/15', test_ride: 'bg-blue-500/15', testimonial: 'bg-green-500/15',
    motorcycle: 'bg-amber-500/15', user: 'bg-purple-500/15', staff: 'bg-purple-500/15',
    system: 'bg-white/[0.06]', media: 'bg-pink-500/15', auth: 'bg-white/[0.06]', general: 'bg-white/[0.06]',
    contact: 'bg-green-500/15', offer: 'bg-amber-500/15', message: 'bg-white/[0.06]',
  }
  return map[type] || 'bg-white/[0.06]'
}

function typeColor(type: string) {
  const map: Record<string, string> = {
    booking: 'text-blue-400', service: 'text-blue-400', test_ride: 'text-blue-400', testimonial: 'text-green-400',
    motorcycle: 'text-amber-400', user: 'text-purple-400', staff: 'text-purple-400',
    system: 'text-brand-grey', media: 'text-pink-400', auth: 'text-brand-grey', general: 'text-brand-grey',
    contact: 'text-green-400', offer: 'text-amber-400', message: 'text-brand-grey',
  }
  return map[type] || 'text-brand-grey'
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
</script>

<style scoped>
.pop-enter-active, .pop-leave-active { transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.34, 1.4, 0.64, 1); transform-origin: top right; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateY(-6px) scale(0.97); }
.badge-enter-active, .badge-leave-active { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s; }
.badge-enter-from { transform: scale(0.4); opacity: 0; }
.badge-leave-to { transform: scale(0.4); opacity: 0; }
</style>