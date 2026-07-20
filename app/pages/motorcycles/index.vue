<template>
  <div class="min-h-screen bg-brand-black pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }">
        <h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Motorcycles</h1>
        <div class="mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-4 text-brand-grey">Browse our full collection of performance motorcycles.</p>
      </motion.div>

      <div class="mt-8 flex flex-wrap gap-4">
        <div class="relative flex-1 min-w-[200px]"><Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/50" /><input v-model="filters.search" type="text" placeholder="Search motorcycles..." class="input-field w-full pl-10" /></div>
        <select v-model="filters.brand" class="input-field min-w-[140px] appearance-none"><option value="">All Brands</option><option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option></select>
        <select v-model="filters.type" class="input-field min-w-[140px] appearance-none"><option value="">All Types</option><option v-for="t in bikeTypes" :key="t" :value="t">{{ t }}</option></select>
        <label class="flex cursor-pointer items-center gap-2 rounded-sm border border-brand-grey/20 px-4 py-2 text-sm text-brand-grey hover:border-brand-red/40"><input v-model="filters.inStock" type="checkbox" class="accent-brand-red" /> In Stock Only</label>
        <select v-model="filters.sort" class="input-field min-w-[150px] appearance-none"><option value="-created">Newest</option><option value="price">Price: Low to High</option><option value="-price">Price: High to Low</option><option value="name">Name: A-Z</option><option value="-year">Year: Newest</option></select>
      </div>

      <div v-if="loading" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="i in 8" :key="i" class="animate-pulse rounded-sm border border-brand-grey/10 p-4"><div class="aspect-[4/3] w-full rounded-sm bg-brand-grey/10" /><div class="mt-4 h-5 w-3/4 rounded bg-brand-grey/10" /><div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10" /></div>
      </div>
      <div v-else-if="filteredMotorcycles.length" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <NuxtLink v-for="(bike, i) in filteredMotorcycles" :key="bike.id" :to="bikePath(bike)">
          <motion.div class="group rounded-sm border border-brand-grey/10 bg-brand-black/60 overflow-hidden transition-all duration-300 hover:border-brand-red/40"
            :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: (i % 8) * 0.04, duration: 0.35 }">
            <div class="aspect-[4/3] overflow-hidden bg-brand-black relative">
              <img v-if="bike.images?.length" :src="pb.files.getURL(bike, bike.images[0])" :alt="bike.name" class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105" />
              <div v-if="bike.status === 'coming_soon'" class="absolute top-2 left-2 rounded-sm bg-amber-500 px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase">Coming Soon</div>
              <div v-else-if="bike.new_arrival" class="absolute top-2 left-2 rounded-sm bg-brand-red px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase">New</div>
              <div v-if="bike.sale_price" class="absolute top-2 right-2 rounded-sm bg-green-600 px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase">Sale</div>
            </div>
            <div class="p-4">
              <p class="text-xs font-display tracking-display text-brand-grey/60 uppercase">{{ bike.brand_name }}</p>
              <h3 class="font-bold text-2xl tracking-[var(--tracking-display)] text-white">{{ bike.name }}</h3>
              <p class="text-xs text-brand-grey">{{ bike.year }} · {{ bike.engine_cc }}cc · {{ bike.type }}</p>
              <div class="mt-2 flex items-baseline gap-2">
                <p class="text-xl font-bold text-brand-red">KES {{ (bike.sale_price || bike.price).toLocaleString() }}</p>
                <p v-if="bike.sale_price" class="text-xs font-bold text-brand-grey/60 line-through">KES {{ Number(bike.price).toLocaleString() }}</p>
              </div>
            </div>
          </motion.div>
        </NuxtLink>
      </div>
      <div v-else class="mt-10 rounded-sm border border-dashed border-brand-grey/20 p-16 text-center">
        <SearchX class="mx-auto mb-4 h-12 w-12 text-brand-grey/30" />
        <p class="font-display text-xl tracking-display text-brand-grey">No Motorcycles Found</p>
        <p class="mt-2 text-sm text-brand-grey/60">Try adjusting your filters</p>
        <button class="btn-ghost mt-4" @click="resetFilters">Clear Filters</button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { Search, SearchX } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

interface Motorcycle { id: string; name: string; brand: string; brand_name?: string; year: number; engine_cc: number; type: string; price: number; sale_price?: number; images?: string[]; new_arrival?: boolean; in_stock?: boolean; status?: string; created: string }
interface Brand { id: string; name: string }

useHead({ title: 'Motorcycles - Nairobi Powerbikes', meta: [{ name: 'description', content: 'Browse our full collection of new and used motorcycles for sale in Nairobi.' }] })

const pb = usePB()
const loading = ref(true); const motorcycles = ref<Motorcycle[]>([]); const brands = ref<Brand[]>([])
const bikeTypes = ['Sport', 'Cruiser', 'Touring', 'Adventure', 'Naked', 'Dirt', 'Scooter', 'Electric']

const filters = reactive({ search: '', brand: '', type: '', sort: '-created', inStock: false })

const filteredMotorcycles = computed(() => {
  let result = [...motorcycles.value]
  if (filters.search) { const q = filters.search.toLowerCase(); result = result.filter(b => b.name.toLowerCase().includes(q) || b.brand_name?.toLowerCase().includes(q)) }
  if (filters.brand) result = result.filter(b => b.brand === filters.brand)
  if (filters.type) result = result.filter(b => b.type === filters.type)
  if (filters.inStock) result = result.filter(b => b.in_stock)
  result = result.filter(b => b.status !== 'sold')
  const [sortKey, sortDir] = filters.sort.startsWith('-') ? [filters.sort.slice(1), -1] : [filters.sort, 1]
  result.sort((a: any, b: any) => { const va = a[sortKey] ?? ''; const vb = b[sortKey] ?? ''; return va > vb ? sortDir : va < vb ? -sortDir : 0 })
  return result
})

function bikePath(b: any) { return `/motorcycles/${b.slug || encodeURIComponent(b.name)}` }
function resetFilters() { filters.search = ''; filters.brand = ''; filters.type = ''; filters.sort = '-created'; filters.inStock = false }

async function loadMotorcycles() {
  try {
    const bikes = await pb.collection('motorcycles').getFullList<Motorcycle>({ sort: '-created', expand: 'brand' }).catch(() => [])
    motorcycles.value = bikes.map(b => ({ ...b, brand_name: (b as any).expand?.brand?.name || '' }))
  } catch {}
  finally { loading.value = false }
}

onMounted(async () => {
  await Promise.all([
    loadMotorcycles(),
    pb.collection('brands').getFullList<Brand>({ sort: 'name' }).catch(() => []).then(r => brands.value = r),
  ])
  pb.collection('motorcycles').subscribe('*', () => loadMotorcycles())
})

onUnmounted(() => { pb.collection('motorcycles').unsubscribe('*') })
</script>
