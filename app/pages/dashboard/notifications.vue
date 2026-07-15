<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div><h1 class="font-heading text-4xl text-white">Notifications</h1><p class="mt-1 text-sm text-brand-grey">Manage system notifications</p></div>
      <Button size="sm" @click="openSendModal">Send Notification</Button>
    </div>

    <div v-if="loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10" /></div>
    </div>
    <div v-else-if="items.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
      <Bell class="mx-auto h-12 w-12 text-brand-grey/40" /><p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Notifications</p>
    </div>
    <div v-else class="overflow-x-auto rounded-sm border border-brand-grey/20">
      <table class="w-full text-left text-sm">
        <thead class="border-b border-brand-grey/20 bg-brand-black/80">
          <tr><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Title</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Type</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">User</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Date</th><th class="px-4 py-3 font-display text-xs tracking-display text-brand-grey uppercase">Read</th><th class="px-4 py-3" /></tr>
        </thead>
        <tbody class="divide-y divide-brand-grey/10">
          <tr v-for="n in items" :key="n.id" class="transition-colors hover:bg-white/5">
            <td class="px-4 py-3 text-white">{{ n.title }}</td>
            <td class="px-4 py-3"><Badge size="sm">{{ n.type }}</Badge></td>
            <td class="px-4 py-3 text-brand-grey">{{ n.expand?.user?.name || n.expand?.user?.email || 'All Users' }}</td>
            <td class="px-4 py-3 text-brand-grey">{{ formatDate(n.created) }}</td>
            <td class="px-4 py-3"><Badge :variant="n.read ? 'success' : 'warning'">{{ n.read ? 'Read' : 'New' }}</Badge></td>
            <td class="px-4 py-3"><button class="text-xs text-brand-red hover:underline" @click="confirmDelete(n)">Delete</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="closeModal">
        <div class="w-full max-w-md rounded-sm border border-brand-grey/30 bg-brand-black p-6">
          <h2 class="font-display text-xl tracking-display text-white">Send Notification</h2>
          <div class="mt-4 space-y-4">
            <Input v-model="notifForm.title" label="Title" placeholder="e.g. Service Reminder" />
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Type</label>
              <select v-model="notifForm.type" class="input-field w-full">
                <option value="system">System</option><option value="booking">Booking</option><option value="service">Service</option><option value="offer">Offer</option><option value="message">Message</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Target User</label>
              <select v-model="notifForm.user" class="input-field w-full">
                <option value="">All Users (broadcast)</option>
                <option v-for="u in users" :key="u.id" :value="u.id">{{ u.name || u.email }}</option>
              </select>
            </div>
            <div>
              <label class="mb-1.5 block text-xs font-display tracking-display text-brand-grey uppercase">Message</label>
              <textarea v-model="notifForm.message" rows="4" class="input-field w-full resize-none" placeholder="Notification message..." />
            </div>
            <Input v-model="notifForm.link" label="Link (optional)" placeholder="/dashboard/bookings" />
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <Button variant="ghost" @click="closeModal">Cancel</Button>
            <Button :disabled="sending" @click="sendNotification">{{ sending ? 'Sending...' : 'Send' }}</Button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { Bell } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Notifications - Nairobi Powerbikes' })

const pb = usePB()
const loading = ref(true)
const sending = ref(false)
const items = ref<any[]>([])
const users = ref<any[]>([])
const showModal = ref(false)
const notifForm = ref({ title: '', type: 'system', user: '', message: '', link: '' })

function formatDate(d: string) { return d ? new Date(d).toLocaleString() : '' }

function openSendModal() {
  notifForm.value = { title: '', type: 'system', user: '', message: '', link: '' }
  showModal.value = true
}

function closeModal() { showModal.value = false }

async function sendNotification() {
  sending.value = true
  try {
    if (notifForm.value.user) {
      await pb.collection('notifications').create({
        user: notifForm.value.user, title: notifForm.value.title,
        type: notifForm.value.type, message: notifForm.value.message, link: notifForm.value.link, read: false,
      })
    } else {
      for (const u of users.value) {
        await pb.collection('notifications').create({
          user: u.id, title: notifForm.value.title,
          type: notifForm.value.type, message: notifForm.value.message, link: notifForm.value.link, read: false,
        })
      }
    }
    closeModal(); await loadData()
  } catch (e) { console.error(e) }
  finally { sending.value = false }
}

async function confirmDelete(n: any) {
  if (await confirm(`Delete notification "${n.title}"?`)) pb.collection('notifications').delete(n.id).then(() => loadData())
}

async function loadData() {
  try {
    const [notifRes, userRes] = await Promise.all([
      pb.collection('notifications').getList(1, 100, { sort: '-created', expand: 'user' }).catch(() => ({ items: [] })),
      pb.collection('users').getFullList({ sort: 'name' }).catch(() => []),
    ])
    items.value = notifRes.items as any[]
    users.value = userRes as any[]
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

onMounted(() => loadData())
</script>
