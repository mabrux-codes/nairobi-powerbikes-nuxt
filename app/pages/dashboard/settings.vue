<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6">
        <h1 class="font-heading text-4xl text-white">System <span class="text-brand-red">Settings</span></h1>
        <p class="mt-1 text-sm text-brand-grey">Manage branches, service types, and roles</p>
      </div>

      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="mb-4 h-6 w-48 rounded bg-brand-grey/10" /><div class="h-24 rounded bg-brand-grey/10" /></div>
      </div>

      <div v-else class="space-y-8">
        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-display text-lg tracking-display text-white">Branches</h2>
            <Button size="sm" @click="openBranchModal()">Add Branch</Button>
          </div>
          <div v-if="branches.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-6 text-center">
            <p class="text-sm text-brand-grey">No branches configured</p>
          </div>
          <div v-else class="space-y-2">
            <div v-for="b in branches" :key="b.id" class="flex items-center justify-between rounded-sm border border-brand-grey/10 px-4 py-3">
              <div>
                <p class="text-sm font-medium text-white">{{ b.name }}</p>
                <p v-if="b.location" class="text-xs text-brand-grey">{{ b.location }}</p>
              </div>
              <div class="flex gap-2">
                <Button variant="ghost" size="sm" @click="openBranchModal(b)">Edit</Button>
                <Button variant="danger" size="sm" :disabled="deleting" @click="deleteBranch(b)">Delete</Button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-display text-lg tracking-display text-white">Service Types</h2>
            <Button size="sm" @click="openServiceModal()">Add Service</Button>
          </div>
          <div v-if="serviceTypes.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-6 text-center">
            <p class="text-sm text-brand-grey">No service types configured</p>
          </div>
          <div v-else class="space-y-2">
            <div v-for="s in serviceTypes" :key="s.id" class="flex items-center justify-between rounded-sm border border-brand-grey/10 px-4 py-3">
              <div>
                <p class="text-sm font-medium text-white">{{ s.name }}</p>
                <p v-if="s.description" class="text-xs text-brand-grey">{{ s.description }}</p>
              </div>
              <div class="flex gap-2">
                <Button variant="ghost" size="sm" @click="openServiceModal(s)">Edit</Button>
                <Button variant="danger" size="sm" :disabled="deleting" @click="deleteService(s)">Delete</Button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <h2 class="font-display text-lg tracking-display text-white">User Roles</h2>
          <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="r in roles" :key="r.value" class="rounded-sm border border-brand-grey/10 p-4 text-center">
              <Badge>{{ r.value }}</Badge>
              <p class="mt-2 text-xs text-brand-grey">{{ r.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showBranchModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="showBranchModal = false">
        <div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6">
          <h2 class="font-display text-xl tracking-display text-white">{{ branchEditingId ? 'Edit Branch' : 'Add Branch' }}</h2>
          <div class="mt-4 space-y-4">
            <Input v-model="branchForm.name" label="Branch Name" placeholder="e.g. Nairobi CBD" />
            <Input v-model="branchForm.address" label="Address" placeholder="e.g. Moi Avenue" />
            <Input v-model="branchForm.phone" label="Phone" placeholder="+254..." />
            <Input v-model="branchForm.email" label="Email" type="email" placeholder="branch@example.com" />
            <Input v-model="branchForm.hours" label="Hours" placeholder="e.g. Mon-Sat: 8AM-6PM" />
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <Button variant="ghost" @click="showBranchModal = false">Cancel</Button>
            <Button :disabled="savingBranch" @click="saveBranch">{{ savingBranch ? 'Saving...' : 'Save' }}</Button>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showServiceModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="showServiceModal = false">
        <div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6">
          <h2 class="font-display text-xl tracking-display text-white">{{ serviceEditingId ? 'Edit Service' : 'Add Service' }}</h2>
          <div class="mt-4 space-y-4">
            <Input v-model="serviceForm.name" label="Service Name" placeholder="e.g. Oil Change" />
            <Input v-model="serviceForm.price" label="Price (KSh)" type="number" placeholder="0" />
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Description</label>
              <textarea v-model="serviceForm.description" rows="3" class="input-field w-full resize-none" />
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <Button variant="ghost" @click="showServiceModal = false">Cancel</Button>
            <Button :disabled="savingService" @click="saveService">{{ savingService ? 'Saving...' : 'Save' }}</Button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Settings - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const loading = ref(true)
const branches = ref<any[]>([]); const serviceTypes = ref<any[]>([])
const showBranchModal = ref(false); const branchEditingId = ref<string | null>(null)
const branchForm = ref({ name: '', address: '', phone: '', email: '', hours: '' })
const savingBranch = ref(false); const deleting = ref(false)
const showServiceModal = ref(false); const serviceEditingId = ref<string | null>(null)
const serviceForm = ref({ name: '', price: '', description: '' })
const savingService = ref(false)

const roles = [
  { value: 'admin', description: 'Full system access' },
  { value: 'manager', description: 'Content & booking management' },
  { value: 'salesperson', description: 'Leads & test rides' },
  { value: 'mechanic', description: 'Service queue & jobs' },
  { value: 'customer', description: 'Personal dashboard' },
]

function openBranchModal(b?: any) {
  branchEditingId.value = b?.id || null
  branchForm.value = b ? { name: b.name, address: b.address || '', phone: b.phone || '', email: b.email || '', hours: b.hours || '' } : { name: '', address: '', phone: '', email: '', hours: '' }
  showBranchModal.value = true
}

async function saveBranch() {
  savingBranch.value = true
  try {
    const payload: any = { ...branchForm.value }
    if (!branchEditingId.value) payload.slug = branchForm.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (branchEditingId.value) { await pb.collection('branches').update(branchEditingId.value, payload); toast.add({ type: 'success', title: 'Branch updated successfully' }) }
    else { await pb.collection('branches').create(payload); toast.add({ type: 'success', title: 'Branch created successfully' }) }
    showBranchModal.value = false; await loadData()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save branch', message: e?.message || 'Something went wrong' }) }
  finally { savingBranch.value = false }
}

async function deleteBranch(b: any) {
  deleting.value = true
  try {
    const ok = await confirmDlg.confirm({ title: 'Delete Branch', message: `Are you sure you want to delete "${b.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
    if (ok) { await pb.collection('branches').delete(b.id); toast.add({ type: 'success', title: 'Deleted successfully' }); await loadData() }
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message || 'Something went wrong' }) }
  finally { deleting.value = false }
}

function openServiceModal(s?: any) {
  serviceEditingId.value = s?.id || null
  serviceForm.value = s ? { name: s.name, price: s.price?.toString() || '', description: s.description || '' } : { name: '', price: '', description: '' }
  showServiceModal.value = true
}

async function saveService() {
  savingService.value = true
  try {
    const payload: any = { ...serviceForm.value, price: parseFloat(serviceForm.value.price) || 0 }
    if (serviceEditingId.value) { await pb.collection('service_types').update(serviceEditingId.value, payload); toast.add({ type: 'success', title: 'Service updated successfully' }) }
    else { await pb.collection('service_types').create(payload); toast.add({ type: 'success', title: 'Service created successfully' }) }
    showServiceModal.value = false; await loadData()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save service', message: e?.message || 'Something went wrong' }) }
  finally { savingService.value = false }
}

async function deleteService(s: any) {
  deleting.value = true
  try {
    const ok = await confirmDlg.confirm({ title: 'Delete Service', message: `Are you sure you want to delete "${s.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
    if (ok) { await pb.collection('service_types').delete(s.id); toast.add({ type: 'success', title: 'Deleted successfully' }); await loadData() }
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message || 'Something went wrong' }) }
  finally { deleting.value = false }
}

async function loadData() {
  try {
    const [b, st] = await Promise.all([
      pb.collection('branches').getFullList({ sort: 'name' }).catch(() => []),
      pb.collection('service_types').getFullList({ sort: 'name' }).catch(() => []),
    ])
    branches.value = b as any[]; serviceTypes.value = st as any[]
  } catch (e) { console.error(e) }
}

onMounted(async () => { await loadData(); loading.value = false })
</script>
