<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="font-heading text-4xl text-white">Team <span class="text-brand-red">Members</span></h1>
          <p class="mt-1 text-sm text-brand-grey">Manage team for the About page</p>
        </div>
        <Button size="sm" @click="openCreateModal">Add Member</Button>
      </div>

      <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 4" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-6">
          <div class="mx-auto mb-4 h-20 w-20 rounded-full bg-brand-grey/10" />
          <div class="mx-auto h-5 w-24 rounded bg-brand-grey/10" />
          <div class="mx-auto mt-2 h-4 w-16 rounded bg-brand-grey/10" />
        </div>
      </div>

      <div v-else-if="members.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
        <Users class="mx-auto h-12 w-12 text-brand-grey/40" />
        <p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Team Members</p>
        <p class="mt-2 text-sm text-brand-grey/60">Add team members to showcase on the About page</p>
      </div>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="m in members" :key="m.id" class="group rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 text-center transition-all duration-200 hover:border-brand-red/30">
          <div class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-grey/20 to-brand-black ring-2 ring-brand-grey/10">
            <span class="font-display text-2xl tracking-display text-brand-grey/40">{{ getInitials(m.name) }}</span>
          </div>
          <h3 class="font-display text-lg tracking-display text-white">{{ m.name }}</h3>
          <p class="text-xs font-display tracking-display text-brand-red uppercase">{{ m.role }}</p>
          <p v-if="m.bio" class="mt-2 text-xs text-brand-grey leading-relaxed">{{ m.bio }}</p>
          <div class="mt-4 flex justify-center gap-2">
            <Button variant="ghost" size="sm" @click="openEditModal(m)">Edit</Button>
            <Button variant="danger" size="sm" :disabled="deleting" @click="confirmDelete(m)">Delete</Button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" @click.self="closeModal">
        <div class="w-full max-w-lg rounded-sm border border-brand-grey/30 bg-brand-black p-6 my-8">
          <h2 class="font-display text-xl tracking-display text-white">{{ editingId ? 'Edit Member' : 'Add Member' }}</h2>
          <div class="mt-4 space-y-4">
            <Input v-model="form.name" label="Name" placeholder="Full name" />
            <Input v-model="form.role" label="Role / Title" placeholder="e.g. Lead Mechanic" />
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Bio</label>
              <textarea v-model="form.bio" rows="3" class="input-field w-full resize-none" placeholder="Short biography..." />
            </div>
            <Input v-model="form.sort_order" label="Sort Order" type="number" placeholder="0" />
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <Button variant="ghost" @click="closeModal">Cancel</Button>
            <Button :disabled="saving" @click="saveMember">{{ saving ? 'Saving...' : 'Save' }}</Button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Users } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Team - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const loading = ref(true); const saving = ref(false); const deleting = ref(false)
const members = ref<any[]>([])
const showModal = ref(false); const editingId = ref<string | null>(null)
const form = ref({ name: '', role: '', bio: '', sort_order: '0' })

function getInitials(name: string) { return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() }

function openCreateModal() { editingId.value = null; form.value = { name: '', role: '', bio: '', sort_order: '0' }; showModal.value = true }
function openEditModal(m: any) { editingId.value = m.id; form.value = { name: m.name, role: m.role || '', bio: m.bio || '', sort_order: m.sort_order?.toString() || '0' }; showModal.value = true }
function closeModal() { showModal.value = false }

async function saveMember() {
  saving.value = true
  try {
    const payload: any = { ...form.value, sort_order: parseInt(form.value.sort_order) || 0 }
    if (editingId.value) { await pb.collection('team_members').update(editingId.value, payload); toast.add({ type: 'success', title: 'Updated successfully' }) }
    else { await pb.collection('team_members').create(payload); toast.add({ type: 'success', title: 'Created successfully' }) }
    closeModal(); await loadMembers()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save', message: e?.message || 'Something went wrong' }) }
  finally { saving.value = false }
}

async function confirmDelete(m: any) { deleting.value = true; try { const ok = await confirmDlg.confirm({ title: 'Delete Member', message: `Are you sure you want to delete "${m.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' }); if (ok) { await pb.collection('team_members').delete(m.id); toast.add({ type: 'success', title: 'Deleted successfully' }); await loadMembers() } } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message || 'Something went wrong' }) } finally { deleting.value = false } }

async function loadMembers() { try { const res = await pb.collection('team_members').getList(1, 50, { sort: 'sort_order' }); members.value = res.items as any[] } catch (e) { console.error(e) } }

onMounted(async () => { await loadMembers(); loading.value = false })
</script>
