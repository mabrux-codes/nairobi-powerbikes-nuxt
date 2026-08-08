<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        role="dialog"
        :aria-modal="true"
        :aria-label="ariaLabel || title"
        @keydown.esc="close"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeOnBackdrop ? close() : undefined" />

        <div ref="modalRef" class="relative w-full max-w-md overflow-y-auto max-h-[90dvh] rounded-xl border border-brand-grey/20 bg-brand-black/95 p-6 shadow-2xl shadow-black/50 backdrop-blur-md">
          <div class="flex items-start justify-between gap-4">
            <div v-if="icon" class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full" :class="iconBgClass">
              <component :is="icon" class="h-6 w-6" :class="iconColorClass" />
            </div>
            <button
              v-if="showClose"
              class="-mr-2 -mt-2 ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand-grey/50 hover:text-white hover:bg-white/10 transition-colors"
              @click="close"
              aria-label="Close dialog"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="mt-4">
            <h2 class="text-lg font-semibold text-white">{{ title }}</h2>
            <p v-if="message" class="mt-1.5 text-sm leading-relaxed text-brand-grey/80">{{ message }}</p>
          </div>

          <div v-if="$slots.default" class="mt-4">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  open: boolean
  title?: string
  message?: string
  icon?: object
  iconType?: 'danger' | 'warning' | 'info' | 'success'
  showClose?: boolean
  closeOnBackdrop?: boolean
  ariaLabel?: string
}>(), {
  title: '',
  message: '',
  showClose: true,
  closeOnBackdrop: true,
  iconType: 'info',
})

const emit = defineEmits<{ close: [] }>()

const modalRef = ref<HTMLElement | null>(null)

function close() {
  emit('close')
}

const iconBgClass = computed(() => {
  switch (props.iconType) {
    case 'danger': return 'bg-red-500/15'
    case 'warning': return 'bg-amber-500/15'
    case 'success': return 'bg-green-500/15'
    default: return 'bg-blue-500/15'
  }
})

const iconColorClass = computed(() => {
  switch (props.iconType) {
    case 'danger': return 'text-red-400'
    case 'warning': return 'text-amber-400'
    case 'success': return 'text-green-400'
    default: return 'text-blue-400'
  }
})

function trapFocus(e: KeyboardEvent) {
  if (e.key !== 'Tab' || !modalRef.value) return
  const focusable = modalRef.value.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  if (!focusable.length) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
}

onMounted(() => {
  document.addEventListener('keydown', trapFocus)
  nextTick(() => {
    const first = modalRef.value?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    first?.focus()
  })
})

onUnmounted(() => {
  document.removeEventListener('keydown', trapFocus)
})
</script>

<style scoped>
.modal-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { transition: all 0.15s ease-in; }
.modal-enter-from { opacity: 0; }
.modal-enter-from > div:last-child { transform: scale(0.9) translateY(20px); }
.modal-leave-to { opacity: 0; }
.modal-leave-to > div:last-child { transform: scale(0.95) translateY(10px); }
</style>
