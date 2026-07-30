<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-6">
      <h1 class="font-heading text-4xl text-white">Service <span class="text-brand-red">Requests</span></h1>
      <p class="mt-1 text-sm text-brand-grey">Manage customer service requests</p>
    </div>
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-4">
        <div class="h-5 w-64 rounded bg-brand-grey/10" /><div class="mt-2 h-4 w-40 rounded bg-brand-grey/10" />
      </div>
    </div>
    <div v-else-if="items.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
      <Wrench class="mx-auto h-12 w-12 text-brand-grey/40" />
      <p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Service Requests</p>
    </div>
    <div v-else class="space-y-4">
      <div v-for="s in items" :key="s.id" class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-5">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 class="font-display text-lg tracking-display text-white">{{ s.name || s.expand?.user?.name || 'Guest' }}</h3>
            <p class="text-xs text-brand-grey">{{ s.service_type }} &middot; {{ s.motorcycle }}</p>
          </div>
          <Badge :variant="statusVariant(s.status)">{{ s.status }}</Badge>
        </div>
        <div v-if="s.phone || s.email" class="mt-2 flex flex-wrap gap-4 text-xs text-brand-grey/70">
          <span v-if="s.phone">Phone: {{ s.phone }}</span>
          <span v-if="s.email">Email: {{ s.email }}</span>
        </div>
        <p v-if="s.description" class="mt-2 text-sm text-brand-grey/70">{{ s.description }}</p>
        <div v-if="s.preferred_date || s.preferred_time || s.branch" class="mt-1 flex flex-wrap gap-3 text-xs text-brand-grey/50">
          <span v-if="s.preferred_date">Date: {{ s.preferred_date }}</span>
          <span v-if="s.preferred_time">Time: {{ s.preferred_time }}</span>
          <span v-if="s.branch">Branch: {{ s.branch }}</span>
        </div>
        <div class="mt-3 flex gap-2">
          <Button size="sm" @click="openUpdate(s)">Update Status</Button>
        </div>
      </div>
    </div>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" @click.self="showModal=false">
        <div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6">
          <h2 class="font-display text-xl tracking-display text-white">Update Status</h2>
          <div class="mt-4 space-y-4">
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Status</label>
              <select v-model="updateForm.status" class="input-field w-full">
                <option value="pending">Pending</option>
                <option value="diagnosed">Diagnosed</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Cost (KSh)</label>
              <input v-model="updateForm.cost" type="number" class="input-field w-full" />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Notes</label>
              <textarea v-model="updateForm.notes" rows="3" class="input-field w-full resize-none" />
            </div>
            <div v-if="editingItem?.id_document || editingItem?.drivers_license" class="border-t border-brand-grey/20 pt-4">
              <label class="mb-2 block text-xs font-display tracking-display text-brand-grey uppercase">Documents</label>
              <div class="flex flex-wrap gap-3">
                <a v-if="editingItem.id_document" :href="pb.files.getURL(editingItem, editingItem.id_document)" target="_blank" rel="noopener" class="flex items-center gap-1.5 text-sm text-brand-red hover:underline"><FileText class="h-4 w-4" /> ID Document</a>
                <a v-if="editingItem.drivers_license" :href="pb.files.getURL(editingItem, editingItem.drivers_license)" target="_blank" rel="noopener" class="flex items-center gap-1.5 text-sm text-brand-red hover:underline"><FileText class="h-4 w-4" /> Driver's License</a>
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <Button variant="ghost" @click="showModal=false">Cancel</Button>
            <Button :disabled="saving" @click="saveUpdate">{{ saving ? 'Saving...' : 'Save' }}</Button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import { Wrench, FileText } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Service Requests - Nairobi Powerbikes' })
const pb = usePB(); const loading = ref(true); const saving = ref(false)
const items = ref<any[]>([]); const showModal = ref(false); const editingItem = ref<any>(null)
const updateForm = ref({ status: 'pending', cost: '', notes: '' })
function statusVariant(s: string) { const m: Record<string, string> = { pending: 'warning', diagnosed: 'default', in_progress: 'secondary', completed: 'success', cancelled: 'danger' }; return m[s] || 'outline' }
function openUpdate(s: any) { editingItem.value = s; updateForm.value = { status: s.status || 'pending', cost: s.cost?.toString() || '', notes: s.notes || '' }; showModal.value = true }
async function saveUpdate() { saving.value = true; try { const p: any = { status: updateForm.value.status, notes: updateForm.value.notes }; if (updateForm.value.cost) p.cost = parseFloat(updateForm.value.cost); await pb.collection('service_bookings').update(editingItem.value.id, p); showModal.value = false; await loadData() } catch (e) { console.error(e) } finally { saving.value = false } }
async function loadData() { try { const res = await pb.collection('service_bookings').getList(1, 100, { sort: '-created' }); items.value = res.items as any[] } catch (e) { console.error(e) } finally { loading.value = false } }
onMounted(() => { loadData(); pb.collection('service_bookings').subscribe('*', () => loadData()) })
onUnmounted(() => { pb.collection('service_bookings').unsubscribe('*') })
</script>
