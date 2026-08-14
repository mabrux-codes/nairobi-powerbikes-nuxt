<template>
  <BlogArticle v-if="post" :post="post" :related="related" :prev="prev" :next="next" />
  <div v-else-if="!loading" class="flex min-h-screen items-center justify-center bg-brand-black" />
</template>

<script setup lang="ts">
import { usePB } from '~/composables/usePocketBase'
import { useBlogStore, type BlogPost } from '~/stores/blog'
import { richDocToText } from '~/utils/richText'

const route = useRoute()
const pb = usePB()
const store = useBlogStore()
const loading = ref(true)
const post = ref<BlogPost | null>(null)
const related = ref<BlogPost[]>([])
const prev = ref<BlogPost | null>(null)
const next = ref<BlogPost | null>(null)

function publicFilter() {
  return 'published=true && (published_at = null || published_at <= @now)'
}

function isRecordId(v: string) {
  return /^[a-z0-9]{15}$/.test(v)
}

async function load() {
  const param = String(route.params.slug || '')
  if (!param) { loading.value = false; return }
  loading.value = true
  try {
    let p: BlogPost | null = null
    const isId = isRecordId(param)
    try {
      const rows = await pb.collection('blog_posts').getList<BlogPost>(1, 1, {
        filter: `slug="${param}" && ${publicFilter()}`,
      })
      p = rows.items[0] || null
    } catch { p = null }

    if (!p && isId) {
      try {
        p = await pb.collection('blog_posts').getOne<BlogPost>(param)
      } catch { p = null }
      if (p && p.slug) {
        await navigateTo(`/blog/${p.slug}`, { replace: true })
        return
      }
    }

    if (!p) {
      post.value = null
      loading.value = false
      showError({ statusCode: 404, statusMessage: 'Article not found' })
      return
    }

    post.value = p
    await Promise.all([loadRelated(p), loadAdjacent(p)])
    applySeo(p)
  } catch {
    post.value = null
    showError({ statusCode: 404, statusMessage: 'Article not found' })
  } finally {
    loading.value = false
  }
}

async function loadRelated(p: BlogPost) {
  try {
    const rows = await pb.collection('blog_posts').getList<BlogPost>(1, 3, {
      filter: p.category
        ? `category="${p.category}" && id!="${p.id}" && ${publicFilter()}`
        : `id!="${p.id}" && ${publicFilter()}`,
      sort: '-published_at,-created',
    })
    related.value = rows.items
  } catch { related.value = [] }
}

function pubTime(p: BlogPost) {
  return new Date(p.published_at || p.created).getTime() || 0
}

async function loadAdjacent(p: BlogPost) {
  try {
    const rows = await pb.collection('blog_posts').getFullList<BlogPost>({
      filter: `${publicFilter()}`,
    })
    const sorted = rows.sort((a, b) => pubTime(b) - pubTime(a))
    const idx = sorted.findIndex((r) => r.id === p.id)
    if (idx > -1) {
      prev.value = sorted[idx + 1] || null
      next.value = sorted[idx - 1] || null
    }
  } catch {
    prev.value = null
    next.value = null
  }
}

function excerptOf(p: BlogPost) {
  const text = richDocToText(p.content_json)
  if (text) return text.slice(0, 160)
  return String(p.excerpt || p.content || '').replace(/[#*`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)
}

function coverUrl(p: BlogPost) {
  const imgs = Array.isArray(p.image) ? p.image : (p.image ? [p.image] : [])
  const f = imgs[p.main_image || 0] || imgs[0]
  return f ? pb.files.getURL(p, f) : ''
}

function applySeo(p: BlogPost) {
  const desc = p.seo_description || excerptOf(p)
  useHead({
    title: `${p.seo_title || p.title} - Nairobi Powerbikes`,
    meta: [
      { name: 'description', content: desc },
      { name: 'robots', content: 'index, follow' },
      { property: 'og:title', content: p.seo_title || p.title },
      { property: 'og:description', content: desc },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: canonicalUrl(p) },
      { property: 'article:published_time', content: p.published_at || p.created },
      ...(p.tags ? [{ property: 'article:tag', content: p.tags.split(',').map(t => t.trim()).join(', ') }] : []),
      ...(coverUrl(p) ? [{ property: 'og:image', content: coverUrl(p) }] : []),
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: p.seo_title || p.title },
      { name: 'twitter:description', content: desc },
      ...(coverUrl(p) ? [{ name: 'twitter:image', content: coverUrl(p) }] : []),
    ],
    link: [{ rel: 'canonical', href: canonicalUrl(p) }],
  })
}

function canonicalUrl(p: BlogPost) {
  const config = useRuntimeConfig()
  const site = String(config.public.siteUrl || '').replace(/\/$/, '')
  return `${site}/blog/${p.slug}`
}

watch(() => route.params.slug, load)

onMounted(async () => {
  await load()
  pb.collection('blog_posts').subscribe('*', () => load())
})
onUnmounted(() => { pb.collection('blog_posts').unsubscribe('*') })
</script>
