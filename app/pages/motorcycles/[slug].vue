<template>
  <div class="min-h-screen bg-brand-black pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div v-if="loading" class="animate-pulse"><div class="aspect-[16/9] w-full rounded-sm bg-brand-grey/10" /><div class="mt-6 h-8 w-96 rounded bg-brand-grey/10" /><div class="mt-3 h-4 w-64 rounded bg-brand-grey/10" /><div class="mt-8 grid grid-cols-3 gap-4"><div v-for="i in 6" :key="i" class="h-16 rounded bg-brand-grey/10" /></div></div>
      <template v-else-if="bike">
        <motion.div :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }">
          <div class="grid gap-8 lg:grid-cols-2">
            <div class="relative overflow-hidden rounded-sm bg-brand-black">
              <div v-if="bike.images?.length" class="aspect-[4/3]"><img :src="pb.files.getURL(bike, bike.images[activeImage])" :alt="bike.name" class="h-full w-full object-cover transition-all duration-300" /></div>
              <div v-if="bike.images && bike.images.length > 1" class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                <button v-for="(_, idx) in bike.images" :key="idx" class="h-2 w-2 rounded-full transition-all" :class="idx === activeImage ? 'bg-brand-red w-6' : 'bg-white/50 hover:bg-white/80'" @click="activeImage = idx" />
              </div>
              <div v-if="bike.status === 'coming_soon'" class="absolute top-3 left-3 rounded-sm bg-amber-500 px-3 py-1 text-xs font-display tracking-display text-white uppercase">Coming Soon</div>
              <div v-else-if="bike.new_arrival" class="absolute top-3 left-3 rounded-sm bg-brand-red px-3 py-1 text-xs font-display tracking-display text-white uppercase">New Arrival</div>
              <div v-if="bike.sale_price" class="absolute top-3 right-3 rounded-sm bg-green-600 px-3 py-1 text-xs font-display tracking-display text-white uppercase">Sale</div>
            </div>
            <div>
              <p class="font-display text-sm tracking-display text-brand-red uppercase">{{ bike.brand_name }}</p>
              <h1 class="font-bold text-5xl leading-[1.1] text-white">{{ bike.name }}</h1>
              <p class="mt-1 text-sm text-brand-grey">{{ bike.year }} · {{ bike.engine_cc }}cc · {{ bike.type }}</p>
              <div class="mt-4 flex items-baseline gap-3">
                <p class="text-3xl font-bold text-brand-red">KES {{ (bike.sale_price || bike.price).toLocaleString() }}</p>
                <p v-if="bike.sale_price" class="text-lg font-bold text-brand-grey/60 line-through">KES {{ Number(bike.price).toLocaleString() }}</p>
              </div>
              <p v-if="bike.description" class="mt-6 leading-relaxed text-brand-grey">{{ bike.description }}</p>
              <div class="mt-6 grid grid-cols-2 gap-3 rounded-sm border border-brand-grey/10 bg-brand-black/60 p-5">
                <div v-for="s in specHighlights" :key="s.key" class="text-center"><p class="text-xs font-display tracking-display text-brand-grey uppercase">{{ s.label }}</p><p class="text-lg font-display text-white">{{ getSpec(s.key) }}</p></div>
              </div>
              <div class="mt-6 flex flex-wrap gap-3">
                <Button v-if="bike.status !== 'sold' && bike.status !== 'coming_soon'" variant="primary" @click="openTestRide"><Zap class="h-5 w-5" />Book Test Ride</Button>
                <Button variant="secondary" @click="openFinance"><BadgeDollarSign class="h-5 w-5" />Finance Options</Button>
                <Button v-if="auth.isAuthenticated && auth.isCustomer" variant="ghost" :class="{ 'text-brand-red': isFavorited }" @click="toggleFavorite" :disabled="favoriteLoading">
                  <Heart class="h-5 w-5" :class="{ 'fill-brand-red': isFavorited }" />{{ isFavorited ? 'Saved' : 'Save' }}
                </Button>
                <Button variant="ghost" @click="addToCompare"><Scale class="h-5 w-5" />Compare</Button>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div class="mt-12" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ delay: 0.3, duration: 0.5 }">
          <h2 class="font-display text-display-md leading-[var(--leading-display)] text-white">Full Specifications</h2>
          <div class="mt-6 rounded-sm border border-brand-grey/10">
            <table class="w-full">
              <tbody>
                <tr v-for="(spec, i) in fullSpecs" :key="spec.key" class="border-b border-brand-grey/10 last:border-b-0" :class="{ 'bg-brand-grey/5': i % 2 === 0 }">
                  <td class="px-5 py-3 text-sm font-display tracking-display text-brand-grey w-1/3">{{ spec.label }}</td>
                  <td class="px-5 py-3 text-sm text-white">{{ getSpec(spec.key) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div class="mt-12" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.4, duration: 0.5 }">
          <h2 class="font-display text-display-md leading-[var(--leading-display)] text-white">Related Motorcycles</h2>
          <div v-if="related.length" class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <NuxtLink v-for="r in related" :key="r.id" :to="bikePath(r)">
              <div class="group rounded-sm border border-brand-grey/10 bg-brand-black/60 overflow-hidden transition-all duration-300 hover:border-brand-red/40">
                <div class="aspect-[4/3] overflow-hidden bg-brand-black"><img v-if="r.images?.length" :src="pb.files.getURL(r, r.images[0])" :alt="r.name" class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105" /></div>
                <div class="p-3"><p class="text-[10px] font-display tracking-display text-brand-grey/60 uppercase">{{ r.brand_name }}</p><h3 class="font-bold text-base text-white">{{ r.name }}</h3><p class="text-xs font-bold text-brand-red">KES {{ Number(r.price).toLocaleString() }}</p></div>
              </div>
            </NuxtLink>
          </div>
        </motion.div>
      </template>
      <div v-else class="rounded-sm border border-dashed border-brand-grey/20 p-16 text-center">
        <p class="font-display text-2xl tracking-display text-brand-grey">Motorcycle Not Found</p>
        <Button to="/motorcycles" variant="primary" class="mt-6">Browse All Motorcycles</Button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { Zap, BadgeDollarSign, Scale, Heart } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'

interface Motorcycle { id: string; slug?: string; name: string; brand: string; brand_name?: string; year: number; engine_cc: number; type: string; price: number; sale_price?: number; images?: string[]; description?: string; new_arrival?: boolean; in_stock?: boolean; displacement?: number; horsepower?: number; torque?: number; transmission?: string; fuel_capacity?: number; weight?: number; top_speed?: number; braking?: string; suspension?: string; warranty?: string; colors?: string; created: string }

useHead({ title: 'Motorcycle Details - Nairobi Powerbikes' })

const pb = usePB()
const route = useRoute()
const auth = useAuthStore()
const loading = ref(true); const bike = ref<Motorcycle | null>(null); const related = ref<Motorcycle[]>([])
const activeImage = ref(0)
const isFavorited = ref(false); const favoriteId = ref(''); const favoriteLoading = ref(false)

const specHighlights = [
  { key: 'engine_cc', label: 'Engine' }, { key: 'horsepower', label: 'Horsepower' },
  { key: 'transmission', label: 'Transmission' }, { key: 'top_speed', label: 'Top Speed' },
  { key: 'weight', label: 'Weight' }, { key: 'fuel_capacity', label: 'Fuel Capacity' },
]

const fullSpecs = [
  { key: 'brand_name', label: 'Brand' }, { key: 'year', label: 'Year' }, { key: 'type', label: 'Type' },
  { key: 'engine_cc', label: 'Engine Displacement' }, { key: 'horsepower', label: 'Horsepower' },
  { key: 'torque', label: 'Torque' }, { key: 'transmission', label: 'Transmission' },
  { key: 'fuel_capacity', label: 'Fuel Capacity' }, { key: 'weight', label: 'Weight' },
  { key: 'top_speed', label: 'Top Speed' }, { key: 'braking', label: 'Braking System' },
  { key: 'suspension', label: 'Suspension' }, { key: 'colors', label: 'Available Colors' },
  { key: 'warranty', label: 'Warranty' }, { key: 'in_stock', label: 'In Stock' },
]

function getSpec(key: string): string {
  if (!bike.value) return '—'
  if (key === 'price' || key === 'sale_price') { const v = (bike.value as any)[key]; return v ? `KES ${Number(v).toLocaleString()}` : '—' }
  if (key === 'in_stock') {
    if (bike.value.status === 'coming_soon') return 'Coming Soon'
    return bike.value.in_stock ? 'Yes' : 'No'
  }
  const v = (bike.value as any)[key]
  return v != null && v !== '' ? String(v) : '—'
}

function bikePath(m: Motorcycle) {
  return `/motorcycles/${m.slug || encodeURIComponent(m.name)}`
}

function openTestRide() { navigateTo(`/service/test-ride?motorcycle=${bike.value?.id}`) }
function openFinance() { navigateTo(`/finance?motorcycle=${bike.value?.id}`) }
function addToCompare() { navigateTo('/motorcycles/compare') }

async function toggleFavorite() {
  if (!auth.isAuthenticated || !auth.isCustomer || !bike.value) return
  favoriteLoading.value = true
  try {
    if (isFavorited.value && favoriteId.value) {
      await pb.collection('favorites').delete(favoriteId.value)
      isFavorited.value = false; favoriteId.value = ''
    } else {
      const record = await pb.collection('favorites').create<{ id: string }>({ user: auth.user?.id, motorcycle: bike.value.id })
      isFavorited.value = true; favoriteId.value = record.id
    }
  } catch (e) { console.error(e) }
  finally { favoriteLoading.value = false }
}

async function checkFavorite() {
  if (!auth.isAuthenticated || !auth.isCustomer || !bike.value) return
  try {
    const favs = await pb.collection('favorites').getList(1, 1, { filter: `motorcycle = "${bike.value.id}" && user = "${auth.user?.id}"` })
    if (favs.items.length > 0) {
      isFavorited.value = true; favoriteId.value = (favs.items[0] as any).id
    }
  } catch {}
}

async function loadBike() {
  const slug = route.params.slug as string
  try {
    let res: any
    try {
      res = await pb.collection('motorcycles').getFirstListItem<Motorcycle>(`slug="${slug}"`, { expand: 'brand' })
    } catch {
      try {
        res = await pb.collection('motorcycles').getOne<Motorcycle>(slug, { expand: 'brand' })
      } catch {
        res = await pb.collection('motorcycles').getFirstListItem<Motorcycle>(`name="${slug}"`, { expand: 'brand' })
      }
    }
    if (res?.id) {
      bike.value = { ...res, brand_name: (res as any).expand?.brand?.name || '' }
      useHead({ title: `${bike.value.name} - Nairobi Powerbikes` })
      try {
        related.value = await pb.collection('motorcycles').getFullList<Motorcycle>({
          filter: `brand="${bike.value.brand}" && id != "${bike.value.id}"`,
          sort: '-created', expand: 'brand',
        })
        related.value = related.value.slice(0, 4).map(b => ({ ...b, brand_name: (b as any).expand?.brand?.name || '' }))
      } catch { related.value = [] }
    } else {
      bike.value = null
    }
  } catch { bike.value = null }
  finally { loading.value = false }
}

onMounted(async () => {
  await loadBike()
  await checkFavorite()
  pb.collection('motorcycles').subscribe('*', async () => { await loadBike(); await checkFavorite() })
})

onUnmounted(() => { pb.collection('motorcycles').unsubscribe('*') })
</script>
