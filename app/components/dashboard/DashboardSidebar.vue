<template>
  <aside
    :class="cn(
      'fixed top-0 left-0 z-40 h-screen w-64 bg-brand-black border-r border-brand-grey/30 flex flex-col transition-transform duration-300 lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    )"
  >
    <div class="hidden lg:flex items-center justify-center h-16 border-b border-brand-grey/30 shrink-0">
      <NuxtLink to="/" class="flex items-center">
        <img src="/NPB Logo.png" alt="Nairobi Powerbikes" class="h-10 w-auto" />
      </NuxtLink>
    </div>

    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="cn(
          'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-sm transition-all duration-200 group',
          isActive(item.to)
            ? 'text-white bg-white/5 border-l-2 border-brand-red pl-[10px]'
            : 'text-brand-grey hover:text-white hover:bg-white/5',
        )"
      >
        <span class="w-5 h-5 shrink-0" v-html="item.icon" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </nav>

    <div class="border-t border-brand-grey/30 p-4 shrink-0">
      <div v-if="user" class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-full bg-brand-grey/30 flex items-center justify-center text-xs font-bold text-brand-light shrink-0">
          {{ initials }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="text-sm font-medium text-white truncate">{{ user.name || user.email }}</p>
          <span class="inline-block px-2 py-0.5 text-[10px] font-display tracking-display uppercase rounded-sm"
            :class="roleBadgeClass"
          >
            {{ user.role }}
          </span>
        </div>
      </div>
      <button
        class="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-brand-grey hover:text-white hover:bg-white/5 rounded-sm transition-all duration-200"
        @click="signOut"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Sign Out</span>
      </button>
    </div>
  </aside>

  <div
    v-if="isOpen"
    class="fixed inset-0 z-30 bg-black/50 lg:hidden"
    @click="$emit('close')"
  />
</template>

<script setup lang="ts">
import { cn } from '~/utils/cn'
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'
import { useDashRoute } from '~/composables/useDashRoute'

defineProps<{ isOpen?: boolean }>()
defineEmits<{ close: [] }>()

const route = useRoute()
const auth = useAuthStore()
const { logout } = useAuth()
const { routes } = useDashRoute()

const user = computed(() => auth.user)

const initials = computed(() => {
  if (!user.value) return '?'
  const name = user.value.name || user.value.email
  return name.slice(0, 2).toUpperCase()
})

const roleBadgeClass = computed(() => {
  const role = user.value?.role
  if (role === 'admin') return 'bg-brand-red text-white'
  return 'bg-brand-grey/40 text-brand-light'
})

const navItems = computed(() => routes.value)

function isActive(to: string) {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to + '/') || route.path === to
}

async function signOut() {
  await logout()
}
</script>
