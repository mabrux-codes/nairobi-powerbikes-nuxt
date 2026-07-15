<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-6">
      <h1 class="font-heading text-4xl text-white">Test <span class="text-brand-red">Rides</span></h1>
      <p class="mt-1 text-sm text-brand-grey">Manage customer test ride bookings</p>
    </div>
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-4">
        <div class="h-5 w-64 rounded bg-brand-grey/10" /><div class="mt-2 h-4 w-40 rounded bg-brand-grey/10" />
      </div>
    </div>
    <div v-else-if="items.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
      <Calendar class="mx-auto h-12 w-12 text-brand-grey/40" />
      <p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Test Rides</p>
    </div>
    <div v-else class="overflow-x-auto rounded-sm border border-brand-grey/20">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-brand-grey/20 bg-brand-black/80">
          <tr>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Customer</th>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Phone</th>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Email</th>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Motorcycle</th>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Date</th>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Time</th>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Status</th>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-brand-grey/10">
          <tr v-for="b in items" :key="b.id" class="transition-colors hover:bg-white/5">
            <td class="px-4 py-3 text-white">{{ b.name || b.expand?.user?.name || b.email || 'N/A' }}</td>
            <td class="px-4 py-3 text-brand-grey">{{ b.phone || 'N/A' }}</td>
            <td class="px-4 py-3 text-brand-grey">{{ b.email || 'N/A' }}</td>
            <td class="px-4 py-3 text-brand-grey">{{ b.motorcycle || 'N/A' }}</td>
            <td class="px-4 py-3 text-brand-grey">{{ b.preferred_date || 'N/A' }}</td>
            <td class="px-4 py-3 text-brand-grey">{{ b.preferred_time || 'N/A' }}</td>
            <td class="px-4 py-3"><Badge :variant="statusVariant(b.status)">{{ b.status }}</Badge></td>
            <td class="px-4 py-3 text-right"><Button variant="ghost" size="sm" @click="openUpdate(b)">Update</Button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" @click.self="showModal=false">
        <div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6">
          <h2 class="font-display text-xl tracking-display text-white">Update Test Ride</h2>
          <div class="mt-4 space-y-4">
            <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Status</label>
              <select v-model="updateForm.status" class="input-field w-full">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Notes</label>
              <textarea v-model="updateForm.notes" rows="3" class="input-field w-full resize-none" />
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
import { Calendar } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Test Rides - Nairobi Powerbikes' })
const pb = usePB(); const loading = ref(true); const saving = ref(false)
const items = ref<any[]>([]); const showModal = ref(false); const editingItem = ref<any>(null)
const updateForm = ref({ status: 'pending', notes: '' })
function statusVariant(s: string) { const m: Record<string, string> = { pending: 'warning', confirmed: 'secondary', completed: 'success', cancelled: 'danger' }; return m[s] || 'outline' }
function openUpdate(b: any) { editingItem.value = b; updateForm.value = { status: b.status || 'pending', notes: b.notes || '' }; showModal.value = true }
async function saveUpdate() { saving.value = true; try { await pb.collection('service_bookings').update(editingItem.value.id, updateForm.value); showModal.value = false; await loadData() } catch (e) { console.error(e) } finally { saving.value = false } }
async function loadData() { try { const res = await pb.collection('service_bookings').getList(1, 100, { sort: '-created', filter: 'type="test_ride"', expand: 'user' }); items.value = res.items as any[] } catch (e) { console.error(e) } finally { loading.value = false } }
onMounted(() => loadData())
</script>
