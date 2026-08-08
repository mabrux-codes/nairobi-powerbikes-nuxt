<template>
  <span
    class="hidden xl:inline-flex items-center gap-1.5 px-3 h-9 text-[10px] font-display tracking-[0.2em] uppercase rounded-xl border transition-all duration-300"
    :class="status === 'connected'
      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-400'
      : status === 'reconnecting'
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-400'
        : 'border-brand-grey/20 bg-white/[0.03] text-brand-grey'"
    :title="status === 'reconnecting' ? 'Connection lost — reconnecting automatically…' : 'Real-time connection active'"
  >
    <span class="relative flex h-2 w-2">
      <span
        v-if="status === 'reconnecting'"
        class="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping"
      />
      <span
        class="relative inline-flex h-2 w-2 rounded-full"
        :class="status === 'connected' ? 'bg-emerald-400' : status === 'reconnecting' ? 'bg-amber-400' : 'bg-brand-grey/60'"
      />
    </span>
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { useAdminDataStore } from '~/stores/adminData'

const store = useAdminDataStore()

const status = computed(() => store.status)

const label = computed(() => {
  if (store.status === 'connected') return 'Live'
  if (store.status === 'reconnecting') return 'Reconnecting'
  return 'Connecting'
})
</script>
