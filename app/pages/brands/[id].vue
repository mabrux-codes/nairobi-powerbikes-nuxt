<template>
  <div class="min-h-screen bg-brand-black pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div v-if="loading" class="animate-pulse space-y-6"><div class="h-8 w-64 rounded bg-brand-grey/10" /><div class="h-4 w-96 rounded bg-brand-grey/10" /><div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"><div v-for="i in 6" :key="i" class="h-64 rounded-sm bg-brand-grey/10" /></div></div>
      <template v-else-if="brand">
        <motion.div :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }">
          <div class="flex items-center gap-4">
            <img v-if="brand.logo" :src="pb.files.getURL(brand, brand.logo)" :alt="brand.name" class="h-14 max-w-[160px] object-contain" />
            <div><h1 class="font-display text-display-lg leading-[var(--leading-display)] text-white">{{ brand.name }}</h1><p v-if="brand.tagline" class="mt-1 text-brand-grey">{{ brand.tagline }}</p></div>
          </div>
          <div class="mt-2 h-1 w-24 bg-brand-red" />
          <p v-if="brand.description" class="mt-6 max-w-3xl leading-relaxed text-brand-grey">{{ brand.description }}</p>
        </motion.div>

        <div class="mt-12">
          <h2 class="font-display text-display-md leading-[var(--leading-display)] text-white">{{ brand.name }} Motorcycles</h2>
          <div v-if="motorcyclesLoading" class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="i in 6" :key="i" class="animate-pulse rounded-sm border border-brand-grey/10 p-4"><div class="aspect-[4/3] w-full rounded-sm bg-brand-grey/10" /><div class="mt-4 h-5 w-3/4 rounded bg-brand-grey/10" /><div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10" /></div>
          </div>
          <div v-else-if="motorcycles.length" class="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <NuxtLink v-for="(bike, i) in motorcycles" :key="bike.id" :to="`/motorcycles/${bike.id}`">
              <motion.div class="group rounded-sm border border-brand-grey/10 bg-brand-black/60 overflow-hidden transition-all duration-300 hover:border-brand-red/40"
                :initial="{ opacity: 0, y: 24 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: i * 0.06, duration: 0.4 }">
                <div class="aspect-[4/3] overflow-hidden bg-brand-black"><img v-if="bike.images?.length" :src="pb.files.getURL(bike, bike.images[0])" :alt="bike.name" class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105" /></div>
                <div class="p-4"><h3 class="font-display text-lg tracking-[var(--tracking-display)] text-white">{{ bike.name }}</h3><p class="text-xs text-brand-grey">{{ bike.year }} · {{ bike.engine_cc }}cc</p><p class="mt-2 font-display text-xl text-brand-red">KES {{ Number(bike.price).toLocaleString() }}</p></div>
              </motion.div>
            </NuxtLink>
          </div>
          <div v-else class="mt-8 rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
            <p class="font-display text-xl tracking-display text-brand-grey">No motorcycles listed yet</p>
            <p class="mt-2 text-sm text-brand-grey/60">Check back soon for new arrivals</p>
          </div>
        </div>
      </template>
      <div v-else class="rounded-sm border border-dashed border-brand-grey/20 p-16 text-center">
        <p class="font-display text-2xl tracking-display text-brand-grey">Brand Not Found</p>
        <p class="mt-2 text-sm text-brand-grey/60">The brand you're looking for doesn't exist.</p>
        <NuxtLink to="/brands" class="btn-primary mt-6 inline-flex">Browse All Brands</NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { usePB } from '~/composables/usePocketBase'

interface Brand { id: string; name: string; tagline?: string; logo?: string; description?: string }
interface Motorcycle { id: string; name: string; year: number; engine_cc: number; price: number; images?: string[]; brand?: string }

useHead({ title: 'Brand Details - Nairobi Powerbikes' })

const pb = usePB()
const route = useRoute()
const loading = ref(true); const brand = ref<Brand | null>(null)
const motorcyclesLoading = ref(true); const motorcycles = ref<Motorcycle[]>([])

async function loadMotorcycles() {
  try { motorcycles.value = await pb.collection('motorcycles').getFullList<Motorcycle>({ filter: `brand="${route.params.id}" && status!="sold"`, sort: '-year,name' }) } catch { motorcycles.value = [] }
  finally { motorcyclesLoading.value = false }
}

onMounted(async () => {
  try {
    brand.value = await pb.collection('brands').getOne<Brand>(route.params.id as string)
    useHead({ title: `${brand.value.name} - Nairobi Powerbikes` })
    await loadMotorcycles()
    pb.collection('motorcycles').subscribe('*', () => loadMotorcycles())
  } catch { brand.value = null }
  finally { loading.value = false }
})

onUnmounted(() => { pb.collection('motorcycles').unsubscribe('*') })
</script>
