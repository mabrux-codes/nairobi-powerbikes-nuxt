<template>
  <div class="min-h-screen bg-brand-black pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }">
        <h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Accessories</h1>
        <div class="mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-4 text-brand-grey">Gear up with premium motorcycle accessories.</p>
      </motion.div>

      <div class="mt-8 flex flex-wrap gap-3">
        <button v-for="cat in categories" :key="cat" class="rounded-sm border px-4 py-2 text-xs font-display tracking-display uppercase transition-all duration-200"
          :class="activeCategory === cat ? 'border-brand-red bg-brand-red/10 text-brand-red' : 'border-brand-grey/20 text-brand-grey hover:border-brand-red/40'"
          @click="activeCategory = cat">{{ cat }}</button>
      </div>

      <div v-if="loading" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="i in 8" :key="i" class="animate-pulse rounded-sm border border-brand-grey/10 p-4"><div class="aspect-square w-full rounded-sm bg-brand-grey/10" /><div class="mt-4 h-5 w-3/4 rounded bg-brand-grey/10" /><div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10" /></div>
      </div>
      <div v-else-if="filtered.length" class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <NuxtLink v-for="(item, i) in filtered" :key="item.id" :to="`/accessories/${item.id}`">
          <motion.div class="group rounded-sm border border-brand-grey/10 bg-brand-black/60 overflow-hidden transition-all duration-300 hover:border-brand-red/40"
            :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: (i % 8) * 0.04, duration: 0.35 }">
            <div class="aspect-square overflow-hidden bg-brand-black">
              <img v-if="item.image" :src="pb.files.getURL(item, item.image)" :alt="item.name" class="h-full w-full object-cover transition-all duration-500 group-hover:scale-105" />
            </div>
            <div class="p-4">
              <p class="text-[10px] font-display tracking-display text-brand-grey/60 uppercase">{{ item.category }}</p>
              <h3 class="font-display text-lg tracking-[var(--tracking-display)] text-white">{{ item.name }}</h3>
              <p class="mt-1 text-xs text-brand-grey line-clamp-2">{{ item.description }}</p>
              <p class="mt-2 text-xl font-bold text-brand-red">KES {{ Number(item.price).toLocaleString() }}</p>
            </div>
          </motion.div>
        </NuxtLink>
      </div>
      <div v-else class="mt-10 rounded-sm border border-dashed border-brand-grey/20 p-16 text-center">
        <p class="font-display text-xl tracking-display text-brand-grey">No Accessories Found</p>
        <p class="mt-2 text-sm text-brand-grey/60">Try selecting a different category</p>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { usePB } from '~/composables/usePocketBase'

interface Accessory { id: string; name: string; category: string; description?: string; price: number; images?: string[] }

useHead({ title: 'Accessories - Nairobi Powerbikes', meta: [{ name: 'description', content: 'Shop premium motorcycle accessories in Nairobi. Helmets, gloves, covers, and more.' }] })

const pb = usePB()
const loading = ref(true); const accessories = ref<Accessory[]>([])
const categories = ['All', 'Helmets', 'Gloves', 'Covers', 'Locks', 'Bags', 'Tools', 'Electronics', 'Lighting', 'Other']
const activeCategory = ref('All')

const filtered = computed(() => activeCategory.value === 'All' ? accessories.value : accessories.value.filter(a => a.category === activeCategory.value))

onMounted(async () => {
  try { accessories.value = await pb.collection('accessories').getFullList<Accessory>({ sort: 'name' }) }
  catch { accessories.value = [] }
  finally { loading.value = false }
})
</script>
