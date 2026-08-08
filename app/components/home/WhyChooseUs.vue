<template>
  <section class="relative overflow-hidden">
    <div class="carbon-fiber absolute inset-0" aria-hidden="true" />
    <div class="relative z-10 py-24 sm:py-28">
      <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The PowerBikes Difference"
          title="Why Choose"
          accent="PowerBikes"
          description="Built for riders who demand more from their machine and their dealer."
        />

        <div class="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] md:grid-cols-2 xl:grid-cols-4">
          <AnimatedCounter v-for="stat in stats" :key="stat.label" :target="stat.value" :suffix="stat.suffix" :label="stat.label" :duration="2" class="bg-brand-black/90 px-6 py-8 text-center md:py-10 xl:py-8" />
        </div>

        <div class="mt-14 grid gap-6 sm:grid-cols-2 lg:gap-8">
          <motion.div v-for="(prop, index) in valueProps" :key="prop.title"
            class="group relative flex w-full max-w-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent p-6 text-center backdrop-blur-sm transition-all duration-500 hover:border-brand-red/40 hover:shadow-[0_24px_50px_-24px_rgba(214,0,28,0.35)] sm:p-7 lg:items-start lg:p-8 lg:text-left"
            :class="{ 'lg:translate-y-8': index % 2 === 0 }"
            :initial="{ opacity: 0, y: 60 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true, margin: '-50px' }"
            :transition="{ delay: index * 0.12, duration: 0.5 }">
            <div class="mx-auto my-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red/10 ring-1 ring-brand-red/30 transition-all duration-300 group-hover:bg-brand-red group-hover:ring-brand-red sm:my-5 sm:h-16 sm:w-16 lg:mx-0 lg:my-0 lg:mb-6">
              <component :is="prop.icon" class="h-6 w-6 text-brand-red transition-colors duration-300 group-hover:text-white sm:h-7 sm:w-7" />
            </div>
            <h3 class="break-words font-display text-xl tracking-display text-white sm:text-2xl">{{ prop.title }}</h3>
            <p class="mx-auto mt-2.5 max-w-[36ch] text-pretty text-sm leading-relaxed text-brand-light/80 sm:mt-3 lg:mx-0 lg:max-w-none lg:text-brand-grey">{{ prop.description }}</p>
            <div class="mt-auto pt-6">
              <div class="mx-auto h-px w-0 bg-gradient-to-r from-brand-red to-transparent transition-all duration-500 group-hover:w-full lg:mx-0" />
            </div>
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

const stats = [
  { value: 5000, suffix: '+', label: 'Bikes Delivered' },
  { value: 12, suffix: '', label: 'Partner Brands' },
  { value: 15000, suffix: '+', label: 'Services Completed' },
  { value: 98, suffix: '%', label: 'Rider Satisfaction' },
]
</script>