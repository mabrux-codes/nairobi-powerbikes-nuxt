<template>
  <div class="min-h-screen bg-brand-black pb-24">
    <PageHeader
      eyebrow="Fresh Off The Truck"
      title="New"
      accent="Arrivals"
      description="The latest models to hit our showroom floor — be the first to ride them."
      :crumbs="[{ label: 'Shop', to: '/motorcycles' }, { label: 'New Arrivals' }]"
    >
      <template #actions>
        <Button to="/service/test-ride" variant="primary" size="lg"><CalendarClock class="h-5 w-5" />Book a Test Ride</Button>
        <Button to="/motorcycles" variant="secondary" size="lg"><Bike class="h-5 w-5" />Full Collection</Button>
      </template>
    </PageHeader>

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <div class="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative min-w-0 flex-1 sm:max-w-xs">
            <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" />
            <input v-model="searchInput" type="text" placeholder="Search new arrivals…" class="input-field h-10 rounded-xl pl-10 focus:ring-2 focus:ring-brand-red/30" aria-label="Search new arrivals" />
          </div>

          <select v-model="sortBy" class="input-field h-10 w-auto appearance-none rounded-xl text-sm" aria-label="Sort new arrivals">
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="cc-desc">Engine: Large to Small</option>
            <option value="name">Name A–Z</option>
          </select>

          <p class="ml-auto text-sm text-brand-grey">{{ visible.length }} new model{{ visible.length === 1 ? '' : 's' }}</p>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-2" role="listbox" aria-label="Filter by type">
          <button
            v-for="chip in typeChips"
            :key="chip.label"
            class="rounded-full border px-4 py-1.5 text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
            :class="typeFilter === chip.label ? 'border-brand-red bg-brand-red text-white shadow-lg shadow-brand-red/25' : 'border-white/10 text-brand-light/70 hover:border-brand-red/50 hover:text-brand-red'"
            :aria-pressed="typeFilter === chip.label"
            @click="typeFilter = typeFilter === chip.label ? '' : chip.label"
          >
            {{ chip.label }}
            <span class="ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold" :class="typeFilter === chip.label ? 'bg-white/20 text-white' : 'bg-white/[0.06] text-brand-grey'">{{ chip.count }}</span>
          </button>
        </div>
      </div>

      <template v-if="loading">
        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <ShopSkeletonCard v-for="i in 8" :key="i" />
        </div>
      </template>
      <template v-else-if="visible.length">
        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <motion.div
            v-for="(bike, i) in visible"
            :key="bike.id"
            :initial="{ opacity: 0, y: 28 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: (i % 8) * 0.05, duration: 0.45, ease: 'easeOut' }"
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
        <p v-if="!searchInput && !typeFilter" class="mt-10 text-center text-xs text-brand-grey/60">Live-updated from the showroom — no refresh needed.</p>
      </template>
      <ShopEmptyState v-else kind="bike" title="No new arrivals match" description="Try clearing the search or filters, or check back soon." :on-clear="clearFilters" class="mt-8" />
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
import { Search, CalendarClock, Bike } from 'lucide-vue-next'
import { useDebounceFn } from '@vueuse/core'
import { usePB } from '~/composables/usePocketBase'
import { useWishlist } from '~/composables/useWishlist'

interface Motorcycle { id: string; name: string; brand_name?: string; type?: string; year?: number; engine_cc?: number; price: number; new_arrival?: boolean; featured?: boolean }

useHead({
  title: 'New Arrivals - Nairobi Powerbikes',
  meta: [{ name: 'description', content: 'Check out the latest motorcycle arrivals at Nairobi Powerbikes. Be the first to ride the newest models.' }],
})

const pb = usePB()
const wishlist = useWishlist()
const loading = ref(true)
const motorcycles = ref<Motorcycle[]>([])
const searchInput = ref('')
let search = ''
const debouncedSearch = useDebounceFn((v: string) => { search = v }, 250)
watch(searchInput, (v) => debouncedSearch(v))

const sortBy = ref('newest')
const typeFilter = ref('')

function bikePath(b: any) { return `/motorcycles/${b.slug || encodeURIComponent(b.name)}` }

const typeChips = computed(() => {
  const counts = new Map<string, number>()
  for (const b of motorcycles.value) {
    if (b.type) counts.set(b.type, (counts.get(b.type) || 0) + 1)
  }
  return [...counts.entries()].map(([label, count]) => ({ label, count }))
})

const visible = computed(() => {
  let list = motorcycles.value
  if (typeFilter.value) list = list.filter(b => b.type === typeFilter.value)
  if (search) {
    const q = search.toLowerCase()
    list = list.filter(b => `${b.name} ${b.brand_name || ''}`.toLowerCase().includes(q))
  }
  const sorted = [...list]
  switch (sortBy.value) {
    case 'price-asc': sorted.sort((a, b) => (a.price || 0) - (b.price || 0)); break
    case 'price-desc': sorted.sort((a, b) => (b.price || 0) - (a.price || 0)); break
    case 'cc-desc': sorted.sort((a, b) => (Number(b.engine_cc) || 0) - (Number(a.engine_cc) || 0)); break
    case 'name': sorted.sort((a, b) => a.name.localeCompare(b.name)); break
    default: break
  }
  return sorted
})

function clearFilters() { searchInput.value = ''; search = ''; typeFilter.value = '' }

const quickViewOpen = ref(false)
const quickViewItem = ref<any>(null)
const enquiryOpen = ref(false)
const enquiryItem = ref<any>(null)
function openQuickView(b: any) { quickViewItem.value = b; quickViewOpen.value = true }
function openEnquiry(b: any) { enquiryItem.value = b; enquiryOpen.value = true }

async function loadBikes() {
  try {
    const bikes = await pb.collection('motorcycles').getFullList<Motorcycle>({ filter: 'new_arrival=true && status="available"', sort: '-created', expand: 'brand' })
    motorcycles.value = bikes.map(b => ({ ...b, brand_name: (b as any).expand?.brand?.name || '' }))
  } catch { motorcycles.value = [] }
  finally { loading.value = false }
}

onMounted(async () => {
  await Promise.all([loadBikes(), wishlist.load()])
  pb.collection('motorcycles').subscribe('*', () => loadBikes())
})

onUnmounted(() => { pb.collection('motorcycles').unsubscribe('*') })
</script>