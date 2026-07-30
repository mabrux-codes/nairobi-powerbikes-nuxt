<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="btnClasses"
    v-bind="$attrs"
  >
    <span v-if="loading" class="inline-flex items-center gap-2">
      <svg class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <slot name="loading">{{ loadingText || defaultLoadingText }}</slot>
    </span>
    <span v-else class="inline-flex items-center gap-2">
      <slot />
      <span v-if="trailingArrow" class="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-1">
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
      </span>
    </span>
  </NuxtLink>

  <button
    v-else
    :class="btnClasses"
    :disabled="disabled || loading || undefined"
    :type="type"
    v-bind="$attrs"
  >
    <span v-if="loading" class="inline-flex items-center gap-2">
      <svg class="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      <slot name="loading">{{ loadingText || defaultLoadingText }}</slot>
    </span>
    <span v-else class="inline-flex items-center gap-2">
      <slot />
      <span v-if="trailingArrow" class="inline-flex shrink-0 transition-transform duration-200 group-hover:translate-x-1">
        <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
      </span>
    </span>
  </button>
</template>

<script setup lang="ts">
import { cn } from '~/utils/cn'

const props = withDefaults(defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'text'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  trailingArrow?: boolean
  type?: 'button' | 'submit' | 'reset'
  to?: string
}>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  trailingArrow: false,
  type: 'button',
})

const defaultLoadingText = computed(() => {
  const map: Record<string, string> = {
    primary: 'Saving...',
    secondary: 'Saving...',
    ghost: 'Loading...',
    danger: 'Deleting...',
    text: 'Loading...',
  }
  return map[props.variant] || 'Loading...'
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-gradient-to-b from-brand-red to-red-700 text-white shadow-md shadow-brand-red/20 hover:shadow-lg hover:shadow-brand-red/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:shadow-sm'
    case 'secondary':
      return 'border border-brand-red/70 text-white bg-transparent hover:bg-brand-red hover:text-white hover:border-brand-red hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
    case 'ghost':
      return 'border border-white/15 text-white bg-transparent hover:bg-white/8 hover:border-white/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
    case 'danger':
      return 'border border-red-500/60 text-red-400 bg-transparent hover:bg-brand-red hover:text-white hover:border-brand-red hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
    case 'text':
      return 'text-brand-grey hover:text-white bg-transparent hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]'
    default:
      return ''
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-9 px-4 text-xs gap-1.5'
    case 'md':
      return 'h-11 px-5 text-sm gap-2'
    case 'lg':
      return 'h-14 px-8 text-base gap-2.5'
    default:
      return ''
  }
})

const btnClasses = computed(() => cn(
  'group relative inline-flex items-center justify-center gap-2 font-semibold leading-none no-underline transition-all duration-200 select-none cursor-pointer',
  'rounded-xl',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-black',
  variantClasses.value,
  sizeClasses.value,
  (props.disabled || props.loading) && 'pointer-events-none opacity-50',
))
</script>
