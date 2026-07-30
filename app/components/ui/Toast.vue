<template>
  <div
    class="pointer-events-auto flex w-80 items-start gap-3 rounded-xl border p-4 shadow-xl backdrop-blur-md transition-all duration-300"
    :class="toastClasses"
    role="alert"
    :aria-labelledby="`toast-title-${toast.id}`"
    @mouseenter="$emit('pause', toast.id)"
    @mouseleave="$emit('resume', toast.id)"
  >
    <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold">
      <svg v-if="toast.type === 'success'" class="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
      <svg v-else-if="toast.type === 'error'" class="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      <svg v-else-if="toast.type === 'warning'" class="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
      <svg v-else class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    </span>

    <div class="min-w-0 flex-1">
      <p :id="`toast-title-${toast.id}`" class="text-sm font-semibold text-white">{{ toast.title }}</p>
      <p v-if="toast.message" class="mt-0.5 text-xs leading-relaxed text-brand-grey/80">{{ toast.message }}</p>
      <div class="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/10">
        <div class="h-full rounded-full transition-all" :class="progressClass" :style="{ width: progressPct + '%' }" />
      </div>
    </div>

    <button
      class="-mr-1 -mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-brand-grey/50 hover:text-white hover:bg-white/10 transition-colors"
      @click="$emit('close', toast.id)"
      aria-label="Close notification"
    >
      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
interface ToastItem {
  id: string; type: 'success' | 'error' | 'warning' | 'info'; title: string; message?: string; duration: number; createdAt: number; remaining: number; paused: boolean
}

const props = defineProps<{ toast: ToastItem }>()
defineEmits<{ close: [id: string]; pause: [id: string]; resume: [id: string] }>()

const elapsed = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

const progressPct = computed(() => {
  if (props.toast.paused) return Math.max(0, (props.toast.remaining / props.toast.duration) * 100)
  return Math.max(0, (1 - elapsed.value / props.toast.duration) * 100)
})

onMounted(() => {
  interval = setInterval(() => {
    if (!props.toast.paused) elapsed.value += 100
  }, 100)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const toastClasses = computed(() => {
  switch (props.toast.type) {
    case 'success': return 'border-green-500/30 bg-green-500/10'
    case 'error': return 'border-red-500/30 bg-red-500/10'
    case 'warning': return 'border-amber-500/30 bg-amber-500/10'
    case 'info': return 'border-blue-500/30 bg-blue-500/10'
    default: return 'border-white/10 bg-brand-black/90'
  }
})

const progressClass = computed(() => {
  switch (props.toast.type) {
    case 'success': return 'bg-green-400'
    case 'error': return 'bg-red-400'
    case 'warning': return 'bg-amber-400'
    case 'info': return 'bg-blue-400'
    default: return 'bg-white/40'
  }
})
</script>
