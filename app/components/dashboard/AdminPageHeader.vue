<template>
  <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div class="min-w-0">
      <p v-if="eyebrow" class="text-[10px] font-display tracking-[0.3em] text-brand-grey/70 uppercase flex items-center gap-2">
        <span v-if="live" class="relative flex h-2 w-2">
          <span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        {{ eyebrow }}
      </p>
      <h1 class="mt-1.5 font-heading text-3xl sm:text-4xl text-white">
        <slot name="title">{{ title }}</slot>
      </h1>
      <p v-if="description" class="mt-1.5 text-sm text-brand-grey max-w-2xl">{{ description }}</p>
    </div>
    <div v-if="$slots.actions || actions.length" class="flex flex-wrap items-center gap-2.5 shrink-0">
      <slot name="actions">
        <Button
          v-for="a in actions"
          :key="a.label"
          :to="a.to"
          :variant="a.variant || 'primary'"
          :size="a.size || 'sm'"
          :loading="a.loading"
          :disabled="a.disabled"
          @click="a.onClick"
        >
          <component :is="a.icon" v-if="a.icon" class="h-4 w-4" />
          {{ a.label }}
        </Button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  eyebrow?: string
  live?: boolean
  actions?: { label: string; to?: string; variant?: string; size?: string; icon?: any; loading?: boolean; disabled?: boolean; onClick?: () => void }[]
}>(), {
  description: '',
  eyebrow: '',
  live: false,
  actions: () => [],
})
</script>
