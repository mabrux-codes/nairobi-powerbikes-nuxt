<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Brand Management"
      eyebrow="Inventory"
      description="Manage your manufacturer portfolio, logos and model lineups."
      :actions="[{ label: 'Add Brand', icon: Plus, onClick: openCreate }]"
    />

    <div v-if="storeLoading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-5">
        <div class="h-11 w-11 rounded-xl bg-brand-grey/10" />
        <div class="mt-4 h-8 w-14 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3 w-24 rounded bg-brand-grey/10" />
      </div>
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AdminStatCard label="Total Brands" :display="brands.length" :icon="Tags" icon-bg="bg-brand-red/15" icon-color="text-brand-red" to="/dashboard/brands" />
      <AdminStatCard label="Motorcycle Models" :display="totalModels" :icon="Bike" icon-bg="bg-sky-500/15" icon-color="text-sky-400" />
      <AdminStatCard label="Countries" :display="countryCount" :icon="Globe2" icon-bg="bg-emerald-500/15" icon-color="text-emerald-400" />
      <AdminStatCard label="Featured" :display="featuredCount" :icon="Star" icon-bg="bg-amber-500/15" icon-color="text-amber-400" />
    </div>

    <div class="flex flex-wrap items-center justify-between gap-3">
      <AdminToolbar v-model:search="search" search-placeholder="Search brands..." />
      <div class="flex items-center gap-2.5">
        <AdminSelect v-model="countryFilter" placeholder="All Countries">
          <option v-for="c in countries" :key="c" :value="c" class="bg-brand-black">{{ c }}</option>
        </AdminSelect>
        <AdminSelect v-model="statusFilter" placeholder="All Status">
          <option value="active" class="bg-brand-black">Active</option>
          <option value="dormant" class="bg-brand-black">Dormant</option>
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

    <AdminSkeleton v-if="loading" :rows="5" variant="card" />
    <AdminEmptyState
      v-else-if="filtered.length === 0"
      :icon="Tags"
      title="No Brands Found"
      description="Try adjusting your search or add a new brand to your portfolio."
    >
      <Button size="sm" @click="openCreate"><Plus class="h-4 w-4" />Add Brand</Button>
    </AdminEmptyState>

    <div v-else-if="view === 'grid'" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AdminCard v-for="b in filtered" :key="b.id" class="flex flex-col">
        <div class="flex items-start justify-between">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl border border-brand-grey/15 bg-white/[0.03] overflow-hidden">
            <img v-if="b.logo" :src="pb.files.getURL(b, b.logo)" :alt="b.name" class="h-full w-full object-contain p-2" />
            <span v-else class="font-display text-xl tracking-display text-brand-grey/50">{{ b.name?.slice(0, 2).toUpperCase() }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="isFeatured(b)" class="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400" title="Featured">
              <Star class="h-3.5 w-3.5" />
            </span>
            <AdminActionsMenu :items="actionsFor(b)" />
          </div>
        </div>
        <div class="mt-4 flex items-center gap-2">
          <h3 class="font-display text-lg tracking-display text-white">{{ b.name }}</h3>
          <span v-if="b.country" class="text-[10px] font-semibold uppercase tracking-wider text-brand-grey/70 bg-white/[0.04] border border-brand-grey/15 rounded-md px-1.5 py-0.5">{{ b.country }}</span>
        </div>
        <p v-if="b.tagline" class="mt-0.5 text-xs text-brand-grey italic">{{ b.tagline }}</p>
        <p v-if="b.description" class="mt-2 text-xs leading-relaxed text-brand-grey/70 line-clamp-2">{{ b.description }}</p>
        <div class="mt-4 flex items-center justify-between border-t border-brand-grey/10 pt-3.5">
          <span class="flex items-center gap-1.5 text-xs font-semibold text-white">
            <Bike class="h-4 w-4 text-brand-red" />{{ modelCount(b) }} model{{ modelCount(b) === 1 ? '' : 's' }}
          </span>
          <span class="flex items-center gap-1.5 text-[11px] text-brand-grey">Added {{ shortDate(b.created) }}</span>
        </div>
      </AdminCard>
    </div>

    <div v-else class="overflow-hidden rounded-2xl border border-brand-grey/15 bg-brand-black/60">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-brand-grey/15 bg-brand-black/80">
          <tr>
            <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Brand</th>
            <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Country</th>
            <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Models</th>
            <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Status</th>
            <th class="px-4 py-3 font-display text-[10px] tracking-display text-brand-grey uppercase">Created</th>
            <th class="px-4 py-3" />
          </tr>
        </thead>
        <tbody class="divide-y divide-brand-grey/10">
          <tr v-for="b in filtered" :key="b.id" class="transition-colors hover:bg-white/[0.03]">
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-grey/15 bg-white/[0.03] overflow-hidden">
                  <img v-if="b.logo" :src="pb.files.getURL(b, b.logo)" :alt="b.name" class="h-full w-full object-contain p-1" />
                  <span v-else class="text-[10px] font-bold text-brand-grey/50">{{ b.name?.slice(0, 2).toUpperCase() }}</span>
                </div>
                <div>
                  <p class="font-medium text-white">{{ b.name }}</p>
                  <p v-if="b.tagline" class="text-[11px] text-brand-grey truncate max-w-[220px]">{{ b.tagline }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-3 text-brand-grey">{{ b.country || '—' }}</td>
            <td class="px-4 py-3">
              <span class="inline-flex items-center gap-1.5 font-semibold text-white"><Bike class="h-3.5 w-3.5 text-brand-red" />{{ modelCount(b) }}</span>
            </td>
            <td class="px-4 py-3">
              <StatusChip :status="modelCount(b) > 0 ? 'active' : 'dormant'" size="sm" />
            </td>
            <td class="px-4 py-3 text-brand-grey">{{ shortDate(b.created) }}</td>
            <td class="px-4 py-3 text-right">
              <AdminActionsMenu :items="actionsFor(b)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AdminDrawer :open="drawerOpen" :title="editingId ? 'Edit Brand' : 'Add Brand'" :subtitle="editingId ? 'Update brand details' : 'Register a new manufacturer'" @close="closeDrawer">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-brand-grey/20 bg-white/[0.03]">
            <img v-if="logoPreview" :src="logoPreview" alt="Brand logo preview" class="h-full w-full object-contain p-2" />
            <span v-else class="font-display text-xl text-brand-grey/50">{{ form.name.slice(0, 2).toUpperCase() || 'LO' }}</span>
          </div>
          <div class="flex-1">
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Brand Logo</label>
            <input type="file" accept="image/*" class="block w-full text-xs text-brand-grey file:mr-3 file:rounded-lg file:border-0 file:bg-brand-red file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white" @change="onLogoChange" />
            <p class="mt-1 text-[11px] text-brand-grey/60">PNG, SVG or WebP recommended</p>
          </div>
        </div>
        <Input v-model="form.name" label="Brand Name" placeholder="e.g. Kawasaki" />
        <Input v-model="form.tagline" label="Tagline" placeholder="e.g. Let the Good Times Roll" />
        <Input v-model="form.country" label="Country of Origin" placeholder="e.g. Japan" />
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Description</label>
          <textarea v-model="form.description" rows="4" class="input-field rounded-xl resize-none" placeholder="Brand description..." />
        </div>
        <Input v-model="form.sort_order" label="Sort Order" type="number" placeholder="0" />
      </div>
      <template #footer>
        <Button variant="ghost" @click="closeDrawer">Cancel</Button>
        <Button :disabled="saving" @click="save">{{ saving ? 'Saving…' : 'Save Brand' }}</Button>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import { Tags, Bike, Globe2, Star, Plus, ExternalLink, Pencil, Trash2 } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useAdminDataStore } from '~/stores/adminData'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Brands - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const store = useAdminDataStore()

const loading = ref(true)
const saving = ref(false)
const drawerOpen = ref(false)
const editingId = ref<string | null>(null)
const search = ref('')
const countryFilter = ref('')
const statusFilter = ref('')
const view = ref<'grid' | 'table'>('grid')
const logoFile = ref<File | null>(null)
const logoPreview = ref<string | null>(null)
const modelCounts = ref<Record<string, number>>({})
const origOrders = ref<Record<string, number>>({})
const form = ref({ name: '', tagline: '', country: '', description: '', sort_order: '0' })

const brands = computed(() => store.brands)

watch(brands, (list) => {
  for (const b of list) {
    if (origOrders.value[b.id] === undefined && Number(b.sort_order || 0) !== 0) {
      origOrders.value[b.id] = Number(b.sort_order) || 1
    }
  }
}, { immediate: true })

const storeLoading = computed(() => !store.ready)
const totalModels = computed(() => Object.values(modelCounts.value).reduce((a, b) => a + b, 0))
const countryCount = computed(() => new Set(brands.value.map(b => b.country).filter(Boolean)).size)
const featuredCount = computed(() => brands.value.filter(b => isFeatured(b)).length)
const countries = computed(() => [...new Set(brands.value.map(b => b.country).filter(Boolean))].sort())

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return brands.value.filter(b => {
    if (q && !`${b.name} ${b.tagline} ${b.country} ${b.description}`.toLowerCase().includes(q)) return false
    if (countryFilter.value && b.country !== countryFilter.value) return false
    if (statusFilter.value === 'active' && modelCount(b) <= 0) return false
    if (statusFilter.value === 'dormant' && modelCount(b) > 0) return false
    return true
  })
})

function isFeatured(b: any) { return Number(b.sort_order || 0) === 0 }

function modelCount(b: any): number {
  return modelCounts.value[b.id] ?? 0
}

function actionsFor(b: any) {
  return [
    { label: 'View on Site', icon: ExternalLink, onClick: () => router.push(`/brands/${b.slug || b.id}`) },
    { label: isFeatured(b) ? 'Remove Featured' : 'Feature Brand', icon: Star, onClick: () => toggleFeatured(b) },
    { label: 'Edit', icon: Pencil, onClick: () => openEdit(b) },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => confirmDelete(b) },
  ]
}

function openCreate() {
  editingId.value = null
  form.value = { name: '', tagline: '', country: '', description: '', sort_order: '0' }
  logoFile.value = null
  logoPreview.value = null
  drawerOpen.value = true
}

function openEdit(b: any) {
  editingId.value = b.id
  form.value = { name: b.name, tagline: b.tagline || '', country: b.country || '', description: b.description || '', sort_order: b.sort_order?.toString() || '0' }
  logoFile.value = null
  logoPreview.value = b.logo ? pb.files.getURL(b, b.logo) : null
  drawerOpen.value = true
}

function closeDrawer() { drawerOpen.value = false }

function onLogoChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) {
    logoFile.value = target.files[0]
    logoPreview.value = URL.createObjectURL(target.files[0])
  }
}

async function save() {
  if (!form.value.name.trim()) { toast.add({ type: 'error', title: 'Brand name is required' }); return }
  saving.value = true
  try {
    const data = new FormData()
    data.append('name', form.value.name.trim())
    data.append('tagline', form.value.tagline)
    data.append('country', form.value.country)
    data.append('description', form.value.description)
    data.append('sort_order', form.value.sort_order || '0')
    if (!editingId.value) data.append('slug', form.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    if (logoFile.value) data.append('logo', logoFile.value)
    if (editingId.value) {
      await pb.collection('brands').update(editingId.value, data)
      toast.add({ type: 'success', title: 'Brand updated' })
    } else {
      await pb.collection('brands').create(data)
      toast.add({ type: 'success', title: 'Brand created' })
    }
    closeDrawer()
    await loadCounts()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save', message: e?.message }) }
  finally { saving.value = false }
}

async function toggleFeatured(b: any) {
  try {
    const currentlyFeatured = isFeatured(b)
    const nextOrder = currentlyFeatured ? (origOrders.value[b.id] ?? 1) : 0
    if (!currentlyFeatured) origOrders.value[b.id] = Number(b.sort_order) || 1
    await pb.collection('brands').update(b.id, { sort_order: nextOrder })
    toast.add({ type: 'success', title: currentlyFeatured ? 'Removed from featured' : 'Marked as featured' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update', message: e?.message }) }
}

async function confirmDelete(b: any) {
  const ok = await confirmDlg.confirm({ title: 'Delete Brand', message: `Delete "${b.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('brands').delete(b.id)
    toast.add({ type: 'success', title: 'Brand deleted' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }) }
}

async function loadCounts() {
  try {
    const bikes = await pb.collection('motorcycles').getFullList({ fields: 'brand' })
    const counts: Record<string, number> = {}
    for (const m of bikes as any[]) {
      if (m.brand) counts[m.brand] = (counts[m.brand] || 0) + 1
    }
    const brandsByName: Record<string, string> = {}
    for (const b of brands.value) brandsByName[b.name.toLowerCase()] = b.id
    const resolved: Record<string, number> = {}
    for (const [name, count] of Object.entries(counts)) {
      resolved[brandsByName[name.toLowerCase()] ?? name] = count
    }
    modelCounts.value = resolved
  } catch { /* counts optional */ }
}

function shortDate(d: string) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

const router = useRouter()

onMounted(async () => {
  store.ensureActive()
  await loadCounts()
  loading.value = false
})

onUnmounted(() => store.release())
</script>
