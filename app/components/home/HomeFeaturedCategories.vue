<template>
  <section class="bg-brand-black py-20">
    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Explore The Range"
        title="Featured"
        accent="Categories"
        description="Everything the modern rider needs — machines, parts, gear and expert support under one roof."
      />

      <div class="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-6">
        <motion.div
          v-for="(cat, i) in categories"
          :key="cat.label"
          :initial="{ opacity: 0, y: 34 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-40px' }"
          :transition="{ delay: i * 0.07, duration: 0.5, ease: 'easeOut' }"
        >
          <NuxtLink
            :to="cat.to"
            class="group relative flex h-44 flex-col justify-end overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-5 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-red/40 hover:shadow-[0_24px_50px_-20px_rgba(214,0,28,0.35)]"
            :aria-label="cat.label"
          >
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-red/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden="true" />

            <div class="relative mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-brand-black/60 backdrop-blur-md transition-all duration-300 group-hover:border-brand-red/50 group-hover:bg-brand-red/10">
              <component :is="cat.icon" class="h-6 w-6 text-brand-red transition-transform duration-300 group-hover:scale-110" />
            </div>

            <h3 class="font-display text-base font-bold tracking-display text-white transition-colors duration-300 group-hover:text-brand-red sm:text-lg">{{ cat.label }}</h3>
            <p class="mt-0.5 text-xs text-brand-grey">{{ cat.items }}</p>

            <span class="mt-2 inline-flex items-center gap-1 text-xs font-bold tracking-wider text-brand-red/70 uppercase transition-colors duration-300 group-hover:text-brand-red">
              Explore
              <ArrowRight class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </NuxtLink>
        </motion.div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { ArrowRight, Bike, Armchair, Shirt, BadgeDollarSign, Wrench, GraduationCap } from 'lucide-vue-next'
import { useCatalogStore } from '~/stores/catalog'

const store = useCatalogStore()

const categories = computed(() => {
  const bikes = store.motorcycles.filter(b => b.status !== 'sold').length
  return [
    { label: 'Motorcycles', items: bikes ? `${bikes} models available` : 'New & used inventory', icon: Bike, to: '/motorcycles' },
    { label: 'Accessories', items: shopCount(store.accessories.length, 'accessories'), icon: Armchair, to: '/accessories' },
    { label: 'Apparel', items: shopCount(store.apparel.length, 'styles'), icon: Shirt, to: '/apparel' },
    { label: 'Finance', items: 'Flexible plans from 9.9% APR', icon: BadgeDollarSign, to: '/finance' },
    { label: 'Services', items: 'Factory-trained technicians', icon: Wrench, to: '/service/booking' },
    { label: 'Test Rides', items: 'Book your ride today', icon: GraduationCap, to: '/service/test-ride' },
  ]
})

function shopCount(n: number, noun: string) {
  return n ? `${n} ${noun} in stock` : 'Genuine Powerbikes gear'
}

onMounted(() => { store.ensureActive() })
onUnmounted(() => { store.release() })
</script>