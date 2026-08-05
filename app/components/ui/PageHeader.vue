<template>
  <section class="relative overflow-hidden border-b border-white/[0.06]">
    <div class="asphalt-grid absolute inset-0" aria-hidden="true" />
    <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-black" aria-hidden="true" />
    <div class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-red/10 blur-3xl" aria-hidden="true" />

    <div class="relative z-10 mx-auto max-w-[90rem] px-4 pb-14 pt-[calc(var(--nav-h)+20px)] sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" class="mb-9">
        <ol class="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wide text-brand-grey uppercase">
          <li>
            <NuxtLink to="/" class="flex items-center gap-1.5 transition-colors hover:text-brand-red">
              <Home class="h-3.5 w-3.5" />Home
            </NuxtLink>
          </li>
          <li v-for="(c, i) in crumbs" :key="i + '-sep'" class="flex items-center gap-2">
            <ChevronRight class="h-3.5 w-3.5 text-brand-grey/50" />
            <span v-if="c.to && i < crumbs.length - 1" class="transition-colors" :class="c.to ? 'text-brand-grey hover:text-brand-red' : ''">
              <NuxtLink v-if="c.to" :to="c.to" class="transition-colors hover:text-brand-red">{{ c.label }}</NuxtLink>
              <template v-else>{{ c.label }}</template>
            </span>
            <span v-else :class="i === crumbs.length - 1 ? 'text-brand-red' : 'text-brand-grey'" :aria-current="i === crumbs.length - 1 ? 'page' : undefined">
              {{ c.label }}
            </span>
          </li>
        </ol>
      </nav>

      <motion.div :initial="{ opacity: 0, y: 34 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.6, ease: 'easeOut' }">
        <p v-if="eyebrow" class="mb-3 flex items-center gap-3 font-display text-xs font-bold tracking-[0.3em] text-brand-red uppercase">
          <span class="h-px w-10 bg-brand-red" aria-hidden="true" />
          {{ eyebrow }}
        </p>
        <h1 class="font-heading text-[2.6rem] leading-[1.05] text-white sm:text-6xl lg:text-7xl">
          {{ title }}<span v-if="accent" class="text-brand-red">&nbsp;{{ accent }}</span>
        </h1>
        <p v-if="description" class="mt-4 max-w-2xl text-base leading-relaxed text-brand-grey sm:text-lg">
          {{ description }}
        </p>
        <div v-if="hasActions" class="mt-8 flex flex-wrap gap-4">
          <slot name="actions" />
        </div>

        <div v-if="stats?.length" class="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-4">
          <div v-for="s in stats" :key="s.label" class="bg-brand-black/90 px-5 py-5 backdrop-blur-sm">
            <p class="font-heading text-2xl text-white sm:text-3xl">{{ s.value }}</p>
            <p class="mt-1 font-display text-[11px] font-semibold tracking-[0.18em] text-brand-grey uppercase">{{ s.label }}</p>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Home, ChevronRight } from 'lucide-vue-next'

defineProps<{
  eyebrow?: string
  title: string
  accent?: string
  description?: string
  crumbs?: { label: string; to?: string }[]
  stats?: { label: string; value: string | number }[]
}>()

const hasActions = computed(() => !!useSlots().actions)
</script>