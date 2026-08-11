<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Email Center"
      eyebrow="Communications"
      description="Queue, logs, templates and subscribers — every email the dealership sends, in one place."
      live
      :actions="[{ label: 'Send Test Email', icon: Send, onClick: openTest }]"
    />

    <!-- Stat cards -->
    <div v-if="!store.ready" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
      <div v-for="i in 6" :key="i" class="animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-5">
        <div class="h-10 w-10 rounded-xl bg-brand-grey/10" />
        <div class="mt-4 h-8 w-14 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3 w-24 rounded bg-brand-grey/10" />
      </div>
    </div>
    <div v-else class="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
      <AdminStatCard label="Sent Today" :display="fmtStat(sentToday)" :icon="CheckCircle2" icon-bg="bg-emerald-500/15" icon-color="text-emerald-400" />
      <AdminStatCard label="Queued" :display="fmtStat(queuedCount)" :icon="Clock3" icon-bg="bg-sky-500/15" icon-color="text-sky-400" />
      <AdminStatCard label="Failed" :display="fmtStat(failedCount)" :icon="XCircle" icon-bg="bg-rose-500/15" icon-color="text-rose-400" />
      <AdminStatCard label="Scheduled" :display="fmtStat(scheduledCount)" :icon="CalendarClock" icon-bg="bg-amber-500/15" icon-color="text-amber-400" />
      <AdminStatCard label="Subscribers" :display="fmtStat(store.subscribers.length)" :icon="Users" icon-bg="bg-violet-500/15" icon-color="text-violet-400" />
      <AdminStatCard label="Templates" :display="fmtStat(store.templates.length)" :icon="FileText" icon-bg="bg-brand-grey/15" icon-color="text-brand-grey" />
    </div>

    <!-- Tabs -->
    <div class="flex flex-wrap items-center gap-1 rounded-xl border border-brand-grey/15 bg-brand-black/80 p-1.5 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="h-9 shrink-0 rounded-lg px-4 text-sm font-semibold transition-colors"
        :class="activeTab === tab.key ? 'bg-brand-red text-white' : 'text-brand-grey hover:text-white'"
        @click="activeTab = tab.key"
      >{{ tab.label }}</button>
    </div>

    <!-- ============ OVERVIEW ============ -->
    <div v-if="activeTab === 'overview'">
      <div class="rounded-2xl border border-brand-grey/15 bg-brand-black/80 p-6">
        <h2 class="font-display text-lg tracking-display text-white">Recent emails</h2>
        <p class="mt-0.5 text-xs text-brand-grey">Latest sends across all categories</p>
        <div class="mt-4 overflow-x-auto rounded-xl border border-brand-grey/15">
          <table class="w-full min-w-[760px] text-left text-sm">
            <thead>
              <tr class="border-b border-brand-grey/15 text-[11px] font-display tracking-wider text-brand-grey uppercase">
                <th class="px-4 py-3">Recipient</th>
                <th class="px-4 py-3">Subject</th>
                <th class="px-4 py-3">Category</th>
                <th class="px-4 py-3">Status</th>
                <th class="px-4 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="l in recentLogs" :key="l.id" class="border-b border-brand-grey/10 transition-colors hover:bg-white/[0.03]">
                <td class="px-4 py-3 max-w-[200px] truncate text-white">{{ l.recipient }}</td>
                <td class="px-4 py-3 max-w-[280px] truncate text-brand-grey">{{ l.subject }}</td>
                <td class="px-4 py-3"><StatusChip :status="l.category" size="sm" /></td>
                <td class="px-4 py-3"><StatusChip :status="l.status" size="sm" /></td>
                <td class="px-4 py-3 text-xs text-brand-grey text-right">{{ shortDate(l.sentAt || l.created) }}</td>
              </tr>
              <tr v-if="recentLogs.length === 0">
                <td colspan="5" class="px-4 py-10 text-center text-sm text-brand-grey">No emails sent yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ============ QUEUE ============ -->
    <div v-if="activeTab === 'queue'">
      <AdminToolbar v-model:search="queueSearch" search-placeholder="Search by recipient, template or status...">
        <AdminSelect v-model="queueStatusFilter" placeholder="All Status">
          <option v-for="s in queueStatuses" :key="s" :value="s" class="bg-brand-black">{{ cap(s) }}</option>
        </AdminSelect>
      </AdminToolbar>
      <AdminSkeleton v-if="!store.ready" :rows="6" variant="row" />
      <AdminEmptyState v-else-if="filteredQueue.length === 0" :icon="Inbox" title="Queue empty" description="No emails are waiting to be sent." />
      <div v-else class="mt-4 overflow-x-auto rounded-xl border border-brand-grey/15 bg-brand-black/80">
        <table class="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr class="border-b border-brand-grey/15 text-[11px] font-display tracking-wider text-brand-grey uppercase">
              <th class="px-4 py-3">Recipient</th>
              <th class="px-4 py-3">Template</th>
              <th class="px-4 py-3">Category</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3 text-right">Attempts</th>
              <th class="px-4 py-3">Error</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="q in filteredQueue" :key="q.id" class="border-b border-brand-grey/10 transition-colors hover:bg-white/[0.03]">
              <td class="px-4 py-3">
                <p class="text-white font-medium truncate max-w-[220px]">{{ q.recipient }}</p>
                <p v-if="q.recipientName" class="text-xs text-brand-grey/60">{{ q.recipientName }}</p>
              </td>
              <td class="px-4 py-3 text-brand-grey">{{ q.template || '—' }}</td>
              <td class="px-4 py-3"><StatusChip :status="q.category" size="sm" /></td>
              <td class="px-4 py-3"><StatusChip :status="q.status" size="sm" /></td>
              <td class="px-4 py-3 text-right text-white">{{ q.attempts }}</td>
              <td class="px-4 py-3 max-w-[220px] truncate text-xs text-rose-400/80">{{ q.lastError || '—' }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center justify-end gap-1.5">
                  <button v-if="q.status === 'failed' || q.status === 'queued'" class="h-8 w-8 rounded-lg border border-emerald-500/30 text-emerald-400 transition-colors hover:bg-emerald-500/10" :aria-label="`Retry ${q.id}`" title="Retry" @click="retry(q)"><RefreshCw class="h-4 w-4 mx-auto" /></button>
                  <button class="h-8 w-8 rounded-lg border border-rose-500/30 text-rose-400 transition-colors hover:bg-rose-500/10" :aria-label="`Cancel ${q.id}`" title="Cancel" @click="cancel(q)"><X class="h-4 w-4 mx-auto" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ============ LOGS ============ -->
    <div v-if="activeTab === 'logs'">
      <AdminToolbar v-model:search="logSearch" search-placeholder="Search by recipient, subject, template...">
        <AdminSelect v-model="logStatusFilter" placeholder="All Status">
          <option v-for="s in logStatuses" :key="s" :value="s" class="bg-brand-black">{{ cap(s) }}</option>
        </AdminSelect>
        <AdminSelect v-model="logCategoryFilter" placeholder="All Categories">
          <option v-for="c in logCategories" :key="c" :value="c" class="bg-brand-black">{{ cap(c) }}</option>
        </AdminSelect>
      </AdminToolbar>
      <AdminSkeleton v-if="!store.ready" :rows="6" variant="row" />
      <AdminEmptyState v-else-if="filteredLogs.length === 0" :icon="FileText" title="No logs" description="Email activity will appear here." />
      <div v-else class="mt-4 overflow-x-auto rounded-xl border border-brand-grey/15 bg-brand-black/80">
        <table class="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr class="border-b border-brand-grey/15 text-[11px] font-display tracking-wider text-brand-grey uppercase">
              <th class="px-4 py-3">Recipient</th>
              <th class="px-4 py-3">Subject</th>
              <th class="px-4 py-3">Template</th>
              <th class="px-4 py-3">Category</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3 text-right">Attempts</th>
              <th class="px-4 py-3">Error</th>
              <th class="px-4 py-3 text-right">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="l in filteredLogs" :key="l.id" class="border-b border-brand-grey/10 transition-colors hover:bg-white/[0.03]">
              <td class="px-4 py-3 max-w-[200px] truncate text-white">{{ l.recipient }}</td>
              <td class="px-4 py-3 max-w-[260px] truncate text-brand-grey">{{ l.subject }}</td>
              <td class="px-4 py-3 text-brand-grey">{{ l.template || '—' }}</td>
              <td class="px-4 py-3"><StatusChip :status="l.category" size="sm" /></td>
              <td class="px-4 py-3"><StatusChip :status="l.status" size="sm" /></td>
              <td class="px-4 py-3 text-right text-white">{{ l.attempts }}</td>
              <td class="px-4 py-3 max-w-[200px] truncate text-xs text-rose-400/80">{{ l.error || '—' }}</td>
              <td class="px-4 py-3 text-xs text-brand-grey text-right">{{ shortDate(l.sentAt || l.failedAt || l.created) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ============ TEMPLATES ============ -->
    <div v-if="activeTab === 'templates'">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-brand-grey"><span class="font-semibold text-white">{{ store.templates.length }}</span> email templates</p>
        <Button size="sm" @click="openTemplate()"><Plus class="h-4 w-4" />New Template</Button>
      </div>
      <div v-if="store.templates.length === 0" class="mt-4 rounded-2xl border border-dashed border-brand-grey/20 bg-brand-black/40 p-14 text-center">
        <p class="font-display text-xl tracking-display text-brand-grey">No templates yet</p>
        <p class="mt-2 text-sm text-brand-grey/60">Templates are resolved by key — sending still works with inline subject/body fallbacks.</p>
      </div>
      <div v-else class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="t in store.templates" :key="t.id" class="rounded-2xl border border-brand-grey/15 bg-brand-black/80 p-5">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="text-sm font-semibold text-white truncate">{{ t.name }}</p>
              <p class="text-[11px] text-brand-red font-mono truncate">{{ t.key || '—' }}</p>
            </div>
            <span v-if="t.enabled === false || t.active === false" class="rounded-full bg-brand-grey/15 px-2 py-0.5 text-[10px] font-semibold text-brand-grey">Disabled</span>
            <span v-else class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">Active</span>
          </div>
          <p class="mt-3 text-sm text-brand-grey line-clamp-2">{{ t.subject }}</p>
          <p class="mt-1 text-[11px] text-brand-grey/60">{{ t.category || 'general' }}</p>
          <div class="mt-4 flex items-center gap-2">
            <Button variant="ghost" size="sm" @click="openTemplate(t)">Edit</Button>
            <Button variant="ghost" size="sm" @click="sendTestFromTemplate(t)">Test</Button>
            <Button variant="danger" size="sm" :disabled="deleting" @click="deleteTemplate(t)">Delete</Button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ SUBSCRIBERS ============ -->
    <div v-if="activeTab === 'subscribers'">
      <AdminToolbar v-model:search="subSearch" search-placeholder="Search by email or name...">
        <AdminSelect v-model="subStatusFilter" placeholder="All Status">
          <option v-for="s in subStatuses" :key="s" :value="s" class="bg-brand-black">{{ cap(s) }}</option>
        </AdminSelect>
      </AdminToolbar>
      <div v-if="store.subscribers.length === 0" class="mt-4 rounded-2xl border border-dashed border-brand-grey/20 bg-brand-black/40 p-14 text-center">
        <p class="font-display text-xl tracking-display text-brand-grey">No subscribers yet</p>
        <p class="mt-2 text-sm text-brand-grey/60">Newsletter subscribers will appear here.</p>
      </div>
      <div v-else class="mt-4 overflow-x-auto rounded-xl border border-brand-grey/15 bg-brand-black/80">
        <table class="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr class="border-b border-brand-grey/15 text-[11px] font-display tracking-wider text-brand-grey uppercase">
              <th class="px-4 py-3">Email</th>
              <th class="px-4 py-3">Name</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3">Consent</th>
              <th class="px-4 py-3">Source</th>
              <th class="px-4 py-3 text-right">Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in filteredSubs" :key="s.id" class="border-b border-brand-grey/10 transition-colors hover:bg-white/[0.03]">
              <td class="px-4 py-3 text-white">{{ s.email }}</td>
              <td class="px-4 py-3 text-brand-grey">{{ s.name || s.firstName || '—' }}</td>
              <td class="px-4 py-3"><StatusChip :status="s.status || 'subscribed'" size="sm" /></td>
              <td class="px-4 py-3">
                <span v-if="s.marketingConsent" class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400"><Check class="h-3 w-3" />Opted in</span>
                <span v-else class="text-brand-grey/60 text-xs">No</span>
              </td>
              <td class="px-4 py-3 text-brand-grey">{{ s.source || '—' }}</td>
              <td class="px-4 py-3 text-xs text-brand-grey text-right">{{ shortDate(s.created) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Test email drawer -->
    <AdminDrawer :open="testOpen" title="Send Test Email" subtitle="Preview a template or send raw content to any address" @close="testOpen = false">
      <div class="space-y-4">
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Recipient</label>
          <Input v-model="testForm.to" type="email" placeholder="you@example.com" />
        </div>
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Template (optional)</label>
          <AdminSelect v-model="testForm.template">
            <option value="" class="bg-brand-black">— No template (raw subject/body) —</option>
            <option v-for="t in store.templates" :key="t.id" :value="t.key || t.id" class="bg-brand-black">{{ t.name }} ({{ t.key || t.id }})</option>
          </AdminSelect>
        </div>
        <Input v-model="testForm.subject" label="Subject" placeholder="Test email subject" />
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Body (HTML)</label>
          <textarea v-model="testForm.body" rows="6" class="input-field rounded-xl resize-y font-mono text-xs" placeholder="<p>Hello {{firstName}}</p>" />
        </div>
      </div>
      <template #footer>
        <Button variant="ghost" @click="testOpen = false">Cancel</Button>
        <Button :disabled="sending || !testForm.to" @click="sendTest">{{ sending ? 'Sending…' : 'Send Test Email' }}</Button>
      </template>
    </AdminDrawer>

    <!-- Template editor drawer -->
    <AdminDrawer :open="templateOpen" :title="editingTemplate ? 'Edit Template' : 'New Template'" subtitle="Templates are resolved by key across all email flows" @close="templateOpen = false">
      <div class="space-y-4">
        <Input v-model="templateForm.name" label="Name" placeholder="Booking Received" />
        <Input v-model="templateForm.key" label="Key" placeholder="booking_received" />
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Category</label>
          <AdminSelect v-model="templateForm.category">
            <option v-for="c in templateCategories" :key="c" :value="c" class="bg-brand-black">{{ cap(c) }}</option>
          </AdminSelect>
        </div>
        <Input v-model="templateForm.subject" label="Subject" placeholder="Your booking is {{bookingStatus}}" />
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">HTML body</label>
          <textarea v-model="templateForm.html" rows="10" class="input-field rounded-xl resize-y font-mono text-xs" placeholder="<p>Hello {{firstName}},</p>..." />
        </div>
        <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-3.5">
          <input v-model="templateForm.enabled" type="checkbox" class="h-4 w-4 accent-brand-red" />
          <span class="text-sm text-white">Enabled</span>
        </label>
      </div>
      <template #footer>
        <Button variant="ghost" @click="templateOpen = false">Cancel</Button>
        <Button :disabled="savingTpl || !templateForm.name" @click="saveTemplate">{{ savingTpl ? 'Saving…' : 'Save Template' }}</Button>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import {
  Send, CheckCircle2, XCircle, Clock3, CalendarClock, Users, FileText, Inbox,
  RefreshCw, X, Plus, Check,
} from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useEmailStore, type EmailTemplateItem } from '~/stores/email'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Email Center - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const store = useEmailStore()

const activeTab = ref('overview')
const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'queue', label: 'Queue' },
  { key: 'logs', label: 'Logs' },
  { key: 'templates', label: 'Templates' },
  { key: 'subscribers', label: 'Subscribers' },
]

const queueSearch = ref('')
const queueStatusFilter = ref('')
const logSearch = ref('')
const logStatusFilter = ref('')
const logCategoryFilter = ref('')
const subSearch = ref('')
const subStatusFilter = ref('')

const queueStatuses = ['queued', 'processing', 'sent', 'failed', 'cancelled']
const logStatuses = ['queued', 'sent', 'failed']
const subStatuses = ['subscribed', 'unsubscribed', 'bounced', 'complained']
const logCategories = ['authentication', 'bookings', 'sales', 'payments', 'inventory', 'chat', 'marketing', 'system', 'admin', 'test']

const sending = ref(false)
const deleting = ref(false)
const savingTpl = ref(false)
const testOpen = ref(false)
const templateOpen = ref(false)
const editingTemplate = ref<EmailTemplateItem | null>(null)

const testForm = ref({ to: '', template: '', subject: '', body: '' })
const templateForm = ref({ name: '', key: '', category: 'system', subject: '', html: '', text: '', enabled: true })
const templateCategories = ['authentication', 'bookings', 'sales', 'payments', 'inventory', 'chat', 'marketing', 'system', 'admin']

const sentToday = computed(() => {
  const start = new Date().setHours(0, 0, 0, 0)
  return store.logs.filter(l => {
    const d = new Date(l.sentAt || l.created).getTime()
    return l.status === 'sent' && !isNaN(d) && d >= start
  }).length
})
const queuedCount = computed(() => store.queue.filter(q => q.status === 'queued').length)
const failedCount = computed(() => store.queue.filter(q => q.status === 'failed').length)
const scheduledCount = computed(() => store.queue.filter(q => q.status === 'queued' && q.scheduledFor).length)

const recentLogs = computed(() => store.logs.slice().sort((a, b) => (b.sentAt || b.created || '').localeCompare(a.sentAt || a.created || '')).slice(0, 12))

const filteredQueue = computed(() => {
  const q = queueSearch.value.toLowerCase()
  return store.queue.filter(it => {
    if (queueStatusFilter.value && it.status !== queueStatusFilter.value) return false
    if (q && !`${it.recipient} ${it.template} ${it.status} ${it.category}`.toLowerCase().includes(q)) return false
    return true
  })
})

const filteredLogs = computed(() => {
  const q = logSearch.value.toLowerCase()
  return store.logs.filter(l => {
    if (logStatusFilter.value && l.status !== logStatusFilter.value) return false
    if (logCategoryFilter.value && l.category !== logCategoryFilter.value) return false
    if (q && !`${l.recipient} ${l.subject} ${l.template} ${l.category}`.toLowerCase().includes(q)) return false
    return true
  })
})

const filteredSubs = computed(() => {
  const q = subSearch.value.toLowerCase()
  return store.subscribers.filter(s => {
    if (subStatusFilter.value && (s.status || 'subscribed') !== subStatusFilter.value) return false
    if (q && !`${s.email} ${s.name} ${s.firstName}`.toLowerCase().includes(q)) return false
    return true
  })
})

function cap(s: string) { return (s || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }
function fmtStat(n: number) { return n.toLocaleString() }
function shortDate(v: string) {
  if (!v) return '—'
  const d = new Date(v)
  if (isNaN(d.getTime())) return String(v).slice(0, 10)
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function openTest() {
  testForm.value = { to: '', template: '', subject: '', body: '' }
  testOpen.value = true
}

function sendTestFromTemplate(t: EmailTemplateItem) {
  testForm.value = { to: '', template: t.key || t.id, subject: t.subject || '', body: t.html || t.body || '' }
  testOpen.value = true
}

async function sendTest() {
  if (!testForm.value.to) return
  sending.value = true
  try {
    await pb.send('/api/email/test', {
      body: {
        to: testForm.value.to,
        template: testForm.value.template,
        subject: testForm.value.subject,
        body: testForm.value.body,
        vars: { customerName: 'Test Customer' },
      },
    })
    toast.add({ type: 'success', title: 'Test email sent' })
    testOpen.value = false
    store.refresh()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to send', message: e?.message })
  } finally {
    sending.value = false
  }
}

async function retry(q: any) {
  try {
    await pb.send('/api/email/retry', { body: { id: q.id } })
    toast.add({ type: 'success', title: 'Email queued for retry' })
    store.refresh()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Retry failed', message: e?.message })
  }
}

async function cancel(q: any) {
  const ok = await confirmDlg.confirm({ title: 'Cancel email', message: `Cancel the email to ${q.recipient}?`, confirmText: 'Cancel', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('email_queue').update(q.id, { status: 'cancelled' })
    toast.add({ type: 'success', title: 'Email cancelled' })
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to cancel', message: e?.message })
  }
}

function openTemplate(t?: EmailTemplateItem) {
  editingTemplate.value = t || null
  templateForm.value = t
    ? { name: t.name, key: t.key || '', category: t.category || 'system', subject: t.subject || '', html: t.html || t.body || '', text: t.text || '', enabled: t.enabled !== false }
    : { name: '', key: '', category: 'system', subject: '', html: '', text: '', enabled: true }
  templateOpen.value = true
}

async function saveTemplate() {
  if (!templateForm.value.name) return
  savingTpl.value = true
  try {
    const payload = {
      name: templateForm.value.name,
      key: templateForm.value.key || templateForm.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
      category: templateForm.value.category,
      subject: templateForm.value.subject,
      html: templateForm.value.html,
      text: templateForm.value.text,
      enabled: templateForm.value.enabled,
    }
    if (editingTemplate.value) {
      await pb.collection('email_templates').update(editingTemplate.value.id, payload)
      toast.add({ type: 'success', title: 'Template updated' })
    } else {
      await pb.collection('email_templates').create(payload)
      toast.add({ type: 'success', title: 'Template created' })
    }
    templateOpen.value = false
    store.refresh()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to save', message: e?.message || e?.data?.message })
  } finally {
    savingTpl.value = false
  }
}

async function deleteTemplate(t: EmailTemplateItem) {
  const ok = await confirmDlg.confirm({ title: 'Delete template', message: `Delete "${t.name}"?`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  deleting.value = true
  try {
    await pb.collection('email_templates').delete(t.id)
    toast.add({ type: 'success', title: 'Template deleted' })
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to delete', message: e?.message })
  } finally {
    deleting.value = false
  }
}

onMounted(() => { store.ensureActive() })
onUnmounted(() => { store.release() })
</script>
