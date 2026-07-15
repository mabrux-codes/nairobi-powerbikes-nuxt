<template>
  <span
    :class="cn(
      'inline-flex items-center rounded-sm px-2.5 py-0.5 text-xs font-display tracking-display uppercase transition-colors duration-200',
      variant === 'default' && 'bg-brand-red text-white',
      variant === 'secondary' && 'bg-blue-500/20 text-blue-400',
      variant === 'outline' && 'border border-brand-grey/40 text-brand-grey',
      variant === 'success' && 'bg-emerald-500/20 text-emerald-400',
      variant === 'warning' && 'bg-amber-500/20 text-amber-400',
      variant === 'danger' && 'bg-red-500/20 text-red-400',
    )"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { cn } from '~/utils/cn'

withDefaults(defineProps<{
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'danger'
}>(), {
  variant: 'default',
})
</script>
