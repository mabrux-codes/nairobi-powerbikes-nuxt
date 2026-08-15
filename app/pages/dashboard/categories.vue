<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Categories"
      eyebrow="Inventory"
      description="Organize products into a clean, browsable catalog structure."
      :actions="[{ label: 'Add Category', icon: Plus, onClick: openCreate }]"
    />

    <div v-if="storeLoading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-5">
        <div class="h-11 w-11 rounded-xl bg-brand-grey/10" />
        <div class="mt-4 h-8 w-14 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3 w-24 rounded bg-brand-grey/10" />
      </div>
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AdminStatCard label="Total Categories" :display="categories.length" :icon="Tags" icon-bg="bg-brand-red/15" icon-color="text-brand-red" />
      <AdminStatCard label="Active" :display="activeCount" :icon="CheckCircle2" icon-bg="bg-emerald-500/15" icon-color="text-emerald-400" />
      <AdminStatCard label="Motorcycle Mappings" :display="mappedCats" :icon="Bike" icon-bg="bg-sky-500/15" icon-color="text-sky-400" />
      <AdminStatCard label="Total Products" :display="totalProducts" :icon="Boxes" icon-bg="bg-violet-500/15" icon-color="text-violet-400" />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <AdminToolbar v-model:search="search" search-placeholder="Search categories..." />
      <div class="flex items-center gap-2.5">
        <AdminSelect v-model="typeFilter" placeholder="All Types">
          <option value="motorcycle" class="bg-brand-black">Motorcycle</option>
          <option value="gear" class="bg-brand-black">Gear / Apparel</option>
        </AdminSelect>
        <AdminSelect v-model="statusFilter" placeholder="All Status">
          <option value="active" class="bg-brand-black">Active</option>
          <option value="inactive" class="bg-brand-black">Inactive</option>
        </AdminSelect>
        <div class="flex items-center gap-1 rounded-xl border border-brand-grey/20 p-1">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
            :class="view === 'grid' ? 'bg-brand-red text-white' : 'text-brand-grey hover:text-white'"
            :aria-label="'Grid view'"
            @click="view = 'grid'"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          </button>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
            :class="view === 'table' ? 'bg-brand-red text-white' : 'text-brand-grey hover:text-white'"
            :aria-label="'Table view'"
            @click="view = 'table'"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10h18M3 14h18M3 18h18M3 6h18" /></svg>
          </button>
        </div>
      </div>
    </div>

    <AdminSkeleton v-if="loading" :rows="4" variant="card" />
    <AdminEmptyState
      v-else-if="filtered.length === 0"
      :icon="Tags"
      title="No Categories Found"
      description="Create categories to organize your motorcycles, accessories and apparel."
    >
      <Button size="sm" @click="openCreate"><Plus class="h-4 w-4" />Add Category</Button>
    </AdminEmptyState>

    <div v-else-if="view === 'grid'" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AdminCard v-for="c in filtered" :key="c.id" class="flex flex-col">
        <div class="flex items-start justify-between">
          <span class="flex h-12 w-12 items-center justify-center rounded-xl" :class="typeOf(c) === 'motorcycle' ? 'bg-brand-red/15 text-brand-red' : 'bg-violet-500/15 text-violet-400'">
            <component :is="iconFor(c)" class="h-5 w-5" />
          </span>
          <AdminActionsMenu :items="actionsFor(c)" />
        </div>
        <h3 class="mt-3 font-display text-lg tracking-display text-white">{{ c.name }}</h3>
        <p class="text-[11px] font-display tracking-wider text-brand-grey/70 uppercase">{{ c.slug || '—' }}</p>
        <p v-if="c.description" class="mt-2 text-xs leading-relaxed text-brand-grey/70 line-clamp-2">{{ c.description }}</p>
        <div class="mt-4 flex items-center justify-between border-t border-brand-grey/10 pt-3.5">
          <span class="flex items-center gap-1.5 text-xs font-semibold text-white">
            <component :is="countIcon" class="h-4 w-4 text-brand-red" />{{ countFor(c) }} product{{ countFor(c) === 1 ? '' : 's' }}
          </span>
          <StatusChip :status="(c.status || 'active') === 'active' ? 'active' : 'inactive'" size="sm" />
        </div>
      </AdminCard>
    </div>

    <div v-else class="overflow-hidden rounded-2xl border border-brand-grey/15 bg-brand-black/60">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-brand-grey/15 bg-brand-black/80">
          <tr>
            <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Category</th>
            <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Type</th>
            <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Products</th>
            <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Status</th>
            <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Sort</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-brand-grey/10">
          <tr v-for="c in filtered" :key="c.id" class="transition-colors hover:bg-white/[0.03]">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <span class="flex h-9 w-9 items-center justify-center rounded-lg" :class="typeOf(c) === 'motorcycle' ? 'bg-brand-red/15 text-brand-red' : 'bg-violet-500/15 text-violet-400'">
                  <component :is="iconFor(c)" class="h-4 w-4" />
                </span>
                <div>
                  <p class="font-medium text-white">{{ c.name }}</p>
                  <p class="text-[11px] text-brand-grey">{{ c.slug }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3"><Badge variant="secondary">{{ typeOf(c) }}</Badge></td>
            <td class="px-4 py-3"><span class="font-semibold text-white">{{ countFor(c) }}</span></td>
            <td class="px-4 py-3"><StatusChip :status="(c.status || 'active') === 'active' ? 'active' : 'inactive'" size="sm" /></td>
            <td class="px-4 py-3 text-brand-grey">{{ c.sort_order ?? '—' }}</td>
            <td class="px-4 py-3 text-right"><AdminActionsMenu :items="actionsFor(c)" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminDrawer :open="drawerOpen" :title="editingId ? 'Edit Category' : 'Add Category'" :subtitle="editingId ? 'Update category details' : 'Create a new product category'" @close="closeDrawer">
      <div class="space-y-4">
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Icon</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="ic in iconOptions"
              :key="ic.name"
              class="flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-200"
              :class="form.icon === ic.name ? 'border-brand-red bg-brand-red/15 text-brand-red' : 'border-brand-grey/20 text-brand-grey hover:text-white hover:border-brand-red/40'"
              :aria-label="'Icon ' + ic.name"
              @click="form.icon = ic.name"
            >
              <component :is="ic.cmp" class="h-4.5 w-4.5" style="width:18px;height:18px" />
            </button>
          </div>
        </div>
        <Input v-model="form.name" label="Category Name" placeholder="e.g. Adventure" />
        <SlugField v-model="form.slug" :title="form.name" path="/motorcycles/" :was-published="!!editingId" label="URL Slug" />
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Description</label>
          <textarea v-model="form.description" rows="4" class="input-field rounded-xl resize-none" placeholder="What belongs in this category?" />
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Status</label>
            <AdminSelect v-model="form.status">
              <option value="active" class="bg-brand-black">Active</option>
              <option value="inactive" class="bg-brand-black">Inactive</option>
            </AdminSelect>
          </div>
          <Input v-model="form.sort_order" label="Sort Order" type="number" placeholder="0" />
        </div>
        <p v-if="form.status === 'inactive'" class="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-[11px] text-amber-400">
          Inactive categories are hidden from the public catalog but keep their product mappings.
        </p>
      </div>
      <template #footer>
        <Button variant="ghost" @click="closeDrawer">Cancel</Button>
        <Button :disabled="saving" @click="save">{{ saving ? 'Saving…' : 'Save Category' }}</Button>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import { Tags, Package, Bike, Boxes, Plus, Pencil, Trash2, Tag, Zap, Route, Shield, Mountain, Compass, Wrench, Timer, PawPrint, CheckCircle2, Eye, EyeOff } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useAdminDataStore } from '~/stores/adminData'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Categories - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const store = useAdminDataStore()

const loading = ref(true)
const saving = ref(false)
const drawerOpen = ref(false)
const editingId = ref<string | null>(null)
const search = ref('')
const typeFilter = ref('')
const statusFilter = ref('')
const view = ref<'grid' | 'table'>('grid')
const form = ref({ name: '', slug: '', description: '', icon: 'tag', status: 'active', sort_order: '0' })
const productCounts = ref<Record<string, number>>({})
const mappedCats = ref<string[]>([])

const countIcon = Boxes

const iconOptions = [
  { name: 'tag', cmp: Tag },
  { name: 'zap', cmp: Zap },
  { name: 'route', cmp: Route },
  { name: 'shield', cmp: Shield },
  { name: 'mountain', cmp: Mountain },
  { name: 'compass', cmp: Compass },
  { name: 'wrench', cmp: Wrench },
  { name: 'timer', cmp: Timer },
  { name: 'paw', cmp: PawPrint },
  { name: 'bike', cmp: Bike },
]

const iconMap: Record<string, any> = Object.fromEntries(iconOptions.map(i => [i.name, i.cmp]))

const categories = computed(() => store.categories)
const storeLoading = computed(() => !store.ready)

const activeCount = computed(() => categories.value.filter(c => (c.status || 'active') === 'active').length)
const mappedCatsCount = computed(() => mappedCats.value.length)
const totalProducts = computed(() => Object.values(productCounts.value).reduce((a, b) => a + b, 0))

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return categories.value.filter(c => {
    if (q && !`${c.name} ${c.slug} ${c.description}`.toLowerCase().includes(q)) return false
    if (typeFilter.value && typeOf(c) !== typeFilter.value) return false
    if (statusFilter.value && (c.status || 'active') !== statusFilter.value) return false
    return true
  })
})

function typeOf(c: any) {
  return mappedCats.value.includes(c.id) ? 'motorcycle' : 'gear'
}

function iconFor(c: any) {
  return iconMap[c.icon || (typeOf(c) === 'motorcycle' ? 'bike' : 'tag')] || Tag
}

function countFor(c: any): number {
  return productCounts.value[c.id] ?? 0
}

function actionsFor(c: any) {
  const active = (c.status || 'active') === 'active'
  return [
    { label: 'Edit', icon: Pencil, onClick: () => openEdit(c) },
    { label: active ? 'Deactivate' : 'Activate', icon: active ? EyeOff : Eye, onClick: () => toggleStatus(c) },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => confirmDelete(c) },
  ]
}

function openCreate() {
  editingId.value = null
  form.value = { name: '', slug: '', description: '', icon: 'tag', status: 'active', sort_order: '0' }
  drawerOpen.value = true
}

function openEdit(c: any) {
  editingId.value = c.id
  form.value = { name: c.name, slug: c.slug || '', description: c.description || '', icon: c.icon || 'tag', status: c.status || 'active', sort_order: c.sort_order?.toString() || '0' }
  drawerOpen.value = true
}

function closeDrawer() { drawerOpen.value = false }

async function save() {
  if (!form.value.name.trim()) { toast.add({ type: 'error', title: 'Category name is required' }); useAudio().playError(); return }
  saving.value = true
  try {
    const payload: any = { name: form.value.name.trim(), description: form.value.description, icon: form.value.icon, status: form.value.status, sort_order: form.value.sort_order || '0' }
    if (form.value.slug) payload.slug = form.value.slug
    if (editingId.value) {
      await pb.collection('categories').update(editingId.value, payload)
      toast.add({ type: 'success', title: 'Category updated' })
      useAudio().playSuccess()
    } else {
      await pb.collection('categories').create(payload)
      toast.add({ type: 'success', title: 'Category created' })
      useAudio().playSuccess()
    }
    closeDrawer()
    await loadCounts()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save', message: e?.message }); useAudio().playError() }
  finally { saving.value = false }
}

async function toggleStatus(c: any) {
  const next = (c.status || 'active') === 'active' ? 'inactive' : 'active'
  try {
    await pb.collection('categories').update(c.id, { status: next })
    c.status = next
    toast.add({ type: 'success', title: next === 'active' ? 'Category activated' : 'Category deactivated' })
    useAudio().playSuccess()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update', message: e?.message }); useAudio().playError() }
}

async function confirmDelete(c: any) {
  const ok = await confirmDlg.confirm({ title: 'Delete Category', message: `Delete "${c.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('categories').delete(c.id)
    toast.add({ type: 'success', title: 'Category deleted' })
    useAudio().playSuccess()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }); useAudio().playError() }
}

async function loadCounts() {
  try {
    const [mcs, acs, ap] = await Promise.all([
      pb.collection('motorcycles').getFullList({ fields: 'category' }).catch(() => []),
      pb.collection('accessories').getFullList({ fields: 'category' }).catch(() => []),
      pb.collection('apparel').getFullList({ fields: 'type' }).catch(() => []),
    ])
    const counts: Record<string, number> = {}
    const idToName: Record<string, string> = {}
    for (const c of categories.value) idToName[c.id] = c.name
    mappedCats.value = []
    for (const m of mcs as any[]) {
      if (m.category) {
        const key = idToName[m.category] || m.category
        if (idToName[m.category]) mappedCats.value.push(m.category)
        counts[key] = (counts[key] || 0) + 1
      }
    }
    for (const a of acs as any[]) if (a.category) counts[a.category] = (counts[a.category] || 0) + 1
    for (const p of ap as any[]) if (p.type) counts[p.type] = (counts[p.type] || 0) + 1
    productCounts.value = counts
  } catch { /* counts optional */ }
}

onMounted(async () => {
  store.ensureActive()
  await loadCounts()
  loading.value = false
})

onUnmounted(() => store.release())
</script>