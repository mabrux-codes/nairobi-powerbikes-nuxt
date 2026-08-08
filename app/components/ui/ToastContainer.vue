<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed inset-x-3 bottom-[108px] z-[200] flex flex-col items-stretch gap-2.5 sm:bottom-[112px] sm:inset-x-auto sm:right-6 sm:items-end"
      aria-live="polite"
      aria-label="Notifications"
      data-toast-region
    >
      <TransitionGroup name="toast" tag="div" class="flex w-full flex-col items-stretch gap-2.5 sm:flex-none sm:items-end">
        <Toast
          v-for="t in toasts"
          :key="t.id"
          :toast="t"
          class="w-full max-w-[calc(100vw-1.5rem)] sm:w-[340px] sm:max-w-[360px]"
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
  transform: translateY(15px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(15px);
}
.toast-move {
  transition: transform 0.3s cubic-bezier(0.21, 1, 0.32, 1);
}
</style>