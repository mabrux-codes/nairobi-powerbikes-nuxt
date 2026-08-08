<template>
  <Teleport to="body">
    <AnimatePresence>
      <div v-if="modelValue" class="fixed inset-0 z-[90] flex">
        <motion.div
          class="fixed inset-0 bg-black/70 backdrop-blur-sm"
          :initial="{ opacity: 0 }"
          :animate="{ opacity: 1 }"
          :exit="{ opacity: 0 }"
          @click="close"
        />
        <motion.div
          class="relative ml-auto flex h-full w-full flex-col border-l border-white/10 bg-brand-black sm:max-w-md"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          :initial="{ x: '100%' }"
          :animate="{ x: 0 }"
          :exit="{ x: '100%' }"
          :transition="{ type: 'spring', damping: 32, stiffness: 320 }"
        >
          <!-- header -->
          <div class="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <NuxtLink to="/" class="flex items-center" @click="close">
              <img src="/NPB Logo.png" alt="Nairobi Powerbikes" class="h-9 w-auto" />
            </NuxtLink>
            <button
              class="flex h-10 w-10 items-center justify-center rounded-full text-brand-grey transition-colors hover:bg-white/5 hover:text-white"
              aria-label="Close menu"
              @click="close"
            >
              <X class="h-5 w-5" />
            </button>
          </div>

          <!-- quick actions -->
          <div class="flex gap-2 border-b border-white/[0.06] px-5 py-3">
            <button
              class="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 text-sm font-semibold text-brand-light/85 transition-colors hover:border-brand-red/50 hover:text-brand-red"
              @click="emit('open-search'); close()"
            >
              <Search class="h-4 w-4" />Search
            </button>
            <NuxtLink
              v-if="auth.isAuthenticated"
              to="/dashboard/my-wishlist"
              class="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-brand-light/85 transition-colors hover:border-brand-red/50 hover:text-brand-red"
              :aria-label="`Wishlist${wishlist.count.value ? `, ${wishlist.count.value} saved items` : ''}`"
              @click="close"
            >
              <Heart class="h-4 w-4" />
              <span v-if="wishlist.count.value > 0" class="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">
                {{ wishlist.count.value > 99 ? '99+' : wishlist.count.value }}
              </span>
            </NuxtLink>
          </div>

          <!-- nav sections -->
          <nav class="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile">
            <p class="mb-2 px-1 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">Shop</p>
            <ul class="space-y-0.5">
              <li>
                <NuxtLink to="/" class="mobile-link" :class="{ 'text-brand-red': isActive('/') }" @click="close">
                  <Home class="h-4 w-4 shrink-0 text-brand-grey" />Home
                </NuxtLink>
              </li>

              <li>
                <button class="mobile-link w-full" :aria-expanded="expanded.includes('motorcycles')" @click="toggle('motorcycles')">
                  <Bike class="h-4 w-4 shrink-0 text-brand-grey" />
                  <span class="flex-1 text-left">Motorcycles</span>
                  <ChevronDown class="h-4 w-4 text-brand-grey transition-transform duration-200" :class="{ 'rotate-180': expanded.includes('motorcycles') }" />
                </button>
                <Transition name="sub">
                  <ul v-if="expanded.includes('motorcycles')" class="space-y-0.5 border-l border-white/[0.06] pl-4 ml-4 mt-0.5">
                    <li v-for="t in BIKE_TYPES" :key="t">
                      <NuxtLink :to="{ path: '/motorcycles', query: { type: t } }" class="mobile-sub" @click="close">{{ t }}</NuxtLink>
                    </li>
                    <li><NuxtLink to="/motorcycles" class="mobile-sub text-brand-red" @click="close">All Motorcycles</NuxtLink></li>
                    <li><NuxtLink to="/brands" class="mobile-sub" @click="close">Brands</NuxtLink></li>
                    <li><NuxtLink to="/motorcycles/compare" class="mobile-sub" @click="close">Compare</NuxtLink></li>
                    <li><NuxtLink to="/new-arrivals" class="mobile-sub" @click="close">New Arrivals</NuxtLink></li>
                  </ul>
                </Transition>
              </li>

              <li>
                <button class="mobile-link w-full" :aria-expanded="expanded.includes('accessories')" @click="toggle('accessories')">
                  <Package class="h-4 w-4 shrink-0 text-brand-grey" />
                  <span class="flex-1 text-left">Accessories</span>
                  <ChevronDown class="h-4 w-4 text-brand-grey transition-transform duration-200" :class="{ 'rotate-180': expanded.includes('accessories') }" />
                </button>
                <Transition name="sub">
                  <ul v-if="expanded.includes('accessories')" class="space-y-0.5 border-l border-white/[0.06] pl-4 ml-4 mt-0.5">
                    <li v-for="c in ACCESSORY_CATEGORIES" :key="c">
                      <NuxtLink :to="{ path: '/accessories', query: { category: c } }" class="mobile-sub" @click="close">{{ c }}</NuxtLink>
                    </li>
                    <li><NuxtLink to="/accessories" class="mobile-sub text-brand-red" @click="close">All Accessories</NuxtLink></li>
                  </ul>
                </Transition>
              </li>

              <li>
                <button class="mobile-link w-full" :aria-expanded="expanded.includes('apparel')" @click="toggle('apparel')">
                  <Shirt class="h-4 w-4 shrink-0 text-brand-grey" />
                  <span class="flex-1 text-left">Apparel</span>
                  <ChevronDown class="h-4 w-4 text-brand-grey transition-transform duration-200" :class="{ 'rotate-180': expanded.includes('apparel') }" />
                </button>
                <Transition name="sub">
                  <ul v-if="expanded.includes('apparel')" class="space-y-0.5 border-l border-white/[0.06] pl-4 ml-4 mt-0.5">
                    <li v-for="t in APPAREL_TYPES" :key="t">
                      <NuxtLink :to="{ path: '/apparel', query: { type: t } }" class="mobile-sub" @click="close">{{ t }}</NuxtLink>
                    </li>
                    <li><NuxtLink to="/apparel" class="mobile-sub text-brand-red" @click="close">All Apparel</NuxtLink></li>
                  </ul>
                </Transition>
              </li>

              <li><NuxtLink to="/finance" class="mobile-link" @click="close"><Wallet class="h-4 w-4 shrink-0 text-brand-grey" />Finance</NuxtLink></li>
            </ul>

            <p class="mt-6 mb-2 px-1 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">Services</p>
            <ul class="space-y-0.5">
              <li><NuxtLink to="/service/booking" class="mobile-link" @click="close"><Wrench class="h-4 w-4 shrink-0 text-brand-grey" />Book a Service</NuxtLink></li>
              <li><NuxtLink to="/service/test-ride" class="mobile-link" @click="close"><CalendarClock class="h-4 w-4 shrink-0 text-brand-grey" />Book a Test Ride</NuxtLink></li>
            </ul>

            <p class="mt-6 mb-2 px-1 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">Dealership</p>
            <ul class="space-y-0.5">
              <li><NuxtLink to="/about" class="mobile-link" @click="close"><Info class="h-4 w-4 shrink-0 text-brand-grey" />About Us</NuxtLink></li>
              <li><NuxtLink to="/contact" class="mobile-link" @click="close"><Phone class="h-4 w-4 shrink-0 text-brand-grey" />Contact</NuxtLink></li>
              <li><NuxtLink to="/brands" class="mobile-link" @click="close"><Building2 class="h-4 w-4 shrink-0 text-brand-grey" />Our Brands</NuxtLink></li>
            </ul>

            <ClientOnly>
              <template v-if="auth.isAuthenticated">
                <p class="mt-6 mb-2 px-1 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">My Account</p>
                <ul class="space-y-0.5">
                  <li><NuxtLink to="/dashboard" class="mobile-link" @click="close"><LayoutDashboard class="h-4 w-4 shrink-0 text-brand-grey" />Dashboard</NuxtLink></li>
                  <li><NuxtLink to="/dashboard/my-wishlist" class="mobile-link" @click="close"><Heart class="h-4 w-4 shrink-0 text-brand-grey" />Wishlist</NuxtLink></li>
                  <li><NuxtLink :to="notificationsRoute" class="mobile-link" @click="close"><Bell class="h-4 w-4 shrink-0 text-brand-grey" />Notifications</NuxtLink></li>
                  <li v-if="auth.userRole !== 'admin'"><NuxtLink to="/dashboard/my-messages" class="mobile-link" @click="close"><MessageSquare class="h-4 w-4 shrink-0 text-brand-grey" />Messages</NuxtLink></li>
                  <li><NuxtLink to="/dashboard/profile" class="mobile-link" @click="close"><User class="h-4 w-4 shrink-0 text-brand-grey" />Profile</NuxtLink></li>
                  <li><NuxtLink :to="settingsRoute" class="mobile-link" @click="close"><Settings class="h-4 w-4 shrink-0 text-brand-grey" />Settings</NuxtLink></li>
                </ul>
              </template>
            </ClientOnly>
          </nav>

          <!-- footer actions -->
          <div class="safe-bottom border-t border-white/[0.06] px-5 py-5">
            <ClientOnly>
              <template v-if="auth.isAuthenticated">
                <Button variant="danger" class="w-full" @click="handleSignOut">
                  <LogOut class="h-4 w-4" />Sign Out
                </Button>
              </template>
              <template v-else>
                <Button to="/login" variant="primary" class="w-full" @click="close">Sign In</Button>
                <Button to="/register" variant="secondary" class="mt-3 w-full" @click="close">Create Account</Button>
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
import {
  X, Search, Heart, Home, Bike, Package, Shirt, ChevronDown, Wallet, Wrench, CalendarClock,
  Info, Phone, Building2, LayoutDashboard, Bell, MessageSquare, User, Settings, LogOut,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useWishlist } from '~/composables/useWishlist'
import { usePB } from '~/composables/usePocketBase'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; 'open-search': [] }>()

const auth = useAuthStore()
const wishlist = useWishlist()
const route = useRoute()
const expanded = ref<string[]>([])

const BIKE_TYPES = ['Sport', 'Adventure', 'Touring', 'Naked', 'Cruiser', 'Dirt', 'Scooter', 'Electric']
const ACCESSORY_CATEGORIES = ['Helmets', 'Gloves', 'Covers', 'Locks', 'Bags', 'Tools', 'Electronics', 'Lighting', 'Other']
const APPAREL_TYPES = ['T-Shirts', 'Jackets', 'Hoodies', 'Caps', 'Gloves', 'Pants', 'Vests', 'Other']

const notificationsRoute = computed(() => (auth.userRole === 'admin' ? '/dashboard/notifications' : '/dashboard/my-notifications'))
const settingsRoute = computed(() => (auth.userRole === 'admin' ? '/dashboard/settings' : '/dashboard/my-settings'))

function close() { emit('update:modelValue', false) }
function toggle(key: string) {
  const idx = expanded.value.indexOf(key)
  if (idx > -1) expanded.value.splice(idx, 1)
  else expanded.value.push(key)
}

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path === path || route.path.startsWith(`${path}/`)
}

async function handleSignOut() {
  close()
  try { await usePB().collection('notifications').unsubscribe('*') } catch { /* ignore */ }
  try { usePB().authStore.clear() } catch { /* ignore */ }
  try { usePB().realtime.disconnect() } catch { /* ignore */ }
  auth.clear()
  localStorage.removeItem('pb_auth')
  navigateTo('/')
}

function handleKey(e: KeyboardEvent) {
  if (e.key === 'Escape') close()
}
onMounted(() => document.addEventListener('keydown', handleKey))
onUnmounted(() => document.removeEventListener('keydown', handleKey))

watch(() => props.modelValue, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})
onUnmounted(() => { document.body.style.overflow = '' })

watch(() => route.fullPath, () => { if (props.modelValue) close() })
</script>

<style scoped>
.mobile-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.8rem 0.75rem;
  border-radius: 0.75rem;
  font-size: 0.925rem;
  font-weight: 600;
  color: rgb(242 242 242 / 0.88);
  transition: color 0.2s ease, background-color 0.2s ease;
}
.mobile-link:hover {
  color: #fff;
  background-color: rgb(255 255 255 / 0.05);
}
.mobile-sub {
  display: block;
  padding: 0.55rem 0.75rem;
  border-radius: 0.6rem;
  font-size: 0.82rem;
  color: rgb(74 74 74);
  transition: color 0.2s ease, background-color 0.2s ease;
}
.mobile-sub:hover {
  color: #D6001C;
  background-color: rgb(255 255 255 / 0.04);
}
.sub-enter-active, .sub-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.sub-enter-from, .sub-leave-to { opacity: 0; transform: translateY(-4px); }
</style>