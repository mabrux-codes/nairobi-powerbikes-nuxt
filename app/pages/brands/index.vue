<template>
  <div class="min-h-screen bg-brand-black pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div :initial="{ opacity: 0, y: 40 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6 }">
        <h1 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Our <span class="text-brand-red">Brands</span></h1>
        <div class="mt-2 h-1 w-24 bg-brand-red" />
        <p class="mt-4 text-brand-grey">Explore our portfolio of world-class motorcycle brands.</p>
      </motion.div>

      <div v-if="loading" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-sm border border-brand-grey/10 p-6"><div class="mx-auto mb-4 h-16 w-32 rounded bg-brand-grey/10" /><div class="mx-auto h-5 w-24 rounded bg-brand-grey/10" /><div class="mx-auto mt-2 h-4 w-48 rounded bg-brand-grey/10" /></div>
      </div>
      <div v-else class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="(brand, i) in brands" :key="brand.id" :to="`/brands/${brand.id}`">
          <motion.div class="group rounded-sm border border-brand-grey/10 bg-brand-black/60 p-8 text-center transition-all duration-300 hover:border-brand-red/40 hover:bg-brand-red/5"
            :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: i * 0.08, duration: 0.4 }">
            <img v-if="brand.logo" :src="pb.files.getURL(brand, brand.logo)" :alt="brand.name" class="mx-auto mb-5 h-20 max-w-[140px] object-contain transition-all duration-300 group-hover:scale-110" />
            <div v-else class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br" :class="getBrandGradient(i)">
              <span class="font-display text-xl text-white">{{ brand.name.slice(0, 2).toUpperCase() }}</span>
            </div>
            <h2 class="font-display text-xl tracking-[var(--tracking-display)] text-white">{{ brand.name }}</h2>
            <p v-if="brand.tagline" class="mt-2 text-sm text-brand-grey">{{ brand.tagline }}</p>
          </motion.div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { motion } from 'motion-v'
import { usePB } from '~/composables/usePocketBase'

interface Brand { id: string; name: string; tagline?: string; logo?: string; description?: string }

useHead({ title: 'Motorcycle Brands - Nairobi Powerbikes', meta: [{ name: 'description', content: 'Browse our selection of motorcycle brands available at Nairobi Powerbikes — Tekken, Taro GP, Voge, Loncin, QJ Motor.' }] })

const pb = usePB()
const loading = ref(true)
const brands = ref<Brand[]>([])

const brandColors = ['#D6001C', '#E63946', '#2A9D8F', '#264653', '#F4A261']
const brandGradients = [
  'from-red-700 to-red-500',
  'from-orange-600 to-red-500',
  'from-teal-600 to-emerald-500',
  'from-blue-900 to-slate-700',
  'from-amber-600 to-yellow-500',
]

const fallbackBrands: Brand[] = [
  { id: 'tekken', name: 'Tekken', tagline: 'Built to Conquer', description: 'Chinese engineering excellence meets bold design.' },
  { id: 'taro-gp', name: 'Taro GP', tagline: 'Race-Bred Performance', description: 'High-performance motorcycles engineered for the track and the street.' },
  { id: 'voge', name: 'Voge', tagline: 'Ride Beyond Limits', description: 'Adventure-ready motorcycles built for the open road.' },
  { id: 'loncin', name: 'Loncin', tagline: 'Powering Your Ride', description: 'Reliable motorcycles and engines trusted worldwide.' },
  { id: 'qj-motor', name: 'QJ Motor', tagline: 'The Future of Motion', description: 'Innovative motorcycles blending style, power, and technology.' },
]

function getBrandGradient(i: number) { return brandGradients[i % brandGradients.length] }

onMounted(async () => {
  try {
    const records = await pb.collection('brands').getFullList<Brand>({ sort: 'name' })
    brands.value = records.length ? records : fallbackBrands
  }
  catch { brands.value = fallbackBrands }
  finally { loading.value = false }
})
</script>
