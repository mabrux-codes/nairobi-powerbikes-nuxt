<template>
  <div class="min-h-screen bg-brand-black pb-24">
    <div class="relative">
      <div class="h-[240px] w-full overflow-hidden bg-gradient-to-br from-brand-red/20 via-white/[0.03] to-transparent sm:h-[320px]">
        <img v-if="post && cover(post)" :src="cover(post)" :alt="post.title" class="h-full w-full object-cover" />
        <div v-else class="flex h-full items-center justify-center">
          <span class="font-display text-8xl text-brand-red/15">{{ post?.title?.slice(0, 1) }}</span>
        </div>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-brand-black via-brand-black/40 to-transparent" />
    </div>

    <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <nav class="mt-8 flex items-center gap-2 text-sm text-brand-grey">
        <NuxtLink to="/" class="transition-colors hover:text-brand-red">Home</NuxtLink>
        <ChevronRight class="h-4 w-4 text-brand-grey/50" />
        <NuxtLink to="/blog" class="transition-colors hover:text-brand-red">Blog</NuxtLink>
        <ChevronRight class="h-4 w-4 text-brand-grey/50" />
        <span class="truncate text-white">{{ post?.title }}</span>
      </nav>

      <template v-if="post">
        <h1 class="mt-6 font-display text-3xl leading-tight tracking-display text-white sm:text-4xl">{{ post.title }}</h1>

        <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-grey">
          <span v-if="post.category" class="rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-xs font-semibold text-brand-red">{{ post.category }}</span>
          <span class="flex items-center gap-1.5"><User class="h-4 w-4 text-brand-grey/60" />{{ post.author || 'Staff' }}</span>
          <span class="flex items-center gap-1.5"><Calendar class="h-4 w-4 text-brand-grey/60" />{{ dateLabel(post.published_at || post.created) }}</span>
          <span class="flex items-center gap-1.5"><Clock class="h-4 w-4 text-brand-grey/60" />{{ post.reading_time }} min read</span>
        </div>

        <div
          v-if="post.content"
          class="blog-content mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-10"
          v-html="rendered"
        />

        <div class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-8">
          <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-red transition-transform duration-300 hover:-translate-x-0.5"><ChevronLeft class="h-4 w-4" />All articles</NuxtLink>
          <div class="flex items-center gap-2">
            <p class="text-sm text-brand-grey">Share:</p>
            <a :href="`https://wa.me/?text=${encodeURIComponent(`${post.title} - https://${host}/blog/${post.slug}`)}`" target="_blank" rel="noopener" class="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-brand-grey transition-colors hover:border-brand-red/50 hover:text-brand-red" aria-label="Share on WhatsApp"><MessageSquare class="h-4 w-4" /></a>
            <a :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://${host}/blog/${post.slug}`)}`" target="_blank" rel="noopener" class="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-brand-grey transition-colors hover:border-brand-red/50 hover:text-brand-red" aria-label="Share on Facebook"><Share2 class="h-4 w-4" /></a>
          </div>
        </div>
      </template>

      <template v-else-if="!loading">
        <div class="mt-20 text-center">
          <h1 class="font-display text-3xl tracking-display text-white">Article not found</h1>
          <p class="mt-3 text-brand-grey">This article may have been unpublished or removed.</p>
          <NuxtLink to="/blog" class="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red/90">Back to blog</NuxtLink>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, ChevronLeft, User, Calendar, Clock, MessageSquare, Share2 } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { renderMarkdown } from '~/utils/markdown'
import type { BlogPost } from '~/stores/blog'

const route = useRoute()
const pb = usePB()
const loading = ref(true)
const post = ref<BlogPost | null>(null)

const host = computed(() => {
  if (import.meta.client) return window.location.host
  return 'nairobipowerbikes.com'
})

const rendered = computed(() => renderMarkdown(post.value?.content || ''))

function cover(p: BlogPost) {
  const imgs = Array.isArray(p.image) ? p.image : (p.image ? [p.image] : [])
  const f = imgs[p.main_image || 0] || imgs[0]
  return f ? pb.files.getURL(p, f, { thumb: '1600x900' }) : ''
}
function dateLabel(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function load() {
  const slug = String(route.params.slug || '')
  if (!slug) { loading.value = false; return }
  try {
    const rows = await pb.collection('blog_posts').getList<BlogPost>(1, 1, {
      filter: `slug="${slug}" && published=true && (published_at = null || published_at <= @now)`,
    })
    post.value = rows.items[0] || null
  } catch { post.value = null }
  finally { loading.value = false }
}

watch(() => route.params.slug, load)

onMounted(async () => {
  await load()
  pb.collection('blog_posts').subscribe('*', () => load())
})
onUnmounted(() => { pb.collection('blog_posts').unsubscribe('*') })
</script>

<style scoped>
.blog-content :deep(h2) {
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  font-family: var(--font-display, ui-sans-serif, system-ui);
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
}
.blog-content :deep(h3) {
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
}
.blog-content :deep(p) {
  margin-top: 1rem;
  color: var(--brand-grey, #9ca3af);
  line-height: 1.8;
}
.blog-content :deep(strong) { color: #fff; }
.blog-content :deep(a) {
  color: var(--brand-red, #ef2a2a);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.blog-content :deep(ul) {
  margin-top: 1rem;
  padding-left: 1.5rem;
  list-style: disc;
  color: var(--brand-grey, #9ca3af);
  line-height: 1.8;
}
.blog-content :deep(ol) {
  margin-top: 1rem;
  padding-left: 1.5rem;
  list-style: decimal;
  color: var(--brand-grey, #9ca3af);
  line-height: 1.8;
}
.blog-content :deep(blockquote) {
  margin-top: 1rem;
  border-left: 3px solid var(--brand-red, #ef2a2a);
  padding: 0.5rem 1rem;
  color: #e5e7eb;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0 0.5rem 0.5rem 0;
}
.blog-content :deep(code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.85em;
  background: rgba(255, 255, 255, 0.08);
  padding: 0.15rem 0.35rem;
  border-radius: 0.3rem;
  color: #f9a8a8;
}
.blog-content :deep(pre) {
  margin-top: 1rem;
  padding: 1rem;
  overflow-x: auto;
  border-radius: 0.75rem;
  background: #000;
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.blog-content :deep(pre code) {
  background: none;
  padding: 0;
  color: #e5e7eb;
}
.blog-content :deep(hr) {
  margin: 2rem 0;
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
