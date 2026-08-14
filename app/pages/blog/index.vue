<template>
  <div class="min-h-screen bg-brand-black pb-24">
    <PageHeader
      eyebrow="Ride The Word"
      title="The"
      accent="Blog"
      description="News, guides and stories from the Nairobi Powerbikes showroom."
      :crumbs="[{ label: 'Blog' }]"
    />

    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <div class="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative min-w-0 flex-1 sm:max-w-xs">
            <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" />
            <input v-model="searchInput" type="text" placeholder="Search articles…" class="input-field h-10 rounded-xl pl-10 focus:ring-2 focus:ring-brand-red/30" aria-label="Search articles" />
          </div>
          <select v-model="categoryFilter" class="input-field h-10 w-auto appearance-none rounded-xl text-sm" aria-label="Filter by category">
            <option value="">All Categories</option>
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
          <p class="ml-auto text-sm text-brand-grey">{{ visiblePosts.length }} article{{ visiblePosts.length === 1 ? '' : 's' }}</p>
        </div>
      </div>

      <template v-if="loading">
        <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div class="aspect-[16/9] bg-white/[0.04]" />
            <div class="space-y-2 p-5">
              <div class="h-3 w-24 rounded bg-white/[0.06]" />
              <div class="h-5 w-3/4 rounded bg-white/[0.08]" />
              <div class="h-3 w-full rounded bg-white/[0.04]" />
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <section v-if="hero" class="mt-10" aria-label="Featured articles">
          <motion.div
            :initial="{ opacity: 0, y: 24 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ duration: 0.5, ease: 'easeOut' }"
            class="overflow-hidden rounded-2xl border border-brand-red/20 bg-gradient-to-br from-brand-red/10 via-white/[0.02] to-transparent"
          >
            <NuxtLink :to="`/blog/${hero.slug}`" class="group grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40">
              <div class="relative h-[280px] overflow-hidden bg-black sm:h-[360px] md:h-[400px] lg:h-[440px] xl:h-[500px]">
                <img v-if="cover(hero)" :src="cover(hero)" :alt="hero.title" class="h-full w-full transition-transform duration-700 group-hover:scale-[1.03]" :class="fitClass(hero.id)" @load="trackRatio(hero.id, $event)" loading="eager" />
                <span v-else class="flex h-full items-center justify-center font-display text-6xl text-brand-red/20">{{ hero.title?.slice(0, 1) }}</span>
                <span class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-brand-red px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white"><Star class="h-3 w-3" />Featured</span>
              </div>
              <div class="flex min-w-0 flex-col justify-center gap-3 p-6 lg:p-10">
                <p class="text-xs font-semibold uppercase tracking-widest text-brand-red">{{ hero.category || 'Featured' }}</p>
                <h2 class="line-clamp-3 font-display text-2xl tracking-display text-white sm:text-3xl">{{ hero.title }}</h2>
                <p class="line-clamp-3 text-sm leading-relaxed text-brand-grey">{{ excerpt(hero.excerpt || hero.content) }}</p>
                <p class="mt-1 text-xs text-brand-grey/70">{{ hero.author || 'Staff' }} · {{ dateLabel(hero.published_at || hero.created) }} · {{ hero.reading_time }} min read</p>
                <span class="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red transition-transform duration-300 group-hover:translate-x-1">Read article <ChevronRight class="h-4 w-4" /></span>
              </div>
            </NuxtLink>
          </motion.div>

          <div v-if="moreFeatured.length" class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <motion.div
              v-for="(p, i) in moreFeatured"
              :key="p.id"
              :initial="{ opacity: 0, y: 24 }"
              :animate="{ opacity: 1, y: 0 }"
              :transition="{ delay: 0.1 + i * 0.05, duration: 0.45, ease: 'easeOut' }"
            >
              <NuxtLink :to="`/blog/${p.slug}`" class="group flex h-full flex-col overflow-hidden rounded-2xl border border-brand-red/20 bg-white/[0.02] transition-colors duration-300 hover:border-brand-red/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40">
                <div class="relative aspect-[16/9] overflow-hidden bg-black">
                  <img v-if="cover(p)" :src="cover(p)" :alt="p.title" class="h-full w-full transition-transform duration-700 group-hover:scale-105" :class="fitClass(p.id)" @load="trackRatio(p.id, $event)" loading="lazy" />
                  <span v-else class="flex h-full items-center justify-center font-display text-5xl text-brand-red/15">{{ p.title?.slice(0, 1) }}</span>
                  <span class="absolute left-3 top-3 rounded-full bg-brand-red px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">Featured</span>
                </div>
                <div class="flex flex-1 flex-col gap-2 p-5">
                  <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-red">{{ p.category || 'News' }}</p>
                  <h3 class="line-clamp-2 font-display text-lg leading-snug tracking-display text-white">{{ p.title }}</h3>
                  <p class="line-clamp-2 text-sm leading-relaxed text-brand-grey">{{ excerpt(p.excerpt || p.content) }}</p>
                  <p class="mt-auto pt-2 text-xs text-brand-grey/70">{{ p.author || 'Staff' }} · {{ dateLabel(p.published_at || p.created) }} · {{ p.reading_time }} min read</p>
                </div>
              </NuxtLink>
            </motion.div>
          </div>
        </section>

        <div v-if="regularPosts.length" class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            v-for="(p, i) in regularPosts"
            :key="p.id"
            :initial="{ opacity: 0, y: 24 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: (i % 6) * 0.05, duration: 0.45, ease: 'easeOut' }"
          >
            <NuxtLink :to="`/blog/${p.slug}`" class="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors duration-300 hover:border-brand-red/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/40">
              <div class="relative aspect-[16/9] overflow-hidden bg-black">
                <img v-if="cover(p)" :src="cover(p)" :alt="p.title" class="h-full w-full transition-transform duration-700 group-hover:scale-105" :class="fitClass(p.id)" @load="trackRatio(p.id, $event)" loading="lazy" />
                <span v-else class="flex h-full items-center justify-center font-display text-5xl text-brand-red/15">{{ p.title?.slice(0, 1) }}</span>
              </div>
              <div class="flex flex-1 flex-col gap-2 p-5">
                <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-red">{{ p.category || 'News' }}</p>
                <h3 class="line-clamp-2 font-display text-lg leading-snug tracking-display text-white">{{ p.title }}</h3>
                <p class="line-clamp-2 text-sm leading-relaxed text-brand-grey">{{ excerpt(p.excerpt || p.content) }}</p>
                <p class="mt-auto pt-2 text-xs text-brand-grey/70">{{ p.author || 'Staff' }} · {{ dateLabel(p.published_at || p.created) }} · {{ p.reading_time }} min read</p>
              </div>
            </NuxtLink>
          </motion.div>
        </div>

        <ShopEmptyState v-if="!visiblePosts.length" kind="blog" title="No articles found" description="Try clearing your search or filters, or check back soon for new posts." :on-clear="clearFilters" class="mt-10" />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Search, ChevronRight, Star } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import type { BlogPost } from '~/stores/blog'

useHead({
  title: 'Blog - Nairobi Powerbikes',
  meta: [{ name: 'description', content: 'News, guides and stories from the Nairobi Powerbikes showroom.' }],
})

const pb = usePB()
const loading = ref(true)
const posts = ref<BlogPost[]>([])
const searchInput = ref('')
const categoryFilter = ref('')

const categories = computed(() => [...new Set(posts.value.map(p => p.category).filter(Boolean))].sort())

const visiblePosts = computed(() => {
  const q = searchInput.value.toLowerCase()
  return posts.value.filter((p) => {
    if (q && !`${p.title} ${p.excerpt} ${p.category} ${p.author}`.toLowerCase().includes(q)) return false
    if (categoryFilter.value && p.category !== categoryFilter.value) return false
    return true
  })
})

const featuredPosts = computed(() => visiblePosts.value.filter(p => p.featured))
const hero = computed(() => featuredPosts.value[0] || null)
const moreFeatured = computed(() => featuredPosts.value.slice(1))
const regularPosts = computed(() => visiblePosts.value.filter(p => !p.featured))

const ratios = ref<Record<string, number>>({})

function trackRatio(id: string, e: Event) {
  const img = e.target as HTMLImageElement
  if (img.naturalWidth && img.naturalHeight) {
    ratios.value[id] = img.naturalWidth / img.naturalHeight
  }
}

function fitClass(id: string) {
  const r = ratios.value[id]
  if (r && r < 1) return 'object-contain'
  return 'object-cover'
}

function excerpt(s: string) {
  return String(s || '').replace(/[#*`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)
}
function dateLabel(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
function cover(p: BlogPost) {
  const imgs = Array.isArray(p.image) ? p.image : (p.image ? [p.image] : [])
  const f = imgs[p.main_image || 0] || imgs[0]
  return f ? pb.files.getURL(p, f, { thumb: '900x600' }) : ''
}
function clearFilters() { searchInput.value = ''; categoryFilter.value = '' }

async function load() {
  try {
    const rows = await pb.collection('blog_posts').getFullList<BlogPost>({
      sort: '-published_at,-created',
      filter: 'published=true && (published_at = null || published_at <= @now)',
    })
    posts.value = rows
  } catch { posts.value = [] }
  finally { loading.value = false }
}

onMounted(async () => {
  await load()
  pb.collection('blog_posts').subscribe('*', () => load())
})
onUnmounted(() => { pb.collection('blog_posts').unsubscribe('*') })
</script>
