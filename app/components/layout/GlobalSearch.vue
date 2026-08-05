<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[8vh] sm:px-0">
      <button class="absolute inset-0 bg-black/75 backdrop-blur-sm" aria-label="Close search" @click="close" />
      <motion.div
        class="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-brand-black/95 shadow-2xl shadow-black/70 backdrop-blur-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Global search"
        :initial="{ opacity: 0, y: -16, scale: 0.98 }"
        :animate="{ opacity: 1, y: 0, scale: 1 }"
        :exit="{ opacity: 0, y: -8, scale: 0.98 }"
        :transition="{ type: 'spring', stiffness: 380, damping: 30 }"
      >
        <form class="flex items-center gap-3 border-b border-white/10 px-5" role="search" @submit.prevent="submitTop">
          <Search class="h-5 w-5 shrink-0 text-brand-red" />
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            class="h-14 flex-1 bg-transparent text-base text-white placeholder:text-brand-grey/70 focus:outline-none"
            placeholder="Search motorcycles, accessories, apparel…"
            aria-label="Search the catalogue"
            @keydown.down.prevent="move(1)"
            @keydown.up.prevent="move(-1)"
            @keydown.enter.prevent="openSelected"
          />
          <kbd v-if="!query" class="hidden rounded-md border border-white/15 px-1.5 py-0.5 text-[10px] font-semibold text-brand-grey sm:block">ESC</kbd>
          <button type="button" class="flex h-8 w-8 items-center justify-center rounded-full text-brand-grey hover:bg-white/5 hover:text-white transition-colors" aria-label="Close search" @click="close">
            <X class="h-4 w-4" />
          </button>
        </form>

        <div class="max-h-[58vh] overflow-y-auto p-5">
          <!-- empty query: recent + popular -->
          <div v-if="!query.trim()">
            <template v-if="recent.length">
              <p class="mb-2 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">Recent searches</p>
              <div class="mb-5 flex flex-wrap gap-2">
                <button
                  v-for="r in recent"
                  :key="r"
                  class="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-brand-light/80 transition-colors hover:border-brand-red/50 hover:text-brand-red"
                  @click="runSearch(r)"
                >
                  <Clock class="h-3 w-3" />{{ r }}
                </button>
              </div>
            </template>
            <p class="mb-2 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">Popular searches</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="p in POPULAR"
                :key="p"
                class="rounded-full border border-brand-red/25 bg-brand-red/[0.06] px-3 py-1.5 text-xs font-medium text-brand-red transition-colors hover:bg-brand-red hover:text-white"
                @click="runSearch(p)"
              >
                {{ p }}
              </button>
            </div>
          </div>

          <!-- results -->
          <div v-else>
            <div v-if="loading" class="space-y-3 py-2">
              <div v-for="i in 3" :key="i" class="h-16 animate-pulse rounded-xl bg-white/[0.04]" />
            </div>
            <div v-else-if="total === 0" class="flex flex-col items-center gap-2 py-10 text-center">
              <SearchX class="h-10 w-10 text-brand-grey/50" />
              <p class="text-sm text-brand-grey">No results for <span class="text-white">"{{ query }}"</span></p>
              <p class="text-xs text-brand-grey/60">Try a different make, category or product name.</p>
            </div>
            <div v-else class="space-y-6">
              <section v-for="group in groups" :key="group.key" v-show="group.items.length">
                <p class="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">
                  <component :is="group.icon" class="h-3.5 w-3.5 text-brand-red" />
                  {{ group.label }}
                  <span class="ml-auto text-[10px] font-normal tracking-normal text-brand-grey/50">{{ group.items.length }} result{{ group.items.length === 1 ? '' : 's' }}</span>
                </p>
                <button
                  v-for="(item, gi) in group.items"
                  :key="item.id"
                  :data-search-id="itemKey(group.key, item.id)"
                  class="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06]"
                  :class="{ 'bg-white/[0.06]': flatIndex(itemKey(group.key, item.id)) === selected }"
                  @mouseenter="selected = flatIndex(itemKey(group.key, item.id))"
                  @click="goTo(item, group.key)"
                >
                  <span class="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.04]">
                    <img v-if="imageFor(item)" :src="imageFor(item)" :alt="item.name" class="h-full w-full object-cover" loading="lazy" />
                    <component :is="group.icon" v-else class="h-5 w-5 text-brand-grey/60" />
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-medium" v-html="highlight(item.name)" />
                    <span class="block truncate text-xs text-brand-grey">{{ metaFor(item, group.key) }}</span>
                  </span>
                  <span class="shrink-0 text-sm font-semibold text-white/85">{{ priceFor(item) }}</span>
                  <ChevronRight class="h-4 w-4 shrink-0 text-brand-grey/40 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-red" />
                </button>
              </section>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Search, X, Clock, ChevronRight, SearchX, Bike, Package, Shirt, Sparkles } from 'lucide-vue-next'
import { useDebounceFn } from '@vueuse/core'
import { useCatalogStore, type CatalogRecord } from '~/stores/catalog'
import { usePB } from '~/composables/usePocketBase'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const store = useCatalogStore()
const pb = usePB()

const query = ref('')
const results = ref<Record<'bike' | 'accessory' | 'apparel', CatalogRecord[]>>({ bike: [], accessory: [], apparel: [] })
const loading = ref(false)
const selected = ref(0)
const inputRef = ref<HTMLInputElement | null>(null)

const RECENT_KEY = 'npb_recent_searches'
const POPULAR = ['Sport', 'Helmets', 'Gloves', 'Adventure', 'Jackets', 'Pants', 'Touring']

const recent = ref<string[]>(loadRecent())

function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]').slice(0, 6)
  } catch {
    return []
  }
}
function pushRecent(term: string) {
  const clean = term.trim()
  if (!clean) return
  const next = [clean, ...loadRecent().filter(r => r.toLowerCase() !== clean.toLowerCase())].slice(0, 6)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  recent.value = next
}

const groups = computed(() => [
  { key: 'bike', label: 'Motorcycles', icon: Bike, items: results.value.bike },
  { key: 'accessory', label: 'Accessories', icon: Package, items: results.value.accessory },
  { key: 'apparel', label: 'Apparel', icon: Shirt, items: results.value.apparel },
])
const total = computed(() => groups.value.reduce((n, g) => n + g.items.length, 0))

const itemKey = (kind: string, id: string) => `${kind}:${id}`
function buildIndex(): Array<{ kind: string; id: string }> {
  const flat: Array<{ kind: string; id: string }> = []
  for (const g of groups.value) for (const it of g.items) flat.push({ kind: g.key, id: it.id })
  return flat
}
function flatIndex(key: string) {
  return buildIndex().findIndex(x => itemKey(x.kind, x.id) === key)
}

function runSearch(term: string) {
  query.value = term
  doSearch()
}

const doSearch = useDebounceFn(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) {
    results.value = { bike: [], accessory: [], apparel: [] }
    loading.value = false
    selected.value = 0
    return
  }
  loading.value = true
  const match = (item: any, fields: (string | null)[]): boolean =>
    fields.some(f => f && String(f).toLowerCase().includes(q))

  results.value = {
    bike: (store.motorcycles as CatalogRecord[]).filter(b => match(b, [b.name, b.type, b.expand?.brand?.name, b.slug])).slice(0, 5),
    accessory: (store.accessories as CatalogRecord[]).filter(a => match(a, [a.name, a.category])).slice(0, 5),
    apparel: (store.apparel as CatalogRecord[]).filter(ap => match(ap, [ap.name, ap.type, ap.color])).slice(0, 5),
  }
  loading.value = false
  selected.value = 0
}, 220)

watch(query, () => { selected.value = 0; doSearch() })
watch(() => props.open, (v) => {
  if (v) {
    query.value = ''
    results.value = { bike: [], accessory: [], apparel: [] }
    store.ensureActive()
    nextTick(() => inputRef.value?.focus())
    document.body.style.overflow = 'hidden'
  } else {
    store.release()
    document.body.style.overflow = ''
  }
}, { immediate: true })
onUnmounted(() => {
  store.release()
  document.body.style.overflow = ''
})

function close() {
  emit('close')
}

function urlFor(item: CatalogRecord, kind: string): string {
  if (kind === 'bike') return `/motorcycles/${(item.slug as string) || encodeURIComponent(item.name as string)}`
  return `/${kind}/${item.id}`
}

function goTo(item: CatalogRecord, kind: string) {
  pushRecent(query.value)
  close()
  navigateTo(urlFor(item, kind))
}

function move(dir: number) {
  const flat = buildIndex()
  if (!flat.length) return
  selected.value = (selected.value + dir + flat.length) % flat.length
  const target = flat[selected.value]
  const el = document.querySelector(`[data-search-id="${itemKey(target.kind, target.id)}"]`)
  el?.scrollIntoView({ block: 'nearest' })
}

function openSelected() {
  const flat = buildIndex()
  if (!flat.length) return
  const target = flat[Math.min(selected.value, flat.length - 1)]
  const all = results.value
  const item = all[target.kind as 'bike' | 'accessory' | 'apparel'].find(x => x.id === target.id)
  if (item) goTo(item, target.kind)
}

function submitTop() {
  const flat = buildIndex()
  if (flat.length) openSelected()
  else if (query.value.trim()) pushRecent(query.value)
}

function imageFor(item: CatalogRecord): string {
  const img = Array.isArray(item.images) ? item.images[0] : item.image
  if (!img) return ''
  try { return pb.files.getURL(item as any, img, { thumb: '120x120' }) } catch { return '' }
}
function metaFor(item: CatalogRecord, kind: string): string {
  if (kind === 'bike') return [item.expand?.brand?.name, item.type, item.engine_cc ? `${item.engine_cc}cc` : ''].filter(Boolean).join(' · ')
  if (kind === 'accessory') return item.category || 'Accessory'
  return [item.type, item.size && `Size ${item.size}`, item.color].filter(Boolean).join(' · ')
}
function priceFor(item: CatalogRecord): string {
  const v = Number(item.sale_price || item.price || 0)
  return v > 0 ? `KSh ${v.toLocaleString('en-KE')}` : ''
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}
function highlight(text: any): string {
  const str = String(text ?? '')
  const q = query.value.trim()
  if (!q) return escapeHtml(str)
  const lower = str.toLowerCase()
  const idx = lower.indexOf(q.toLowerCase())
  if (idx === -1) return escapeHtml(str)
  return `${escapeHtml(str.slice(0, idx))}<mark class="rounded-sm bg-brand-red/30 px-0.5 text-white">${escapeHtml(str.slice(idx, idx + q.length))}</mark>${escapeHtml(str.slice(idx + q.length))}`
}
</script>