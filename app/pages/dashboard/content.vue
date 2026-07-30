<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6">
        <h1 class="font-heading text-4xl text-white">Content <span class="text-brand-red">Management</span></h1>
        <p class="mt-1 text-sm text-brand-grey">Manage About page content, milestones, and company stats</p>
      </div>

      <div v-if="loading" class="space-y-6">
        <div v-for="i in 3" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-6"><div class="mb-4 h-6 w-48 rounded bg-brand-grey/10" /><div class="h-24 rounded bg-brand-grey/10" /></div>
      </div>

      <div v-else class="space-y-8">
        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-display text-lg tracking-display text-white">Company Milestones</h2>
            <Button size="sm" @click="openMilestoneModal()">Add Milestone</Button>
          </div>
          <div v-if="milestones.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-6 text-center"><p class="text-sm text-brand-grey">No milestones yet</p></div>
          <div v-else class="space-y-2">
            <div v-for="ms in milestones" :key="ms.id" class="flex items-center justify-between rounded-sm border border-brand-grey/10 px-4 py-3">
              <div>
                <p class="text-sm font-medium text-white"><span class="text-brand-red">{{ ms.year }}</span> &mdash; {{ ms.title }}</p>
                <p class="text-xs text-brand-grey">{{ ms.description }}</p>
              </div>
              <div class="flex gap-2">
                <Button variant="ghost" size="sm" @click="openMilestoneModal(ms)">Edit</Button>
                <Button variant="outline" size="sm" @click="deleteMilestone(ms)">Delete</Button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-display text-lg tracking-display text-white">Company Stats</h2>
            <Button size="sm" @click="openStatModal()">Add Stat</Button>
          </div>
          <div v-if="stats.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-6 text-center"><p class="text-sm text-brand-grey">No stats yet</p></div>
          <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="s in stats" :key="s.id" class="rounded-sm border border-brand-grey/10 p-4 text-center">
              <p class="font-heading text-4xl text-white">{{ s.value }}{{ s.suffix || '' }}</p>
              <p class="text-xs font-display tracking-display text-brand-grey uppercase">{{ s.label }}</p>
              <div class="mt-2 flex justify-center gap-2">
                <Button variant="ghost" size="sm" @click="openStatModal(s)">Edit</Button>
                <Button variant="outline" size="sm" @click="deleteStat(s)">Delete</Button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-display text-lg tracking-display text-white">Team Members (About Page)</h2>
            <Button size="sm" @click="openTeamModal()">Add Member</Button>
          </div>
          <div v-if="team.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-6 text-center"><p class="text-sm text-brand-grey">No team members</p></div>
          <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div v-for="m in team" :key="m.id" class="rounded-sm border border-brand-grey/10 p-4 text-center">
              <div class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-brand-grey/20 text-xs font-bold text-brand-light">{{ getInitials(m.name) }}</div>
              <p class="font-display text-white">{{ m.name }}</p>
              <p class="text-xs text-brand-red font-display tracking-display">{{ m.role }}</p>
              <div class="mt-2 flex justify-center gap-2">
                <Button variant="ghost" size="sm" @click="openTeamModal(m)">Edit</Button>
                <Button variant="outline" size="sm" @click="deleteTeamMember(m)">Delete</Button>
              </div>
            </div>
          </div>
        </div>
        <div class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-6">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-display text-lg tracking-display text-white">Testimonials (Homepage)</h2>
            <Button size="sm" @click="openTestimonialModal()">Add Testimonial</Button>
          </div>
          <div v-if="testimonials.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-6 text-center"><p class="text-sm text-brand-grey">No testimonials yet</p></div>
          <div v-else class="space-y-2">
            <div v-for="t in testimonials" :key="t.id" class="flex items-start justify-between rounded-sm border border-brand-grey/10 px-4 py-3">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-white">{{ t.name }} <span v-if="t.role" class="text-xs text-brand-grey font-normal">&mdash; {{ t.role }}</span></p>
                <p class="mt-1 text-xs text-brand-grey/70 line-clamp-2">{{ t.content }}</p>
              </div>
              <div class="flex flex-shrink-0 gap-2 ml-4">
                <Button variant="ghost" size="sm" @click="openTestimonialModal(t)">Edit</Button>
                <Button variant="outline" size="sm" @click="deleteTestimonial(t)">Delete</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showMilestoneModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="showMilestoneModal = false">
        <div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6">
          <h2 class="font-display text-xl tracking-display text-white">{{ editingMilestoneId ? 'Edit Milestone' : 'Add Milestone' }}</h2>
          <div class="mt-4 space-y-4">
            <Input v-model="milestoneForm.year" label="Year" placeholder="e.g. 2025" />
            <Input v-model="milestoneForm.title" label="Title" placeholder="Milestone title" />
            <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Description</label><textarea v-model="milestoneForm.description" rows="3" class="input-field w-full resize-none" /></div>
            <Input v-model="milestoneForm.display_order" label="Display Order" type="number" placeholder="0" />
          </div>
          <div class="mt-6 flex justify-end gap-3"><Button variant="ghost" @click="showMilestoneModal = false">Cancel</Button><Button :disabled="savingMilestone" @click="saveMilestone">{{ savingMilestone ? 'Saving...' : 'Save' }}</Button></div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showStatModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="showStatModal = false">
        <div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6">
          <h2 class="font-display text-xl tracking-display text-white">{{ editingStatId ? 'Edit Stat' : 'Add Stat' }}</h2>
          <div class="mt-4 space-y-4">
            <Input v-model="statForm.label" label="Label" placeholder="e.g. Bikes Sold" />
            <div class="grid grid-cols-2 gap-4">
              <Input v-model="statForm.value" label="Value" type="number" placeholder="5000" />
              <Input v-model="statForm.suffix" label="Suffix" placeholder="e.g. +" />
            </div>
            <Input v-model="statForm.sort_order" label="Sort Order" type="number" placeholder="0" />
          </div>
          <div class="mt-6 flex justify-end gap-3"><Button variant="ghost" @click="showStatModal = false">Cancel</Button><Button :disabled="savingStat" @click="saveStat">{{ savingStat ? 'Saving...' : 'Save' }}</Button></div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showTestimonialModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="showTestimonialModal = false">
        <div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6">
          <h2 class="font-display text-xl tracking-display text-white">{{ editingTestimonialId ? 'Edit Testimonial' : 'Add Testimonial' }}</h2>
          <div class="mt-4 space-y-4">
            <Input v-model="testimonialForm.name" label="Customer Name" placeholder="John Doe" />
            <Input v-model="testimonialForm.role" label="Role / Title" placeholder="e.g. Motorcycle Enthusiast" />
            <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Testimonial</label><textarea v-model="testimonialForm.content" rows="3" class="input-field w-full resize-none" placeholder="Their feedback..." /></div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Rating (1-5)</label><input v-model.number="testimonialForm.rating" type="number" min="1" max="5" class="input-field h-11" /></div>
              <Input v-model="testimonialForm.display_order" label="Display Order" type="number" placeholder="0" />
            </div>
            <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Photo</label><input type="file" accept="image/*" @change="onAvatarChange" class="input-field w-full text-sm file:mr-3 file:border-0 file:bg-brand-red file:px-3 file:py-1 file:text-xs file:text-white" /><img v-if="photoPreview" :src="photoPreview" class="mt-2 h-12 w-12 rounded-full object-cover" /></div>
          </div>
          <div class="mt-6 flex justify-end gap-3"><Button variant="ghost" @click="showTestimonialModal = false">Cancel</Button><Button :disabled="savingTestimonial" @click="saveTestimonial">{{ savingTestimonial ? 'Saving...' : 'Save' }}</Button></div>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showTeamModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="showTeamModal = false">
        <div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6">
          <h2 class="font-display text-xl tracking-display text-white">{{ editingTeamId ? 'Edit Team Member' : 'Add Team Member' }}</h2>
          <div class="mt-4 space-y-4">
            <Input v-model="teamForm.name" label="Name" placeholder="Full name" />
            <Input v-model="teamForm.role" label="Role / Title" placeholder="e.g. Lead Mechanic" />
            <div><label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Bio</label><textarea v-model="teamForm.bio" rows="3" class="input-field w-full resize-none" /></div>
            <Input v-model="teamForm.sort_order" label="Sort Order" type="number" placeholder="0" />
          </div>
          <div class="mt-6 flex justify-end gap-3"><Button variant="ghost" @click="showTeamModal = false">Cancel</Button><Button :disabled="savingTeam" @click="saveTeamMember">{{ savingTeam ? 'Saving...' : 'Save' }}</Button></div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { usePB } from '~/composables/usePocketBase'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Content - Manager - Nairobi Powerbikes' })

const pb = usePB(); const loading = ref(true)
const milestones = ref<any[]>([]); const stats = ref<any[]>([]); const team = ref<any[]>([]); const testimonials = ref<any[]>([])

const showMilestoneModal = ref(false); const editingMilestoneId = ref<string | null>(null); const savingMilestone = ref(false)
const milestoneForm = ref({ year: '', title: '', description: '', display_order: '0' })

const showStatModal = ref(false); const editingStatId = ref<string | null>(null); const savingStat = ref(false)
const statForm = ref({ label: '', value: '', suffix: '', sort_order: '0' })

const showTeamModal = ref(false); const editingTeamId = ref<string | null>(null); const savingTeam = ref(false)
const teamForm = ref({ name: '', role: '', bio: '', sort_order: '0' })

const showTestimonialModal = ref(false); const editingTestimonialId = ref<string | null>(null); const savingTestimonial = ref(false)
const testimonialForm = ref({ name: '', role: '', content: '', rating: 5, display_order: '0' })
const photoFile = ref<File | null>(null); const photoPreview = ref<string | null>(null)

function openTestimonialModal(t?: any) {
  editingTestimonialId.value = t?.id || null
  testimonialForm.value = t ? { name: t.name, role: t.role || '', content: t.content || '', rating: t.rating || 5, display_order: t.display_order?.toString() || '0' } : { name: '', role: '', content: '', rating: 5, display_order: '0' }
  photoFile.value = null; photoPreview.value = t?.photo ? pb.files.getURL(t, t.photo) : null
  showTestimonialModal.value = true
}

function onAvatarChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files?.[0]) { photoFile.value = target.files[0]; photoPreview.value = URL.createObjectURL(target.files[0]) }
}

async function saveTestimonial() {
  savingTestimonial.value = true
  try {
    const data = new FormData()
    data.append('name', testimonialForm.value.name)
    data.append('role', testimonialForm.value.role)
    data.append('content', testimonialForm.value.content)
    data.append('rating', (testimonialForm.value.rating || 5).toString())
    data.append('display_order', testimonialForm.value.display_order || '0')
    if (photoFile.value) data.append('photo', photoFile.value)
    if (editingTestimonialId.value) await pb.collection('testimonials').update(editingTestimonialId.value, data)
    else await pb.collection('testimonials').create(data)
    showTestimonialModal.value = false; await loadData()
  } catch (e) { console.error(e) }
  finally { savingTestimonial.value = false }
}

async function deleteTestimonial(t: any) {
  if (await confirm('Delete this testimonial?')) pb.collection('testimonials').delete(t.id).then(() => loadData())
}

function getInitials(name: string) { return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase() }

function openMilestoneModal(ms?: any) { editingMilestoneId.value = ms?.id || null; milestoneForm.value = ms ? { year: ms.year, title: ms.title, description: ms.description || '', display_order: ms.display_order?.toString() || '0' } : { year: '', title: '', description: '', display_order: '0' }; showMilestoneModal.value = true }
async function saveMilestone() { savingMilestone.value = true; try { const p: any = { ...milestoneForm.value, display_order: parseInt(milestoneForm.value.display_order) || 0 };       if (editingMilestoneId.value) await pb.collection('timeline_milestones').update(editingMilestoneId.value, p); else await pb.collection('timeline_milestones').create(p); showMilestoneModal.value = false; await loadData() } catch (e) { console.error(e) } finally { savingMilestone.value = false } }
async function deleteMilestone(ms: any) { if (await confirm('Delete this milestone?')) pb.collection('timeline_milestones').delete(ms.id).then(() => loadData()) }

function openStatModal(s?: any) { editingStatId.value = s?.id || null; statForm.value = s ? { label: s.label, value: s.value?.toString() || '', suffix: s.suffix || '', sort_order: s.sort_order?.toString() || '0' } : { label: '', value: '', suffix: '', sort_order: '0' }; showStatModal.value = true }
async function saveStat() { savingStat.value = true; try { const p: any = { ...statForm.value, value: parseInt(statForm.value.value) || 0, sort_order: parseInt(statForm.value.sort_order) || 0 }; if (editingStatId.value) await pb.collection('company_stats').update(editingStatId.value, p); else await pb.collection('company_stats').create(p); showStatModal.value = false; await loadData() } catch (e) { console.error(e) } finally { savingStat.value = false } }
async function deleteStat(s: any) { if (await confirm('Delete this stat?')) pb.collection('company_stats').delete(s.id).then(() => loadData()) }

function openTeamModal(m?: any) { editingTeamId.value = m?.id || null; teamForm.value = m ? { name: m.name, role: m.role || '', bio: m.bio || '', sort_order: m.sort_order?.toString() || '0' } : { name: '', role: '', bio: '', sort_order: '0' }; showTeamModal.value = true }
async function saveTeamMember() { savingTeam.value = true; try { const p: any = { ...teamForm.value, sort_order: parseInt(teamForm.value.sort_order) || 0 }; if (editingTeamId.value) await pb.collection('team_members').update(editingTeamId.value, p); else await pb.collection('team_members').create(p); showTeamModal.value = false; await loadData() } catch (e) { console.error(e) } finally { savingTeam.value = false } }
async function deleteTeamMember(m: any) { if (await confirm(`Delete "${m.name}"?`)) pb.collection('team_members').delete(m.id).then(() => loadData()) }

async function loadData() {
  try {
    const [m, s, t, te] = await Promise.all([
      pb.collection('timeline_milestones').getFullList({ sort: 'display_order' }).catch(() => []),
      pb.collection('company_stats').getList(1, 10, { sort: 'sort_order' }).catch(() => ({ items: [] })),
      pb.collection('team_members').getFullList({ sort: 'sort_order' }).catch(() => []),
      pb.collection('testimonials').getFullList({ sort: 'display_order' }).catch(() => []),
    ])
    milestones.value = m as any[]; stats.value = (s as any).items || []; team.value = t as any[]; testimonials.value = te as any[]
  } catch (e) { console.error(e) }
}

onMounted(async () => { await loadData(); loading.value = false })
</script>
