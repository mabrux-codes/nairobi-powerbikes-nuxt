<template>
  <template v-if="conv">
    <div class="flex items-center gap-3">
      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-sm font-bold text-white">{{ initials(customerName(conv)) }}</div>
      <div class="min-w-0">
        <p class="truncate text-sm font-semibold text-white">{{ customerName(conv) }}</p>
        <p class="flex items-center gap-1.5 text-xs" :class="store.customerOnline(conv) ? 'text-emerald-400' : 'text-brand-grey'">
          <span class="h-1.5 w-1.5 rounded-full" :class="store.customerOnline(conv) ? 'bg-emerald-400' : 'bg-brand-grey/50'" />
          {{ store.customerOnline(conv) ? 'Online' : 'Offline' }}
        </p>
      </div>
    </div>

    <dl class="mt-4 space-y-3 text-sm">
      <div class="flex items-start gap-2.5 text-brand-grey">
        <Mail class="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />
        <a v-if="customerEmail(conv)" :href="`mailto:${customerEmail(conv)}`" class="min-w-0 break-all hover:text-white">{{ customerEmail(conv) }}</a>
        <span v-else>—</span>
      </div>
      <div class="flex items-center gap-2.5 text-brand-grey">
        <Phone class="h-4 w-4 shrink-0 text-brand-red" />
        <span>{{ conv.guest_phone || customerPhone(conv) || '—' }}</span>
      </div>
      <div class="flex items-center gap-2.5 text-brand-grey">
        <Hash class="h-4 w-4 shrink-0 text-brand-red" />
        <span class="break-all">{{ customerId(conv) }}</span>
      </div>
      <div class="flex items-center gap-2.5 text-brand-grey">
        <ShieldCheck class="h-4 w-4 shrink-0 text-brand-red" />
        <span>{{ accountStatus(conv) }}</span>
      </div>
      <div class="flex items-center gap-2.5 text-brand-grey">
        <CalendarDays class="h-4 w-4 shrink-0 text-brand-red" />
        <span>{{ joinedDate(conv) }}</span>
      </div>
      <div class="flex items-center gap-2.5 text-brand-grey">
        <Clock class="h-4 w-4 shrink-0 text-brand-red" />
        <span>{{ lastSeen(conv) }}</span>
      </div>
      <div class="flex items-center gap-2.5 text-brand-grey">
        <MessageSquare class="h-4 w-4 shrink-0 text-brand-red" />
        <span>{{ prevConversations(conv) }} previous</span>
      </div>
    </dl>

    <div class="mt-4 flex flex-col gap-2 border-t border-brand-grey/10 pt-4">
      <Button v-if="!readOnly" size="sm" variant="secondary" @click="$emit('transfer')">
        <ArrowLeftRight class="h-4 w-4" />Transfer Conversation
      </Button>
    </div>
  </template>
  <div v-else class="py-8 text-center text-sm text-brand-grey">Select a conversation to view customer details.</div>
</template>

<script setup lang="ts">
import { Mail, Phone, Hash, ShieldCheck, CalendarDays, Clock, MessageSquare, ArrowLeftRight } from 'lucide-vue-next'
import { useChatStore } from '~/stores/chat'
import { useAuthStore } from '~/stores/auth'

defineEmits<{ transfer: [] }>()

const store = useChatStore()
const auth = useAuthStore()

const props = defineProps<{ conv: any }>()
const conv = computed(() => props.conv)

const readOnly = computed(() => {
  const c = conv.value
  const me = auth.user?.id
  return !!(c?.assigned_to && c.assigned_to !== me && c.status !== 'resolved' && c.status !== 'closed')
})

function customerName(c: any) {
  return c?.expand?.customer?.name || c?.guest_name || c?.expand?.customer?.email || 'Guest'
}

function customerEmail(c: any) {
  return c?.expand?.customer?.email || c?.guest_email || ''
}

function customerPhone(c: any) {
  return c?.expand?.customer?.phone || ''
}

function customerId(c: any) {
  if (c?.customer) return c.customer
  return c?.guest_email ? 'Guest' : '—'
}

function accountStatus(c: any) {
  const s = c?.expand?.customer?.status
  if (!s) return 'Guest'
  return s === 'inactive' ? 'Inactive' : 'Active'
}

function joinedDate(c: any) {
  const d = c?.expand?.customer?.created
  return d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'
}

function lastSeen(c: any) {
  if (store.customerOnline(c)) return 'Online now'
  const d = c?.customer_last_seen
  return d ? `Seen ${timeAgo(d)} ago` : '—'
}

function prevConversations(c: any) {
  if (!c?.customer) return '—'
  return store.conversations.filter(x => x.customer === c.customer).length
}

function timeAgo(d?: string) {
  if (!d) return ''
  const diff = Date.now() - new Date(d).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return mins < 1 ? 'now' : `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  return `${Math.floor(hrs / 24)}d`
}

function initials(name: string) {
  return (name || '?').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
}
</script>
