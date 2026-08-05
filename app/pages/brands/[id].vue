<template>
  <div class="min-h-screen bg-brand-black pb-24">
    <div v-if="loading" class="mx-auto max-w-[90rem] px-4 pt-28 sm:px-6 lg:px-8">
      <div class="animate-pulse space-y-6">
        <div class="h-4 w-40 rounded bg-white/[0.06]" />
        <div class="h-20 w-64 rounded bg-white/[0.06]" />
        <div class="h-4 w-96 max-w-full rounded bg-white/[0.06]" />
        <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"><div v-for="i in 6" :key="i" class="h-64 rounded-2xl bg-white/[0.04]" /></div>
      </div>
    </div>

    <template v-else-if="brand">
      <section class="relative overflow-hidden border-b border-white/[0.06]">
        <div class="asphalt-grid absolute inset-0" aria-hidden="true" />
        <div class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" aria-hidden="true" />
        <div class="relative z-10 mx-auto max-w-[90rem] px-4 pb-14 pt-28 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" class="mb-9">
            <ol class="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-brand-grey uppercase">
              <li><NuxtLink to="/" class="flex items-center gap-1.5 transition-colors hover:text-brand-red"><Home class="h-3.5 w-3.5" />Home</NuxtLink></li>
              <li class="flex items-center gap-2"><ChevronRight class="h-3.5 w-3.5 text-brand-grey/50" /><NuxtLink to="/brands" class="transition-colors hover:text-brand-red">Brands</NuxtLink></li>
              <li class="flex items-center gap-2"><ChevronRight class="h-3.5 w-3.5 text-brand-grey/50" /><span class="text-brand-red" aria-current="page">{{ brand.name }}</span></li>
            </ol>
          </nav>

          <div class="flex flex-wrap items-center gap-6">
            <img v-if="brand.logo" :src="pb.files.getURL(brand, brand.logo)" :alt="brand.name" class="h-16 max-w-[200px] object-contain" />
            <div v-else class="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-red to-red-700">
              <span class="font-display text-2xl text-white">{{ brand.name.slice(0, 2).toUpperCase() }}</span>
            </div>
            <div>
              <p class="font-display text-xs font-bold tracking-[0.3em] text-brand-red uppercase">Official Dealer</p>
              <h1 class="mt-1 font-heading text-5xl leading-[1.05] text-white sm:text-6xl">{{ brand.name }}</h1>
              <p v-if="brand.tagline" class="mt-2 text-brand-grey">{{ brand.tagline }}</p>
            </div>
          </div>

          <p v-if="brand.description" class="mt-6 max-w-3xl leading-relaxed text-brand-grey">{{ brand.description }}</p>

          <div class="mt-10 grid max-w-3xl grid-cols-3 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06]">
            <div class="bg-brand-black/90 px-5 py-5">
              <p class="font-heading text-3xl text-white">{{ motorcycles.length }}</p>
              <p class="mt-1 font-display text-[10px] font-semibold tracking-[0.18em] text-brand-grey uppercase">Models Available</p>
            </div>
            <div class="bg-brand-black/90 px-5 py-5">
              <p class="font-heading text-3xl text-white">{{ featuredCount }}</p>
              <p class="mt-1 font-display text-[10px] font-semibold tracking-[0.18em] text-brand-grey uppercase">Featured</p>
            </div>
            <div class="bg-brand-black/90 px-5 py-5">
              <p class="font-heading text-3xl text-white">{{ yearRange }}</p>
              <p class="mt-1 font-display text-[10px] font-semibold tracking-[0.18em] text-brand-grey uppercase">Model Years</p>
            </div>
          </div>
        </div>
      </section>

      <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div class="mt-14">
          <div class="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p class="font-display text-xs font-bold tracking-[0.3em] text-brand-red uppercase">Available Now</p>
              <h2 class="mt-1 font-heading text-4xl text-white sm:text-5xl">{{ brand.name }} <span class="text-brand-red">Motorcycles</span></h2>
            </div>
            <Button to="/motorcycles" variant="ghost" trailing-arrow>All Motorcycles</Button>
          </div>

          <div v-if="motorcyclesLoading" class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ShopSkeletonCard v-for="i in 6" :key="i" />
          </div>

          <div v-else-if="motorcycles.length" class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <motion.div
              v-for="(bike, i) in motorcycles"
              :key="bike.id"
              :initial="{ opacity: 0, y: 24 }"
              :while-in-view="{ opacity: 1, y: 0 }"
              :viewport="{ once: true, margin: '-40px' }"
              :transition="{ delay: (i % 3) * 0.07, duration: 0.45, ease: 'easeOut' }"
            >
              <ShopProductCard
                :item="bike"
                kind="bike"
                :href="bikePath(bike)"
                :saved="wishlist.isSaved('bike', bike.id)"
                @toggle-wishlist="wishlist.toggle('bike', bike)"
                @quick-view="openQuickView(bike)"
                @enquire="openEnquiry(bike)"
              />
            </motion.div>
          </div>

          <div v-else class="mt-8 rounded-2xl border border-dashed border-white/15 p-14 text-center">
            <p class="font-display text-2xl tracking-display text-brand-grey">No motorcycles listed yet</p>
            <p class="mt-2 text-sm text-brand-grey/60">Check back soon for new {{ brand.name }} arrivals</p>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="mx-auto max-w-[90rem] px-4 pt-28 sm:px-6 lg:px-8">
      <div class="rounded-2xl border border-dashed border-white/15 p-16 text-center">
        <p class="font-display text-2xl tracking-display text-brand-grey">Brand Not Found</p>
        <p class="mt-2 text-sm text-brand-grey/60">The brand you're looking for doesn't exist.</p>
        <Button to="/brands" variant="primary" class="mt-6">Browse All Brands</Button>
      </div>
    </div>

    <ShopQuickViewModal
      :open="quickViewOpen"
      :item="quickViewItem"
      kind="bike"
      :href="quickViewItem ? bikePath(quickViewItem) : '#'"
      :saved="quickViewItem ? wishlist.isSaved('bike', quickViewItem.id) : false"
      @close="quickViewOpen = false"
      @toggle-wishlist="quickViewItem && wishlist.toggle('bike', quickViewItem)"
      @enquire="openEnquiry(quickViewItem)"
    />
    <ShopEnquiryModal :open="enquiryOpen" :item="enquiryItem" kind="bike" @close="enquiryOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Home, ChevronRight, LoaderCircle } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useWishlist } from '~/composables/useWishlist'

interface Brand { id: string; name: string; tagline?: string; logo?: string; description?: string }
interface Motorcycle { id: string; name: string; year: number; engine_cc: number; price: number; images?: string[]; brand?: string }

useHead({ title: 'Brand Details - Nairobi Powerbikes' })

function bikePath(b: any) { return `/motorcycles/${b.slug || encodeURIComponent(b.name)}` }
const pb = usePB()
const route = useRoute()
const wishlist = useWishlist()
const loading = ref(true); const brand = ref<Brand | null>(null)
const motorcyclesLoading = ref(true); const motorcycles = ref<Motorcycle[]>([])
let brandId = ''

const quickViewOpen = ref(false)
const quickViewItem = ref<any>(null)
const enquiryOpen = ref(false)
const enquiryItem = ref<any>(null)
function openQuickView(b: any) { quickViewItem.value = b; quickViewOpen.value = true }
function openEnquiry(b: any) { enquiryItem.value = b; enquiryOpen.value = true }

const featuredCount = computed(() => motorcycles.value.filter(m => (m as any).featured).length)
const yearRange = computed(() => {
  const years = motorcycles.value.map(m => m.year).filter(Boolean)
  if (!years.length) return '—'
  return `${Math.min(...years)}–${Math.max(...years)}`
})

const fallbackBrands: Brand[] = [
  { id: 'tekken', name: 'Tekken', tagline: 'Built to Conquer', description: 'Chinese engineering excellence meets bold design.' },
  { id: 'taro-gp', name: 'Taro GP', tagline: 'Race-Bred Performance', description: 'High-performance motorcycles engineered for the track and the street.' },
  { id: 'voge', name: 'Voge', tagline: 'Ride Beyond Limits', description: 'Adventure-ready motorcycles built for the open road.' },
  { id: 'loncin', name: 'Loncin', tagline: 'Powering Your Ride', description: 'Reliable motorcycles and engines trusted worldwide.' },
  { id: 'qj-motor', name: 'QJ Motor', tagline: 'The Future of Motion', description: 'Innovative motorcycles blending style, power, and technology.' },
]

async function loadMotorcycles() {
  if (!brandId) { motorcyclesLoading.value = false; return }
  try {
    const bikes = await pb.collection('motorcycles').getFullList<Motorcycle>({ filter: `brand="${brandId}" && status!="sold"`, sort: '-year,name', expand: 'brand' })
    motorcycles.value = bikes.map(b => ({ ...b, brand_name: (b as any).expand?.brand?.name })) as any
  } catch { motorcycles.value = [] }
  finally { motorcyclesLoading.value = false }
}

onMounted(async () => {
  try {
    const slug = route.params.id as string
    try {
      const found = await pb.collection('brands').getFirstListItem<Brand>(`slug="${slug}"`)
      brand.value = found; brandId = found.id
    } catch {
      try {
        const name = slug.replace(/-/g, ' ')
        const found = await pb.collection('brands').getFirstListItem<Brand>(`name~"${name}"`)
        brand.value = found; brandId = found.id
      } catch {
        try {
          const found = await pb.collection('brands').getOne<Brand>(slug)
          brand.value = found; brandId = found.id
        } catch {
          const fb = fallbackBrands.find(b => b.id === slug || b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug)
          if (fb) { brand.value = fb; brandId = fb.id }
        }
      }
    }
    if (brand.value) useHead({ title: `${brand.value.name} - Nairobi Powerbikes` })
    await Promise.all([loadMotorcycles(), wishlist.load()])
    pb.collection('motorcycles').subscribe('*', () => loadMotorcycles())
  } catch { brand.value = null }
  finally { loading.value = false }
})

onUnmounted(() => { pb.collection('motorcycles').unsubscribe('*') })
</script>