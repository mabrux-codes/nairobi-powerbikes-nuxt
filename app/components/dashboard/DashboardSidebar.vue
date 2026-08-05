<template>
  <aside
    :class="cn(
      'fixed top-0 left-0 z-40 h-screen bg-brand-black/95 backdrop-blur-xl border-r border-brand-grey/20 flex flex-col transition-all duration-300 lg:translate-x-0',
      collapsed ? 'w-20' : 'w-72',
      isOpen ? 'translate-x-0' : '-translate-x-full',
    )"
  >
    <div class="relative hidden lg:flex items-center justify-center h-20 border-b border-brand-grey/15 shrink-0 overflow-hidden" :class="collapsed ? 'px-2' : 'px-4'">
      <div class="absolute inset-0 bg-gradient-to-b from-brand-red/10 via-transparent to-transparent" />
      <NuxtLink to="/" class="relative flex items-center justify-center gap-2 group min-w-0">
        <img src="/NPB Logo.png" alt="Nairobi Powerbikes" class="h-11 w-auto transition-transform duration-300 group-hover:scale-105" />
        <template v-if="!collapsed">
          <span class="text-[10px] font-display tracking-[0.35em] text-brand-grey/70 uppercase">{{ portalLabel }}</span>
        </template>
      </NuxtLink>
    </div>

    <nav class="flex-1 overflow-y-auto py-5 scrollbar-thin" :class="collapsed ? 'px-3' : 'px-4'">
      <template v-for="group in navGroups" :key="group.label">
        <p
          v-if="!collapsed"
          class="px-3 pt-4 pb-1.5 text-[10px] font-display tracking-[0.25em] text-brand-grey/60 uppercase first:pt-0"
        >
          {{ group.label }}
        </p>
        <div v-else class="h-4 pt-2" aria-hidden="true" />
        <div class="space-y-0.5">
          <NuxtLink
            v-for="item in group.items"
            :key="item.to"
            :to="item.to"
            :title="collapsed ? item.label : undefined"
            :class="cn(
              'group relative flex items-center gap-3 text-sm font-medium rounded-xl transition-all duration-200',
              collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5',
              isActive(item.to)
                ? 'text-white bg-gradient-to-r from-brand-red/15 to-transparent border-l-2 border-brand-red'
                : 'text-brand-grey hover:text-white hover:bg-white/5 hover:translate-x-0.5',
            )"
          >
            <span class="w-5 h-5 shrink-0 opacity-80 transition-all duration-200 group-hover:opacity-100" v-html="item.icon" />
            <span v-if="!collapsed">{{ item.label }}</span>
            <span
              v-if="isActive(item.to) && !collapsed"
              class="absolute right-3 h-1.5 w-1.5 rounded-full bg-brand-red shadow-[0_0_12px_rgba(214,0,28,0.9)]"
            />
            <span
              v-if="isActive(item.to) && collapsed"
              class="absolute -left-3 h-5 w-0.5 rounded-full bg-brand-red shadow-[0_0_12px_rgba(214,0,28,0.9)]"
            />
          </NuxtLink>
        </div>
      </template>
    </nav>

    <div class="border-t border-brand-grey/15 p-4 shrink-0 bg-gradient-to-b from-transparent to-brand-black">
      <div
        v-if="user"
        class="rounded-xl border border-brand-grey/15 bg-white/[0.03] mb-3 transition-all duration-300"
        :class="collapsed ? 'flex justify-center p-2' : 'flex items-center gap-3 p-3'"
        :title="collapsed ? user.name || user.email : undefined"
      >
        <div class="relative shrink-0">
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 flex items-center justify-center text-xs font-bold text-white ring-2 ring-brand-red/30">
            {{ initials }}
          </div>
          <span class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-brand-black" />
        </div>
        <template v-if="!collapsed">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-white truncate">{{ user.name || user.email }}</p>
            <span
              class="mt-0.5 inline-block px-2 py-0.5 text-[9px] font-display tracking-[0.2em] uppercase rounded-md"
              :class="roleBadgeClass"
            >
              {{ user.role }}
            </span>
          </div>
        </template>
      </div>
      <button
        class="flex items-center gap-3 w-full text-sm font-medium text-brand-grey hover:text-brand-red hover:bg-brand-red/10 rounded-xl transition-all duration-200 group"
        :class="collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'"
        @click="signOut"
      >
        <svg class="w-5 h-5 shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span v-if="!collapsed">Sign Out</span>
      </button>
      <button
        class="hidden lg:flex items-center gap-3 w-full mt-1 text-sm font-medium text-brand-grey/70 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 group"
        :class="collapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5'"
        @click="$emit('toggle-collapse')"
      >
        <svg class="w-5 h-5 shrink-0 transition-transform duration-300" :class="collapsed ? '' : 'group-hover:-translate-x-0.5'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path v-if="!collapsed" stroke-linecap="round" stroke-linejoin="round" d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5-5 5M6 7l5 5-5 5" />
        </svg>
        <span v-if="!collapsed">Collapse</span>
      </button>
    </div>
  </aside>

  <div
    v-if="isOpen"
    class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
    @click="$emit('close')"
  />
</template>

<script setup lang="ts">
import { cn } from '~/utils/cn'
import { useAuthStore } from '~/stores/auth'
import { useAuth } from '~/composables/useAuth'
import { useDashRoute } from '~/composables/useDashRoute'

defineProps<{ isOpen?: boolean; collapsed?: boolean }>()
defineEmits<{ close: []; 'toggle-collapse': [] }>()

const route = useRoute()
const auth = useAuthStore()
const { logout } = useAuth()
const { routes } = useDashRoute()

const user = computed(() => auth.user)

const portalLabel = computed(() => (user.value?.role === 'admin' ? "Admin's Portal" : "Customer's Portal"))

const initials = computed(() => {
  if (!user.value) return '?'
  const name = user.value.name || user.value.email
  return name.slice(0, 2).toUpperCase()
})

const roleBadgeClass = computed(() => {
  const role = user.value?.role
  if (role === 'admin') return 'bg-brand-red/20 text-brand-red'
  return 'bg-brand-grey/40 text-brand-light'
})

const navGroups = computed(() => {
  const groups: { label: string; items: any[] }[] = []
  for (const r of routes.value) {
    const existing = groups.find(g => g.label === r.section)
    if (existing) existing.items.push(r)
    else groups.push({ label: r.section, items: [r] })
  }
  return groups
})

function isActive(to: string) {
  if (to === '/dashboard') return route.path === '/dashboard'
  return route.path.startsWith(to + '/') || route.path === to
}

async function signOut() {
  await logout()
}
</script>
