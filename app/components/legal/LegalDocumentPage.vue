<template>
  <div class="min-h-screen bg-brand-black">
    <!-- Reading progress bar -->
    <div class="fixed inset-x-0 top-0 z-[80] h-[3px] bg-transparent" aria-hidden="true">
      <div
        class="h-full bg-gradient-to-r from-brand-red to-red-500 shadow-[0_0_12px_rgba(214,0,28,0.5)] transition-[width] duration-150 ease-out"
        :style="{ width: `${progress}%` }"
      />
    </div>

    <div class="pt-[calc(var(--nav-h)+2rem)]">
      <!-- ===================== HERO ===================== -->
      <section class="relative overflow-hidden border-b border-white/[0.06]">
        <div class="asphalt-grid absolute inset-0 opacity-70" aria-hidden="true" />
        <div class="absolute inset-0 bg-gradient-to-b from-brand-red/[0.05] via-transparent to-transparent" aria-hidden="true" />
        <div class="relative mx-auto max-w-[90rem] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <motion.div :initial="{ opacity: 0, y: 24 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5, ease: 'easeOut' }">
            <nav aria-label="Breadcrumb" class="flex items-center gap-2 text-xs">
              <NuxtLink to="/" class="flex items-center gap-1.5 font-semibold text-brand-grey transition-colors hover:text-white">
                <Home class="h-3.5 w-3.5" />Home
              </NuxtLink>
              <span class="text-brand-grey/40" aria-hidden="true">/</span>
              <span class="font-semibold text-brand-red" aria-current="page">{{ title }}</span>
            </nav>

            <h1 class="mt-5 font-heading text-4xl tracking-display text-white sm:text-5xl lg:text-6xl">{{ title }}</h1>

            <p class="mt-3 max-w-2xl text-sm leading-relaxed text-brand-grey sm:text-base">{{ description }}</p>

            <div class="mt-7 inline-flex flex-wrap items-center gap-x-2.5 gap-y-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 backdrop-blur-sm">
              <CalendarClock class="h-4 w-4 shrink-0 text-brand-red" />
              <span class="text-[11px] font-semibold tracking-[0.18em] text-brand-grey uppercase">Last Updated</span>
              <span class="h-3.5 w-px bg-white/15" aria-hidden="true" />
              <time class="text-sm font-bold text-white" :datetime="publishedAt || undefined">{{ formatDayMonthYear(publishedAt) }}</time>
            </div>
          </motion.div>
        </div>
      </section>

      <!-- ===================== BODY ===================== -->
      <div class="mx-auto max-w-[90rem] px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid gap-10 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">
          <!-- Desktop sticky TOC -->
          <aside v-if="toc.length" class="hidden lg:block" aria-label="Table of contents">
            <nav class="sticky top-[calc(var(--nav-h)+2.5rem)] max-h-[calc(100dvh-var(--nav-h)-3rem)] overflow-y-auto rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <p class="text-[11px] font-bold tracking-[0.2em] text-brand-grey uppercase">On this page</p>
              <ul class="mt-4 space-y-0.5">
                <li v-for="item in toc" :key="item.id">
                  <a
                    :href="`#${item.id}`"
                    class="block border-l-2 py-1.5 pl-4 text-xs leading-relaxed transition-all duration-200"
                    :class="[
                      item.level === 3 ? 'pl-8 text-[11px]' : 'pl-4',
                      activeId === item.id
                        ? 'border-brand-red font-semibold text-white'
                        : 'border-white/10 text-brand-grey hover:border-white/30 hover:text-white',
                    ]"
                    @click.prevent="scrollTo(item.id)"
                  >
                    {{ item.text }}
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          <div class="min-w-0">
            <!-- Mobile collapsible TOC -->
            <div v-if="toc.length" class="mb-8 lg:hidden">
              <button
                type="button"
                class="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left transition-colors hover:border-brand-red/40"
                :aria-expanded="tocOpen"
                aria-controls="mobile-toc"
                @click="tocOpen = !tocOpen"
              >
                <span class="flex items-center gap-2.5">
                  <ListTree class="h-4 w-4 text-brand-red" />
                  <span class="text-xs font-bold tracking-[0.18em] text-brand-grey uppercase">Table of contents</span>
                </span>
                <ChevronDown class="h-4 w-4 text-brand-red transition-transform duration-300" :class="tocOpen ? 'rotate-180' : ''" />
              </button>
              <div v-show="tocOpen" id="mobile-toc" class="mt-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
                <ul class="space-y-0.5">
                  <li v-for="item in toc" :key="item.id">
                    <a
                      :href="`#${item.id}`"
                      class="block rounded-lg px-3 py-2 text-sm leading-relaxed transition-colors"
                      :class="activeId === item.id ? 'bg-brand-red/10 font-semibold text-brand-red' : 'text-brand-grey hover:bg-white/5 hover:text-white'"
                      @click.prevent="scrollTo(item.id)"
                    >
                      {{ item.text }}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Article content -->
            <div v-if="loading" class="space-y-8" aria-busy="true" aria-label="Loading content">
              <div v-for="i in 4" :key="i" class="space-y-3">
                <div class="h-7 w-2/5 animate-pulse rounded-lg bg-white/[0.06]" />
                <div class="h-4 w-full animate-pulse rounded bg-white/[0.04]" />
                <div class="h-4 w-11/12 animate-pulse rounded bg-white/[0.04]" />
                <div class="h-4 w-3/4 animate-pulse rounded bg-white/[0.04]" />
              </div>
            </div>

            <article v-else ref="articleRef" class="legal-prose min-w-0">
              <template v-if="chunks.length">
                <motion.div
                  v-for="(chunk, i) in chunks"
                  :key="i"
                  :initial="{ opacity: 0, y: 18 }"
                  :while-in-view="{ opacity: 1, y: 0 }"
                  :viewport="{ once: true, margin: '-40px' }"
                  :transition="{ duration: 0.45, ease: 'easeOut', delay: Math.min(i * 0.05, 0.25) }"
                  v-html="chunk"
                />
              </template>
              <div v-else class="rounded-2xl border border-dashed border-white/15 p-14 text-center">
                <FileText class="mx-auto mb-4 h-10 w-10 text-brand-grey/50" />
                <p class="font-display text-2xl tracking-display text-brand-grey">Content coming soon.</p>
                <p class="mt-2 text-sm text-brand-grey/60">We're finalizing this document. Check back shortly.</p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { useScroll as useScrollY } from '@vueuse/core'
import { CalendarClock, ChevronDown, FileText, Home, ListTree } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

const props = withDefaults(defineProps<{
  slug: string
  fallbackTitle: string
  fallbackDescription: string
}>(), {})

const pb = usePB()
const route = useRoute()
const config = useRuntimeConfig()

const record = ref<any | null>(null)
const loading = ref(true)
const articleRef = ref<HTMLElement | null>(null)
const toc = ref<{ id: string; text: string; level: number }[]>([])
const activeId = ref('')
const tocOpen = ref(false)
const docHeight = ref(1)

const title = computed(() => record.value?.title || props.fallbackTitle)
const description = computed(() => record.value?.description || props.fallbackDescription)
const publishedAt = computed<string | null>(() => record.value?.published_at || null)
const bodyHtml = computed(() => record.value?.body || '')

const siteUrl = (config.public.siteUrl as string) || 'https://www.nairobi-powerbikes.co.ke'
const canonical = computed(() => `${siteUrl.replace(/\/$/, '')}${route.path}`)

/* ---------- reading progress ---------- */
const { y: scrollY } = useScrollY(window)
const progress = computed(() => {
  if (docHeight.value <= 0) return 0
  return Math.min(100, Math.max(0, (scrollY.value / docHeight.value) * 100))
})

function updateDocHeight() {
  docHeight.value = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
}

/* ---------- date helpers ---------- */
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function formatDayMonthYear(value: string | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return `${String(date.getDate()).padStart(2, '0')} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}

/* ---------- content loading + realtime ---------- */
async function load() {
  try {
    const res = await pb.collection('legal_pages').getList(1, 1, {
      filter: `slug = "${props.slug}" && status = "published"`,
      sort: '-published_at',
      requestKey: `legal-${props.slug}`,
    })
    record.value = res.items[0] || null
  } catch {
    record.value = null
  } finally {
    loading.value = false
  }
}

/* ---------- TOC generation ---------- */
function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'section'
}

function buildToc() {
  const el = articleRef.value
  if (!el) return
  const items: { id: string; text: string; level: number }[] = []
  el.querySelectorAll('h2, h3').forEach((h, i) => {
    const el2 = h as HTMLElement
    let id = el2.id
    if (!id) {
      id = slugify(el2.textContent || `section-${i}`)
      el2.id = id
    }
    items.push({ id, text: (el2.textContent || '').trim(), level: el2.tagName === 'H3' ? 3 : 2 })
  })
  toc.value = items
}

/* ---------- scroll spy ---------- */
let observer: IntersectionObserver | null = null

function setupSpy() {
  observer?.disconnect()
  const el = articleRef.value
  if (!el) return
  const heads = el.querySelectorAll('h2, h3')
  if (!heads.length) return
  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) activeId.value = (entry.target as HTMLElement).id
    }
  }, { rootMargin: '-15% 0px -70% 0px', threshold: 0 })
  heads.forEach(h => observer!.observe(h))
}

/* ---------- smooth scrolling ---------- */
function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  tocOpen.value = false
}

/* ---------- chunk body by h2 for fade-in sections ---------- */
const chunks = computed(() => {
  const html = bodyHtml.value
  if (!html) return []
  return html.split(/(?=<h2\b)/i).filter(c => c.trim().length)
})

/* ---------- SEO ---------- */
const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title.value,
  description: description.value,
  url: canonical.value,
  dateModified: publishedAt.value || undefined,
  isPartOf: { '@type': 'WebSite', name: 'Nairobi Powerbikes' },
  publisher: { '@type': 'Organization', name: 'Nairobi Powerbikes' },
  inLanguage: 'en',
}))

useHead(() => ({
  title: `${title.value} - Nairobi Powerbikes`,
  meta: [
    { name: 'description', content: description.value },
    { property: 'og:title', content: `${title.value} - Nairobi Powerbikes` },
    { property: 'og:description', content: description.value },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: canonical.value },
    { name: 'robots', content: 'index, follow' },
  ],
  link: [{ rel: 'canonical', href: canonical.value }],
  script: [{ type: 'application/ld+json', innerHTML: JSON.stringify(structuredData.value) }],
}))

/* ---------- lifecycle ---------- */
async function refresh() {
  await load()
  await nextTick()
  buildToc()
  setupSpy()
  updateDocHeight()
}

onMounted(async () => {
  await refresh()
  window.addEventListener('resize', updateDocHeight)
  pb.collection('legal_pages').subscribe('*', refresh)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', updateDocHeight)
  pb.collection('legal_pages').unsubscribe('*')
})
</script>
