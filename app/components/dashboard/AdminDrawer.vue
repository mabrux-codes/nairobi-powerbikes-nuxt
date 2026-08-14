<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition-opacity duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[70]" role="dialog" aria-modal="true" :aria-label="title">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="emit('close')" />
        <div
          class="absolute right-0 top-0 h-full w-full sm:max-w-lg flex flex-col border-l border-brand-grey/20 bg-[#111114] shadow-2xl shadow-black/60"
          :class="props.wide ? 'sm:max-w-3xl lg:max-w-4xl' : ''"
        >
          <header class="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-brand-grey/15 bg-brand-black/60 shrink-0">
            <div class="min-w-0">
              <h2 class="font-heading text-xl text-white truncate">{{ title }}</h2>
              <p v-if="subtitle" class="mt-0.5 text-xs text-brand-grey truncate">{{ subtitle }}</p>
            </div>
            <button
              class="p-2 text-brand-grey hover:text-white hover:bg-white/5 rounded-lg transition-all duration-200 shrink-0"
              aria-label="Close drawer"
              @click="emit('close')"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </header>

          <div class="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="sticky bottom-0 shrink-0 border-t border-brand-grey/15 bg-brand-black/80 backdrop-blur-xl px-5 sm:px-6 py-4 flex items-center justify-end gap-3">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ open: boolean; title?: string; subtitle?: string; hideOnEscape?: boolean; wide?: boolean }>(), {
  title: '',
  subtitle: '',
  hideOnEscape: true,
  wide: false,
})
const emit = defineEmits<{ close: [] }>()

watch(() => props.open, (open) => {
  if (!open) return
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && props.hideOnEscape) emit('close')
  }
  document.addEventListener('keydown', onKey)
  onBeforeUnmount(() => document.removeEventListener('keydown', onKey))
})
</script>
