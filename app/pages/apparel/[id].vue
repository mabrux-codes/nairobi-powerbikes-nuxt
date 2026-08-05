<template>
  <div class="min-h-screen bg-brand-black text-white">
    <div v-if="loading" class="mx-auto max-w-[90rem] px-4 py-24 sm:px-6 lg:px-8">
      <div class="grid gap-10 lg:grid-cols-2">
        <ShopSkeletonCard />
        <div class="space-y-5">
          <div class="h-3 w-40 animate-pulse rounded bg-white/[0.06]" />
          <div class="h-12 w-3/4 animate-pulse rounded bg-white/[0.08]" />
          <div class="h-4 w-56 animate-pulse rounded bg-white/[0.05]" />
          <div class="h-10 w-48 animate-pulse rounded bg-brand-red/20" />
          <div class="h-24 w-full animate-pulse rounded-2xl bg-white/[0.04]" />
        </div>
      </div>
    </div>

    <template v-else-if="item">
      <div class="mx-auto max-w-[90rem] px-4 pt-[calc(var(--nav-h)+24px)] sm:px-6 lg:px-8">
        <nav class="flex items-center gap-2 text-xs font-display tracking-wider text-brand-grey uppercase" aria-label="Breadcrumb">
          <NuxtLink to="/" class="transition-colors hover:text-brand-red">Home</NuxtLink>
          <ChevronRight class="h-3 w-3" />
          <NuxtLink to="/apparel" class="transition-colors hover:text-brand-red">Apparel</NuxtLink>
          <ChevronRight class="h-3 w-3" />
          <span class="text-brand-red">{{ item.name }}</span>
        </nav>
      </div>

      <div class="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div class="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <!-- Gallery -->
          <motion.div :initial="{ opacity: 0, x: -30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.6 }">
            <div class="group relative overflow-hidden rounded-3xl border border-white/[0.06] bg-black">
              <button class="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden focus-visible:outline-none" :aria-label="'View larger image of ' + item.name" @click="lightboxOpen = true">
                <img v-if="imageUrl" :src="imageUrl" :alt="item.name" class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                <div v-else class="flex h-full w-full items-center justify-center bg-gradient-to-br from-white/[0.05] to-transparent">
                  <Shirt class="h-20 w-20 text-brand-grey/40" :stroke-width="1" />
                </div>
              </button>
              <span class="absolute left-4 top-4 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase backdrop-blur-md" :class="inStock ? 'text-emerald-400' : 'text-brand-grey'">
                {{ inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
              <span v-if="item.sale_price" class="absolute right-4 top-4 rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-bold tracking-wider text-black uppercase">Sale</span>
            </div>
          </motion.div>

          <!-- Info -->
          <motion.div :initial="{ opacity: 0, x: 30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.6, delay: 0.1 }">
            <p class="font-display text-sm tracking-[0.26em] text-brand-red uppercase">{{ item.type || 'Apparel' }}</p>
            <h1 class="mt-2 font-heading text-4xl leading-[1.05] text-white sm:text-5xl">{{ item.name }}</h1>

            <div class="mt-6 flex items-end gap-4">
              <p class="font-heading text-5xl text-brand-red">{{ formatPrice(currentPrice) }}</p>
              <div class="pb-1.5">
                <p v-if="item.sale_price" class="text-lg font-semibold text-brand-grey/70 line-through">{{ formatPrice(item.price) }}</p>
                <p v-if="discount" class="text-sm font-bold text-emerald-400">Save {{ discount }}</p>
              </div>
            </div>

            <p v-if="item.description" class="mt-6 leading-relaxed text-brand-light/75">{{ item.description }}</p>

            <div class="mt-7">
              <p class="text-[11px] font-display tracking-wider text-brand-grey uppercase">Sizes</p>
              <div class="mt-2.5 flex flex-wrap gap-2">
                <span v-if="item.size" class="rounded-xl border border-brand-red/40 bg-brand-red/10 px-4 py-2 text-sm font-bold text-brand-red">{{ item.size }}</span>
                <span v-else class="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-brand-grey">Sizes on request</span>
              </div>
            </div>

            <div v-if="item.color" class="mt-6">
              <p class="text-[11px] font-display tracking-wider text-brand-grey uppercase">Colour</p>
              <div class="mt-2.5 flex flex-wrap gap-2">
                <span class="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm font-medium text-brand-light/85">
                  <span class="h-3.5 w-3.5 rounded-full border border-white/25" :style="{ background: colorSwatch }" />
                  {{ item.color }}
                </span>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <Button variant="secondary" @click="wishlist.toggle('apparel', item)">
                <Heart class="h-5 w-5" :class="{ 'fill-brand-red text-brand-red': isSaved }" />{{ isSaved ? 'Saved' : 'Save to Wishlist' }}
              </Button>
              <Button variant="secondary" @click="enquiryOpen = true"><MessageSquare class="h-5 w-5" />Enquire</Button>
              <Button variant="ghost" @click="share"><Share2 class="h-5 w-5" />Share</Button>
            </div>

            <div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-xs text-brand-grey">
              <span class="flex items-center gap-1.5"><ShieldCheck class="h-4 w-4 text-brand-red" />Quality assured gear</span>
              <span class="flex items-center gap-1.5"><Truck class="h-4 w-4 text-brand-red" />Collect at any Nairobi branch</span>
            </div>
          </motion.div>
        </div>

        <!-- Related apparel -->
        <motion.section class="mt-20" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="text-[11px] font-display tracking-[0.24em] text-brand-red uppercase">Complete the look</p>
              <h2 class="mt-1 font-heading text-4xl text-white">Related Apparel</h2>
            </div>
            <NuxtLink to="/apparel" class="hidden text-sm font-semibold text-brand-light/70 transition-colors hover:text-brand-red sm:block">View all →</NuxtLink>
          </div>
          <div v-if="related.length" class="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ShopProductCard
              v-for="a in related"
              :key="a.id"
              :item="a"
              kind="apparel"
              :href="`/apparel/${a.id}`"
              :saved="wishlist.isSaved('apparel', a.id)"
              @toggle-wishlist="wishlist.toggle('apparel', a)"
              @quick-view="quickViewItem = a; quickViewOpen = true"
              @enquire="enquiryItem = a; enquiryOpen = true"
            />
          </div>
        </motion.section>

        <!-- Recommended accessories -->
        <motion.section class="mt-20" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5, delay: 0.05 }">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="text-[11px] font-display tracking-[0.24em] text-brand-red uppercase">Recommended</p>
              <h2 class="mt-1 font-heading text-4xl text-white">Recommended Accessories</h2>
            </div>
            <NuxtLink to="/accessories" class="hidden text-sm font-semibold text-brand-light/70 transition-colors hover:text-brand-red sm:block">View all →</NuxtLink>
          </div>
          <div v-if="recommendedAccessories.length" class="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ShopProductCard
              v-for="a in recommendedAccessories"
              :key="a.id"
              :item="a"
              kind="accessory"
              :href="`/accessories/${a.id}`"
              :saved="wishlist.isSaved('accessory', a.id)"
              @toggle-wishlist="wishlist.toggle('accessory', a)"
              @quick-view="quickViewItem = a; quickViewOpen = true"
              @enquire="enquiryItem = a; enquiryOpen = true"
            />
          </div>
        </motion.section>
      </div>

      <!-- Lightbox -->
      <Teleport to="body">
        <Transition name="quickview">
          <div v-if="lightboxOpen" class="fixed inset-0 z-[95] flex items-center justify-center bg-black/95 p-4" role="dialog" aria-modal="true" aria-label="Image viewer" @click.self="lightboxOpen = false">
            <button class="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-brand-red hover:text-brand-red" aria-label="Close image viewer" @click="lightboxOpen = false">
              <X class="h-5 w-5" />
            </button>
            <img v-if="imageUrl" :src="imageUrl" :alt="item.name" class="max-h-[85vh] max-w-full rounded-2xl object-contain" />
          </div>
        </Transition>
      </Teleport>

      <ShopQuickViewModal
        :open="quickViewOpen"
        :item="quickViewItem"
        :kind="quickViewKind"
        :href="quickViewHref"
        :saved="quickViewSaved"
        @close="quickViewOpen = false"
        @toggle-wishlist="quickViewItem && wishlist.toggle(quickViewKind, quickViewItem)"
        @enquire="enquiryItem = quickViewItem; enquiryOpen = true"
      />

      <ShopEnquiryModal :open="enquiryOpen" :item="enquiryItem" :kind="enquiryKind" @close="enquiryOpen = false" />
    </template>

    <div v-else class="mx-auto max-w-[90rem] px-4 py-32 sm:px-6 lg:px-8">
      <ShopEmptyState kind="apparel" />
      <div class="mt-8 text-center">
        <Button to="/apparel" variant="primary">Browse All Apparel</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { ChevronRight, Heart, MessageSquare, Share2, ShieldCheck, Truck, Shirt, X } from 'lucide-vue-next'
import { useCatalogStore } from '~/stores/catalog'
import { useWishlist } from '~/composables/useWishlist'
import { usePB } from '~/composables/usePocketBase'
import { useToast } from '~/composables/useToast'
import type { CatalogKind } from '~/composables/useCatalogFilters'

useHead({ title: 'Apparel Details - Nairobi Powerbikes' })

const route = useRoute()
const store = useCatalogStore()
const pb = usePB()
const toast = useToast()
const wishlist = useWishlist()

const loading = ref(true)
const lightboxOpen = ref(false)
const quickViewOpen = ref(false)
const quickViewItem = ref<any>(null)
const enquiryOpen = ref(false)
const enquiryItem = ref<any>(null)

const item = computed(() => store.apparel.find(a => a.id === route.params.id) || null)

watch(item, (a) => {
  if (a) useHead({ title: `${a.name} - Nairobi Powerbikes` })
})

const imageUrl = computed(() => (item.value?.image ? pb.files.getURL(item.value, item.value.image, { thumb: '1200x0' }) : ''))

const inStock = computed(() => !!item.value?.in_stock)
const currentPrice = computed(() => (item.value?.sale_price || item.value?.price) ?? 0)
const discount = computed(() => {
  if (!item.value?.sale_price || !item.value?.price || item.value.sale_price >= item.value.price) return ''
  return `${Math.round((1 - item.value.sale_price / item.value.price) * 100)}%`
})

const colorSwatch = computed(() => {
  const c = (item.value?.color || '').toLowerCase()
  const map: Record<string, string> = {
    black: '#111111', white: '#f5f5f5', red: '#D6001C', blue: '#2563eb', green: '#16a34a',
    grey: '#6b7280', gray: '#6b7280', brown: '#78350f', orange: '#ea580c', yellow: '#eab308',
    purple: '#7c3aed', pink: '#ec4899', navy: '#1e3a8a', olive: '#4d7c0f', tan: '#d6b98c',
  }
  for (const [k, v] of Object.entries(map)) if (c.includes(k)) return v
  return '#22d3ee'
})

const related = computed(() => {
  if (!item.value) return []
  return store.apparel
    .filter(a => a.id !== item.value?.id && (!item.value?.type || a.type === item.value.type))
    .slice(0, 4)
})

const recommendedAccessories = computed(() => store.accessories.slice(0, 4))

const quickViewKind = computed<CatalogKind>(() => {
  const t = quickViewItem.value
  if (!t) return 'apparel'
  return store.apparel.some(a => a.id === t.id) ? 'apparel' : 'accessory'
})
const quickViewHref = computed(() => {
  const t = quickViewItem.value
  if (!t) return '#'
  return quickViewKind.value === 'accessory' ? `/accessories/${t.id}` : `/apparel/${t.id}`
})
const quickViewSaved = computed(() => {
  const t = quickViewItem.value
  return t ? wishlist.isSaved(quickViewKind.value, t.id) : false
})
const enquiryKind = computed<CatalogKind>(() => quickViewKind.value)

const isSaved = computed(() => item.value ? wishlist.isSaved('apparel', item.value.id) : false)

function formatPrice(v: number) { return `KSh ${Number(v).toLocaleString('en-KE')}` }

async function share() {
  if (!item.value) return
  const url = window.location.href
  try {
    if (navigator.share) {
      await navigator.share({ title: item.value.name, url })
      return
    }
  } catch { /* user dismissed */ }
  try {
    await navigator.clipboard.writeText(url)
    toast.add({ type: 'success', title: 'Link copied', message: 'Share link copied to clipboard.' })
  } catch {
    toast.add({ type: 'info', title: 'Share', message: url })
  }
}

onMounted(async () => {
  await store.ensureActive()
  loading.value = false
  await wishlist.load()
})

onUnmounted(() => { store.release() })
</script>

<style scoped>
.quickview-enter-active, .quickview-leave-active { transition: opacity 0.25s ease; }
.quickview-enter-from, .quickview-leave-to { opacity: 0; }
</style>