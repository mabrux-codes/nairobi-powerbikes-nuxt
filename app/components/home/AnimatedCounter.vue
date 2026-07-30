<template>
  <div ref="elRef" class="flex flex-col items-center">
    <motion.div :initial="{ opacity: 0, y: 30 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true }" :transition="{ duration: 0.5 }">
      <div class="relative overflow-hidden">
        <span class="font-heading text-5xl leading-none text-brand-red sm:text-6xl lg:text-7xl">
          <span v-if="displayedValue !== null">{{ formatNumber(displayedValue) }}</span><span v-else>{{ formatNumber(target) }}</span>
          <span v-if="suffix" class="ml-1">{{ suffix }}</span>
        </span>
      </div>
      <span class="mt-2 text-sm text-brand-grey uppercase tracking-display">{{ label }}</span>
    </motion.div>
  </div>
</template>

<script setup lang="ts">
import { motion, animate } from 'motion-v'

const props = withDefaults(defineProps<{ target: number; suffix?: string; label?: string; duration?: number }>(), { suffix: '', label: '', duration: 2 })
const elRef = ref<HTMLElement | null>(null)
const displayedValue = ref<number | null>(null)
let animationControls: { cancel: () => void } | null = null
let observer: IntersectionObserver | null = null

function startCounting() {
  if (displayedValue.value !== null) return
  const controls = animate(0, props.target, { duration: props.duration, ease: [0.34, 1.56, 0.64, 1], onUpdate: (latest: number) => { displayedValue.value = Math.round(latest) }, onComplete: () => { displayedValue.value = props.target } })
  animationControls = controls as unknown as { cancel: () => void }
}

function formatNumber(value: number): string { return value.toLocaleString('en-KE') }

onMounted(() => {
  if (!elRef.value) return
  observer = new IntersectionObserver((entries) => { if (entries[0]?.isIntersecting) { startCounting(); observer?.disconnect() } }, { threshold: 0.3 })
  observer.observe(elRef.value)
})

onBeforeUnmount(() => { observer?.disconnect(); animationControls?.cancel?.() })
</script>
