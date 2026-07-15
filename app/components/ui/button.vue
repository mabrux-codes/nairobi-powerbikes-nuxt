<template>
  <button
    :class="cn(
      'inline-flex items-center justify-center gap-2 font-display tracking-display uppercase transition-all duration-200 rounded-sm',
      variant === 'primary' && 'btn-primary',
      variant === 'secondary' && 'bg-brand-grey/20 text-white border border-brand-grey/40 hover:bg-brand-grey/30',
      variant === 'ghost' && 'btn-ghost',
      variant === 'outline' && 'border border-brand-red text-brand-red hover:bg-brand-red hover:text-white',
      size === 'sm' && 'px-3 py-1.5 text-xs',
      size === 'md' && 'px-5 py-2.5 text-sm',
      size === 'lg' && 'px-6 py-3 text-base',
      disabled && 'opacity-50 cursor-not-allowed',
    )"
    :disabled="disabled"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { cn } from '~/utils/cn'

withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
})
</script>
