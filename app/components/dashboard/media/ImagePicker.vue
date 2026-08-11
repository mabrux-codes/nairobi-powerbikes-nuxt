<template>
  <div>
    <div class="mb-1.5 flex items-center justify-between">
      <label class="mb-0 block text-xs font-display tracking-display text-brand-grey uppercase">{{ label }} <span class="text-brand-grey/50">({{ items.length }}/{{ max }})</span></label>
      <button v-if="items.length" type="button" class="text-xs text-brand-grey hover:text-rose-400 transition-colors" @click="items = []">Remove all</button>
    </div>

    <div v-if="items.length" class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <div
        v-for="(img, i) in items"
        :key="img.key"
        class="group relative overflow-hidden rounded-lg border transition-colors"
        :class="i === main ? 'border-brand-red/70' : 'border-brand-grey/20'"
      >
        <div class="relative aspect-video bg-white/[0.03]">
          <img :src="img.url" :alt="`Image ${i + 1}`" class="h-full w-full object-cover" />
          <span v-if="i === main" class="absolute left-1.5 top-1.5 rounded-full bg-brand-red px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase">Main</span>
          <span v-else class="absolute left-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[9px] text-brand-grey">{{ i + 1 }}</span>
          <div class="absolute inset-x-0 top-1/2 hidden -translate-y-1/2 items-center justify-center gap-1.5 group-hover:flex">
            <button type="button" class="rounded-md bg-black/70 p-1.5 text-white hover:bg-brand-red transition-colors" :disabled="i === 0" :aria-label="`Move image ${i + 1} left`" @click="move(i, -1)"><ChevronLeft class="h-4 w-4" /></button>
            <button v-if="i !== main" type="button" class="rounded-md bg-black/70 p-1.5 text-white hover:bg-brand-red transition-colors" :aria-label="`Set image ${i + 1} as main`" title="Set as main image" @click="main = i"><Star class="h-4 w-4" /></button>
            <button type="button" class="rounded-md bg-black/70 p-1.5 text-white hover:bg-rose-500 transition-colors" :aria-label="`Remove image ${i + 1}`" @click="remove(i)"><X class="h-4 w-4" /></button>
            <button type="button" class="rounded-md bg-black/70 p-1.5 text-white hover:bg-brand-red transition-colors" :disabled="i === items.length - 1" :aria-label="`Move image ${i + 1} right`" @click="move(i, 1)"><ChevronRight class="h-4 w-4" /></button>
          </div>
        </div>
        <select
          class="w-full border-t border-brand-grey/15 bg-brand-black px-1.5 py-1.5 text-[11px] text-brand-grey focus:outline-none focus:border-brand-red/60"
          :value="img.category || ''"
          :aria-label="`Category for image ${i + 1}`"
          @change="setCategory(i, ($event.target as HTMLSelectElement).value)"
        >
          <option value="">No category</option>
          <option v-for="c in allCategories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>
    </div>

    <div class="mt-3">
      <label
        class="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-brand-red/40 bg-brand-red/10 px-4 text-sm font-semibold text-brand-red transition-colors hover:bg-brand-red hover:text-white"
        :class="{ 'opacity-40 pointer-events-none': items.length >= max }"
      >
        <Plus class="h-4 w-4" />Upload {{ label.toLowerCase() }}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          class="sr-only"
          :disabled="items.length >= max"
          @change="onFiles"
        />
      </label>
      <p v-if="error" class="mt-1.5 text-xs text-rose-400">{{ error }}</p>
      <p class="mt-1.5 text-[11px] text-brand-grey/60">Up to {{ max }} images. First image (or the starred one) is the main image. JPG/PNG/WebP.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, X, Star, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import type { ImageItem } from '~/utils/imageTypes'

const props = withDefaults(defineProps<{
  items: ImageItem[]
  main: number
  label?: string
  categories?: string[]
  max?: number
}>(), {
  label: 'Images',
  categories: () => [],
  max: 15,
})

const emit = defineEmits<{
  'update:items': [ImageItem[]]
  'update:main': [number]
}>()

const error = ref('')
const allCategories = computed(() => [...props.categories, 'Other'])

function setCategory(i: number, val: string) {
  const next = props.items.map((it, idx) => idx === i ? { ...it, category: val } : it)
  emit('update:items', next)
}

function move(i: number, dir: -1 | 1) {
  const j = i + dir
  if (j < 0 || j >= props.items.length) return
  const next = [...props.items]
  const tmp = next[i]!
  next[i] = next[j]!
  next[j] = tmp
  emit('update:items', next)
  let main = props.main
  if (main === i) main = j
  else if (main === j) main = i
  emit('update:main', main)
}

function remove(i: number) {
  const next = props.items.filter((_, idx) => idx !== i)
  emit('update:items', next)
  let main = props.main
  if (main === i) main = 0
  else if (main > i) main -= 1
  emit('update:main', main)
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

async function onFiles(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  input.value = ''
  if (!files.length) return
  error.value = ''
  const room = props.max - props.items.length
  if (room <= 0) return
  const batch = files.slice(0, room)
  if (files.length > room) error.value = `Only ${room} image(s) can be added (max ${props.max}).`
  const added: ImageItem[] = []
  for (const f of batch) {
    if (f.size > 5 * 1024 * 1024) {
      error.value = `"${f.name}" is over 5MB and was skipped.`
      continue
    }
    const url = await fileToDataUrl(f).catch(() => '')
    if (!url) continue
    added.push({ key: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, url, file: f })
  }
  if (added.length) emit('update:items', [...props.items, ...added])
}
</script>
