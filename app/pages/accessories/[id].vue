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
          <NuxtLink to="/accessories" class="transition-colors hover:text-brand-red">Accessories</NuxtLink>
          <ChevronRight class="h-3 w-3" />
          <span class="text-brand-red">{{ item.name }}</span>
        </nav>
      </div>

      <div class="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div class="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <!-- Gallery -->
          <motion.div :initial="{ opacity: 0, x: -30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.6 }">
            <div class="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-black">
              <ImageGallery :images="galleryImages" :alt="item.name" show-main-badge />
              <span class="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-[11px] font-bold tracking-wider uppercase backdrop-blur-md" :class="inStock ? 'text-emerald-400' : 'text-brand-grey'">
                {{ inStock ? 'In Stock' : 'Out of Stock' }}
              </span>
              <span v-if="item.sale_price" class="absolute right-4 top-4 z-10 rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-bold tracking-wider text-black uppercase">Sale</span>
            </div>
          </motion.div>

          <!-- Info -->
          <motion.div :initial="{ opacity: 0, x: 30 }" :animate="{ opacity: 1, x: 0 }" :transition="{ duration: 0.6, delay: 0.1 }">
            <p class="font-display text-sm tracking-[0.26em] text-brand-red uppercase">{{ item.category || 'Accessory' }}</p>
            <h1 class="mt-2 font-heading text-4xl leading-[1.05] text-white sm:text-5xl">{{ item.name }}</h1>

            <div class="mt-6 flex items-end gap-4">
              <p class="font-heading text-5xl text-brand-red">{{ formatPrice(currentPrice) }}</p>
              <div class="pb-1.5">
                <p v-if="item.sale_price" class="text-lg font-semibold text-brand-grey/70 line-through">{{ formatPrice(item.price) }}</p>
                <p v-if="discount" class="text-sm font-bold text-emerald-400">Save {{ discount }}</p>
              </div>
            </div>

            <p v-if="item.description" class="mt-6 leading-relaxed text-brand-light/75">{{ item.description }}</p>

            <div class="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div v-for="s in specs" :key="s.label" class="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-transparent px-4 py-3.5 text-center">
                <p class="text-[10px] font-display tracking-wider text-brand-grey uppercase">{{ s.label }}</p>
                <p class="mt-1 truncate text-sm font-bold text-white" :title="s.value">{{ s.value }}</p>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <Button variant="secondary" @click="wishlist.toggle('accessory', item)">
                <Heart class="h-5 w-5" :class="{ 'fill-brand-red text-brand-red': isSaved }" />{{ isSaved ? 'Saved' : 'Save to Wishlist' }}
              </Button>
              <Button variant="secondary" @click="enquiryOpen = true"><MessageSquare class="h-5 w-5" />Enquire</Button>
              <ShareButton :title="item.name" :description="item.description" :image="primaryImageUrl" type="accessory" variant="ghost" />
            </div>

            <div class="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-4 text-xs text-brand-grey">
              <span class="flex items-center gap-1.5"><ShieldCheck class="h-4 w-4 text-brand-red" />Genuine Powerbikes gear</span>
              <span class="flex items-center gap-1.5"><Truck class="h-4 w-4 text-brand-red" />Available at our Nairobi branches</span>
            </div>
          </motion.div>
        </div>

        <!-- Related accessories -->
        <motion.section class="mt-20" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="text-[11px] font-display tracking-[0.24em] text-brand-red uppercase">Customers also viewed</p>
              <h2 class="mt-1 font-heading text-4xl text-white">Related Accessories</h2>
            </div>
            <NuxtLink to="/accessories" class="hidden text-sm font-semibold text-brand-light/70 transition-colors hover:text-brand-red sm:block">View all →</NuxtLink>
          </div>
          <div v-if="related.length" class="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ShopProductCard
              v-for="a in related"
              :key="a.id"
              :item="a"
              kind="accessory"
              :href="accessoryPath(a)"
              :saved="wishlist.isSaved('accessory', a.id)"
              @toggle-wishlist="wishlist.toggle('accessory', a)"
              @quick-view="quickViewItem = a; quickViewOpen = true"
              @enquire="enquiryItem = a; enquiryOpen = true"
            />
          </div>
        </motion.section>

        <!-- Recommended motorcycles -->
        <motion.section class="mt-20" :initial="{ opacity: 0, y: 30 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5, delay: 0.05 }">
          <div class="flex items-end justify-between gap-4">
            <div>
              <p class="text-[11px] font-display tracking-[0.24em] text-brand-red uppercase">Pairs perfectly with</p>
              <h2 class="mt-1 font-heading text-4xl text-white">Recommended Motorcycles</h2>
            </div>
            <NuxtLink to="/motorcycles" class="hidden text-sm font-semibold text-brand-light/70 transition-colors hover:text-brand-red sm:block">View all →</NuxtLink>
          </div>
          <div v-if="recommendedBikes.length" class="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ShopProductCard
              v-for="b in recommendedBikes"
              :key="b.id"
              :item="b"
              kind="bike"
              :href="bikePath(b)"
              :saved="wishlist.isSaved('bike', b.id)"
              @toggle-wishlist="wishlist.toggle('bike', b)"
              @quick-view="quickViewItem = b; quickViewOpen = true"
              @enquire="enquiryItem = b; enquiryOpen = true"
            />
          </div>
        </motion.section>
      </div>

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
      <ShopEmptyState kind="accessory" />
      <div class="mt-8 text-center">
        <Button to="/accessories" variant="primary">Browse All Accessories</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { ChevronRight, Heart, MessageSquare, ShieldCheck, Truck } from 'lucide-vue-next'
import { useCatalogStore } from '~/stores/catalog'
import { useWishlist } from '~/composables/useWishlist'
import { usePB } from '~/composables/usePocketBase'
import type { CatalogKind } from '~/composables/useCatalogFilters'
import ImageGallery from '~/components/motorcycles/ImageGallery.vue'

useHead({ title: 'Accessory Details - Nairobi Powerbikes' })

const route = useRoute()
const store = useCatalogStore()
const pb = usePB()
const wishlist = useWishlist()

const loading = ref(true)
const quickViewOpen = ref(false)
const quickViewItem = ref<any>(null)
const enquiryOpen = ref(false)
const enquiryItem = ref<any>(null)

const item = computed(() => {
  const param = String(route.params.id || '')
  return (
    store.accessories.find(a => a.slug === param)
    || store.accessories.find(a => a.id === param)
    || null
  )
})

const primaryImageUrl = computed(() => {
  const it = item.value
  if (!it) return ''
  const files: string[] = Array.isArray(it.image) ? it.image : (it.image ? [it.image] : [])
  const main = Math.min(Math.max(Number(it.main_image) || 0, 0), Math.max(0, files.length - 1))
  const f = files[main] || files[0]
  return f ? pb.files.getURL(it, f, { thumb: '1200x0' }) : ''
})

watch(item, (a) => {
  if (a) {
    const desc = String(a.description || '').replace(/[#*`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 160)
    const canon = canonicalUrl(a)
    useHead({
      title: `${a.name} - Nairobi Powerbikes`,
      meta: [
        { name: 'description', content: desc },
        { name: 'robots', content: 'index, follow' },
        { property: 'og:title', content: a.name },
        { property: 'og:description', content: desc },
        { property: 'og:type', content: 'product' },
        { property: 'og:url', content: canon },
        { property: 'og:image', content: primaryImageUrl.value },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: a.name },
        { name: 'twitter:description', content: desc },
        { name: 'twitter:image', content: primaryImageUrl.value },
      ],
      link: [{ rel: 'canonical', href: canon }],
    })
  }
})

function canonicalUrl(a: any) {
  const config = useRuntimeConfig()
  const site = String(config.public.siteUrl || '').replace(/\/$/, '')
  return `${site}/accessories/${a.slug || a.id}`
}

const galleryImages = computed(() => {
  const it = item.value
  if (!it) return []
  const files: string[] = Array.isArray(it.image) ? it.image : (it.image ? [it.image] : [])
  const cats: string[] = Array.isArray(it.image_categories) ? it.image_categories : []
  return files.map((f, i) => ({ url: pb.files.getURL(it, f, { thumb: '1200x0' }), category: cats[i] || '' }))
})

const inStock = computed(() => !!item.value?.in_stock)
const currentPrice = computed(() => (item.value?.sale_price || item.value?.price) ?? 0)
const discount = computed(() => {
  if (!item.value?.sale_price || !item.value?.price || item.value.sale_price >= item.value.price) return ''
  return `${Math.round((1 - item.value.sale_price / item.value.price) * 100)}%`
})

const specs = computed(() => {
  const it = item.value
  if (!it) return []
  const out: { label: string; value: string }[] = []
  const add = (label: string, val: any) => { if (val != null && val !== '') out.push({ label, value: String(val) }) }
  add('Category', it.category)
  add('Stock', it.in_stock ? 'In Stock' : 'Out of Stock')
  add('SKU', it.id)
  return out
})

const related = computed(() => {
  if (!item.value) return []
  return store.accessories
    .filter(a => a.id !== item.value?.id && (!item.value?.category || a.category === item.value.category))
    .slice(0, 4)
})

const recommendedBikes = computed(() => store.motorcycles.slice(0, 4))

const quickViewKind = computed<CatalogKind>(() => {
  const t = quickViewItem.value
  if (!t) return 'accessory'
  return store.motorcycles.some(b => b.id === t.id) ? 'bike' : 'accessory'
})
const quickViewHref = computed(() => {
  const t = quickViewItem.value
  if (!t) return '#'
  return quickViewKind.value === 'bike' ? bikePath(t) : accessoryPath(t)
})
const quickViewSaved = computed(() => {
  const t = quickViewItem.value
  return t ? wishlist.isSaved(quickViewKind.value, t.id) : false
})
const enquiryKind = computed<CatalogKind>(() => quickViewKind.value)

const isSaved = computed(() => item.value ? wishlist.isSaved('accessory', item.value.id) : false)

import { bikePath, accessoryPath } from '~/utils/paths'

function formatPrice(v: number) { return `KSh ${Number(v).toLocaleString('en-KE')}` }

onMounted(async () => {
  await store.ensureActive()
  loading.value = false
  await wishlist.load()
  const a = item.value
  if (!a) {
    showError({ statusCode: 404, statusMessage: 'Accessory not found' })
    return
  }
  const param = String(route.params.id || '')
  if (a.slug && a.slug !== param) {
    await navigateTo(`/accessories/${a.slug}`, { replace: true })
  }
})

onUnmounted(() => { store.release() })
</script>

<style scoped>
.quickview-enter-active, .quickview-leave-active { transition: opacity 0.25s ease; }
.quickview-enter-from, .quickview-leave-to { opacity: 0; }
</style>