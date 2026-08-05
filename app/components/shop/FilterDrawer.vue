<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="open" class="fixed inset-0 z-[85] lg:hidden" role="dialog" aria-modal="true" :aria-label="`${collectionLabel} filters`">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="close" />
        <div class="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-brand-black shadow-2xl shadow-black">
          <div class="flex items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <div>
              <p class="text-[11px] font-display tracking-[0.22em] text-brand-red uppercase">Refine Results</p>
              <h2 class="font-heading text-xl text-white">Filters</h2>
            </div>
            <button
              ref="closeBtn"
              class="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-red hover:text-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
              aria-label="Close filters"
              @click="close"
            >
              <X class="h-4 w-4" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto px-5 py-5">
            <slot />
          </div>

          <div class="flex gap-3 border-t border-white/[0.06] px-5 py-4">
            <Button variant="ghost" class="flex-1" @click="$emit('clear')">
              <RotateCcw class="h-4 w-4" />Clear
            </Button>
            <Button variant="primary" class="flex-1" @click="close">
              Show Results
            </Button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { X, RotateCcw } from 'lucide-vue-next'
import type { CatalogKind } from '~/composables/useCatalogFilters'

const props = defineProps<{
  open: boolean
  kind: CatalogKind
}>()

const emit = defineEmits<{ close: []; clear: [] }>()

const closeBtn = ref<HTMLElement | null>(null)

const collectionLabel = computed(() => {
  if (props.kind === 'bike') return 'motorcycles'
  if (props.kind === 'accessory') return 'accessories'
  return 'apparel'
})

watch(() => props.open, (v) => {
  if (v) {
    nextTick(() => closeBtn.value?.focus())
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => { document.body.style.overflow = '' })

function close() { emit('close') }
</script>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.25s ease; }
.drawer-enter-active > div:last-child, .drawer-leave-active > div:last-child { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from > div:last-child { transform: translateX(100%); }
.drawer-leave-to > div:last-child { transform: translateX(100%); }
</style>