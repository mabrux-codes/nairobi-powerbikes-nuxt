<template>
  <div class="rounded-2xl border border-dashed border-brand-grey/20 bg-brand-black/40 p-6 text-center sm:p-12">
    <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-brand-grey/15">
      <component :is="icon" class="h-7 w-7 text-brand-grey/50" />
    </div>
    <p class="mt-4 font-display text-lg tracking-display text-brand-grey">{{ title }}</p>
    <p v-if="description" class="mt-1.5 text-sm text-brand-grey/60 max-w-md mx-auto">{{ description }}</p>
    <div v-if="$slots.default" class="mt-5 flex justify-center">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ icon: any; title: string; description?: string }>(), {
  description: '',
})
</script>
