<template>
  <div class="flex min-h-screen items-center justify-center bg-brand-black px-4">
    <div class="max-w-md text-center">
      <p class="font-display text-7xl font-bold tracking-display text-brand-red/20">{{ codeLabel }}</p>
      <h1 class="mt-4 font-display text-2xl tracking-display text-white">{{ message }}</h1>
      <p class="mt-3 text-sm leading-relaxed text-brand-grey">
        {{ description }}
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <NuxtLink to="/" class="inline-flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red/90">
          <Home class="h-4 w-4" />Back to home
        </NuxtLink>
        <NuxtLink to="/motorcycles" class="inline-flex items-center gap-2 rounded-xl border border-brand-grey/20 px-5 py-2.5 text-sm font-semibold text-brand-grey transition-colors hover:border-brand-red/50 hover:text-brand-red">
          Browse motorcycles
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Home } from 'lucide-vue-next'

const props = defineProps<{
  error?: {
    statusCode?: number
    statusMessage?: string
    message?: string
  }
}>()

const codeLabel = computed(() => String(props.error?.statusCode || 404))
const message = computed(() => {
  if (props.error?.statusCode === 404) return 'Page not found'
  return props.error?.statusMessage || props.error?.message || 'Something went wrong'
})
const description = computed(() => {
  if (props.error?.statusCode === 404) {
    return 'The page you are looking for doesn\u2019t exist, may have been removed, or the link you followed is out of date.'
  }
  return 'An unexpected error occurred. Please try again in a moment, or head back to the homepage.'
})

useHead({ title: `${message.value} - Nairobi Powerbikes` })
</script>
