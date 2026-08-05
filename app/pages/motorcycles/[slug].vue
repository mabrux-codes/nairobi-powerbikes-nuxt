<template>
  <div class="min-h-screen bg-brand-black text-white">
    <div v-if="loading" class="mx-auto max-w-[90rem] px-4 py-24 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2">
        <ShopSkeletonCard />
        <div class="space-y-5">
          <div class="h-3 w-40 animate-pulse rounded bg-white/[0.06]" />
          <div class="h-12 w-3/4 animate-pulse rounded bg-white/[0.08]" />
          <div class="h-4 w-56 animate-pulse rounded bg-white/[0.05]" />
          <div class="h-10 w-48 animate-pulse rounded bg-brand-red/20" />
          <div class="h-24 w-full animate-pulse rounded-2xl bg-white/[0.04]" />
        </div>
      </div>
    </div>

    <template v-else-if="item">
      <!-- Breadcrumb -->
      <div class="mx-auto max-w-[90rem] px-4 pt-[calc(var(--nav-h)+24px)] sm:px-6 lg:px-8">
        <nav class="flex items-center gap-2 text-xs font-display tracking-wider text-brand-grey uppercase" aria-label="Breadcrumb">
          <NuxtLink to="/" class="transition-colors hover:text-brand-red">Home</NuxtLink>
          <ChevronRight class="h-3 w-3" />
          <NuxtLink to="/motorcycles" class="transition-colors hover:text-brand-red">Motorcycles</NuxtLink>
          <ChevronRight class="h-3 w-3" />
          <span class="text-brand-red">{{ item.name }}</span>
        </nav>
      </div>

      <!-- Main -->
      <div class="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div class="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <!-- Gallery -->
          <motion.div :initial="{ opacity: 0, x: -30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.6 }">
            <div class="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-black">
              <button
                class="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden focus-visible:outline-none"
                :aria-label="'View larger image of ' + item.name"
                @click="lightboxOpen = true"
                @pointerdown="onDragStart"
                @pointermove="onDragMove"
                @pointerup="onDragEnd"
                @pointerleave="onDragEnd"
              >
                <img
                  :src="mainImageUrl"
                  :alt="item.name"
                  class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <span v-if="images.length > 1" class="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[11px] font-bold tracking-wider backdrop-blur-md">
                  <Move3D class="h-3.5 w-3.5" />Drag to rotate
                </span>
              </button>

              <div v-if="images.length > 1" class="absolute inset-x-0 bottom-0 flex justify-center gap-2 p-3">
                <button
                  v-for="(img, i) in images"
                  :key="img"
                  class="h-16 w-16 overflow-hidden rounded-xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
                  :class="i === activeImage ? 'border-brand-red' : 'border-transparent opacity-50 hover:opacity-100'"
                  :aria-label="`View image ${i + 1} of ${item.name}`"
                  @click="activeImage = i"
                >
                  <img :src="pb.files.getURL(item, img, { thumb: '120x0' })" :alt="`${item.name} ${i + 1}`" class="h-full w-full object-cover" />
                </button>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-3 gap-3">
              <div v-for="t in trustItems" :key="t.label" class="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
                <component :is="t.icon" class="h-5 w-5 shrink-0 text-brand-red" />
                <div>
                  <p class="text-xs font-bold text-white">{{ t.label }}</p>
                  <p class="text-[11px] text-brand-grey">{{ t.value }}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <!-- Info -->
          <motion.div :initial="{ opacity: 0, x: 30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.6, delay: 0.1 }">
            <div class="flex flex-wrap items-center gap-2">
              <span class="flex items-center gap-1.5 rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">
                <span class="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-red" />
                {{ availabilityLabel }}
              </span>
              <span v-if="item.featured" class="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">Featured</span>
              <span v-if="item.new_arrival" class="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold tracking-wider uppercase">New Arrival</span>
            </div>

            <p class="mt-5 font-display text-sm tracking-[0.26em] text-brand-red uppercase">{{ brandName }}</p>
            <h1 class="mt-2 font-heading text-4xl leading-[1.05] text-white sm:text-5xl lg:text-6xl">{{ item.name }}</h1>
            <p class="mt-2 text-sm font-medium text-brand-grey">{{ metaLine }}</p>

            <div class="mt-6 flex items-end gap-4">
              <p class="font-heading text-5xl text-brand-red">{{ formatPrice(currentPrice) }}</p>
              <div class="pb-1.5">
                <p v-if="item.sale_price" class="text-lg font-semibold text-brand-grey/70 line-through">{{ formatPrice(item.price) }}</p>
                <p v-if="discount" class="text-sm font-bold text-emerald-400">Save {{ discount }}</p>
              </div>
            </div>

            <p v-if="item.description" class="mt-6 leading-relaxed text-brand-light/75">{{ item.description }}</p>

            <div class="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div v-for="s in specHighlights" :key="s.label" class="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent px-4 py-3.5 text-center">
                <p class="text-[10px] font-display tracking-wider text-brand-grey uppercase">{{ s.label }}</p>
                <p class="mt-1 truncate text-sm font-bold text-white" :title="s.value">{{ s.value }}</p>
              </div>
            </div>

            <div v-if="colors.length" class="mt-7">
              <p class="text-[11px] font-display tracking-wider text-brand-grey uppercase">Available Colours</p>
              <div class="mt-2.5 flex flex-wrap gap-2">
                <span v-for="c in colors" :key="c" class="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-sm font-medium text-brand-light/85">{{ c }}</span>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <Button v-if="!isComingSoon" :to="`/service/test-ride?motorcycle=${item.id}`" variant="primary" size="lg">
                <CalendarClock class="h-5 w-5" />Book Test Ride
              </Button>
              <Button :to="`/finance?motorcycle=${item.id}`" variant="secondary" size="lg">
                <BadgeDollarSign class="h-5 w-5" />Finance Options
              </Button>
              <Button variant="ghost" size="lg" @click="wishlist.toggle('bike', item)">
                <Heart class="h-5 w-5" :class="{ 'fill-brand-red text-brand-red': isSaved }" :aria-hidden="true" />
                {{ isSaved ? 'Saved' : 'Save' }}
              </Button>
              <Button variant="ghost" size="lg" @click="addToCompare">
                <Scale class="h-5 w-5" />Compare
              </Button>
            </div>

            <div class="mt-4 flex flex-wrap gap-3">
              <Button variant="secondary" @click="enquiryOpen = true"><MessageSquare class="h-4 w-4" />Make an Enquiry</Button>
              <Button variant="ghost" @click="share"><Share2 class="h-4 w-4" />Share</Button>
            </div>

            <div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-xs text-brand-grey">
              <span class="flex items-center gap-1.5"><ShieldCheck class="h-4 w-4 text-brand-red" />{{ item.warranty || 'Dealer warranty available' }}</span>
              <span class="flex items-center gap-1.5"><PackageCheck class="h-4 w-4 text-brand-red" />Finance available on all models</span>
            </div>
          </motion.div>
        </div>

        <!-- Full specifications -->
        <motion.section class="mt-20" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="text-[11px] font-display tracking-[0.24em] text-brand-red uppercase">Performance Data</p>
              <h2 class="mt-1 font-heading text-4xl text-white">Full Specifications</h2>
            </div>
          </div>
          <div class="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="(spec, i) in fullSpecs" :key="spec.key" class="group flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent px-5 py-4 transition-colors duration-200 hover:border-brand-red/30">
              <p class="text-sm text-brand-grey">{{ spec.label }}</p>
              <p class="text-right text-sm font-bold text-white">{{ getSpec(spec.key) }}</p>
            </div>
          </div>
        </motion.section>

        <!-- Available branches -->
        <motion.section v-if="branches.length" class="mt-20" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5, delay: 0.05 }">
          <p class="text-[11px] font-display tracking-[0.24em] text-brand-red uppercase">Showrooms</p>
          <h2 class="mt-1 font-heading text-4xl text-white">Available Branches</h2>
          <div class="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="b in branches" :key="b.id" class="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent p-5 transition-colors duration-200 hover:border-brand-red/30">
              <MapPin class="h-5 w-5 text-brand-red" />
              <h3 class="mt-3 font-display text-lg font-bold text-white">{{ b.name }}</h3>
              <p class="mt-1.5 text-xs leading-relaxed text-brand-grey">{{ b.address }}</p>
              <p class="mt-2 text-xs text-brand-light/70">{{ b.phone }}</p>
              <p v-if="b.hours" class="mt-1 text-[11px] text-brand-grey">{{ b.hours }}</p>
            </div>
          </div>
        </motion.section>

        <!-- Related motorcycles -->
        <motion.section class="mt-20" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5, delay: 0.1 }">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="text-[11px] font-display tracking-[0.24em] text-brand-red uppercase">From the same family</p>
              <h2 class="mt-1 font-heading text-4xl text-white">Related Motorcycles</h2>
            </div>
            <NuxtLink to="/motorcycles" class="hidden text-sm font-semibold text-brand-light/70 transition-colors hover:text-brand-red sm:block">View all →</NuxtLink>
          </div>
          <div v-if="related.length" class="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ShopProductCard
              v-for="b in related"
              :key="b.id"
              :item="b"
              kind="bike"
              :href="bikePath(b)"
              :saved="wishlist.isSaved('bike', b.id)"
              @toggle-wishlist="wishlist.toggle('bike', b)"
              @quick-view="quickViewItem = b; quickViewOpen = true"
              @enquire="enquiryItem = b; enquiryOpen = true"
            />
          </div>
        </motion.section>

        <!-- Recommended gear -->
        <motion.section class="mt-20" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5, delay: 0.15 }">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="text-[11px] font-display tracking-[0.24em] text-brand-red uppercase">Complete the ride</p>
              <h2 class="mt-1 font-heading text-4xl text-white">Recommended Accessories</h2>
            </div>
            <NuxtLink to="/accessories" class="hidden text-sm font-semibold text-brand-light/70 transition-colors hover:text-brand-red sm:block">View all →</NuxtLink>
          </div>
          <div v-if="recommendedAccessories.length" class="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ShopProductCard
              v-for="a in recommendedAccessories"
              :key="a.id"
              :item="a"
              kind="accessory"
              :href="`/accessories/${a.id}`"
              :saved="wishlist.isSaved('accessory', a.id)"
              @toggle-wishlist="wishlist.toggle('accessory', a)"
              @quick-view="quickViewItem = a; quickViewOpen = true"
              @enquire="enquiryItem = a; enquiryOpen = true"
            />
          </div>
        </motion.section>

        <motion.section class="mt-20" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5, delay: 0.2 }">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="text-[11px] font-display tracking-[0.24em] text-brand-red uppercase">Ride in style</p>
              <h2 class="mt-1 font-heading text-4xl text-white">Recommended Riding Gear</h2>
            </div>
            <NuxtLink to="/apparel" class="hidden text-sm font-semibold text-brand-light/70 transition-colors hover:text-brand-red sm:block">View all →</NuxtLink>
          </div>
          <div v-if="recommendedApparel.length" class="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ShopProductCard
              v-for="ap in recommendedApparel"
              :key="ap.id"
              :item="ap"
              kind="apparel"
              :href="`/apparel/${ap.id}`"
              :saved="wishlist.isSaved('apparel', ap.id)"
              @toggle-wishlist="wishlist.toggle('apparel', ap)"
              @quick-view="quickViewItem = ap; quickViewOpen = true"
              @enquire="enquiryItem = ap; enquiryOpen = true"
            />
          </div>
        </motion.section>
      </div>

      <!-- Lightbox -->
      <Teleport to="body">
        <Transition name="quickview">
          <div v-if="lightboxOpen" class="fixed inset-0 z-[95] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" aria-label="Image viewer" @click.self="lightboxOpen = false">
            <button class="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-red hover:text-brand-red" aria-label="Close image viewer" @click="lightboxOpen = false">
              <X class="h-5 w-5" />
            </button>
            <img :src="mainImageUrl" :alt="item.name" class="max-h-[85vh] max-w-full rounded-2xl object-contain" />
            <div v-if="images.length > 1" class="absolute bottom-6 flex gap-2">
              <button v-for="(img, i) in images" :key="img" class="h-14 w-14 overflow-hidden rounded-lg border-2" :class="i === activeImage ? 'border-brand-red' : 'border-white/20'" :aria-label="`View image ${i + 1}`" @click="activeImage = i">
                <img :src="pb.files.getURL(item, img, { thumb: '120x0' })" :alt="`${item.name} ${i + 1}`" class="h-full w-full object-cover" />
              </button>
            </div>
          </div>
        </Transition>
      </Teleport>

      <ShopQuickViewModal
        :open="quickViewOpen"
        :item="quickViewItem"
        :kind="quickViewKind"
        :href="quickViewHref"
        :saved="quickViewSaved"
        @close="quickViewOpen = false"
        @toggle-wishlist="quickViewItem && wishlist.toggle(quickViewKind, quickViewItem)"
        @enquire="enquiryItem = quickViewItem; enquiryOpen = true"
      />

      <ShopEnquiryModal :open="enquiryOpen" :item="enquiryItem" :kind="enquiryKind" @close="enquiryOpen = false" />
    </template>

    <div v-else class="mx-auto max-w-[90rem] px-4 py-32 sm:px-6 lg:px-8">
      <ShopEmptyState kind="bike" />
      <div class="mt-8 text-center">
        <Button to="/motorcycles" variant="primary">Browse All Motorcycles</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import {
  ChevronRight, Move3D, Heart, Scale, CalendarClock, BadgeDollarSign,
  MessageSquare, Share2, ShieldCheck, PackageCheck, MapPin, X,
} from 'lucide-vue-next'
import { useCatalogStore } from '~/stores/catalog'
import { useWishlist } from '~/composables/useWishlist'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import type { CatalogKind } from '~/composables/useCatalogFilters'

useHead({ title: 'Motorcycle Details - Nairobi Powerbikes' })

const route = useRoute()
const store = useCatalogStore()
const pb = usePB()
const toast = useToast()
const wishlist = useWishlist()

const loading = ref(true)
const activeImage = ref(0)
const lightboxOpen = ref(false)
const quickViewOpen = ref(false)
const quickViewItem = ref<any>(null)
const enquiryOpen = ref(false)
const enquiryItem = ref<any>(null)
const branches = ref<any[]>([])

const item = computed(() => {
  const slug = route.params.slug as string
  return (
    store.motorcycles.find(b => b.slug === slug)
    || store.motorcycles.find(b => b.id === slug)
    || store.motorcycles.find(b => b.name === slug)
    || null
  )
})

watch(item, (b) => {
  if (b) {
    useHead({ title: `${b.name} - Nairobi Powerbikes` })
    activeImage.value = 0
  }
})

const images = computed(() => item.value?.images || [])
const mainImageUrl = computed(() => {
  if (!item.value) return ''
  const list = images.value
  if (!list.length) return ''
  return pb.files.getURL(item.value, list[Math.min(activeImage.value, list.length - 1)], { thumb: '1200x0' })
})

const brandName = computed(() => item.value?.brand_name || item.value?.expand?.brand?.name || 'Nairobi Powerbikes')
const metaLine = computed(() => {
  if (!item.value) return ''
  return [item.value.year, item.value.type, item.value.engine_cc ? `${item.value.engine_cc}cc` : '', item.value.transmission]
    .filter(Boolean).join('  ·  ')
})

const availabilityLabel = computed(() => {
  if (!item.value) return ''
  if (item.value.status === 'coming_soon') return 'Coming Soon'
  if (item.value.status === 'sold') return 'Sold'
  return item.value.in_stock ? 'In Stock' : 'Low Stock'
})

const isComingSoon = computed(() => item.value?.status === 'coming_soon')
const currentPrice = computed(() => (item.value?.sale_price || item.value?.price) ?? 0)
const discount = computed(() => {
  if (!item.value?.sale_price || !item.value?.price || item.value.sale_price >= item.value.price) return ''
  return `${Math.round((1 - item.value.sale_price / item.value.price) * 100)}%`
})

const colors = computed(() => {
  const c = item.value?.colors
  return c ? String(c).split(',').map((x: string) => x.trim()).filter(Boolean) : []
})

const specHighlights = computed(() => {
  const it = item.value
  if (!it) return []
  const out: { label: string; value: string }[] = []
  const add = (label: string, val: any, suffix = '') => { if (val != null && val !== '') out.push({ label, value: `${val}${suffix}` }) }
  add('Engine', it.engine_cc, 'cc')
  add('Power', it.horsepower, ' hp')
  add('Torque', it.torque)
  add('Transmission', it.transmission)
  add('Top Speed', it.top_speed)
  add('Fuel Tank', it.fuel_capacity)
  return out
})

const fullSpecs = [
  { key: 'brand_name', label: 'Brand' },
  { key: 'year', label: 'Year' },
  { key: 'type', label: 'Type' },
  { key: 'engine', label: 'Engine' },
  { key: 'engine_cc', label: 'Engine Displacement' },
  { key: 'horsepower', label: 'Horsepower' },
  { key: 'torque', label: 'Torque' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'fuel_system', label: 'Fuel System' },
  { key: 'cooling', label: 'Cooling System' },
  { key: 'starter', label: 'Starter' },
  { key: 'ignition', label: 'Ignition' },
  { key: 'battery', label: 'Battery' },
  { key: 'headlight', label: 'Headlight' },
  { key: 'fuel_capacity', label: 'Fuel Tank Capacity' },
  { key: 'seat_height', label: 'Seat Height' },
  { key: 'ground_clearance', label: 'Ground Clearance' },
  { key: 'weight', label: 'Weight' },
  { key: 'top_speed', label: 'Top Speed' },
  { key: 'braking', label: 'Braking System' },
  { key: 'suspension', label: 'Suspension' },
  { key: 'colors', label: 'Colours' },
  { key: 'warranty', label: 'Warranty' },
]

const trustItems = computed(() => {
  const it = item.value
  if (!it) return []
  return [
    { icon: ShieldCheck, label: 'Warranty', value: it.warranty || 'Dealer warranty' },
    { icon: PackageCheck, label: 'Stock', value: isComingSoon.value ? 'Pre-order' : (it.in_stock ? 'Available now' : 'Contact dealer') },
    { icon: BadgeDollarSign, label: 'Finance', value: 'Flexible plans' },
  ]
})

function getSpec(key: string): string {
  const it = item.value
  if (!it) return '—'
  const v = (it as any)[key]
  if (key === 'brand_name') return brandName.value
  if (key === 'colors') return colors.value.join(', ') || '—'
  return v != null && v !== '' ? String(v) : '—'
}

const related = computed(() => {
  if (!item.value) return []
  return store.motorcycles
    .filter(b => b.brand === item.value?.brand && b.id !== item.value?.id)
    .slice(0, 4)
})

const recommendedAccessories = computed(() => store.accessories.slice(0, 4))
const recommendedApparel = computed(() => store.apparel.slice(0, 4))

const quickViewKind = computed<CatalogKind>(() => {
  const t = quickViewItem.value
  if (!t) return 'bike'
  return store.motorcycles.some(b => b.id === t.id) ? 'bike' : store.accessories.some(a => a.id === t.id) ? 'accessory' : 'apparel'
})
const quickViewHref = computed(() => {
  const t = quickViewItem.value
  if (!t) return '#'
  const k = quickViewKind.value
  if (k === 'bike') return bikePath(t)
  if (k === 'accessory') return `/accessories/${t.id}`
  return `/apparel/${t.id}`
})
const quickViewSaved = computed(() => {
  const t = quickViewItem.value
  if (!t) return false
  return wishlist.isSaved(quickViewKind.value, t.id)
})
const enquiryKind = computed<CatalogKind>(() => quickViewKind.value)

const isSaved = computed(() => item.value ? wishlist.isSaved('bike', item.value.id) : false)

function bikePath(b: any) {
  return `/motorcycles/${b.slug || encodeURIComponent(b.name)}`
}

function formatPrice(v: number) { return `KSh ${Number(v).toLocaleString('en-KE')}` }

function addToCompare() { navigateTo('/motorcycles/compare') }

async function share() {
  if (!item.value) return
  const url = window.location.href
  try {
    if (navigator.share) {
      await navigator.share({ title: item.value.name, url })
      return
    }
  } catch { /* user dismissed */ }
  try {
    await navigator.clipboard.writeText(url)
    toast.add({ type: 'success', title: 'Link copied', message: 'Share link copied to clipboard.' })
  } catch {
    toast.add({ type: 'info', title: 'Share', message: url })
  }
}

// drag-to-rotate between gallery images
const dragState = { x: 0, dragging: false }
function onDragStart(e: PointerEvent) {
  if (images.value.length < 2) return
  dragState.x = e.clientX
  dragState.dragging = true
}
function onDragMove(e: PointerEvent) {
  if (!dragState.dragging || images.value.length < 2) return
  const dx = e.clientX - dragState.x
  if (Math.abs(dx) > 60) {
    const dir = dx > 0 ? -1 : 1
    activeImage.value = (activeImage.value + dir + images.value.length) % images.value.length
    dragState.x = e.clientX
  }
}
function onDragEnd() { dragState.dragging = false }

onMounted(async () => {
  await store.ensureActive()
  loading.value = false
  await Promise.all([
    wishlist.load(),
    pb.collection('branches').getFullList({ sort: 'sort_order' }).then(r => { branches.value = r }).catch(() => {}),
  ])
})

onUnmounted(() => { store.release() })
</script>