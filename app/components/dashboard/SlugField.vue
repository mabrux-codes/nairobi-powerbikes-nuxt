<template>
  <div>
    <div class="mb-1.5 flex items-center justify-between gap-3">
      <label class="text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">
        {{ label }}
        <span v-if="autoMode" class="ml-1.5 inline-flex items-center gap-1 rounded-full border border-brand-grey/20 px-1.5 py-0.5 text-[9px] font-normal tracking-normal text-brand-grey/70 normal-case">
          <Lock class="h-2.5 w-2.5" />Auto-generated
        </span>
      </label>
      <button
        v-if="!autoMode && !wasPublished"
        type="button"
        class="text-[11px] text-brand-grey transition-colors hover:text-brand-red"
        @click="switchAuto"
      >
        Use auto-generated
      </button>
    </div>

    <div v-if="autoMode" class="flex items-center gap-2">
      <div class="flex h-10 flex-1 items-center gap-2 rounded-xl border border-brand-grey/15 bg-white/[0.02] px-3 text-sm text-brand-grey/80">
        <Lock class="h-3.5 w-3.5 shrink-0 text-brand-grey/50" />
        <span class="truncate">{{ path }}{{ autoSlug }}</span>
      </div>
      <button
        type="button"
        class="h-10 shrink-0 rounded-xl border border-brand-grey/15 px-3 text-xs font-semibold text-brand-grey transition-colors hover:border-brand-red/50 hover:text-brand-red"
        :title="wasPublished ? 'Keep this URL — it is already live' : 'Change the auto-generated URL'"
        :disabled="wasPublished"
        @click="switchCustom"
      >
        {{ wasPublished ? 'Locked' : 'Custom' }}
      </button>
      <button
        v-if="!wasPublished"
        type="button"
        class="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-brand-grey/15 px-3 text-xs font-semibold text-brand-grey transition-colors hover:border-brand-red/50 hover:text-brand-red"
        title="Regenerate from title"
        @click="regenerate"
      >
        <RefreshCw class="h-3.5 w-3.5" />Regenerate
      </button>
      <button type="button" class="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-brand-grey/15 px-3 text-xs font-semibold text-brand-grey transition-colors hover:border-brand-red/50 hover:text-brand-red" title="Copy public URL" @click="copyUrl">
        <Copy class="h-3.5 w-3.5" />
        <span class="hidden sm:inline">{{ copied ? 'Copied' : 'Copy URL' }}</span>
      </button>
    </div>

    <div v-else>
      <div class="flex items-stretch gap-2">
        <div class="relative flex-1">
          <span class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xs text-brand-grey/50">{{ path }}</span>
          <input
            v-model="manual"
            type="text"
            class="input-field h-10 rounded-xl pl-[3.5rem] pr-10 text-sm"
            :placeholder="`${autoSlug}`"
            :aria-label="`Custom URL slug for ${label}`"
            @input="emitValue"
          />
      <button v-if="manual && manual !== autoSlug && !wasPublished" type="button" class="absolute inset-y-0 right-2 flex items-center text-brand-grey hover:text-brand-red" title="Reset to auto-generated" @click="resetToAuto">
        <RotateCcw class="h-4 w-4" />
      </button>
        </div>
        <button type="button" class="flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-brand-grey/15 px-3 text-xs font-semibold text-brand-grey transition-colors hover:border-brand-red/50 hover:text-brand-red" title="Copy public URL" @click="copyUrl">
          <Copy class="h-3.5 w-3.5" />
          <span class="hidden sm:inline">{{ copied ? 'Copied' : 'Copy URL' }}</span>
        </button>
      </div>
      <p v-if="!slugSafe(manual)" class="mt-1.5 text-[11px] text-amber-400">Use lowercase letters, numbers and hyphens only (e.g. <span class="font-mono">{{ autoSlug }}</span>).</p>
    </div>

    <p v-if="wasPublished" class="mt-1.5 flex items-center gap-1 text-[11px] text-amber-400/90">
      <AlertTriangle class="h-3 w-3 shrink-0" />This URL is already live. Changing it will break existing links and shares — only do this if you intend to re-route the page.
    </p>
    <p v-else-if="autoMode" class="mt-1.5 text-[11px] text-brand-grey/60">Generated from the title when the record is saved. Never changes after publishing.</p>
  </div>
</template>

<script setup lang="ts">
import { Lock, RefreshCw, Copy, RotateCcw, AlertTriangle } from 'lucide-vue-next'
import { slugify, isValidSlug } from '~/utils/slug'

const props = withDefaults(defineProps<{
  modelValue: string
  title: string
  path: string
  label?: string
  wasPublished?: boolean
}>(), {
  label: 'Slug',
  wasPublished: false,
})

const emit = defineEmits<{ 'update:modelValue': [string] }>()

const copied = ref(false)
const autoMode = ref(true)
const manual = ref('')

const autoSlug = computed(() => slugify(props.title))
const path = computed(() => (props.path || '/').replace(/\/?$/, '/'))

watch(() => props.modelValue, (v) => {
  if (v) {
    manual.value = v
    autoMode.value = false
  } else if (props.wasPublished) {
    manual.value = autoSlug.value
    autoMode.value = false
  }
}, { immediate: true })

watch(autoSlug, () => {
  if (autoMode.value) emitValue()
})

watch(() => props.wasPublished, (pub) => {
  if (pub) {
    autoMode.value = false
    if (!manual.value) manual.value = autoSlug.value
  }
})

function slugSafe(v: string) { return !v || isValidSlug(v) }

function current(): string {
  return autoMode.value ? autoSlug.value : (manual.value.trim() || autoSlug.value)
}

function emitValue() { emit('update:modelValue', current()) }

function switchCustom() {
  if (props.wasPublished) return
  manual.value = autoSlug.value
  autoMode.value = false
  emitValue()
}

function switchAuto() {
  autoMode.value = true
  emitValue()
}

function regenerate() {
  manual.value = autoSlug.value
  emitValue()
}

function resetToAuto() {
  manual.value = ''
  autoMode.value = true
  emitValue()
}

async function copyUrl() {
  try {
    const origin = window.location.origin
    await navigator.clipboard.writeText(`${origin}${path.value}${current()}`)
    copied.value = true
    setTimeout(() => { copied.value = false }, 1500)
  } catch { /* clipboard unavailable */ }
}

defineExpose({ currentSlug: current })
</script>
