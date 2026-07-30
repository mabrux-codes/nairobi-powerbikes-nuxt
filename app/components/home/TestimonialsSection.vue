<template>
  <section class="bg-brand-black py-20">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <motion.div class="mb-12 text-center" :initial="{ opacity: 0, y: 40 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true }" :transition="{ duration: 0.6 }">
        <h2 class="font-heading text-4xl text-white sm:text-5xl lg:text-display-xl">What Our <span class="text-brand-red">Riders</span> Say</h2>
        <div class="mx-auto mt-2 h-1 w-24 bg-brand-red" />
        <p class="mx-auto mt-4 max-w-xl text-brand-grey">Real feedback from our customers</p>
      </motion.div>

      <div v-if="loading" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 3" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-6">
          <div class="flex items-center gap-3"><div class="h-10 w-10 rounded-full bg-brand-grey/10" /><div class="space-y-2"><div class="h-4 w-24 rounded bg-brand-grey/10" /><div class="h-3 w-16 rounded bg-brand-grey/10" /></div></div>
          <div class="mt-4 space-y-2"><div class="h-3 w-full rounded bg-brand-grey/10" /><div class="h-3 w-3/4 rounded bg-brand-grey/10" /></div>
        </div>
      </div>

      <div v-else-if="testimonials.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
        <p class="font-display text-xl tracking-display text-brand-grey">No testimonials yet</p>
      </div>

      <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div v-for="(t, i) in testimonials" :key="t.id"
          class="group rounded-sm border border-brand-grey/10 bg-brand-black/60 p-6 transition-all duration-300 hover:border-brand-red/40"
          :initial="{ opacity: 0, y: 30 }" :while-in-view="{ opacity: 1, y: 0 }" :viewport="{ once: true }" :transition="{ delay: i * 0.1, duration: 0.4 }">
          <div class="flex items-center gap-1 text-amber-400">
            <svg v-for="s in 5" :key="s" class="h-4 w-4" :class="s <= (t.rating || 5) ? 'text-amber-400' : 'text-brand-grey/30'" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-brand-grey/80 italic">&ldquo;{{ t.content }}&rdquo;</p>
          <div class="mt-4 flex items-center gap-3 border-t border-brand-grey/10 pt-4">
            <div v-if="t.avatar" class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-brand-grey/10">
              <img :src="pb.files.getURL(t, t.avatar)" :alt="t.name" class="h-full w-full object-cover" />
            </div>
            <div v-else class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-red/20 text-sm font-bold text-brand-red">
              {{ (t.name || '?')[0] }}
            </div>
            <div>
              <p class="text-sm font-medium text-white">{{ t.name }}</p>
              <p v-if="t.role" class="text-xs text-brand-grey">{{ t.role }}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { usePB } from '~/composables/usePocketBase'

interface Testimonial { id: string; name: string; role?: string; content: string; rating?: number; avatar?: string; sort_order?: number }

const pb = usePB()
const loading = ref(true)
const testimonials = ref<Testimonial[]>([])

async function loadTestimonials() {
  try {
    const records = await pb.collection('testimonials').getFullList<Testimonial>({ sort: 'sort_order,created' })
    testimonials.value = records
  } catch { testimonials.value = [] }
  finally { loading.value = false }
}

onMounted(async () => {
  await loadTestimonials()
  pb.collection('testimonials').subscribe('*', () => loadTestimonials())
})

onUnmounted(() => {
  pb.collection('testimonials').unsubscribe('*')
})
</script>
