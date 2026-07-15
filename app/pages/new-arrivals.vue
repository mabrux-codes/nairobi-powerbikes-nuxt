<template>
  <div class="min-h-screen bg-brand-black pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }">
        <h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">New <span class="text-brand-red">Arrivals</span></h1>
        <div class="mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-4 text-brand-grey">Be the first to ride the latest models to hit our showroom floor.</p>
      </motion.div>

      <div v-if="loading" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="i in 8" :key="i" class="animate-pulse rounded-sm border border-brand-grey/10 p-4"><div class="aspect-[4/3] w-full rounded-sm bg-brand-grey/10" /><div class="mt-4 h-5 w-3/4 rounded bg-brand-grey/10" /><div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10" /></div>
      </div>
      <div v-else-if="motorcycles.length" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <NuxtLink v-for="(bike, i) in motorcycles" :key="bike.id" :to="`/motorcycles/${bike.id}`">
          <motion.div class="group rounded-sm border border-brand-grey/10 bg-brand-black/60 overflow-hidden transition-all duration-300 hover:border-brand-red/40"
            :initial="{ opacity: 0, y: 24 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: i * 0.05, duration: 0.4 }">
            <div class="aspect-[4/3] overflow-hidden bg-brand-black relative">
              <img v-if="bike.images?.length" :src="pb.files.getURL(bike, bike.images[0])" :alt="bike.name" class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105" />
              <div class="absolute top-2 left-2 rounded-sm bg-brand-red px-2 py-0.5 text-[10px] font-display tracking-display text-white uppercase">New</div>
            </div>
            <div class="p-4">
              <p class="text-[10px] font-display tracking-display text-brand-grey/60 uppercase">{{ bike.brand_name }}</p>
              <h3 class="font-display text-lg tracking-[var(--tracking-display)] text-white">{{ bike.name }}</h3>
              <p class="text-xs text-brand-grey">{{ bike.year }} · {{ bike.engine_cc }}cc</p>
              <p class="mt-2 font-display text-xl text-brand-red">KES {{ Number(bike.price).toLocaleString() }}</p>
            </div>
          </motion.div>
        </NuxtLink>
      </div>
      <div v-else class="mt-10 rounded-sm border border-dashed border-brand-grey/20 p-16 text-center">
        <p class="font-display text-2xl tracking-display text-brand-grey">No New Arrivals</p>
        <p class="mt-2 text-sm text-brand-grey/60">Check back soon for the latest models</p>
        <NuxtLink to="/motorcycles" class="btn-ghost mt-4">Browse All Motorcycles</NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { usePB } from '~/composables/usePocketBase'

interface Motorcycle { id: string; name: string; brand: string; brand_name?: string; year: number; engine_cc: number; price: number; images?: string[]; new_arrival?: boolean }

useHead({ title: 'New Arrivals - Nairobi Powerbikes', meta: [{ name: 'description', content: 'Check out the latest motorcycle arrivals at Nairobi Powerbikes. Be the first to ride the newest models.' }] })

const pb = usePB()
const loading = ref(true); const motorcycles = ref<Motorcycle[]>([])

async function loadBikes() {
  try {
    const bikes = await pb.collection('motorcycles').getFullList<Motorcycle>({ filter: 'new_arrival=true && status="available"', sort: '-created', expand: 'brand' })
    motorcycles.value = bikes.map(b => ({ ...b, brand_name: (b as any).expand?.brand?.name || '' }))
  } catch { motorcycles.value = [] }
  finally { loading.value = false }
}

onMounted(async () => {
  await loadBikes()
  pb.collection('motorcycles').subscribe('*', () => loadBikes())
})

onUnmounted(() => { pb.collection('motorcycles').unsubscribe('*') })
</script>
