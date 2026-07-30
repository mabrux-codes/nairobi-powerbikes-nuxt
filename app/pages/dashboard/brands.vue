<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="font-heading text-4xl text-white">Brands</h1>
          <p class="mt-1 text-sm text-brand-grey">Manage motorcycle brands</p>
        </div>
        <Button size="sm" @click="openCreateModal">Add Brand</Button>
      </div>

      <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="i in 4" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-6">
          <div class="mx-auto mb-3 h-16 w-16 rounded-full bg-brand-grey/10" />
          <div class="mx-auto h-5 w-24 rounded bg-brand-grey/10" />
        </div>
      </div>

      <div v-else-if="brands.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
        <p class="font-display text-xl tracking-display text-brand-grey">No Brands Found</p>
        <p class="mt-2 text-sm text-brand-grey/60">Add your first brand to get started</p>
      </div>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="b in brands" :key="b.id" class="group rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6 text-center transition-all duration-200 hover:border-brand-red/30">
          <div v-if="b.logo" class="mx-auto mb-4 flex h-16 w-16 items-center justify-center">
            <img :src="pb.files.getURL(b, b.logo)" :alt="b.name" class="max-h-16 max-w-16 object-contain" />
          </div>
          <div v-else class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-grey/10">
            <span class="font-display text-2xl tracking-display text-brand-grey/40">{{ b.name?.slice(0, 2).toUpperCase() }}</span>
          </div>
          <h3 class="font-display text-lg tracking-display text-white">{{ b.name }}</h3>
          <p v-if="b.tagline" class="mt-1 text-xs text-brand-grey italic">{{ b.tagline }}</p>
          <p v-if="b.country" class="mt-1 text-xs text-brand-grey">{{ b.country }}</p>
          <div class="mt-4 flex justify-center gap-2">
            <Button variant="ghost" size="sm" @click="openEditModal(b)">Edit</Button>
            <Button variant="danger" size="sm" :disabled="deleting" @click="confirmDelete(b)">Delete</Button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" @click.self="closeModal">
        <div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6 my-8">
          <h2 class="font-display text-xl tracking-display text-white">{{ editingId ? 'Edit Brand' : 'Add Brand' }}</h2>
          <div class="mt-4 space-y-4">
            <Input v-model="form.name" label="Brand Name" placeholder="e.g. Kawasaki" />
            <Input v-model="form.tagline" label="Tagline" placeholder="e.g. Let the Good Times Roll" />
            <Input v-model="form.country" label="Country" placeholder="e.g. Japan" />
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Logo</label>
              <input type="file" accept="image/*" @change="onLogoChange" class="input-field w-full text-sm file:mr-3 file:border-0 file:bg-brand-red file:px-3 file:py-1 file:text-xs file:text-white" />
              <img v-if="logoPreview" :src="logoPreview" class="mt-2 h-12 object-contain" />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Description</label>
              <textarea v-model="form.description" rows="3" class="input-field w-full resize-none" placeholder="Brand description..." />
            </div>
            <Input v-model="form.sort_order" label="Sort Order" type="number" placeholder="0" />
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <Button variant="ghost" @click="closeModal">Cancel</Button>
            <Button :disabled="saving" @click="saveBrand">{{ saving ? 'Saving...' : 'Save' }}</Button>
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
useHead({ title: 'Brands - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const brands = ref<any[]>([])
const showModal = ref(false)
const editingId = ref<string | null>(null)
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)
const form = ref({ name: '', tagline: '', country: '', description: '', sort_order: '0' })

function openCreateModal() {
  editingId.value = null
  form.value = { name: '', tagline: '', country: '', description: '', sort_order: '0' }
  logoFile.value = null; logoPreview.value = null
  showModal.value = true
}

function openEditModal(b: any) {
  editingId.value = b.id
  form.value = { name: b.name, tagline: b.tagline || '', country: b.country || '', description: b.description || '', sort_order: b.sort_order?.toString() || '0' }
  logoFile.value = null
  logoPreview.value = b.logo ? pb.files.getURL(b, b.logo) : null
  showModal.value = true
}

function closeModal() { showModal.value = false }

function onLogoChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) {
    logoFile.value = target.files[0]
    logoPreview.value = URL.createObjectURL(target.files[0])
  }
}

async function saveBrand() {
  saving.value = true
  try {
    const data = new FormData()
    data.append('name', form.value.name)
    data.append('tagline', form.value.tagline)
    data.append('country', form.value.country)
    data.append('description', form.value.description)
    data.append('sort_order', form.value.sort_order || '0')
    if (!editingId.value) data.append('slug', form.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    if (logoFile.value) data.append('logo', logoFile.value)

    if (editingId.value) { await pb.collection('brands').update(editingId.value, data); toast.add({ type: 'success', title: 'Updated successfully' }) }
    else { await pb.collection('brands').create(data); toast.add({ type: 'success', title: 'Created successfully' }) }

    closeModal(); await loadBrands()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save', message: e?.message || 'Something went wrong' }) }
  finally { saving.value = false }
}

async function confirmDelete(b: any) {
  deleting.value = true
  try {
    const ok = await confirmDlg.confirm({ title: 'Delete Brand', message: `Are you sure you want to delete "${b.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
    if (ok) { await pb.collection('brands').delete(b.id); toast.add({ type: 'success', title: 'Deleted successfully' }); await loadBrands() }
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message || 'Something went wrong' }) }
  finally { deleting.value = false }
}

async function loadBrands() {
  try {
    const res = await pb.collection('brands').getList(1, 100, { sort: 'sort_order,name' })
    brands.value = res.items as any[]
  } catch (e) { console.error(e) }
}

onMounted(async () => { await loadBrands(); loading.value = false })
</script>
