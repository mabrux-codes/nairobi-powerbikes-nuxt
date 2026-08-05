<template>
  <motion.div
    class="mb-12"
    :class="align === 'center' ? 'mx-auto text-center' : 'text-left'"
    :initial="{ opacity: 0, y: 30 }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :viewport="{ once: true, margin: '-60px' }"
    :transition="{ duration: 0.55, ease: 'easeOut' }"
  >
    <p v-if="eyebrow" class="mb-3 inline-flex items-center gap-3 font-display text-xs font-bold tracking-[0.3em] text-brand-red uppercase">
      <span v-if="align !== 'center'" class="h-px w-10 bg-brand-red" aria-hidden="true" />
      {{ eyebrow }}
    </p>
    <h2 class="font-heading text-4xl leading-[1.08] text-white sm:text-5xl lg:text-6xl">
      {{ title }}<span v-if="accent" class="text-brand-red">&nbsp;{{ accent }}</span>
    </h2>
    <div v-if="align === 'center'" class="mx-auto mt-4 h-1 w-24 bg-brand-red" aria-hidden="true" />
    <p v-if="description" class="mt-4 max-w-xl text-base text-brand-grey" :class="align === 'center' ? 'mx-auto' : ''">
      {{ description }}
    </p>
  </motion.div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'

withDefaults(defineProps<{
  eyebrow?: string
  title: string
  accent?: string
  description?: string
  align?: 'left' | 'center'
}>(), { align: 'center' })
</script>