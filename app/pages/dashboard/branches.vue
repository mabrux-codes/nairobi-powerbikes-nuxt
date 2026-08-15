<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Branches"
      eyebrow="Business"
      description="Manage your dealership locations, images, staff coverage and operating hours."
      :actions="[{ label: 'Add Branch', icon: Plus, onClick: openCreate }]"
    />

    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-5">
        <div class="h-11 w-11 rounded-xl bg-brand-grey/10" />
        <div class="mt-4 h-8 w-14 rounded bg-brand-grey/10" />
        <div class="mt-2 h-3 w-24 rounded bg-brand-grey/10" />
      </div>
    </div>
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <AdminStatCard label="Total Branches" :display="branches.length" :icon="Building2" icon-bg="bg-brand-red/15" icon-color="text-brand-red" />
      <AdminStatCard label="Active" :display="activeCount" :icon="MapPin" icon-bg="bg-emerald-500/15" icon-color="text-emerald-400" />
      <AdminStatCard label="Staff Assigned" :display="staffCount" :icon="Users" icon-bg="bg-sky-500/15" icon-color="text-sky-400" />
      <AdminStatCard label="Bookings Today" :display="bookingsToday" :icon="CalendarCheck2" icon-bg="bg-amber-500/15" icon-color="text-amber-400" />
    </div>

    <AdminToolbar v-model:search="search" search-placeholder="Search branches...">
      <AdminSelect v-model="statusFilter" placeholder="All Status">
        <option value="active" class="bg-brand-black">Active</option>
        <option value="inactive" class="bg-brand-black">Inactive</option>
      </AdminSelect>
    </AdminToolbar>

    <AdminSkeleton v-if="loading" :rows="3" variant="card" />
    <AdminEmptyState
      v-else-if="filtered.length === 0"
      :icon="Building2"
      title="No Branches Found"
      description="Add a dealership branch to appear on your public locations page."
    >
      <Button size="sm" @click="openCreate"><Plus class="h-4 w-4" />Add Branch</Button>
    </AdminEmptyState>

    <div v-else class="grid gap-4 lg:grid-cols-3">
      <AdminCard v-for="b in filtered" :key="b.id" class="flex flex-col">
        <div class="relative h-36 overflow-hidden rounded-xl border border-brand-grey/15 bg-brand-black">
          <img v-if="mainImageUrl(b)" :src="mainImageUrl(b)" :alt="b.name" class="h-full w-full object-cover" />
          <div v-else class="flex h-full w-full items-center justify-center asphalt-grid">
            <Building2 class="h-10 w-10 text-brand-grey/40" />
          </div>
          <div class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-brand-black to-transparent" />
          <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between">
            <p class="font-display text-lg tracking-display text-white">{{ b.name }}</p>
            <StatusChip :status="b.status || 'active'" size="sm" />
          </div>
        </div>

        <div class="mt-4 space-y-2.5 text-sm">
          <p class="flex items-start gap-2.5 text-brand-grey">
            <MapPin class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
            <span>{{ b.address }}</span>
          </p>
          <p class="flex items-center gap-2.5 text-brand-grey">
            <Phone class="h-4 w-4 shrink-0 text-brand-red" />
            <span>{{ b.phone || '—' }}</span>
          </p>
          <p class="flex items-center gap-2.5 text-brand-grey">
            <Mail class="h-4 w-4 shrink-0 text-brand-red" />
            <span class="truncate">{{ b.email || '—' }}</span>
          </p>
          <p v-if="b.hours" class="flex items-start gap-2.5 text-brand-grey">
            <Clock class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
            <span class="whitespace-pre-line">{{ b.hours }}</span>
          </p>
        </div>

        <div class="mt-4 grid grid-cols-3 gap-2 border-t border-brand-grey/10 pt-4 text-center">
          <div>
            <p class="font-heading text-xl text-white">{{ branchStaff[b.id]?.length || 0 }}</p>
            <p class="text-[10px] font-display tracking-wider text-brand-grey uppercase">Staff</p>
          </div>
          <div>
            <p class="font-heading text-xl text-white">{{ branchBookings[b.id] || 0 }}</p>
            <p class="text-[10px] font-display tracking-wider text-brand-grey uppercase">Bookings</p>
          </div>
          <div>
            <p class="font-heading text-xl text-white">{{ branchTests[b.id] || 0 }}</p>
            <p class="text-[10px] font-display tracking-wider text-brand-grey uppercase">Test Rides</p>
          </div>
        </div>

        <div class="mt-4 flex items-center justify-end gap-2 border-t border-brand-grey/10 pt-4">
          <AdminActionsMenu :items="actionsFor(b)" />
        </div>
      </AdminCard>
    </div>

    <ClientOnly>
      <div v-if="!loading && mapBranches.length" class="overflow-hidden rounded-2xl border border-brand-grey/15">
        <div class="flex items-center justify-between border-b border-brand-grey/15 bg-brand-black/60 px-5 py-3">
          <h3 class="font-display text-sm tracking-display text-white flex items-center gap-2"><MapPin class="h-4 w-4 text-brand-red" />Branch Map</h3>
          <span class="text-xs text-brand-grey">{{ mapBranches.length }} location{{ mapBranches.length === 1 ? '' : 's' }}</span>
        </div>
        <LeafletMap v-if="mapBranches.length" :branches="mapBranches" height="300px" />
      </div>
    </ClientOnly>

    <AdminDrawer :open="drawerOpen" :title="editingId ? 'Edit Branch' : 'Add Branch'" :subtitle="editingId ? 'Update branch details' : 'Register a new dealership location'" @close="closeDrawer">
      <div class="space-y-4">
        <div class="rounded-xl border border-brand-grey/15 bg-white/[0.02] p-3">
          <ImagePicker
            v-model:items="imageItems"
            v-model:main="mainImage"
            label="Images"
            :categories="BRANCH_IMAGE_CATEGORIES"
            :max="15"
          />
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input v-model="form.name" label="Branch Name" placeholder="e.g. Nairobi HQ" />
          <SlugField v-model="form.slug" :title="form.name" path="/contact/" :was-published="!!editingId" label="URL Slug" />
        </div>
        <Input v-model="form.address" label="Address" placeholder="Street, building" />
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input v-model="form.phone" label="Phone" placeholder="+254..." />
          <Input v-model="form.email" label="Email" placeholder="branch@example.com" />
        </div>
        <Input v-model="form.hours" label="Working Hours" placeholder="Mon-Sat: 8:00 AM - 6:00 PM" />
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input v-model="form.lat" label="Latitude" type="number" placeholder="-1.326" />
          <Input v-model="form.lng" label="Longitude" type="number" placeholder="36.845" />
        </div>
        <Input v-model="form.map_url" label="Google Maps URL" placeholder="https://maps.google.com/?q=..." />
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
      </div>
      <template #footer>
        <Button variant="ghost" @click="closeDrawer">Cancel</Button>
        <Button :disabled="saving" @click="save">{{ saving ? 'Saving…' : 'Save Branch' }}</Button>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import { Building2, Users, CalendarCheck2, MapPin, Phone, Mail, Clock, Plus, Pencil, Trash2, ExternalLink } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import ImagePicker from '~/components/dashboard/media/ImagePicker.vue'
import { buildImageItems, appendImagePayload, firstFile, BRANCH_IMAGE_CATEGORIES } from '~/utils/imageTypes'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Branches - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()

const loading = ref(true)
const saving = ref(false)
const drawerOpen = ref(false)
const editingId = ref<string | null>(null)
const search = ref('')
const statusFilter = ref('')
const imageItems = ref<{ key: string; url: string; file?: File; name?: string; category?: string }[]>([])
const mainImage = ref(0)
const branches = ref<any[]>([])
const staff = ref<any[]>([])
const bookings = ref<any[]>([])
const testRides = ref<any[]>([])
const form = ref({ name: '', slug: '', address: '', phone: '', email: '', hours: '', lat: '', lng: '', map_url: '', status: 'active', sort_order: '0' })

const allBookings = computed(() => [...bookings.value, ...testRides.value])
const activeCount = computed(() => branches.value.filter(b => (b.status || 'active') !== 'inactive').length)
const staffCount = computed(() => staff.value.length)
const bookingsToday = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return allBookings.value.filter(b => (b.preferred_date || '').slice(0, 10) === today && b.status !== 'cancelled').length
})
const cityCount = computed(() => new Set(branches.value.map(b => b.address?.split(',').pop()?.trim()).filter(Boolean)).size)

const branchStaff = computed(() => {
  const map: Record<string, any[]> = {}
  for (const s of staff.value) {
    if (!s.branch) continue
    ;(map[s.branch] = map[s.branch] || []).push(s)
  }
  return map
})

const branchBookings = computed(() => {
  const map: Record<string, number> = {}
  for (const b of allBookings.value) {
    if (b.branch && b.status !== 'cancelled') map[b.branch] = (map[b.branch] || 0) + 1
  }
  return map
})

const branchTests = computed(() => {
  const map: Record<string, number> = {}
  for (const b of testRides.value) {
    if (b.branch) map[b.branch] = (map[b.branch] || 0) + 1
  }
  return map
})

const mapBranches = computed(() => branches.value.filter(b => b.lat != null && b.lng != null).map(b => ({ name: b.name, address: b.address, phone: b.phone, hours: b.hours, lat: b.lat, lng: b.lng })))

const filtered = computed(() => {
  const q = search.value.toLowerCase()
  return branches.value.filter(b => {
    if (q && !`${b.name} ${b.address} ${b.phone} ${b.email}`.toLowerCase().includes(q)) return false
    if (statusFilter.value && (b.status || 'active') !== statusFilter.value) return false
    return true
  })
})

function mainImageUrl(b: any): string | null {
  const main = firstFile(b, 'images')
  if (!main) return null
  return pb.files.getURL(b, main)
}

function actionsFor(b: any) {
  return [
    { label: 'View on Site', icon: ExternalLink, onClick: () => router.push('/contact') },
    { label: 'Edit', icon: Pencil, onClick: () => openEdit(b) },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => confirmDelete(b) },
  ]
}

function openCreate() {
  editingId.value = null
  form.value = { name: '', slug: '', address: '', phone: '', email: '', hours: '', lat: '', lng: '', map_url: '', status: 'active', sort_order: '0' }
  imageItems.value = []
  mainImage.value = 0
  drawerOpen.value = true
}

function openEdit(b: any) {
  editingId.value = b.id
  form.value = { name: b.name, slug: b.slug || '', address: b.address || '', phone: b.phone || '', email: b.email || '', hours: b.hours || '', lat: b.lat?.toString() || '', lng: b.lng?.toString() || '', map_url: b.map_url || '', status: b.status || 'active', sort_order: b.sort_order?.toString() || '0' }
  const built = buildImageItems(b, 'images', (rec, file) => pb.files.getURL(rec, file))
  imageItems.value = built.items
  mainImage.value = built.main
  drawerOpen.value = true
}

function closeDrawer() { drawerOpen.value = false }

async function save() {
  if (!form.value.name.trim()) { toast.add({ type: 'error', title: 'Branch name is required' }); useAudio().playError(); return }
  saving.value = true
  try {
    const data = new FormData()
    const fields = ['name', 'slug', 'address', 'phone', 'email', 'hours', 'map_url', 'sort_order'] as const
    for (const f of fields) { if (form.value[f]) data.append(f, String(form.value[f])) }
    data.append('status', form.value.status)
    if (form.value.lat) data.append('lat', form.value.lat)
    if (form.value.lng) data.append('lng', form.value.lng)
    appendImagePayload(data, imageItems.value, 'images')
    data.append('main_image', String(mainImage.value))
    if (editingId.value) {
      await pb.collection('branches').update(editingId.value, data)
      toast.add({ type: 'success', title: 'Branch updated' })
      useAudio().playSuccess()
    } else {
      await pb.collection('branches').create(data)
      toast.add({ type: 'success', title: 'Branch created' })
      useAudio().playSuccess()
    }
    closeDrawer()
    await loadData()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save', message: e?.message }); useAudio().playError() }
  finally { saving.value = false }
}

async function confirmDelete(b: any) {
  const ok = await confirmDlg.confirm({ title: 'Delete Branch', message: `Delete "${b.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('branches').delete(b.id)
    toast.add({ type: 'success', title: 'Branch deleted' })
    useAudio().playSuccess()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }); useAudio().playError() }
}

async function loadData() {
  const [b, s, bk, tr] = await Promise.all([
    pb.collection('branches').getFullList({ sort: 'sort_order,name' }).catch(() => []),
    pb.collection('users').getFullList({ filter: 'role != "customer"' }).catch(() => []),
    pb.collection('service_bookings').getFullList({ fields: 'branch,status,preferred_date' }).catch(() => []),
    pb.collection('test_rides').getFullList({ fields: 'branch,status,preferred_date' }).catch(() => []),
  ])
  branches.value = b as any[]
  staff.value = s as any[]
  bookings.value = bk as any[]
  testRides.value = tr as any[]
}

function subscribe() {
  pb.collection('branches').subscribe('*', () => loadData())
  pb.collection('service_bookings').subscribe('*', () => loadData())
  pb.collection('test_rides').subscribe('*', () => loadData())
}

onMounted(async () => {
  await loadData()
  subscribe()
  loading.value = false
})

onUnmounted(() => {
  try {
    pb.collection('branches').unsubscribe('*')
    pb.collection('service_bookings').unsubscribe('*')
    pb.collection('test_rides').unsubscribe('*')
  } catch { /* ignore */ }
})

const router = useRouter()
</script>