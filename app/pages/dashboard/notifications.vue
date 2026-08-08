<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Notifications"
      eyebrow="Operations"
      description="Reach customers, admins or everyone — each recipient gets their own private notification."
      live
      :actions="[{ label: 'Send Notification', icon: Send, onClick: openSend }]"
    />

    <div v-if="!store.ready" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-5">
        <div class="h-11 w-11 rounded-xl bg-brand-grey/10" />
        <div class="mt-4 h-8 w-14 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3 w-24 rounded bg-brand-grey/10" />
      </div>
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AdminStatCard label="Inbox" :display="store.notifications.length" :icon="Bell" icon-bg="bg-brand-red/15" icon-color="text-brand-red" />
      <AdminStatCard label="Unread" :display="store.unreadCount" :icon="MailOpen" icon-bg="bg-amber-500/15" icon-color="text-amber-400" />
      <AdminStatCard label="Broadcasts" :display="broadcastCount" :icon="Megaphone" icon-bg="bg-sky-500/15" icon-color="text-sky-400" />
      <AdminStatCard label="Announcements" :display="globalCount" :icon="Users" icon-bg="bg-emerald-500/15" icon-color="text-emerald-400" />
    </div>

    <AdminToolbar v-model:search="search" search-placeholder="Search notifications...">
      <AdminSelect v-model="typeFilter" placeholder="All Types">
        <option v-for="t in typeOptions" :key="t" :value="t" class="bg-brand-black">{{ cap(t) }}</option>
      </AdminSelect>
      <AdminSelect v-model="statusFilter" placeholder="All Status">
        <option value="unread" class="bg-brand-black">Unread</option>
        <option value="read" class="bg-brand-black">Read</option>
      </AdminSelect>
    </AdminToolbar>

    <AdminSkeleton v-if="!store.ready" :rows="6" variant="row" />
    <AdminEmptyState
      v-else-if="filtered.length === 0"
      :icon="Bell"
      title="No Notifications"
      description="Your inbox is empty. Broadcasts targeted at admins will land here."
    >
      <Button size="sm" @click="openSend"><Send class="h-4 w-4" />Send Notification</Button>
    </AdminEmptyState>

    <div v-else class="overflow-hidden rounded-2xl border border-brand-grey/15 bg-brand-black/60">
      <div class="divide-y divide-brand-grey/10">
        <div v-for="n in filtered" :key="n.id" class="flex flex-wrap items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03]">
          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" :class="typeBg(n.type)">
            <component :is="typeIcon(n.type)" class="h-4 w-4" :class="typeColor(n.type)" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="flex flex-wrap items-center gap-2 text-sm font-medium text-white">
              {{ n.title }}
              <Badge variant="outline">{{ n.type }}</Badge>
              <Badge v-if="n.broadcast" variant="secondary">{{ audienceLabel(n) }}</Badge>
            </p>
            <p class="mt-0.5 truncate text-xs text-brand-grey">{{ n.message }}</p>
          </div>
          <div class="hidden lg:block text-right">
            <p class="text-xs text-brand-grey">Sent {{ shortDate(n.createdAt) }}</p>
          </div>
          <StatusChip :status="n.read ? 'read' : 'unread'" size="sm" />
          <AdminActionsMenu :items="actionsFor(n)" />
        </div>
      </div>
    </div>

    <AdminDrawer :open="drawerOpen" title="Send Notification" subtitle="Deliver a private notification to its recipients" @close="closeSend">
      <div class="space-y-4">
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Audience</label>
          <AdminSelect v-model="audience">
            <option value="user" class="bg-brand-black">Individual User</option>
            <option v-for="r in roleOptions" :key="r" :value="'role:' + r" class="bg-brand-black">All {{ cap(r) }}s</option>
            <option value="global" class="bg-brand-black">Everyone (Global Announcement)</option>
          </AdminSelect>
        </div>
        <div v-if="audience === 'user'">
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Recipient</label>
          <AdminSelect v-model="notifForm.user" placeholder="Select a user">
            <option v-for="u in users" :key="u.id" :value="u.id" class="bg-brand-black">{{ u.name || u.email }} ({{ u.role }})</option>
          </AdminSelect>
        </div>
        <Input v-model="notifForm.title" label="Title" placeholder="e.g. Service Reminder" />
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Type</label>
          <AdminSelect v-model="notifForm.type">
            <option v-for="t in typeOptions" :key="t" :value="t" class="bg-brand-black">{{ cap(t) }}</option>
          </AdminSelect>
        </div>
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Message</label>
          <textarea v-model="notifForm.message" rows="4" class="input-field rounded-xl resize-none" placeholder="Notification message..." />
        </div>
        <Input v-model="notifForm.link" label="Deep Link (optional)" placeholder="/dashboard/my-bookings" />
        <div class="rounded-xl border border-brand-grey/15 bg-white/[0.02] p-3.5 text-xs text-brand-grey">
          <p class="flex items-center gap-2"><Info class="h-4 w-4 text-sky-400" />Each recipient receives a private copy, so read status is tracked per user. They see it instantly via the notification bell and a real-time toast.</p>
        </div>
      </div>
      <template #footer>
        <Button variant="ghost" @click="closeSend">Cancel</Button>
        <Button :disabled="sending || !targetValid" @click="sendNotification">{{ sending ? 'Sending…' : 'Send Notification' }}</Button>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import { Bell, Send, Megaphone, Users, MailOpen, Info, Trash2, Check, MessageSquare, Wrench, CalendarCheck2, Sparkles } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useNotificationStore, type NotificationItem } from '~/stores/notifications'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Notifications - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const store = useNotificationStore()

const sending = ref(false)
const drawerOpen = ref(false)
const search = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const users = ref<any[]>([])
const audience = ref('user')
const notifForm = ref({ title: '', type: 'system', user: '', message: '', link: '' })

const typeOptions = ['system', 'booking', 'service', 'offer', 'message', 'test_ride', 'ecommerce']
const roleOptions = ['admin', 'customer', 'staff']

const broadcastCount = computed(() => store.notifications.filter(n => n.broadcast).length)
const globalCount = computed(() => store.notifications.filter(n => n.broadcast && !n.role).length)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return store.notifications.filter(n => {
    if (q && !`${n.title} ${n.message} ${n.type}`.toLowerCase().includes(q)) return false
    if (typeFilter.value && n.type !== typeFilter.value) return false
    if (statusFilter.value === 'unread' && n.read) return false
    if (statusFilter.value === 'read' && !n.read) return false
    return true
  })
})

const targetValid = computed(() => {
  if (audience.value === 'user') return !!notifForm.value.user && !!notifForm.value.title.trim()
  return !!notifForm.value.title.trim()
})

const ICONS: Record<string, any> = { system: Bell, booking: CalendarCheck2, service: Wrench, offer: Sparkles, message: MessageSquare, test_ride: CalendarCheck2, ecommerce: Sparkles }
const BG: Record<string, string> = { system: 'bg-brand-grey/15', booking: 'bg-sky-500/15', service: 'bg-emerald-500/15', offer: 'bg-amber-500/15', message: 'bg-violet-500/15', test_ride: 'bg-amber-500/15', ecommerce: 'bg-emerald-500/15' }
const COLOR: Record<string, string> = { system: 'text-brand-grey', booking: 'text-sky-400', service: 'text-emerald-400', offer: 'text-amber-400', message: 'text-violet-400', test_ride: 'text-amber-400', ecommerce: 'text-emerald-400' }

function typeIcon(t: string) { return ICONS[t] || Bell }
function typeBg(t: string) { return BG[t] || 'bg-brand-grey/15' }
function typeColor(t: string) { return COLOR[t] || 'text-brand-grey' }

function cap(s: string) { return s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) }

function audienceLabel(n: NotificationItem) {
  if (!n.broadcast) return 'Personal'
  if (n.role) return `${cap(n.role)} Broadcast`
  return 'Global'
}

function actionsFor(n: NotificationItem) {
  return [
    { label: n.read ? 'Mark Unread' : 'Mark Read', icon: Check, onClick: () => toggleRead(n) },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => confirmDelete(n) },
  ]
}

function openSend() {
  notifForm.value = { title: '', type: 'system', user: '', message: '', link: '' }
  audience.value = 'user'
  drawerOpen.value = true
}

function closeSend() { drawerOpen.value = false }

async function sendNotification() {
  if (!targetValid.value) return
  sending.value = true
  try {
    const payload: any = {
      title: notifForm.value.title,
      type: notifForm.value.type,
      message: notifForm.value.message,
      link: notifForm.value.link,
    }
    if (audience.value === 'user') {
      payload.audience = 'user'
      payload.user = notifForm.value.user
    } else if (audience.value.startsWith('role:')) {
      payload.audience = 'role'
      payload.role = audience.value.slice(5)
    } else {
      payload.audience = 'global'
    }
    const res = await pb.send('/api/notifications/send', { method: 'POST', body: payload })
    const delivered = res?.delivered ?? 1
    const label = audience.value === 'user' ? 'user' : audience.value.startsWith('role:') ? `${audience.value.slice(5)}s` : 'all users'
    toast.add({ type: 'success', title: 'Notification sent', message: `Delivered to ${delivered} ${label}` })
    closeSend()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to send', message: e?.message || e?.data?.message || 'Please try again.' })
  } finally {
    sending.value = false
  }
}

async function toggleRead(n: NotificationItem) {
  await store.setRead(n.id, !n.read)
}

async function confirmDelete(n: NotificationItem) {
  const ok = await confirmDlg.confirm({ title: 'Delete Notification', message: `Delete "${n.title}"?`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  await store.remove(n.id)
}

function shortDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

async function loadUsers() {
  users.value = await pb.collection('users').getFullList({ sort: 'name' }).catch(() => [])
}

onMounted(async () => {
  store.init()
  await loadUsers()
})
</script>
