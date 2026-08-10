<template>
  <Teleport to="body">
    <Transition name="quickview">
      <div
        v-if="open"
        class="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8"
        role="dialog"
        aria-modal="true"
        :aria-label="`Quick view: ${item?.name}`"
        @keydown.esc="close"
      >
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="close" />
        <motion.div
          ref="panelRef"
          class="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-brand-black shadow-2xl shadow-black"
          :initial="{ opacity: 0, scale: 0.94, y: 24 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{ type: 'spring', stiffness: 300, damping: 28 }"
        >
          <button
            ref="closeBtn"
            class="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition-colors hover:border-brand-red hover:text-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
            aria-label="Close quick view"
            @click="close"
          >
            <X class="h-5 w-5" />
          </button>

          <div class="grid max-h-[85vh] overflow-y-auto md:grid-cols-2 md:overflow-hidden">
            <div class="relative bg-black">
              <div class="aspect-[4/5] overflow-hidden group/qv">
                <img
                  v-if="imageUrl"
                  :src="imageUrl"
                  :alt="item?.name"
                  class="h-full w-full object-cover transition-transform duration-500 group-hover/qv:scale-105"
                />
              </div>
              <div v-if="images.length > 1" class="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/80 to-transparent p-4">
                <button
                  v-for="(img, i) in images"
                  :key="img"
                  class="h-14 w-14 overflow-hidden rounded-lg border-2 transition-all"
                  :class="i === activeImage ? 'border-brand-red' : 'border-transparent opacity-60 hover:opacity-100'"
                  :aria-label="`View image ${i + 1}`"
                  @click="activeImage = i"
                >
                  <img :src="pb.files.getURL(item!, img, { thumb: '120x0' })" :alt="`${item?.name} ${i + 1}`" class="h-full w-full object-cover" />
                </button>
              </div>
            </div>

            <div class="flex flex-col overflow-y-auto p-6 sm:p-8">
              <p class="text-[11px] font-display tracking-[0.24em] text-brand-red uppercase">{{ eyebrow }}</p>
              <h2 class="mt-2 font-heading text-3xl text-white">{{ item?.name }}</h2>
              <p v-if="meta" class="mt-1 text-sm text-brand-grey">{{ meta }}</p>

              <div class="mt-4 flex items-end gap-3">
                <p class="font-heading text-3xl text-brand-red">{{ formatPrice(currentPrice) }}</p>
                <p v-if="item?.sale_price" class="pb-1 text-sm font-semibold text-brand-grey/70 line-through">{{ formatPrice(item.price) }}</p>
              </div>

              <div class="mt-3 flex items-center gap-2">
                <StockBadge v-if="kind === 'bike' && !isComingSoon" :item="item" size="md" />
                <span v-else class="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase" :class="inStock ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-brand-grey'">
                  <span class="h-1.5 w-1.5 rounded-full" :class="inStock ? 'bg-emerald-400' : 'bg-brand-grey'" />
                  {{ inStock ? 'In Stock' : 'Out of Stock' }}
                </span>
                <span v-if="item?.featured" class="rounded-full bg-brand-red/15 px-2.5 py-1 text-[11px] font-bold text-brand-red uppercase">Featured</span>
              </div>

              <p v-if="item?.description" class="mt-4 line-clamp-4 text-sm leading-relaxed text-brand-light/70">{{ item.description }}</p>

              <div class="mt-5 grid grid-cols-2 gap-2">
                <div v-for="s in specHighlights" :key="s.label" class="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3 py-2.5">
                  <p class="text-[10px] font-display tracking-wider text-brand-grey uppercase">{{ s.label }}</p>
                  <p class="mt-0.5 truncate text-sm font-semibold text-white">{{ s.value }}</p>
                </div>
              </div>

              <div class="mt-6 grid gap-2.5 sm:grid-cols-2">
                <Button :to="href" variant="primary" class="sm:col-span-2"><Eye class="h-4 w-4" />Full Details</Button>
                <Button
                  v-if="kind === 'bike' && !isComingSoon && !oosBike"
                  :to="`/service/test-ride?motorcycle=${item?.id}`"
                  variant="secondary"
                >
                  <CalendarClock class="h-4 w-4" />Book Test Ride
                </Button>
                <Button v-else-if="kind === 'bike' && oosBike" variant="secondary" @click="$emit('remind')">
                  <BellRing class="h-4 w-4" />Notify Me When Available
                </Button>
                <Button v-else variant="secondary" @click="$emit('enquire')">
                  <MessageSquare class="h-4 w-4" />Enquire Now
                </Button>
                <Button variant="ghost" @click="$emit('toggle-wishlist')">
                  <Heart class="h-4 w-4" :class="{ 'fill-brand-red': saved }" :style="{ color: saved ? undefined : '' }" />
                  {{ saved ? 'Saved' : 'Save to Wishlist' }}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { X, Eye, CalendarClock, MessageSquare, Heart, BellRing } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import type { CatalogKind } from '~/composables/useCatalogFilters'
import { isOutOfStock } from '~/utils/stockStatus'
import StockBadge from '~/components/motorcycles/StockBadge.vue'

const props = defineProps<{
  open: boolean
  item: any
  kind: CatalogKind
  href: string
  saved?: boolean
}>()

const emit = defineEmits<{ close: []; 'toggle-wishlist': []; enquire: []; remind: [] }>()

const pb = usePB()
const activeImage = ref(0)
const closeBtn = ref<HTMLElement | null>(null)

watch(() => props.item?.id, () => { activeImage.value = 0 })
watch(() => props.open, (v) => {
  if (v) {
    activeImage.value = 0
    nextTick(() => closeBtn.value?.focus())
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

onBeforeUnmount(() => { document.body.style.overflow = '' })

function close() { emit('close') }

const images = computed(() => {
  if (props.item?.images?.length) return props.item.images
  if (props.item?.image) return [props.item.image]
  return []
})

const imageUrl = computed(() => {
  const imgs = images.value
  if (!imgs.length) return ''
  return pb.files.getURL(props.item, imgs[activeImage.value], { thumb: '900x0' })
})

const eyebrow = computed(() => {
  if (props.kind === 'bike') return props.item?.brand_name || props.item?.expand?.brand?.name || 'Motorcycle'
  if (props.kind === 'accessory') return props.item?.category || 'Accessory'
  return props.item?.type || 'Apparel'
})

const meta = computed(() => {
  if (props.kind === 'bike') {
    const bits = []
    if (props.item?.year) bits.push(props.item.year)
    if (props.item?.engine_cc) bits.push(`${props.item.engine_cc}cc`)
    if (props.item?.transmission) bits.push(props.item.transmission.split(' ')[0])
    return bits.join('  ·  ')
  }
  if (props.kind === 'apparel') {
    const bits = []
    if (props.item?.size) bits.push(`Size ${props.item.size}`)
    if (props.item?.color) bits.push(props.item.color)
    return bits.join('  ·  ')
  }
  return ''
})

const inStock = computed(() => {
  if (props.kind === 'bike') {
    if (props.item?.status === 'coming_soon') return false
    return !isOutOfStock(props.item)
  }
  return !!props.item?.in_stock
})

const oosBike = computed(() => props.kind === 'bike' && props.item?.status !== 'coming_soon' && isOutOfStock(props.item))

const isComingSoon = computed(() => props.item?.status === 'coming_soon')
const currentPrice = computed(() => (props.item?.sale_price || props.item?.price) ?? 0)

const specHighlights = computed(() => {
  const list: { label: string; value: string }[] = []
  const it = props.item
  if (!it) return list
  if (props.kind === 'bike') {
    const add = (label: string, val: any) => { if (val != null && val !== '') list.push({ label, value: String(val) }) }
    add('Engine', it.engine_cc ? `${it.engine_cc}cc` : '')
    add('Power', it.horsepower ? `${it.horsepower}hp` : '')
    add('Transmission', it.transmission)
    add('Fuel Tank', it.fuel_capacity)
    add('Top Speed', it.top_speed)
    add('Weight', it.weight)
  } else if (props.kind === 'apparel') {
    const add = (label: string, val: any) => { if (val != null && val !== '') list.push({ label, value: String(val) }) }
    add('Size', it.size)
    add('Colour', it.color)
  } else {
    const add = (label: string, val: any) => { if (val != null && val !== '') list.push({ label, value: String(val) }) }
    add('Category', it.category)
    add('Stock', it.in_stock ? 'In Stock' : 'Out of Stock')
  }
  return list.slice(0, 6)
})

function formatPrice(v: number) {
  return `KSh ${Number(v).toLocaleString('en-KE')}`
}
</script>

<style scoped>
.quickview-enter-active, .quickview-leave-active { transition: opacity 0.25s ease; }
.quickview-enter-from, .quickview-leave-to { opacity: 0; }
</style>
