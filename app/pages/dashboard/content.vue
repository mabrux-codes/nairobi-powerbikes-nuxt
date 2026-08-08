<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Content Studio"
      eyebrow="Business"
      description="Manage the pages, milestones, stats and testimonials that power your public site."
      :actions="[{ label: 'Add Content', icon: Plus, onClick: () => activeTab = 'milestones' }]"
    />

    <!-- Page cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <AdminCard v-for="pg in pages" :key="pg.to" class="flex flex-col">
        <div class="flex items-start justify-between">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl" :class="pg.iconBg">
            <component :is="pg.icon" class="h-5 w-5" :class="pg.iconColor" />
          </span>
          <StatusChip status="published" size="sm" />
        </div>
        <h3 class="mt-4 font-display text-lg tracking-display text-white">{{ pg.label }}</h3>
        <p class="text-[11px] text-brand-grey">Slug: {{ pg.to }}</p>
        <p class="mt-1 flex-1 text-xs leading-relaxed text-brand-grey/70">{{ pg.description }}</p>
        <div class="mt-4 flex items-center justify-between border-t border-brand-grey/10 pt-3.5 text-[11px] text-brand-grey">
          <span>Updated {{ shortDate(pageUpdated(pg)) }}</span>
          <span class="font-semibold text-white">{{ auth.user?.name || 'Admin' }}</span>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <Button variant="ghost" size="sm" :to="pg.to" class="flex-1"><ExternalLink class="h-3.5 w-3.5" />Preview</Button>
          <Button variant="secondary" size="sm" class="flex-1" @click="editPage(pg)"><Pencil class="h-3.5 w-3.5" />Edit</Button>
        </div>
      </AdminCard>
    </div>

    <!-- Content sections -->
    <div class="rounded-2xl border border-brand-grey/15 bg-brand-black/60 overflow-hidden">
      <div class="flex flex-wrap items-center gap-2 border-b border-brand-grey/15 bg-brand-black/80 px-4 py-3">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200"
          :class="activeTab === tab.key ? 'bg-brand-red text-white shadow-lg shadow-brand-red/25' : 'text-brand-grey hover:text-white hover:bg-white/5'"
          @click="activeTab = tab.key"
        >
          <component :is="tab.icon" class="h-4 w-4" />{{ tab.label }}
          <span class="rounded-full px-1.5 py-0.5 text-[10px] font-bold" :class="activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-white/5 text-brand-grey'">{{ countFor(tab.key) }}</span>
        </button>
      </div>

      <div class="p-4 sm:p-5">
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div class="relative min-w-[200px] flex-1 sm:max-w-xs">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-grey/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input v-model="search" type="text" :placeholder="`Search ${activeLabel}...`" class="h-10 w-full rounded-xl border border-brand-grey/25 bg-brand-black/70 pl-9 text-sm text-white placeholder:text-brand-grey/50 focus:border-brand-red/60 focus:outline-none focus:ring-2 focus:ring-brand-red/20" />
          </div>
          <Button size="sm" @click="openAdd"><Plus class="h-4 w-4" />Add {{ activeLabel }}</Button>
        </div>

        <AdminSkeleton v-if="loading" :rows="3" variant="row" />

        <AdminEmptyState
          v-else-if="activeList.length === 0"
          :icon="activeIcon"
          :title="`No ${activeLabel}s`"
          :description="`Add your first ${activeLabel.toLowerCase()} to get started.`"
        >
          <Button size="sm" @click="openAdd"><Plus class="h-4 w-4" />Add {{ activeLabel }}</Button>
        </AdminEmptyState>

        <div v-else class="space-y-2">
          <div v-for="item in activeList" :key="item.id" class="flex flex-wrap items-center gap-3 rounded-xl border border-brand-grey/10 bg-white/[0.02] px-4 py-3 transition-colors hover:border-brand-red/30">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" :class="activeIconBg">
              <component :is="activeIcon" class="h-4 w-4" :class="activeIconColor" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-white">{{ itemTitle(item) }}</p>
              <p class="truncate text-xs text-brand-grey">{{ itemSub(item) }}</p>
            </div>
            <StatusChip :status="itemStatus(item)" size="sm" />
            <div class="flex items-center gap-1.5">
              <button class="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-grey/20 text-brand-grey hover:text-white hover:border-brand-red/50 transition-all" :aria-label="'Edit ' + itemTitle(item)" @click="openEdit(item)"><Pencil class="h-3.5 w-3.5" /></button>
              <button class="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-grey/20 text-brand-grey hover:text-rose-400 hover:border-rose-500/50 transition-all" :aria-label="'Delete ' + itemTitle(item)" @click="confirmDeleteItem(item)"><Trash2 class="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AdminDrawer :open="drawerOpen" :title="drawerTitle" :subtitle="editingId ? 'Update content details' : 'Create new content'" @close="closeDrawer">
      <div class="space-y-4">
        <!-- Milestone fields -->
        <template v-if="activeTab === 'milestones'">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input v-model="milestoneForm.year" label="Year" placeholder="e.g. 2025" />
            <Input v-model="milestoneForm.display_order" label="Order" type="number" placeholder="0" />
          </div>
          <Input v-model="milestoneForm.title" label="Title" placeholder="Milestone title" />
          <div><label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Description</label><textarea v-model="milestoneForm.description" rows="3" class="input-field rounded-xl resize-none" /></div>
        </template>

        <!-- Stat fields -->
        <template v-else-if="activeTab === 'stats'">
          <Input v-model="statForm.label" label="Label" placeholder="e.g. Bikes Sold" />
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input v-model="statForm.value" label="Value" type="number" placeholder="5000" />
            <Input v-model="statForm.suffix" label="Suffix" placeholder="e.g. +" />
          </div>
          <Input v-model="statForm.sort_order" label="Sort Order" type="number" placeholder="0" />
        </template>

        <!-- Testimonial fields -->
        <template v-else-if="activeTab === 'testimonials'">
          <Input v-model="testimonialForm.name" label="Customer Name" placeholder="John Doe" />
          <Input v-model="testimonialForm.role" label="Role / Title" placeholder="e.g. Motorcycle Enthusiast" />
          <div><label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Testimonial</label><textarea v-model="testimonialForm.content" rows="3" class="input-field rounded-xl resize-none" /></div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Rating (1-5)</label>
              <div class="flex items-center gap-1">
                <button v-for="n in 5" :key="n" class="p-0.5 transition-transform hover:scale-110" :aria-label="n + ' stars'" @click="testimonialForm.rating = n">
                  <Star class="h-5 w-5" :class="n <= (testimonialForm.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-brand-grey/40'" />
                </button>
              </div>
            </div>
            <Input v-model="testimonialForm.display_order" label="Display Order" type="number" placeholder="0" />
          </div>
          <div>
            <label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Photo</label>
            <input type="file" accept="image/*" class="block w-full text-xs text-brand-grey file:mr-3 file:rounded-lg file:border-0 file:bg-brand-red file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white" @change="onAvatarChange" />
            <img v-if="photoPreview" :src="photoPreview" class="mt-2 h-14 w-14 rounded-full object-cover" />
          </div>
        </template>

        <!-- Team fields -->
        <template v-else-if="activeTab === 'team'">
          <Input v-model="teamForm.name" label="Name" placeholder="Full name" />
          <Input v-model="teamForm.role" label="Role / Title" placeholder="e.g. Lead Mechanic" />
          <div><label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Bio</label><textarea v-model="teamForm.bio" rows="3" class="input-field rounded-xl resize-none" /></div>
          <Input v-model="teamForm.sort_order" label="Sort Order" type="number" placeholder="0" />
        </template>
      </div>
      <template #footer>
        <Button variant="ghost" @click="closeDrawer">Cancel</Button>
        <Button :disabled="saving" @click="saveItem">{{ saving ? 'Saving…' : 'Save' }}</Button>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import { Home, FileText, BookOpen, Mail, ScrollText, Shield, Plus, Pencil, Trash2, ExternalLink, Flag, BarChart3, MessageSquareQuote, Users } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Content - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const auth = useAuthStore()

const loading = ref(true)
const saving = ref(false)
const drawerOpen = ref(false)
const editingId = ref<string | null>(null)
const search = ref('')
const activeTab = ref('milestones')

const milestones = ref<any[]>([])
const stats = ref<any[]>([])
const testimonials = ref<any[]>([])
const team = ref<any[]>([])

const milestoneForm = ref({ year: '', title: '', description: '', display_order: '0' })
const statForm = ref({ label: '', value: '', suffix: '', sort_order: '0' })
const testimonialForm = ref({ name: '', role: '', content: '', rating: 5, display_order: '0' })
const teamForm = ref({ name: '', role: '', bio: '', sort_order: '0' })
const photoFile = ref<File | null>(null)
const photoPreview = ref<string | null>(null)

const tabs = [
  { key: 'milestones', label: 'Milestones', icon: Flag, bg: 'bg-brand-red/15', color: 'text-brand-red' },
  { key: 'stats', label: 'Stats', icon: BarChart3, bg: 'bg-sky-500/15', color: 'text-sky-400' },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, bg: 'bg-amber-500/15', color: 'text-amber-400' },
  { key: 'team', label: 'Team', icon: Users, bg: 'bg-violet-500/15', color: 'text-violet-400' },
]

const pages = [
  { label: 'Homepage', to: '/', icon: Home, iconBg: 'bg-brand-red/15', iconColor: 'text-brand-red', description: 'Hero, featured bikes, new arrivals and brand marquee.', updated: '' },
  { label: 'About', to: '/about', icon: BookOpen, iconBg: 'bg-sky-500/15', iconColor: 'text-sky-400', description: 'Our journey, milestones, stats and team.', updated: '' },
  { label: 'Finance', to: '/finance', icon: BarChart3, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', description: 'Financing calculator, loan options and FAQ.', updated: '' },
  { label: 'Contact', to: '/contact', icon: Mail, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400', description: 'Enquiry forms, branch cards and map.', updated: '' },
  { label: 'Terms', to: '/terms', icon: ScrollText, iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400', description: 'Terms of service for customers.', updated: '' },
  { label: 'Privacy', to: '/privacy', icon: Shield, iconBg: 'bg-rose-500/15', iconColor: 'text-rose-400', description: 'Privacy policy and data handling.', updated: '' },
]

const activeIcon = computed(() => tabs.find(t => t.key === activeTab.value)?.icon || Flag)
const activeIconBg = computed(() => tabs.find(t => t.key === activeTab.value)?.bg || 'bg-brand-red/15')
const activeIconColor = computed(() => tabs.find(t => t.key === activeTab.value)?.color || 'text-brand-red')
const activeLabel = computed(() => tabs.find(t => t.key === activeTab.value)?.label || 'Item')

function countFor(key: string) {
  if (key === 'milestones') return milestones.value.length
  if (key === 'stats') return stats.value.length
  if (key === 'testimonials') return testimonials.value.length
  return team.value.length
}

function listFor(key: string) { return key === 'milestones' ? milestones.value : key === 'stats' ? stats.value : key === 'testimonials' ? testimonials.value : team.value }

const activeList = computed(() => {
  const q = search.value.toLowerCase()
  const list = listFor(activeTab.value)
  return list.filter((i: any) => {
    const hay = [i.title, i.label, i.name, i.year, i.content].filter(Boolean).join(' ').toLowerCase()
    return !q || hay.includes(q)
  })
})

function itemTitle(item: any) {
  if (activeTab.value === 'milestones') return `${item.year} — ${item.title}`
  if (activeTab.value === 'stats') return item.label
  if (activeTab.value === 'testimonials') return item.name
  return item.name
}

function itemSub(item: any) {
  if (activeTab.value === 'milestones') return item.description
  if (activeTab.value === 'stats') return `${item.value}${item.suffix || ''}`
  if (activeTab.value === 'testimonials') return `${item.content}${item.role ? ` — ${item.role}` : ''}`
  return item.role
}

function itemStatus(item: any) {
  if (activeTab.value === 'milestones') return 'published'
  if (activeTab.value === 'stats') return 'active'
  return 'published'
}

const drawerTitle = computed(() => `${editingId.value ? 'Edit' : 'Add'} ${activeLabel.value}`)

function openAdd() {
  editingId.value = null
  if (activeTab.value === 'milestones') milestoneForm.value = { year: '', title: '', description: '', display_order: '0' }
  else if (activeTab.value === 'stats') statForm.value = { label: '', value: '', suffix: '', sort_order: '0' }
  else if (activeTab.value === 'testimonials') { testimonialForm.value = { name: '', role: '', content: '', rating: 5, display_order: '0' }; photoFile.value = null; photoPreview.value = null }
  else teamForm.value = { name: '', role: '', bio: '', sort_order: '0' }
  drawerOpen.value = true
}

function openEdit(item: any) {
  editingId.value = item.id
  if (activeTab.value === 'milestones') milestoneForm.value = { year: item.year, title: item.title, description: item.description || '', display_order: item.display_order?.toString() || '0' }
  else if (activeTab.value === 'stats') statForm.value = { label: item.label, value: item.value?.toString() || '', suffix: item.suffix || '', sort_order: item.sort_order?.toString() || '0' }
  else if (activeTab.value === 'testimonials') { testimonialForm.value = { name: item.name, role: item.role || '', content: item.content || '', rating: item.rating || 5, display_order: item.display_order?.toString() || '0' }; photoFile.value = null; photoPreview.value = item.photo ? pb.files.getURL(item, item.photo) : null }
  else teamForm.value = { name: item.name, role: item.role || '', bio: item.bio || '', sort_order: item.sort_order?.toString() || '0' }
  drawerOpen.value = true
}

function closeDrawer() { drawerOpen.value = false }

function onAvatarChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) { photoFile.value = target.files[0]; photoPreview.value = URL.createObjectURL(target.files[0]) }
}

function editPage(pg: any) {
  if (pg.to === '/about') activeTab.value = 'milestones'
  else if (pg.to === '/contact') router.push('/dashboard/branches')
  else if (pg.to === '/finance') activeTab.value = 'stats'
  else if (pg.to === '/terms' || pg.to === '/privacy') router.push(`/dashboard/legal?slug=${pg.to.replace('/', '')}`)
  else router.push(pg.to)
}

function pageUpdated(pg: any) {
  if ((pg.to === '/terms' || pg.to === '/privacy') && legalPages.value.length) {
    const slug = pg.to.replace('/', '')
    const published = legalPages.value.filter((l: any) => l.slug === slug && l.status === 'published')
      .sort((a: any, b: any) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime())[0]
    return published?.published_at || '—'
  }
  return '—'
}

async function saveItem() {
  saving.value = true
  try {
    if (activeTab.value === 'milestones') {
      const p: any = { year: milestoneForm.value.year, title: milestoneForm.value.title, description: milestoneForm.value.description, display_order: parseInt(milestoneForm.value.display_order) || 0 }
      if (editingId.value) { await pb.collection('timeline_milestones').update(editingId.value, p); toast.add({ type: 'success', title: 'Milestone updated' }) }
      else { await pb.collection('timeline_milestones').create(p); toast.add({ type: 'success', title: 'Milestone created' }) }
    } else if (activeTab.value === 'stats') {
      const p: any = { label: statForm.value.label, value: parseInt(statForm.value.value) || 0, suffix: statForm.value.suffix, sort_order: parseInt(statForm.value.sort_order) || 0 }
      if (editingId.value) { await pb.collection('company_stats').update(editingId.value, p); toast.add({ type: 'success', title: 'Stat updated' }) }
      else { await pb.collection('company_stats').create(p); toast.add({ type: 'success', title: 'Stat created' }) }
    } else if (activeTab.value === 'testimonials') {
      const fd = new FormData()
      fd.append('name', testimonialForm.value.name)
      fd.append('role', testimonialForm.value.role)
      fd.append('content', testimonialForm.value.content)
      fd.append('rating', (testimonialForm.value.rating || 5).toString())
      fd.append('display_order', testimonialForm.value.display_order || '0')
      if (photoFile.value) fd.append('photo', photoFile.value)
      if (editingId.value) { await pb.collection('testimonials').update(editingId.value, fd); toast.add({ type: 'success', title: 'Testimonial updated' }) }
      else { await pb.collection('testimonials').create(fd); toast.add({ type: 'success', title: 'Testimonial created' }) }
    } else {
      const p: any = { name: teamForm.value.name, role: teamForm.value.role, bio: teamForm.value.bio, sort_order: parseInt(teamForm.value.sort_order) || 0 }
      if (editingId.value) { await pb.collection('team_members').update(editingId.value, p); toast.add({ type: 'success', title: 'Team member updated' }) }
      else { await pb.collection('team_members').create(p); toast.add({ type: 'success', title: 'Team member created' }) }
    }
    closeDrawer()
    await loadData()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save', message: e?.message }) }
  finally { saving.value = false }
}

async function confirmDeleteItem(item: any) {
  const ok = await confirmDlg.confirm({ title: `Delete ${activeLabel.value}`, message: 'Are you sure? This cannot be undone.', confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    const coll = activeTab.value === 'milestones' ? 'timeline_milestones' : activeTab.value === 'stats' ? 'company_stats' : activeTab.value === 'testimonials' ? 'testimonials' : 'team_members'
    await pb.collection(coll).delete(item.id)
    toast.add({ type: 'success', title: `${activeLabel.value} deleted` })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }) }
}

function shortDate(d: string) {
  if (!d) return '—'
  const date = new Date(d)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const legalPages = ref<any[]>([])

async function loadData() {
  const [m, s, t, te, lp] = await Promise.all([
    pb.collection('timeline_milestones').getFullList({ sort: 'display_order' }).catch(() => []),
    pb.collection('company_stats').getList(1, 10, { sort: 'sort_order' }).catch(() => ({ items: [] })),
    pb.collection('team_members').getFullList({ sort: 'sort_order' }).catch(() => []),
    pb.collection('testimonials').getFullList({ sort: 'display_order' }).catch(() => []),
    pb.collection('legal_pages').getList(1, 100, { sort: '-version', requestKey: 'legal-content-page' }).catch(() => ({ items: [] })),
  ])
  milestones.value = m as any[]
  stats.value = (s as any).items || []
  team.value = t as any[]
  testimonials.value = te as any[]
  legalPages.value = (lp as any).items || []
}

function subscribe() {
  for (const coll of ['timeline_milestones', 'company_stats', 'testimonials', 'team_members']) {
    try { pb.collection(coll).subscribe('*', loadData) } catch { /* ignore */ }
  }
  try { pb.collection('legal_pages').subscribe('*', loadData) } catch { /* ignore */ }
}

onMounted(async () => {
  await loadData()
  subscribe()
  loading.value = false
})

onUnmounted(() => {
  for (const coll of ['timeline_milestones', 'company_stats', 'testimonials', 'team_members']) {
    try { pb.collection(coll).unsubscribe('*') } catch { /* ignore */ }
  }
  try { pb.collection('legal_pages').unsubscribe('*') } catch { /* ignore */ }
})

const router = useRouter()
</script>
