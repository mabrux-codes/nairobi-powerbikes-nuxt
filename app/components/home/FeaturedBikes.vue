<template>
  <section class="bg-brand-black py-20">
    <div class="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
      <motion.div class="mb-16 text-center" :initial="{ opacity: 0, y: 40 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true }" :transition="{ duration: 0.6 }">
        <h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Featured <span class="text-brand-red">Machines</span></h2>
        <div class="mx-auto mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-4 text-brand-grey">Hand-picked motorcycles ready to conquer Nairobi's streets</p>
      </motion.div>

      <div v-if="loading" class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="i in 4" :key="i" class="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80">
          <div class="aspect-[4/5] animate-pulse bg-zinc-800/50" />
          <div class="space-y-4 p-6">
            <div class="h-3 w-20 animate-pulse rounded bg-zinc-800/50" />
            <div class="h-6 w-3/4 animate-pulse rounded bg-zinc-800/50" />
            <div class="h-4 w-full animate-pulse rounded bg-zinc-800/50" />
            <div class="h-4 w-2/3 animate-pulse rounded bg-zinc-800/50" />
            <div class="h-8 w-1/2 animate-pulse rounded bg-zinc-800/50" />
          </div>
        </div>
      </div>

      <div v-else-if="bikes.length" class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <motion.div v-for="(bike, index) in bikes" :key="bike.id"
          class="group overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/80 transition-all duration-500 hover:-translate-y-2 hover:border-brand-red/60 hover:shadow-2xl hover:shadow-brand-red/10"
          :initial="{ opacity: 0, y: 40 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true, margin: '-50px' }"
          :transition="{ delay: index * 0.1, duration: 0.5 }">
          <div class="aspect-[4/5] overflow-hidden bg-zinc-900 relative">
            <img v-if="bike.images?.length" :src="pb.files.getURL(bike, bike.images[0])" :alt="bike.name" class="h-full w-full object-cover transition-all duration-700 group-hover:scale-105" />
            <div v-else class="flex h-full w-full items-center justify-center bg-zinc-900">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-600"><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 0-3.5 5.5L9 9l-3.5 4" /><line x1="15" y1="6" x2="18.5" y2="17.5" /></svg>
            </div>
            <div v-if="bike.sale_price || bike.offer_price" class="absolute top-3 right-3 rounded-sm bg-green-600 px-2 py-1 text-[10px] font-display tracking-display text-white uppercase">Sale</div>
          </div>
          <div class="flex flex-col gap-5 p-6">
            <p class="text-xs uppercase tracking-widest text-zinc-500">{{ bike.expand?.brand?.name || bike.brand || 'Motorcycle' }}</p>
            <h3 class="text-3xl font-bold text-white">{{ bike.name }}</h3>
            <p v-if="bike.description" class="line-clamp-2 text-sm leading-relaxed text-zinc-400">{{ bike.description }}</p>
            <p class="text-2xl font-bold text-brand-red">KSh {{ formatPrice(bike.sale_price || bike.offer_price || bike.price) }}</p>
            <p v-if="bike.sale_price || bike.offer_price" class="-mt-3 text-sm text-zinc-500 line-through">KSh {{ formatPrice(bike.price) }}</p>
            <NuxtLink :to="bikePath(bike)" class="mt-auto rounded-xl bg-brand-red px-4 py-3 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-red-600 group-hover:shadow-lg group-hover:shadow-brand-red/20">
              View Details <ArrowRight class="ml-1.5 inline-block h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </NuxtLink>
          </div>
        </motion.div>
      </div>

      <div v-else class="rounded-sm border border-zinc-800 p-16 text-center">
        <p class="font-display text-2xl tracking-display text-zinc-400">No featured machines yet</p>
        <p class="mt-2 text-sm text-zinc-600">Check back soon for our latest arrivals</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { ArrowRight } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

interface Brand { id: string; name: string; logo?: string }
interface Bike { id: string; name: string; brand: string; engine_cc?: number; cc?: number; price: number; sale_price?: number; offer_price?: number; horsepower?: number; description?: string; images?: string[]; expand?: { brand?: Brand } }

const pb = usePB()
const loading = ref(true)
const bikes = ref<Bike[]>([])

function bikePath(b: any) { return `/motorcycles/${b.slug || encodeURIComponent(b.name)}` }
function formatPrice(amount: number): string { return amount.toLocaleString('en-KE') }

async function loadBikes() {
  try {
    const records = await pb.collection('motorcycles').getList<Bike>(1, 50, { filter: 'featured = true && status = "available"', sort: '-created', expand: 'brand' })
    bikes.value = records.items
  } catch { bikes.value = [] }
  finally { loading.value = false }
}

onMounted(async () => {
  await loadBikes()
  pb.collection('motorcycles').subscribe('*', () => loadBikes())
})

onUnmounted(() => {
  pb.collection('motorcycles').unsubscribe('*')
})
</script>