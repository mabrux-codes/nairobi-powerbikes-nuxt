<template>
  <div class="space-y-4">
    <div
      v-for="i in rows"
      :key="i"
      class="animate-pulse rounded-2xl border border-brand-grey/10 bg-brand-black/60 p-5"
      :class="variant === 'card' ? 'flex flex-col gap-3' : 'flex items-center gap-4'"
    >
      <template v-if="variant === 'card'">
        <div class="flex items-center gap-3">
          <div class="h-11 w-11 rounded-xl bg-brand-grey/10" />
          <div class="flex-1 space-y-2">
            <div class="h-4 w-2/5 rounded bg-brand-grey/10" />
            <div class="h-3 w-1/3 rounded bg-brand-grey/10" />
          </div>
        </div>
        <div class="h-3 w-full rounded bg-brand-grey/10" />
        <div class="h-3 w-4/5 rounded bg-brand-grey/10" />
        <div class="flex gap-2 pt-1">
          <div class="h-8 w-20 rounded-lg bg-brand-grey/10" />
          <div class="h-8 w-20 rounded-lg bg-brand-grey/10" />
        </div>
      </template>
      <template v-else>
        <div class="h-10 w-10 shrink-0 rounded-full bg-brand-grey/10" />
        <div class="flex-1 space-y-2">
          <div class="h-4 w-2/5 rounded bg-brand-grey/10" />
          <div class="h-3 w-3/5 rounded bg-brand-grey/10" />
        </div>
        <div class="hidden sm:block h-3 w-24 rounded bg-brand-grey/10" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ rows?: number; variant?: 'card' | 'row' }>(), {
  rows: 4,
  variant: 'card',
})
</script>
