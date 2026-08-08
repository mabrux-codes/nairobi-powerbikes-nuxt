<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="cn('group relative overflow-hidden rounded-2xl border border-brand-grey/15 bg-brand-black/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lg hover:shadow-brand-red/5', cardClass)"
  >
    <slot />
    <span class="absolute top-0 left-0 h-0.5 w-0 bg-brand-red transition-all duration-300 group-hover:w-full" />
  </NuxtLink>
  <div
    v-else
    :class="cn('group relative overflow-hidden rounded-2xl border border-brand-grey/15 bg-brand-black/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-lg hover:shadow-brand-red/5', cardClass)"
  >
    <slot />
    <span class="absolute top-0 left-0 h-0.5 w-0 bg-brand-red transition-all duration-300 group-hover:w-full" />
  </div>
</template>

<script setup lang="ts">
import { cn } from '~/utils/cn'

withDefaults(defineProps<{ to?: string; cardClass?: string }>(), {
  to: '',
  cardClass: '',
})
</script>
