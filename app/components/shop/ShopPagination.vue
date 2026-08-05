<template>
  <div class="flex flex-col items-center justify-center gap-2">
    <div class="flex items-center gap-1.5">
      <button
        :disabled="page <= 1"
        class="flex h-10 items-center gap-1 rounded-xl border border-white/10 px-4 text-sm font-semibold text-brand-light/80 transition-all hover:border-brand-red/50 hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-30"
        :aria-label="'Previous page'"
        @click="setPage(page - 1)"
      >
        <ChevronLeft class="h-4 w-4" />Prev
      </button>
      <div class="flex items-center gap-1.5 px-1">
        <button
          v-for="p in pageNumbers"
          :key="p"
          class="h-10 w-10 rounded-xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
          :class="p === page
            ? 'bg-brand-red text-white shadow-lg shadow-brand-red/25'
            : 'text-brand-light/60 hover:bg-white/5 hover:text-white'"
          :aria-current="p === page ? 'page' : undefined"
          @click="setPage(p)"
        >{{ p }}</button>
      </div>
      <button
        :disabled="page >= total"
        class="flex h-10 items-center gap-1 rounded-xl border border-white/10 px-4 text-sm font-semibold text-brand-light/80 transition-all hover:border-brand-red/50 hover:text-brand-red disabled:cursor-not-allowed disabled:opacity-30"
        :aria-label="'Next page'"
        @click="setPage(page + 1)"
      >
        Next<ChevronRight class="h-4 w-4" />
      </button>
    </div>
    <p class="text-xs text-brand-grey">Showing <span class="font-semibold text-brand-light/80">{{ start }}–{{ end }}</span> of <span class="font-semibold text-brand-light/80">{{ totalCount }}</span></p>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  page: number
  total: number
  totalCount: number
  pageSize: number
}>()

const emit = defineEmits<{ 'update:page': [page: number] }>()

function setPage(p: number) {
  if (p >= 1 && p <= props.total) {
    emit('update:page', p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const start = computed(() => (props.page - 1) * props.pageSize + 1)
const end = computed(() => Math.min(props.page * props.pageSize, props.totalCount))

const pageNumbers = computed(() => {
  const t = props.total
  const p = props.page
  const pages: number[] = []
  const push = (v: number) => { if (v >= 1 && v <= t && !pages.includes(v)) pages.push(v) }
  push(1)
  if (p > 3) push(p - 1)
  if (p > 1 && p < t) push(p)
  if (p < t - 2) push(p + 1)
  push(t)
  return pages
})
</script>