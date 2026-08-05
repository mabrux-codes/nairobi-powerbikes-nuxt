<template>
  <Teleport to="body">
    <div class="fixed bottom-5 right-5 z-[160] flex flex-col gap-3 w-80 max-w-[calc(100vw-2.5rem)] pointer-events-none">
      <TransitionGroup name="rt-toast">
        <div
          v-for="t in store.toastQueue"
          :key="t.id"
          class="pointer-events-auto group relative overflow-hidden rounded-xl border border-brand-grey/20 bg-brand-black/95 backdrop-blur-xl shadow-2xl shadow-black/50"
        >
          <span class="absolute top-0 left-0 h-0.5 w-full origin-left bg-gradient-to-r from-brand-red to-transparent animate-[rtProgress_6s_linear_forwards]" />
          <div class="flex items-start gap-3 p-4">
            <span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" :class="t.iconBg">
              <component :is="iconFor(t.type)" class="h-5 w-5" :class="t.iconColor" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-white">{{ t.title }}</p>
              <p class="mt-0.5 text-xs text-brand-grey leading-snug line-clamp-2">{{ t.message }}</p>
              <NuxtLink
                v-if="t.to"
                :to="t.to"
                class="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-red hover:text-white transition-colors"
                @click="store.dismissToast(t.id)"
              >
                Open <ChevronRight class="h-3 w-3" />
              </NuxtLink>
            </div>
            <button
              class="-mr-1 -mt-1 shrink-0 text-brand-grey/50 hover:text-white transition-colors"
              aria-label="Dismiss"
              @click="store.dismissToast(t.id)"
            >
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useAdminDataStore } from '~/stores/adminData'
import { CalendarCheck, Bike, MessageSquare, Users, Wrench, Package, AlertTriangle, X, ChevronRight, Bell } from 'lucide-vue-next'

const store = useAdminDataStore()

function iconFor(type: string) {
  const map: Record<string, any> = {
    booking: Wrench, test_ride: CalendarCheck, contact: MessageSquare,
    user: Users, motorcycle: Bike, stock: AlertTriangle, gear: Package,
  }
  return map[type] || Bell
}

function iconBg(type: string) {
  const map: Record<string, string> = {
    booking: 'bg-emerald-500/15', test_ride: 'bg-amber-500/15', contact: 'bg-sky-500/15',
    user: 'bg-violet-500/15', motorcycle: 'bg-brand-red/15', stock: 'bg-rose-500/15', gear: 'bg-pink-500/15',
  }
  return map[type] || 'bg-brand-grey/15'
}

function iconColor(type: string) {
  const map: Record<string, string> = {
    booking: 'text-emerald-400', test_ride: 'text-amber-400', contact: 'text-sky-400',
    user: 'text-violet-400', motorcycle: 'text-brand-red', stock: 'text-rose-400', gear: 'text-pink-400',
  }
  return map[type] || 'text-brand-grey'
}

const timers = new Map<string, ReturnType<typeof setTimeout>>()

watch(
  () => store.toastQueue.map(t => t.id).join(','),
  (ids) => {
    const current = new Set(ids ? ids.split(',') : [])
    for (const t of store.toastQueue) {
      if (!timers.has(t.id)) {
        timers.set(t.id, setTimeout(() => store.dismissToast(t.id), 6000))
      }
    }
    for (const [id, timer] of timers) {
      if (!current.has(id)) {
        clearTimeout(timer)
        timers.delete(id)
      }
    }
  },
  { immediate: true },
)

onUnmounted(() => {
  for (const timer of timers.values()) clearTimeout(timer)
  timers.clear()
})
</script>

<style scoped>
.rt-toast-enter-active { transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }
.rt-toast-leave-active { transition: all 0.25s ease-in; }
.rt-toast-enter-from { opacity: 0; transform: translateY(16px) scale(0.95); }
.rt-toast-leave-to { opacity: 0; transform: translateX(24px) scale(0.95); }
@keyframes rtProgress { from { width: 100%; } to { width: 0%; } }
</style>
