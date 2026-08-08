<template>
  <div class="flex flex-wrap items-center gap-2.5">
    <div class="relative min-w-[200px] flex-1 sm:max-w-xs">
      <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-grey/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        :value="search"
        type="text"
        :placeholder="searchPlaceholder"
        class="h-10 w-full rounded-xl border border-brand-grey/25 bg-brand-black/70 pl-9 pr-8 text-sm text-white placeholder:text-brand-grey/50 transition-all duration-200 focus:border-brand-red/60 focus:outline-none focus:ring-2 focus:ring-brand-red/20"
        @input="$emit('update:search', ($event.target as HTMLInputElement).value)"
      />
      <button v-if="search" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-grey/60 hover:text-white transition-colors" aria-label="Clear search" @click="$emit('update:search', '')">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
    </div>

    <div class="flex flex-wrap items-center gap-2.5">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ search: string; searchPlaceholder?: string }>()
defineEmits<{ 'update:search': [value: string] }>()
</script>
