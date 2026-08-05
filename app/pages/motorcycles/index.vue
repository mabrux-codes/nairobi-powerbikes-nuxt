<template>
  <div class="min-h-screen bg-brand-black text-white">
    <ShopHero
      title="Motorcycles"
      accent="Collection"
      eyebrow="Nairobi's Premier Motorcycle Dealership"
      description="Discover our latest collection of premium motorcycles. From aggressive sport machines to long-haul adventure tourers, find the machine that matches your riding DNA."
      :image="'/images/bikes/qj-motor.jpeg'"
      crumb="Shop"
      crumb-to="/"
      :stats="heroStats"
    >
      <template #actions>
        <Button :to="'/service/test-ride'" variant="primary" size="lg"><CalendarClock class="h-5 w-5" />Book a Test Ride</Button>
        <Button :to="'/finance'" variant="secondary" size="lg"><BadgeDollarSign class="h-5 w-5" />Explore Finance</Button>
      </template>
    </ShopHero>

    <div class="mx-auto max-w-[90rem] px-4 pb-24 sm:px-6 lg:px-8">
      <!-- Category chips -->
      <div class="mt-10 flex flex-wrap items-center gap-2" role="listbox" aria-label="Filter by category">
        <button
          v-for="chip in categoryChips"
          :key="chip.label"
          class="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
          :class="filters.type === chip.label
            ? 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/25'
            : 'border-white/10 text-brand-light/70 hover:border-brand-red/50 hover:text-brand-red'"
          :aria-pressed="filters.type === chip.label"
          @click="filters.type = filters.type === chip.label ? '' : chip.label"
        >
          {{ chip.label }}
          <span class="rounded-full px-1.5 py-0.5 text-[10px] font-bold" :class="filters.type === chip.label ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-brand-grey'">{{ chip.count }}</span>
        </button>
      </div>

      <div class="mt-8 lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
        <!-- Desktop sticky filters -->
        <aside class="hidden lg:block">
          <div class="sticky top-28 rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-6">
            <div class="mb-5 flex items-center justify-between">
              <h2 class="font-heading text-lg text-white">Filters</h2>
              <span v-if="activeCount" class="flex h-6 items-center rounded-full bg-brand-red px-2 text-xs font-bold text-white">{{ activeCount }} active</span>
            </div>
            <ShopFilterPanel :kind="'bike'" :filters="filters" :options="filterOptions" />
            <button
              v-if="activeCount"
              class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-brand-light/80 transition-colors hover:border-brand-red/50 hover:text-brand-red"
              @click="resetFilters"
            >
              <RotateCcw class="h-4 w-4" />Clear All Filters
            </button>
          </div>
        </aside>

        <!-- Content -->
        <div>
          <div class="sticky top-[4.5rem] z-30 -mx-4 mb-6 border-b border-white/[0.06] bg-brand-black/85 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:rounded-2xl sm:border sm:px-5">
            <div class="flex flex-wrap items-center gap-3">
              <div class="relative min-w-0 flex-1 sm:max-w-xs">
                <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" />
                <input v-model="searchInput" type="text" placeholder="Search make or model…" class="input-field h-10 rounded-xl pl-10 focus:ring-2 focus:ring-brand-red/30" aria-label="Search motorcycles" />
              </div>
              <div class="flex items-center gap-2">
                <select v-model="filters.sort" class="input-field h-10 w-auto appearance-none rounded-xl text-sm" aria-label="Sort motorcycles">
                  <option v-for="o in sortOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
                </select>
                <button
                  class="flex h-10 items-center gap-2 rounded-xl border border-white/10 px-3.5 text-sm font-semibold text-brand-light/80 transition-colors hover:border-brand-red/50 hover:text-brand-red lg:hidden"
                  aria-label="Open filters"
                  @click="drawerOpen = true"
                >
                  <SlidersHorizontal class="h-4 w-4" />
                  <span v-if="activeCount" class="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-red px-1 text-[10px] font-bold text-white">{{ activeCount }}</span>
                  Filters
                </button>
              </div>
              <p class="ml-auto hidden text-sm text-brand-grey sm:block">{{ visible.length }} model{{ visible.length === 1 ? '' : 's' }} found</p>
            </div>
          </div>

          <!-- Grid / skeletons / empty -->
          <template v-if="loading">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <ShopSkeletonCard v-for="i in 8" :key="i" />
            </div>
          </template>
          <template v-else-if="pageItems.length">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <motion.div
                v-for="(bike, i) in pageItems"
                :key="bike.id"
                :initial="{ opacity: 0, y: 28 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ delay: (i % 8) * 0.06, duration: 0.45, ease: 'easeOut' }"
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

            <div class="mt-14">
              <ShopPagination :page="page" :total="totalPages" :total-count="visible.length" :page-size="PAGE_SIZE" @update:page="page = $event" />
            </div>
          </template>
          <ShopEmptyState v-else kind="bike" :on-clear="resetFilters" />
        </div>
      </div>
    </div>

    <ShopFilterDrawer :open="drawerOpen" kind="bike" @close="drawerOpen = false" @clear="resetFilters">
      <ShopFilterPanel :kind="'bike'" :filters="filters" :options="filterOptions" />
    </ShopFilterDrawer>

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
import { Search, SlidersHorizontal, RotateCcw, CalendarClock, BadgeDollarSign } from 'lucide-vue-next'
import { useDebounceFn } from '@vueuse/core'
import { useCatalogStore } from '~/stores/catalog'
import { useWishlist } from '~/composables/useWishlist'
import { useCatalogFilters, SORT_OPTIONS } from '~/composables/useCatalogFilters'

useHead({
  title: 'Motorcycles For Sale in Nairobi - Nairobi Powerbikes',
  meta: [{ name: 'description', content: 'Browse our full collection of new and used motorcycles for sale in Nairobi. Sport, adventure, naked and touring bikes from leading brands.' }],
})

const store = useCatalogStore()
const route = useRoute()
const wishlist = useWishlist()

const { filters, activeCount, filterAndSort, reset } = useCatalogFilters('bike')
const sortOptions = SORT_OPTIONS.bike
const loading = ref(true)
const page = ref(1)
const drawerOpen = ref(false)
const quickViewOpen = ref(false)
const quickViewItem = ref<any>(null)
const enquiryOpen = ref(false)
const enquiryItem = ref<any>(null)

const PAGE_SIZE = 8

const BIKE_TYPES = ['Sport', 'Cruiser', 'Touring', 'Adventure', 'Naked', 'Dirt', 'Scooter', 'Electric']

const visible = computed(() => filterAndSort(store.motorcycles))

const categoryChips = computed(() => {
  const counts = new Map<string, number>()
  for (const b of store.motorcycles) {
    if (b.type) counts.set(b.type, (counts.get(b.type) || 0) + 1)
  }
  if (!counts.size) {
    return BIKE_TYPES.map(t => ({ label: t, count: 0 }))
  }
  return [...counts.entries()].map(([label, count]) => ({ label, count }))
})

const filterOptions = computed(() => ({
  brands: store.brands,
  types: BIKE_TYPES,
  categories: [] as string[],
  sizes: [] as string[],
  colors: [] as string[],
}))

const heroStats = computed(() => {
  const available = store.motorcycles.filter(b => b.status !== 'sold')
  const inStock = available.filter(b => b.in_stock).length
  const brands = new Set(available.map(b => b.brand).filter(Boolean)).size
  const prices = available.map(b => Number(b.sale_price || b.price || 0)).filter(p => p > 0)
  const fromPrice = prices.length ? Math.min(...prices) : 0
  const featured = available.filter(b => b.featured).length
  return [
    { label: 'Models Available', value: available.length },
    { label: 'Featured Bikes', value: featured },
    { label: 'Brands', value: brands || '—' },
    { label: 'From', value: fromPrice ? `KSh ${fromPrice.toLocaleString('en-KE')}` : '—' },
  ]
})

const totalPages = computed(() => Math.max(1, Math.ceil(visible.value.length / PAGE_SIZE)))
const pageItems = computed(() => visible.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

const searchInput = ref('')
const debouncedSearch = useDebounceFn((val: string) => { filters.search = val; page.value = 1 }, 250)
watch(searchInput, (val) => debouncedSearch(val))
watch(filters, () => { page.value = 1 }, { deep: true })

function bikePath(b: any) {
  return `/motorcycles/${b.slug || encodeURIComponent(b.name)}`
}

function resetFilters() {
  reset()
  searchInput.value = ''
  page.value = 1
}

function openQuickView(b: any) { quickViewItem.value = b; quickViewOpen.value = true }
function openEnquiry(b: any) { enquiryItem.value = b; enquiryOpen.value = true }

onMounted(async () => {
  if (typeof route.query.type === 'string' && route.query.type) filters.type = route.query.type
  await store.ensureActive()
  loading.value = false
  await wishlist.load()
})

onUnmounted(() => { store.release() })
</script>