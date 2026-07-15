<template>
  <header
    ref="headerRef"
    class="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
    :class="scrolled ? 'bg-brand-black/90 backdrop-blur-md shadow-lg shadow-brand-black/50' : 'bg-brand-black/30 backdrop-blur-sm'"
  >
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <NuxtLink to="/" class="flex items-center py-4 shrink-0">
        <img src="/NPB Logo.png" alt="Nairobi Powerbikes" class="h-12 w-auto" />
      </NuxtLink>

      <nav class="hidden lg:flex items-center gap-1">
        <div
          v-for="item in navItems"
          :key="item.label"
          class="relative"
          @mouseenter="openDropdown(item.label)"
          @mouseleave="closeDropdown()"
        >
          <button
            v-if="item.children"
            class="flex items-center gap-1 px-3 py-6 text-sm font-display tracking-display uppercase text-brand-light hover:text-brand-red transition-colors whitespace-nowrap"
            @click="toggleDropdown(item.label)"
          >
            {{ item.label }}
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-200" :class="{ 'rotate-180': activeDropdown === item.label }"><path d="m6 9 6 6 6-6" /></svg>
          </button>
          <NuxtLink
            v-else
            :to="item.to || '#'"
            class="flex items-center gap-1 px-3 py-6 text-sm font-display tracking-display uppercase text-brand-light hover:text-brand-red transition-colors whitespace-nowrap"
            :class="{ 'text-brand-red': isActive(item.to!) }"
          >
            {{ item.label }}
          </NuxtLink>
          <Transition name="dropdown">
            <div v-if="item.children && activeDropdown === item.label" class="absolute left-0 top-full" @mouseenter="openDropdown(item.label)" @mouseleave="closeDropdown()">
              <div class="w-56 rounded-sm border border-brand-grey/20 bg-brand-black/95 backdrop-blur-lg shadow-xl overflow-hidden">
                <div class="py-2">
                  <NuxtLink v-for="child in item.children" :key="child.label" :to="child.to!" class="block px-4 py-2.5 text-sm text-brand-grey hover:text-brand-red hover:bg-white/5 transition-colors" @click="activeDropdown = null">{{ child.label }}</NuxtLink>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </nav>

      <div class="flex items-center gap-3">
        <ClientOnly>
          <template v-if="auth.isAuthenticated">
            <NuxtLink
              :to="auth.getDashboardRoute()"
              class="flex items-center gap-2 rounded-full border border-brand-grey/30 px-3 py-1.5 text-xs sm:px-4 sm:py-1.5 sm:text-sm text-brand-light hover:border-brand-red hover:text-brand-red transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 1 0-16 0" />
              </svg>
              {{ auth.user?.name || auth.user?.email }}
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink
              to="/login"
              class="btn-primary px-4 py-1.5 text-xs sm:px-5 sm:py-2 sm:text-sm"
            >
              Sign In
            </NuxtLink>
          </template>
        </ClientOnly>

        <button
          class="lg:hidden flex h-10 w-10 items-center justify-center text-brand-light hover:text-brand-red transition-colors"
          @click="mobileOpen = true"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>

    <MobileMenu v-model="mobileOpen" />
  </header>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const route = useRoute()

const headerRef = ref<HTMLElement | null>(null)
const scrolled = ref(false)
const activeDropdown = ref<string | null>(null)
const mobileOpen = ref(false)
const hoverTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

function clearHoverTimeout() {
  if (hoverTimeout.value) { clearTimeout(hoverTimeout.value); hoverTimeout.value = null }
}

function openDropdown(label: string) {
  clearHoverTimeout()
  activeDropdown.value = label
}

function closeDropdown() {
  clearHoverTimeout()
  hoverTimeout.value = setTimeout(() => {
    activeDropdown.value = null
  }, 150)
}

function toggleDropdown(label: string) {
  clearHoverTimeout()
  activeDropdown.value = activeDropdown.value === label ? null : label
}

interface NavChild {
  label: string
  to: string
}

interface NavItem {
  label: string
  to?: string
  children?: NavChild[]
}

const navItems: NavItem[] = [
  { label: 'Home', to: '/' },
  {
    label: 'Motorcycles', to: '/motorcycles',
    children: [
      { label: 'All Motorcycles', to: '/motorcycles' },
      { label: 'Brands', to: '/brands' },
      { label: 'Compare', to: '/motorcycles/compare' },
    ],
  },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Accessories', to: '/accessories' },
  { label: 'Apparel', to: '/apparel' },
  {
    label: 'Service', to: '/service/booking',
    children: [
      { label: 'Book a Service', to: '/service/booking' },
      { label: 'Book a Test Ride', to: '/service/test-ride' },
    ],
  },
  { label: 'Finance', to: '/finance' },
  { label: 'About', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path.split('?')[0])
}

onMounted(() => {
  const onScroll = () => {
    scrolled.value = window.scrollY > 20
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
})
</script>

<style scoped>
.dropdown-enter-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}
.dropdown-leave-active {
  transition: opacity 0.15s ease-in, transform 0.15s ease-in;
}
.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
