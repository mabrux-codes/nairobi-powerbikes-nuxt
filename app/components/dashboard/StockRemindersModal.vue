<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[80] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-label="`Customers waiting for ${motorcycle?.name || 'motorcycle'}`"
        @keydown.esc="close"
      >
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="close" />
        <motion.div
          class="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-brand-grey/20 bg-brand-black shadow-2xl shadow-black"
          :initial="{ opacity: 0, scale: 0.95, y: 16 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{ duration: 0.2 }"
        >
          <div class="flex items-center justify-between border-b border-brand-grey/15 px-5 py-4">
            <div class="min-w-0">
              <h2 class="font-display text-base font-semibold text-white">Arrival Reminders</h2>
              <p class="truncate text-xs text-brand-grey">{{ motorcycle?.name }} — <span class="text-white font-semibold">{{ list.length }}</span> waiting</p>
            </div>
            <button class="p-1.5 text-brand-grey hover:text-white rounded-lg transition-colors" aria-label="Close" @click="close"><X class="h-4 w-4" /></button>
          </div>

          <div class="flex-1 overflow-y-auto scrollbar-thin">
            <div v-if="loading" class="space-y-3 p-5">
              <div v-for="i in 4" :key="i" class="h-16 animate-pulse rounded-xl bg-brand-grey/10" />
            </div>
            <div v-else-if="list.length === 0" class="p-12 text-center">
              <BellRing class="mx-auto h-10 w-10 text-brand-grey/40" />
              <p class="mt-4 font-display text-lg text-brand-grey">No one is waiting yet</p>
              <p class="mt-1 text-sm text-brand-grey/60">Customers who request an arrival reminder for this motorcycle will appear here.</p>
            </div>
            <ul v-else class="divide-y divide-brand-grey/10">
              <li v-for="r in list" :key="r.id" class="flex items-center gap-3 px-5 py-3.5">
                <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-grey/20 bg-white/[0.03]">
                  <User class="h-4 w-4 text-brand-grey" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-semibold text-white">{{ customerName(r) }}</p>
                  <p class="truncate text-xs text-brand-grey">{{ customerContact(r) }}</p>
                </div>
                <div class="hidden text-right sm:block">
                  <p class="text-xs text-brand-grey">{{ formatDate(r.created) }}</p>
                  <p v-if="r.notified_at" class="text-[11px] text-emerald-400">Notified {{ formatDate(r.notified_at) }}</p>
                </div>
                <StatusChip :status="r.status || 'active'" size="sm" />
              </li>
            </ul>
          </div>

          <div class="flex justify-end border-t border-brand-grey/15 px-5 py-4">
            <Button variant="ghost" @click="close">Close</Button>
          </div>
        </motion.div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { X, User, BellRing } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import StatusChip from '~/components/dashboard/StatusChip.vue'

const props = defineProps<{
  open: boolean
  motorcycle: any
}>()

const emit = defineEmits<{ close: [] }>()

const pb = usePB()
const list = ref<any[]>([])
const loading = ref(false)

watch(() => props.open, async (v) => {
  if (v && props.motorcycle) {
    loading.value = true
    try {
      list.value = await pb.collection('stock_reminders').getFullList({
        filter: `motorcycle = "${props.motorcycle.id}"`,
        sort: '-created',
        expand: 'user',
      })
    } catch {
      list.value = []
    } finally {
      loading.value = false
    }
  }
})

function customerName(r: any) {
  const u = r.expand?.user
  if (u) return u.name || u.email || 'Customer'
  return 'Guest'
}

function customerContact(r: any) {
  const u = r.expand?.user
  const bits = []
  if (u) {
    if (u.email) bits.push(u.email)
    if (u.phone) bits.push(u.phone)
  } else if (r.email) {
    bits.push(r.email)
  }
  return bits.join(' · ') || '—'
}

function formatDate(v: any) {
  if (!v) return ''
  return new Date(v).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function close() { emit('close') }
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>