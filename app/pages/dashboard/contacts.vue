<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Customer Enquiries"
      eyebrow="Business"
      description="Track and respond to every customer inquiry across contact forms and finance leads."
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
      <AdminStatCard label="Total Inquiries" :display="contacts.length" :icon="Inbox" icon-bg="bg-brand-red/15" icon-color="text-brand-red" />
      <AdminStatCard label="New" :display="newCount" :icon="MailOpen" icon-bg="bg-amber-500/15" icon-color="text-amber-400" />
      <AdminStatCard label="Assigned" :display="assignedCount" :icon="UserCheck" icon-bg="bg-sky-500/15" icon-color="text-sky-400" />
      <AdminStatCard label="Resolved" :display="resolvedCount" :icon="CheckCircle2" icon-bg="bg-emerald-500/15" icon-color="text-emerald-400" />
    </div>

    <AdminToolbar v-model:search="search" search-placeholder="Search by customer, subject, email...">
      <AdminSelect v-model="statusFilter" placeholder="All Status">
        <option value="new" class="bg-brand-black">New</option>
        <option value="contacted" class="bg-brand-black">Contacted</option>
        <option value="resolved" class="bg-brand-black">Resolved</option>
      </AdminSelect>
      <AdminSelect v-model="assignFilter" placeholder="All Assignments">
        <option value="assigned" class="bg-brand-black">Assigned</option>
        <option value="unassigned" class="bg-brand-black">Unassigned</option>
      </AdminSelect>
      <AdminSelect v-model="priorityFilter" placeholder="All Priority">
        <option value="high" class="bg-brand-black">High</option>
        <option value="medium" class="bg-brand-black">Medium</option>
        <option value="low" class="bg-brand-black">Low</option>
      </AdminSelect>
    </AdminToolbar>

    <AdminSkeleton v-if="loading" :rows="6" variant="row" />
    <AdminEmptyState
      v-else-if="filtered.length === 0"
      :icon="Inbox"
      title="No Inquiries Found"
      description="New customer messages will appear here in real time."
    />

    <template v-else>
      <!-- Mobile: stacked cards -->
      <div class="space-y-3 md:hidden">
        <AdminCard v-for="c in filtered" :key="c.id" class="cursor-pointer" @click="openDetail(c)">
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-xs font-bold text-white">
                {{ initials(c.name || c.email) }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-white">{{ c.name || 'Anonymous' }}</p>
                <p class="truncate text-xs text-brand-grey">{{ c.subject || c.category || 'General' }}</p>
              </div>
            </div>
            <StatusChip :status="c.status || 'new'" size="sm" />
          </div>
          <p class="mt-3 line-clamp-2 text-xs leading-relaxed text-brand-grey/80">{{ c.message }}</p>
          <div class="mt-3 flex items-center justify-between text-[11px] text-brand-grey">
            <span>{{ shortDate(c.created) }}</span>
            <span class="font-semibold" :class="priorityClass(priorityOf(c))">{{ priorityOf(c) }} priority</span>
          </div>
        </AdminCard>
      </div>

      <!-- Desktop: table -->
      <div class="hidden md:block overflow-hidden rounded-2xl border border-brand-grey/15 bg-brand-black/60">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-brand-grey/15 bg-brand-black/80">
            <tr>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Customer</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Subject</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Message</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Date</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Priority</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Status</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Assigned</th>
              <th class="px-4 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-grey/10">
            <tr v-for="c in filtered" :key="c.id" class="cursor-pointer transition-colors hover:bg-white/[0.03]" @click="openDetail(c)">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-[11px] font-bold text-white">{{ initials(c.name || c.email) }}</div>
                  <div class="min-w-0">
                    <p class="truncate font-medium text-white">{{ c.name || 'Anonymous' }}</p>
                    <p class="truncate text-[11px] text-brand-grey">{{ c.email }}</p>
                  </div>
                </div>
              </td>
              <td class="max-w-[180px] px-4 py-3 text-brand-grey"><span class="truncate block">{{ c.subject || c.category || 'General' }}</span></td>
              <td class="max-w-[240px] px-4 py-3"><p class="truncate text-brand-grey/80">{{ c.message }}</p></td>
              <td class="whitespace-nowrap px-4 py-3 text-brand-grey">{{ shortDate(c.created) }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1 text-xs font-semibold" :class="priorityClass(priorityOf(c))">
                  <span class="h-1.5 w-1.5 rounded-full" :class="priorityDot(priorityOf(c))" />{{ priorityOf(c) }}
                </span>
              </td>
              <td class="px-4 py-3"><StatusChip :status="c.status || 'new'" size="sm" /></td>
              <td class="px-4 py-3 text-brand-grey">{{ staffName(c.assigned_to) }}</td>
              <td class="px-4 py-3 text-right" @click.stop><AdminActionsMenu :items="actionsFor(c)" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <AdminDrawer :open="detailOpen" :title="detail?.subject || 'Inquiry'" :subtitle="detail ? `${detail.name || 'Anonymous'} · ${detail.email || ''}` : ''" @close="closeDetail">
      <template v-if="detail">
        <div class="mb-5 flex flex-wrap items-center gap-2">
          <StatusChip :status="detail.status || 'new'" size="sm" />
          <span class="inline-flex items-center gap-1 text-xs font-semibold" :class="priorityClass(priorityOf(detail))">
            <span class="h-1.5 w-1.5 rounded-full" :class="priorityDot(priorityOf(detail))" />{{ priorityOf(detail) }} priority
          </span>
          <Badge variant="outline">{{ detail.category || 'General' }}</Badge>
          <span class="text-xs text-brand-grey">{{ shortDate(detail.created) }}</span>
        </div>

        <div class="rounded-2xl border border-brand-grey/15 bg-white/[0.02] p-4">
          <p class="text-sm leading-relaxed text-white whitespace-pre-wrap">{{ detail.message }}</p>
        </div>

        <div v-if="detail.phone" class="mt-4 flex items-center gap-2 text-sm text-brand-grey">
          <Phone class="h-4 w-4 text-brand-red" />{{ detail.phone }}
        </div>

        <div class="mt-6 space-y-4">
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Status</label>
            <AdminSelect v-model="updateForm.status" placeholder="Select status">
              <option value="new" class="bg-brand-black">New</option>
              <option value="contacted" class="bg-brand-black">Contacted</option>
              <option value="resolved" class="bg-brand-black">Resolved</option>
            </AdminSelect>
          </div>
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Assign to Staff</label>
            <AdminSelect v-model="updateForm.assigned_to" placeholder="Unassigned">
              <option v-for="s in staff" :key="s.id" :value="s.id" class="bg-brand-black">{{ s.name || s.email }}</option>
            </AdminSelect>
          </div>
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Internal Note / Reply</label>
            <textarea v-model="replyText" rows="4" class="input-field rounded-xl resize-none" placeholder="Write a reply (sent via email)…" />
          </div>
        </div>
      </template>
      <template #footer>
        <Button variant="ghost" :disabled="saving" @click="markResolved">Mark Resolved</Button>
        <a
          v-if="detail?.email"
          :href="`mailto:${detail.email}?subject=${encodeURIComponent('Re: ' + (detail.subject || 'Your enquiry'))}&body=${encodeURIComponent(replyText)}`"
          class="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gradient-to-b from-brand-red to-red-700 px-4 text-xs font-semibold text-white shadow-md shadow-brand-red/20 hover:shadow-lg hover:shadow-brand-red/30 transition-all duration-200"
        >
          <MailPlus class="h-4 w-4" />Reply via Email
        </a>
        <Button :disabled="saving" @click="saveUpdate">{{ saving ? 'Saving…' : 'Save Changes' }}</Button>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import { Inbox, MailOpen, UserCheck, CheckCircle2, Phone, MailPlus, Pencil, Trash2, Check, UserPlus } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useAdminDataStore } from '~/stores/adminData'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Contacts - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const store = useAdminDataStore()

const loading = ref(true)
const saving = ref(false)
const search = ref('')
const statusFilter = ref('')
const assignFilter = ref('')
const priorityFilter = ref('')
const detailOpen = ref(false)
const detail = ref<any>(null)
const replyText = ref('')
const updateForm = ref({ status: 'new', assigned_to: '' })
const staff = ref<any[]>([])

const contacts = computed(() => store.contacts)
const storeLoading = computed(() => !store.ready)

const newCount = computed(() => contacts.value.filter(c => (c.status || 'new') === 'new').length)
const resolvedCount = computed(() => contacts.value.filter(c => c.status === 'resolved').length)
const assignedCount = computed(() => contacts.value.filter(c => c.assigned_to).length)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return contacts.value.filter(c => {
    if (q && !`${c.name} ${c.email} ${c.subject} ${c.category} ${c.message}`.toLowerCase().includes(q)) return false
    if (statusFilter.value && (c.status || 'new') !== statusFilter.value) return false
    if (assignFilter.value === 'assigned' && !c.assigned_to) return false
    if (assignFilter.value === 'unassigned' && c.assigned_to) return false
    if (priorityFilter.value && priorityOf(c) !== priorityFilter.value) return false
    return true
  })
})

function priorityOf(c: any) {
  const status = c.status || 'new'
  if (status === 'new' && !c.read) return 'high'
  if (status === 'contacted') return 'medium'
  return 'low'
}

function priorityClass(p: string) { return p === 'high' ? 'text-rose-400' : p === 'medium' ? 'text-amber-400' : 'text-emerald-400' }
function priorityDot(p: string) { return p === 'high' ? 'bg-rose-400' : p === 'medium' ? 'bg-amber-400' : 'bg-emerald-400' }

function initials(name: string) { return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() }

function staffName(id: string) {
  if (!id) return 'Unassigned'
  const s = staff.value.find(x => x.id === id)
  return s ? (s.name || s.email) : 'Unknown'
}

function actionsFor(c: any) {
  return [
    { label: 'Assign', icon: UserPlus, onClick: () => { openDetail(c); updateForm.value.assigned_to = c.assigned_to || '' } },
    { label: 'Mark Resolved', icon: Check, onClick: () => setStatus(c, 'resolved') },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => confirmDelete(c) },
  ]
}

function openDetail(c: any) {
  detail.value = c
  updateForm.value = { status: c.status || 'new', assigned_to: c.assigned_to || '' }
  replyText.value = ''
  detailOpen.value = true
}

function closeDetail() { detailOpen.value = false }

async function saveUpdate() {
  if (!detail.value) return
  saving.value = true
  try {
    await pb.collection('contacts').update(detail.value.id, {
      status: updateForm.value.status,
      assigned_to: updateForm.value.assigned_to,
      read: true,
    })
    detail.value.status = updateForm.value.status
    detail.value.assigned_to = updateForm.value.assigned_to
    toast.add({ type: 'success', title: 'Inquiry updated' })
    closeDetail()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update', message: e?.message }) }
  finally { saving.value = false }
}

async function markResolved() {
  if (!detail.value) return
  saving.value = true
  try {
    await pb.collection('contacts').update(detail.value.id, { status: 'resolved', read: true })
    detail.value.status = 'resolved'
    toast.add({ type: 'success', title: 'Marked as resolved' })
    closeDetail()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update', message: e?.message }) }
  finally { saving.value = false }
}

async function setStatus(c: any, status: string) {
  try {
    await pb.collection('contacts').update(c.id, { status, read: true })
    c.status = status
    toast.add({ type: 'success', title: `Marked as ${status}` })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update', message: e?.message }) }
}

async function confirmDelete(c: any) {
  const ok = await confirmDlg.confirm({ title: 'Delete Inquiry', message: `Delete the inquiry from ${c.name || c.email}? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('contacts').delete(c.id)
    toast.add({ type: 'success', title: 'Inquiry deleted' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }) }
}

function shortDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  store.ensureActive()
  pb.collection('users').getFullList({ filter: 'role != "customer"' }).then((r: any) => { staff.value = r }).catch(() => {})
  loading.value = false
})

onUnmounted(() => store.release())
</script>
