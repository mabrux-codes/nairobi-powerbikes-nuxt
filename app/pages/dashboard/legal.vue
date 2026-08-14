<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Legal Pages"
      eyebrow="CMS"
      description="Manage Terms of Service and Privacy Policy content with a draft → publish workflow and full version history."
      :live="true"
    />

    <!-- Document cards -->
    <div class="grid gap-4 sm:grid-cols-2">
      <AdminCard v-for="doc in SLUGS" :key="doc.slug" class="flex flex-col">
        <div class="flex items-start justify-between">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl" :class="doc.iconBg">
            <component :is="doc.icon" class="h-5 w-5" :class="doc.iconColor" />
          </span>
          <StatusChip :status="publishedOf(doc.slug) ? 'published' : 'draft'" size="sm" />
        </div>
        <h3 class="mt-4 font-display text-lg tracking-display text-white">{{ doc.label }}</h3>
        <p class="text-[11px] text-brand-grey">Slug: /{{ doc.slug }}</p>
        <p class="mt-1 flex-1 text-xs leading-relaxed text-brand-grey/70">{{ doc.desc }}</p>

        <div class="mt-4 rounded-xl border border-brand-grey/10 bg-white/[0.02] p-3.5 text-xs">
          <div class="flex items-center justify-between gap-2">
            <span class="text-brand-grey">Published version</span>
            <span class="font-bold text-white">v{{ publishedOf(doc.slug)?.version ?? '—' }}</span>
          </div>
          <div class="mt-1.5 flex items-center justify-between gap-2">
            <span class="text-brand-grey">Last updated</span>
            <span class="font-semibold text-emerald-400">{{ formatDayMonthYear(publishedOf(doc.slug)?.published_at) }}</span>
          </div>
          <div class="mt-1.5 flex items-center justify-between gap-2">
            <span class="text-brand-grey">Versions</span>
            <span class="font-semibold text-white">{{ versionsOf(doc.slug).length }}</span>
          </div>
        </div>

        <div class="mt-3 flex items-center gap-2">
          <Button variant="ghost" size="sm" class="flex-1" @click="openHistory(doc.slug)"><History class="h-3.5 w-3.5" />History</Button>
          <Button variant="secondary" size="sm" class="flex-1" @click="openEditor(doc.slug)"><Pencil class="h-3.5 w-3.5" />{{ draftOf(doc.slug) ? 'Edit Draft' : 'New Version' }}</Button>
        </div>
      </AdminCard>
    </div>

    <!-- Help strip -->
    <div class="flex items-start gap-3 rounded-2xl border border-brand-grey/15 bg-white/[0.02] p-4 text-xs leading-relaxed text-brand-grey">
      <Info class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
      <p>
        Publishing a version automatically updates the public page and the <span class="text-white">Last Updated</span> date, and archives the
        previous published version. Saving a draft never touches the live page. Content updates are pushed to visitors in real time.
      </p>
    </div>

    <!-- ============ Editor drawer ============ -->
    <AdminDrawer :open="editorOpen" :title="editorTitle" :subtitle="editingVersionId ? 'Updating draft' : 'Creating new version'" @close="editorOpen = false">
      <div class="space-y-4">
        <Input v-model="form.title" label="Page Title" placeholder="Terms of Service" />
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Short description</label>
          <textarea v-model="form.description" rows="2" class="input-field rounded-xl resize-none" placeholder="One or two sentences describing this page." />
        </div>
        <div>
          <div class="mb-1.5 flex items-center justify-between">
            <label class="block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Content</label>
            <span class="text-[10px] text-brand-grey/50">Headings become the table of contents</span>
          </div>
          <AdminRichTextEditor
            v-model="form.content_json"
            :legacy-content="legacyBody"
            :legacy-format="'html'"
            placeholder="Write the document content here…"
          />
        </div>
        <div v-if="editingVersionId" class="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2.5 text-xs text-amber-400">
          <AlertCircle class="h-4 w-4 shrink-0" />
          You are editing draft v{{ draftOf(editSlug)?.version }}. The live page still shows the published version.
        </div>
      </div>
      <template #footer>
        <Button variant="ghost" @click="editorOpen = false">Cancel</Button>
        <Button variant="secondary" :disabled="saving" @click="saveDraft"><Save class="h-4 w-4" />{{ saving ? 'Saving…' : 'Save Draft' }}</Button>
        <Button :disabled="saving" @click="publish"><Send class="h-4 w-4" />{{ saving ? 'Publishing…' : 'Publish' }}</Button>
      </template>
    </AdminDrawer>

    <!-- ============ History drawer ============ -->
    <AdminDrawer :open="historyOpen" :title="historyTitle" subtitle="Every version of this document" @close="historyOpen = false">
      <div v-if="historyVersions.length" class="space-y-3">
        <div
          v-for="v in historyVersions"
          :key="v.id"
          class="rounded-xl border border-brand-grey/10 bg-white/[0.02] p-4"
          :class="v.id === publishedOf(v.slug)?.id ? 'border-emerald-500/30' : ''"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-red/10 font-mono text-xs font-bold text-brand-red">v{{ v.version }}</span>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-white">{{ v.title }}</p>
                <p class="text-[11px] text-brand-grey">
                  Created {{ formatDateTime(v.created) }}{{ v.created_by ? ` · by ${v.created_by}` : '' }}
                </p>
                <p v-if="v.status === 'published' && v.published_at" class="text-[11px] text-brand-grey">
                  Published {{ formatDateTime(v.published_at) }}{{ v.published_by ? ` · by ${v.published_by}` : '' }}
                </p>
                <p v-else-if="v.status === 'archived' && v.archived_at" class="text-[11px] text-brand-grey">Archived {{ formatDateTime(v.archived_at) }}</p>
              </div>
            </div>
            <StatusChip :status="v.status" size="sm" />
          </div>
          <div class="mt-3 flex flex-wrap items-center gap-1.5 border-t border-brand-grey/10 pt-3">
            <button class="flex h-8 items-center gap-1.5 rounded-lg border border-brand-grey/20 px-2.5 text-[11px] font-semibold text-brand-grey transition-all hover:border-brand-red/50 hover:text-white" @click="openPreview(v)"><Eye class="h-3.5 w-3.5" />Preview</button>
            <button class="flex h-8 items-center gap-1.5 rounded-lg border border-brand-grey/20 px-2.5 text-[11px] font-semibold text-brand-grey transition-all hover:border-brand-red/50 hover:text-white" :disabled="!publishedOf(v.slug) || publishedOf(v.slug)?.id === v.id" @click="openCompare(v)"><GitCompare class="h-3.5 w-3.5" />Compare</button>
            <button class="flex h-8 items-center gap-1.5 rounded-lg border border-brand-grey/20 px-2.5 text-[11px] font-semibold text-brand-grey transition-all hover:border-brand-red/50 hover:text-white" @click="restore(v)"><RotateCcw class="h-3.5 w-3.5" />Restore</button>
          </div>
        </div>
      </div>
      <div v-else class="py-10 text-center">
        <p class="text-sm text-brand-grey">No versions yet. Create the first draft to get started.</p>
      </div>
    </AdminDrawer>

    <!-- ============ Preview drawer ============ -->
    <AdminDrawer :open="!!previewRec" :title="previewTitle" subtitle="Rendered content preview" @close="previewRec = null">
      <div class="legal-prose max-h-[70dvh] overflow-y-auto rounded-xl border border-brand-grey/10 bg-white/[0.02] p-5">
        <div v-html="previewHtml" />
      </div>
      <template #footer>
        <Button variant="ghost" @click="previewRec = null">Close</Button>
      </template>
    </AdminDrawer>

    <!-- ============ Compare drawer ============ -->
    <AdminDrawer :open="!!compareRec" :title="compareTitle" subtitle="Side-by-side comparison" @close="compareRec = null">
      <div class="grid gap-4 lg:grid-cols-2">
        <div>
          <p class="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">
            <span class="flex h-6 w-6 items-center justify-center rounded-md bg-brand-red/10 font-mono text-[10px] font-bold text-brand-red">v{{ compareRec?.version }}</span>
            Selected
            <StatusChip :status="compareRec?.status || 'draft'" size="sm" />
          </p>
          <div class="legal-prose max-h-[62dvh] overflow-y-auto rounded-xl border border-brand-grey/10 bg-white/[0.02] p-4">
            <div v-html="compareHtml" />
          </div>
        </div>
        <div>
          <p class="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] text-brand-grey uppercase">
            <span class="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 font-mono text-[10px] font-bold text-emerald-400">v{{ compareCurrent?.version }}</span>
            Current published
            <StatusChip status="published" size="sm" />
          </p>
          <div class="legal-prose max-h-[62dvh] overflow-y-auto rounded-xl border border-brand-grey/10 bg-white/[0.02] p-4">
            <div v-html="compareCurrentHtml" />
          </div>
        </div>
      </div>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import { ScrollText, Shield, Pencil, History, Save, Send, Eye, GitCompare, RotateCcw, Info, AlertCircle } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useAuthStore } from '~/stores/auth'
import { isValidRichDoc, richDocToHTML } from '~/utils/richText'
import { sanitizeHtml } from '~/composables/useSanitize'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Legal Pages - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const auth = useAuthStore()

const SLUGS = [
  { slug: 'terms', label: 'Terms of Service', icon: ScrollText, iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400', desc: 'Terms governing the use of the website, services, and purchases.' },
  { slug: 'privacy', label: 'Privacy Policy', icon: Shield, iconBg: 'bg-rose-500/15', iconColor: 'text-rose-400', desc: 'How we collect, use, and protect personal information.' },
]

const docs = ref<any[]>([])
const loading = ref(true)
const saving = ref(false)

const editorOpen = ref(false)
const editSlug = ref('terms')
const editingVersionId = ref<string | null>(null)
const form = ref({ title: '', description: '', body: '', content_json: null as unknown })
const legacyBody = ref('')

const historyOpen = ref(false)
const historySlug = ref('terms')

const previewRec = ref<any | null>(null)
const compareRec = ref<any | null>(null)

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function formatDayMonthYear(value?: string | null): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

function formatDateTime(value?: string | null): string {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return `${formatDayMonthYear(value)}, ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function versionsOf(slug: string) {
  return docs.value.filter(d => d.slug === slug).sort((a, b) => Number(b.version) - Number(a.version))
}

function publishedOf(slug: string) {
  return versionsOf(slug).find(v => v.status === 'published')
}

function draftOf(slug: string) {
  return versionsOf(slug).find(v => v.status === 'draft')
}

function maxVersion(slug: string) {
  return versionsOf(slug).reduce((max, v) => Math.max(max, Number(v.version) || 0), 0)
}

const editorTitle = computed(() => `${SLUGS.find(s => s.slug === editSlug.value)?.label || 'Document'} — ${editingVersionId.value ? 'Edit Draft' : 'New Version'}`)
const historyTitle = computed(() => `${SLUGS.find(s => s.slug === historySlug.value)?.label || 'Document'} — History`)
const historyVersions = computed(() => versionsOf(historySlug.value))
const previewTitle = computed(() => `v${previewRec.value?.version || '?'} — ${previewRec.value?.title || 'Preview'}`)
const compareTitle = computed(() => `${SLUGS.find(s => s.slug === compareRec.value?.slug)?.label || 'Document'} — Compare`)
const previewHtml = computed(() => richHtmlOf(previewRec.value) || '<p>Empty version.</p>')
const compareHtml = computed(() => richHtmlOf(compareRec.value) || '<p>Empty.</p>')
const compareCurrentHtml = computed(() => richHtmlOf(compareCurrent.value) || '<p>Nothing published yet.</p>')

function richHtmlOf(rec: any) {
  if (!rec) return ''
  if (isValidRichDoc(rec.content_json)) return richDocToHTML(rec.content_json)
  return sanitizeHtml(rec.body || '')
}
const compareCurrent = computed(() => (compareRec.value ? publishedOf(compareRec.value.slug) : null))

function adminName() {
  return auth.user?.name || auth.user?.email || 'Admin'
}

/* ---------------- editor ---------------- */
function openEditor(slug: string) {
  editSlug.value = slug
  const draft = draftOf(slug)
  const src = draft || publishedOf(slug)
  form.value = {
    title: src?.title || SLUGS.find(s => s.slug === slug)?.label || '',
    description: src?.description || '',
    body: src?.body || '',
    content_json: src?.content_json && isValidRichDoc(src.content_json) ? src.content_json : null,
  }
  legacyBody.value = src?.body || ''
  editingVersionId.value = draft?.id || null
  editorOpen.value = true
}

function applyRichBody(target: any) {
  if (isValidRichDoc(form.value.content_json)) {
    target.content_json = form.value.content_json
    target.body = richDocToHTML(form.value.content_json)
  }
}

async function saveDraft() {
  if (!form.value.title.trim()) {
    toast.add({ type: 'error', title: 'Title is required' })
    return
  }
  saving.value = true
  try {
    const data: any = { title: form.value.title, description: form.value.description, body: form.value.body, status: 'draft', created_by: adminName() }
    applyRichBody(data)
    if (editingVersionId.value) {
      await pb.collection('legal_pages').update(editingVersionId.value, data)
      toast.add({ type: 'success', title: 'Draft updated' })
    } else {
      data.slug = editSlug.value
      data.version = maxVersion(editSlug.value) + 1
      await pb.collection('legal_pages').create(data)
      toast.add({ type: 'success', title: 'Draft saved', message: 'The public page is unchanged.' })
    }
    editorOpen.value = false
    await loadData()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to save draft', message: e?.message })
  } finally {
    saving.value = false
  }
}

async function publish() {
  if (!form.value.title.trim()) {
    toast.add({ type: 'error', title: 'Title is required' })
    return
  }
  saving.value = true
  try {
    const now = new Date().toISOString()
    const by = adminName()
    let targetId = editingVersionId.value
    if (!targetId) {
      const rec = await pb.collection('legal_pages').create({
        slug: editSlug.value,
        title: form.value.title,
        description: form.value.description,
        body: form.value.body,
        status: 'draft',
        version: maxVersion(editSlug.value) + 1,
        created_by: by,
      })
      applyRichBody(rec)
      targetId = rec.id
    }
    const pubPayload: any = { status: 'published', published_at: now, published_by: by }
    if (form.value.content_json) applyRichBody(pubPayload)
    await pb.collection('legal_pages').update(targetId, pubPayload)
    const stale = versionsOf(editSlug.value).filter(v => v.status === 'published' && v.id !== targetId)
    for (const s of stale) {
      await pb.collection('legal_pages').update(s.id, { status: 'archived', archived_at: now })
    }
    toast.add({ type: 'success', title: 'Published', message: 'The public page and Last Updated date were updated.' })
    editorOpen.value = false
    await loadData()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to publish', message: e?.message })
  } finally {
    saving.value = false
  }
}

/* ---------------- history ---------------- */
function openHistory(slug: string) {
  historySlug.value = slug
  historyOpen.value = true
}

function openPreview(rec: any) {
  previewRec.value = rec
}

function openCompare(rec: any) {
  compareRec.value = rec
}

async function restore(rec: any) {
  const ok = await confirmDlg.confirm({
    title: `Restore v${rec.version}?`,
    message: 'A new draft version will be created from this version. Nothing is overwritten.',
    confirmText: 'Restore',
  })
  if (!ok) return
  try {
    const by = adminName()
    await pb.collection('legal_pages').create({
      slug: rec.slug,
      title: rec.title,
      description: rec.description,
      body: rec.body,
      status: 'draft',
      version: maxVersion(rec.slug) + 1,
      created_by: by,
    })
    toast.add({ type: 'success', title: 'Draft created from v' + rec.version, message: 'Review it, then publish when ready.' })
    await loadData()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to restore', message: e?.message })
  }
}

/* ---------------- data ---------------- */
async function loadData() {
  try {
    const res = await pb.collection('legal_pages').getList(1, 100, {
      sort: '-version',
      requestKey: 'legal-admin-list',
    })
    docs.value = res.items
  } catch {
    docs.value = []
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadData()
  pb.collection('legal_pages').subscribe('*', loadData)
})

onUnmounted(() => {
  pb.collection('legal_pages').unsubscribe('*')
})
</script>
