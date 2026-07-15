<template>
  <section class="bg-brand-black py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div class="mb-12" :initial="{ opacity: 0, y: 40 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true }" :transition="{ duration: 0.6 }">
        <h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Featured <span class="text-brand-red">Machines</span></h2>
        <div class="mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-4 text-brand-grey">Hand-picked motorcycles ready to conquer Nairobi's streets</p>
      </motion.div>

      <div v-if="loading" class="flex gap-4 overflow-x-auto pb-4">
        <div v-for="i in 4" :key="i" class="min-w-[220px] flex-shrink-0 lg:min-w-[240px]">
          <div class="animate-pulse rounded-sm border border-brand-grey/20 bg-[#111111]">
            <div class="aspect-[16/10] bg-brand-grey/10" />
            <div class="space-y-2 p-3"><div class="h-4 w-3/4 rounded bg-brand-grey/10" /><div class="h-3 w-1/2 rounded bg-brand-grey/10" /><div class="h-3 w-2/3 rounded bg-brand-grey/10" /></div>
          </div>
        </div>
      </div>

      <div v-else-if="bikes.length" ref="scrollContainer" class="no-scrollbar flex gap-4 overflow-x-auto pb-4">
        <motion.div v-for="(bike, index) in bikes" :key="bike.id" class="group min-w-[220px] flex-shrink-0 lg:min-w-[240px]"
          :initial="{ opacity: 0, x: 60 }" :while-in-view="{ opacity: 1, x: 0 }" :viewport="{ once: true, margin: '-50px' }"
          :transition="{ delay: index * 0.1, duration: 0.5 }">
          <div class="relative">
            <div class="absolute inset-0 rounded-sm bg-[#0D0D0D] transition-transform duration-[350ms] ease-out translate-x-2 translate-y-2 lg:translate-x-[14px] lg:translate-y-[14px] group-hover:translate-x-[20px] group-hover:translate-y-[20px]" />
            <div class="relative rounded-sm border border-[rgba(255,255,255,0.08)] bg-[#111111] overflow-hidden shadow-[inset_0_1px_rgba(255,255,255,0.05)] transition-transform duration-[350ms] ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.02]">
              <NuxtLink :to="`/motorcycles/${bike.id}`" class="block">
                <div class="relative aspect-[16/10] overflow-hidden">
                  <img v-if="bike.images?.length" :src="pb.files.getURL(bike, bike.images[0])" :alt="bike.name" class="h-full w-full object-cover transition-transform duration-[350ms] ease-out group-hover:scale-[1.05]" />
                  <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-grey/20 to-brand-black transition-transform duration-[350ms] ease-out group-hover:scale-[1.05]">
                    <div class="flex flex-col items-center gap-1 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-brand-grey/30"><circle cx="5.5" cy="17.5" r="3.5" /><circle cx="18.5" cy="17.5" r="3.5" /><path d="M15 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm0 0-3.5 5.5L9 9l-3.5 4" /><line x1="15" y1="6" x2="18.5" y2="17.5" /></svg>
                      <span class="px-2 text-center font-display text-[10px] tracking-display text-brand-grey/40">{{ bike.name }}</span>
                    </div>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/[.08] to-transparent pointer-events-none" />
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-black/80 to-transparent p-2">
                    <div class="flex items-center gap-1.5">
                      <span class="rounded-sm bg-brand-red px-1.5 py-0.5 text-[10px] font-display text-white">{{ bike.engine_cc || bike.cc }}cc</span>
                      <span v-if="bike.horsepower" class="rounded-sm border border-brand-grey/30 px-1.5 py-0.5 text-[10px] font-display text-brand-grey">{{ bike.horsepower }}hp</span>
                    </div>
                  </div>
                </div>
                <div class="p-3">
                  <p class="mb-0.5 text-[10px] font-display tracking-display text-brand-grey uppercase">{{ bike.expand?.brand?.name || bike.brand || 'Motorcycle' }}</p>
                  <h3 class="font-display text-sm tracking-display text-white transition-colors duration-300 group-hover:text-brand-red truncate">{{ bike.name }}</h3>
                  <p class="mt-1 font-display text-base text-brand-red">KSh {{ formatPrice(bike.price) }}</p>
                  <div class="mt-2 flex items-center gap-1 text-xs text-brand-grey">
                    <span>View Details</span>
                    <ArrowRight class="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </motion.div>
      </div>

      <div v-else class="rounded-sm border border-brand-grey/20 p-12 text-center">
        <p class="font-display text-2xl tracking-display text-brand-grey">No featured machines yet</p>
        <p class="mt-2 text-sm text-brand-grey/60">Check back soon for our latest arrivals</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { ArrowRight } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

interface Brand { id: string; name: string; logo?: string }
interface Bike { id: string; name: string; brand: string; engine_cc?: number; cc?: number; price: number; horsepower?: number; images?: string[]; expand?: { brand?: Brand } }

const pb = usePB()
const loading = ref(true)
const bikes = ref<Bike[]>([])

function formatPrice(amount: number): string { return amount.toLocaleString('en-KE') }

async function loadBikes() {
  try {
    const records = await pb.collection('motorcycles').getList<Bike>(1, 10, { filter: 'featured = true && status = "available"', sort: '-created', expand: 'brand' })
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

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
