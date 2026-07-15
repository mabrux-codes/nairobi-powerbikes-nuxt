<template>
  <Teleport to="body">
    <AnimatePresence>
      <div v-if="modelValue" class="fixed inset-0 z-50 flex">
        <motion.div
          class="fixed inset-0 bg-brand-black/80 backdrop-blur-sm"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          @click="close"
        />
        <motion.div
          class="relative ml-auto flex h-full w-full max-w-sm flex-col bg-brand-black border-l border-brand-grey/20"
          :initial="{ x: '100%' }"
          :animate="{ x: 0 }"
          :exit="{ x: '100%' }"
          :transition="{ type: 'spring', damping: 30, stiffness: 300 }"
        >
          <div class="flex items-center justify-between border-b border-brand-grey/20 px-6 py-4">
            <span class="font-display text-xl tracking-display text-white">
              <span class="text-brand-red">NP</span> MENU
            </span>
            <button
              class="flex h-10 w-10 items-center justify-center text-brand-grey hover:text-white transition-colors"
              @click="close"
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          <nav class="flex-1 overflow-y-auto px-6 py-6">
            <ul class="space-y-1">
              <li v-for="item in navItems" :key="item.label">
                <NuxtLink
                  v-if="!item.children"
                  :to="item.to!"
                  class="flex items-center gap-3 py-4 text-lg font-display tracking-display uppercase text-brand-light hover:text-brand-red transition-colors border-b border-brand-grey/10"
                  :class="{ 'text-brand-red': isActive(item.to!) }"
                  @click="close"
                >
                  <span v-html="item.icon" class="h-5 w-5 shrink-0" />
                  {{ item.label }}
                </NuxtLink>
                <div v-else class="border-b border-brand-grey/10 py-3">
                  <button
                    class="flex w-full items-center justify-between py-1 text-lg font-display tracking-display uppercase text-brand-light hover:text-brand-red transition-colors"
                    @click="toggleDropdown(item.label)"
                  >
                    <span class="flex items-center gap-3">
                      <span v-html="item.icon" class="h-5 w-5 shrink-0" />
                      {{ item.label }}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="transition-transform duration-200"
                      :class="{ 'rotate-180': openDropdowns.includes(item.label) }"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  <div
                    v-if="openDropdowns.includes(item.label)"
                    class="ml-8 mt-2 space-y-1"
                  >
                    <NuxtLink
                      v-for="child in item.children"
                      :key="child.label"
                      :to="child.to!"
                      class="block py-3 text-sm text-brand-grey hover:text-brand-red transition-colors"
                      @click="close"
                    >
                      {{ child.label }}
                    </NuxtLink>
                  </div>
                </div>
              </li>
            </ul>
          </nav>

          <div class="border-t border-brand-grey/20 px-6 py-6">
            <ClientOnly>
              <template v-if="auth.isAuthenticated">
                <NuxtLink
                  :to="auth.getDashboardRoute()"
                  class="btn-primary w-full justify-center text-sm"
                  @click="close"
                >
                  Dashboard
                </NuxtLink>
                <button
                  class="mt-3 flex w-full items-center justify-center gap-2 py-3 text-sm text-brand-grey hover:text-brand-red transition-colors"
                  @click="handleSignOut"
                >
                  Sign Out
                </button>
              </template>
              <template v-else>
                <NuxtLink
                  to="/login"
                  class="btn-primary w-full justify-center text-sm"
                  @click="close"
                >
                  Sign In
                </NuxtLink>
                <NuxtLink
                  to="/register"
                  class="btn-secondary mt-3 w-full justify-center text-sm"
                  @click="close"
                >
                  Create Account
                </NuxtLink>
              </template>
            </ClientOnly>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  </Teleport>
</template>

<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'

interface NavChild {
  label: string
  to: string
}

interface NavItem {
  label: string
  to?: string
  icon: string
  children?: NavChild[]
}

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>()

const auth = useAuthStore()
const route = useRoute()
const openDropdowns = ref<string[]>([])

const navItems: NavItem[] = [
  { label: 'Home', to: '/', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  {
    label: 'Motorcycles',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="18.5" cy="17.5" r="3.5"/><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 0-3.5 5.5L9 9l-3.5 4"/><line x1="15" y1="6" x2="18.5" y2="17.5"/></svg>',
    children: [
      { label: 'All Motorcycles', to: '/motorcycles' },
      { label: 'Brands', to: '/brands' },
      { label: 'Compare', to: '/motorcycles/compare' },
    ],
  },
  { label: 'New Arrivals', to: '/new-arrivals', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>' },
  { label: 'Accessories', to: '/accessories', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>' },
  { label: 'Apparel', to: '/apparel', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 5v14h12V5M6 5a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4M6 5H3v5a2 2 0 0 0 2 2h1M18 5h3v5a2 2 0 0 1-2 2h-1"/></svg>' },
  {
    label: 'Service',
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    children: [
      { label: 'Book a Service', to: '/service/booking' },
      { label: 'Book a Test Ride', to: '/service/test-ride' },
    ],
  },
  { label: 'Finance', to: '/finance', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>' },
  { label: 'About', to: '/about', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>' },
  { label: 'Contact Us', to: '/contact', icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' },
]

function close() {
  emit('update:modelValue', false)
}

function toggleDropdown(label: string) {
  const idx = openDropdowns.value.indexOf(label)
  if (idx > -1) {
    openDropdowns.value.splice(idx, 1)
  } else {
    openDropdowns.value.push(label)
  }
}

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function handleSignOut() {
  auth.clear()
  close()
  navigateTo('/')
}
</script>
