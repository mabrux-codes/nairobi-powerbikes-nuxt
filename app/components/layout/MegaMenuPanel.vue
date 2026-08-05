<template>
  <div v-if="open" class="absolute left-1/2 top-full w-[min(92vw,900px)] -translate-x-1/2 pt-3">
    <div class="overflow-hidden rounded-2xl border border-white/10 bg-brand-black/95 shadow-2xl shadow-black/70 backdrop-blur-2xl">
      <!-- header strip -->
      <div class="flex items-center justify-between border-b border-white/[0.06] px-8 py-4">
        <p class="font-display text-sm font-bold tracking-[0.18em] uppercase">
          <span class="text-white">{{ title }}</span><span class="text-brand-red">.</span>
        </p>
        <NuxtLink :to="allLink" class="flex items-center gap-1 text-xs font-semibold text-brand-grey transition-colors hover:text-brand-red" @click="notifyNavigate">
          View All <ChevronRight class="h-3.5 w-3.5" />
        </NuxtLink>
      </div>

      <div class="p-8">
        <!-- ============ MOTORCYCLES ============ -->
        <div v-if="kind === 'motorcycles'" class="grid gap-10 lg:grid-cols-[1.1fr_1fr_0.95fr]">
          <div>
            <p class="mb-4 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">Browse by Category</p>
            <div class="grid grid-cols-2 gap-x-6 gap-y-1">
              <NuxtLink
                v-for="t in bikeTypes"
                :key="t"
                :to="{ path: '/motorcycles', query: { type: t } }"
                class="group flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium text-brand-light/85 transition-colors hover:bg-white/[0.05] hover:text-white"
                @click="notifyNavigate"
              >
                <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-brand-grey transition-colors group-hover:border-brand-red/50 group-hover:text-brand-red">
                  <component :is="bikeTypeIcon(t)" class="h-3.5 w-3.5" />
                </span>
                <span class="flex-1">{{ t }}</span>
                <span v-if="typeCount(t)" class="text-[11px] text-brand-grey/60">{{ typeCount(t) }}</span>
              </NuxtLink>
            </div>
            <div class="mt-6 grid grid-cols-2 gap-2 border-t border-white/[0.06] pt-5">
              <NuxtLink v-for="q in bikeQuick" :key="q.label" :to="q.to" class="flex items-center gap-2 text-xs font-medium text-brand-grey transition-colors hover:text-brand-red" @click="notifyNavigate">
                <span class="h-1 w-1 shrink-0 rounded-full bg-brand-red/70" />{{ q.label }}
              </NuxtLink>
            </div>
          </div>

          <!-- featured bike -->
          <div>
            <p class="mb-4 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">Featured Motorcycle</p>
            <NuxtLink
              v-if="featuredBike"
              :to="bikePath(featuredBike)"
              class="group block overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-transparent transition-colors hover:border-brand-red/40"
              @click="notifyNavigate"
            >
              <div class="relative aspect-[16/10] overflow-hidden bg-black">
                <img :src="img(featuredBike)" :alt="featuredBike.name" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <span class="absolute left-3 top-3 rounded-full bg-brand-red px-2.5 py-1 text-[9px] font-bold tracking-wider text-white uppercase">Featured</span>
              </div>
              <div class="p-4">
                <p class="truncate text-sm font-semibold text-white transition-colors group-hover:text-brand-red">{{ featuredBike.name }}</p>
                <p class="mt-1 text-xs font-semibold text-brand-red">{{ price(featuredBike) }}</p>
              </div>
            </NuxtLink>
            <NuxtLink v-else :to="'/motorcycles'" class="group block overflow-hidden rounded-xl border border-white/[0.07]" @click="notifyNavigate">
              <div class="relative aspect-[16/10] overflow-hidden bg-black">
                <img src="/images/bikes/tekken-2.jpeg" alt="Motorcycles" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div class="p-4"><p class="text-sm font-semibold text-white">Explore the Collection</p></div>
            </NuxtLink>
          </div>

          <!-- latest arrivals + CTA -->
          <div class="flex flex-col">
            <p class="mb-4 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">Latest Arrivals</p>
            <NuxtLink
              :to="'/new-arrivals'"
              class="group flex items-center gap-3 rounded-xl border border-white/[0.07] p-3 transition-colors hover:border-brand-red/40"
              @click="notifyNavigate"
            >
              <span class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                <img v-if="latestBike && img(latestBike)" :src="img(latestBike)" :alt="latestBike?.name" class="h-full w-full object-cover" loading="lazy" />
                <Sparkles v-else class="h-5 w-5 text-brand-grey/60" />
              </span>
              <span class="min-w-0">
                <span class="block truncate text-sm font-semibold text-white group-hover:text-brand-red">{{ latestBike?.name || 'New Arrivals' }}</span>
                <span class="block text-xs text-brand-grey">Fresh from the showroom</span>
              </span>
              <ChevronRight class="ml-auto h-4 w-4 shrink-0 text-brand-grey/40 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-red" />
            </NuxtLink>
            <div class="mt-auto pt-6">
              <Button to="/service/test-ride" variant="primary" class="w-full" @click="notifyNavigate">
                <CalendarClock class="h-4 w-4" />Book a Test Ride
              </Button>
            </div>
          </div>
        </div>

        <!-- ============ ACCESSORIES ============ -->
        <div v-else-if="kind === 'accessories'" class="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <p class="mb-4 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">Shop by Category</p>
            <div class="grid grid-cols-3 gap-2">
              <NuxtLink
                v-for="c in accessoryCategories"
                :key="c"
                :to="{ path: '/accessories', query: { category: c } }"
                class="group flex flex-col items-center gap-2 rounded-xl border border-white/[0.04] px-2 py-4 text-center transition-colors hover:border-brand-red/40 hover:bg-white/[0.04]"
                @click="notifyNavigate"
              >
                <span class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-red/10 text-brand-red transition-transform group-hover:scale-110">
                  <component :is="gearIcon(c)" class="h-4 w-4" />
                </span>
                <span class="text-xs font-semibold text-brand-light/85 group-hover:text-white">{{ c }}</span>
              </NuxtLink>
            </div>
            <NuxtLink to="/accessories" class="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-red transition-colors hover:text-white" @click="notifyNavigate">
              Browse all accessories <ChevronRight class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>

          <div>
            <p class="mb-4 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">Featured Accessory</p>
            <NuxtLink
              v-if="featuredAccessory"
              :to="`/accessories/${featuredAccessory.id}`"
              class="group block overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-transparent transition-colors hover:border-brand-red/40"
              @click="notifyNavigate"
            >
              <div class="relative aspect-[16/10] overflow-hidden bg-black">
                <img :src="img(featuredAccessory)" :alt="featuredAccessory.name" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div class="p-4">
                <p class="truncate text-sm font-semibold text-white group-hover:text-brand-red">{{ featuredAccessory.name }}</p>
                <p class="mt-1 text-xs font-semibold text-brand-red">{{ price(featuredAccessory) }}</p>
              </div>
            </NuxtLink>
            <NuxtLink v-else to="/accessories" class="group block overflow-hidden rounded-xl border border-white/[0.07]" @click="notifyNavigate">
              <div class="relative aspect-[16/10] overflow-hidden bg-black">
                <img src="/images/bikes/tekken-2.jpeg" alt="Accessories" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div class="p-4"><p class="text-sm font-semibold text-white">Gear Up Your Ride</p></div>
            </NuxtLink>
          </div>
        </div>

        <!-- ============ APPAREL ============ -->
        <div v-else class="grid gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <p class="mb-4 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">Shop by Type</p>
            <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <NuxtLink
                v-for="t in apparelTypes"
                :key="t"
                :to="{ path: '/apparel', query: { type: t } }"
                class="group flex flex-col items-center gap-2 rounded-xl border border-white/[0.04] px-2 py-4 text-center transition-colors hover:border-brand-red/40 hover:bg-white/[0.04]"
                @click="notifyNavigate"
              >
                <span class="flex h-9 w-9 items-center justify-center rounded-full bg-brand-red/10 text-brand-red transition-transform group-hover:scale-110">
                  <component :is="gearIcon(t)" class="h-4 w-4" />
                </span>
                <span class="text-xs font-semibold text-brand-light/85 group-hover:text-white">{{ t }}</span>
              </NuxtLink>
            </div>
            <div class="mt-5 flex items-center gap-2 text-xs text-brand-grey">
              <Ruler class="h-3.5 w-3.5 text-brand-red" />
              Sizes <span class="font-semibold text-brand-light">{{ sizes.join(' · ') }}</span>
            </div>
          </div>

          <div>
            <p class="mb-4 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">Featured Apparel</p>
            <NuxtLink
              v-if="featuredApparel"
              :to="`/apparel/${featuredApparel.id}`"
              class="group block overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-transparent transition-colors hover:border-brand-red/40"
              @click="notifyNavigate"
            >
              <div class="relative aspect-[16/10] overflow-hidden bg-black">
                <img :src="img(featuredApparel)" :alt="featuredApparel.name" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div class="p-4">
                <p class="truncate text-sm font-semibold text-white group-hover:text-brand-red">{{ featuredApparel.name }}</p>
                <p class="mt-1 text-xs font-semibold text-brand-red">{{ price(featuredApparel) }}</p>
              </div>
            </NuxtLink>
            <NuxtLink v-else to="/apparel" class="group block overflow-hidden rounded-xl border border-white/[0.07]" @click="notifyNavigate">
              <div class="relative aspect-[16/10] overflow-hidden bg-black">
                <img src="/images/bikes/tekken-3.jpg" alt="Apparel" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div class="p-4"><p class="text-sm font-semibold text-white">Ride in Style</p></div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, CalendarClock, Sparkles, Ruler, Package } from 'lucide-vue-next'
import {
  Zap, Mountain, Compass, Flame, Waves, Bike as BikeIcon, BatteryCharging,
  HardHat, ShoppingBag, Shirt, Lock, Wrench, Lightbulb, Layers, Wind, Umbrella, Footprints,
} from 'lucide-vue-next'
import { useCatalogStore } from '~/stores/catalog'
import { usePB } from '~/composables/usePocketBase'

const props = defineProps<{ kind: 'motorcycles' | 'accessories' | 'apparel'; open: boolean }>()
const emit = defineEmits<{ navigate: [] }>()

const store = useCatalogStore()
const pb = usePB()

const BIKE_TYPES = ['Sport', 'Adventure', 'Touring', 'Naked', 'Cruiser', 'Dirt', 'Scooter', 'Electric']
const ACCESSORY_CATEGORIES = ['Helmets', 'Gloves', 'Covers', 'Locks', 'Bags', 'Tools', 'Electronics', 'Lighting', 'Other']
const APPAREL_TYPES = ['T-Shirts', 'Jackets', 'Hoodies', 'Caps', 'Gloves', 'Pants', 'Vests', 'Other']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']

const bikeTypes = BIKE_TYPES
const accessoryCategories = ACCESSORY_CATEGORIES
const apparelTypes = APPAREL_TYPES
const sizes = SIZES

const title = computed(() => ({ motorcycles: 'Motorcycles', accessories: 'Accessories', apparel: 'Apparel' })[props.kind])
const allLink = computed(() => ({ motorcycles: '/motorcycles', accessories: '/accessories', apparel: '/apparel' })[props.kind])

const bikeQuick = [
  { label: 'All Motorcycles', to: '/motorcycles' },
  { label: 'Brands', to: '/brands' },
  { label: 'Compare', to: '/motorcycles/compare' },
  { label: 'New Arrivals', to: '/new-arrivals' },
  { label: 'Finance', to: '/finance' },
  { label: 'Book a Service', to: '/service/booking' },
]

const featuredBike = computed(() => store.motorcycles.find((b: any) => b.featured) || store.motorcycles[0] || null)
const latestBike = computed(() => {
  const sorted = [...(store.motorcycles as any[])].filter(b => b.status !== 'sold')
  return sorted.find((b: any) => b.new_arrival) || sorted[0] || null
})
const featuredAccessory = computed(() => store.accessories[0] || null)
const featuredApparel = computed(() => store.apparel[0] || null)

function typeCount(t: string): number {
  return (store.motorcycles || []).filter((b: any) => b.type === t && b.status !== 'sold').length
}

function bikeTypeIcon(t: string) {
  const map: Record<string, object> = {
    Sport: Zap, Adventure: Mountain, Touring: Compass, Naked: Flame,
    Cruiser: Waves, Dirt: BikeIcon, Scooter: BikeIcon, Electric: BatteryCharging,
  }
  return map[t] || Package
}

function gearIcon(label: string) {
  const map: Record<string, object> = {
    Helmets: HardHat, Gloves: Wrench, Covers: Layers, Locks: Lock, Bags: ShoppingBag,
    Tools: Wrench, Electronics: Lightbulb, Lighting: Lightbulb, Other: Package,
    'T-Shirts': Shirt, Jackets: Shirt, Hoodies: Shirt, Caps: Layers,
    Pants: Shirt, Vests: Wind, 'Rain Gear': Umbrella, Boots: Footprints,
  }
  return map[label] || Package
}

function img(item: any): string {
  const file = Array.isArray(item?.images) ? item.images[0] : item?.image
  if (!file) return ''
  try { return pb.files.getURL(item, file, { thumb: '400x0' }) } catch { return '' }
}
function price(item: any): string {
  const v = Number(item?.sale_price || item?.price || 0)
  return v > 0 ? `KSh ${v.toLocaleString('en-KE')}` : ''
}
function bikePath(b: any): string {
  return `/motorcycles/${b.slug || encodeURIComponent(b.name)}`
}
function notifyNavigate() { emit('navigate') }
</script>