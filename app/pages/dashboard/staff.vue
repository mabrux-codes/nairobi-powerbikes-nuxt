<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="font-heading text-4xl text-white">Staff <span class="text-brand-red">Management</span></h1>
          <p class="mt-1 text-sm text-brand-grey">Manage your team members</p>
        </div>
        <Button size="sm" @click="openCreateModal">Add Staff</Button>
      </div>

      <div class="mb-4 flex flex-wrap gap-3">
        <Input v-model="searchQuery" placeholder="Search staff..." class="w-64" />
        <select v-model="roleFilter" class="input-field w-40">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="salesperson">Salesperson</option>
          <option value="mechanic">Mechanic</option>
        </select>
        <select v-model="statusFilter" class="input-field w-40">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div v-if="loading" class="space-y-3">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-4">
          <div class="h-5 w-48 rounded bg-brand-grey/10" />
          <div class="mt-2 h-4 w-32 rounded bg-brand-grey/10" />
        </div>
      </div>

      <div v-else-if="filteredStaff.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
        <Users class="mx-auto h-12 w-12 text-brand-grey/40" />
        <p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Staff Found</p>
        <p class="mt-2 text-sm text-brand-grey/60">Add your first team member to get started</p>
      </div>

      <div v-else class="overflow-x-auto rounded-sm border border-brand-grey/20">
        <table class="w-full text-left text-sm">
          <thead class="border-b border-brand-grey/20 bg-brand-black/80">
            <tr>
              <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Name</th>
              <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Email</th>
              <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Role</th>
              <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Branch</th>
              <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Availability</th>
              <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Status</th>
              <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-grey/10">
            <tr v-for="s in filteredStaff" :key="s.id" class="transition-colors hover:bg-white/5">
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-brand-grey/20 text-xs font-bold text-brand-light">{{ getInitials(s.name || s.email) }}</div>
                  <span class="font-medium text-white">{{ s.name || 'Unnamed' }}</span>
                </div>
              </td>
              <td class="px-4 py-3 text-brand-grey">{{ s.email }}</td>
              <td class="px-4 py-3"><Badge>{{ s.role }}</Badge></td>
              <td class="px-4 py-3 text-brand-grey">{{ s.branch || 'N/A' }}</td>
              <td class="px-4 py-3">
                <span class="flex items-center gap-1.5 text-sm">
                  <span class="inline-block h-2 w-2 rounded-full" :class="s.availability === 'online' ? 'bg-emerald-400' : s.availability === 'busy' ? 'bg-amber-400' : 'bg-brand-grey/40'" />
                  {{ s.availability || 'offline' }}
                </span>
              </td>
              <td class="px-4 py-3"><Badge :variant="s.status === 'active' ? 'success' : 'danger'">{{ s.status }}</Badge></td>
              <td class="px-4 py-3 text-right">
                <div class="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" @click="openEditModal(s)">Edit</Button>
                  <Button v-if="s.status === 'active'" variant="outline" size="sm" @click="toggleStatus(s)">Deactivate</Button>
                  <Button v-else variant="outline" size="sm" @click="toggleStatus(s)">Activate</Button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="closeModal">
        <div class="w-full max-w-lg rounded-sm border border-brand-grey/30 bg-brand-black p-6">
          <h2 class="font-display text-xl tracking-display text-white">{{ editingId ? 'Edit Staff' : 'Add Staff' }}</h2>
          <div class="mt-4 space-y-4">
            <Input v-model="form.name" label="Name" placeholder="Full name" />
            <Input v-model="form.email" label="Email" type="email" placeholder="email@example.com" />
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Role</label>
              <select v-model="form.role" class="input-field w-full">
                <option value="manager">Manager</option>
                <option value="salesperson">Salesperson</option>
                <option value="mechanic">Mechanic</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Branch</label>
              <select v-model="form.branch" class="input-field w-full">
                <option value="">Select branch</option>
                <option v-for="b in branches" :key="b.id" :value="b.name">{{ b.name }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Availability</label>
              <select v-model="form.availability" class="input-field w-full">
                <option value="online">Online</option>
                <option value="busy">Busy</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <Input v-if="!editingId" v-model="form.password" label="Password" type="password" placeholder="Set password" />
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <Button variant="ghost" @click="closeModal">Cancel</Button>
            <Button :disabled="saving" @click="saveStaff">{{ saving ? 'Saving...' : 'Save' }}</Button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Users } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Staff Management - Nairobi Powerbikes' })

const pb = usePB()
const loading = ref(true)
const saving = ref(false)
const staff = ref<any[]>([])
const branches = ref<any[]>([])
const searchQuery = ref('')
const roleFilter = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ name: '', email: '', role: 'salesperson', branch: '', availability: 'online', password: '' })

function getInitials(name: string) { return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() }

const filteredStaff = computed(() => {
  return staff.value.filter(s => {
    if (searchQuery.value && !`${s.name} ${s.email}`.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    if (roleFilter.value && s.role !== roleFilter.value) return false
    if (statusFilter.value && s.status !== statusFilter.value) return false
    return true
  })
})

function openCreateModal() {
  editingId.value = null
  form.value = { name: '', email: '', role: 'salesperson', branch: '', availability: 'online', password: '' }
  showModal.value = true
}

function openEditModal(s: any) {
  editingId.value = s.id
  form.value = { name: s.name || '', email: s.email, role: s.role, branch: s.branch || '', availability: s.availability || 'online', password: '' }
  showModal.value = true
}

function closeModal() { showModal.value = false }

async function saveStaff() {
  saving.value = true
  try {
    if (editingId.value) {
      const payload: any = { name: form.value.name, email: form.value.email, role: form.value.role, branch: form.value.branch, availability: form.value.availability }
      await pb.collection('users').update(editingId.value, payload)
    } else {
      const { password, ...rest } = form.value
      await pb.collection('users').create({ ...rest, status: 'active', emailVisibility: true, password, passwordConfirm: password })
    }
    closeModal()
    await loadStaff()
  } catch (e) { console.error(e) }
  finally { saving.value = false }
}

async function toggleStatus(s: any) {
  const newStatus = s.status === 'active' ? 'inactive' : 'active'
  try {
    await pb.collection('users').update(s.id, { status: newStatus })
    s.status = newStatus
  } catch (e: any) {
    console.error('Status toggle failed:', e?.data?.message || e?.message || e)
  }
}

async function loadStaff() {
  try {
    const res = await pb.collection('users').getList(1, 100, { filter: 'role != "customer"' })
    staff.value = res.items as any[]
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  await Promise.all([
    loadStaff(),
    pb.collection('branches').getFullList().catch(() => []).then((r: any) => branches.value = r),
  ])
  loading.value = false
})
</script>
