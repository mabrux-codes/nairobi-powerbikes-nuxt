<template>
  <header class="h-16 bg-brand-black/80 backdrop-blur-sm border-b border-brand-grey/30 flex items-center justify-between px-4 lg:px-6 shrink-0">
    <div class="flex items-center gap-3">
      <button
        class="lg:hidden p-2 text-brand-grey hover:text-white transition-colors"
        @click="$emit('toggle-sidebar')"
      >
        <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <NuxtLink to="/" class="flex items-center lg:hidden">
        <img src="/NPB Logo.png" alt="Nairobi Powerbikes" class="h-8 w-auto" />
      </NuxtLink>
    </div>

    <div class="flex items-center gap-3">
      <NotificationBell />

      <div class="relative" ref="dropdownRef">
        <button
          class="flex items-center gap-2 p-1.5 text-brand-grey hover:text-white transition-colors rounded-sm hover:bg-white/5"
          @click="dropdownOpen = !dropdownOpen"
        >
          <div class="w-8 h-8 rounded-full bg-brand-grey/30 flex items-center justify-center text-xs font-bold text-brand-light">
            {{ initials }}
          </div>
          <span class="hidden sm:block text-sm font-medium">{{ user?.name || user?.email }}</span>
          <svg class="w-4 h-4 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          v-if="dropdownOpen"
          class="absolute right-0 top-full mt-2 w-48 bg-brand-black border border-brand-grey/30 rounded-sm shadow-xl z-50 py-1"
        >
          <button
            class="w-full text-left px-4 py-2 text-sm text-brand-grey hover:text-white hover:bg-white/5 transition-colors"
            @click="handleSignOut"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'

defineEmits<{ 'toggle-sidebar': [] }>()

const route = useRoute()
const auth = useAuthStore()
const { logout } = useAuth()
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})

const user = computed(() => auth.user)

const initials = computed(() => {
  if (!user.value) return '?'
  const name = user.value.name || user.value.email
  return name.slice(0, 2).toUpperCase()
})

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/dashboard/admin') return 'Admin Dashboard'
  if (path === '/dashboard/manager') return 'Manager Dashboard'
  if (path === '/dashboard/sales') return 'Sales Dashboard'
  if (path === '/dashboard/mechanic') return 'Mechanic Dashboard'
  if (path === '/dashboard/customer') return 'My Dashboard'
  const segment = path.split('/').pop() || ''
  return segment
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
})

async function handleSignOut() {
  dropdownOpen.value = false
  await logout()
}
</script>
