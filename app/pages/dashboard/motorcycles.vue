<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 class="font-heading text-4xl text-white">Motorcycles</h1>
          <p class="mt-1 text-sm text-brand-grey">Manage your motorcycle inventory</p>
        </div>
        <Button size="sm" @click="openCreateModal">Add Motorcycle</Button>
      </div>

      <div class="mb-4 flex flex-wrap gap-3">
        <Input v-model="searchQuery" placeholder="Search motorcycles..." class="w-64" />
        <select v-model="brandFilter" class="input-field w-44">
          <option value="">All Brands</option>
          <option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option>
        </select>
        <select v-model="statusFilter" class="input-field w-40">
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="coming_soon">Coming Soon</option>
        </select>
      </div>

      <div v-if="loading" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-5">
          <div class="mb-3 aspect-video rounded-sm bg-brand-grey/10" />
          <div class="h-5 w-3/4 rounded bg-brand-grey/10" />
          <div class="mt-2 h-4 w-1/2 rounded bg-brand-grey/10" />
        </div>
      </div>

      <div v-else-if="filteredMotorcycles.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
        <Bike class="mx-auto h-12 w-12 text-brand-grey/40" />
        <p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Motorcycles Found</p>
        <p class="mt-2 text-sm text-brand-grey/60">Add your first motorcycle to the inventory</p>
      </div>

      <div v-else class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="m in filteredMotorcycles" :key="m.id" class="group rounded-sm border border-brand-grey/20 bg-brand-black/60 p-4 transition-all duration-200 hover:border-brand-red/30">
          <div class="mb-3 flex aspect-video items-center justify-center rounded-sm bg-brand-grey/10 overflow-hidden">
            <img v-if="m.images?.length" :src="pb.files.getURL(m, m.images[0])" :alt="m.name" class="h-full w-full object-cover" />
            <Bike v-else class="h-10 w-10 text-brand-grey/30" />
          </div>
          <h3 class="font-display text-lg tracking-display text-white truncate">{{ m.name }}</h3>
          <p class="text-sm text-brand-grey">{{ m.brand_name || 'Unknown Brand' }} &middot; {{ m.year || 'N/A' }} &middot; {{ m.engine_cc || '—' }}cc</p>
          <div class="mt-3 flex items-center justify-between">
            <span class="text-lg font-bold text-brand-red">KSh {{ formatPrice(m.sale_price || m.price) }}</span>
            <Badge :variant="m.status === 'available' ? 'success' : m.status === 'sold' ? 'danger' : 'warning'">{{ m.status || 'unknown' }}</Badge>
          </div>
          <div class="mt-3 flex gap-2">
            <Button variant="ghost" size="sm" class="flex-1" @click="openEditModal(m)">Edit</Button>
            <Button variant="danger" size="sm" class="flex-1" :disabled="deleting" @click="confirmDelete(m)">Delete</Button>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto" @click.self="closeModal">
        <div class="w-full max-w-2xl rounded-sm border border-brand-grey/30 bg-brand-black p-6 my-8">
          <h2 class="font-display text-xl tracking-display text-white">{{ editingId ? 'Edit Motorcycle' : 'Add Motorcycle' }}</h2>
          <div class="mt-4 space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="form.name" label="Name" placeholder="e.g. Ninja ZX-6R" />
              <Input v-model="form.slug" label="Slug" placeholder="ninja-zx-6r" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Brand</label>
                <select v-model="form.brand" class="input-field w-full"><option value="">Select brand</option><option v-for="b in brands" :key="b.id" :value="b.id">{{ b.name }}</option></select>
              </div>
              <div>
                <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Type</label>
                <select v-model="form.type" class="input-field w-full"><option value="">Select type</option><option v-for="t in bikeTypes" :key="t" :value="t">{{ t }}</option></select>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <Input v-model="form.year" label="Year" type="number" placeholder="2025" />
              <Input v-model="form.price" label="Price (KSh)" type="number" placeholder="1000000" />
              <Input v-model="form.sale_price" label="Sale Price" type="number" placeholder="900000" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="form.engine_cc" label="Engine CC" placeholder="e.g. 636" />
              <Input v-model="form.engine" label="Engine Details" placeholder="e.g. 636cc liquid-cooled inline-4" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="form.horsepower" label="Horsepower" placeholder="e.g. 130hp @ 13,500rpm" />
              <Input v-model="form.torque" label="Torque" placeholder="e.g. 71Nm @ 11,500rpm" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="form.transmission" label="Transmission" placeholder="e.g. 6-speed" />
              <Input v-model="form.top_speed" label="Top Speed" placeholder="e.g. 260km/h" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="form.fuel_capacity" label="Fuel Capacity" placeholder="e.g. 17L" />
              <Input v-model="form.weight" label="Weight" placeholder="e.g. 198kg" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="form.fuel_system" label="Fuel System" placeholder="e.g. EFI" />
              <Input v-model="form.cooling" label="Cooling System" placeholder="e.g. Liquid-cooled" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="form.starter" label="Starter" placeholder="e.g. Electric" />
              <Input v-model="form.ignition" label="Ignition" placeholder="e.g. CDI" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="form.battery" label="Battery" placeholder="e.g. 12V 8Ah" />
              <Input v-model="form.headlight" label="Headlight" placeholder="e.g. LED" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="form.seat_height" label="Seat Height" placeholder="e.g. 830mm" />
              <Input v-model="form.ground_clearance" label="Ground Clearance" placeholder="e.g. 160mm" />
            </div>
            <Input v-model="form.braking" label="Braking System" placeholder="e.g. Dual 310mm discs, 4-piston calipers" />
            <Input v-model="form.suspension" label="Suspension" placeholder="e.g. 41mm USD fork (front); Mono-shock (rear)" />
            <Input v-model="form.colors" label="Available Colors" placeholder="e.g. Lime Green, Metallic Spark Black" />
            <Input v-model="form.warranty" label="Warranty" placeholder="e.g. 2 years" />
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Description</label>
              <textarea v-model="form.description" rows="3" class="input-field w-full resize-none" placeholder="Motorcycle description..." />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Status</label>
                <select v-model="form.status" class="input-field w-full"><option value="available">Available</option><option value="sold">Sold</option><option value="coming_soon">Coming Soon</option></select>
              </div>
              <div class="flex items-end gap-4 pb-2">
                <label class="flex items-center gap-2 cursor-pointer" :class="{ 'opacity-40 pointer-events-none': form.status === 'sold' }"><input v-model="form.featured" type="checkbox" class="accent-brand-red" :disabled="form.status === 'sold'" /> Featured</label>
                <label class="flex items-center gap-2 cursor-pointer" :class="{ 'opacity-40 pointer-events-none': form.status !== 'available' }"><input v-model="form.new_arrival" type="checkbox" class="accent-brand-red" :disabled="form.status !== 'available'" /> New Arrival</label>
                <label class="flex items-center gap-2 cursor-pointer" :class="{ 'opacity-40 pointer-events-none': form.status !== 'available' }"><input v-model="form.in_stock" type="checkbox" class="accent-brand-red" :disabled="form.status !== 'available'" /> In Stock</label>
                <span v-if="form.status === 'coming_soon'" class="rounded-sm bg-amber-500/20 px-2 py-0.5 text-[10px] font-display tracking-display text-amber-400 uppercase">Coming Soon</span>
                <span v-if="form.status === 'sold'" class="rounded-sm bg-red-500/20 px-2 py-0.5 text-[10px] font-display tracking-display text-red-400 uppercase">Sold</span>
              </div>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Images</label>
              <input type="file" accept="image/*" multiple @change="onImagesChange" class="input-field w-full text-sm file:mr-3 file:border-0 file:bg-brand-red file:px-3 file:py-1 file:text-xs file:text-white" />
              <div v-if="imagePreviews.length" class="mt-2 flex flex-wrap gap-2">
                <img v-for="(img, i) in imagePreviews" :key="i" :src="img" class="h-14 w-14 rounded-sm object-cover border border-brand-grey/20" />
              </div>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <Button variant="ghost" @click="closeModal">Cancel</Button>
            <Button :disabled="saving" @click="saveMotorcycle">{{ saving ? 'Saving...' : 'Save' }}</Button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Bike } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Motorcycles - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const motorcycles = ref<any[]>([])
const brands = ref<any[]>([])
const searchQuery = ref('')
const brandFilter = ref('')
const statusFilter = ref('')
const showModal = ref(false)
const editingId = ref<string | null>(null)
const imageFiles = ref<File[]>([])
const imagePreviews = ref<string[]>([])

const bikeTypes = ['Sport', 'Cruiser', 'Touring', 'Adventure', 'Naked', 'Dirt', 'Scooter', 'Electric']

const form = ref({
  name: '', slug: '', brand: '', type: '', year: '', price: '', sale_price: '',
  status: 'available', description: '', engine: '', engine_cc: '',
  horsepower: '', torque: '', transmission: '', top_speed: '',
  fuel_capacity: '', weight: '', fuel_system: '', cooling: '',
  starter: '', ignition: '', battery: '', headlight: '',
  seat_height: '', ground_clearance: '', braking: '', suspension: '',
  colors: '', warranty: '',
  featured: false, new_arrival: false, in_stock: true,
})

watch(() => form.value.status, (status) => {
  if (status === 'sold') {
    form.value.featured = false
    form.value.new_arrival = false
    form.value.in_stock = false
  } else if (status === 'coming_soon') {
    form.value.new_arrival = false
    form.value.in_stock = false
  }
})

function formatPrice(p: number) { return p ? p.toLocaleString() : '0' }

const filteredMotorcycles = computed(() => {
  return motorcycles.value.filter(m => {
    if (searchQuery.value && !m.name.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
    if (brandFilter.value && m.brand !== brandFilter.value) return false
    if (statusFilter.value && m.status !== statusFilter.value) return false
    return true
  })
})

function openCreateModal() {
  editingId.value = null
  form.value = { name: '', slug: '', brand: '', type: '', year: '', price: '', sale_price: '', status: 'available', description: '', engine: '', engine_cc: '', horsepower: '', torque: '', transmission: '', top_speed: '', fuel_capacity: '', weight: '', fuel_system: '', cooling: '', starter: '', ignition: '', battery: '', headlight: '', seat_height: '', ground_clearance: '', braking: '', suspension: '', colors: '', warranty: '', featured: false, new_arrival: false, in_stock: true }
  imageFiles.value = []; imagePreviews.value = []
  showModal.value = true
}

function openEditModal(m: any) {
  editingId.value = m.id
  form.value = {
    name: m.name, slug: m.slug || '', brand: m.brand, type: m.type || '',
    year: m.year?.toString() || '', price: m.price?.toString() || '', sale_price: m.sale_price?.toString() || '',
    status: m.status || 'available', description: m.description || '',
    engine: m.engine || '', engine_cc: m.engine_cc || '',
    horsepower: m.horsepower || '', torque: m.torque || '',
    transmission: m.transmission || '', top_speed: m.top_speed || '',
    fuel_capacity: m.fuel_capacity || '', weight: m.weight || '',
    fuel_system: m.fuel_system || '', cooling: m.cooling || '',
    starter: m.starter || '', ignition: m.ignition || '',
    battery: m.battery || '', headlight: m.headlight || '',
    seat_height: m.seat_height || '', ground_clearance: m.ground_clearance || '',
    braking: m.braking || '', suspension: m.suspension || '',
    colors: m.colors || '', warranty: m.warranty || '',
    featured: m.featured || false, new_arrival: m.new_arrival || false, in_stock: m.in_stock ?? true,
  }
  imageFiles.value = []; imagePreviews.value = (m.images || []).map((img: string) => pb.files.getURL(m, img))
  showModal.value = true
}

function closeModal() { showModal.value = false }

function onImagesChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.length) {
    imageFiles.value = Array.from(target.files)
    imagePreviews.value = imageFiles.value.map(f => URL.createObjectURL(f))
  }
}

async function saveMotorcycle() {
  saving.value = true
  try {
    const data = new FormData()
    const fields = ['name', 'slug', 'brand', 'type', 'status', 'description', 'engine', 'engine_cc',
      'horsepower', 'torque', 'transmission', 'top_speed', 'fuel_capacity', 'weight',
      'fuel_system', 'cooling', 'starter', 'ignition', 'battery', 'headlight',
      'seat_height', 'ground_clearance', 'braking', 'suspension', 'colors', 'warranty']
    for (const f of fields) {
      if (form.value[f as keyof typeof form.value]) data.append(f, String(form.value[f as keyof typeof form.value]))
    }
    if (form.value.year) data.append('year', form.value.year)
    if (form.value.price) data.append('price', form.value.price)
    if (form.value.sale_price) data.append('sale_price', form.value.sale_price)
    data.append('featured', form.value.featured ? 'true' : 'false')
    data.append('new_arrival', form.value.new_arrival ? 'true' : 'false')
    data.append('in_stock', form.value.in_stock ? 'true' : 'false')

    for (const file of imageFiles.value) data.append('images', file)

    if (editingId.value) { await pb.collection('motorcycles').update(editingId.value, data); toast.add({ type: 'success', title: 'Updated successfully' }) }
    else { await pb.collection('motorcycles').create(data); toast.add({ type: 'success', title: 'Created successfully' }) }

    closeModal(); await loadMotorcycles()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save', message: e?.message || 'Something went wrong' }) }
  finally { saving.value = false }
}

async function confirmDelete(m: any) {
  deleting.value = true
  try {
    const ok = await confirmDlg.confirm({ title: 'Delete Motorcycle', message: `Are you sure you want to delete "${m.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
    if (ok) { await pb.collection('motorcycles').delete(m.id); toast.add({ type: 'success', title: 'Deleted successfully' }); await loadMotorcycles() }
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message || 'Something went wrong' }) }
  finally { deleting.value = false }
}

async function loadMotorcycles() {
  try {
    const res = await pb.collection('motorcycles').getList(1, 100, { sort: '-created', expand: 'brand' })
    motorcycles.value = (res.items as any[]).map(m => ({ ...m, brand_name: m.expand?.brand?.name || '' }))
  } catch (e) { console.error(e) }
}

onMounted(async () => {
  await Promise.all([
    loadMotorcycles(),
    pb.collection('brands').getFullList({ sort: 'name' }).catch(() => []).then((r: any) => brands.value = r),
  ])
  loading.value = false
})
</script>
