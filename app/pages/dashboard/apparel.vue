<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="font-heading text-4xl text-white">Apparel</h1>
          <p class="mt-1 text-sm text-brand-grey">Manage apparel inventory</p>
        </div>
        <Button size="sm" @click="openCreateModal">Add Apparel</Button>
      </div>

      <div class="mb-4 flex flex-wrap gap-3">
        <Input v-model="searchQuery" placeholder="Search apparel..." class="w-64" />
        <select v-model="typeFilter" class="input-field w-44">
          <option value="">All Types</option>
          <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
        </select>
      </div>

      <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-5">
          <div class="mb-3 h-40 rounded-sm bg-brand-grey/10" />
          <div class="h-5 w-3/4 rounded bg-brand-grey/10" />
          <div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10" />
        </div>
      </div>

      <div v-else-if="filtered.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
        <p class="font-display text-xl tracking-display text-brand-grey">No Apparel Found</p>
        <p class="mt-2 text-sm text-brand-grey/60">Add your first apparel item to the inventory</p>
      </div>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="a in filtered" :key="a.id" class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-4 transition-all duration-200 hover:border-brand-red/30">
          <div class="mb-3 flex aspect-video items-center justify-center rounded-sm bg-brand-grey/10">
            <span class="font-display text-4xl tracking-display text-brand-grey/20">{{ a.name?.slice(0, 1) }}</span>
          </div>
          <h3 class="font-display text-lg tracking-display text-white truncate">{{ a.name }}</h3>
          <p class="text-sm text-brand-grey">{{ a.type || 'General' }} &middot; {{ a.size || 'N/A' }}</p>
          <div class="mt-3 flex items-center justify-between">
            <span class="text-lg font-bold text-brand-red">KSh {{ formatPrice(a.price) }}</span>
            <Badge :variant="a.in_stock ? 'success' : 'danger'">{{ a.in_stock ? 'In Stock' : 'Out of Stock' }}</Badge>
          </div>
          <div class="mt-3 flex gap-2">
            <Button variant="ghost" size="sm" class="flex-1" @click="openEditModal(a)">Edit</Button>
            <Button variant="danger" size="sm" class="flex-1" :disabled="deleting" @click="confirmDelete(a)">Delete</Button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" @click.self="closeModal">
        <div class="w-full max-w-lg rounded-sm border border-brand-grey/30 bg-brand-black p-6 my-8">
          <h2 class="font-display text-xl tracking-display text-white">{{ editingId ? 'Edit Apparel' : 'Add Apparel' }}</h2>
          <div class="mt-4 space-y-4">
            <Input v-model="form.name" label="Name" placeholder="Apparel name" />
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Type</label>
                <select v-model="form.type" class="input-field w-full"><option value="">Select</option><option v-for="t in types" :key="t" :value="t">{{ t }}</option></select>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Size</label>
                <select v-model="form.size" class="input-field w-full"><option value="">Select</option><option v-for="s in sizes" :key="s" :value="s">{{ s }}</option></select>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="form.price" label="Price (KSh)" type="number" placeholder="0" />
              <Input v-model="form.color" label="Color" placeholder="e.g. Black" />
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Description</label>
              <textarea v-model="form.description" rows="3" class="input-field w-full resize-none" placeholder="Description..." />
            </div>
            <div class="flex items-center gap-3">
              <input id="inStockA" v-model="form.in_stock" type="checkbox" class="h-4 w-4 accent-brand-red" />
              <label for="inStockA" class="text-sm text-brand-grey">In Stock</label>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <Button variant="ghost" @click="closeModal">Cancel</Button>
            <Button :disabled="saving" @click="saveItem">{{ saving ? 'Saving...' : 'Save' }}</Button>
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
useHead({ title: 'Apparel - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const items = ref<any[]>([])
const types = ['T-Shirts', 'Jackets', 'Hoodies', 'Caps', 'Gloves', 'Pants', 'Vests', 'Other']
const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
const searchQuery = ref('')
const typeFilter = ref('')
const showModal = ref(false)
const editingId = ref<string | null>(null)
const form = ref({ name: '', type: '', size: '', price: '', color: '', description: '', in_stock: true })

function formatPrice(p: number) { return p ? p.toLocaleString() : '0' }

const filtered = computed(() => {
  return items.value.filter(a => {
    if (searchQuery.value && !a.name.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    if (typeFilter.value && a.type !== typeFilter.value) return false
    return true
  })
})

function openCreateModal() {
  editingId.value = null; form.value = { name: '', type: '', size: '', price: '', color: '', description: '', in_stock: true }; showModal.value = true
}

function openEditModal(a: any) {
  editingId.value = a.id; form.value = { name: a.name, type: a.type || '', size: a.size || '', price: a.price?.toString() || '', color: a.color || '', description: a.description || '', in_stock: a.in_stock ?? true }; showModal.value = true
}

function closeModal() { showModal.value = false }

async function saveItem() {
  saving.value = true
  try {
    const payload: any = { ...form.value, price: parseFloat(form.value.price) || 0 }
    if (editingId.value) { await pb.collection('apparel').update(editingId.value, payload); toast.add({ type: 'success', title: 'Updated successfully' }) }
    else { await pb.collection('apparel').create(payload); toast.add({ type: 'success', title: 'Created successfully' }) }
    closeModal(); await loadItems()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save', message: e?.message || 'Something went wrong' }) }
  finally { saving.value = false }
}

async function confirmDelete(a: any) {
  deleting.value = true
  try {
    const ok = await confirmDlg.confirm({ title: 'Delete Apparel', message: `Are you sure you want to delete "${a.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
    if (ok) { await pb.collection('apparel').delete(a.id); toast.add({ type: 'success', title: 'Deleted successfully' }); await loadItems() }
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message || 'Something went wrong' }) }
  finally { deleting.value = false }
}

async function loadItems() {
  try { const res = await pb.collection('apparel').getList(1, 100, { sort: '-created' }); items.value = res.items as any[] }
  catch (e) { console.error(e) }
}

onMounted(async () => { await loadItems(); loading.value = false })
</script>
