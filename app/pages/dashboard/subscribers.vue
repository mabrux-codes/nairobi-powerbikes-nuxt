<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Newsletter Subscribers"
      eyebrow="Business"
      description="Manage your email list, exports and subscriber engagement."
      live
      :actions="[{ label: 'Export CSV', icon: Download, onClick: exportCSV }]"
    />

    <div v-if="storeLoading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-5">
        <div class="h-11 w-11 rounded-xl bg-brand-grey/10" />
        <div class="mt-4 h-8 w-14 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3 w-24 rounded bg-brand-grey/10" />
      </div>
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AdminStatCard label="Total Subscribers" :display="subscribers.length" :icon="Users" icon-bg="bg-brand-red/15" icon-color="text-brand-red" />
      <AdminStatCard label="Active" :display="activeCount" :icon="MailCheck" icon-bg="bg-emerald-500/15" icon-color="text-emerald-400" />
      <AdminStatCard label="Unsubscribed" :display="inactiveCount" :icon="UserMinus" icon-bg="bg-brand-grey/15" icon-color="text-brand-grey" />
      <AdminStatCard label="This Month" :display="thisMonth" :icon="CalendarPlus" icon-bg="bg-sky-500/15" icon-color="text-sky-400" />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <AdminToolbar v-model:search="search" search-placeholder="Search by email or name...">
        <AdminSelect v-model="statusFilter" placeholder="All Status">
          <option value="active" class="bg-brand-black">Active</option>
          <option value="inactive" class="bg-brand-black">Unsubscribed</option>
        </AdminSelect>
      </AdminToolbar>
      <Button v-if="selected.length" variant="danger" size="sm" :disabled="deleting" @click="bulkDelete">
        <Trash2 class="h-4 w-4" />Delete {{ selected.length }} selected
      </Button>
    </div>

    <AdminSkeleton v-if="loading" :rows="6" variant="row" />
    <AdminEmptyState
      v-else-if="filtered.length === 0"
      :icon="Users"
      title="No Subscribers Found"
      description="Subscribers appear in real time when customers join the newsletter."
    />

    <template v-else>
      <!-- Mobile cards -->
      <div class="space-y-3 md:hidden">
        <AdminCard v-for="s in filtered" :key="s.id" class="flex flex-col">
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              class="h-4 w-4 rounded border-brand-grey/40 bg-brand-black accent-brand-red"
              :checked="selected.includes(s.id)"
              @change="toggleSelect(s.id)"
            />
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-xs font-bold text-white">{{ initials(s.email) }}</div>
            <div class="min-w-0 flex-1">
              <p class="truncate font-semibold text-white">{{ s.name || s.email }}</p>
              <p class="truncate text-xs text-brand-grey">{{ s.email }}</p>
            </div>
            <StatusChip :status="s.active !== false ? 'active' : 'inactive'" size="sm" />
          </div>
          <div class="mt-3 flex items-center justify-between border-t border-brand-grey/10 pt-3 text-xs text-brand-grey">
            <span>Subscribed {{ shortDate(s.created) }}</span>
            <button class="font-semibold text-brand-red" @click="toggleActive(s)">{{ s.active !== false ? 'Unsubscribe' : 'Resubscribe' }}</button>
          </div>
        </AdminCard>
      </div>

      <!-- Desktop table -->
      <div class="hidden md:block overflow-hidden rounded-2xl border border-brand-grey/15 bg-brand-black/60">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-brand-grey/15 bg-brand-black/80">
            <tr>
              <th class="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-brand-grey/40 bg-brand-black accent-brand-red"
                  :checked="filtered.length > 0 && selected.length === filtered.length"
                  @change="toggleAll"
                />
              </th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Subscriber</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Subscribed Date</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Source</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Status</th>
              <th class="px-4 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-grey/10">
            <tr v-for="s in filtered" :key="s.id" class="transition-colors hover:bg-white/[0.03]">
              <td class="px-4 py-3">
                <input
                  type="checkbox"
                  class="h-4 w-4 rounded border-brand-grey/40 bg-brand-black accent-brand-red"
                  :checked="selected.includes(s.id)"
                  @change="toggleSelect(s.id)"
                />
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-[11px] font-bold text-white">{{ initials(s.email) }}</div>
                  <div class="min-w-0">
                    <p class="truncate font-medium text-white">{{ s.name || '—' }}</p>
                    <p class="truncate text-[11px] text-brand-grey">{{ s.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-brand-grey">{{ shortDate(s.created) }}</td>
              <td class="px-4 py-3"><Badge variant="outline">Website</Badge></td>
              <td class="px-4 py-3"><StatusChip :status="s.active !== false ? 'active' : 'inactive'" size="sm" /></td>
              <td class="px-4 py-3 text-right">
                <AdminActionsMenu :items="actionsFor(s)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <AdminPagination
      v-if="allFiltered.length > perPage"
      :page="page"
      :total-pages="totalPages"
      :total="allFiltered.length"
      :page-size="perPage"
      @update:page="page = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { Users, MailCheck, UserMinus, CalendarPlus, Download, Trash2, Power, Mail } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useAdminDataStore } from '~/stores/adminData'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Subscribers - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const store = useAdminDataStore()

const loading = ref(true)
const deleting = ref(false)
const search = ref('')
const statusFilter = ref('')
const selected = ref<string[]>([])
const page = ref(1)
const perPage = 10

const subscribers = computed(() => store.subscribers)
const storeLoading = computed(() => !store.ready)

const activeCount = computed(() => subscribers.value.filter(s => s.active !== false).length)
const inactiveCount = computed(() => subscribers.value.filter(s => s.active === false).length)
const thisMonth = computed(() => {
  const now = new Date()
  return subscribers.value.filter(s => {
    const d = new Date(s.created)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
  }).length
})

const allFiltered = computed(() => {
  const q = search.value.toLowerCase()
  return subscribers.value.filter(s => {
    if (q && !`${s.email} ${s.name}`.toLowerCase().includes(q)) return false
    if (statusFilter.value === 'active' && s.active === false) return false
    if (statusFilter.value === 'inactive' && s.active !== false) return false
    return true
  })
})

const totalPages = computed(() => Math.max(1, Math.ceil(allFiltered.value.length / perPage)))

const filtered = computed(() => {
  const start = (page.value - 1) * perPage
  return allFiltered.value.slice(start, start + perPage)
})

watch([search, statusFilter], () => { page.value = 1 })

function initials(email: string) { return (email[0] || '?').toUpperCase() }

function actionsFor(s: any) {
  return [
    { label: s.active !== false ? 'Unsubscribe' : 'Resubscribe', icon: Power, onClick: () => toggleActive(s) },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => confirmDelete(s) },
  ]
}

function toggleSelect(id: string) {
  const i = selected.value.indexOf(id)
  if (i > -1) selected.value.splice(i, 1)
  else selected.value.push(id)
}

function toggleAll() {
  if (selected.value.length === filtered.value.length) selected.value = []
  else selected.value = filtered.value.map(s => s.id)
}

async function toggleActive(s: any) {
  const next = s.active !== false ? false : true
  try {
    await pb.collection('subscribers').update(s.id, { active: next })
    s.active = next
    toast.add({ type: 'success', title: next ? 'Subscriber resubscribed' : 'Subscriber unsubscribed' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update', message: e?.message }) }
}

async function confirmDelete(s: any) {
  const ok = await confirmDlg.confirm({ title: 'Delete Subscriber', message: `Remove ${s.email} from your list? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('subscribers').delete(s.id)
    toast.add({ type: 'success', title: 'Subscriber deleted' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }) }
}

async function bulkDelete() {
  const ok = await confirmDlg.confirm({ title: 'Bulk Delete', message: `Delete ${selected.value.length} subscribers? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  deleting.value = true
  try {
    await Promise.allSettled(selected.value.map(id => pb.collection('subscribers').delete(id)))
    toast.add({ type: 'success', title: `${selected.value.length} subscribers deleted` })
    selected.value = []
  } catch (e: any) { toast.add({ type: 'error', title: 'Bulk delete failed', message: e?.message }) }
  finally { deleting.value = false }
}

function exportCSV() {
  const rows = [['Name', 'Email', 'Subscribed', 'Status'], ...subscribers.value.map(s => [s.name || '', s.email, s.created || '', s.active !== false ? 'active' : 'inactive'])]
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
  toast.add({ type: 'success', title: `Exported ${subscribers.value.length} subscribers` })
}

function shortDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

onMounted(async () => {
  store.ensureActive()
  loading.value = false
})

onUnmounted(() => store.release())
</script>
