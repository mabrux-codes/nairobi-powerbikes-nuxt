<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Announcements"
      eyebrow="Website"
      description="Manage the premium announcement bar that sits above the navbar across the entire public website."
      live
      :actions="[{ label: 'New Announcement', icon: Plus, onClick: openCreate }]"
    />

    <!-- Master toggle -->
    <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-5">
      <div class="flex items-center gap-4">
        <span class="flex h-11 w-11 items-center justify-center rounded-xl" :class="store.masterEnabled ? 'bg-emerald-500/15 text-emerald-400' : 'bg-brand-grey/15 text-brand-grey'">
          <Megaphone class="h-5 w-5" />
        </span>
        <div>
          <p class="text-sm font-semibold text-white">Announcement Bar</p>
          <p class="text-xs text-brand-grey">Globally show or hide the announcement bar everywhere. No code changes needed.</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs font-semibold" :class="store.masterEnabled ? 'text-emerald-400' : 'text-brand-grey'">{{ store.masterEnabled ? 'Visible' : 'Hidden' }}</span>
        <button
          role="switch"
          :aria-checked="store.masterEnabled"
          :aria-label="'Master announcement toggle'"
          class="relative h-6 w-11 rounded-full transition-colors"
          :class="store.masterEnabled ? 'bg-emerald-500' : 'bg-brand-grey/30'"
          @click="toggleMaster"
        >
          <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all" :class="store.masterEnabled ? 'left-[22px]' : 'left-0.5'" />
        </button>
      </div>
    </div>

    <div v-if="!store.ready" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-5">
        <div class="h-11 w-11 rounded-xl bg-brand-grey/10" />
        <div class="mt-4 h-8 w-14 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3 w-24 rounded bg-brand-grey/10" />
      </div>
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AdminStatCard label="Published" :display="countByStatus('published')" :icon="Megaphone" icon-bg="bg-emerald-500/15" icon-color="text-emerald-400" />
      <AdminStatCard label="Scheduled" :display="countByStatus('scheduled')" :icon="CalendarClock" icon-bg="bg-sky-500/15" icon-color="text-sky-400" />
      <AdminStatCard label="Draft" :display="countByStatus('draft')" :icon="FileText" icon-bg="bg-brand-grey/15" icon-color="text-brand-grey" />
      <AdminStatCard label="Expired" :display="countByStatus('expired')" :icon="Clock" icon-bg="bg-rose-500/15" icon-color="text-rose-400" />
    </div>

    <AdminToolbar v-model:search="search" search-placeholder="Search announcements by title, message, status or priority...">
      <AdminSelect v-model="statusFilter" placeholder="All Status">
        <option v-for="s in statusOptions" :key="s" :value="s" class="bg-brand-black">{{ cap(s) }}</option>
      </AdminSelect>
      <AdminSelect v-model="priorityFilter" placeholder="All Priorities">
        <option v-for="p in priorityOptions" :key="p" :value="p" class="bg-brand-black">{{ cap(p) }}</option>
      </AdminSelect>
    </AdminToolbar>

    <AdminSkeleton v-if="!store.ready" :rows="6" variant="row" />
    <AdminEmptyState
      v-else-if="filtered.length === 0"
      :icon="Megaphone"
      title="No Announcements"
      description="Create your first announcement to power the bar at the top of the site."
    >
      <Button size="sm" @click="openCreate"><Plus class="h-4 w-4" />New Announcement</Button>
    </AdminEmptyState>

    <div v-else class="overflow-hidden rounded-2xl border border-brand-grey/15 bg-brand-black/60">
      <div class="divide-y divide-brand-grey/10">
        <div v-for="a in filtered" :key="a.id" class="flex flex-wrap items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03]">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg" :class="a.enabled ? 'bg-white/[0.04]' : 'bg-white/[0.02] opacity-50'">
            {{ a.icon || '📢' }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="flex flex-wrap items-center gap-2 text-sm font-medium text-white">
              {{ a.title }}
              <StatusChip :status="a.status" size="sm" />
              <Badge variant="outline" class="shrink-0">{{ cap(a.priority) }}</Badge>
              <Badge v-if="a.enabled" variant="secondary" class="shrink-0">Active</Badge>
              <Badge v-else variant="outline" class="shrink-0">Disabled</Badge>
            </p>
            <p class="mt-0.5 truncate text-xs text-brand-grey">{{ preview(a) }}</p>
          </div>
          <div class="hidden lg:block text-right text-xs">
            <p class="text-brand-grey">Start: <span class="text-white">{{ fmt(a.scheduledStart) || '—' }}</span></p>
            <p class="text-brand-grey">End: <span class="text-white">{{ fmt(a.scheduledEnd) || '—' }}</span></p>
          </div>
          <div class="hidden xl:block text-right text-xs">
            <p class="text-brand-grey">By <span class="text-white">{{ createdByName(a) }}</span></p>
            <p class="text-[11px] text-brand-grey/70">{{ shortDate(a.created) }}</p>
          </div>
          <button
            role="switch"
            :aria-checked="a.enabled"
            :aria-label="`${a.enabled ? 'Disable' : 'Enable'} ${a.title}`"
            class="relative h-5 w-9 shrink-0 rounded-full transition-colors"
            :class="a.enabled ? 'bg-emerald-500' : 'bg-brand-grey/30'"
            @click="toggleEnabled(a)"
          >
            <span class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all" :class="a.enabled ? 'left-[18px]' : 'left-0.5'" />
          </button>
          <AdminActionsMenu :items="actionsFor(a)" />
        </div>
      </div>
    </div>

    <AdminDrawer :open="drawerOpen" :title="editingId ? 'Edit Announcement' : 'New Announcement'" subtitle="Publish, schedule or draft an announcement for the bar" @close="closeDrawer">
      <div class="space-y-4">
        <Input v-model="form.title" label="Title" placeholder="e.g. New Arrivals This Week" />
        <Input v-model="form.icon" label="Icon (emoji, optional)" placeholder="e.g. 📢 🔥 🏍️" />
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Message</label>
          <textarea
            v-model="form.message"
            rows="4"
            class="input-field rounded-xl resize-none"
            placeholder="Your announcement text..."
          />
          <p class="mt-1.5 text-[11px] text-brand-grey/60">Supports <b>bold</b>, <i>italic</i>, <a href="#" class="text-brand-red">links</a>, emoji and simple formatting.</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Priority</label>
            <AdminSelect v-model="form.priority">
              <option v-for="p in priorityOptions" :key="p" :value="p" class="bg-brand-black">{{ cap(p) }}</option>
            </AdminSelect>
          </div>
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Status</label>
            <AdminSelect v-model="form.status">
              <option v-for="s in statusOptions" :key="s" :value="s" class="bg-brand-black">{{ cap(s) }}</option>
            </AdminSelect>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Start Date &amp; Time</label>
            <input v-model="form.scheduledStart" type="datetime-local" class="input-field" />
          </div>
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">End Date &amp; Time</label>
            <input v-model="form.scheduledEnd" type="datetime-local" class="input-field" />
          </div>
        </div>
        <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-3.5">
          <input v-model="form.enabled" type="checkbox" class="h-4 w-4 accent-brand-red" />
          <span class="text-sm text-white">Enabled</span>
          <span class="ml-auto text-xs text-brand-grey">Show on the bar (respects status)</span>
        </label>
        <label class="flex cursor-pointer items-center gap-3 rounded-xl border border-brand-grey/15 bg-white/[0.02] p-3.5">
          <input v-model="form.publishImmediately" type="checkbox" class="h-4 w-4 accent-brand-red" />
          <span class="text-sm text-white">Publish Immediately</span>
          <span class="ml-auto text-xs text-brand-grey">Override status to Published on save</span>
        </label>
        <div class="rounded-xl border border-brand-grey/15 bg-white/[0.02] p-3.5 text-xs text-brand-grey">
          <p class="flex items-center gap-2"><Info class="h-4 w-4 text-sky-400" />Scheduled announcements publish automatically when the start time arrives and expire when the end time passes — no manual intervention.</p>
        </div>
      </div>
      <template #footer>
        <Button variant="ghost" @click="closeDrawer">Cancel</Button>
        <Button :disabled="saving || !form.title.trim()" @click="saveAnnouncement">{{ saving ? 'Saving…' : 'Save Announcement' }}</Button>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import {
  Plus, Megaphone, CalendarClock, FileText, Clock, Pencil, Copy, Send, Archive, Trash2, Power, Info,
} from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useAuthStore } from '~/stores/auth'
import { useAnnouncementsStore, toLocalISO, type Announcement } from '~/stores/announcements'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Announcements - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const auth = useAuthStore()
const store = useAnnouncementsStore()

const search = ref('')
const statusFilter = ref('')
const priorityFilter = ref('')
const drawerOpen = ref(false)
const editingId = ref('')
const saving = ref(false)
const users = ref<any[]>([])

const statusOptions = ['draft', 'published', 'scheduled', 'expired', 'archived']
const priorityOptions = ['highest', 'high', 'normal', 'low']

const form = ref({
  title: '',
  message: '',
  icon: '',
  priority: 'normal',
  status: 'draft',
  enabled: true,
  publishImmediately: false,
  scheduledStart: '',
  scheduledEnd: '',
})

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return store.items.filter((a) => {
    if (q && !`${a.title} ${a.message} ${a.status} ${a.priority}`.toLowerCase().includes(q)) return false
    if (statusFilter.value && a.status !== statusFilter.value) return false
    if (priorityFilter.value && a.priority !== priorityFilter.value) return false
    return true
  })
})

function cap(s: string) { return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }
function countByStatus(s: string) { return store.items.filter(a => a.status === s).length }
function fmt(v: string) { return v ? shortDate(v) : '' }
function shortDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function preview(a: Announcement) {
  const plain = (a.message || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()
  return `${a.icon ? a.icon + ' ' : ''}${plain || a.title}`
}
function createdByName(a: Announcement) {
  const u = users.value.find(x => x.id === a.createdBy)
  return u ? (u.name || u.email) : '—'
}

function openCreate() {
  editingId.value = ''
  form.value = { title: '', message: '', icon: '', priority: 'normal', status: 'draft', enabled: true, publishImmediately: false, scheduledStart: '', scheduledEnd: '' }
  drawerOpen.value = true
}

function openEdit(a: Announcement) {
  editingId.value = a.id
  form.value = {
    title: a.title,
    message: a.message,
    icon: a.icon,
    priority: a.priority || 'normal',
    status: a.status || 'draft',
    enabled: a.enabled !== false,
    publishImmediately: !!a.publishImmediately,
    scheduledStart: toLocalISOValue(a.scheduledStart),
    scheduledEnd: toLocalISOValue(a.scheduledEnd),
  }
  drawerOpen.value = true
}

function toLocalISOValue(iso: string) {
  if (!iso) return ''
  try { return toLocalISO(new Date(iso)) } catch { return '' }
}
function fromLocalISOValue(v: string) {
  if (!v) return ''
  const d = new Date(v)
  return isNaN(d.getTime()) ? '' : d.toISOString()
}

function closeDrawer() { drawerOpen.value = false }

async function saveAnnouncement() {
  if (!form.value.title.trim()) return
  saving.value = true
  try {
    const payload: any = {
      title: form.value.title.trim(),
      message: form.value.message,
      icon: form.value.icon,
      priority: form.value.priority,
      status: form.value.status,
      enabled: form.value.enabled,
      publishImmediately: form.value.publishImmediately,
      scheduledStart: fromLocalISOValue(form.value.scheduledStart),
      scheduledEnd: fromLocalISOValue(form.value.scheduledEnd),
    }
    if (editingId.value) {
      await pb.collection('announcements').update(editingId.value, payload)
      toast.add({ type: 'success', title: 'Announcement updated' })
    } else {
      await pb.collection('announcements').create({ ...payload, createdBy: auth.user?.id })
      toast.add({ type: 'success', title: 'Announcement created' })
    }
    closeDrawer()
    await store.load()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to save', message: e?.message || e?.data?.message })
  } finally {
    saving.value = false
  }
}

function actionsFor(a: Announcement) {
  return [
    { label: 'Edit', icon: Pencil, onClick: () => openEdit(a) },
    { label: 'Duplicate', icon: Copy, onClick: () => duplicate(a) },
    ...(a.status === 'published'
      ? [{ label: 'Archive', icon: Archive, onClick: () => setStatus(a, 'archived') }]
      : [{ label: 'Publish', icon: Send, onClick: () => setStatus(a, 'published') }]),
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => confirmDelete(a) },
  ]
}

async function toggleEnabled(a: Announcement) {
  try {
    await pb.collection('announcements').update(a.id, { enabled: !a.enabled })
    toast.add({ type: 'success', title: a.enabled ? 'Announcement disabled' : 'Announcement enabled' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to toggle', message: e?.message }) }
}

async function setStatus(a: Announcement, status: string) {
  try {
    await pb.collection('announcements').update(a.id, { status })
    toast.add({ type: 'success', title: `Announcement ${status}` })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update', message: e?.message }) }
}

async function duplicate(a: Announcement) {
  try {
    await pb.collection('announcements').create({
      title: `${a.title} (copy)`,
      message: a.message,
      icon: a.icon,
      priority: a.priority,
      status: 'draft',
      enabled: false,
      publishImmediately: false,
      scheduledStart: a.scheduledStart,
      scheduledEnd: a.scheduledEnd,
      createdBy: auth.user?.id,
    })
    toast.add({ type: 'success', title: 'Duplicate created' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to duplicate', message: e?.message }) }
}

async function confirmDelete(a: Announcement) {
  const ok = await confirmDlg.confirm({ title: 'Delete Announcement', message: `Delete "${a.title}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('announcements').delete(a.id)
    toast.add({ type: 'success', title: 'Announcement deleted' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }) }
}

async function toggleMaster() {
  const next = !store.masterEnabled
  try {
    const res = await pb.collection('site_config').getList(1, 1, { filter: pb.filter('key = {:k}', { k: 'announcements_enabled' }) })
    const rec = (res.items as any[])[0]
    if (rec) await pb.collection('site_config').update(rec.id, { value: String(next) })
    else await pb.collection('site_config').create({ key: 'announcements_enabled', value: String(next), type: 'text' })
    store.masterEnabled = next
    toast.add({ type: 'success', title: next ? 'Announcement bar enabled' : 'Announcement bar disabled' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update', message: e?.message }) }
}

async function loadUsers() {
  users.value = await pb.collection('users').getFullList({ fields: 'id,name,email' }).catch(() => [])
}

onMounted(async () => {
  store.init()
  await loadUsers()
})
</script>
