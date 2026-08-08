<template>
  <div
    class="pointer-events-auto group relative w-full overflow-hidden rounded-xl border border-brand-grey/20 bg-brand-black/95 shadow-2xl shadow-black/60 ring-1 ring-white/5 backdrop-blur-xl"
    role="status"
    :aria-labelledby="`toast-title-${toast.id}`"
    @mouseenter="$emit('pause', toast.id)"
    @mouseleave="$emit('resume', toast.id)"
  >
    <span
      class="absolute inset-x-0 top-0 h-0.5 origin-left bg-gradient-to-r from-brand-red via-brand-red/70 to-transparent toast-progress"
      :style="{ animationDuration: toast.duration + 'ms', animationPlayState: toast.paused ? 'paused' : 'running' }"
      aria-hidden="true"
    />
    <div class="flex items-start gap-3 p-4">
      <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" :class="style.bg">
        <component :is="style.icon" class="h-5 w-5" :class="style.fg" />
      </span>
      <div class="min-w-0 flex-1">
        <p :id="`toast-title-${toast.id}`" class="text-sm font-semibold text-white">{{ toast.title }}</p>
        <p v-if="toast.message" class="mt-0.5 text-xs leading-snug text-brand-grey whitespace-pre-line break-words">{{ toast.message }}</p>
        <NuxtLink
          v-if="toast.to"
          :to="toast.to"
          class="mt-2 inline-flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-brand-red transition-colors hover:text-white"
          @click="$emit('close', toast.id)"
        >
          Open <ChevronRight class="h-3 w-3" />
        </NuxtLink>
      </div>
      <button
        class="-mr-1.5 -mt-1.5 shrink-0 rounded-lg p-2 text-brand-grey/50 transition-colors hover:bg-white/5 hover:text-white"
        :aria-label="`Close ${toast.title}`"
        @click="$emit('close', toast.id)"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  AlertTriangle, Bell, Bike, CalendarCheck, CheckCircle2, ChevronRight,
  Info, MessageSquare, Package, Settings, User, Wrench, X, XCircle,
} from 'lucide-vue-next'
import type { ToastItem, ToastType } from '~/composables/useToast'

const props = defineProps<{ toast: ToastItem }>()
defineEmits<{ close: [id: string]; pause: [id: string]; resume: [id: string] }>()

const styleMap: Record<ToastType, { icon: any; bg: string; fg: string }> = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-500/15', fg: 'text-emerald-400' },
  error: { icon: XCircle, bg: 'bg-red-500/15', fg: 'text-red-400' },
  warning: { icon: AlertTriangle, bg: 'bg-amber-500/15', fg: 'text-amber-400' },
  info: { icon: Info, bg: 'bg-sky-500/15', fg: 'text-sky-400' },
  booking: { icon: Wrench, bg: 'bg-emerald-500/15', fg: 'text-emerald-400' },
  test_ride: { icon: CalendarCheck, bg: 'bg-amber-500/15', fg: 'text-amber-400' },
  contact: { icon: MessageSquare, bg: 'bg-sky-500/15', fg: 'text-sky-400' },
  user: { icon: User, bg: 'bg-violet-500/15', fg: 'text-violet-400' },
  motorcycle: { icon: Bike, bg: 'bg-brand-red/15', fg: 'text-brand-red' },
  stock: { icon: Package, bg: 'bg-rose-500/15', fg: 'text-rose-400' },
  gear: { icon: Settings, bg: 'bg-pink-500/15', fg: 'text-pink-400' },
  system: { icon: Bell, bg: 'bg-brand-grey/15', fg: 'text-brand-grey' },
}

const style = computed(() => styleMap[props.toast.type] ?? styleMap.system)
</script>

<style scoped>
.toast-progress {
  animation-name: toast-progress;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}

@keyframes toast-progress {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}
</style>