<template>
  <header
    ref="headerEl"
    class="safe-top fixed inset-x-0 top-[var(--announce-h)] z-50 transition-all duration-300"
    :class="scrolled
      ? 'border-b border-white/[0.07] bg-brand-black/85 shadow-lg shadow-black/40 backdrop-blur-xl'
      : 'border-b border-transparent bg-gradient-to-b from-black/70 via-black/25 to-transparent'"
  >
    <div
      class="mx-auto flex max-w-[90rem] items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8"
      :class="scrolled ? 'h-16 md:h-[70px] lg:h-20' : 'h-[68px] md:h-[76px] lg:h-[88px]'"
    >
      <!-- ============ LEFT: LOGO ============ -->
      <NuxtLink to="/" class="flex shrink-0 items-center" aria-label="Nairobi Powerbikes — Home">
        <img
          src="/NPB Logo.png"
          alt="Nairobi Powerbikes"
          class="h-10 w-auto transition-all duration-300 md:h-11 lg:h-12"
          :class="{ 'scale-90': scrolled }"
        />
      </NuxtLink>

      <!-- ============ CENTER: NAV ============ -->
      <nav class="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
        <template v-for="item in navItems" :key="item.label">
          <!-- mega menu item -->
          <div
            v-if="item.mega"
            class="relative"
            @mouseenter="openMega(item.label)"
            @mouseleave="scheduleCloseMega"
          >
            <button
              :id="`nav-${item.slug}`"
              class="nav-link flex items-center gap-1.5 px-2.5 py-2 text-[13px] font-semibold tracking-wide transition-colors xl:px-3"
              :class="[isActive(item.to) ? 'text-brand-red' : 'text-brand-light/90 hover:text-white', openMegaMenu === item.label && 'text-white']"
              :aria-expanded="openMegaMenu === item.label"
              :aria-controls="`mega-${item.slug}`"
              @click="toggleMega(item.label)"
            >
              {{ item.label }}
              <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200" :class="{ 'rotate-180': openMegaMenu === item.label }" />
            </button>
            <div class="nav-underline" :class="{ 'nav-underline-active': isActive(item.to) }" />
            <div
              :id="`mega-${item.slug}`"
              class="absolute top-full"
              @mouseenter="clearCloseTimeout"
            >
              <MegaMenuPanel
                :kind="item.mega"
                :open="openMegaMenu === item.label"
                @navigate="closeAll"
              />
            </div>
          </div>

          <!-- plain link -->
          <NuxtLink
            v-else
            :to="item.to"
            class="nav-link relative flex items-center px-2.5 py-2 text-[13px] font-semibold tracking-wide transition-colors xl:px-3"
            :class="[isActive(item.to) ? 'text-brand-red' : 'text-brand-light/90 hover:text-white', item.hideLg ? 'hidden xl:flex' : '']"
            :aria-current="isActive(item.to) ? 'page' : undefined"
          >
            {{ item.label }}
            <span class="nav-underline" :class="{ 'nav-underline-active': isActive(item.to) }" />
          </NuxtLink>
        </template>
      </nav>

      <!-- ============ RIGHT: ACTIONS ============ -->
      <div class="flex items-center gap-1 sm:gap-2">
        <button
          class="icon-btn"
          aria-label="Search the catalogue"
          @click="searchOpen = true"
        >
          <Search class="h-5 w-5" />
        </button>

        <!-- wishlist (authenticated only) -->
        <NuxtLink
          v-if="auth.isAuthenticated"
          to="/dashboard/my-wishlist"
          class="icon-btn relative"
          :aria-label="`Wishlist${wishlist.count.value ? `, ${wishlist.count.value} saved items` : ''}`"
        >
          <Heart class="h-5 w-5" />
          <Transition name="badge">
            <span
              v-if="wishlist.count.value > 0"
              key="wishlist-count"
              class="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-red px-1 text-[9px] font-bold text-white shadow-lg shadow-brand-red/40"
            >
              {{ wishlist.count.value > 99 ? '99+' : wishlist.count.value }}
            </span>
          </Transition>
        </NuxtLink>

        <ClientOnly>
          <!-- logged in -->
          <template v-if="auth.isAuthenticated">
            <NavNotifications class="hidden sm:flex" />
            <ProfileMenu />
          </template>
          <!-- guest -->
          <template v-else>
            <div class="hidden items-center gap-2 md:flex">
              <Button to="/login" variant="ghost" size="sm" class="h-9 px-4">Sign In</Button>
              <Button to="/register" variant="primary" size="sm" class="h-9 px-4">Register</Button>
            </div>
          </template>
        </ClientOnly>

        <!-- mobile hamburger -->
        <button
          class="icon-btn lg:hidden"
          :aria-label="mobileOpen ? 'Close navigation' : 'Open navigation'"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = true"
        >
          <Menu class="h-6 w-6" />
        </button>
      </div>
    </div>

    <!-- mobile menu + overlays -->
    <MobileMenu v-model="mobileOpen" @open-search="searchOpen = true" />
  </header>

  <GlobalSearch :open="searchOpen" @close="searchOpen = false" />
</template>

<script setup lang="ts">
import { Search, Heart, Menu, ChevronDown } from 'lucide-vue-next'
import { useCatalogStore } from '~/stores/catalog'
import { useWishlist } from '~/composables/useWishlist'

const auth = useAuthStore()
const route = useRoute()
const wishlist = useWishlist()
const store = useCatalogStore()

const scrolled = ref(false)
const openMegaMenu = ref<string | null>(null)
const mobileOpen = ref(false)
const searchOpen = ref(false)
const closeTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const wishlistRoute = '/dashboard/my-wishlist'

interface MegaItem {
  label: string
  slug: string
  to: string
  mega: 'motorcycles' | 'accessories' | 'apparel'
}
interface PlainItem {
  label: string
  to: string
  mega?: never
  hideLg?: boolean
}

const navItems: Array<MegaItem | PlainItem> = [
  { label: 'Home', to: '/' },
  { label: 'Motorcycles', slug: 'motorcycles', to: '/motorcycles', mega: 'motorcycles' },
  { label: 'Accessories', slug: 'accessories', to: '/accessories', mega: 'accessories' },
  { label: 'Apparel', slug: 'apparel', to: '/apparel', mega: 'apparel' },
  { label: 'Book a Service', to: '/service/booking', hideLg: true },
  { label: 'Book a Test Ride', to: '/service/test-ride', hideLg: true },
  { label: 'About Us', to: '/about', hideLg: true },
  { label: 'Contact', to: '/contact', hideLg: true },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

function openMega(label: string) { clearCloseTimeout(); openMegaMenu.value = label }
function toggleMega(label: string) { openMegaMenu.value = openMegaMenu.value === label ? null : label }
function clearCloseTimeout() {
  if (closeTimeout.value) { clearTimeout(closeTimeout.value); closeTimeout.value = null }
}
function scheduleCloseMega() {
  clearCloseTimeout()
  closeTimeout.value = setTimeout(() => { openMegaMenu.value = null }, 140)
}
function closeAll() { openMegaMenu.value = null }

function onScroll() { scrolled.value = window.scrollY > 24 }

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    openMegaMenu.value = null
    mobileOpen.value = false
    searchOpen.value = false
  }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    searchOpen.value = !searchOpen.value
  }
}

const headerEl = ref<HTMLElement | null>(null)
function syncNavHeight() {
  const el = headerEl.value
  if (!el) return
  const announceH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--announce-h')) || 0
  document.documentElement.style.setProperty('--nav-h', `${el.offsetHeight + announceH}px`)
}

function onAnnounceResize() {
  syncNavHeight()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
  window.addEventListener('announce:resize', onAnnounceResize)
  store.ensureActive()
  wishlist.load()
  onScroll()
  syncNavHeight()
  window.addEventListener('resize', syncNavHeight)
  const ro = new ResizeObserver(syncNavHeight)
  if (headerEl.value) ro.observe(headerEl.value)
  ;(headerEl.value as any).__navRo = ro
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('announce:resize', onAnnounceResize)
  window.removeEventListener('resize', syncNavHeight)
  ;(headerEl.value as any)?.__navRo?.disconnect()
  store.release()
})

watch(() => route.fullPath, () => { openMegaMenu.value = null; mobileOpen.value = false })
</script>

<style scoped>
.nav-link {
  position: relative;
}
.nav-underline {
  position: absolute;
  left: 0.75rem;
  right: 0.75rem;
  bottom: 0.35rem;
  height: 2px;
  border-radius: 9999px;
  background: linear-gradient(to right, #D6001C, rgba(214, 0, 28, 0.25));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1);
}
.nav-link:hover .nav-underline {
  transform: scaleX(1);
}
.nav-underline-active {
  transform: scaleX(1);
}
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  color: rgb(242 242 242 / 0.85);
  transition: color 0.2s ease, background-color 0.2s ease, transform 0.15s ease;
}
.icon-btn:hover {
  color: #fff;
  background-color: rgb(255 255 255 / 0.07);
}
.icon-btn:active {
  transform: scale(0.94);
}
.badge-enter-active, .badge-leave-active { transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s; }
.badge-enter-from { transform: scale(0.4); opacity: 0; }
.badge-leave-to { transform: scale(0.4); opacity: 0; }
</style>