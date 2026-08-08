<template>
  <div v-if="totalPages > 1" class="flex flex-wrap items-center justify-between gap-3 pt-4">
    <p class="text-xs text-brand-grey">
      Showing <span class="font-semibold text-white">{{ from }}-{{ to }}</span> of <span class="font-semibold text-white">{{ total }}</span>
    </p>
    <div class="flex items-center gap-1.5">
      <button
        class="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-grey/20 text-brand-grey hover:text-white hover:border-brand-red/50 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200"
        :disabled="page <= 1"
        aria-label="Previous page"
        @click="emit('update:page', page - 1)"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button
        v-for="p in visiblePages"
        :key="p"
        class="h-9 min-w-9 px-2 rounded-lg text-sm font-semibold transition-all duration-200"
        :class="p === page ? 'bg-brand-red text-white shadow-lg shadow-brand-red/25' : 'border border-brand-grey/20 text-brand-grey hover:text-white hover:border-brand-red/50'"
        :aria-current="p === page ? 'page' : undefined"
        @click="emit('update:page', p)"
      >{{ p }}</button>
      <button
        class="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-grey/20 text-brand-grey hover:text-white hover:border-brand-red/50 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200"
        :disabled="page >= totalPages"
        aria-label="Next page"
        @click="emit('update:page', page + 1)"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ page: number; totalPages: number; total?: number; pageSize?: number }>(), { total: 0, pageSize: 10 })

const emit = defineEmits<{ 'update:page': [value: number] }>()

const from = computed(() => (props.totalPages > 0 ? (props.page - 1) * props.pageSize + 1 : 0))
const to = computed(() => Math.min(props.page * props.pageSize, props.total))

const visiblePages = computed(() => {
  const total = props.totalPages
  const current = props.page
  const pages = new Set<number>([1, total, current, current - 1, current + 1])
  const arr = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b)
  return arr
})
</script>
