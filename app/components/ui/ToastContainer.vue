<template>
  <div class="pointer-events-none fixed right-4 top-4 z-[200] flex flex-col items-end gap-3" aria-live="polite" aria-label="Notifications">
    <TransitionGroup name="toast" tag="div" class="flex flex-col items-end gap-3">
      <Toast
        v-for="t in toasts"
        :key="t.id"
        :toast="t"
        @close="remove"
        @pause="pause"
        @resume="resume"
        class="pointer-events-auto"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, remove, pause, resume } = useToast()
</script>

<style scoped>
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
</style>
