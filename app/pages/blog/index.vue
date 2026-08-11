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
          <p class="ml-auto text-sm text-brand-grey">{{ visible.length }} article{{ visible.length === 1 ? '' : 's' }}</p>
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

      <template v-else-if="featured">
        <motion.div
          :initial="{ opacity: 0, y: 24 }"
          :animate="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, ease: 'easeOut' }"
          class="mt-10 overflow-hidden rounded-2xl border border-brand-red/20 bg-gradient-to-br from-brand-red/10 via-white/[0.02] to-transparent"
        >
          <NuxtLink :to="`/blog/${featured.slug}`" class="group grid grid-cols-1 lg:grid-cols-2">
            <div class="relative aspect-[16/9] overflow-hidden lg:aspect-auto lg:min-h-[320px]">
              <img v-if="cover(featured)" :src="cover(featured)" :alt="featured.title" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <span v-else class="flex h-full items-center justify-center font-display text-6xl text-brand-red/20">{{ featured.title?.slice(0, 1) }}</span>
              <span class="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-brand-red px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white"><Star class="h-3 w-3" />Featured</span>
            </div>
            <div class="flex flex-col justify-center gap-3 p-6 lg:p-10">
              <p class="text-xs font-semibold uppercase tracking-widest text-brand-red">{{ featured.category || 'Featured' }}</p>
              <h2 class="font-display text-2xl tracking-display text-white sm:text-3xl">{{ featured.title }}</h2>
              <p class="text-sm leading-relaxed text-brand-grey">{{ excerpt(featured.excerpt || featured.content) }}</p>
              <p class="mt-1 text-xs text-brand-grey/70">{{ featured.author || 'Staff' }} · {{ dateLabel(featured.published_at || featured.created) }} · {{ featured.reading_time }} min read</p>
              <span class="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-red transition-transform duration-300 group-hover:translate-x-1">Read article <ChevronRight class="h-4 w-4" /></span>
            </div>
          </NuxtLink>
        </motion.div>
      </template>

      <template v-else-if="visible.length">
        <div class="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <motion.div
            v-for="(p, i) in visible"
            :key="p.id"
            :initial="{ opacity: 0, y: 24 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: (i % 6) * 0.05, duration: 0.45, ease: 'easeOut' }"
          >
            <NuxtLink :to="`/blog/${p.slug}`" class="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-colors duration-300 hover:border-brand-red/40">
              <div class="relative aspect-[16/9] overflow-hidden">
                <img v-if="cover(p)" :src="cover(p)" :alt="p.title" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span v-else class="flex h-full items-center justify-center font-display text-5xl text-brand-red/15">{{ p.title?.slice(0, 1) }}</span>
                <span v-if="p.featured" class="absolute left-3 top-3 rounded-full bg-brand-red px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">Featured</span>
              </div>
              <div class="flex flex-1 flex-col gap-2 p-5">
                <p class="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-red">{{ p.category || 'News' }}</p>
                <h3 class="font-display text-lg leading-snug tracking-display text-white">{{ p.title }}</h3>
                <p class="line-clamp-2 text-sm leading-relaxed text-brand-grey">{{ excerpt(p.excerpt || p.content) }}</p>
                <p class="mt-auto pt-2 text-xs text-brand-grey/70">{{ p.author || 'Staff' }} · {{ dateLabel(p.published_at || p.created) }} · {{ p.reading_time }} min read</p>
              </div>
            </NuxtLink>
          </motion.div>
        </div>
      </template>

      <ShopEmptyState v-else kind="gear" title="No articles found" description="Try clearing your search or filters, or check back soon for new posts." :on-clear="clearFilters" class="mt-10" />
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

const featured = computed(() => visiblePosts.value.find(p => p.featured) || null)
const visible = computed(() => visiblePosts.value.filter(p => !featured.value || p.id !== featured.value.id))

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
