<template>
  <tr class="group cursor-pointer transition-colors hover:bg-white/[0.03]" @click="emit('open', booking)">
    <td class="px-5 py-4">
      <div class="flex items-center gap-3 min-w-0">
        <div class="relative shrink-0">
          <span class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-red/40 to-brand-grey/30 text-xs font-bold text-white"> {{ initials }} </span>
          <span v-if="isPending" class="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-400 border border-brand-black animate-pulse" />
        </div>
        <div class="min-w-0">
          <p class="text-sm font-medium text-white truncate">{{ booking.name || booking.expand?.user?.name || 'Guest' }}</p>
          <p class="text-xs text-brand-grey truncate">{{ booking.phone || booking.email || 'No contact' }}</p>
        </div>
      </div>
    </td>
    <td class="px-5 py-3.5 min-w-0">
      <p class="text-sm text-brand-grey truncate">{{ booking.motorcycle || 'N/A' }}</p>
      <p class="text-[11px] text-brand-grey/60">{{ booking.service_type || 'General' }}</p>
    </td>
    <td class="px-5 py-3.5">
      <span class="inline-flex items-center gap-1.5 text-xs text-brand-grey">
        <MapPin class="h-3 w-3 text-brand-grey/50" />
        {{ booking.branch || 'N/A' }}
      </span>
    </td>
    <td class="px-5 py-3.5">
      <p class="text-sm text-brand-grey whitespace-nowrap">{{ formatDate(booking.preferred_date) }}</p>
      <p class="text-[11px] text-brand-grey/60">{{ booking.preferred_time ? formatTime(booking.preferred_time) : 'Flexible' }}</p>
    </td>
    <td class="px-5 py-3.5 text-right">
      <span v-if="booking.cost" class="text-sm font-semibold text-white">KSh {{ Number(booking.cost).toLocaleString() }}</span>
      <span v-else class="text-xs text-brand-grey/50">TBD</span>
    </td>
    <td class="px-5 py-3.5">
      <StatusChip :status="booking.status || 'pending'" />
      <p v-if="isPending" class="mt-1 text-[10px] text-amber-400 font-medium">{{ relativeTime(booking.created, now) }}</p>
    </td>
    <td class="px-5 py-3.5 text-right">
      <div class="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button class="p-2 text-brand-grey hover:text-white hover:bg-white/5 rounded-md transition-colors" title="Print invoice" @click.stop="emit('print', booking)">
          <Printer class="h-4 w-4" />
        </button>
        <button class="p-2 text-brand-red hover:text-white hover:bg-brand-red/15 rounded-md transition-colors" title="View booking">
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import StatusChip from '~/components/dashboard/StatusChip.vue'
import { MapPin, Printer, ChevronRight } from 'lucide-vue-next'
import { formatDate, formatTime } from '~/composables/useFormat'

const props = defineProps<{ booking: any; now?: number }>()

const emit = defineEmits<{ open: [any]; print: [any] }>()

const initials = computed(() =>
  (props.booking.name || props.booking.expand?.user?.name || '?').slice(0, 2).toUpperCase(),
)

const isPending = computed(() => props.booking.status === 'pending')

function relativeTime(created: string, now?: number) {
  const diff = (now || Date.now()) - new Date(created).getTime()
  const hrs = Math.floor(diff / 3600000)
  if (hrs < 1) return 'Just arrived'
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
</script>