<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Team Members"
      eyebrow="Business"
      description="Curate the team showcased on your public About page. Drag to reorder."
      :actions="[{ label: 'Add Member', icon: Plus, onClick: openCreate }]"
    />

    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-6">
        <div class="mx-auto h-20 w-20 rounded-full bg-brand-grey/10" />
        <div class="mx-auto mt-4 h-5 w-24 rounded bg-brand-grey/10" />
        <div class="mx-auto mt-2 h-4 w-16 rounded bg-brand-grey/10" />
      </div>
    </div>

    <AdminEmptyState
      v-else-if="members.length === 0"
      :icon="Users"
      title="No Team Members"
      description="Add team members to showcase on the About page."
    >
      <Button size="sm" @click="openCreate"><Plus class="h-4 w-4" />Add Member</Button>
    </AdminEmptyState>

    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="(m, idx) in members"
        :key="m.id"
        class="group relative cursor-grab active:cursor-grabbing rounded-2xl border border-brand-grey/15 bg-brand-black/80 p-6 text-center transition-all duration-200 hover:border-brand-red/40 hover:shadow-lg hover:shadow-brand-red/5"
        :class="draggingId === m.id ? 'opacity-40 border-brand-red/60' : ''"
        draggable="true"
        @dragstart="onDragStart(m, $event)"
        @dragover.prevent="onDragOver(m, $event)"
        @drop.prevent="onDrop(m)"
        @dragend="onDragEnd"
      >
        <div class="absolute left-3 top-3 flex items-center gap-1.5">
          <GripVertical class="h-4 w-4 text-brand-grey/40" />
          <span v-if="isFeatured(m)" class="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/15 text-amber-400" title="Featured">
            <Star class="h-3.5 w-3.5" />
          </span>
        </div>
        <AdminActionsMenu v-if="false" :items="actionsFor(m)" />

        <div class="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-grey/25 to-brand-black ring-2 ring-brand-red/20">
          <img v-if="m.photo" :src="pb.files.getURL(m, m.photo)" :alt="m.name" class="h-full w-full object-cover" />
          <span v-else class="font-heading text-2xl text-brand-grey/50">{{ initials(m.name) }}</span>
        </div>
        <h3 class="mt-4 font-display text-lg tracking-display text-white">{{ m.name }}</h3>
        <p class="text-[11px] font-display tracking-wider text-brand-red uppercase">{{ m.role }}</p>
        <p class="mt-1 text-[10px] font-display tracking-wider text-brand-grey/70 uppercase">{{ dept(m.role) }}</p>
        <p v-if="m.bio" class="mt-3 line-clamp-3 text-xs leading-relaxed text-brand-grey/70">{{ m.bio }}</p>

        <div class="mt-4 flex items-center justify-center gap-2 border-t border-brand-grey/10 pt-4">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-grey/20 text-brand-grey hover:text-white hover:border-brand-red/50 transition-all duration-200"
            :disabled="idx === 0"
            aria-label="Move up"
            @click="moveUp(m, idx)"
          >
            <ChevronUp class="h-4 w-4" />
          </button>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-grey/20 text-brand-grey hover:text-white hover:border-brand-red/50 transition-all duration-200"
            :disabled="idx === members.length - 1"
            aria-label="Move down"
            @click="moveDown(m, idx)"
          >
            <ChevronDown class="h-4 w-4" />
          </button>
          <span class="mx-1 h-6 w-px bg-brand-grey/15" />
          <Button variant="ghost" size="sm" @click="openEdit(m)">Edit</Button>
          <Button variant="danger" size="sm" @click="confirmDelete(m)">Delete</Button>
        </div>
      </div>
    </div>

    <AdminDrawer :open="drawerOpen" :title="editingId ? 'Edit Member' : 'Add Member'" :subtitle="editingId ? 'Update team member details' : 'Add a team member to the About page'" @close="closeDrawer">
      <div class="space-y-4">
        <div class="flex items-center gap-4">
          <div class="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-lg font-bold text-white">
            <img v-if="photoPreview" :src="photoPreview" alt="Photo preview" class="h-full w-full object-cover" />
            <span v-else>{{ form.name.slice(0, 2).toUpperCase() || '?' }}</span>
          </div>
          <div class="flex-1">
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Photo</label>
            <input type="file" accept="image/*" class="block w-full text-xs text-brand-grey file:mr-3 file:rounded-lg file:border-0 file:bg-brand-red file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white" @change="onPhotoChange" />
          </div>
        </div>
        <Input v-model="form.name" label="Full Name" placeholder="Jane Doe" />
        <Input v-model="form.role" label="Position" placeholder="e.g. Lead Mechanic" />
        <div>
          <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Biography</label>
          <textarea v-model="form.bio" rows="4" class="input-field rounded-xl resize-none" placeholder="Short biography..." />
        </div>
        <Input v-model="form.sort_order" label="Sort Order" type="number" placeholder="0" />
      </div>
      <template #footer>
        <Button variant="ghost" @click="closeDrawer">Cancel</Button>
        <Button :disabled="saving" @click="save">{{ saving ? 'Saving…' : 'Save Member' }}</Button>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import { Users, Plus, Star, ChevronUp, ChevronDown, GripVertical, Pencil, Trash2 } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Team Members - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()

const loading = ref(true)
const saving = ref(false)
const drawerOpen = ref(false)
const editingId = ref<string | null>(null)
const members = ref<any[]>([])
const photoFile = ref<File | null>(null)
const photoPreview = ref<string | null>(null)
const form = ref({ name: '', role: '', bio: '', sort_order: '0' })
const draggingId = ref<string | null>(null)
const dragFrom = ref(-1)

const DEPTS: Record<string, string> = {
  general: 'Management', manager: 'Management', director: 'Management', founder: 'Management',
  mechanic: 'Service', technician: 'Service', sales: 'Sales', marketing: 'Marketing', finance: 'Finance',
}
function dept(role: string) {
  const key = (role || '').toLowerCase()
  for (const [k, v] of Object.entries(DEPTS)) if (key.includes(k)) return v
  return 'Operations'
}

function isFeatured(m: any) { return Number(m.sort_order || 0) === 0 }

function initials(name: string) { return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() }

function actionsFor(m: any) {
  return [
    { label: 'Edit', icon: Pencil, onClick: () => openEdit(m) },
    { label: 'Delete', icon: Trash2, danger: true, onClick: () => confirmDelete(m) },
  ]
}

function openCreate() {
  editingId.value = null
  form.value = { name: '', role: '', bio: '', sort_order: String(members.value.length + 1) }
  photoFile.value = null
  photoPreview.value = null
  drawerOpen.value = true
}

function openEdit(m: any) {
  editingId.value = m.id
  form.value = { name: m.name, role: m.role || '', bio: m.bio || '', sort_order: m.sort_order?.toString() || '0' }
  photoFile.value = null
  photoPreview.value = m.photo ? pb.files.getURL(m, m.photo) : null
  drawerOpen.value = true
}

function closeDrawer() { drawerOpen.value = false }

function onPhotoChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) {
    photoFile.value = target.files[0]
    photoPreview.value = URL.createObjectURL(target.files[0])
  }
}

async function save() {
  if (!form.value.name.trim()) { toast.add({ type: 'error', title: 'Name is required' }); return }
  saving.value = true
  try {
    const fd = new FormData()
    fd.append('name', form.value.name)
    fd.append('role', form.value.role)
    fd.append('bio', form.value.bio)
    fd.append('sort_order', String(parseInt(form.value.sort_order) || 0))
    if (photoFile.value) fd.append('photo', photoFile.value)
    if (editingId.value) {
      await pb.collection('team_members').update(editingId.value, fd)
      toast.add({ type: 'success', title: 'Member updated' })
    } else {
      await pb.collection('team_members').create(fd)
      toast.add({ type: 'success', title: 'Member added' })
    }
    closeDrawer()
    await loadData()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save', message: e?.message }) }
  finally { saving.value = false }
}

async function confirmDelete(m: any) {
  const ok = await confirmDlg.confirm({ title: 'Delete Member', message: `Delete "${m.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('team_members').delete(m.id)
    toast.add({ type: 'success', title: 'Member deleted' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }) }
}

function onDragStart(m: any, e: DragEvent) {
  draggingId.value = m.id
  dragFrom.value = members.value.findIndex(x => x.id === m.id)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

function onDragOver(m: any) {
  const to = members.value.findIndex(x => x.id === m.id)
  if (to < 0 || to === dragFrom.value) return
  const arr = [...members.value]
  const [item] = arr.splice(dragFrom.value, 1)
  arr.splice(to, 0, item)
  members.value = arr
  dragFrom.value = to
}

async function onDrop() {
  draggingId.value = null
  await persistOrder()
}

function onDragEnd() { draggingId.value = null }

function moveUp(m: any, idx: number) {
  if (idx <= 0) return
  const arr = [...members.value]
  const [item] = arr.splice(idx, 1)
  arr.splice(idx - 1, 0, item)
  members.value = arr
  persistOrder()
}

function moveDown(m: any, idx: number) {
  if (idx >= members.value.length - 1) return
  const arr = [...members.value]
  const [item] = arr.splice(idx, 1)
  arr.splice(idx + 1, 0, item)
  members.value = arr
  persistOrder()
}

async function persistOrder() {
  try {
    await Promise.all(members.value.map((m, i) => pb.collection('team_members').update(m.id, { sort_order: i + 1 }).catch(() => null)))
    toast.add({ type: 'success', title: 'Order saved' })
  } catch { /* ignore */ }
}

async function loadData() {
  try {
    const res = await pb.collection('team_members').getFullList({ sort: 'sort_order' })
    members.value = res as any[]
  } catch { /* ignore */ }
}

function subscribe() {
  pb.collection('team_members').subscribe('*', loadData)
}

onMounted(async () => {
  await loadData()
  subscribe()
  loading.value = false
})

onUnmounted(() => {
  try { pb.collection('team_members').unsubscribe('*') } catch { /* ignore */ }
})
</script>
