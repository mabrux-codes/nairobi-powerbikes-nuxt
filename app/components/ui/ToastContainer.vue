<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed inset-x-3 top-0 z-[200] flex flex-col items-stretch gap-2.5 md:inset-x-auto md:right-5 md:items-end lg:right-6"
      :style="offsetStyle"
      aria-live="polite"
      aria-label="Notifications"
      data-toast-region
    >
      <TransitionGroup name="toast" tag="div" class="flex w-full flex-col items-stretch gap-2.5 md:w-[320px] md:flex-none lg:w-[340px]">
        <Toast
          v-for="t in toasts"
          :key="t.id"
          :toast="t"
          class="w-full max-w-[calc(100vw-1.5rem)] md:max-w-none"
          @close="remove"
          @pause="pause"
          @resume="resume"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, remove, pause, resume } = useToast()
const route = useRoute()

// Reuse the layout's own dynamic navbar height (announcement bar + navbar or
// dashboard header) so toasts always sit BELOW the navbar — never behind it.
// Values are maintained live by Navbar.vue / DashboardHeader.vue via ResizeObserver.
function topOffset(): string {
  const layout = route.meta.layout
  if (layout === 'dashboard') return 'calc(var(--admin-h, 64px) + 16px)'
  if (layout === 'auth') return 'calc(var(--announce-h, 0px) + 16px)'
  return 'calc(var(--nav-h, 88px) + 16px)'
}

const offsetStyle = computed(() => ({ top: topOffset() }))
</script>

<style scoped>
.toast-enter-active {
  transition: opacity 0.3s cubic-bezier(0.21, 1, 0.32, 1), transform 0.3s cubic-bezier(0.21, 1, 0.32, 1);
}
.toast-leave-active {
  transition: opacity 0.22s ease-in, transform 0.22s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-14px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.toast-move {
  transition: transform 0.3s cubic-bezier(0.21, 1, 0.32, 1);
}
</style>