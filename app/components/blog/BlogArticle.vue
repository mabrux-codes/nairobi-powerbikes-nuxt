<template>
  <div class="min-h-screen bg-brand-black pb-24">
    <div class="relative">
      <div class="h-[240px] w-full overflow-hidden bg-gradient-to-br from-brand-red/20 via-white/[0.03] to-transparent sm:h-[320px]">
        <img v-if="cover" :src="cover" :alt="post.title" class="h-full w-full object-cover" />
        <div v-else class="flex h-full items-center justify-center">
          <span class="font-display text-8xl text-brand-red/15">{{ post.title?.slice(0, 1) }}</span>
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
        <span class="truncate text-white">{{ post.title }}</span>
      </nav>

      <h1 class="mt-6 font-display text-3xl leading-tight tracking-display text-white sm:text-4xl">{{ post.title }}</h1>

      <p v-if="excerpt" class="mt-4 text-lg leading-relaxed text-brand-grey">{{ excerpt }}</p>

      <div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-brand-grey">
        <span v-if="post.category" class="rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1 text-xs font-semibold text-brand-red">{{ post.category }}</span>
        <span class="flex items-center gap-1.5"><User class="h-4 w-4 text-brand-grey/60" />{{ post.author || 'Staff' }}</span>
        <span class="flex items-center gap-1.5"><Calendar class="h-4 w-4 text-brand-grey/60" />{{ dateLabel(post.published_at || post.created) }}</span>
        <span class="flex items-center gap-1.5"><Clock class="h-4 w-4 text-brand-grey/60" />{{ post.reading_time }} min read</span>
      </div>

      <div v-if="hasContent" class="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-10">
        <BlogRichArticle :doc="post.content_json" :legacy-html="legacyHtml" />
      </div>

      <div v-if="tags" class="mt-8 flex flex-wrap gap-2">
        <span v-for="t in tags" :key="t" class="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-brand-grey">{{ t }}</span>
      </div>

      <div class="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-8">
        <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-sm font-semibold text-brand-red transition-transform duration-300 hover:-translate-x-0.5"><ChevronLeft class="h-4 w-4" />All articles</NuxtLink>
        <div class="flex items-center gap-2">
          <p class="text-sm text-brand-grey">Share:</p>
          <ShareButton
            :title="post.title"
            :description="excerpt"
            :image="cover || ''"
            type="blog"
            variant="ghost"
          />
        </div>
      </div>

      <div v-if="related.length" class="mt-12">
        <h2 class="font-display text-xl tracking-display text-white">Related articles</h2>
        <div class="mt-5 grid gap-4 sm:grid-cols-3">
          <NuxtLink
            v-for="r in related"
            :key="r.id"
            :to="`/blog/${r.slug}`"
            class="group overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02] transition-colors hover:border-brand-red/40"
          >
            <div class="aspect-video overflow-hidden bg-white/[0.03]">
              <img v-if="coverOf(r)" :src="coverOf(r)" :alt="r.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div class="p-4">
              <p class="line-clamp-2 text-sm font-semibold text-white">{{ r.title }}</p>
              <p class="mt-1.5 text-xs text-brand-grey">{{ shortDate(r.published_at || r.created) }} · {{ r.reading_time }} min read</p>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div v-if="prev || next" class="mt-12 flex flex-col gap-3 border-t border-white/[0.06] pt-8 sm:flex-row sm:justify-between">
        <NuxtLink v-if="prev" :to="`/blog/${prev.slug}`" class="group max-w-xs">
          <p class="text-xs text-brand-grey">← Previous</p>
          <p class="mt-1 line-clamp-1 text-sm font-medium text-white group-hover:text-brand-red">{{ prev.title }}</p>
        </NuxtLink>
        <span v-else />
        <NuxtLink v-if="next" :to="`/blog/${next.slug}`" class="group max-w-xs text-right">
          <p class="text-xs text-brand-grey">Next →</p>
          <p class="mt-1 line-clamp-1 text-sm font-medium text-white group-hover:text-brand-red">{{ next.title }}</p>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight, ChevronLeft, User, Calendar, Clock } from 'lucide-vue-next'
import type { BlogPost } from '~/stores/blog'
import { usePB } from '~/composables/usePocketBase'
import { renderMarkdown } from '~/utils/markdown'
import { richDocToText } from '~/utils/richText'
import { isValidRichDoc } from '~/utils/richText'

const props = withDefaults(defineProps<{
  post: BlogPost
  related?: BlogPost[]
  prev?: BlogPost | null
  next?: BlogPost | null
}>(), {
  related: () => [],
  prev: null,
  next: null,
})

const pb = usePB()

const legacyHtml = computed(() => renderMarkdown(props.post.content || ''))
const hasContent = computed(() => {
  if (props.post.content_json !== undefined && isValidRichDoc(props.post.content_json)) return true
  return !!props.post.content
})

const cover = computed(() => coverOf(props.post))
const excerpt = computed(() => {
  const e = props.post.excerpt || ''
  if (e) return e
  const text = richDocToText(props.post.content_json)
  if (text) return text.slice(0, 160)
  return String(props.post.content || '').replace(/[#*`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)
})
const tags = computed(() => String(props.post.tags || '').split(',').map(t => t.trim()).filter(Boolean))

function coverOf(p: BlogPost) {
  const imgs = Array.isArray(p.image) ? p.image : (p.image ? [p.image] : [])
  const f = imgs[p.main_image || 0] || imgs[0]
  return f ? pb.files.getURL(p, f) : ''
}
function dateLabel(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
function shortDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
