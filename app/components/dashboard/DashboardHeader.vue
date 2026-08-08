<template>
  <header ref="headerEl" class="safe-top h-16 lg:h-[4.5rem] bg-brand-black/70 backdrop-blur-xl border-b border-brand-grey/15 flex items-center justify-between px-4 lg:px-8 shrink-0 sticky top-0 z-50">
    <div class="flex items-center gap-2 lg:gap-3 min-w-0">
      <button
        class="lg:hidden p-2.5 text-brand-grey hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
        @click="$emit('toggle-sidebar')"
        aria-label="Toggle sidebar"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <button
        class="hidden lg:flex p-2.5 text-brand-grey hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
        @click="$emit('toggle-collapse')"
        aria-label="Collapse sidebar"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path v-if="!collapsed" stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5-5 5M6 7l5 5-5 5" />
        </svg>
      </button>

      <NuxtLink to="/" class="flex items-center lg:hidden">
        <img src="/NPB Logo.png" alt="Nairobi Powerbikes" class="h-9 w-auto" />
      </NuxtLink>

      <div v-if="isAdmin" class="hidden xl:flex items-center gap-1.5 px-2.5 h-9 text-[10px] font-display tracking-[0.25em] uppercase text-brand-grey/70 border border-brand-grey/15 rounded-xl bg-white/[0.02]">
        <span class="h-1.5 w-1.5 rounded-full bg-brand-red animate-pulse" />
        Control Center
      </div>
    </div>

    <div class="flex items-center gap-2 lg:gap-3">
      <div class="relative hidden md:block" ref="searchRef">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-grey/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search bikes, gear, bookings…"
          class="w-44 xl:w-64 h-9 pl-9 pr-8 text-sm text-white bg-white/[0.04] border border-brand-grey/15 rounded-xl placeholder:text-brand-grey/50 focus:outline-none focus:border-brand-red/60 focus:ring-2 focus:ring-brand-red/20 transition-all duration-200"
          @focus="onSearchFocus"
          @keydown.enter="goSearch"
          @keydown.esc="searchOpen = false"
        />
        <button v-if="searchQuery" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-grey/60 hover:text-white transition-colors" @click="searchQuery = ''" aria-label="Clear search">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-2 scale-95"
        >
          <div
            v-if="searchOpen"
            class="absolute right-0 top-full mt-2 w-80 lg:w-96 bg-brand-black/95 backdrop-blur-xl border border-brand-grey/20 rounded-xl shadow-2xl shadow-black/50 z-50 py-2 overflow-hidden"
          >
            <div v-if="searchLoading" class="px-4 py-6 text-center text-sm text-brand-grey/60">
              <span class="inline-block h-4 w-4 border-2 border-brand-grey/40 border-t-brand-red rounded-full animate-spin align-middle" />
              Searching…
            </div>
            <template v-else-if="searchResults.length > 0">
              <p class="px-4 pb-1.5 text-[10px] font-display tracking-[0.25em] text-brand-grey/60 uppercase">{{ searchResults.length }} result{{ searchResults.length > 1 ? 's' : '' }}</p>
              <button
                v-for="item in searchResults"
                :key="item.collection + item.id"
                class="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 transition-colors"
                @click="goToResult(item)"
              >
                <div class="w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-brand-grey/15 flex items-center justify-center bg-brand-red/10">
                  <img v-if="item.image" :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                  <svg v-else class="w-4 h-4 text-brand-red" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm text-white truncate">{{ item.name }}</p>
                  <p class="text-[11px] text-brand-grey/70 truncate">{{ item.subtitle }}</p>
                </div>
                <span class="text-[10px] font-display tracking-[0.15em] uppercase text-brand-grey/60 shrink-0">{{ item.collection }}</span>
              </button>
              <div class="border-t border-brand-grey/10 mt-1" />
              <button
                class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-brand-red hover:bg-white/5 transition-colors"
                @click="goSearch"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5-5 5M6 12h12" /></svg>
                Open "{{ searchQuery }}" in management
              </button>
            </template>
            <div v-else class="px-4 py-6 text-center">
              <p class="text-sm text-brand-grey/80">No matches for “{{ searchQuery }}”</p>
              <p class="text-xs text-brand-grey/50 mt-1">Try a bike name, brand, gear or booking.</p>
            </div>
          </div>
        </transition>
      </div>

      <NuxtLink
        to="/"
        class="hidden 2xl:flex items-center gap-2 px-3.5 h-9 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-brand-grey/20 transition-all duration-200"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        Visit Website
      </NuxtLink>

      <NuxtLink
        v-if="isAdmin"
        to="/dashboard/messages"
        class="relative p-3 text-brand-grey hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-brand-grey/20 transition-all duration-200"
        aria-label="Messages"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span
          v-if="unreadMessages > 0"
          class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-red text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(214,0,28,0.7)]"
        >
          {{ unreadMessages > 9 ? '9+' : unreadMessages }}
        </span>
      </NuxtLink>

      <RealtimeStatus v-if="isAdmin" />

      <div v-if="isAdmin" class="relative" ref="availRef">
        <button
          class="hidden lg:flex items-center gap-1.5 px-3 h-9 text-xs font-semibold rounded-xl border transition-all duration-200"
          :class="availClass"
          :aria-label="`Availability: ${availLabel}. Click to change.`"
          @click="availOpen = !availOpen"
        >
          <span class="h-1.5 w-1.5 rounded-full" :class="availDotClass" />
          {{ availLabel }}
          <svg class="w-3 h-3 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" /></svg>
        </button>

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-2 scale-95"
        >
          <div
            v-if="availOpen"
            class="absolute right-0 top-full mt-2 w-44 bg-brand-black/95 backdrop-blur-xl border border-brand-grey/20 rounded-xl shadow-2xl shadow-black/50 z-50 py-1.5 overflow-hidden"
            role="menu"
          >
            <p class="px-4 pt-2 pb-1.5 text-[10px] font-display tracking-[0.25em] text-brand-grey/60 uppercase">Availability</p>
            <button
              v-for="opt in availOptions"
              :key="opt.value"
              role="menuitem"
              class="w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors"
              :class="currentAvail === opt.value ? 'text-white bg-white/5' : 'text-brand-grey hover:text-white hover:bg-white/5'"
              @click="setAvail(opt.value)"
            >
              <span class="h-2 w-2 rounded-full" :class="opt.dot" />
              {{ opt.label }}
              <Check v-if="currentAvail === opt.value" class="h-4 w-4 ml-auto text-brand-red" />
            </button>
          </div>
        </transition>
      </div>

      <NotificationBell />

      <div v-if="isAdmin" class="relative" ref="actionsRef">
        <button
          class="hidden 2xl:flex items-center gap-2 px-3.5 h-9 text-xs font-semibold text-white bg-brand-red hover:bg-brand-red/90 rounded-xl shadow-lg shadow-brand-red/25 transition-all duration-200"
          @click="actionsOpen = !actionsOpen"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
          Quick Actions
        </button>

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-2 scale-95"
        >
          <div
            v-if="actionsOpen"
            class="absolute right-0 top-full mt-2 w-72 bg-brand-black/95 backdrop-blur-xl border border-brand-grey/20 rounded-xl shadow-2xl shadow-black/50 z-50 py-1.5 overflow-hidden"
          >
            <p class="px-4 pt-2 pb-1.5 text-[10px] font-display tracking-[0.25em] text-brand-grey/60 uppercase">Quick Actions</p>
            <NuxtLink
              v-for="action in quickActions"
              :key="action.to"
              :to="action.to"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brand-grey hover:text-white hover:bg-white/5 transition-colors"
              @click="actionsOpen = false"
            >
              <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="action.iconClass">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" :d="action.icon" /></svg>
              </span>
              <span class="min-w-0">
                <span class="block truncate">{{ action.label }}</span>
                <span class="block text-[11px] text-brand-grey/60 truncate">{{ action.hint }}</span>
              </span>
            </NuxtLink>
            <div class="border-t border-brand-grey/10 my-1" />
            <NuxtLink
              to="/dashboard/notifications"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-brand-grey hover:text-white hover:bg-white/5 transition-colors"
              @click="actionsOpen = false"
            >
              <span class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-amber-500/10 text-amber-400">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              </span>
              <span class="min-w-0">
                <span class="block truncate">Broadcast Notification</span>
                <span class="block text-[11px] text-brand-grey/60 truncate">Message all customers at once</span>
              </span>
            </NuxtLink>
          </div>
        </transition>
      </div>

      <div class="relative" ref="dropdownRef">
        <button
          class="flex items-center gap-2.5 p-1.5 text-brand-grey hover:text-white rounded-xl hover:bg-white/5 border border-transparent hover:border-brand-grey/20 transition-all duration-200"
          @click="dropdownOpen = !dropdownOpen"
          aria-label="Account menu"
        >
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 flex items-center justify-center text-xs font-bold text-white ring-1 ring-brand-red/30 overflow-hidden">
            <img v-if="avatarUrl" :src="avatarUrl" :alt="user?.name || 'avatar'" class="w-full h-full object-cover" />
            <span v-else>{{ initials }}</span>
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-sm font-medium leading-tight">{{ user?.name || user?.email }}</p>
            <p class="text-[10px] font-display tracking-[0.2em] text-brand-grey/60 uppercase">{{ user?.role || '' }}</p>
          </div>
          <svg class="w-4 h-4 hidden sm:block transition-transform duration-200" :class="dropdownOpen ? 'rotate-180' : ''" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2 scale-95"
          enter-to-class="opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0 scale-100"
          leave-to-class="opacity-0 -translate-y-2 scale-95"
        >
          <div
            v-if="dropdownOpen"
            class="absolute right-0 top-full mt-2 w-60 bg-brand-black/95 backdrop-blur-xl border border-brand-grey/20 rounded-xl shadow-2xl shadow-black/50 z-50 py-1.5 overflow-hidden"
          >
            <div class="px-4 py-3 border-b border-brand-grey/10 mb-1">
              <p class="text-sm font-medium text-white truncate">{{ user?.name || user?.email }}</p>
              <p class="text-xs text-brand-grey mt-0.5 truncate">{{ user?.email }}</p>
            </div>
            <NuxtLink
              v-if="user?.role === 'customer'"
              to="/dashboard/profile"
              class="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-brand-grey hover:text-white hover:bg-white/5 transition-colors"
              @click="dropdownOpen = false"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              My Profile
            </NuxtLink>
            <NuxtLink
              :to="user?.role === 'admin' ? '/dashboard/settings' : '/dashboard/my-settings'"
              class="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-brand-grey hover:text-white hover:bg-white/5 transition-colors"
              @click="dropdownOpen = false"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Settings
            </NuxtLink>
            <div class="border-t border-brand-grey/10 my-1" />
            <button
              class="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:text-white hover:bg-brand-red/15 transition-colors"
              @click="handleSignOut"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'
import { useAdminDataStore } from '~/stores/adminData'
import { useChatStore } from '~/stores/chat'
import { Check } from 'lucide-vue-next'

const store = useAdminDataStore()
const chatStore = useChatStore()
const auth = useAuthStore()
const { logout } = useAuth()
const pb = usePB()
const router = useRouter()

const availOptions = [
  { value: 'online', label: 'Online', dot: 'bg-emerald-400' },
  { value: 'away', label: 'Away', dot: 'bg-amber-400' },
  { value: 'offline', label: 'Offline', dot: 'bg-brand-grey/60' },
]

const availRef = ref<HTMLElement | null>(null)
const availOpen = ref(false)

const currentAvail = computed(() => {
  const a = auth.user?.availability
  return availOptions.some(o => o.value === a) ? a : 'online'
})

const availLabel = computed(() => {
  const map: Record<string, string> = { online: 'Online', away: 'Away', offline: 'Offline' }
  return map[currentAvail.value] || 'Online'
})

const availDotClass = computed(() => {
  const map: Record<string, string> = { online: 'bg-emerald-400', away: 'bg-amber-400', offline: 'bg-brand-grey/60' }
  return map[currentAvail.value] || 'bg-emerald-400'
})

const availClass = computed(() => {
  const map: Record<string, string> = {
    online: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400',
    away: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
    offline: 'border-brand-grey/20 bg-white/[0.03] text-brand-grey',
  }
  return map[currentAvail.value] || 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
})

async function setAvail(value: string) {
  availOpen.value = false
  try {
    await chatStore.setMyAvailability(value as any)
  } catch { /* ignore */ }
}

defineProps<{ collapsed?: boolean }>()
defineEmits<{ 'toggle-sidebar': []; 'toggle-collapse': [] }>()

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const actionsOpen = ref(false)
const actionsRef = ref<HTMLElement | null>(null)
const searchRef = ref<HTMLElement | null>(null)
const headerEl = ref<HTMLElement | null>(null)

function syncAdminH() {
  if (headerEl.value) document.documentElement.style.setProperty('--admin-h', `${headerEl.value.offsetHeight}px`)
}
let adminResizeObs: ResizeObserver | null = null

const user = computed(() => auth.user)
const isAdmin = computed(() => user.value?.role === 'admin')

const avatarUrl = computed(() => {
  const a = user.value?.avatar
  if (!a) return null
  return typeof a === 'string' && a.startsWith('http') ? a : pb?.files?.getUrl(user.value, a)
})

const initials = computed(() => {
  if (!user.value) return '?'
  const name = user.value.name || user.value.email
  return name.slice(0, 2).toUpperCase()
})

function handleClickOutside(e: MouseEvent) {
  const node = e.target as Node
  if (dropdownRef.value && !dropdownRef.value.contains(node)) dropdownOpen.value = false
  if (actionsRef.value && !actionsRef.value.contains(node)) actionsOpen.value = false
  if (searchRef.value && !searchRef.value.contains(node)) searchOpen.value = false
  if (availRef.value && !availRef.value.contains(node)) availOpen.value = false
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  syncAdminH()
  adminResizeObs = new ResizeObserver(syncAdminH)
  if (headerEl.value) adminResizeObs.observe(headerEl.value)
  window.addEventListener('resize', syncAdminH)
  if (isAdmin.value) store.ensureActive()
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  adminResizeObs?.disconnect()
  adminResizeObs = null
  window.removeEventListener('resize', syncAdminH)
})

async function handleSignOut() {
  dropdownOpen.value = false
  await logout()
}

const unreadMessages = computed(() => (isAdmin.value ? store.unreadContacts : 0))

const quickActions = [
  {
    label: 'Add Motorcycle',
    hint: 'New bike to inventory',
    to: '/dashboard/motorcycles?create=1',
    iconClass: 'bg-brand-red/15 text-brand-red',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
  },
  {
    label: 'Add Accessory',
    hint: 'New gear to shop',
    to: '/dashboard/accessories?create=1',
    iconClass: 'bg-brand-red/15 text-brand-red',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    label: 'Add Apparel',
    hint: 'New clothing line',
    to: '/dashboard/apparel?create=1',
    iconClass: 'bg-brand-red/15 text-brand-red',
    icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
  },
]

const searchQuery = ref('')
const searchOpen = ref(false)
const searchLoading = ref(false)
const searchResults = ref<{ collection: string; id: string; name: string; subtitle: string; image?: string; to: string }[]>([])
let searchTimer: ReturnType<typeof setTimeout> | null = null

function onSearchFocus() {
  if (searchQuery.value) runSearch()
}

watch(searchQuery, () => {
  if (searchTimer) clearTimeout(searchTimer)
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    searchOpen.value = false
    return
  }
  searchOpen.value = true
  searchTimer = setTimeout(runSearch, 250)
})

async function runSearch() {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return
  searchLoading.value = true
  searchResults.value = []
  try {
    const queries = [
      pb.collection('motorcycles').getList(1, 4, { sort: '-created', $autoCancel: false, requestKey: 'head-search-mc' }).catch(() => null),
      pb.collection('accessories').getList(1, 3, { sort: '-created', $autoCancel: false, requestKey: 'head-search-ac' }).catch(() => null),
      pb.collection('apparel').getList(1, 3, { sort: '-created', $autoCancel: false, requestKey: 'head-search-ap' }).catch(() => null),
    ]
    const [mc, ac, ap] = await Promise.all(queries)
    const push = (items: any[], collection: string, to: (id: string) => string, subtitle: (it: any) => string) => {
      for (const it of items || []) {
        const hay = [it.name, it.brand, it.category, it.type, it.slug, it.engine].filter(Boolean).join(' ').toLowerCase()
        if (!hay.includes(q)) continue
        searchResults.value.push({
          collection,
          id: it.id,
          name: it.name,
          subtitle: subtitle(it),
          image: it.images?.[0] || it.image ? pb.files?.getUrl(it, it.images?.[0] || it.image) : undefined,
          to: to(it.id),
        })
      }
    }
    push(mc?.items, 'Bikes', id => `/dashboard/motorcycles?q=${encodeURIComponent(q)}&edit=${id}`, it => [it.brand, it.year, it.engine_cc ? it.engine_cc + 'cc' : null].filter(Boolean).join(' · '))
    push(ac?.items, 'Gear', id => `/dashboard/accessories?q=${encodeURIComponent(q)}&edit=${id}`, it => it.category || 'Accessory')
    push(ap?.items, 'Apparel', id => `/dashboard/apparel?q=${encodeURIComponent(q)}&edit=${id}`, it => it.type || it.color || 'Apparel')
  } catch { searchResults.value = [] }
  searchLoading.value = false
}

function goToResult(item: { to: string }) {
  searchOpen.value = false
  router.push(item.to)
}

function goSearch() {
  const q = searchQuery.value.trim()
  if (!q) return
  searchOpen.value = false
  router.push(`/dashboard/motorcycles?q=${encodeURIComponent(q)}`)
}
</script>
