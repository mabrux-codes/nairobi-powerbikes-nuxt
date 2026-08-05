<template>
  <section class="bg-brand-black py-20">
    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <motion.div
        class="group relative overflow-hidden rounded-3xl border border-white/[0.08]"
        :initial="{ opacity: 0, y: 40 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true, margin: '-60px' }"
        :transition="{ duration: 0.6 }"
      >
        <div class="relative aspect-[16/7] sm:aspect-[21/8]">
          <img
            src="/images/bikes/tekken-3.jpg"
            alt="Nairobi Powerbikes technicians servicing a motorcycle"
            loading="lazy"
            decoding="async"
            class="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/85 to-brand-black/30" />
          <div class="relative z-10 flex h-full max-w-2xl flex-col justify-center p-8 sm:p-14">
            <p class="font-display text-xs font-bold tracking-[0.3em] text-brand-red uppercase">Expert Maintenance</p>
            <h2 class="mt-3 font-heading text-4xl leading-[1.06] text-white sm:text-5xl lg:text-6xl">Keep Your Machine <span class="text-brand-red">Fighting Fit</span></h2>
            <p class="mt-4 max-w-lg text-brand-grey sm:text-lg">Factory-trained technicians, genuine parts and a full multi-point health check on every visit. Book your service in under two minutes.</p>
            <div class="mt-7 flex flex-wrap gap-4">
              <Button to="/service/booking" variant="primary" size="lg" trailing-arrow><Wrench class="h-5 w-5" />Book a Service</Button>
              <Button variant="ghost" size="lg" @click="availabilityOpen = true"><Calendar class="h-5 w-5" />Check Availability</Button>
            </div>
          </div>
        </div>

        <div class="absolute right-6 top-6 hidden items-center gap-3 rounded-full border border-white/10 bg-black/50 px-4 py-2 backdrop-blur-md sm:flex">
          <ShieldCheck class="h-4 w-4 text-emerald-400" />
          <span class="text-xs font-semibold tracking-wide text-white/80">Up to 2-year warranty service plans</span>
        </div>
      </motion.div>

      <ServiceAvailabilityModal :open="availabilityOpen" @close="availabilityOpen = false" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Wrench, Calendar, ShieldCheck } from 'lucide-vue-next'

const availabilityOpen = ref(false)
</script>