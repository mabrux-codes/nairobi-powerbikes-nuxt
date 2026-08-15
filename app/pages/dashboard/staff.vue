<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Staff Management"
      eyebrow="Business"
      description="Invite team members, manage roles, and control access across the dealership."
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
      <AdminStatCard label="Pending Setup" :display="pendingCount" :icon="UserPlus" icon-bg="bg-amber-500/15" icon-color="text-amber-400" />
      <AdminStatCard label="Suspended" :display="suspendedCount" :icon="Ban" icon-bg="bg-rose-500/15" icon-color="text-rose-400" />
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
        <option value="pending" class="bg-brand-black">Pending Setup</option>
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
            <StatusChip :status="lifecycle(s)" size="sm" />
          </div>
          <div class="mt-3 grid grid-cols-3 gap-2 border-t border-brand-grey/10 pt-3 text-center text-xs">
            <span class="rounded-lg bg-white/[0.03] border border-brand-grey/10 px-2 py-1.5 font-semibold text-white">{{ cap(s.role) }}</span>
            <span class="rounded-lg bg-white/[0.03] border border-brand-grey/10 px-2 py-1.5 text-brand-grey">{{ s.branch || 'No branch' }}</span>
            <span class="rounded-lg bg-white/[0.03] border border-brand-grey/10 px-2 py-1.5 text-brand-grey">{{ dept(s.role) }}</span>
          </div>
          <div v-if="isPending(s)" class="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-400">
            <Mail class="h-3.5 w-3.5 shrink-0" />Awaiting first login — invite email sent {{ inviteAge(s) }}
          </div>
          <div v-else-if="s.status === 'inactive'" class="mt-3 rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-400">
            Suspended {{ s.suspended_at ? shortDate(s.suspended_at) : '' }}
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
              <td class="px-4 py-3 text-brand-grey">{{ s.branch || '—' }}</td>
              <td class="px-4 py-3 text-brand-grey">{{ s.phone || '—' }}</td>
              <td class="px-4 py-3">
                <span class="inline-flex items-center gap-1.5 text-xs capitalize" :class="s.availability === 'online' ? 'text-emerald-400' : s.availability === 'busy' ? 'text-amber-400' : 'text-brand-grey'">
                  <span class="h-1.5 w-1.5 rounded-full" :class="s.availability === 'online' ? 'bg-emerald-400' : s.availability === 'busy' ? 'bg-amber-400' : 'bg-brand-grey/50'" />{{ s.availability || 'offline' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <StatusChip :status="lifecycle(s)" size="sm" />
                <p v-if="isPending(s)" class="mt-1 text-[10px] text-amber-500/80">Invite sent {{ inviteAge(s) }}</p>
                <p v-else-if="s.status === 'inactive' && s.suspended_at" class="mt-1 text-[10px] text-rose-500/70">Suspended {{ shortDate(s.suspended_at) }}</p>
              </td>
              <td class="px-4 py-3 text-right"><AdminActionsMenu :items="actionsFor(s)" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <AdminDrawer :open="drawerOpen" :title="editingId ? 'Edit Staff' : 'Invite Staff'" :subtitle="editingId ? 'Manage role, branch and access' : 'Send an invitation link to a new team member'" @close="closeDrawer">
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
        <div v-if="!editingId" class="rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3 text-xs leading-relaxed text-brand-grey">
          The team member will receive a welcome email with a temporary password. They must set their own password at first login before they can access the dashboard.
        </div>
        <div v-else>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Availability</label>
          <AdminSelect v-model="form.availability">
            <option value="online" class="bg-brand-black">Online</option>
            <option value="away" class="bg-brand-black">Away</option>
            <option value="busy" class="bg-brand-black">Busy</option>
            <option value="offline" class="bg-brand-black">Offline</option>
          </AdminSelect>
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
import { Users, UserCheck, UserPlus, Ban, Pencil, Trash2, KeyRound, Power, Mail, RefreshCcw } from 'lucide-vue-next'
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
const invites = ref<Record<string, any>>({})
const avatarFile = ref<File | null>(null)
const avatarPreview = ref<string | null>(null)
const form = ref({ name: '', email: '', phone: '', role: 'salesperson', branch: '', availability: 'online' })

const roleOptions = ['admin', 'manager', 'salesperson', 'mechanic']

const activeCount = computed(() => staff.value.filter(s => !isPending(s) && (s.status || 'active') !== 'inactive').length)
const pendingCount = computed(() => staff.value.filter(s => isPending(s)).length)
const suspendedCount = computed(() => staff.value.filter(s => s.status === 'inactive').length)

function isPending(s: any) {
  return !!(s.must_change_password && (s.role || '') !== 'customer')
}

function lifecycle(s: any): string {
  if ((s.status || 'active') === 'inactive') return 'inactive'
  if (isPending(s)) return 'pending'
  return 'active'
}

function inviteFor(s: any): any {
  return invites.value[s.id] || null
}

function inviteAge(s: any): string {
  const inv = inviteFor(s)
  if (!inv?.created) return 'recently'
  const days = Math.floor((Date.now() - new Date(inv.created).getTime()) / 86400000)
  if (days <= 0) return 'today'
  return `${days}d ago`
}

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return staff.value.filter(s => {
    if (q && !`${s.name} ${s.email} ${s.phone}`.toLowerCase().includes(q)) return false
    if (roleFilter.value && s.role !== roleFilter.value) return false
    if (branchFilter.value && s.branch !== branchFilter.value) return false
    if (statusFilter.value === 'pending' && !isPending(s)) return false
    if (statusFilter.value === 'active' && (isPending(s) || (s.status || 'active') === 'inactive')) return false
    if (statusFilter.value === 'inactive' && (s.status || 'active') !== 'inactive') return false
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
  const items: any[] = [
    { label: 'Edit', icon: Pencil, onClick: () => openEdit(s) },
  ]
  if (isPending(s)) {
    items.push({ label: 'Resend Invite', icon: RefreshCcw, onClick: () => resendInvite(s) })
  }
  items.push({ label: active ? 'Suspend' : 'Reinstate', icon: Power, onClick: () => toggleStatus(s) })
  items.push({ label: 'Reset Password', icon: KeyRound, onClick: () => confirmReset(s) })
  items.push({ label: 'Delete', icon: Trash2, danger: true, onClick: () => confirmDelete(s) })
  return items
}

function openCreate() {
  editingId.value = null
  form.value = { name: '', email: '', phone: '', role: 'salesperson', branch: '', availability: 'online' }
  avatarFile.value = null
  avatarPreview.value = null
  drawerOpen.value = true
}

function openEdit(s: any) {
  editingId.value = s.id
  form.value = { name: s.name || '', email: s.email, phone: s.phone || '', role: s.role, branch: s.branch || '', availability: s.availability || 'online' }
  avatarFile.value = null
  avatarPreview.value = avatarUrl(s)
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
  if (!form.value.email?.trim()) { toast.add({ type: 'error', title: 'Email is required' }); useAudio().playError(); return }
  if (!form.value.name?.trim()) { toast.add({ type: 'error', title: 'Name is required' }); useAudio().playError(); return }
  saving.value = true
  try {
    if (editingId.value) {
      const payload: any = { name: form.value.name, phone: form.value.phone, role: form.value.role, branch: form.value.branch, availability: form.value.availability }
      await pb.collection('users').update(editingId.value, payload)
      if (avatarFile.value) {
        const fd = new FormData()
        fd.append('avatar', avatarFile.value)
        await pb.collection('users').update(editingId.value, fd)
      }
      toast.add({ type: 'success', title: 'Staff updated' })
      useAudio().playSuccess()
    } else {
      const res = await pb.send('/api/staff/invite', { method: 'POST', body: { email: form.value.email.trim(), name: form.value.name.trim(), phone: form.value.phone, role: form.value.role, branch: form.value.branch } })
      if (res?.ok) {
        toast.add({ type: 'success', title: 'Invite sent', message: `${form.value.email} will receive a welcome email.` })
        useAudio().playSuccess()
      } else {
        toast.add({ type: 'error', title: 'Invite failed', message: res?.message })
        useAudio().playError()
        return
      }
    }
    closeDrawer()
    await loadStaff()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save', message: e?.message }); useAudio().playError() }
  finally { saving.value = false }
}

async function toggleStatus(s: any) {
  const next = (s.status || 'active') === 'active' ? 'inactive' : 'active'
  const ok = await confirmDlg.confirm({
    title: next === 'inactive' ? 'Suspend Staff' : 'Reinstate Staff',
    message: next === 'inactive'
      ? `Suspending ${s.name || s.email} immediately blocks their login and all dashboard access. Continue?`
      : `Reinstate ${s.name || s.email}? They'll regain access immediately.`,
    confirmText: next === 'inactive' ? 'Suspend' : 'Reinstate',
    confirmType: next === 'inactive' ? 'danger' : 'info',
  })
  if (!ok) return
  try {
    await pb.collection('users').update(s.id, { status: next })
    await loadStaff()
    toast.add({ type: 'success', title: next === 'inactive' ? 'Staff suspended' : 'Staff reinstated' })
    useAudio().playSuccess()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update', message: e?.message }); useAudio().playError() }
}

async function resendInvite(s: any) {
  const inv = inviteFor(s)
  if (!inv) { toast.add({ type: 'error', title: 'No pending invitation found' }); return }
  try {
    const res = await pb.send('/api/staff/resend', { method: 'POST', body: { id: inv.id } })
    if (res?.ok) {
      toast.add({ type: 'success', title: 'Invite re-sent', message: `A fresh invitation went to ${s.email}.` })
      useAudio().playSuccess()
      await loadStaff()
    } else {
      toast.add({ type: 'error', title: 'Resend failed', message: res?.message })
      useAudio().playError()
    }
  } catch (e: any) { toast.add({ type: 'error', title: 'Resend failed', message: e?.message }); useAudio().playError() }
}

async function confirmReset(s: any) {
  const ok = await confirmDlg.confirm({
    title: 'Reset Password',
    message: `A new temporary password will be emailed to ${s.email} and they'll be forced to change it at next login. Continue?`,
    confirmText: 'Send Reset',
    confirmType: 'warning',
  })
  if (!ok) return
  try {
    const res = await pb.send('/api/staff/reset-password', { method: 'POST', body: { userId: s.id } })
    if (res?.ok) {
      toast.add({ type: 'success', title: 'Password reset sent', message: `A temporary password was emailed to ${s.email}.` })
      useAudio().playSuccess()
      await loadStaff()
    } else {
      toast.add({ type: 'error', title: 'Reset failed', message: res?.message })
      useAudio().playError()
    }
  } catch (e: any) { toast.add({ type: 'error', title: 'Reset failed', message: e?.message }); useAudio().playError() }
}

async function confirmDelete(s: any) {
  const ok = await confirmDlg.confirm({ title: 'Delete Staff', message: `Delete ${s.name || s.email}? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('users').delete(s.id)
    await loadStaff()
    toast.add({ type: 'success', title: 'Staff deleted' })
    useAudio().playSuccess()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }); useAudio().playError() }
}

async function loadStaff() {
  try {
    const [users, inv] = await Promise.all([
      pb.collection('users').getFullList({ filter: 'role != "customer"', sort: '-created' }),
      pb.collection('staff_invitations').getFullList({ sort: '-created' }),
    ])
    staff.value = users as any[]
    const map: Record<string, any> = {}
    for (const i of inv as any[]) {
      if (i.user && (i.status === 'pending' || !map[i.user])) map[i.user] = i
    }
    invites.value = map
  } catch { /* ignore */ }
}

function subscribe() {
  pb.collection('users').subscribe('*', loadStaff)
  pb.collection('staff_invitations').subscribe('*', loadStaff)
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
  try { pb.collection('staff_invitations').unsubscribe('*') } catch { /* ignore */ }
})

function shortDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>