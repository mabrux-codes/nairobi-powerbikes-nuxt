<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-6">
      <h1 class="font-heading text-3xl text-white sm:text-4xl">Bookings</h1>
      <p class="mt-1 text-sm text-brand-grey">Manage test ride and service bookings</p>
    </div>
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-4">
        <div class="h-5 w-64 rounded bg-brand-grey/10" /><div class="mt-2 h-4 w-40 rounded bg-brand-grey/10" />
      </div>
    </div>
    <div v-else-if="items.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
      <Calendar class="mx-auto h-12 w-12 text-brand-grey/40" /><p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Bookings</p>
    </div>
    <div v-else class="overflow-x-auto rounded-sm border border-brand-grey/20">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-brand-grey/20 bg-brand-black/80">
          <tr>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Type</th>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Customer</th>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Motorcycle</th>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Date</th>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Status</th>
            <th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-brand-grey/10">
          <tr v-for="b in items" :key="b.id" class="transition-colors hover:bg-white/5">
            <td class="px-4 py-3"><Badge :variant="b._btype === 'test_ride' ? 'secondary' : 'default'">{{ b._btype === 'test_ride' ? 'Test Ride' : 'Service' }}</Badge></td>
            <td class="px-4 py-3 text-white">{{ b.expand?.user?.name || b.expand?.user?.email || 'N/A' }}</td>
            <td class="px-4 py-3 text-brand-grey">{{ b.motorcycle || 'N/A' }}</td>
            <td class="px-4 py-3 text-brand-grey">{{ formatDate(b.preferred_date) }}</td>
            <td class="px-4 py-3"><Badge :variant="statusVariant(b.status)">{{ b.status }}</Badge></td>
            <td class="px-4 py-3 text-right"><Button variant="ghost" size="sm" @click="openDetail(b)">View</Button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <Teleport to="body">
      <div v-if="showDetail" class="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-4 pb-4 md:items-center md:p-4" @click.self="showDetail=false">
        <div class="flex h-full w-full flex-col bg-brand-black md:h-auto md:max-h-[95vh] md:w-full md:max-w-5xl md:rounded-sm md:border md:border-brand-grey/30">
          <div class="flex shrink-0 items-center justify-between border-b border-brand-grey/20 px-4 py-3 md:px-6 md:py-4">
            <h2 class="font-display text-lg tracking-display text-white md:text-xl">Booking Details</h2>
            <button @click="showDetail=false" class="text-brand-grey hover:text-white"><X class="h-5 w-5" /></button>
          </div>
          <div class="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-4 pt-4 md:px-6 md:pb-6">
            <div class="space-y-4">
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><label class="text-xs font-display tracking-display text-brand-grey uppercase">Type</label><p class="mt-0.5"><Badge :variant="detailItem?._btype === 'test_ride' ? 'secondary' : 'default'">{{ detailItem?._btype === 'test_ride' ? 'Test Ride' : 'Service' }}</Badge></p></div>
                <div><label class="text-xs font-display tracking-display text-brand-grey uppercase">Status</label><p class="mt-0.5"><Badge :variant="statusVariant(detailItem?.status)">{{ detailItem?.status }}</Badge></p></div>
              </div>
              <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><label class="text-xs font-display tracking-display text-brand-grey uppercase">Name</label><p class="mt-0.5 text-sm text-white break-words">{{ detailItem?.name || detailItem?.expand?.user?.name || 'N/A' }}</p></div>
                <div><label class="text-xs font-display tracking-display text-brand-grey uppercase">Phone</label><p class="mt-0.5 text-sm text-white break-words">{{ detailItem?.phone || 'N/A' }}</p></div>
                <div class="sm:col-span-2"><label class="text-xs font-display tracking-display text-brand-grey uppercase">Email</label><p class="mt-0.5 text-sm text-white break-words">{{ detailItem?.email || 'N/A' }}</p></div>
              </div>
              <div class="border-t border-brand-grey/20 pt-4">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div><label class="text-xs font-display tracking-display text-brand-grey uppercase">Motorcycle</label><p class="mt-0.5 text-sm text-white break-words">{{ detailItem?.motorcycle || 'N/A' }}</p></div>
                  <div v-if="detailItem?.service_type"><label class="text-xs font-display tracking-display text-brand-grey uppercase">Service Type</label><p class="mt-0.5 text-sm text-white break-words">{{ detailItem.service_type }}</p></div>
                  <div><label class="text-xs font-display tracking-display text-brand-grey uppercase">Date</label><p class="mt-0.5 text-sm text-white break-words">{{ formatDate(detailItem?.preferred_date) }}</p></div>
                  <div><label class="text-xs font-display tracking-display text-brand-grey uppercase">Time</label><p class="mt-0.5 text-sm text-white break-words">{{ formatTime(detailItem?.preferred_time) }}</p></div>
                </div>
                <div class="mt-3"><label class="text-xs font-display tracking-display text-brand-grey uppercase">Branch</label><p class="mt-0.5 text-sm text-white break-words">{{ detailItem?.branch || 'N/A' }}</p></div>
                <div v-if="detailItem?.notes" class="mt-3"><label class="text-xs font-display tracking-display text-brand-grey uppercase">Notes</label><p class="mt-0.5 text-sm text-white whitespace-pre-wrap break-words">{{ detailItem.notes }}</p></div>
              </div>
              <div v-if="detailItem?.id_document || detailItem?.drivers_license" class="border-t border-brand-grey/20 pt-4">
                <label class="mb-2 block text-xs font-display tracking-display text-brand-grey uppercase">Uploaded Documents</label>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div v-if="detailItem.id_document">
                    <p class="mb-1 text-xs text-brand-grey">ID Document</p>
                    <img v-if="isImage(detailItem.id_document)" :src="pb.files.getURL(detailItem, detailItem.id_document)" class="max-h-48 w-full rounded-sm border border-brand-grey/20 object-contain cursor-pointer" @click="previewImg = pb.files.getURL(detailItem, detailItem.id_document)" />
                    <a v-else :href="pb.files.getURL(detailItem, detailItem.id_document)" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-sm text-brand-red hover:underline"><FileText class="h-4 w-4" /> View Document</a>
                  </div>
                  <div v-if="detailItem.drivers_license">
                    <p class="mb-1 text-xs text-brand-grey">Driver's License</p>
                    <img v-if="isImage(detailItem.drivers_license)" :src="pb.files.getURL(detailItem, detailItem.drivers_license)" class="max-h-48 w-full rounded-sm border border-brand-grey/20 object-contain cursor-pointer" @click="previewImg = pb.files.getURL(detailItem, detailItem.drivers_license)" />
                    <a v-else :href="pb.files.getURL(detailItem, detailItem.drivers_license)" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 text-sm text-brand-red hover:underline"><FileText class="h-4 w-4" /> View Document</a>
                  </div>
                </div>
              </div>
              <div class="border-t border-brand-grey/20 pt-4">
                <h3 class="mb-3 font-display text-base tracking-display text-white">Update Status</h3>
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Status</label>
                    <select v-model="updateDetailForm.status" class="input-field h-11 w-full">
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Notes</label>
                    <textarea v-model="updateDetailForm.notes" rows="2" class="input-field w-full resize-none" />
                  </div>
                </div>
                <div class="mt-4 flex justify-end gap-3">
                  <Button variant="ghost" @click="showDetail=false">Close</Button>
                  <Button :disabled="savingDetail" @click="saveDetailUpdate">{{ savingDetail ? 'Saving...' : 'Save Changes' }}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="previewImg" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4" @click.self="previewImg=''">
        <div class="relative max-h-[90vh] max-w-[90vw]">
          <button @click="previewImg=''" class="absolute -right-3 -top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-brand-red text-white"><X class="h-4 w-4" /></button>
          <img :src="previewImg" class="max-h-[90vh] max-w-[90vw] rounded-sm object-contain" />
        </div>
      </div>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import { Calendar, FileText, X } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { formatDate, formatTime } from '~/composables/useFormat'
definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Bookings - Nairobi Powerbikes' })
const pb = usePB(); const toast = useToast(); const confirmDlg = useConfirm(); const loading = ref(true); const savingDetail = ref(false)
const items = ref<any[]>([]); const showDetail = ref(false); const detailItem = ref<any>(null)
const previewImg = ref('')
const updateDetailForm = ref({ status: 'pending', notes: '' })
function statusVariant(s: string) { const m: Record<string, string> = { pending: 'warning', confirmed: 'secondary', in_progress: 'default', completed: 'success', cancelled: 'danger' }; return m[s] || 'outline' }
function isImage(filename: string) { return /\.(jpe?g|png)$/i.test(filename) }
function openDetail(b: any) { detailItem.value = b; updateDetailForm.value = { status: b.status || 'pending', notes: b.notes || '' }; showDetail.value = true }
async function saveDetailUpdate() { savingDetail.value = true; try { const coll = detailItem.value?._btype === 'test_ride' ? 'test_rides' : 'service_bookings'; await pb.collection(coll).update(detailItem.value.id, updateDetailForm.value); toast.add({ type: 'success', title: 'Booking updated successfully' }); showDetail.value = false; await loadData() } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update booking', message: e?.message || 'Something went wrong' }) } finally { savingDetail.value = false } }
async function loadData() { try { const [svc, tr] = await Promise.all([pb.collection('service_bookings').getList(1, 100, { sort: '-created', expand: 'user' }), pb.collection('test_rides').getList(1, 100, { sort: '-created', expand: 'user' })]); items.value = [...(svc.items as any[]).map(r => ({ ...r, _btype: 'service' })), ...(tr.items as any[]).map(r => ({ ...r, _btype: 'test_ride' }))] } catch (e) { console.error(e) } finally { loading.value = false } }
watch([showDetail, previewImg], ([sd, pi]) => { document.body.style.overflow = sd || pi ? 'hidden' : '' })
onMounted(() => { loadData(); pb.collection('service_bookings').subscribe('*', () => loadData()); pb.collection('test_rides').subscribe('*', () => loadData()) })
onUnmounted(() => { pb.collection('service_bookings').unsubscribe('*'); pb.collection('test_rides').unsubscribe('*'); document.body.style.overflow = '' })
</script>
