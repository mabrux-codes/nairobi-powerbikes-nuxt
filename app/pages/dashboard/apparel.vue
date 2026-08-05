<template>
  <div class="mx-auto max-w-7xl space-y-6">
    <!-- Header -->
    <motion.div :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.4 }" class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <span class="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3 py-1 text-[10px] font-display tracking-[0.25em] text-pink-400 uppercase">
          <span class="h-1.5 w-1.5 rounded-full bg-pink-400 animate-pulse" />
          Inventory
        </span>
        <h1 class="mt-3 font-heading text-3xl sm:text-4xl text-white">Apparel <span class="text-brand-red">Catalogue</span></h1>
        <p class="mt-1 text-sm text-brand-grey">Riding apparel — stock updates live</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-brand-grey/70">Updated {{ store.lastUpdated }}</span>
        <RealtimeStatus />
        <Button size="sm" @click="openCreateModal"><Plus class="h-4 w-4" />Add Apparel</Button>
      </div>
    </motion.div>

    <!-- Stats -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="card in stats" :key="card.label" class="group relative overflow-hidden rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-pink-500/40">
        <span v-if="card.dot" class="absolute top-0 left-0 h-0.5 w-0 bg-brand-red transition-all duration-300 group-hover:w-full" />
        <div class="flex items-center justify-between">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg" :class="card.iconBg">
            <component :is="card.icon" class="h-5 w-5" :class="card.iconColor" />
          </span>
          <span class="font-heading text-2xl text-white">{{ card.value }}</span>
        </div>
        <p class="mt-3 font-display text-xs tracking-display text-brand-grey uppercase">{{ card.label }}</p>
      </div>
    </div>

    <!-- Filters -->
    <motion.div :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.08, duration: 0.4 }" class="rounded-xl border border-brand-grey/15 bg-brand-black/80 p-4 flex flex-wrap items-center gap-3">
      <div class="relative flex-1 min-w-[200px]">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-grey/50" />
        <input v-model="searchQuery" type="text" placeholder="Search apparel…" class="w-full h-9 pl-9 pr-3 text-sm text-white bg-white/[0.04] border border-brand-grey/15 rounded-lg placeholder:text-brand-grey/50 focus:outline-none focus:border-pink-500/60 focus:ring-2 focus:ring-pink-500/20 transition-all" />
      </div>
      <select v-model="typeFilter" class="h-9 text-sm bg-brand-black/60 border border-brand-grey/15 rounded-lg text-white px-3 focus:outline-none focus:border-pink-500/60">
        <option value="">All Types</option>
        <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
      </select>
      <select v-model="sizeFilter" class="h-9 text-sm bg-brand-black/60 border border-brand-grey/15 rounded-lg text-white px-3 focus:outline-none focus:border-pink-500/60">
        <option value="">All Sizes</option>
        <option v-for="s in sizes" :key="s" :value="s">{{ s }}</option>
      </select>
      <select v-model="stockFilter" class="h-9 text-sm bg-brand-black/60 border border-brand-grey/15 rounded-lg text-white px-3 focus:outline-none focus:border-pink-500/60">
        <option value="">All Stock</option>
        <option value="in">In Stock</option>
        <option value="out">Out of Stock</option>
      </select>
      <div class="flex items-center rounded-lg border border-brand-grey/15 p-0.5">
        <button class="h-8 px-3 text-xs font-semibold rounded-md transition-colors" :class="view === 'grid' ? 'bg-brand-red text-white' : 'text-brand-grey hover:text-white'" @click="view = 'grid'"><LayoutGrid class="h-3.5 w-3.5 inline mr-1" />Grid</button>
        <button class="h-8 px-3 text-xs font-semibold rounded-md transition-colors" :class="view === 'table' ? 'bg-brand-red text-white' : 'text-brand-grey hover:text-white'" @click="view = 'table'"><List class="h-3.5 w-3.5 inline mr-1" />Table</button>
      </div>
      <button v-if="hasFilters" class="h-9 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 rounded-lg transition-colors" @click="resetFilters">
        Clear <X class="h-3.5 w-3.5 inline -ml-0.5" />
      </button>
    </motion.div>

    <!-- Bulk bar -->
    <div v-if="selectedIds.size > 0" class="flex items-center justify-between rounded-xl border border-brand-red/30 bg-brand-red/10 px-4 py-3">
      <p class="text-sm text-white"><span class="font-semibold text-brand-red">{{ selectedIds.size }}</span> selected</p>
      <div class="flex gap-2">
        <Button size="sm" variant="ghost" @click="exportCsv">Export CSV</Button>
        <Button size="sm" variant="danger" :disabled="deleting" @click="bulkDelete">{{ deleting ? 'Deleting…' : 'Delete Selected' }}</Button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="!store.ready" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 8" :key="i" class="animate-pulse rounded-xl border border-brand-grey/15 bg-brand-black/60 p-4">
        <div class="mb-3 aspect-square rounded-lg bg-brand-grey/10" />
        <div class="h-5 w-3/4 rounded bg-brand-grey/10" />
        <div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10" />
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="filtered.length === 0" class="rounded-2xl border border-dashed border-brand-grey/20 bg-brand-black/40 p-14 text-center">
      <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-pink-500/10">
        <Shirt class="h-8 w-8 text-pink-400/60" />
      </div>
      <p class="font-display text-xl tracking-display text-brand-grey">No apparel found</p>
      <p class="mt-2 text-sm text-brand-grey/60">New apparel items appear here instantly.</p>
    </div>

    <!-- Grid -->
    <div v-else-if="view === 'grid'" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <motion.div
        v-for="a in paginated"
        :key="a.id"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.3 }"
        class="group relative overflow-hidden rounded-xl border border-brand-grey/15 bg-brand-black/80 transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/40 hover:shadow-lg hover:shadow-pink-500/5"
      >
        <button
          class="absolute top-3 left-3 z-10 flex h-7 w-7 items-center justify-center rounded-lg border transition-all"
          :class="selectedIds.has(a.id) ? 'bg-brand-red border-brand-red text-white' : 'border-brand-grey/25 bg-brand-black/70 text-brand-grey hover:text-white'"
          @click.stop="toggleSelect(a.id)"
          :aria-label="selectedIds.has(a.id) ? 'Deselect' : 'Select'"
        >
          <Check class="h-3.5 w-3.5" :class="selectedIds.has(a.id) ? '' : 'opacity-0'" />
        </button>

        <div class="relative mb-3 flex aspect-square items-center justify-center overflow-hidden bg-brand-grey/10">
          <img v-if="a.image" :src="filesUrl(a, a.image)" :alt="a.name" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <span v-else class="font-display text-5xl tracking-display text-brand-grey/20">{{ a.name?.slice(0, 1) }}</span>
        </div>

        <div class="p-4 pt-0">
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="text-[10px] font-display tracking-[0.2em] text-brand-grey/70 uppercase">{{ a.type || 'General' }} <template v-if="a.color"> · {{ a.color }}</template></p>
              <h3 class="font-display text-base tracking-display text-white truncate">{{ a.name }}</h3>
            </div>
            <StatusChip :status="a.in_stock ? 'in_stock' : 'out_of_stock'" size="sm" />
          </div>
          <p class="mt-1 text-lg font-bold text-brand-red">KSh {{ formatPrice(a.price) }}</p>
          <div class="mt-3 flex items-center justify-between">
            <span class="text-xs text-brand-grey">Size <span class="text-white font-semibold">{{ a.size || 'N/A' }}</span></span>
            <div class="flex gap-1.5">
              <Button variant="ghost" size="sm" @click="openEditModal(a)">Edit</Button>
              <Button variant="danger" size="sm" :disabled="deleting" @click="confirmDelete(a)">Delete</Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>

    <!-- Table -->
    <motion.div v-else :initial="{ opacity: 0, y: 16 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.12, duration: 0.4 }" class="rounded-xl border border-brand-grey/15 bg-brand-black/80 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-brand-black/60 border-b border-brand-grey/15">
            <tr>
              <th class="sticky top-0 px-4 py-3.5 bg-brand-black/95">
                <input type="checkbox" class="accent-brand-red" :checked="pageAllSelected" @change="togglePage" />
              </th>
              <th class="sticky top-0 px-4 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95 cursor-pointer select-none hover:text-white" @click="setSort('name')">Item <span v-if="sortKey === 'name'" class="text-brand-red">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></th>
              <th class="sticky top-0 px-4 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95">Type</th>
              <th class="sticky top-0 px-4 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95">Size</th>
              <th class="sticky top-0 px-4 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95 cursor-pointer select-none hover:text-white" @click="setSort('price')">Price <span v-if="sortKey === 'price'" class="text-brand-red">{{ sortDir === 'asc' ? '↑' : '↓' }}</span></th>
              <th class="sticky top-0 px-4 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95">Stock</th>
              <th class="sticky top-0 px-4 py-3.5 font-display text-[10px] tracking-[0.2em] text-brand-grey uppercase bg-brand-black/95 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-brand-grey/10">
            <tr v-for="a in paginated" :key="a.id" class="transition-colors hover:bg-white/[0.03]">
              <td class="px-4 py-3">
                <input type="checkbox" class="accent-brand-red" :checked="selectedIds.has(a.id)" @change="toggleSelect(a.id)" />
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="h-10 w-10 rounded-lg overflow-hidden bg-brand-grey/10 shrink-0 flex items-center justify-center">
                    <img v-if="a.image" :src="filesUrl(a, a.image)" :alt="a.name" class="h-full w-full object-cover" />
                    <span v-else class="text-xs text-brand-grey/40 font-bold">{{ a.name?.slice(0, 1) }}</span>
                  </div>
                  <p class="text-sm font-medium text-white truncate">{{ a.name }}</p>
                </div>
              </td>
              <td class="px-4 py-3"><span class="text-xs text-brand-grey capitalize">{{ a.type || 'General' }}</span></td>
              <td class="px-4 py-3 text-brand-grey">{{ a.size || '—' }}</td>
              <td class="px-4 py-3 text-sm font-semibold text-brand-red">KSh {{ formatPrice(a.price) }}</td>
              <td class="px-4 py-3"><StatusChip :status="a.in_stock ? 'in_stock' : 'out_of_stock'" size="sm" /></td>
              <td class="px-4 py-3 text-right whitespace-nowrap">
                <button class="p-1.5 text-brand-grey hover:text-white hover:bg-white/5 rounded-md transition-colors" title="Edit" @click="openEditModal(a)"><Pencil class="h-4 w-4" /></button>
                <button class="p-1.5 text-rose-400 hover:text-white hover:bg-rose-500/15 rounded-md transition-colors" title="Delete" @click="confirmDelete(a)"><Trash2 class="h-4 w-4" /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex items-center justify-between border-t border-brand-grey/15 px-5 py-3">
        <div class="flex gap-3">
          <p class="text-xs text-brand-grey">Showing <span class="text-white font-semibold">{{ pageStart + 1 }}–{{ pageEnd }}</span> of <span class="text-white font-semibold">{{ filtered.length }}</span></p>
          <button class="text-xs font-semibold text-brand-grey hover:text-brand-red transition-colors" @click="exportCsv">Export CSV</button>
        </div>
        <div class="flex gap-2">
          <button :disabled="page === 1" class="h-8 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg transition-colors" @click="page--">Prev</button>
          <button :disabled="page >= totalPages" class="h-8 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg transition-colors" @click="page++">Next</button>
        </div>
      </div>
    </motion.div>

    <!-- Pagination (grid) -->
    <div v-if="view === 'grid' && filtered.length > 0" class="flex items-center justify-between">
      <p class="text-xs text-brand-grey">Showing <span class="text-white font-semibold">{{ pageStart + 1 }}–{{ pageEnd }}</span> of <span class="text-white font-semibold">{{ filtered.length }}</span></p>
      <div class="flex gap-2">
        <button :disabled="page === 1" class="h-8 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg transition-colors" @click="page--">Prev</button>
        <button :disabled="page >= totalPages" class="h-8 px-3 text-xs font-semibold text-brand-grey hover:text-white hover:bg-white/5 disabled:opacity-30 rounded-lg transition-colors" @click="page++">Next</button>
      </div>
    </div>

    <!-- Drawer -->
    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="showModal" class="fixed inset-0 z-[70]">
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeModal" />
          <div class="absolute right-0 top-0 h-full w-full max-w-xl bg-brand-black border-l border-brand-grey/20 shadow-2xl shadow-black/60 flex flex-col">
            <div class="flex items-center justify-between border-b border-brand-grey/15 px-6 py-4 shrink-0">
              <h2 class="font-display text-lg tracking-display text-white">{{ editingId ? 'Edit Apparel' : 'Add Apparel' }}</h2>
              <button class="p-2 text-brand-grey hover:text-white hover:bg-white/5 rounded-lg transition-colors" @click="closeModal" aria-label="Close"><X class="h-5 w-5" /></button>
            </div>
            <div class="flex-1 overflow-y-auto px-6 py-5 space-y-4 scrollbar-thin">
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
              <label class="flex items-center gap-3 text-sm text-brand-grey cursor-pointer">
                <input v-model="form.in_stock" type="checkbox" class="h-4 w-4 accent-brand-red" />
                In Stock
              </label>
              <div>
                <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Image</label>
                <input type="file" accept="image/*" @change="onImageChange" class="input-field w-full text-sm file:mr-3 file:border-0 file:bg-brand-red file:px-3 file:py-1 file:text-xs file:text-white file:rounded-lg" />
                <div v-if="imagePreview" class="mt-2 relative inline-block">
                  <img :src="imagePreview" class="h-20 w-20 rounded-lg object-cover border border-brand-grey/20" />
                  <button class="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-brand-red text-white flex items-center justify-center" @click="clearImage"><X class="h-3 w-3" /></button>
                </div>
              </div>
            </div>
            <div class="flex justify-end gap-3 border-t border-brand-grey/15 px-6 py-4 shrink-0">
              <Button variant="ghost" @click="closeModal">Cancel</Button>
              <Button :disabled="saving" @click="saveItem">{{ saving ? 'Saving…' : 'Save Apparel' }}</Button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Plus, Search, X, Shirt, LayoutGrid, List, Check, Pencil, Trash2, Layers, Boxes, Tags } from 'lucide-vue-next'
import StatusChip from '~/components/dashboard/StatusChip.vue'
import RealtimeStatus from '~/components/dashboard/RealtimeStatus.vue'
import { useAdminDataStore } from '~/stores/adminData'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Apparel - Nairobi Powerbikes' })

const store = useAdminDataStore()
const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const route = useRoute()

const types = ['T-Shirts', 'Jackets', 'Hoodies', 'Caps', 'Gloves', 'Pants', 'Vests', 'Other']
const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']

const view = ref<'grid' | 'table'>('grid')
const searchQuery = ref((route.query.q as string) || '')
const typeFilter = ref('')
const sizeFilter = ref('')
const stockFilter = ref('')
const page = ref(1)
const PAGE_SIZE = 12

const saving = ref(false)
const deleting = ref(false)
const showModal = ref(false)
const editingId = ref<string | null>(null)
const imageFile = ref<File | null>(null)
const imagePreview = ref('')
const selectedIds = ref<Set<string>>(new Set())

const sortKey = ref('name')
const sortDir = ref<'asc' | 'desc'>('asc')

const form = ref({ name: '', type: '', size: '', price: '', color: '', description: '', in_stock: true })

const stats = computed(() => {
  const all = store.apparel
  return [
    { label: 'Total Items', value: all.length, icon: Shirt, iconBg: 'bg-pink-500/15', iconColor: 'text-pink-400', dot: true },
    { label: 'In Stock', value: all.filter(a => a.in_stock).length, icon: Boxes, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400' },
    { label: 'Out of Stock', value: all.filter(a => !a.in_stock).length, icon: Layers, iconBg: 'bg-rose-500/15', iconColor: 'text-rose-400' },
    { label: 'Types', value: new Set(all.map(a => a.type).filter(Boolean)).size, icon: Tags, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400' },
  ]
})

const hasFilters = computed(() => searchQuery.value || typeFilter.value || sizeFilter.value || stockFilter.value || selectedIds.value.size > 0)

const filtered = computed(() => {
  let list = store.apparel.slice()
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(a => [a.name, a.type, a.color, a.size].some(v => String(v || '').toLowerCase().includes(q)))
  }
  if (typeFilter.value) list = list.filter(a => a.type === typeFilter.value)
  if (sizeFilter.value) list = list.filter(a => a.size === sizeFilter.value)
  if (stockFilter.value === 'in') list = list.filter(a => a.in_stock)
  if (stockFilter.value === 'out') list = list.filter(a => !a.in_stock)
  const dir = sortDir.value === 'asc' ? 1 : -1
  list.sort((a, b) => {
    if (sortKey.value === 'price') return ((a.price || 0) - (b.price || 0)) * dir
    return String(a[sortKey.value] || '').localeCompare(String(b[sortKey.value] || '')) * dir
  })
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / PAGE_SIZE)))
const pageStart = computed(() => (page.value - 1) * PAGE_SIZE)
const pageEnd = computed(() => Math.min(page.value * PAGE_SIZE, filtered.value.length))
const paginated = computed(() => filtered.value.slice(pageStart.value, pageEnd.value))

const pageAllSelected = computed(() => paginated.value.length > 0 && paginated.value.every(a => selectedIds.value.has(a.id)))

watch([searchQuery, typeFilter, sizeFilter, stockFilter, view], () => { page.value = 1 })

function setSort(key: string) {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = key; sortDir.value = 'asc' }
}

function toggleSelect(id: string) {
  const next = new Set(selectedIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  selectedIds.value = next
}

function togglePage() {
  const next = new Set(selectedIds.value)
  if (pageAllSelected.value) paginated.value.forEach(a => next.delete(a.id))
  else paginated.value.forEach(a => next.add(a.id))
  selectedIds.value = next
}

function resetFilters() {
  searchQuery.value = ''
  typeFilter.value = ''
  sizeFilter.value = ''
  stockFilter.value = ''
  selectedIds.value = new Set()
}

function formatPrice(p: number) { return p ? p.toLocaleString() : '0' }

function filesUrl(rec: any, file: string) { return pb.files.getURL(rec, file) }

function openCreateModal() {
  editingId.value = null
  form.value = { name: '', type: '', size: '', price: '', color: '', description: '', in_stock: true }
  imageFile.value = null
  imagePreview.value = ''
  showModal.value = true
}

function openEditModal(a: any) {
  editingId.value = a.id
  form.value = { name: a.name, type: a.type || '', size: a.size || '', price: a.price?.toString() || '', color: a.color || '', description: a.description || '', in_stock: a.in_stock ?? true }
  imageFile.value = null
  imagePreview.value = a.image ? pb.files.getURL(a, a.image) : ''
  showModal.value = true
}

function closeModal() { showModal.value = false }

function onImageChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    imageFile.value = target.files[0]
    imagePreview.value = URL.createObjectURL(imageFile.value)
  }
}

function clearImage() {
  imageFile.value = null
  imagePreview.value = ''
}

async function saveItem() {
  saving.value = true
  try {
    const data = new FormData()
    data.append('name', form.value.name)
    data.append('type', form.value.type || '')
    data.append('size', form.value.size || '')
    data.append('price', String(parseFloat(form.value.price) || 0))
    data.append('color', form.value.color || '')
    data.append('description', form.value.description || '')
    data.append('in_stock', form.value.in_stock ? 'true' : 'false')
    if (imageFile.value) data.append('image', imageFile.value)
    if (!imageFile.value && imagePreview.value === '' && editingId.value) data.append('image', '')

    if (editingId.value) {
      await pb.collection('apparel').update(editingId.value, data)
      toast.add({ type: 'success', title: 'Apparel updated' })
    } else {
      await pb.collection('apparel').create(data)
      toast.add({ type: 'success', title: 'Apparel added' })
    }
    closeModal()
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Failed to save', message: e?.message || 'Something went wrong' })
  } finally {
    saving.value = false
  }
}

async function confirmDelete(a: any) {
  deleting.value = true
  try {
    const ok = await confirmDlg.confirm({ title: 'Delete Apparel', message: `Delete "${a.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
    if (ok) {
      await pb.collection('apparel').delete(a.id)
      toast.add({ type: 'success', title: 'Apparel deleted' })
    }
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Delete failed', message: e?.message || 'Something went wrong' })
  } finally {
    deleting.value = false
  }
}

async function bulkDelete() {
  const ids = [...selectedIds.value]
  if (!ids.length) return
  deleting.value = true
  try {
    const ok = await confirmDlg.confirm({ title: `Delete ${ids.length} item(s)?`, message: 'This cannot be undone.', confirmText: 'Delete', confirmType: 'danger' })
    if (ok) {
      await Promise.all(ids.map(id => pb.collection('apparel').delete(id)))
      toast.add({ type: 'success', title: `${ids.length} item(s) deleted` })
      selectedIds.value = new Set()
    }
  } catch (e: any) {
    toast.add({ type: 'error', title: 'Bulk delete failed', message: e?.message || 'Something went wrong' })
  } finally {
    deleting.value = false
  }
}

function exportCsv() {
  const rows = filtered.value.map(a => [a.name, a.type || '', a.size || '', a.price || 0, a.color || '', a.in_stock ? 'in_stock' : 'out_of_stock'].join(','))
  const csv = ['Name,Type,Size,Price,Color,Stock', ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const el = document.createElement('a')
  el.href = URL.createObjectURL(blob)
  el.download = `apparel-${new Date().toISOString().slice(0, 10)}.csv`
  el.click()
  URL.revokeObjectURL(el.href)
}

onMounted(async () => {
  await store.ensureActive()
  if (route.query.create === '1') openCreateModal()
  else if (route.query.edit) {
    const found = store.apparel.find(a => a.id === route.query.edit)
    if (found) openEditModal(found)
  }
})

onUnmounted(() => { store.release() })

watch(showModal, (v) => { document.body.style.overflow = v ? 'hidden' : '' })
</script>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: opacity 0.25s ease; }
.drawer-enter-active .absolute.right-0, .drawer-leave-active .absolute.right-0 { transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.drawer-enter-from, .drawer-leave-to { opacity: 0; }
.drawer-enter-from .absolute.right-0 { transform: translateX(100%); }
.drawer-leave-to .absolute.right-0 { transform: translateX(100%); }
</style>