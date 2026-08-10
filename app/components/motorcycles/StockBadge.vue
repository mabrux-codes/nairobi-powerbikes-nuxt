<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md transition-colors"
    :class="[status.badge, size === 'sm' ? 'text-[9px] px-2 py-0.5' : '']"
    :aria-label="statusLabelAria"
    role="status"
  >
    <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="status.dot" :aria-hidden="true" />
    {{ status.label }}
    <span v-if="showCount && quantity > 0" class="opacity-70 normal-case tracking-normal">{{ quantity }} available</span>
  </span>
</template>

<script setup lang="ts">
import { getStockStatus, stockOf } from '~/utils/stockStatus'

const props = withDefaults(defineProps<{
  item?: any
  quantity?: number
  size?: 'sm' | 'md'
  showCount?: boolean
}>(), { size: 'sm', showCount: true })

const quantity = computed(() => (props.quantity !== undefined ? Math.max(0, Math.floor(Number(props.quantity))) : stockOf(props.item)))
const status = computed(() => getStockStatus(quantity.value))
const statusLabelAria = computed(() => `${status.value.label} — ${status.value.message}`)
</script>