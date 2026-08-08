<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Staff Management"
      eyebrow="Business"
      description="Manage team members, roles and access across the dealership."
      :actions="[{ label: 'Invite Staff', icon: UserPlus, onClick: openCreate }]"
    />

    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-5">
        <div class="h-11 w-11 rounded-xl bg-brand-grey/10" />
        <div class="mt-4 h-8 w-14 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3 w-24 rounded bg-brand-grey/10" />
      </div>
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AdminStatCard label="Total Staff" :display="staff.length" :icon="Users" icon-bg="bg-brand-red/15" icon-color="text-brand-red" />
      <AdminStatCard label="Active" :display="activeCount" :icon="UserCheck" icon-bg="bg-emerald-500/15" icon-color="text-emerald-400" />
      <AdminStatCard label="Online Now" :display="onlineCount" :icon="Radio" icon-bg="bg-sky-500/15" icon-color="text-sky-400" />
      <AdminStatCard label="Suspended" :display="suspendedCount" :icon="Ban" icon-bg="bg-amber-500/15" icon-color="text-amber-400" />
    </div>

    <AdminToolbar v-model:search="search" search-placeholder="Search staff by name or email...">
      <AdminSelect v-model="roleFilter" placeholder="All Roles">
        <option v-for="r in roleOptions" :key="r" :value="r" class="bg-brand-black">{{ cap(r) }}</option>
      </AdminSelect>
      <AdminSelect v-model="branchFilter" placeholder="All Branches">
        <option v-for="b in branches" :key="b.id" :value="b.name" class="bg-brand-black">{{ b.name }}</option>
      </AdminSelect>
      <AdminSelect v-model="statusFilter" placeholder="All Status">
        <option value="active" class="bg-brand-black">Active</option>
        <option value="inactive" class="bg-brand-black">Suspended</option>
      </AdminSelect>
    </AdminToolbar>

    <AdminSkeleton v-if="loading" :rows="6" variant="row" />
    <AdminEmptyState
      v-else-if="filtered.length === 0"
      :icon="Users"
      title="No Staff Found"
      description="Invite team members to manage bookings, inventory and customers."
    >
      <Button size="sm" @click="openCreate"><UserPlus class="h-4 w-4" />Invite Staff</Button>
    </AdminEmptyState>

    <template v-else>
      <!-- Mobile cards -->
      <div class="space-y-3 md:hidden">
        <AdminCard v-for="s in filtered" :key="s.id" class="flex flex-col">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-sm font-bold text-white ring-2 ring-brand-red/30">
              <img v-if="avatarUrl(s)" :src="avatarUrl(s)" :alt="s.name" class="h-full w-full object-cover" />
              <span v-else>{{ initials(s.name || s.email) }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate font-semibold text-white">{{ s.name || 'Unnamed' }}</p>
              <p class="truncate text-xs text-brand-grey">{{ s.email }}</p>
            </div>
            <StatusChip :status="s.status || 'active'" size="sm" />
          </div>
          <div class="mt-3 grid grid-cols-3 gap-2 border-t border-brand-grey/10 pt-3 text-center text-xs">
            <span class="rounded-lg bg-white/[0.03] border border-brand-grey/10 px-2 py-1.5 font-semibold text-white">{{ cap(s.role) }}</span>
            <span class="rounded-lg bg-white/[0.03] border border-brand-grey/10 px-2 py-1.5 text-brand-grey">{{ s.branch || 'No branch' }}</span>
            <span class="rounded-lg bg-white/[0.03] border border-brand-grey/10 px-2 py-1.5 text-brand-grey">{{ dept(s.role) }}</span>
          </div>
          <div class="mt-3 flex justify-end"><AdminActionsMenu :items="actionsFor(s)" /></div>
        </AdminCard>
      </div>

      <!-- Desktop table -->
      <div class="hidden md:block overflow-hidden rounded-2xl border border-brand-grey/15 bg-brand-black/60">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-brand-grey/15 bg-brand-black/80">
            <tr>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Staff</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Role</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Department</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Branch</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Phone</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Availability</th>
              <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Status</th>
              <th class="px-4 py-3" />
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-grey/10">
            <tr v-for="s in filtered" :key="s.id" class="transition-colors hover:bg-white/[0.03]">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-[11px] font-bold text-white">
                    <img v-if="avatarUrl(s)" :src="avatarUrl(s)" :alt="s.name" class="h-full w-full object-cover" />
                    <span v-else>{{ initials(s.name || s.email) }}</span>
                  </div>
                  <div class="min-w-0">
                    <p class="truncate font-medium text-white">{{ s.name || 'Unnamed' }}</p>
                    <p class="truncate text-[11px] text-brand-grey">{{ s.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3"><Badge>{{ s.role }}</Badge></td>
              <td class="px-4 py-3 text-brand-grey">{{ dept(s.role) }}</td>
              <td class="px-4 py-3 text-brand-grey">{{ s.branch || '—' }}</td>
              <td class="px-4 py-3 text-brand-grey">{{ s.phone || '—' }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1.5 text-xs capitalize" :class="s.availability === 'online' ? 'text-emerald-400' : s.availability === 'busy' ? 'text-amber-400' : 'text-brand-grey'">
                  <span class="h-1.5 w-1.5 rounded-full" :class="s.availability === 'online' ? 'bg-emerald-400' : s.availability === 'busy' ? 'bg-amber-400' : 'bg-brand-grey/50'" />{{ s.availability || 'offline' }}
                </span>
              </td>
              <td class="px-4 py-3"><StatusChip :status="s.status || 'active'" size="sm" /></td>
              <td class="px-4 py-3 text-right"><AdminActionsMenu :items="actionsFor(s)" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <AdminDrawer :open="drawerOpen" :title="editingId ? 'Edit Staff' : 'Invite Staff'" :subtitle="editingId ? 'Manage role, branch and access' : 'Create a new staff account'" @close="closeDrawer">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <div class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-lg font-bold text-white">
            <img v-if="avatarPreview" :src="avatarPreview" alt="Avatar preview" class="h-full w-full object-cover" />
            <span v-else>{{ form.name.slice(0, 2).toUpperCase() || '?' }}</span>
          </div>
          <div class="flex-1">
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Avatar</label>
            <input type="file" accept="image/*" class="block w-full text-xs text-brand-grey file:mr-3 file:rounded-lg file:border-0 file:bg-brand-red file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white" @change="onAvatarChange" />
          </div>
        </div>
        <Input v-model="form.name" label="Full Name" placeholder="Jane Doe" />
        <Input v-model="form.email" label="Email" type="email" placeholder="email@example.com" />
        <Input v-model="form.phone" label="Phone" placeholder="+254..." />
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Role</label>
            <AdminSelect v-model="form.role">
              <option v-for="r in roleOptions" :key="r" :value="r" class="bg-brand-black">{{ cap(r) }}</option>
            </AdminSelect>
          </div>
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Branch</label>
            <AdminSelect v-model="form.branch" placeholder="Select branch">
              <option v-for="b in branches" :key="b.id" :value="b.name" class="bg-brand-black">{{ b.name }}</option>
            </AdminSelect>
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Availability</label>
          <AdminSelect v-model="form.availability">
            <option value="online" class="bg-brand-black">Online</option>
            <option value="away" class="bg-brand-black">Away</option>
            <option value="busy" class="bg-brand-black">Busy</option>
            <option value="offline" class="bg-brand-black">Offline</option>
          </AdminSelect>
        </div>
        <Input v-if="!editingId" v-model="form.password" label="Temporary Password" type="password" placeholder="Set initial password" />
        <div v-else>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Reset Password</label>
          <Input v-model="resetPassword" label="" type="password" placeholder="Leave blank to keep current" />
        </div>
      </div>
      <template #footer>
        <Button variant="ghost" @click="closeDrawer">Cancel</Button>
        <Button :disabled="saving" @click="save">{{ saving ? 'Saving…' : editingId ? 'Save Changes' : 'Send Invite' }}</Button>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import { Users, UserCheck, Radio, Ban, UserPlus, Pencil, Trash2, KeyRound, Power } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Staff Management - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()

const loading = ref(true)
const saving = ref(false)
const drawerOpen = ref(false)
const editingId = ref<string | null>(null)
const search = ref('')
const roleFilter = ref('')
const branchFilter = ref('')
const statusFilter = ref('')
const staff = ref<any[]>([])
const branches = ref<any[]>([])
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const resetPassword = ref('')
const form = ref({ name: '', email: '', phone: '', role: 'salesperson', branch: '', availability: 'online', password: '' })

const roleOptions = ['admin', 'manager', 'salesperson', 'mechanic']

const activeCount = computed(() => staff.value.filter(s => (s.status || 'active') !== 'inactive').length)
const onlineCount = computed(() => staff.value.filter(s => s.availability === 'online' && (s.status || 'active') !== 'inactive').length)
const suspendedCount = computed(() => staff.value.filter(s => s.status === 'inactive').length)

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return staff.value.filter(s => {
    if (q && !`${s.name} ${s.email} ${s.phone}`.toLowerCase().includes(q)) return false
    if (roleFilter.value && s.role !== roleFilter.value) return false
    if (branchFilter.value && s.branch !== branchFilter.value) return false
    if (statusFilter.value && (s.status || 'active') !== statusFilter.value) return false
    return true
  })
})

const DEPTS: Record<string, string> = { admin: 'Management', manager: 'Management', salesperson: 'Sales', mechanic: 'Service' }
function dept(role: string) { return DEPTS[role] || 'Operations' }

function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1) }

function initials(name: string) { return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() }

function avatarUrl(s: any) {
  if (!s.avatar) return null
  return typeof s.avatar === 'string' && s.avatar.startsWith('http') ? s.avatar : pb?.files?.getUrl(s, s.avatar)
}

function actionsFor(s: any) {
  const active = (s.status || 'active') !== 'inactive'
  return [
    { label: 'Edit', icon: Pencil, onClick: () => openEdit(s) },
    { label: active ? 'Suspend' : 'Reinstate', icon: Power, onClick: () => toggleStatus(s) },
    { label: 'Reset Password', icon: KeyRound, onClick: () => openReset(s) },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => confirmDelete(s) },
  ]
}

function openCreate() {
  editingId.value = null
  form.value = { name: '', email: '', phone: '', role: 'salesperson', branch: '', availability: 'online', password: '' }
  avatarFile.value = null
  avatarPreview.value = null
  resetPassword.value = ''
  drawerOpen.value = true
}

function openEdit(s: any) {
  editingId.value = s.id
  form.value = { name: s.name || '', email: s.email, phone: s.phone || '', role: s.role, branch: s.branch || '', availability: s.availability || 'online', password: '' }
  avatarFile.value = null
  avatarPreview.value = avatarUrl(s)
  resetPassword.value = ''
  drawerOpen.value = true
}

function closeDrawer() { drawerOpen.value = false }

function onAvatarChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) {
    avatarFile.value = target.files[0]
    avatarPreview.value = URL.createObjectURL(target.files[0])
  }
}

async function save() {
  if (!form.value.email?.trim()) { toast.add({ type: 'error', title: 'Email is required' }); return }
  saving.value = true
  try {
    const payload: any = { name: form.value.name, email: form.value.email, phone: form.value.phone, role: form.value.role, branch: form.value.branch, availability: form.value.availability }
    let recordId: string | null = editingId.value
    if (editingId.value) {
      await pb.collection('users').update(editingId.value, payload)
      if (resetPassword.value) {
        await pb.collection('users').update(editingId.value, { password: resetPassword.value, passwordConfirm: resetPassword.value })
      }
      toast.add({ type: 'success', title: 'Staff updated' })
    } else {
      if (!form.value.password) { toast.add({ type: 'error', title: 'Set a temporary password for new staff' }); return }
      const created = await pb.collection('users').create({ ...payload, emailVisibility: true, status: 'active', verified: true, password: form.value.password, passwordConfirm: form.value.password })
      recordId = created.id
      toast.add({ type: 'success', title: 'Staff invited' })
    }
    if (avatarFile.value && recordId) {
      const fd = new FormData()
      fd.append('avatar', avatarFile.value)
      await pb.collection('users').update(recordId, fd)
    }
    closeDrawer()
    await loadStaff()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save', message: e?.message }) }
  finally { saving.value = false }
}

async function toggleStatus(s: any) {
  const next = (s.status || 'active') === 'active' ? 'inactive' : 'active'
  const ok = await confirmDlg.confirm({ title: next === 'inactive' ? 'Suspend Staff' : 'Reinstate Staff', message: `${next === 'inactive' ? 'Suspend' : 'Reinstate'} ${s.name || s.email}?`, confirmText: next === 'inactive' ? 'Suspend' : 'Reinstate', confirmType: next === 'inactive' ? 'warning' : 'info' })
  if (!ok) return
  try {
    await pb.collection('users').update(s.id, { status: next })
    s.status = next
    toast.add({ type: 'success', title: next === 'inactive' ? 'Staff suspended' : 'Staff reinstated' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update', message: e?.message }) }
}

function openReset(s: any) {
  openEdit(s)
}

async function confirmDelete(s: any) {
  const ok = await confirmDlg.confirm({ title: 'Delete Staff', message: `Delete ${s.name || s.email}? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('users').delete(s.id)
    toast.add({ type: 'success', title: 'Staff deleted' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }) }
}

async function loadStaff() {
  try {
    const res = await pb.collection('users').getFullList({ filter: 'role != "customer"' })
    staff.value = res as any[]
  } catch { /* ignore */ }
}

function subscribe() {
  pb.collection('users').subscribe('*', loadStaff)
}

onMounted(async () => {
  await Promise.all([
    loadStaff(),
    pb.collection('branches').getFullList().catch(() => []).then((r: any) => branches.value = r),
  ])
  subscribe()
  loading.value = false
})

onUnmounted(() => {
  try { pb.collection('users').unsubscribe('*') } catch { /* ignore */ }
})
</script>
