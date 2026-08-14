<template>
  <div>
    <div class="sticky top-0 z-40 flex items-center justify-center gap-3 border-b border-white/10 bg-brand-black/90 px-4 py-2.5 backdrop-blur-md">
      <span class="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-300">
        <Eye class="h-3.5 w-3.5" />Preview · {{ post ? cap(post.status) : '…' }}
      </span>
      <span v-if="post" class="hidden truncate text-sm text-brand-grey sm:block">{{ post.title }}</span>
      <NuxtLink :to="`/blog/${post?.slug}`" class="ml-auto rounded-lg border border-brand-grey/20 px-3 py-1 text-xs font-semibold text-brand-grey transition-colors hover:border-brand-red/50 hover:text-brand-red">
        View live
      </NuxtLink>
      <button class="rounded-lg bg-brand-red px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-brand-red/90" @click="windowClose">
        Close preview
      </button>
    </div>
    <BlogArticle v-if="post" :post="post" />
  </div>
</template>

<script setup lang="ts">
import { Eye } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import type { BlogPost } from '~/stores/blog'

definePageMeta({ middleware: 'auth', roles: ['admin'] })

const route = useRoute()
const pb = usePB()
const post = ref<BlogPost | null>(null)

useHead({
  title: 'Preview - Nairobi Powerbikes',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

function cap(s: string) { return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }
function windowClose() { window.close() }

onMounted(async () => {
  const id = String(route.params.id || '')
  try {
    post.value = await pb.collection('blog_posts').getOne<BlogPost>(id)
  } catch {
    showError({ statusCode: 404, statusMessage: 'Article not found' })
  }
})
</script>
