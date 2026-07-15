<template>
  <section class="relative overflow-hidden">
    <div class="carbon-fiber absolute inset-0" />
    <div class="section-diagonal relative z-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div class="mb-16 text-center" :initial="{ opacity: 0, y: 40 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true }" :transition="{ duration: 0.6 }">
          <h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">Why Choose <span class="text-brand-red">Us</span></h2>
          <div class="mx-auto mt-2 h-1 w-24 bg-brand-red" />
          <p class="mx-auto mt-4 max-w-xl text-brand-grey">Built for riders who demand more from their machine and their dealer</p>
        </motion.div>

        <div class="grid gap-6 sm:grid-cols-2 lg:gap-8">
          <motion.div v-for="(prop, index) in valueProps" :key="prop.title"
            class="group relative overflow-hidden rounded-sm border border-brand-grey/10 bg-brand-black/60 p-8 backdrop-blur-sm transition-all duration-500 hover:border-brand-red/40 hover:bg-brand-black/80"
            :class="{ 'lg:translate-y-8': index % 2 === 0 }"
            :initial="{ opacity: 0, y: 60 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true, margin: '-50px' }"
            :transition="{ delay: index * 0.15, duration: 0.5 }">
            <div class="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10 ring-1 ring-brand-red/30 transition-all duration-300 group-hover:bg-brand-red group-hover:ring-brand-red">
              <component :is="prop.icon" class="h-7 w-7 text-brand-red transition-colors duration-300 group-hover:text-white" />
            </div>
            <h3 class="font-display text-2xl tracking-display text-white">{{ prop.title }}</h3>
            <p class="mt-3 text-sm leading-relaxed text-brand-grey">{{ prop.description }}</p>
            <div class="mt-6 h-px w-0 bg-gradient-to-r from-brand-red to-transparent transition-all duration-500 group-hover:w-full" />
          </motion.div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { ShieldCheck, BadgeDollarSign, Wrench, Package } from 'lucide-vue-next'

const valueProps = [
  { title: 'Warranty Coverage', description: 'Every motorcycle sold comes with a comprehensive warranty package, giving you peace of mind on every ride through Nairobi and beyond.', icon: ShieldCheck },
  { title: 'Flexible Financing', description: 'Affordable payment plans tailored to your budget. Get on your dream bike with competitive rates and quick approval.', icon: BadgeDollarSign },
  { title: 'Certified Mechanics', description: 'Our factory-trained technicians use specialized diagnostic equipment to keep your machine performing at its peak.', icon: Wrench },
  { title: 'Genuine Parts', description: 'We stock only OEM and certified aftermarket parts. No counterfeits, no shortcuts — just quality components.', icon: Package },
]
</script>
