<template>
  <span
    :class="cn(
      'inline-flex items-center gap-1.5 rounded-full font-medium capitalize shrink-0',
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
      style.cls,
    )"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="style.dot" />
    {{ display }}
  </span>
</template>

<script setup lang="ts">
import { cn } from '~/utils/cn'

const props = withDefaults(defineProps<{ status: string; size?: 'sm' | 'md' }>(), { size: 'md' })

const STATUS_STYLES: Record<string, { cls: string; dot: string }> = {
  pending: { cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', dot: 'bg-amber-400' },
  awaiting_approval: { cls: 'bg-orange-500/10 text-orange-400 border border-orange-500/20', dot: 'bg-orange-400' },
  confirmed: { cls: 'bg-sky-500/10 text-sky-400 border border-sky-500/20', dot: 'bg-sky-400' },
  diagnosed: { cls: 'bg-violet-500/10 text-violet-400 border border-violet-500/20', dot: 'bg-violet-400' },
  in_progress: { cls: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20', dot: 'bg-indigo-400' },
  completed: { cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  cancelled: { cls: 'bg-rose-500/10 text-rose-400 border border-rose-500/20', dot: 'bg-rose-400' },
  available: { cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  sold: { cls: 'bg-rose-500/10 text-rose-400 border border-rose-500/20', dot: 'bg-rose-400' },
  coming_soon: { cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', dot: 'bg-amber-400' },
  active: { cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  inactive: { cls: 'bg-brand-grey/10 text-brand-grey border border-brand-grey/20', dot: 'bg-brand-grey' },
  featured: { cls: 'bg-violet-500/10 text-violet-400 border border-violet-500/20', dot: 'bg-violet-400' },
  hidden: { cls: 'bg-brand-grey/10 text-brand-grey border border-brand-grey/20', dot: 'bg-brand-grey' },
  new: { cls: 'bg-brand-red/10 text-brand-red border border-brand-red/20', dot: 'bg-brand-red' },
  contacted: { cls: 'bg-sky-500/10 text-sky-400 border border-sky-500/20', dot: 'bg-sky-400' },
  resolved: { cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  archived: { cls: 'bg-brand-grey/10 text-brand-grey border border-brand-grey/20', dot: 'bg-brand-grey' },
  unassigned: { cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', dot: 'bg-amber-400' },
  low: { cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', dot: 'bg-amber-400' },
  high: { cls: 'bg-rose-500/10 text-rose-400 border border-rose-500/20', dot: 'bg-rose-400' },
  medium: { cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', dot: 'bg-amber-400' },
  urgent: { cls: 'bg-rose-500/10 text-rose-400 border border-rose-500/20', dot: 'bg-rose-400' },
  scheduled: { cls: 'bg-sky-500/10 text-sky-400 border border-sky-500/20', dot: 'bg-sky-400' },
  expired: { cls: 'bg-rose-500/10 text-rose-400 border border-rose-500/20', dot: 'bg-rose-400' },
  sent: { cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  draft: { cls: 'bg-brand-grey/10 text-brand-grey border border-brand-grey/20', dot: 'bg-brand-grey' },
  published: { cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  enabled: { cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  disabled: { cls: 'bg-brand-grey/10 text-brand-grey border border-brand-grey/20', dot: 'bg-brand-grey' },
  unread: { cls: 'bg-brand-red/10 text-brand-red border border-brand-red/20', dot: 'bg-brand-red' },
  read: { cls: 'bg-brand-grey/10 text-brand-grey border border-brand-grey/20', dot: 'bg-brand-grey' },
  service: { cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  test_ride: { cls: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', dot: 'bg-amber-400' },
  in_stock: { cls: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', dot: 'bg-emerald-400' },
  out_of_stock: { cls: 'bg-rose-500/10 text-rose-400 border border-rose-500/20', dot: 'bg-rose-400' },
}

const style = computed(() => STATUS_STYLES[props.status] || { cls: 'bg-brand-grey/10 text-brand-grey border border-brand-grey/20', dot: 'bg-brand-grey' })

const display = computed(() => props.status.replaceAll('_', ' '))
</script>
