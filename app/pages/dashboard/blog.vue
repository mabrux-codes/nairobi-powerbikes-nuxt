<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Blog"
      eyebrow="Content"
      description="Publish, schedule and manage articles for the public blog."
      live
      :actions="[{ label: 'New Article', icon: Plus, onClick: openCreate }]"
    />

    <div v-if="!store.ready" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-5">
        <div class="h-11 w-11 rounded-xl bg-brand-grey/10" />
        <div class="mt-4 h-8 w-14 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3 w-24 rounded bg-brand-grey/10" />
      </div>
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AdminStatCard label="Published" :display="countByStatus('published')" :icon="Newspaper" icon-bg="bg-emerald-500/15" icon-color="text-emerald-400" />
      <AdminStatCard label="Drafts" :display="countByStatus('draft')" :icon="FileText" icon-bg="bg-brand-grey/15" icon-color="text-brand-grey" />
      <AdminStatCard label="Scheduled" :display="countByStatus('scheduled')" :icon="CalendarClock" icon-bg="bg-sky-500/15" icon-color="text-sky-400" />
      <AdminStatCard label="Featured" :display="store.posts.filter(p => p.featured).length" :icon="Star" icon-bg="bg-amber-500/15" icon-color="text-amber-400" />
    </div>

    <AdminToolbar v-model:search="search" search-placeholder="Search articles by title, slug, category or author...">
      <AdminSelect v-model="statusFilter" placeholder="All Status">
        <option v-for="s in statusOptions" :key="s" :value="s" class="bg-brand-black">{{ cap(s) }}</option>
      </AdminSelect>
      <AdminSelect v-model="categoryFilter" placeholder="All Categories">
        <option v-for="c in categories" :key="c" :value="c" class="bg-brand-black">{{ c }}</option>
      </AdminSelect>
    </AdminToolbar>

    <AdminSkeleton v-if="!store.ready" :rows="6" variant="row" />
    <AdminEmptyState
      v-else-if="filtered.length === 0"
      :icon="Newspaper"
      title="No Articles"
      description="Write your first article to start sharing news with riders."
    >
      <Button size="sm" @click="openCreate"><Plus class="h-4 w-4" />New Article</Button>
    </AdminEmptyState>

    <div v-else class="overflow-hidden rounded-2xl border border-brand-grey/15 bg-brand-black/60">
      <div class="divide-y divide-brand-grey/10">
        <div v-for="p in filtered" :key="p.id" class="flex flex-wrap items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03]">
          <span class="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-brand-grey/15 bg-white/[0.03]">
            <img v-if="firstFile(p, 'image')" :src="pb.files.getURL(p, firstFile(p, 'image'))" :alt="p.title" class="h-full w-full object-cover" />
            <span v-else class="flex h-full items-center justify-center font-display text-lg text-brand-grey/25">{{ p.title?.slice(0, 1) }}</span>
          </span>
          <div class="min-w-0 flex-1">
            <p class="flex flex-wrap items-center gap-2 text-sm font-medium text-white">
              {{ p.title }}
              <StatusChip :status="p.status" size="sm" />
              <Badge v-if="p.featured" variant="secondary" class="shrink-0">Featured</Badge>
            </p>
            <p class="mt-0.5 truncate text-xs text-brand-grey">
              {{ p.excerpt || p.content ? strip(p.excerpt || p.content) : 'No excerpt' }}
            </p>
            <p class="mt-0.5 flex items-center gap-1.5 text-[11px] text-brand-grey/60">
              <LinkIcon class="h-3 w-3" />/blog/<span class="font-mono">{{ p.slug || '—' }}</span>
            </p>
            <p class="mt-0.5 text-[11px] text-brand-grey/60">
              {{ p.category || 'Uncategorized' }} · {{ p.reading_time }} min read · by {{ p.author || '—' }} · {{ shortDate(p.published_at || p.created) }}
            </p>
          </div>
          <div class="hidden xl:flex items-center gap-1.5">
            <button class="p-1.5 text-brand-grey hover:text-white hover:bg-white/5 rounded-md transition-colors" title="Copy link" @click="copyLink(p)"><LinkIcon class="h-4 w-4" /></button>
            <a :href="`/blog/${p.slug}`" target="_blank" class="p-1.5 text-brand-grey hover:text-white hover:bg-white/5 rounded-md transition-colors" title="View"><ExternalLink class="h-4 w-4" /></a>
            <button class="p-1.5 text-brand-grey hover:text-white hover:bg-white/5 rounded-md transition-colors" title="Edit" @click="openEdit(p)"><Pencil class="h-4 w-4" /></button>
            <button class="p-1.5 text-brand-grey hover:text-white hover:bg-white/5 rounded-md transition-colors" title="Duplicate" @click="duplicatePost(p)"><CopyPlus class="h-4 w-4" /></button>
            <button class="p-1.5 text-rose-400 hover:text-white hover:bg-rose-500/15 rounded-md transition-colors" title="Delete" @click="confirmDelete(p)"><Trash2 class="h-4 w-4" /></button>
          </div>
          <AdminActionsMenu class="xl:hidden" :items="actionsFor(p)" />
        </div>
      </div>
    </div>

    <AdminDrawer :open="drawerOpen" :title="editingId ? 'Edit Article' : 'New Article'" subtitle="Publish, schedule or draft a blog article" wide @close="closeDrawer">
      <div class="space-y-4">
        <Input v-model="form.title" label="Title" placeholder="Article title" />
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Status</label>
            <AdminSelect v-model="form.status">
              <option v-for="s in statusOptions" :key="s" :value="s" class="bg-brand-black">{{ cap(s) }}</option>
            </AdminSelect>
          </div>
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Category</label>
            <Input v-model="form.category" placeholder="e.g. New Arrivals" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <Input v-model="form.author" label="Author" placeholder="e.g. Abel M." />
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Publish Date</label>
            <input v-model="form.published_at" type="datetime-local" class="input-field" />
          </div>
        </div>
        <SlugField v-model="form.slug" :title="form.title" path="/blog/" :was-published="wasPublished" label="URL Slug" />
        <Input v-model="form.excerpt" label="Excerpt" placeholder="Short summary shown on the blog list" />
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Content</label>
          <AdminRichTextEditor
            v-model="form.content_json"
            :legacy-content="legacyMarkdown"
            :legacy-format="'markdown'"
            placeholder="Write your article here…"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <Input v-model="form.seo_title" label="SEO Title" placeholder="Optional — defaults to the title" />
          <Input v-model="form.seo_description" label="SEO Description" placeholder="Optional — defaults to the excerpt" />
        </div>
        <ImagePicker
          v-model:items="imageItems"
          v-model:main="mainImage"
          label="Images"
          :max="15"
        />
        <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-3.5">
          <input v-model="form.featured" type="checkbox" class="h-4 w-4 accent-brand-red" />
          <span class="text-sm text-white">Featured article</span>
          <span class="ml-auto text-xs text-brand-grey">Shown at the top of the blog (only one at a time)</span>
        </label>
      </div>
      <template #footer>
        <Button v-if="editingId && (form.status === 'published' || form.status === 'scheduled')" variant="ghost" @click="previewArticle">
          <Eye class="h-4 w-4" />Preview
        </Button>
        <Button variant="ghost" @click="closeDrawer">Cancel</Button>
        <Button :disabled="saving || !form.title.trim()" @click="savePost">{{ saving ? 'Saving…' : 'Save Article' }}</Button>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import {
  Plus, Newspaper, FileText, CalendarClock, Star, Pencil, Trash2, ExternalLink,
  Link as LinkIcon, CopyPlus, Eye,
} from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useBlogStore, type BlogPost } from '~/stores/blog'
import ImagePicker from '~/components/dashboard/media/ImagePicker.vue'
import { buildImageItems, appendImagePayload, firstFile } from '~/utils/imageTypes'
import type { ImageItem } from '~/utils/imageTypes'
import { isValidRichDoc, richDocToText } from '~/utils/richText'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Blog - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const store = useBlogStore()

const search = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const drawerOpen = ref(false)
const editingId = ref('')
const saving = ref(false)
const legacyMarkdown = ref('')

const statusOptions = ['draft', 'published', 'scheduled', 'archived']
const imageItems = ref<ImageItem[]>([])
const mainImage = ref(0)

const form = ref({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  author: '',
  category: '',
  status: 'draft',
  featured: false,
  published_at: '',
  seo_title: '',
  seo_description: '',
  content_json: null as unknown,
})

const wasPublished = computed(() => {
  const p = store.posts.find(r => r.id === editingId.value)
  return !!p && !!(p.published_at || (p.status === 'published'))
})

const categories = computed(() => [...new Set(store.posts.map(p => p.category).filter(Boolean))].sort())

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return store.posts.filter((p) => {
    if (q && !`${p.title} ${p.slug} ${p.category} ${p.author} ${p.content}`.toLowerCase().includes(q)) return false
    if (statusFilter.value && p.status !== statusFilter.value) return false
    if (categoryFilter.value && p.category !== categoryFilter.value) return false
    return true
  })
})

function cap(s: string) { return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }
function countByStatus(s: string) { return store.posts.filter(p => p.status === s).length }
function strip(html: string) {
  return String(html || '').replace(/[#*`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 140)
}
function shortDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function localInputValue(iso: string) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function fromLocalISOValue(v: string) {
  if (!v) return ''
  const d = new Date(v)
  return isNaN(d.getTime()) ? '' : d.toISOString()
}

function estimateReadingTime(doc: unknown, fallback: string) {
  const text = isValidRichDoc(doc) ? richDocToText(doc) : String(fallback || '')
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

function openCreate() {
  editingId.value = ''
  legacyMarkdown.value = ''
  form.value = { title: '', slug: '', content: '', excerpt: '', author: '', category: '', status: 'draft', featured: false, published_at: '', seo_title: '', seo_description: '', content_json: null }
  imageItems.value = []
  mainImage.value = 0
  drawerOpen.value = true
}

function openEdit(p: BlogPost) {
  editingId.value = p.id
  legacyMarkdown.value = p.content || ''
  const hasJson = p.content_json !== undefined && isValidRichDoc(p.content_json)
  form.value = {
    title: p.title,
    slug: p.slug || '',
    content: p.content || '',
    excerpt: p.excerpt || '',
    author: p.author || '',
    category: p.category || '',
    status: p.status || 'draft',
    featured: p.featured || false,
    published_at: localInputValue(p.published_at || ''),
    seo_title: p.seo_title || '',
    seo_description: p.seo_description || '',
    content_json: hasJson ? p.content_json : null,
  }
  const built = buildImageItems(p, 'image', (rec, file) => pb.files.getURL(rec, file))
  imageItems.value = built.items
  mainImage.value = built.main
  drawerOpen.value = true
}

function closeDrawer() { drawerOpen.value = false }

function previewArticle() {
  if (!editingId.value) return
  window.open(`/preview/blog/${editingId.value}`, '_blank')
}

async function savePost() {
  if (!form.value.title.trim()) return
  saving.value = true
  try {
    const data = new FormData()
    data.append('title', form.value.title.trim())
    data.append('slug', form.value.slug.trim())
    const docText = isValidRichDoc(form.value.content_json) ? richDocToText(form.value.content_json) : ''
    data.append('content', docText || legacyMarkdown.value)
    if (form.value.content_json !== null) {
      data.append('content_json', JSON.stringify(form.value.content_json))
    }
    data.append('excerpt', form.value.excerpt)
    data.append('author', form.value.author)
    data.append('category', form.value.category)
    data.append('status', form.value.status)
    data.append('featured', form.value.featured ? 'true' : 'false')
    data.append('seo_title', form.value.seo_title)
    data.append('seo_description', form.value.seo_description)
    data.append('reading_time', String(estimateReadingTime(form.value.content_json, legacyMarkdown.value)))
    const pubAt = fromLocalISOValue(form.value.published_at)
    if (pubAt) data.append('published_at', pubAt)
    appendImagePayload(data, imageItems.value, 'image')
    data.append('main_image', String(mainImage.value))

    if (editingId.value) {
      await pb.collection('blog_posts').update(editingId.value, data)
      toast.add({ type: 'success', title: 'Article updated' })
    } else {
      await pb.collection('blog_posts').create(data)
      toast.add({ type: 'success', title: 'Article created' })
    }
    closeDrawer()
    await store.refresh()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to save', message: e?.message || e?.data?.message })
  } finally {
    saving.value = false
  }
}

async function duplicatePost(p: BlogPost) {
  try {
    const data = new FormData()
    data.append('title', `${p.title} (copy)`)
    data.append('slug', '')
    data.append('content', p.content || '')
    if (p.content_json) data.append('content_json', JSON.stringify(p.content_json))
    data.append('excerpt', p.excerpt || '')
    data.append('author', p.author || '')
    data.append('category', p.category || '')
    data.append('status', 'draft')
    data.append('featured', 'false')
    data.append('seo_title', p.seo_title || '')
    data.append('seo_description', p.seo_description || '')
    await pb.collection('blog_posts').create(data)
    toast.add({ type: 'success', title: 'Article duplicated as draft' })
    await store.refresh()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to duplicate', message: e?.message || e?.data?.message })
  }
}

async function copyLink(p: BlogPost) {
  try {
    await navigator.clipboard.writeText(`${window.location.origin}/blog/${p.slug}`)
    toast.add({ type: 'success', title: 'Link copied' })
  } catch {
    toast.add({ type: 'error', title: 'Could not copy link' })
  }
}

function actionsFor(p: BlogPost) {
  return [
    { label: 'Edit', icon: Pencil, onClick: () => openEdit(p) },
    { label: 'Copy link', icon: LinkIcon, onClick: () => copyLink(p) },
    { label: 'Duplicate', icon: CopyPlus, onClick: () => duplicatePost(p) },
    ...(p.status === 'published'
      ? [{ label: 'Archive', icon: FileText, onClick: () => setStatus(p, 'archived') }]
      : [{ label: 'Publish', icon: Star, onClick: () => setStatus(p, 'published') }]),
    ...(p.featured
      ? [{ label: 'Unfeature', icon: Star, onClick: () => setStatus(p, p.status, false) }]
      : [{ label: 'Feature', icon: Star, onClick: () => setStatus(p, p.status, true) }]),
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => confirmDelete(p) },
  ]
}

async function setStatus(p: BlogPost, status: string, featured?: boolean) {
  try {
    const payload: any = { status }
    if (featured !== undefined) payload.featured = featured
    await pb.collection('blog_posts').update(p.id, payload)
    toast.add({ type: 'success', title: status === p.status ? (featured ? 'Article featured' : 'Article unfeatured') : `Article ${status}` })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update', message: e?.message }) }
}

async function confirmDelete(p: BlogPost) {
  const ok = await confirmDlg.confirm({ title: 'Delete Article', message: `Delete "${p.title}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('blog_posts').delete(p.id)
    toast.add({ type: 'success', title: 'Article deleted' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }) }
}

onMounted(() => {
  store.ensureActive()
})
onUnmounted(() => { store.release() })
</script>