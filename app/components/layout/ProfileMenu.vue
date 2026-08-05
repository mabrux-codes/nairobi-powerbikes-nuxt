<template>
  <div class="relative" ref="wrapRef">
    <button
      class="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] transition-all hover:border-brand-red/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
      :aria-label="`Account menu for ${auth.user?.name || auth.user?.email}`"
      aria-haspopup="true"
      :aria-expanded="open"
      @click="open = !open"
    >
      <img v-if="avatarUrl" :src="avatarUrl" alt="" class="h-full w-full object-cover" />
      <span v-else class="text-xs font-bold text-white">{{ initials }}</span>
    </button>

    <Transition name="pop">
      <div
        v-if="open"
        class="absolute right-0 top-[calc(100%+12px)] z-[60] w-64 overflow-hidden rounded-2xl border border-white/10 bg-brand-black/95 shadow-2xl shadow-black/70 backdrop-blur-2xl"
        role="menu"
        :aria-label="`Account menu`"
      >
        <!-- user summary -->
        <div class="border-b border-white/[0.06] px-4 py-4">
          <p class="truncate text-sm font-bold text-white">{{ auth.user?.name || 'Rider' }}</p>
          <p class="mt-0.5 truncate text-xs text-brand-grey">{{ auth.user?.email }}</p>
          <span class="mt-2 inline-flex items-center gap-1.5 rounded-full border border-brand-red/30 bg-brand-red/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-brand-red uppercase">
            <span class="h-1.5 w-1.5 rounded-full bg-brand-red" />
            {{ auth.userRole === 'admin' ? 'Administrator' : 'Customer' }}
          </span>
        </div>

        <div class="py-2">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.label"
            :to="item.to"
            class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-brand-light/85 transition-colors hover:bg-white/[0.05] hover:text-brand-red"
            role="menuitem"
            @click="open = false"
          >
            <component :is="item.icon" class="h-4 w-4 shrink-0 text-brand-grey transition-colors" />
            {{ item.label }}
          </NuxtLink>
        </div>

        <div class="border-t border-white/[0.06] p-2">
          <button
            class="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-semibold text-brand-red/90 transition-colors hover:bg-brand-red/10 hover:text-brand-red"
            role="menuitem"
            @click="handleLogout"
          >
            <LogOut class="h-4 w-4" />Sign Out
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { LayoutDashboard, User, Heart, Bell, MessageSquare, Settings, LogOut, ClipboardList } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { usePB } from '~/composables/usePocketBase'

const auth = useAuthStore()
const pb = usePB()
const open = ref(false)
const wrapRef = ref<HTMLElement | null>(null)

const avatarUrl = computed(() => {
  const u = auth.user as any
  if (!u?.avatar) return ''
  try { return pb.files.getURL(u, u.avatar, { thumb: '96x96' }) } catch { return '' }
})

const initials = computed(() => {
  const name = auth.user?.name?.trim() || auth.user?.email || 'R'
  const parts = name.split(/[\s@.]+/).filter(Boolean)
  return parts.slice(0, 2).map(p => p[0]?.toUpperCase()).join('') || 'R'
})

const menuItems = computed(() => {
  if (auth.userRole === 'admin') {
    return [
      { label: 'Admin Dashboard', to: '/dashboard', icon: LayoutDashboard },
      { label: 'Manage Bookings', to: '/dashboard/bookings', icon: ClipboardList },
      { label: 'Notifications', to: '/dashboard/notifications', icon: Bell },
      { label: 'Settings', to: '/dashboard/settings', icon: Settings },
    ]
  }
  return [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Profile', to: '/dashboard/profile', icon: User },
    { label: 'Wishlist', to: '/dashboard/my-wishlist', icon: Heart },
    { label: 'Notifications', to: '/dashboard/my-notifications', icon: Bell },
    { label: 'Messages', to: '/dashboard/my-messages', icon: MessageSquare },
    { label: 'Settings', to: '/dashboard/my-settings', icon: Settings },
  ]
})

function handleClickOutside(e: MouseEvent) {
  if (wrapRef.value && !wrapRef.value.contains(e.target as Node)) open.value = false
}
function handleKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleKey)
})
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleKey)
})

async function handleLogout() {
  open.value = false
  try { await pb.collection('notifications').unsubscribe('*') } catch { /* ignore */ }
  try { pb.authStore.clear() } catch { /* ignore */ }
  try { pb.realtime.disconnect() } catch { /* ignore */ }
  auth.clear()
  localStorage.removeItem('pb_auth')
  navigateTo('/')
}
</script>

<style scoped>
.pop-enter-active, .pop-leave-active { transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.34, 1.4, 0.64, 1); transform-origin: top right; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: translateY(-6px) scale(0.97); }
</style>