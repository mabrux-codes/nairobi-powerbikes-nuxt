<template>
  <div class="flex flex-col rounded-sm border border-brand-grey/10 bg-brand-black/60 p-6 transition-all duration-300 hover:border-brand-red/40">
    <div class="flex items-center gap-1 text-amber-400">
      <svg v-for="s in 5" :key="s" class="h-4 w-4" :class="s <= (testimonial.rating || 5) ? 'text-amber-400' : 'text-brand-grey/30'" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    </div>
    <p class="mt-3 flex-1 text-sm leading-relaxed text-white/90 italic line-clamp-6">&ldquo;{{ testimonial.content }}&rdquo;</p>
    <div class="mt-4 flex items-center gap-3 border-t border-brand-grey/10 pt-4">
      <div v-if="testimonial.photo" class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-brand-grey/10">
        <img :src="pb.files.getURL(testimonial, testimonial.photo)" :alt="testimonial.name" class="h-full w-full object-cover" />
      </div>
      <div v-else class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-red/20 text-sm font-bold text-brand-red">
        {{ (testimonial.name || '?')[0] }}
      </div>
      <div class="min-w-0">
        <p class="truncate text-sm font-medium text-white">{{ testimonial.name }}</p>
        <p v-if="testimonial.role" class="truncate text-xs text-brand-grey">{{ testimonial.role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Testimonial {
  id: string
  name: string
  role?: string
  content: string
  rating?: number
  photo?: string
  display_order?: number
}

defineProps<{
  testimonial: Testimonial
  pb: ReturnType<typeof import('~/composables/usePocketBase')['usePB']>
}>()
</script>
