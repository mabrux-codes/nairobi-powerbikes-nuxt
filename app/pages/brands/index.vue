<template>
  <div class="min-h-screen bg-brand-black pb-24">
    <PageHeader
      eyebrow="Official Dealerships"
      title="Our"
      accent="Brands"
      description="Explore our portfolio of world-class motorcycle manufacturers — each with full dealer support, genuine parts and warranty backing."
      :crumbs="[{ label: 'Brands' }]"
    />

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="h-64 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.03]" />
      </div>

      <div v-else class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink v-for="(brand, i) in brands" :key="brand.id" :to="`/brands/${brand.slug || brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '')}`">
          <motion.div
            class="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-8 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-red/40 hover:shadow-[0_28px_60px_-24px_rgba(214,0,28,0.4)]"
            :initial="{ opacity: 0, y: 30 }"
            :while-in-view="{ opacity: 1, y: 0 }"
            :viewport="{ once: true, margin: '-40px' }"
            :transition="{ delay: i * 0.08, duration: 0.45, ease: 'easeOut' }"
          >
            <div class="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" :class="getBrandGlow(i)" aria-hidden="true" />

            <div class="relative flex h-24 items-center justify-center">
              <img v-if="brand.logo" :src="pb.files.getURL(brand, brand.logo)" :alt="brand.name" loading="lazy" decoding="async" class="max-h-20 max-w-[160px] object-contain transition-transform duration-300 group-hover:scale-110" />
              <div v-else class="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br" :class="getBrandGradient(i)">
                <span class="font-display text-2xl text-white">{{ brand.name.slice(0, 2).toUpperCase() }}</span>
              </div>
            </div>

            <h2 class="relative mt-5 font-display text-xl tracking-display text-white transition-colors duration-300 group-hover:text-brand-red">{{ brand.name }}</h2>
            <p v-if="brand.tagline" class="relative mt-1.5 text-sm text-brand-grey">{{ brand.tagline }}</p>
            <p v-if="brand.description" class="relative mt-3 line-clamp-2 text-xs leading-relaxed text-brand-grey/70">{{ brand.description }}</p>

            <div class="relative mt-6 flex items-center justify-between border-t border-white/[0.06] pt-5">
              <span class="flex items-center gap-2 text-xs font-semibold text-brand-grey">
                <Bike class="h-4 w-4 text-brand-red" />{{ bikeCount(brand) }} model{{ bikeCount(brand) === 1 ? '' : 's' }}
              </span>
              <span class="inline-flex items-center gap-1 text-xs font-bold tracking-wider text-brand-red uppercase">
                View Brand <ArrowRight class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </motion.div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { ArrowRight, Bike, LoaderCircle } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

interface Brand { id: string; name: string; tagline?: string; logo?: string; description?: string; slug?: string }

useHead({ title: 'Motorcycle Brands - Nairobi Powerbikes', meta: [{ name: 'description', content: 'Browse our selection of motorcycle brands available at Nairobi Powerbikes — Tekken, Taro GP, Voge, Loncin, QJ Motor.' }] })

const pb = usePB()
const loading = ref(true)
const brands = ref<Brand[]>([])
const bikeCounts = ref<Record<string, number>>({})

const brandColors = ['#D6001C', '#E63946', '#2A9D8F', '#264653', '#F4A261']
const brandGradients = [
  'from-red-700 to-red-500',
  'from-orange-600 to-red-500',
  'from-teal-600 to-emerald-500',
  'from-blue-900 to-slate-700',
  'from-amber-600 to-yellow-500',
]
const brandGlows = [
  'bg-gradient-to-br from-brand-red/15 to-transparent',
  'bg-gradient-to-br from-orange-600/15 to-transparent',
  'bg-gradient-to-br from-teal-600/15 to-transparent',
  'bg-gradient-to-br from-blue-700/15 to-transparent',
  'bg-gradient-to-br from-amber-600/15 to-transparent',
]

const fallbackBrands: Brand[] = [
  { id: 'tekken', name: 'Tekken', tagline: 'Built to Conquer', description: 'Chinese engineering excellence meets bold design.' },
  { id: 'taro-gp', name: 'Taro GP', tagline: 'Race-Bred Performance', description: 'High-performance motorcycles engineered for the track and the street.' },
  { id: 'voge', name: 'Voge', tagline: 'Ride Beyond Limits', description: 'Adventure-ready motorcycles built for the open road.' },
  { id: 'loncin', name: 'Loncin', tagline: 'Powering Your Ride', description: 'Reliable motorcycles and engines trusted worldwide.' },
  { id: 'qj-motor', name: 'QJ Motor', tagline: 'The Future of Motion', description: 'Innovative motorcycles blending style, power, and technology.' },
]

function getBrandGradient(i: number) { return brandGradients[i % brandGradients.length] }
function getBrandGlow(i: number) { return brandGlows[i % brandGlows.length] }

function bikeCount(b: Brand): number {
  return bikeCounts.value[b.id] ?? 0
}

async function loadBrands() {
  try {
    const records = await pb.collection('brands').getFullList<Brand>({ sort: 'name' })
    brands.value = records.length ? records : fallbackBrands
    try {
      const bikes = await pb.collection('motorcycles').getFullList({ fields: 'brand', filter: 'status!="sold"' })
      const counts: Record<string, number> = {}
      for (const b of bikes as any[]) { if (b.brand) counts[b.brand] = (counts[b.brand] || 0) + 1 }
      bikeCounts.value = counts
    } catch { /* counts optional */ }
  }
  catch { brands.value = fallbackBrands }
  finally { loading.value = false }
}

onMounted(async () => {
  await loadBrands()
  pb.collection('brands').subscribe('*', () => loadBrands())
  pb.collection('motorcycles').subscribe('*', () => loadBrands())
})

onUnmounted(() => {
  pb.collection('brands').unsubscribe('*')
  pb.collection('motorcycles').unsubscribe('*')
})
</script>