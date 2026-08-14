<template>
  <div class="space-y-6">
    <AdminPageHeader
      title="Settings"
      eyebrow="Account"
      description="Configure your dealership, services, notifications and access."
    />

    <div class="flex flex-col gap-6 lg:flex-row">
      <!-- Section nav -->
      <div class="lg:w-60 shrink-0">
        <div class="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible rounded-2xl border border-brand-grey/15 bg-brand-black/60 p-2 lg:sticky lg:top-24">
          <button
            v-for="s in sections"
            :key="s.key"
            class="flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-sm font-semibold transition-all duration-200"
            :class="activeSection === s.key ? 'bg-brand-red text-white shadow-lg shadow-brand-red/25' : 'text-brand-grey hover:text-white hover:bg-white/5'"
            @click="activeSection = s.key"
          >
            <component :is="s.icon" class="h-4 w-4" />
            <span class="whitespace-nowrap">{{ s.label }}</span>
          </button>
        </div>
      </div>

      <!-- Section content -->
      <div class="flex-1 min-w-0 space-y-6">
        <!-- General -->
        <template v-if="activeSection === 'general'">
          <AdminCard>
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/15"><Building2 class="h-6 w-6 text-brand-red" /></div>
              <div>
                <h3 class="font-display text-lg tracking-display text-white">Nairobi Powerbikes</h3>
                <p class="text-xs text-brand-grey">Premium motorcycle dealership</p>
              </div>
            </div>
            <div class="mt-5 grid gap-4 sm:grid-cols-2">
              <div class="rounded-xl border border-brand-grey/15 bg-white/[0.02] p-4">
                <p class="text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Head Office</p>
                <p class="mt-1.5 text-sm text-white">{{ headBranch?.name || 'Nairobi HQ' }}</p>
                <p class="text-xs text-brand-grey">{{ headBranch?.address || 'Mombasa Road, Nairobi' }}</p>
              </div>
              <div class="rounded-xl border border-brand-grey/15 bg-white/[0.02] p-4">
                <p class="text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Contact</p>
                <p class="mt-1.5 text-sm text-white">{{ headBranch?.phone || '—' }}</p>
                <p class="text-xs text-brand-grey">{{ headBranch?.email || '—' }}</p>
              </div>
            </div>
          </AdminCard>
          <AdminCard>
            <h3 class="font-display text-lg tracking-display text-white">System Information</h3>
            <div class="mt-4 space-y-2.5 text-sm">
              <div class="flex items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3"><span class="text-brand-grey">Application</span><span class="font-semibold text-white">Nairobi Powerbikes Portal</span></div>
              <div class="flex items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3"><span class="text-brand-grey">Backend</span><span class="font-mono text-xs text-white">{{ pbUrl }}</span></div>
              <div class="flex items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3">
                <span class="text-brand-grey">Realtime Status</span>
                <span class="inline-flex items-center gap-1.5 text-xs font-semibold" :class="store.status === 'connected' ? 'text-emerald-400' : 'text-amber-400'">
                  <span class="relative flex h-2 w-2"><span class="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" :class="store.status === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'" /><span class="relative inline-flex h-2 w-2 rounded-full" :class="store.status === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'" /></span>
                  {{ store.status === 'connected' ? 'Connected' : store.status }}
                </span>
              </div>
            </div>
          </AdminCard>
        </template>

        <!-- Branches -->
        <template v-else-if="activeSection === 'branches'">
          <AdminCard>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-display text-lg tracking-display text-white">Dealership Branches</h3>
                <p class="mt-0.5 text-xs text-brand-grey">{{ branches.length }} location{{ branches.length === 1 ? '' : 's' }} across Nairobi</p>
              </div>
              <Button size="sm" @click="openBranchModal()"><Plus class="h-4 w-4" />Add Branch</Button>
            </div>
            <div v-if="branches.length === 0" class="mt-4 rounded-xl border border-dashed border-brand-grey/20 p-8 text-center text-sm text-brand-grey">No branches configured</div>
            <div v-else class="mt-4 space-y-2">
              <div v-for="b in branches" :key="b.id" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-grey/10 bg-white/[0.02] px-4 py-3">
                <div class="min-w-0">
                  <p class="font-medium text-white">{{ b.name }}</p>
                  <p class="truncate text-xs text-brand-grey">{{ b.address }}</p>
                </div>
                <div class="flex items-center gap-2">
                  <button class="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-grey/20 text-brand-grey hover:text-white hover:border-brand-red/50" :aria-label="'Edit ' + b.name" @click="openBranchModal(b)"><Pencil class="h-3.5 w-3.5" /></button>
                  <button class="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-grey/20 text-brand-grey hover:text-rose-400 hover:border-rose-500/50" :aria-label="'Delete ' + b.name" @click="deleteBranch(b)"><Trash2 class="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          </AdminCard>
        </template>

        <!-- Service Types -->
        <template v-else-if="activeSection === 'services'">
          <AdminCard>
            <div class="flex items-center justify-between">
              <div>
                <h3 class="font-display text-lg tracking-display text-white">Service Types</h3>
                <p class="mt-0.5 text-xs text-brand-grey">Pricing used across the service booking flow</p>
              </div>
              <Button size="sm" @click="openServiceModal()"><Plus class="h-4 w-4" />Add Service</Button>
            </div>
            <div v-if="serviceTypes.length === 0" class="mt-4 rounded-xl border border-dashed border-brand-grey/20 p-8 text-center text-sm text-brand-grey">No service types configured</div>
            <div v-else class="mt-4 grid gap-3 sm:grid-cols-2">
              <div v-for="s in serviceTypes" :key="s.id" class="rounded-xl border border-brand-grey/10 bg-white/[0.02] p-4">
                <div class="flex items-start justify-between gap-3">
                  <div>
                    <p class="font-medium text-white">{{ s.name }}</p>
                    <p class="text-xs text-brand-grey">{{ s.description }}</p>
                  </div>
                  <span class="shrink-0 font-heading text-lg text-brand-red">KSh {{ fmtNum(s.price) }}</span>
                </div>
                <div class="mt-3 flex items-center justify-end gap-2">
                  <button class="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-grey/20 text-brand-grey hover:text-white hover:border-brand-red/50" :aria-label="'Edit ' + s.name" @click="openServiceModal(s)"><Pencil class="h-3.5 w-3.5" /></button>
                  <button class="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-grey/20 text-brand-grey hover:text-rose-400 hover:border-rose-500/50" :aria-label="'Delete ' + s.name" @click="deleteService(s)"><Trash2 class="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          </AdminCard>
        </template>

        <!-- Notifications -->
        <template v-else-if="activeSection === 'notifications'">
          <AdminCard>
            <h3 class="font-display text-lg tracking-display text-white">My Notification Preferences</h3>
            <p class="mt-0.5 text-xs text-brand-grey">Control how you receive updates from the platform</p>
            <div class="mt-4 space-y-3">
              <div class="flex items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3.5">
                <div><p class="text-sm font-medium text-white">Email Notifications</p><p class="text-xs text-brand-grey">Booking updates and system alerts</p></div>
                <button role="switch" :aria-checked="prefs.email" aria-label="Toggle email notifications" class="relative h-6 w-11 rounded-full transition-colors" :class="prefs.email ? 'bg-brand-red' : 'bg-brand-grey/30'" @click="togglePref('email')">
                  <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform" :class="prefs.email ? 'translate-x-5' : 'translate-x-0.5'" />
                </button>
              </div>
              <div class="flex items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3.5">
                <div><p class="text-sm font-medium text-white">SMS Notifications</p><p class="text-xs text-brand-grey">Service reminders and promotions</p></div>
                <button role="switch" :aria-checked="prefs.sms" aria-label="Toggle SMS notifications" class="relative h-6 w-11 rounded-full transition-colors" :class="prefs.sms ? 'bg-brand-red' : 'bg-brand-grey/30'" @click="togglePref('sms')">
                  <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform" :class="prefs.sms ? 'translate-x-5' : 'translate-x-0.5'" />
                </button>
              </div>
              <div class="flex items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3.5">
                <div class="flex items-center gap-3">
                  <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-red/10"><Volume2 class="h-4 w-4 text-brand-red" /></span>
                  <div><p class="text-sm font-medium text-white">Notification Sounds</p><p class="text-xs text-brand-grey">Play a sound for new notifications, chat replies and confirmations</p></div>
                </div>
                <button role="switch" :aria-checked="prefs.sound" aria-label="Toggle notification sounds" class="relative h-6 w-11 rounded-full transition-colors" :class="prefs.sound ? 'bg-brand-red' : 'bg-brand-grey/30'" @click="togglePref('sound')">
                  <span class="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform" :class="prefs.sound ? 'translate-x-5' : 'translate-x-0.5'" />
                </button>
              </div>
            </div>
            <p class="mt-3 text-[11px] text-brand-grey/60">Changes apply to your {{ auth.user?.role }} account immediately.</p>
          </AdminCard>
        </template>

        <!-- Security -->
        <template v-else-if="activeSection === 'security'">
          <AdminCard>
            <h3 class="font-display text-lg tracking-display text-white">Account Security</h3>
            <div class="mt-4 space-y-2.5 text-sm">
              <div class="flex items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3">
                <span class="text-brand-grey">Email</span><span class="font-medium text-white">{{ auth.user?.email }}</span>
              </div>
              <div class="flex items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3">
                <span class="text-brand-grey">Email Verified</span>
                <StatusChip :status="auth.user?.verified ? 'active' : 'pending'" size="sm" />
              </div>
              <div class="flex items-center justify-between rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3">
                <span class="text-brand-grey">Role</span><Badge>{{ auth.user?.role }}</Badge>
              </div>
            </div>
          </AdminCard>
          <AdminCard>
            <h3 class="font-display text-lg tracking-display text-white">Change Password</h3>
            <div class="mt-4 space-y-4 max-w-md">
              <Input v-model="passwordForm.current" label="Current Password" type="password" placeholder="••••••••" />
              <Input v-model="passwordForm.next" label="New Password" type="password" placeholder="••••••••" />
              <div class="flex justify-end"><Button :disabled="savingPassword || !passwordForm.next" @click="changePassword">{{ savingPassword ? 'Updating…' : 'Update Password' }}</Button></div>
            </div>
          </AdminCard>
        </template>

        <!-- Roles & Permissions -->
        <template v-else-if="activeSection === 'roles'">
          <AdminCard>
            <h3 class="font-display text-lg tracking-display text-white">Roles & Permissions</h3>
            <p class="mt-0.5 text-xs text-brand-grey">What each role can access across the portal</p>
            <div class="mt-4 space-y-3">
              <div v-for="r in roles" :key="r.value" class="rounded-xl border border-brand-grey/15 bg-white/[0.02] p-4">
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="flex items-center gap-3">
                    <span class="flex h-9 w-9 items-center justify-center rounded-lg" :class="r.iconBg"><component :is="r.icon" class="h-4 w-4" :class="r.iconColor" /></span>
                    <div>
                      <p class="text-sm font-semibold capitalize text-white">{{ r.value }}</p>
                      <p class="text-xs text-brand-grey">{{ r.description }}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{{ r.count }} user{{ r.count === 1 ? '' : 's' }}</Badge>
                </div>
                <div class="mt-3 flex flex-wrap gap-1.5">
                  <span v-for="p in r.perms" :key="p" class="rounded-md border border-brand-grey/15 bg-brand-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-brand-grey">{{ p }}</span>
                </div>
              </div>
            </div>
          </AdminCard>
        </template>

        <!-- API & Info -->
        <template v-else-if="activeSection === 'api'">
          <AdminCard>
            <h3 class="font-display text-lg tracking-display text-white">API & Integrations</h3>
            <p class="mt-0.5 text-xs text-brand-grey">Backend endpoints and integration status</p>
            <div class="mt-4 space-y-2.5 text-sm">
              <div class="rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3"><p class="text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">PocketBase URL</p><p class="mt-1 font-mono text-xs text-white break-all">{{ pbUrl }}</p></div>
              <div class="rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3"><p class="text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Realtime Channel</p><p class="mt-1 font-mono text-xs text-emerald-400">service_bookings, test_rides, contacts, subscribers, users, notifications…</p></div>
              <div class="rounded-xl border border-brand-grey/15 bg-white/[0.02] px-4 py-3"><p class="text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Widget</p><p class="mt-1 text-xs text-brand-grey">OpenWidget chat integrated on public pages</p></div>
            </div>
          </AdminCard>
        </template>
      </div>
    </div>

    <AdminDrawer :open="showBranchModal" :title="branchEditingId ? 'Edit Branch' : 'Add Branch'" subtitle="Dealership location details" @close="showBranchModal = false">
      <div class="space-y-4">
        <Input v-model="branchForm.name" label="Branch Name" placeholder="e.g. Nairobi CBD" />
        <Input v-model="branchForm.address" label="Address" placeholder="e.g. Moi Avenue" />
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input v-model="branchForm.phone" label="Phone" placeholder="+254..." />
          <Input v-model="branchForm.email" label="Email" type="email" placeholder="branch@example.com" />
        </div>
        <Input v-model="branchForm.hours" label="Hours" placeholder="e.g. Mon-Sat: 8AM-6PM" />
      </div>
      <template #footer>
        <Button variant="ghost" @click="showBranchModal = false">Cancel</Button>
        <Button :disabled="savingBranch" @click="saveBranch">{{ savingBranch ? 'Saving…' : 'Save Branch' }}</Button>
      </template>
    </AdminDrawer>

    <AdminDrawer :open="showServiceModal" :title="serviceEditingId ? 'Edit Service' : 'Add Service'" subtitle="Service pricing and description" @close="showServiceModal = false">
      <div class="space-y-4">
        <Input v-model="serviceForm.name" label="Service Name" placeholder="e.g. Oil Change" />
        <Input v-model="serviceForm.price" label="Price (KSh)" type="number" placeholder="0" />
        <div><label class="mb-1.5 block text-[10px] font-display tracking-[0.2em] text-brand-grey uppercase">Description</label><textarea v-model="serviceForm.description" rows="3" class="input-field rounded-xl resize-none" /></div>
      </div>
      <template #footer>
        <Button variant="ghost" @click="showServiceModal = false">Cancel</Button>
        <Button :disabled="savingService" @click="saveService">{{ savingService ? 'Saving…' : 'Save Service' }}</Button>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import { Settings2, Building2, Wrench, Bell, ShieldCheck, Users, Server, Plus, Pencil, Trash2, Crown, Briefcase, ShoppingCart, Wrench as WrenchIcon, User, Volume2 } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { useAuthStore } from '~/stores/auth'
import { useAdminDataStore } from '~/stores/adminData'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Settings - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const auth = useAuthStore()
const store = useAdminDataStore()

const loading = ref(true)
const activeSection = ref('general')
const branches = ref<any[]>([])
const serviceTypes = ref<any[]>([])
const allUsers = ref<any[]>([])

const showBranchModal = ref(false)
const branchEditingId = ref<string | null>(null)
const branchForm = ref({ name: '', address: '', phone: '', email: '', hours: '' })
const savingBranch = ref(false)

const showServiceModal = ref(false)
const serviceEditingId = ref<string | null>(null)
const serviceForm = ref({ name: '', price: '', description: '' })
const savingService = ref(false)

const passwordForm = ref({ current: '', next: '' })
const savingPassword = ref(false)

const pbUrl = useRuntimeConfig().public.pocketBaseUrl

const prefs = reactive({ email: auth.user?.email_notifications !== false, sms: auth.user?.sms_notifications !== false, sound: auth.user?.soundEnabled !== false })

const headBranch = computed(() => branches.value.find(b => b.slug === 'nairobi-hq') || branches.value[0])

const sections = [
  { key: 'general', label: 'General', icon: Settings2 },
  { key: 'branches', label: 'Branches', icon: Building2 },
  { key: 'services', label: 'Service Types', icon: Wrench },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: ShieldCheck },
  { key: 'roles', label: 'Roles & Permissions', icon: Users },
  { key: 'api', label: 'API & Info', icon: Server },
]

const roles = computed(() => [
  { value: 'admin', description: 'Full system access', icon: Crown, iconBg: 'bg-brand-red/15', iconColor: 'text-brand-red', count: roleCount('admin'), perms: ['All modules', 'Users', 'Settings', 'Finance', 'Content'] },
  { value: 'manager', description: 'Content & booking management', icon: Briefcase, iconBg: 'bg-sky-500/15', iconColor: 'text-sky-400', count: roleCount('manager'), perms: ['Bookings', 'Content', 'Messages', 'Reports'] },
  { value: 'salesperson', description: 'Leads & test rides', icon: ShoppingCart, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400', count: roleCount('salesperson'), perms: ['Test rides', 'Contacts', 'Inventory view'] },
  { value: 'mechanic', description: 'Service queue & jobs', icon: WrenchIcon, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', count: roleCount('mechanic'), perms: ['Service queue', 'Diagnostics', 'Job updates'] },
  { value: 'customer', description: 'Personal dashboard', icon: User, iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400', count: roleCount('customer'), perms: ['My bookings', 'Wishlist', 'Messages', 'Profile'] },
])

function roleCount(role: string) { return allUsers.value.filter(u => u.role === role).length }

function fmtNum(n: number) { return n ? Number(n).toLocaleString('en-KE') : '0' }

async function togglePref(key: 'email' | 'sms' | 'sound') {
  prefs[key] = !prefs[key]
  try {
    const map: Record<string, any> = { email: 'email_notifications', sms: 'sms_notifications', sound: 'soundEnabled' }
    await pb.collection('users').update(auth.user!.id, { [map[key]]: prefs[key] })
    ;(auth.user as any)[map[key]] = prefs[key]
    toast.add({ type: 'success', title: 'Preference saved' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save', message: e?.message }); prefs[key] = !prefs[key] }
}

async function changePassword() {
  savingPassword.value = true
  try {
    await pb.collection('users').update(auth.user!.id, { password: passwordForm.value.next, passwordConfirm: passwordForm.value.next })
    toast.add({ type: 'success', title: 'Password updated' })
    passwordForm.value = { current: '', next: '' }
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update password', message: e?.message }) }
  finally { savingPassword.value = false }
}

function openBranchModal(b?: any) {
  branchEditingId.value = b?.id || null
  branchForm.value = b ? { name: b.name, address: b.address || '', phone: b.phone || '', email: b.email || '', hours: b.hours || '' } : { name: '', address: '', phone: '', email: '', hours: '' }
  showBranchModal.value = true
}

async function saveBranch() {
  savingBranch.value = true
  try {
    const payload: any = { ...branchForm.value }
    if (!branchEditingId.value) payload.slug = branchForm.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (branchEditingId.value) { await pb.collection('branches').update(branchEditingId.value, payload); toast.add({ type: 'success', title: 'Branch updated' }) }
    else { await pb.collection('branches').create(payload); toast.add({ type: 'success', title: 'Branch created' }) }
    showBranchModal.value = false
    await loadData()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save branch', message: e?.message }) }
  finally { savingBranch.value = false }
}

async function deleteBranch(b: any) {
  const ok = await confirmDlg.confirm({ title: 'Delete Branch', message: `Delete "${b.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('branches').delete(b.id)
    toast.add({ type: 'success', title: 'Branch deleted' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }) }
}

function openServiceModal(s?: any) {
  serviceEditingId.value = s?.id || null
  serviceForm.value = s ? { name: s.name, price: s.price?.toString() || '', description: s.description || '' } : { name: '', price: '', description: '' }
  showServiceModal.value = true
}

async function saveService() {
  savingService.value = true
  try {
    const payload: any = { ...serviceForm.value, price: parseFloat(serviceForm.value.price) || 0 }
    if (serviceEditingId.value) { await pb.collection('service_types').update(serviceEditingId.value, payload); toast.add({ type: 'success', title: 'Service updated' }) }
    else { await pb.collection('service_types').create(payload); toast.add({ type: 'success', title: 'Service created' }) }
    showServiceModal.value = false
    await loadData()
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to save service', message: e?.message }) }
  finally { savingService.value = false }
}

async function deleteService(s: any) {
  const ok = await confirmDlg.confirm({ title: 'Delete Service', message: `Delete "${s.name}"? This cannot be undone.`, confirmText: 'Delete', confirmType: 'danger' })
  if (!ok) return
  try {
    await pb.collection('service_types').delete(s.id)
    toast.add({ type: 'success', title: 'Service deleted' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message }) }
}

async function loadData() {
  const [b, st, u] = await Promise.all([
    pb.collection('branches').getFullList({ sort: 'name' }).catch(() => []),
    pb.collection('service_types').getFullList({ sort: 'name' }).catch(() => []),
    pb.collection('users').getFullList({ fields: 'role' }).catch(() => []),
  ])
  branches.value = b as any[]
  serviceTypes.value = st as any[]
  allUsers.value = u as any[]
}

onMounted(async () => {
  store.ensureActive()
  await loadData()
  loading.value = false
})

onUnmounted(() => store.release())
</script>
