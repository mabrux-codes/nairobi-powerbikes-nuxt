<template>
  <div>
    <div class="mx-auto max-w-7xl">
      <div class="mb-6">
        <h1 class="font-heading text-4xl text-white">Contact <span class="text-brand-red">Messages</span></h1>
        <p class="mt-1 text-sm text-brand-grey">All messages from the contact form</p>
      </div>
      <div class="mb-4 flex flex-wrap gap-3">
        <Input v-model="searchQuery" placeholder="Search messages..." class="w-64" />
        <select v-model="readFilter" class="input-field w-40"><option value="">All</option><option value="true">Read</option><option value="false">Unread</option></select>
      </div>
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="animate-pulse rounded-sm border border-brand-grey/20 p-4"><div class="h-5 w-64 rounded bg-brand-grey/10" /><div class="mt-2 h-4 w-40 rounded bg-brand-grey/10" /></div>
      </div>
      <div v-else-if="filtered.length === 0" class="rounded-sm border border-dashed border-brand-grey/20 p-12 text-center">
        <MessageSquare class="mx-auto h-12 w-12 text-brand-grey/40" />
        <p class="mt-4 font-display text-xl tracking-display text-brand-grey">No Messages</p>
        <p class="mt-2 text-sm text-brand-grey/60">No contact messages received yet</p>
      </div>
      <div v-else class="space-y-4">
        <div v-for="msg in filtered" :key="msg.id" class="rounded-sm border border-brand-grey/20 bg-brand-black/60 p-5 transition-all duration-200 hover:border-brand-red/30" :class="msg.read ? 'opacity-70' : 'border-l-2 border-l-brand-red'">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 class="font-display text-lg tracking-display text-white">{{ msg.name || 'Anonymous' }}</h3>
              <p class="text-xs text-brand-grey">{{ msg.email }} <span v-if="msg.phone">&middot; {{ msg.phone }}</span></p>
            </div>
            <div class="flex items-center gap-2">
              <Badge :variant="msg.read ? 'outline' : 'default'">{{ msg.read ? 'Read' : 'New' }}</Badge>
              <span class="text-xs text-brand-grey">{{ formatDate(msg.created) }}</span>
            </div>
          </div>
          <p class="mt-3 text-sm text-brand-grey/80 leading-relaxed">{{ msg.message || msg.body || 'No content' }}</p>
          <div class="mt-3 flex items-center gap-3">
            <Button v-if="!msg.read" variant="ghost" size="sm" @click="markRead(msg)">Mark Read</Button>
            <Button variant="danger" size="sm" :disabled="deleting" @click="confirmDelete(msg)">Delete</Button>
            <a v-if="msg.email" :href="`mailto:${msg.email}`" class="text-xs text-brand-red hover:underline">Reply via Email</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageSquare } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import { useConfirm } from '~/composables/useConfirm'
import { formatDate } from '~/composables/useFormat'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['admin'] })
useHead({ title: 'Messages - Nairobi Powerbikes' })

const pb = usePB()
const toast = useToast()
const confirmDlg = useConfirm()
const loading = ref(true)
const deleting = ref(false)
const messages = ref<any[]>([])
const searchQuery = ref('')
const readFilter = ref('')


const filtered = computed(() => {
  return messages.value.filter(m => {
    const q = searchQuery.value.toLowerCase()
    if (q && !`${m.name} ${m.email} ${m.message}`.toLowerCase().includes(q)) return false
    if (readFilter.value === 'true' && !m.read) return false
    if (readFilter.value === 'false' && m.read) return false
    return true
  })
})

async function markRead(msg: any) {
  try {
    await pb.collection('contacts').update(msg.id, { read: true })
    msg.read = true
    toast.add({ type: 'success', title: 'Marked as read' })
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to update', message: e?.message || 'Something went wrong' }) }
}

async function confirmDelete(msg: any) {
  deleting.value = true
  try {
    const ok = await confirmDlg.confirm({ title: 'Delete Message', message: 'Are you sure you want to delete this message? This cannot be undone.', confirmText: 'Delete', confirmType: 'danger' })
    if (ok) { await pb.collection('contacts').delete(msg.id); toast.add({ type: 'success', title: 'Deleted successfully' }); await loadMessages() }
  } catch (e: any) { toast.add({ type: 'error', title: 'Failed to delete', message: e?.message || 'Something went wrong' }) }
  finally { deleting.value = false }
}

async function loadMessages() { try { const res = await pb.collection('contacts').getList(1, 100, { sort: '-created' }); messages.value = res.items as any[] } catch (e) { console.error(e) } }

onMounted(async () => { await loadMessages(); loading.value = false })
</script>
