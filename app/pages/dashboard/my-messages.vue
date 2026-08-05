<template>
  <div class="mx-auto max-w-5xl">
    <div class="mb-8">
      <h1 class="font-heading text-4xl text-white">My <span class="text-brand-red">Messages</span></h1>
      <div class="mt-2 h-1 w-24 bg-brand-red" />
      <p class="mt-3 text-sm text-brand-grey">Direct communication with our team, all in one inbox.</p>
    </div>

    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div class="relative flex-1">
        <Search class="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-brand-grey/50" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search messages by subject or sender..."
          class="input-field h-11 w-full pl-11 rounded-xl"
        />
      </div>
      <Button variant="secondary" to="/contact"><Send class="h-4 w-4" />New Message</Button>
    </div>

    <div v-if="loading" class="space-y-4">
      <div v-for="i in 4" :key="i" class="animate-pulse rounded-xl border border-brand-grey/15 p-5">
        <div class="flex items-start gap-4">
          <div class="h-11 w-11 rounded-full bg-brand-grey/10" />
          <div class="flex-1 space-y-2.5">
            <div class="h-4 w-1/2 rounded bg-brand-grey/10" />
            <div class="h-3.5 w-3/4 rounded bg-brand-grey/10" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="filtered.length === 0" class="rounded-xl border border-dashed border-brand-grey/20 bg-brand-black/40 p-14 text-center">
      <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10">
        <Mail class="h-8 w-8 text-brand-red" />
      </div>
      <p class="mt-5 font-heading text-2xl text-white">Your inbox is empty.</p>
      <p class="mt-2 text-sm text-brand-grey">Message our team about anything — sales, service or just a hello.</p>
      <Button to="/contact" class="mt-6"><Send class="h-4 w-4" />Send a Message</Button>
    </div>

    <div v-else class="space-y-3">
      <motion.div
        v-for="(m, idx) in filtered"
        :key="m.id"
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ delay: Math.min(idx * 0.04, 0.3), duration: 0.35 }"
        class="group rounded-xl border transition-all duration-300 overflow-hidden"
        :class="[
          expanded[m.id] ? 'border-brand-red/40 shadow-lg shadow-brand-red/5' : 'border-brand-grey/15 hover:border-brand-red/30',
          m.read ? 'bg-brand-black/60' : 'bg-gradient-to-br from-brand-red/[0.06] to-brand-black/80',
        ]"
      >
        <div class="cursor-pointer p-5" @click="toggle(m)">
          <div class="flex items-start gap-4">
            <div
              class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-2 transition-all duration-300"
              :class="m.read ? 'bg-brand-grey/20 text-brand-light ring-brand-grey/20' : 'bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-white ring-brand-red/40'"
            >
              {{ senderInitials(m) }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex flex-wrap items-center gap-2">
                <p class="truncate text-sm font-semibold text-white">{{ m.subject || 'No Subject' }}</p>
                <Badge v-if="!m.read" size="sm" variant="warning" class="shrink-0">New</Badge>
                <Badge v-if="m.broadcast" size="sm" variant="secondary" class="shrink-0">Broadcast</Badge>
              </div>
              <p class="mt-0.5 text-xs text-brand-grey">
                From {{ senderName(m) }}
                <template v-if="m.from_user_role"> &middot; {{ m.from_user_role }}</template>
              </p>
              <p class="mt-1.5 truncate text-sm text-brand-grey/80">{{ m.message }}</p>
            </div>
            <div class="flex shrink-0 flex-col items-end gap-2">
              <span class="text-[10px] text-brand-grey/50 whitespace-nowrap">{{ formatDateTime(m.created) }}</span>
              <ChevronDown class="h-4 w-4 text-brand-grey/50 transition-transform duration-300" :class="expanded[m.id] ? 'rotate-180 text-brand-red' : ''" />
            </div>
          </div>
        </div>

        <div class="grid transition-all duration-500 ease-in-out" :class="expanded[m.id] ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
          <div class="overflow-hidden">
            <div class="border-t border-brand-grey/10 px-5 py-5 sm:px-6 bg-white/[0.02]">
              <p class="whitespace-pre-line text-sm leading-relaxed text-brand-light/90">{{ m.message }}</p>
              <div class="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p class="text-xs text-brand-grey/60">
                  Received {{ formatDateTime(m.created) }}
                  <template v-if="m.expand?.from_user?.email">&middot; {{ m.expand.from_user.email }}</template>
                </p>
                <div class="flex gap-2">
                  <Button size="sm" variant="ghost" @click="markRead(m)" :disabled="m.read"><Check class="h-4 w-4" />{{ m.read ? 'Read' : 'Mark as Read' }}</Button>
                  <Button size="sm" variant="secondary" to="/contact"><Send class="h-4 w-4" />Reply</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Mail, Search, Send, ChevronDown, Check } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useToast } from '~/composables/useToast'
import { formatDateTime } from '~/composables/useFormat'

definePageMeta({ layout: 'dashboard', middleware: 'auth', roles: ['customer'] })
useHead({ title: 'Messages - Nairobi Powerbikes' })

const pb = usePB()
const auth = useAuthStore()
const toast = useToast()
const loading = ref(true)
const items = ref<any[]>([])
const searchQuery = ref('')
const expanded = ref<Record<string, boolean>>({})

const unreadCount = computed(() => items.value.filter(m => !m.read).length)

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return items.value
  return items.value.filter(m => {
    const hay = [m.subject, m.message, senderName(m)].filter(Boolean).join(' ').toLowerCase()
    return hay.includes(q)
  })
})

function senderName(m: any) {
  const u = m.expand?.from_user
  if (u?.name) return u.name
  return u?.email || 'Support Team'
}

function senderInitials(m: any) {
  const name = senderName(m)
  return name.slice(0, 2).toUpperCase()
}

function toggle(m: any) {
  expanded.value[m.id] = !expanded.value[m.id]
  if (!m.read) markRead(m)
}

async function markRead(m: any) {
  if (m.read) return
  try {
    await pb.collection('messages').update(m.id, { read: true })
    m.read = true
  } catch {
    // read sync is best-effort
  }
}

function handleRealtime(e: any) {
  const record = e.record as any
  if (record.to_user !== auth.user?.id) return
  if (e.action === 'delete') {
    items.value = items.value.filter(m => m.id !== record.id)
  } else {
    const idx = items.value.findIndex(m => m.id === record.id)
    if (idx >= 0) {
      items.value[idx] = { ...items.value[idx], ...record }
      items.value = [...items.value]
    } else {
      items.value = [record, ...items.value]
      toast.add({ type: 'info', title: 'New message', message: record.subject || 'You have a new message' })
    }
  }
}

onMounted(async () => {
  try {
    const uid = auth.user?.id
    const res = await pb.collection('messages').getList(1, 50, {
      filter: `to_user = "${uid}"`,
      sort: '-created',
      expand: 'from_user',
    })
    items.value = (res.items as any[]).map(m => ({ ...m, from_user_role: m.expand?.from_user?.role || '' }))
    if (uid) {
      pb.collection('messages').subscribe('*', handleRealtime, { filter: `to_user = "${uid}"` })
    }
  } catch (e) { console.error(e) }
  finally { loading.value = false }
})

onUnmounted(() => {
  pb.collection('messages').unsubscribe('*')
})
</script>
