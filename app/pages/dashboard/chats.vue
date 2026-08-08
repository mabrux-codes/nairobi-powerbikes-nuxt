<template>
  <div class="flex flex-col gap-4">
    <AdminPageHeader
      title="Live Chat"
      eyebrow="Operations"
      description="Real-time customer support conversations."
      live
      :actions="[
        { label: 'Refresh', icon: RefreshCw, size: 'sm', variant: 'ghost', onClick: refresh },
      ]"
    />

    <div v-if="loading" class="grid gap-4 md:grid-cols-3">
      <div class="md:col-span-1 animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-4"><div v-for="i in 6" :key="i" class="mb-3 h-14 rounded-xl bg-brand-grey/10" /></div>
      <div class="md:col-span-2 animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-6"><div class="h-6 w-1/3 rounded bg-brand-grey/10" /><div class="mt-4 h-56 rounded-xl bg-brand-grey/10" /></div>
    </div>

    <div v-else class="grid gap-4 xl:grid-cols-5 h-[calc(100vh-140px)] min-h-[520px]">
      <!-- Conversation list -->
      <div class="xl:col-span-1 rounded-2xl border border-brand-grey/15 bg-brand-black/60 overflow-hidden flex flex-col">
        <div class="border-b border-brand-grey/15 p-3">
          <div class="relative">
            <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-grey/60" />
            <input v-model="search" type="text" placeholder="Search chats…" class="h-10 w-full rounded-xl border border-brand-grey/25 bg-brand-black/70 pl-9 text-sm text-white placeholder:text-brand-grey/50 focus:border-brand-red/60 focus:outline-none focus:ring-2 focus:ring-brand-red/20" />
          </div>
          <div class="mt-2 grid grid-cols-4 gap-1.5">
            <button
              v-for="f in listFilters"
              :key="f.value"
              class="h-8 rounded-lg text-[10px] font-semibold transition-all duration-200"
              :class="listFilter === f.value ? 'bg-brand-red text-white' : 'text-brand-grey hover:text-white hover:bg-white/5'"
              @click="listFilter = f.value"
            >{{ f.label }}</button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto">
          <button
            v-for="c in filtered"
            :key="c.id"
            class="w-full flex items-start gap-3 border-b border-brand-grey/10 px-4 py-3 text-left transition-colors"
            :class="selectedId === c.id ? 'bg-brand-red/10 border-l-2 border-l-brand-red' : 'hover:bg-white/[0.03]'"
            @click="select(c.id)"
          >
            <div class="relative shrink-0">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-xs font-bold text-white">{{ initials(customerName(c)) }}</div>
              <span v-if="store.unreadFor(c) > 0" class="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-red text-[9px] font-bold text-white ring-2 ring-brand-black">{{ store.unreadFor(c) }}</span>
              <span
                class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-brand-black"
                :class="store.customerOnline(c) ? 'bg-emerald-400' : 'bg-brand-grey/50'"
                :title="store.customerOnline(c) ? 'Online' : 'Offline'"
              />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <p class="truncate text-sm font-semibold" :class="store.unreadFor(c) > 0 ? 'text-white' : 'text-brand-grey'">{{ customerName(c) }}</p>
                <span class="shrink-0 text-[10px] text-brand-grey">{{ timeAgo(c.last_message_at || c.created) }}</span>
              </div>
              <p class="truncate text-xs text-brand-grey">{{ c.subject || 'Support enquiry' }}</p>
              <p class="mt-0.5 truncate text-[11px] text-brand-grey/60">{{ preview(c) }}</p>
            </div>
            <StatusChip :status="c.status || 'waiting'" size="sm" />
          </button>
          <div v-if="filtered.length === 0" class="px-4 py-12 text-center text-sm text-brand-grey">No conversations match</div>
        </div>
      </div>

      <!-- Thread -->
      <div class="xl:col-span-3 rounded-2xl border border-brand-grey/15 bg-brand-black/60 overflow-hidden flex flex-col">
        <template v-if="selectedConv">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-brand-grey/15 bg-brand-black/80 px-5 py-4">
            <div class="flex items-center gap-3">
              <div class="relative shrink-0">
                <div class="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-sm font-bold text-white">{{ initials(customerName(selectedConv)) }}</div>
                <span
                  class="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-brand-black"
                  :class="store.customerOnline(selectedConv) ? 'bg-emerald-400' : 'bg-brand-grey/50'"
                />
              </div>
              <div>
                <p class="flex items-center gap-2 font-semibold text-white">
                  {{ customerName(selectedConv) }}
                  <span class="text-[10px] font-normal" :class="store.customerOnline(selectedConv) ? 'text-emerald-400' : 'text-brand-grey'">
                    {{ store.customerOnline(selectedConv) ? 'Online' : 'Offline' }}
                  </span>
                  <span v-if="typingVisible" class="text-[10px] font-normal text-emerald-400">typing…</span>
                </p>
                <p class="text-xs text-brand-grey">
                  {{ customerLine(selectedConv) }}
                  <span v-if="selectedConv.assigned_to" class="ml-1">· Assigned</span>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-brand-grey/25 text-brand-grey transition-colors hover:text-white hover:border-brand-red/60"
                :aria-label="profileOpen ? 'Hide customer profile' : 'Show customer profile'"
                :aria-expanded="profileOpen"
                @click="profileOpen = !profileOpen"
              >
                <User class="h-4 w-4" />
              </button>
              <StatusChip :status="selectedConv.status || 'waiting'" size="sm" />
              <AdminActionsMenu :items="detailActions" />
            </div>
          </div>

          <div v-if="readOnly" class="border-b border-amber-500/20 bg-amber-500/10 px-5 py-2 text-xs text-amber-400">
            Read-only — this conversation is handled by {{ assignedName }}. Only the assigned agent can reply.
          </div>

          <div ref="scrollRef" class="flex-1 overflow-y-auto p-5 space-y-3">
            <div v-if="!threadLoaded" class="py-6 text-center text-sm text-brand-grey">Loading conversation…</div>
            <template v-else>
              <div v-for="m in thread" :key="m.id" class="flex" :class="isMine(m) ? 'justify-end' : 'justify-start'">
                <div
                  class="max-w-[78%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                  :class="isMine(m)
                    ? 'bg-gradient-to-b from-brand-red to-red-900 text-white border border-brand-red/40'
                    : m.sender_type === 'system'
                      ? 'bg-white/[0.03] border border-brand-grey/20 text-brand-grey italic text-center'
                      : 'border border-brand-grey/15 bg-white/[0.03] text-white'"
                >
                  <span v-if="m.sender_type === 'agent'" class="mb-1 block text-[10px] font-semibold text-brand-red/90 uppercase tracking-wide">{{ agentName(m) }}</span>
                  <div v-if="m.body" class="whitespace-pre-wrap">{{ m.body }}</div>

                  <div v-if="m.attachments?.length" class="mt-2 flex max-w-full flex-col gap-2">
                    <template v-for="f in m.attachments" :key="f">
                      <a
                        v-if="isImage(f)"
                        :href="rawFileUrl(m, f)"
                        target="_blank"
                        rel="noopener"
                        class="block max-w-[240px] overflow-hidden rounded-xl border border-brand-grey/20"
                      >
                        <img :src="rawFileUrl(m, f)" :alt="f" loading="lazy" class="block w-full object-cover" />
                      </a>
                      <a
                        v-else
                        :href="downloadUrl(m, f)"
                        target="_blank"
                        rel="noopener"
                        class="flex max-w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs border dark-chip"
                      >
                        <Paperclip class="h-3.5 w-3.5 shrink-0" />
                        <span class="truncate">{{ f }}</span>
                        <Download class="h-3 w-3 shrink-0 opacity-60" />
                      </a>
                    </template>
                  </div>

                  <div class="mt-1 flex items-center justify-end gap-2 text-[10px]" :class="isMine(m) ? 'text-white/50' : 'text-brand-grey'">
                    <span>{{ bubbleTime(m.created) }}</span>
                    <span v-if="isMine(m)" class="inline-flex items-center gap-0.5">
                      <Check v-if="m.customer_read_at" class="h-3 w-3 text-sky-300" />
                      <Check v-else-if="m.delivered_at" class="h-3 w-3" />
                    </span>
                    <span v-if="!isMine(m) && m.customer_read_at" class="text-emerald-500">read</span>
                  </div>
                </div>
              </div>
              <div v-if="!thread.length" class="py-6 text-center text-sm text-brand-grey">No messages yet. Send the first reply below.</div>
            </template>
          </div>

          <!-- Composer -->
          <div v-if="readOnly" class="shrink-0 border-t border-brand-grey/15 bg-brand-black/80 px-5 py-3 text-center text-xs text-brand-grey">
            Read-only view
          </div>
          <div v-else class="shrink-0 border-t border-brand-grey/15 bg-brand-black/80 px-4 py-3">
            <div v-if="attachList.length" class="mb-2 flex flex-wrap gap-1.5">
              <div v-for="(f, i) in attachList" :key="i" class="flex items-center gap-2 rounded-lg border border-brand-grey/20 bg-white/[0.03] px-2.5 py-1 text-xs text-white">
                <Paperclip class="h-3 w-3 text-brand-grey" />
                <span class="max-w-[160px] truncate">{{ f.name }}</span>
                <span class="text-brand-grey/60">{{ formatBytes(f.size) }}</span>
                <button class="text-brand-grey hover:text-brand-red" aria-label="Remove file" @click="attachList.splice(i, 1)">
                  <X class="h-3 w-3" />
                </button>
              </div>
            </div>
            <div v-if="composerError" class="mb-2 rounded-lg border border-red-500/20 bg-brand-red/10 px-3 py-1.5 text-xs text-red-400">{{ composerError }}</div>
            <div class="flex items-end gap-2">
              <textarea
                v-model="draft"
                class="max-h-36 flex-1 resize-none rounded-xl border border-brand-grey/25 bg-brand-black/70 px-3.5 py-2.5 text-sm text-white placeholder:text-brand-grey/50 focus:border-brand-red/60 focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                rows="2"
                maxlength="5000"
                placeholder="Type a reply…"
                aria-label="Reply message"
                @keydown.enter.exact.prevent="sendReply"
                @input="onTyping"
              />
              <div class="flex shrink-0 items-center gap-2">
                <label class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-brand-grey/25 text-brand-grey transition-colors hover:text-white hover:border-brand-red/60" title="Attach files">
                  <Paperclip class="h-4 w-4" />
                  <input type="file" class="hidden" :accept="acceptedAttrs" multiple @change="onPickFiles" />
                </label>
                <Button :loading="store.sending" :disabled="!draft.trim() && !attachList.length" @click="sendReply">
                  <Send class="h-4 w-4" />Send
                </Button>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="flex flex-1 flex-col items-center justify-center p-10 text-center">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-grey/15 bg-white/[0.03]">
            <MessageSquare class="h-7 w-7 text-brand-grey/50" />
          </div>
          <p class="mt-4 font-display text-lg tracking-display text-brand-grey">Select a conversation</p>
          <p class="mt-1 text-sm text-brand-grey/60">New guest chats and customer conversations appear in real time.</p>
        </div>
      </div>

      <!-- Customer profile panel (desktop column) -->
      <div class="hidden xl:block xl:col-span-1">
        <div class="rounded-2xl border border-brand-grey/15 bg-brand-black/60 overflow-hidden flex flex-col h-full">
          <div class="flex items-center justify-between border-b border-brand-grey/15 px-4 py-3">
            <p class="text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Customer Profile</p>
          </div>
          <div class="overflow-y-auto p-4">
            <ChatProfilePanel :conv="selectedConv" @transfer="openTransfer" />
          </div>
        </div>
      </div>
    </div>

    <!-- Profile drawer (mobile / tablet) -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="profileOpen && !isDesktop" class="fixed inset-0 z-[140] lg:hidden" role="dialog" aria-modal="true" :aria-label="'Customer profile'">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="profileOpen = false" />
          <div class="absolute bottom-0 inset-x-0 max-h-[75dvh] overflow-y-auto rounded-t-2xl border border-brand-grey/20 bg-brand-black/95 p-5 shadow-2xl shadow-black/60">
            <div class="mx-auto mb-4 h-1 w-10 rounded-full bg-brand-grey/30" />
            <div class="flex items-center justify-between">
              <p class="text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Customer Profile</p>
              <button class="text-brand-grey/60 hover:text-white" aria-label="Close profile" @click="profileOpen = false">
                <X class="h-4 w-4" />
              </button>
            </div>
            <div class="mt-3">
              <ChatProfilePanel :conv="selectedConv" @transfer="openTransfer" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Transfer modal -->
    <AppModal
      :open="transferOpen"
      :title="'Transfer Conversation'"
      :message="'Choose an online agent to hand this conversation to.'"
      icon-type="info"
      @close="transferOpen = false"
    >
      <div v-if="transferLoading" class="py-8 text-center text-sm text-brand-grey">
        <span class="inline-block h-5 w-5 animate-spin rounded-full border-2 border-brand-grey/40 border-t-brand-red align-middle" />
        Loading agents…
      </div>
      <div v-else-if="transferAgents.length === 0" class="py-8 text-center text-sm text-brand-grey">No online agents available right now.</div>
      <div v-else class="flex max-h-80 flex-col gap-2 overflow-y-auto">
        <button
          v-for="a in transferAgents"
          :key="a.id"
          class="flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-200"
          :class="transferTarget === a.id ? 'border-brand-red bg-brand-red/10' : 'border-brand-grey/20 hover:border-brand-red/40 hover:bg-white/[0.03]'"
          @click="transferTarget = a.id"
        >
          <div class="relative shrink-0">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-xs font-bold text-white">{{ initials(a.name) }}</div>
            <span class="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-brand-black bg-emerald-400" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-white">{{ a.name }}</p>
            <p class="text-[11px] text-brand-grey">{{ a.role }} · {{ a.workload }} active</p>
          </div>
          <span class="flex items-center gap-1 text-[10px] text-emerald-400"><span class="h-1.5 w-1.5 rounded-full bg-emerald-400" />Online</span>
        </button>
      </div>
      <div v-if="transferError" class="mt-2 rounded-lg border border-red-500/20 bg-brand-red/10 px-3 py-1.5 text-xs text-red-400">{{ transferError }}</div>
      <div class="mt-4 flex items-center justify-end gap-2">
        <Button variant="ghost" size="sm" @click="transferOpen = false">Cancel</Button>
        <Button size="sm" :loading="transferSaving" :disabled="!transferTarget" @click="doTransfer">
          <ArrowLeftRight class="h-4 w-4" />Confirm Transfer
        </Button>
      </div>
    </AppModal>
  </div>
</template>

<script setup lang="ts">
import { Search, MessageSquare, Send, Paperclip, Download, X, Check, RefreshCw, CheckCircle2, RotateCcw, User, ArrowLeftRight } from 'lucide-vue-next'
import { useChatStore } from '~/stores/chat'
import { useAuthStore } from '~/stores/auth'
import { getPB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { isChatImage, validateChatFiles, formatBytes, CHAT_ACCEPTED_TYPES } from '~/composables/useChatFiles'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Live Chat - Nairobi Powerbikes' })

const store = useChatStore()
const auth = useAuthStore()
const pb = getPB()
const toast = useToast()
const confirmDlg = useConfirm()

const route = useRoute()
const search = ref('')
const listFilter = ref('all')
const draft = ref('')
const attachList = ref<File[]>([])
const composerError = ref('')
const scrollRef = ref<HTMLElement | null>(null)
const profileOpen = ref(false)
const transferOpen = ref(false)
const transferLoading = ref(false)
const transferSaving = ref(false)
const transferTarget = ref<string | null>(null)
const transferAgents = ref<any[]>([])
const transferError = ref('')
let typingTimer: ReturnType<typeof setTimeout> | null = null
let lastTypingSentAt = 0

const isDesktop = ref(false)
function checkDesktop() { isDesktop.value = window.innerWidth >= 1280 }

const acceptedAttrs = CHAT_ACCEPTED_TYPES.join(',')
const selectedId = computed(() => store.selectedId)
const selectedConv = computed(() => store.selectedConv)
const loading = computed(() => !store.ready)

const readOnly = computed(() => {
  const c = selectedConv.value
  const me = auth.user?.id
  return !!(c?.assigned_to && c.assigned_to !== me && c.status !== 'resolved' && c.status !== 'closed')
})

const assignedName = computed(() => {
  const c = selectedConv.value
  return c?.expand?.assigned_to?.name || (c?.assigned_to ? 'another agent' : '')
})

const listFilters = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Live', value: 'live' },
  { label: 'Done', value: 'resolved' },
]

const thread = computed<any[]>(() => {
  const id = store.selectedId
  if (!id) return []
  return store.messagesByConv[id] || []
})

const threadLoaded = computed(() => !!store.selectedId)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return store.conversations.filter((c: any) => {
    if (q && !`${customerName(c)} ${c.guest_email} ${c.guest_phone} ${c.subject} ${preview(c)}`.toLowerCase().includes(q)) return false
    if (listFilter.value === 'new' && store.unreadFor(c) === 0) return false
    if (listFilter.value === 'resolved' && (c.status || '') !== 'resolved') return false
    if (listFilter.value === 'live' && !['waiting', 'assigned', 'active'].includes(c.status)) return false
    return true
  })
})

const detailActions = computed(() => {
  const actions: any[] = [
    { label: selectedConv.value?.status === 'resolved' ? 'Reopen' : 'Mark Resolved', icon: selectedConv.value?.status === 'resolved' ? RotateCcw : CheckCircle2, onClick: toggleResolved },
  ]
  if (!readOnly.value) {
    actions.push({ label: 'Transfer', icon: ArrowLeftRight, onClick: openTransfer })
  }
  return actions
})

const typingVisible = computed(() => {
  const id = store.selectedId
  if (!id) return false
  const t = store.typing[id]
  return !!t && Date.now() - t.at < 6000
})

function customerName(c: any) {
  return c?.expand?.customer?.name || c?.guest_name || c?.expand?.customer?.email || 'Guest'
}

function customerEmail(c: any) {
  return c?.expand?.customer?.email || c?.guest_email || ''
}

function customerPhone(c: any) {
  return c?.expand?.customer?.phone || ''
}

function customerId(c: any) {
  if (c?.customer) return c.customer
  return c?.guest_email ? 'Guest' : '—'
}

function accountStatus(c: any) {
  const s = c?.expand?.customer?.status
  if (!s) return 'Guest'
  return s === 'inactive' ? 'Inactive' : 'Active'
}

function joinedDate(c: any) {
  const d = c?.expand?.customer?.created
  return d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
}

function lastSeen(c: any) {
  if (store.customerOnline(c)) return 'Online now'
  const d = c?.customer_last_seen
  return d ? `Seen ${timeAgo(d)} ago` : '—'
}

function prevConversations(c: any) {
  if (!c?.customer) return '—'
  return store.conversations.filter(x => x.customer === c.customer).length
}

function preview(c: any) {
  if (c.last_message_preview) return c.last_message_preview
  return ((c.subject || '') + '…').slice(0, 60)
}

function formatLine(c: any) {
  return customerEmail(c) || '—'
}

function customerLine(c: any) {
  const parts = [formatLine(c)]
  if (c.guest_phone || customerPhone(c)) parts.push(c.guest_phone || customerPhone(c))
  return parts.join(' · ')
}

function initials(name: string) {
  return (name || '?').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
}

function timeAgo(d?: string) {
  if (!d) return ''
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return mins < 1 ? 'now' : `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

function bubbleTime(d: string) {
  return new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function isMine(m: ChatMessage) {
  return m.sender_type === 'agent'
}

function agentName(m: ChatMessage) {
  return m.expand?.sender?.name || 'Support'
}

function isImage(f: string) {
  return /\.(jpe?g|png|gif|webp)$/i.test(f)
}

function rawFileUrl(m: ChatMessage, f: string) {
  return pb.files.getURL(m, f)
}

async function downloadUrl(m: ChatMessage, f: string) {
  const url = await store.attachmentUrl(m.conversation, m.id, f, true)
  return url || rawFileUrl(m, f)
}

async function select(id: string) {
  await store.select(id)
  await nextTick(scrollToBottom)
}

function scrollToBottom() {
  const el = scrollRef.value
  if (el) el.scrollTop = el.scrollHeight
}

async function sendReply() {
  const id = store.selectedId
  if (!id || readOnly.value) return
  const body = draft.value.trim()
  if (!body && attachList.value.length === 0) return
  const v = validateChatFiles(attachList.value)
  if (!v.ok) { composerError.value = v.errors.join(' '); return }
  composerError.value = ''
  try {
    await store.sendMessage(id, body, attachList.value)
    draft.value = ''
    attachList.value = []
    store.sendTyping(id, false)
    await nextTick(scrollToBottom)
  } catch (e: any) {
    composerError.value = e?.message || 'Failed to send reply.'
  }
}

function onTyping() {
  const id = store.selectedId
  if (!id || readOnly.value) return
  const now = Date.now()
  if (now - lastTypingSentAt < 1400) return
  lastTypingSentAt = now
  store.sendTyping(id, true)
  if (typingTimer) clearTimeout(typingTimer)
  typingTimer = setTimeout(() => store.sendTyping(id, false), 2200)
}

function onPickFiles(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  input.value = ''
  const v = validateChatFiles(files)
  composerError.value = v.ok ? '' : v.errors.join(' ')
  attachList.value = [...attachList.value, ...files]
}

async function toggleResolved() {
  const c = selectedConv.value
  if (!c) return
  const next = c.status === 'resolved' ? 'active' : 'resolved'
  const ok = next === 'resolved' ? await confirmDlg.confirm({
    title: 'Resolve conversation',
    message: `Mark this chat with ${customerName(c)} as resolved?`,
    confirmText: 'Resolve',
    confirmType: 'info',
  }) : true
  if (!ok) return
  try {
    await store.setStatus(c.id, next)
    toast.add({ type: 'success', title: next === 'resolved' ? 'Conversation resolved' : 'Conversation reopened' })
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Update failed', message: e?.message })
  }
}

async function openTransfer() {
  const c = selectedConv.value
  if (!c) return
  transferError.value = ''
  transferTarget.value = null
  transferOpen.value = true
  transferLoading.value = true
  transferAgents.value = []
  try {
    const items = await store.fetchStaff()
    transferAgents.value = items.filter((a: any) => a.online && a.id !== auth.user?.id)
  } catch (e: any) {
    transferError.value = e?.message || 'Failed to load agents.'
  } finally {
    transferLoading.value = false
  }
}

async function doTransfer() {
  const c = selectedConv.value
  if (!c || !transferTarget.value) return
  transferSaving.value = true
  transferError.value = ''
  try {
    await store.transferConversation(c.id, transferTarget.value)
    transferOpen.value = false
    toast.add({ type: 'success', title: 'Conversation transferred', message: 'The new agent has been notified.' })
  } catch (e: any) {
    transferError.value = e?.message || 'Transfer failed.'
  } finally {
    transferSaving.value = false
  }
}

async function refresh() {
  await store.refresh()
  toast.add({ type: 'info', title: 'Chat list refreshed' })
}

async function statusTick() {
  const t = store.typing
  for (const k of Object.keys(t)) {
    if (Date.now() - t[k].at > 6000) delete t[k]
  }
}

onMounted(async () => {
  checkDesktop()
  window.addEventListener('resize', checkDesktop)
  await store.ensureActive()
  const queried = route.query.conv as string | undefined
  if (queried) await select(queried)
  else if (store.conversations[0]) await select(store.conversations[0].id)
  setInterval(statusTick, 2000)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkDesktop)
  store.release()
})
</script>

<style scoped>
.drawer-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.drawer-leave-active { transition: all 0.2s ease-in; }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from > div:last-child, .drawer-leave-to > div:last-child { transform: translateY(100%); }
.drawer-enter-to > div:last-child, .drawer-leave-from > div:last-child { transform: translateY(0); }
</style>
