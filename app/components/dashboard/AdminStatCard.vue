<template>
  <AdminCard :to="to" :card-class="cardClass">
    <div class="flex items-start justify-between gap-3">
      <span class="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110" :class="iconBg || 'bg-brand-red/15'">
        <component :is="icon" class="h-5 w-5" :class="iconColor || 'text-brand-red'" />
      </span>
      <span
        v-if="trend !== undefined"
        class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
        :class="trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'"
      >
        <TrendingUp v-if="trend >= 0" class="h-3 w-3" />
        <TrendingDown v-else class="h-3 w-3" />
        {{ Math.abs(trend) }}%
      </span>
    </div>
    <p class="mt-4 font-heading text-3xl text-white">{{ display }}</p>
    <p class="mt-1 font-display text-xs tracking-display text-brand-grey/90 uppercase">{{ label }}</p>
    <p v-if="hint" class="mt-1 text-[11px] text-brand-grey/60">{{ hint }}</p>
  </AdminCard>
</template>

<script setup lang="ts">
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

withDefaults(defineProps<{
  label: string
  display: string | number
  icon: any
  to?: string
  trend?: number
  hint?: string
  iconBg?: string
  iconColor?: string
  cardClass?: string
}>(), {
  to: '',
  hint: '',
  iconBg: '',
  iconColor: '',
  cardClass: '',
})
</script>
