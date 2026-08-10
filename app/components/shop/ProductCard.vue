<template>
  <div
    class="group relative flex flex-col overflow-hidden rounded-2xl border bg-gradient-to-b from-white/[0.05] to-white/[0.01] transition-all duration-300 ease-out"
    :class="rootCls"
    :aria-label="item.name"
  >
    <NuxtLink :to="href" class="relative block aspect-[4/5] overflow-hidden bg-black" tabindex="-1" aria-hidden="true">
      <img
        :src="imageUrl"
        :alt="item.name"
        loading="lazy"
        decoding="async"
        class="h-full w-full object-cover transition-all duration-700 ease-out group-hover:scale-110"
        :class="isOosBike ? 'opacity-85 grayscale-[0.5] saturate-[0.6]' : ''"
      />
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
      <div v-if="isOosBike" class="pointer-events-none absolute inset-0 bg-brand-grey/15 mix-blend-normal" aria-hidden="true" />

      <div class="absolute left-3 top-3 flex flex-col items-start gap-1.5">
        <span v-if="isComingSoon" class="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold tracking-wider text-black uppercase">Coming Soon</span>
        <template v-else>
          <span v-if="item.new_arrival" class="rounded-full bg-brand-red px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase">New Arrival</span>
          <span v-if="item.featured" class="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold tracking-wider text-brand-black uppercase">Featured</span>
          <span v-if="isOosBike" class="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white uppercase border border-white/20">Out of Stock</span>
        </template>
        <span v-if="item.sale_price" class="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold tracking-wider text-black uppercase">Sale</span>
      </div>

      <StockBadge
        v-if="kind === 'bike' && !isComingSoon"
        :item="item"
        size="sm"
        :show-count="false"
        class="absolute bottom-3 left-3 !px-2.5 !py-1"
      />
      <span
        v-else
        class="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/60 px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase backdrop-blur-md"
        :class="inStock ? 'text-emerald-400' : 'text-brand-grey'"
      >
        <span class="h-1.5 w-1.5 rounded-full" :class="inStock ? 'bg-emerald-400 animate-pulse' : 'bg-brand-grey'" />
        {{ inStock ? 'In Stock' : 'Out of Stock' }}
      </span>
    </NuxtLink>

    <button
      class="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-black/55 backdrop-blur-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
      :class="saved
        ? 'border-brand-red/60 text-brand-red hover:bg-brand-red hover:text-white'
        : 'border-white/15 text-white hover:border-brand-red/50 hover:text-brand-red'"
      :aria-label="saved ? `Remove ${item.name} from wishlist` : `Save ${item.name} to wishlist`"
      @click.stop.prevent="$emit('toggle-wishlist')"
    >
      <motion.span :key="saved ? 'on' : 'off'" :initial="{ scale: 0.5, opacity: 0.4 }" :animate="{ scale: 1, opacity: 1 }" :transition="{ type: 'spring', stiffness: 500, damping: 22 }" class="flex">
        <Heart class="h-5 w-5" :class="{ 'fill-brand-red': saved }" :stroke-width="saved ? 2 : 1.8" />
      </motion.span>
    </button>

    <div class="flex flex-1 flex-col gap-3 p-5" :class="isOosBike ? 'opacity-80' : ''">
      <div class="flex items-center justify-between gap-2">
        <p class="truncate text-[11px] font-display tracking-[0.22em] text-brand-grey uppercase">{{ eyebrow }}</p>
        <span class="shrink-0 rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-brand-light/70">{{ categoryLabel }}</span>
      </div>

      <NuxtLink :to="href" class="group/name block">
        <h3 class="font-display text-lg leading-snug font-bold tracking-display text-white transition-colors duration-200 group-hover/name:text-brand-red">{{ item.name }}</h3>
      </NuxtLink>

      <p v-if="meta" class="text-xs font-medium text-brand-grey">{{ meta }}</p>
      <p v-else-if="item.description" class="line-clamp-1 text-xs text-brand-grey/80">{{ item.description }}</p>

      <div class="mt-auto flex items-end justify-between gap-2 pt-1">
        <div>
          <p class="font-heading text-2xl text-brand-red">{{ formatPrice(currentPrice) }}</p>
          <p v-if="item.sale_price" class="text-xs font-semibold text-brand-grey/70 line-through">{{ formatPrice(item.price) }}</p>
        </div>
        <span v-if="discount" class="rounded-full bg-brand-red/15 px-2 py-0.5 text-[10px] font-bold text-brand-red">{{ discount }} OFF</span>
      </div>

      <div class="mt-1 flex gap-2">
        <Button :to="href" variant="secondary" size="sm" class="flex-1">
          <Eye class="h-4 w-4" />View Details
        </Button>
        <Button
          size="sm"
          variant="ghost"
          class="h-9 w-10 px-0"
          :aria-label="`Quick view ${item.name}`"
          @click.prevent="$emit('quick-view')"
        >
          <Scan class="h-4 w-4" />
        </Button>
        <Button
          v-if="kind === 'bike' && !isComingSoon && !isOosBike"
          size="sm"
          variant="ghost"
          class="h-9 w-10 px-0"
          :aria-label="`Book a test ride for ${item.name}`"
          :to="`/service/test-ride?motorcycle=${item.id}`"
        >
          <CalendarClock class="h-4 w-4" />
        </Button>
        <Button
          v-else-if="kind === 'bike' && isOosBike"
          size="sm"
          variant="ghost"
          class="h-9 w-10 px-0 border border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
          :aria-label="`Get an arrival reminder for ${item.name}`"
          @click.prevent="$emit('remind')"
        >
          <BellRing class="h-4 w-4" />
        </Button>
        <Button
          v-else
          size="sm"
          variant="ghost"
          class="h-9 w-10 px-0"
          :aria-label="`Enquire about ${item.name}`"
          @click.prevent="$emit('enquire')"
        >
          <MessageSquare class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { Heart, Eye, Scan, CalendarClock, MessageSquare, BellRing } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import type { CatalogKind } from '~/composables/useCatalogFilters'
import { stockOf, isOutOfStock } from '~/utils/stockStatus'
import StockBadge from '~/components/motorcycles/StockBadge.vue'

const props = withDefaults(defineProps<{
  item: any
  kind: CatalogKind
  href: string
  saved?: boolean
}>(), { saved: false })

defineEmits<{ 'toggle-wishlist': []; 'quick-view': []; enquire: []; remind: [] }>()

const pb = usePB()

const imageUrl = computed(() => {
  const img = props.item.images?.length
    ? props.item.images[0]
    : props.item.image
  if (!img) return ''
  return pb.files.getURL(props.item, img, { thumb: '800x0' })
})

const isComingSoon = computed(() => props.item.status === 'coming_soon')

const isOosBike = computed(() => props.kind === 'bike' && !isComingSoon.value && isOutOfStock(props.item))

const rootCls = computed(() => {
  if (!isOosBike.value) return 'border-white/[0.06] hover:-translate-y-2 hover:border-brand-red/40 hover:shadow-[0_24px_60px_-20px_rgba(214,0,28,0.35)] hover:shadow-black/60'
  return 'border-white/[0.04]'
})

const eyebrow = computed(() => {
  if (props.kind === 'bike') return props.item.brand_name || props.item.expand?.brand?.name || 'Nairobi Powerbikes'
  return 'Genuine Powerbikes Gear'
})

const categoryLabel = computed(() => {
  if (props.kind === 'bike') return props.item.type || props.item.expand?.category?.name || 'Motorcycle'
  if (props.kind === 'accessory') return props.item.category || 'Accessory'
  return props.item.type || 'Apparel'
})

const meta = computed(() => {
  if (props.kind === 'bike') {
    const bits = []
    if (props.item.year) bits.push(props.item.year)
    if (props.item.engine_cc) bits.push(`${props.item.engine_cc}cc`)
    if (props.item.transmission) bits.push(props.item.transmission.split(' ')[0])
    return bits.join('  ·  ')
  }
  if (props.kind === 'apparel') {
    const bits = []
    if (props.item.size) bits.push(`Size ${props.item.size}`)
    if (props.item.color) bits.push(props.item.color)
    return bits.join('  ·  ')
  }
  return props.item.in_stock ? 'Ready to ship' : 'Out of stock'
})

const inStock = computed(() => {
  if (props.kind === 'bike') {
    if (props.item.status === 'coming_soon') return false
    return stockOf(props.item) > 0
  }
  return !!props.item.in_stock
})

const currentPrice = computed(() => (props.item.sale_price || props.item.price) ?? 0)

const discount = computed(() => {
  if (!props.item.sale_price || !props.item.price || props.item.sale_price >= props.item.price) return ''
  const pct = Math.round((1 - props.item.sale_price / props.item.price) * 100)
  return pct > 0 ? `${pct}%` : ''
})

function formatPrice(v: number) {
  return `KSh ${Number(v).toLocaleString('en-KE')}`
}
</script>