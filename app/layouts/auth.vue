<template>
  <div class="flex min-h-screen bg-brand-black pt-[var(--announce-h)]">
    <AnnouncementBar />
    <div class="relative hidden flex-1 overflow-hidden lg:block">
      <!-- Animated motorcycle gallery from PocketBase -->
      <div class="absolute inset-0 bg-brand-black">
        <img
          v-for="s in visibleSlides"
          :key="s.id"
          :src="s.url"
          :alt="`${s.brand || 'Motorcycle'} showcase`"
          class="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1600ms] ease-in-out"
          :class="s.id === currentSlide?.id ? 'opacity-100 kenburns-active' : 'opacity-0'"
          loading="lazy"
          decoding="async"
        />
        <div v-if="slides.length === 0 && !loading" class="absolute inset-0 flex flex-col items-center justify-center gap-6">
          <span class="flex h-24 w-24 items-center justify-center rounded-full border border-brand-red/20 bg-brand-red/5">
            <Bike class="h-12 w-12 text-brand-red" stroke-width="1.25" />
          </span>
          <p class="font-display text-sm font-semibold tracking-[0.3em] text-brand-grey uppercase">Showroom preview coming soon</p>
        </div>
        <div class="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/55 to-brand-black/15" />
        <div class="absolute inset-0 bg-gradient-to-t from-brand-black/95 via-transparent to-brand-black/30" />
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(214,0,28,0.14),transparent_55%)]" />
      </div>

      <div class="relative z-10 flex h-full flex-col justify-between p-14">
        <NuxtLink to="/" class="flex w-fit items-center gap-3" aria-label="Nairobi Powerbikes home">
          <img src="/NPB Logo.png" alt="Nairobi Powerbikes" class="h-12 w-auto" />
        </NuxtLink>

        <div>
          <motion.p
            class="mb-4 flex items-center gap-3 font-display text-xs font-bold tracking-[0.3em] text-brand-red uppercase"
            :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.2, duration: 0.5 }"
          >
            <span class="h-px w-10 bg-brand-red" />Join The Community
          </motion.p>
          <motion.h1
            class="font-heading text-5xl leading-[1.05] text-white xl:text-6xl"
            :initial="{ opacity: 0, y: 26 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.3, duration: 0.55 }"
          >
            RIDE THE <span class="text-brand-red">POWER</span>
          </motion.h1>
          <motion.p
            class="mt-4 max-w-md text-brand-grey"
            :initial="{ opacity: 0, y: 22 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.4, duration: 0.55 }"
          >
            Your gateway to premium motorcycles, genuine gear and a thriving riding community in Nairobi.
          </motion.p>

          <motion.ul
            class="mt-8 space-y-3"
            :initial="{ opacity: 0, y: 22 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.5, duration: 0.55 }"
          >
            <li v-for="b in benefits" :key="b" class="flex items-center gap-3 text-sm text-white/85">
              <span class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-red/20">
                <Check class="h-3.5 w-3.5 text-brand-red" />
              </span>
              {{ b }}
            </li>
          </motion.ul>
        </div>

        <div class="flex items-center gap-8 text-white/70">
          <div v-for="s in sideStats" :key="s.label">
            <p class="font-heading text-2xl text-white">{{ s.value }}</p>
            <p class="font-display text-[10px] font-semibold tracking-[0.18em] text-brand-grey uppercase">{{ s.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="relative flex w-full flex-col justify-center px-5 py-12 sm:px-10 lg:w-[46%] lg:min-w-[560px] lg:px-16">
      <div class="pointer-events-none absolute inset-0 lg:hidden">
        <img
          v-if="currentSlide"
          :key="currentSlide.id"
          :src="currentSlide.url"
          alt=""
          aria-hidden="true"
          class="absolute inset-0 h-full w-full object-cover opacity-15 transition-opacity duration-[1600ms] ease-in-out"
          loading="lazy"
          decoding="async"
        />
        <div class="absolute inset-0 bg-gradient-to-b from-brand-black/70 via-brand-black/85 to-brand-black" />
      </div>

      <div class="relative z-10 mx-auto w-full max-w-md">
        <div class="mb-10 flex justify-center lg:hidden">
          <NuxtLink to="/" aria-label="Nairobi Powerbikes home">
            <img src="/NPB Logo.png" alt="Nairobi Powerbikes" class="h-12 w-auto" />
          </NuxtLink>
        </div>
        <slot />
        <p class="mt-8 text-center text-xs text-brand-grey">
          &copy; {{ new Date().getFullYear() }} Nairobi Powerbikes. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Check, Bike } from 'lucide-vue-next'
import { useAuthShowcase } from '~/composables/useAuthShowcase'

const { slides, currentIndex, currentSlide, loading } = useAuthShowcase()

const visibleSlides = computed(() => {
  if (slides.value.length < 2) return [...slides.value]
  const prev = (currentIndex.value - 1 + slides.value.length) % slides.value.length
  return [slides.value[prev], slides.value[currentIndex.value]]
})

const benefits = [
  'Book services & test rides in seconds',
  'Save your wishlist across all devices',
  'Track bookings and notifications in your dashboard',
  'First access to new arrivals and exclusive offers',
]

const sideStats = [
  { label: 'Bikes Delivered', value: '5,000+' },
  { label: 'Partner Brands', value: '12' },
  { label: 'Satisfaction', value: '98%' },
]
</script>

<style scoped>
.kenburns-active {
  animation: animations-kenburns 6s ease-in-out forwards;
}

@keyframes animations-kenburns {
  0% { transform: scale(1.02) translate3d(0, 0, 0); }
  100% { transform: scale(1.14) translate3d(-1.5%, -2%, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .kenburns-active { animation: none !important; }
  .transition-opacity { transition: none !important; }
}
</style>