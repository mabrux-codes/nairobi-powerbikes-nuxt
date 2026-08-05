<template>
  <section class="relative overflow-hidden">
    <div class="absolute inset-0">
      <img
        v-if="image"
        :src="image"
        alt=""
        aria-hidden="true"
        loading="eager"
        class="h-full w-full object-cover"
      />
      <div class="absolute inset-0 hero-gradient bg-gradient-to-b from-brand-black/95 via-brand-black/75 to-brand-black" />
      <div class="asphalt-grid absolute inset-0 opacity-60" />
    </div>

    <div class="relative mx-auto max-w-[90rem] px-4 pt-32 pb-14 sm:px-6 sm:pt-36 lg:px-8 lg:pt-44 lg:pb-20">
      <motion.div
        class="flex flex-wrap items-center gap-2 text-xs font-display tracking-display uppercase text-brand-grey"
        :initial="{ opacity: 0, y: 14 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.45, delay: 0.05 }"
      >
        <NuxtLink to="/" class="transition-colors hover:text-brand-red">Home</NuxtLink>
        <ChevronRight class="h-3 w-3 text-brand-grey/50" />
        <NuxtLink v-if="crumbTo" :to="crumbTo" class="transition-colors hover:text-brand-red">{{ crumb }}</NuxtLink>
        <ChevronRight v-if="crumbTo" class="h-3 w-3 text-brand-grey/50" />
        <span class="text-brand-red">{{ title }}</span>
      </motion.div>

      <motion.p
        class="mt-6 flex items-center gap-2 font-display text-sm tracking-[0.28em] uppercase text-brand-red"
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: 0.15 }"
      >
        <span class="h-px w-10 bg-brand-red" />
        {{ eyebrow }}
      </motion.p>

      <motion.h1
        class="mt-4 font-heading text-5xl text-white sm:text-6xl lg:text-7xl"
        :initial="{ opacity: 0, y: 24 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.25 }"
      >
        {{ title }} <span v-if="accent" class="text-brand-red">{{ accent }}</span>
      </motion.h1>

      <motion.p
        class="mt-5 max-w-2xl text-base leading-relaxed text-brand-light/70 sm:text-lg"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.55, delay: 0.35 }"
      >
        {{ description }}
      </motion.p>

      <motion.div
        v-if="$slots.actions"
        class="mt-8 flex flex-wrap items-center gap-4"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.55, delay: 0.45 }"
      >
        <slot name="actions" />
      </motion.div>

      <motion.div
        v-if="stats.length"
        class="mt-10 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md sm:grid-cols-4"
        :initial="{ opacity: 0, y: 24 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.55 }"
      >
        <div v-for="s in stats" :key="s.label" class="bg-brand-black/70 px-5 py-4">
          <p class="font-heading text-2xl text-white sm:text-3xl">{{ s.value }}</p>
          <p class="mt-1 text-[11px] font-display tracking-display uppercase text-brand-grey">{{ s.label }}</p>
        </div>
      </motion.div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { ChevronRight } from 'lucide-vue-next'

defineProps<{
  title: string
  accent?: string
  eyebrow: string
  description: string
  image?: string
  crumb?: string
  crumbTo?: string
  stats?: { label: string; value: string | number }[]
}>()
</script>
