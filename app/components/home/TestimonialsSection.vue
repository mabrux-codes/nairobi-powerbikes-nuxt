<template>
  <section class="bg-brand-black py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div
        class="mb-12 text-center"
        :initial="{ opacity: 0, y: 40 }"
        :while-in-view="{ opacity: 1, y: 0 }"
        :viewport="{ once: true }"
        :transition="{ duration: 0.6 }"
      >
        <h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">
          What Our <span class="text-brand-red">Riders</span> Say
        </h2>
        <div class="mx-auto mt-2 h-1 w-24 bg-brand-red" />
        <p class="mx-auto mt-4 max-w-xl text-brand-grey">Real feedback from our customers</p>
      </motion.div>

      <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-6">
          <div class="flex items-center gap-1">
            <div v-for="s in 5" :key="s" class="h-4 w-4 rounded bg-brand-grey/10" />
          </div>
          <div class="mt-3 space-y-2">
            <div class="h-3 w-full rounded bg-brand-grey/10" />
            <div class="h-3 w-5/6 rounded bg-brand-grey/10" />
            <div class="h-3 w-4/6 rounded bg-brand-grey/10" />
          </div>
          <div class="mt-4 flex items-center gap-3 border-t border-brand-grey/10 pt-4">
            <div class="h-10 w-10 rounded-full bg-brand-grey/10" />
            <div class="space-y-1.5">
              <div class="h-4 w-24 rounded bg-brand-grey/10" />
              <div class="h-3 w-16 rounded bg-brand-grey/10" />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="testimonials.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
        <p class="font-display text-xl tracking-display text-brand-grey">No testimonials yet</p>
      </div>

      <div v-else-if="testimonials.length <= 6" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <TestimonialCard v-for="t in testimonials" :key="t.id" :testimonial="t" :pb="pb" />
      </div>

      <div v-else ref="wrapper" class="testimonial-marquee" @mouseenter="paused = true" @mouseleave="paused = false">
        <div class="testimonial-row" :style="{ transform: 'translateX(' + (-scrollOffset) + 'px)' }">
          <div v-for="(card, i) in topRow" :key="card.id + '-t' + i" class="testimonial-cell" :style="{ width: cardWidth + 'px' }">
            <TestimonialCard :testimonial="card" :pb="pb" />
          </div>
        </div>
        <div class="testimonial-row" :style="{ transform: 'translateX(' + (-scrollOffset) + 'px)' }">
          <div v-for="(card, i) in bottomRow" :key="card.id + '-b' + i" class="testimonial-cell" :style="{ width: cardWidth + 'px' }">
            <TestimonialCard :testimonial="card" :pb="pb" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { usePB } from '~/composables/usePocketBase'

interface Testimonial {
  id: string
  name: string
  role?: string
  content: string
  rating?: number
  photo?: string
  display_order?: number
}

const pb = usePB()
const loading = ref(true)
const testimonials = ref<Testimonial[]>([])
const paused = ref(false)
const wrapper = ref<HTMLElement | null>(null)
const scrollOffset = ref(0)
const cardWidth = ref(0)

const gapPx = 24

function rowCards(cards: Testimonial[], rowIdx: number): Testimonial[] {
  const result: Testimonial[] = []
  for (let i = 0; i < cards.length; i++) {
    const pos = i % 6
    if (rowIdx === 0 && pos < 3) result.push(cards[i])
    else if (rowIdx === 1 && pos >= 3) result.push(cards[i])
  }
  return result
}

function gcd(a: number, b: number): number {
  while (b) { [a, b] = [b, a % b] }
  return a
}

const topOriginal = computed(() => rowCards(testimonials.value, 0))
const bottomOriginal = computed(() => rowCards(testimonials.value, 1))

const scrollUnit = computed(() => {
  const a = topOriginal.value.length
  const b = bottomOriginal.value.length
  if (a === 0 || b === 0) return 0
  return (a * b) / gcd(a, b)
})

const repeatCount = computed(() => {
  const s = scrollUnit.value
  const t = topOriginal.value.length
  const b = bottomOriginal.value.length
  const min = Math.min(t, b)
  if (min === 0) return 1
  return Math.ceil((s + 3) / min)
})

const topRow = computed(() => {
  const base = topOriginal.value
  const res: Testimonial[] = []
  for (let r = 0; r < repeatCount.value; r++) res.push(...base)
  return res
})

const bottomRow = computed(() => {
  const base = bottomOriginal.value
  const res: Testimonial[] = []
  for (let r = 0; r < repeatCount.value; r++) res.push(...base)
  return res
})

let rafId: number | null = null

function startScroll() {
  const s = scrollUnit.value
  if (s === 0) return
  const end = s * (cardWidth.value + gapPx)

  function step() {
    if (!paused.value) {
      scrollOffset.value += 1
      if (scrollOffset.value >= end) {
        scrollOffset.value = 0
      }
    }
    rafId = requestAnimationFrame(step)
  }

  rafId = requestAnimationFrame(step)
}

function stopScroll() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
}

function updateCardWidth() {
  if (!wrapper.value) return
  cardWidth.value = (wrapper.value.offsetWidth - 2 * gapPx) / 3
}

let resizeObserver: ResizeObserver | null = null

async function loadTestimonials() {
  try {
    const records = await pb.collection('testimonials').getFullList<Testimonial>({ sort: 'display_order,created' })
    testimonials.value = records
  } catch {
    testimonials.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadTestimonials()
  nextTick(() => {
    updateCardWidth()
    if (testimonials.value.length > 6) startScroll()
  })
  resizeObserver = new ResizeObserver(updateCardWidth)
  if (wrapper.value) resizeObserver.observe(wrapper.value)
  pb.collection('testimonials').subscribe('*', () => loadTestimonials())
})

onUnmounted(() => {
  stopScroll()
  resizeObserver?.disconnect()
  pb.collection('testimonials').unsubscribe('*')
})
</script>

<style scoped>
.testimonial-marquee {
  overflow: hidden;
}

.testimonial-row {
  display: flex;
  gap: 1.5rem;
  will-change: transform;
}

.testimonial-row + .testimonial-row {
  margin-top: 1.5rem;
}

.testimonial-cell {
  flex-shrink: 0;
}
</style>
