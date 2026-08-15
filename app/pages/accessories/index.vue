<template>
  <div class="min-h-screen bg-brand-black text-white">
    <ShopHero
      title="Accessories"
      accent="& Gear"
      eyebrow="Genuine Motorcycle Accessories"
      description="Upgrade your ride with genuine motorcycle accessories. Helmets, gloves, luggage and performance parts engineered to match your machine — and your style."
      :image="'/images/bikes/tekken-2.jpeg'"
      crumb="Shop"
      crumb-to="/"
      :stats="heroStats"
    >
      <template #actions>
        <Button :to="'/service/booking'" variant="primary" size="lg"><Wrench class="h-5 w-5" />Book a Service</Button>
        <Button :to="'/apparel'" variant="secondary" size="lg"><Shirt class="h-5 w-5" />Browse Apparel</Button>
      </template>
    </ShopHero>

    <div class="mx-auto max-w-[90rem] px-4 pb-24 sm:px-6 lg:px-8">
      <!-- Category chips -->
      <div class="mt-10 flex flex-wrap items-center gap-2" role="listbox" aria-label="Filter by category">
        <button
          v-for="chip in categoryChips"
          :key="chip.label"
          class="flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
          :class="filters.category === chip.label
            ? 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/25'
            : 'border-white/10 text-brand-light/70 hover:border-brand-red/50 hover:text-brand-red'"
          :aria-pressed="filters.category === chip.label"
          @click="filters.category = filters.category === chip.label ? '' : chip.label"
        >
          {{ chip.label }}
          <span class="rounded-full px-1.5 py-0.5 text-[10px] font-bold" :class="filters.category === chip.label ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-brand-grey'">{{ chip.count }}</span>
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
            <ShopFilterPanel :kind="'accessory'" :filters="filters" :options="filterOptions" />
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
                <input v-model="searchInput" type="text" placeholder="Search accessories…" class="input-field h-10 rounded-xl pl-10 focus:ring-2 focus:ring-brand-red/30" aria-label="Search accessories" />
              </div>
              <div class="flex items-center gap-2">
                <select v-model="filters.sort" class="input-field h-10 w-auto appearance-none rounded-xl text-sm" aria-label="Sort accessories">
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
              <p class="ml-auto hidden text-sm text-brand-grey sm:block">{{ visible.length }} item{{ visible.length === 1 ? '' : 's' }} found</p>
            </div>
          </div>

          <template v-if="loading">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <ShopSkeletonCard v-for="i in 8" :key="i" />
            </div>
          </template>
          <template v-else-if="pageItems.length">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <motion.div
                v-for="(a, i) in pageItems"
                :key="a.id"
                :initial="{ opacity: 0, y: 28 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ delay: (i % 8) * 0.06, duration: 0.45, ease: 'easeOut' }"
              >
                <ShopProductCard
                  :item="a"
                  kind="accessory"
                  :href="accessoryPath(a)"
                  :saved="wishlist.isSaved('accessory', a.id)"
                  @toggle-wishlist="wishlist.toggle('accessory', a)"
                  @quick-view="openQuickView(a)"
                  @enquire="openEnquiry(a)"
                />
              </motion.div>
            </div>

            <div class="mt-14">
              <ShopPagination :page="page" :total="totalPages" :total-count="visible.length" :page-size="PAGE_SIZE" @update:page="page = $event" />
            </div>
          </template>
          <ShopEmptyState v-else kind="accessory" :on-clear="resetFilters" />
        </div>
      </div>
    </div>

    <ShopFilterDrawer :open="drawerOpen" kind="accessory" @close="drawerOpen = false" @clear="resetFilters">
      <ShopFilterPanel :kind="'accessory'" :filters="filters" :options="filterOptions" />
    </ShopFilterDrawer>

    <ShopQuickViewModal
      :open="quickViewOpen"
      :item="quickViewItem"
      kind="accessory"
      :href="quickViewItem ? `/accessories/${quickViewItem.id}` : '#'"
      :saved="quickViewItem ? wishlist.isSaved('accessory', quickViewItem.id) : false"
      @close="quickViewOpen = false"
      @toggle-wishlist="quickViewItem && wishlist.toggle('accessory', quickViewItem)"
      @enquire="openEnquiry(quickViewItem)"
    />

    <ShopEnquiryModal :open="enquiryOpen" :item="enquiryItem" kind="accessory" @close="enquiryOpen = false" />
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Search, SlidersHorizontal, RotateCcw, Wrench, Shirt } from 'lucide-vue-next'
import { useDebounceFn } from '@vueuse/core'
import { useCatalogStore } from '~/stores/catalog'
import { accessoryPath } from '~/utils/paths'
import { useWishlist } from '~/composables/useWishlist'
import { useCatalogFilters, SORT_OPTIONS } from '~/composables/useCatalogFilters'

useHead({
  title: 'Motorcycle Accessories in Nairobi - Nairobi Powerbikes',
  meta: [{ name: 'description', content: 'Shop premium motorcycle accessories in Nairobi. Helmets, gloves, covers, luggage, lighting and more — genuine Powerbikes gear.' }],
})

const store = useCatalogStore()
const route = useRoute()
const wishlist = useWishlist()

const { filters, activeCount, filterAndSort, reset } = useCatalogFilters('accessory')
const sortOptions = SORT_OPTIONS.accessory
const loading = ref(true)
const page = ref(1)
const drawerOpen = ref(false)
const quickViewOpen = ref(false)
const quickViewItem = ref<any>(null)
const enquiryOpen = ref(false)
const enquiryItem = ref<any>(null)

const PAGE_SIZE = 8
const FALLBACK_CATEGORIES = ['Helmets', 'Gloves', 'Covers', 'Locks', 'Bags', 'Tools', 'Electronics', 'Lighting', 'Other']

const visible = computed(() => filterAndSort(store.accessories))

const knownCategories = computed(() => {
  const cats = store.accessoryCategories
  return cats.length ? cats : FALLBACK_CATEGORIES
})

const categoryChips = computed(() => {
  const counts = new Map<string, number>()
  for (const a of store.accessories) {
    if (a.category) counts.set(a.category, (counts.get(a.category) || 0) + 1)
  }
  return knownCategories.value.map(c => ({ label: c, count: counts.get(c) || 0 }))
})

const filterOptions = computed(() => {
  return {
    brands: [] as any[],
    types: [] as string[],
    categories: [...knownCategories.value],
    sizes: [] as string[],
    colors: [] as string[],
  }
})

const heroStats = computed(() => {
  const stock = store.accessories.filter(a => a.in_stock).length
  const prices = store.accessories.map(a => Number(a.price || 0)).filter(p => p > 0)
  return [
    { label: 'Products', value: store.accessories.length },
    { label: 'In Stock', value: stock },
    { label: 'Categories', value: new Set(store.accessories.map(a => a.category).filter(Boolean)).size || '—' },
    { label: 'From', value: prices.length ? `KSh ${Math.min(...prices).toLocaleString('en-KE')}` : '—' },
  ]
})

const totalPages = computed(() => Math.max(1, Math.ceil(visible.value.length / PAGE_SIZE)))
const pageItems = computed(() => visible.value.slice((page.value - 1) * PAGE_SIZE, page.value * PAGE_SIZE))

const searchInput = ref('')
const debouncedSearch = useDebounceFn((val: string) => { filters.search = val; page.value = 1 }, 250)
watch(searchInput, (val) => debouncedSearch(val))
watch(filters, () => { page.value = 1 }, { deep: true })

function resetFilters() {
  reset()
  searchInput.value = ''
  page.value = 1
}

function openQuickView(a: any) { quickViewItem.value = a; quickViewOpen.value = true }
function openEnquiry(a: any) { enquiryItem.value = a; enquiryOpen.value = true }

onMounted(async () => {
  if (typeof route.query.category === 'string' && route.query.category) filters.category = route.query.category
  await store.ensureActive()
  loading.value = false
  await wishlist.load()
})

onUnmounted(() => { store.release() })
</script>