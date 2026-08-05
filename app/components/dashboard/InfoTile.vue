<template>
  <div class="rounded-xl border border-brand-grey/15 bg-white/[0.02] p-3">
    <p class="text-[10px] font-display tracking-[0.2em] text-brand-grey/70 uppercase">{{ label }}</p>
    <p class="mt-1 text-sm font-medium break-words" :class="accent ? 'text-brand-red' : 'text-white'">{{ value }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label: string; value: string; accent?: boolean }>(), { accent: false })
</script>