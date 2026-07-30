<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div><h1 class="font-heading text-4xl text-white">Branches</h1><p class="mt-1 text-sm text-brand-grey">Manage dealership branches</p></div>
      <Button size="sm" @click="openCreate">Add Branch</Button>
    </div>
    <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="i in 3" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="h-5 w-3/4 rounded bg-brand-grey/10" /><div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10" /></div>
    </div>
    <div v-else-if="items.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
      <MapPin class="mx-auto h-12 w-12 text-brand-grey/40" /><p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Branches</p>
    </div>
    <div v-else>
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div v-for="b in items" :key="b.id" class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 transition-colors hover:border-brand-red/30">
          <h3 class="font-display text-lg tracking-display text-white">{{ b.name }}</h3>
          <p class="mt-1 text-xs text-brand-grey">{{ b.address }}</p>
          <p class="mt-2 text-sm text-brand-grey">{{ b.phone }} &middot; {{ b.email }}</p>
          <p class="mt-1 text-xs text-brand-grey/60 whitespace-pre-line">{{ b.hours }}</p>
          <div class="mt-4 flex gap-2"><Button variant="ghost" size="sm" @click="openEdit(b)">Edit</Button><Button variant="danger" size="sm" :disabled="deleting" @click="confirmDelete(b)">Delete</Button></div>
        </div>
      </div>
      <ClientOnly>
        <LeafletMap v-if="mapBranches.length" :branches="mapBranches" height="350px" />
      </ClientOnly>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" @click.self="closeModal">
        <div class="w-full max-w-lg rounded-sm border border-brand-grey/30 bg-brand-black p-6">
          <h2 class="font-display text-xl tracking-display text-white">{{ editingId ? 'Edit Branch' : 'Add Branch' }}</h2>
          <div class="mt-4 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="form.name" label="Name" />
              <Input v-model="form.slug" label="Slug" placeholder="branch-name" />
            </div>
            <Input v-model="form.address" label="Address" />
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="form.phone" label="Phone" />
              <Input v-model="form.email" label="Email" />
            </div>
            <Input v-model="form.hours" label="Hours" placeholder="Mon-Sat: 8:00 AM - 6:00 PM" />
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="form.lat" label="Latitude" type="number" placeholder="-1.326" />
              <Input v-model="form.lng" label="Longitude" type="number" placeholder="36.845" />
            </div>
            <Input v-model="form.map_url" label="Google Maps URL" placeholder="https://maps.google.com/?q=..." />
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Image</label>
              <input type="file" accept="image/*" @change="onImageChange" class="input-field w-full text-sm file:mr-3 file:border-0 file:bg-brand-red file:px-3 file:py-1 file:text-xs file:text-white" />
              <img v-if="imagePreview" :src="imagePreview" class="mt-2 h-20 object-cover rounded-sm" />
            </div>
            <Input v-model="form.sort_order" label="Sort Order" type="number" placeholder="0" />
          </div>
          <div class="mt-6 flex justify-end gap-3"><Button variant="ghost" @click="closeModal">Cancel</Button><Button :disabled="saving" @click="saveItem">{{ saving ? 'Saving...' : 'Save' }}</Button></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Branches - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const loading = ref(true); const saving = ref(false); const deleting = ref(false)
const items = ref<any[]>([]); const showModal = ref(false); const editingId = ref<string | null>(null)
const imageFile = ref<File | null>(null); const imagePreview = ref<string | null>(null)

const form = ref({ name: '', slug: '', address: '', phone: '', email: '', hours: '', lat: '', lng: '', map_url: '', sort_order: '0' })

const mapBranches = computed(() => items.value.filter(b => b.lat != null && b.lng != null).map(b => ({ name: b.name, address: b.address, phone: b.phone, hours: b.hours, lat: b.lat, lng: b.lng })))

function openCreate() { editingId.value = null; form.value = { name: '', slug: '', address: '', phone: '', email: '', hours: '', lat: '', lng: '', map_url: '', sort_order: '0' }; imageFile.value = null; imagePreview.value = null; showModal.value = true }

function openEdit(b: any) {
  editingId.value = b.id
  form.value = { name: b.name, slug: b.slug || '', address: b.address || '', phone: b.phone || '', email: b.email || '', hours: b.hours || '', lat: b.lat?.toString() || '', lng: b.lng?.toString() || '', map_url: b.map_url || '', sort_order: b.sort_order?.toString() || '0' }
  imageFile.value = null; imagePreview.value = b.image ? pb.files.getURL(b, b.image) : null
  showModal.value = true
}

function closeModal() { showModal.value = false }

function onImageChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) { imageFile.value = target.files[0]; imagePreview.value = URL.createObjectURL(target.files[0]) }
}

async function saveItem() {
  saving.value = true
  try {
    const data = new FormData()
    const fields = ['name', 'slug', 'address', 'phone', 'email', 'hours', 'map_url', 'sort_order']
    for (const f of fields) { if (form.value[f as keyof typeof form.value]) data.append(f, String(form.value[f as keyof typeof form.value])) }
    if (form.value.lat) data.append('lat', form.value.lat)
    if (form.value.lng) data.append('lng', form.value.lng)
    if (imageFile.value) data.append('image', imageFile.value)

    if (editingId.value) { await pb.collection('branches').update(editingId.value, data); toast.add({ type: 'success', title: 'Updated successfully' }) }
    else { await pb.collection('branches').create(data); toast.add({ type: 'success', title: 'Created successfully' }) }
    closeModal(); await loadData()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save', message: e?.message || 'Something went wrong' }) }
  finally { saving.value = false }
}

async function confirmDelete(b: any) { deleting.value = true; try { const ok = await confirmDlg.confirm({ title: 'Delete Branch', message: `Are you sure you want to delete "${b.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' }); if (ok) { await pb.collection('branches').delete(b.id); toast.add({ type: 'success', title: 'Deleted successfully' }); await loadData() } } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message || 'Something went wrong' }) } finally { deleting.value = false } }

async function loadData() { try { const res = await pb.collection('branches').getList(1, 50, { sort: 'sort_order' }); items.value = res.items as any[] } catch (e) { console.error(e) } finally { loading.value = false } }

onMounted(() => loadData())
</script>
