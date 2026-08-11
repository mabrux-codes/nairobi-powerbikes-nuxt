<template>
  <div>
    <!-- Main image -->
    <div class="relative overflow-hidden rounded-2xl border border-brand-grey/15 bg-brand-black">
      <div class="relative aspect-[4/3] w-full sm:aspect-[3/2]">
        <img
          :src="activeUrl"
          :alt="alt"
          class="h-full w-full object-cover transition-opacity duration-300"
          :class="greyed ? 'opacity-85 grayscale-[0.5] saturate-[0.6]' : ''"
          @click="lightboxOpen = true"
        />
        <div class="absolute left-3 top-3 flex items-center gap-2">
          <span v-if="activeItem?.category" class="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-display tracking-wider text-white uppercase backdrop-blur-sm">{{ activeItem.category }}</span>
        </div>
        <span class="absolute bottom-3 right-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {{ activeIndex + 1 }} / {{ displayed.length }}
        </span>
        <button
          v-if="displayed.length > 1"
          type="button"
          class="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-all hover:bg-brand-red group-hover:opacity-100 sm:opacity-0"
          :class="{ 'opacity-100': hovered || lightboxOpen }"
          :aria-label="`Previous image`"
          @click="prev"
        ><ChevronLeft class="h-5 w-5" /></button>
        <button
          v-if="displayed.length > 1"
          type="button"
          class="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-all hover:bg-brand-red sm:opacity-0"
          :class="{ 'opacity-100': hovered || lightboxOpen }"
          :aria-label="`Next image`"
          @click="next"
        ><ChevronRight class="h-5 w-5" /></button>
      </div>
    </div>

    <!-- Category filter chips -->
    <div v-if="categories.length > 1" class="mt-3 flex flex-wrap gap-1.5">
      <button
        v-for="cat in categories"
        :key="cat"
        type="button"
        class="h-8 rounded-full border px-3.5 text-xs font-semibold transition-colors"
        :class="activeCategory === cat ? 'border-brand-red bg-brand-red text-white' : 'border-brand-grey/20 text-brand-grey hover:border-brand-red/50 hover:text-white'"
        @click="setCategory(cat)"
      >{{ cat }}</button>
    </div>

    <!-- Thumbnails -->
    <div v-if="displayed.length > 1" class="mt-3 grid grid-cols-5 gap-2 sm:grid-cols-6 md:grid-cols-8">
      <button
        v-for="(img, i) in displayed"
        :key="img.url + i"
        type="button"
        class="relative aspect-square overflow-hidden rounded-lg border-2 transition-all"
        :class="i === activeIndex ? 'border-brand-red' : 'border-transparent opacity-70 hover:opacity-100'"
        :aria-label="`View image ${i + 1}`"
        @click="activeIndex = i"
      >
        <img :src="img.url" :alt="`${alt} thumbnail ${i + 1}`" class="h-full w-full object-cover" />
        <span v-if="i === 0 && showMainBadge" class="absolute left-1 top-1 rounded bg-brand-red px-1 text-[8px] font-bold uppercase text-white">Main</span>
      </button>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="gallery-fade">
        <div v-if="lightboxOpen" class="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" :aria-label="alt" @click.self="lightboxOpen = false">
          <button class="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-red transition-colors" aria-label="Close lightbox" @click="lightboxOpen = false"><X class="h-5 w-5" /></button>
          <button v-if="displayed.length > 1" class="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-red transition-colors" aria-label="Previous image" @click="prev"><ChevronLeft class="h-6 w-6" /></button>
          <button v-if="displayed.length > 1" class="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-brand-red transition-colors" aria-label="Next image" @click="next"><ChevronRight class="h-6 w-6" /></button>
          <figure class="max-h-full max-w-5xl">
            <img :src="lightboxUrl" :alt="alt" class="mx-auto max-h-[82vh] w-auto max-w-full rounded-lg object-contain" />
            <figcaption class="mt-3 flex items-center justify-center gap-2 text-sm text-brand-grey">
              <span v-if="activeItem?.category" class="rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-display tracking-wider uppercase">{{ activeItem.category }}</span>
              <span>{{ activeIndex + 1 }} / {{ displayed.length }}</span>
            </figcaption>
          </figure>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, X } from 'lucide-vue-next'

export interface GalleryImage {
  url: string
  category?: string
}

const props = withDefaults(defineProps<{
  images: GalleryImage[]
  alt?: string
  greyed?: boolean
  showMainBadge?: boolean
}>(), {
  alt: 'Product image',
  greyed: false,
  showMainBadge: false,
})

const activeIndex = ref(0)
const activeCategory = ref('')
const lightboxOpen = ref(false)
const hovered = ref(false)

const hasCategories = computed(() => props.images.some(i => i.category))
const categories = computed(() => {
  const set = new Set<string>()
  props.images.forEach(i => { if (i.category) set.add(i.category) })
  return Array.from(set)
})

const displayed = computed(() => {
  if (!activeCategory.value) return props.images
  return props.images.filter(i => i.category === activeCategory.value)
})

const safeIndex = computed(() => Math.min(activeIndex.value, Math.max(0, displayed.value.length - 1)))
const activeItem = computed(() => displayed.value[safeIndex.value] || props.images[0])
const activeUrl = computed(() => {
  const base = activeItem.value?.url
  return base
})
const lightboxUrl = computed(() => activeItem.value?.url || '')

watch(activeCategory, () => { activeIndex.value = 0 })
watch(() => props.images.length, () => { activeIndex.value = 0 })

function setCategory(cat: string) {
  activeCategory.value = activeCategory.value === cat ? '' : cat
}
function prev() {
  if (displayed.value.length < 2) return
  activeIndex.value = (safeIndex.value - 1 + displayed.value.length) % displayed.value.length
}
function next() {
  if (displayed.value.length < 2) return
  activeIndex.value = (safeIndex.value + 1) % displayed.value.length
}

function onKey(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') lightboxOpen.value = false
  if (e.key === 'ArrowLeft') prev()
  if (e.key === 'ArrowRight') next()
}

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.gallery-fade-enter-active, .gallery-fade-leave-active { transition: opacity 0.2s ease; }
.gallery-fade-enter-from, .gallery-fade-leave-to { opacity: 0; }
</style>
