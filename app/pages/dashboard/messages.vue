<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Messaging Center"
      eyebrow="Operations"
      description="Every customer conversation, in one place."
      live
    />

    <div v-if="storeLoading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-5">
        <div class="h-11 w-11 rounded-xl bg-brand-grey/10" />
        <div class="mt-4 h-8 w-14 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3 w-24 rounded bg-brand-grey/10" />
      </div>
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AdminStatCard label="All Messages" :display="contacts.length" :icon="MessageSquare" icon-bg="bg-brand-red/15" icon-color="text-brand-red" />
      <AdminStatCard label="Unread" :display="unreadCount" :icon="MailOpen" icon-bg="bg-amber-500/15" icon-color="text-amber-400" />
      <AdminStatCard label="Resolved" :display="resolvedCount" :icon="CheckCircle2" icon-bg="bg-emerald-500/15" icon-color="text-emerald-400" />
      <AdminStatCard label="Needs Reply" :display="needsReply" :icon="Clock" icon-bg="bg-sky-500/15" icon-color="text-sky-400" />
    </div>

    <div v-if="loading" class="grid gap-4 md:grid-cols-3">
      <div class="md:col-span-1 animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-4"><div v-for="i in 5" :key="i" class="mb-3 h-14 rounded-xl bg-brand-grey/10" /></div>
      <div class="md:col-span-2 animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-6"><div class="h-6 w-1/3 rounded bg-brand-grey/10" /><div class="mt-4 h-40 rounded-xl bg-brand-grey/10" /></div>
    </div>

    <div v-else class="grid gap-4 md:grid-cols-3">
      <!-- Conversation list -->
      <div class="md:col-span-1 rounded-2xl border border-brand-grey/15 bg-brand-black/60 overflow-hidden flex flex-col">
        <div class="border-b border-brand-grey/15 p-3">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-grey/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input v-model="search" type="text" placeholder="Search conversations..." class="h-10 w-full rounded-xl border border-brand-grey/25 bg-brand-black/70 pl-9 text-sm text-white placeholder:text-brand-grey/50 focus:border-brand-red/60 focus:outline-none focus:ring-2 focus:ring-brand-red/20" />
          </div>
          <div class="mt-2 flex items-center gap-2">
            <button
              v-for="f in listFilters"
              :key="f.value"
              class="flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-all duration-200"
              :class="listFilter === f.value ? 'bg-brand-red text-white' : 'text-brand-grey hover:text-white hover:bg-white/5'"
              @click="listFilter = f.value"
            >{{ f.label }}</button>
          </div>
        </div>
        <div class="flex-1 overflow-y-auto max-h-[60vh] md:max-h-[70vh]">
          <button
            v-for="c in filtered"
            :key="c.id"
            class="w-full flex items-start gap-3 border-b border-brand-grey/10 px-4 py-3 text-left transition-colors"
            :class="selectedId === c.id ? 'bg-brand-red/10 border-l-2 border-l-brand-red' : 'hover:bg-white/[0.03]'"
            @click="select(c)"
          >
            <div class="relative shrink-0">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-xs font-bold text-white">{{ initials(c.name || c.email) }}</div>
              <span v-if="!c.read" class="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-brand-red ring-2 ring-brand-black" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <p class="truncate text-sm font-semibold" :class="!c.read ? 'text-white' : 'text-brand-grey'">{{ c.name || 'Anonymous' }}</p>
                <span class="shrink-0 text-[10px] text-brand-grey">{{ timeAgo(c.created) }}</span>
              </div>
              <p class="truncate text-xs text-brand-grey">{{ c.subject || c.category || 'General' }}</p>
              <p class="mt-0.5 truncate text-[11px] text-brand-grey/60">{{ c.message }}</p>
            </div>
          </button>
          <div v-if="filtered.length === 0" class="px-4 py-10 text-center text-sm text-brand-grey">No conversations found</div>
        </div>
      </div>

      <!-- Conversation view -->
      <div class="md:col-span-2 rounded-2xl border border-brand-grey/15 bg-brand-black/60 overflow-hidden flex flex-col">
        <template v-if="selected">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-brand-grey/15 bg-brand-black/80 px-5 py-4">
            <div class="flex items-center gap-3">
              <div class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-sm font-bold text-white">{{ initials(selected.name || selected.email) }}</div>
              <div>
                <p class="font-semibold text-white">{{ selected.name || 'Anonymous' }}</p>
                <p class="text-xs text-brand-grey">{{ selected.email }} <span v-if="selected.phone">· {{ selected.phone }}</span></p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <StatusChip :status="selected.status || 'new'" size="sm" />
              <AdminActionsMenu :items="detailActions" />
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-5 space-y-4 max-h-[70vh]">
            <div class="flex items-center gap-2 text-xs text-brand-grey">
              <Badge variant="outline">{{ selected.category || 'General' }}</Badge>
              <span>{{ fullDate(selected.created) }}</span>
            </div>
            <div class="rounded-2xl border border-brand-grey/15 bg-white/[0.02] p-5">
              <p class="text-sm leading-relaxed text-white whitespace-pre-wrap">{{ selected.message }}</p>
            </div>

            <!-- Customer profile panel -->
            <div class="rounded-2xl border border-brand-grey/15 bg-white/[0.02] p-4">
              <p class="mb-3 text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase flex items-center gap-2"><User class="h-3.5 w-3.5 text-brand-red" />Customer Profile</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div class="flex items-center gap-2.5 text-brand-grey"><Mail class="h-4 w-4 shrink-0 text-brand-red" /><a :href="`mailto:${selected.email}`" class="truncate hover:text-white">{{ selected.email }}</a></div>
                <div v-if="selected.phone" class="flex items-center gap-2.5 text-brand-grey"><Phone class="h-4 w-4 shrink-0 text-brand-red" /><span>{{ selected.phone }}</span></div>
                <div class="flex items-center gap-2.5 text-brand-grey"><CalendarDays class="h-4 w-4 shrink-0 text-brand-red" /><span>Joined {{ fullDate(selected.created) }}</span></div>
                <div class="flex items-center gap-2.5 text-brand-grey"><Tag class="h-4 w-4 shrink-0 text-brand-red" /><span>{{ selected.category || 'General' }}</span></div>
              </div>
            </div>
          </div>

          <div class="shrink-0 border-t border-brand-grey/15 bg-brand-black/80 px-5 py-4">
            <div class="flex items-center gap-2">
              <input v-model="replyDraft" type="text" placeholder="Type a reply…" class="h-10 flex-1 rounded-xl border border-brand-grey/25 bg-brand-black/70 px-3.5 text-sm text-white placeholder:text-brand-grey/50 focus:border-brand-red/60 focus:outline-none focus:ring-2 focus:ring-brand-red/20" />
              <a
                v-if="selected.email"
                :href="`mailto:${selected.email}?subject=${encodeURIComponent('Re: ' + (selected.subject || 'Your enquiry'))}&body=${encodeURIComponent(replyDraft)}`"
                class="inline-flex h-10 items-center gap-1.5 rounded-xl bg-gradient-to-b from-brand-red to-red-700 px-4 text-xs font-semibold text-white shadow-md shadow-brand-red/20 hover:shadow-lg hover:shadow-brand-red/30 transition-all duration-200"
              >
                <Send class="h-4 w-4" />Reply
              </a>
            </div>
          </div>
        </template>

        <div v-else class="flex flex-1 flex-col items-center justify-center p-10 text-center">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03] border border-brand-grey/15">
            <MessageSquare class="h-7 w-7 text-brand-grey/50" />
          </div>
          <p class="mt-4 font-display text-lg tracking-display text-brand-grey">Select a conversation</p>
          <p class="mt-1 text-sm text-brand-grey/60">Choose a message from the list to view the full thread.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageSquare, MailOpen, CheckCircle2, Clock, User, Mail, Phone, CalendarDays, Tag, Send, Trash2, Check } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useAdminDataStore } from '~/stores/adminData'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Messages - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const store = useAdminDataStore()

const loading = ref(true)
const search = ref('')
const listFilter = ref('all')
const selectedId = ref<string | null>(null)
const replyDraft = ref('')

const contacts = computed(() => store.contacts)
const storeLoading = computed(() => !store.ready)

const unreadCount = computed(() => contacts.value.filter(c => !c.read).length)
const resolvedCount = computed(() => contacts.value.filter(c => c.status === 'resolved').length)
const needsReply = computed(() => contacts.value.filter(c => !c.read || (c.status || 'new') === 'new').length)

const listFilters = [
  { label: 'All', value: 'all' },
  { label: 'Unread', value: 'unread' },
  { label: 'Resolved', value: 'resolved' },
]

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return contacts.value.filter(c => {
    if (q && !`${c.name} ${c.email} ${c.subject} ${c.message}`.toLowerCase().includes(q)) return false
    if (listFilter.value === 'unread' && c.read) return false
    if (listFilter.value === 'resolved' && c.status !== 'resolved') return false
    return true
  })
})

const selected = computed(() => contacts.value.find(c => c.id === selectedId.value) || null)

const detailActions = computed(() => [
  { label: (selected.value?.status || 'new') === 'resolved' ? 'Reopen' : 'Mark Resolved', icon: Check, onClick: () => toggleResolved() },
  { label: 'Delete', icon: Trash2, danger: true, onClick: () => confirmDelete(selected.value) },
])

function initials(name: string) { return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() }

function timeAgo(d: string) {
  if (!d) return ''
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return mins < 1 ? 'now' : `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

function fullDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function select(c: any) {
  selectedId.value = c.id
  replyDraft.value = ''
  if (!c.read) {
    try {
      await pb.collection('contacts').update(c.id, { read: true })
      c.read = true
    } catch { /* ignore */ }
  }
}

async function toggleResolved() {
  const c = selected.value
  if (!c) return
  const next = c.status === 'resolved' ? 'new' : 'resolved'
  try {
    await pb.collection('contacts').update(c.id, { status: next, read: true })
    c.status = next
    toast.add({ type: 'success', title: next === 'resolved' ? 'Marked as resolved' : 'Reopened' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update', message: e?.message }) }
}

async function confirmDelete(c: any) {
  if (!c) return
  const ok = await confirmDlg.confirm({ title: 'Delete Message', message: `Delete the message from ${c.name || c.email}? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('contacts').delete(c.id)
    selectedId.value = null
    toast.add({ type: 'success', title: 'Message deleted' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }) }
}

onMounted(async () => {
  store.ensureActive()
  loading.value = false
})

onUnmounted(() => store.release())
</script>
