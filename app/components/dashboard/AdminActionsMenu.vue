<template>
  <div class="relative" ref="rootRef">
    <button
      class="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-brand-grey hover:text-white hover:bg-white/5 hover:border-brand-grey/20 transition-all duration-200"
      :aria-label="ariaLabel || 'Row actions'"
      @click.stop="open = !open"
    >
      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
      </svg>
    </button>

    <transition
      enter-active-class="transition-all duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-1 scale-95"
    >
      <div
        v-if="open"
        class="absolute right-0 top-full mt-1.5 w-52 max-w-[calc(100vw-2rem)] z-30 rounded-xl border border-brand-grey/20 bg-[#151519] shadow-2xl shadow-black/60 py-1.5 overflow-y-auto max-h-[70vh]"
        role="menu"
        @click.stop
      >
        <button
          v-for="item in items"
          :key="item.label"
          class="w-full flex items-center gap-2.5 px-3.5 py-2 text-left text-sm transition-colors"
          :class="item.danger ? 'text-rose-400 hover:bg-brand-red/10' : 'text-brand-grey hover:text-white hover:bg-white/5'"
          role="menuitem"
          @click="run(item)"
        >
          <component :is="item.icon" v-if="item.icon" class="h-4 w-4 shrink-0" />
          <span>{{ item.label }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{ items: { label: string; icon?: any; danger?: boolean; onClick?: () => void }[]; ariaLabel?: string }>()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

onClickOutside(rootRef, () => { open.value = false })

function run(item: { onClick?: () => void }) {
  open.value = false
  item.onClick?.()
}
</script>
