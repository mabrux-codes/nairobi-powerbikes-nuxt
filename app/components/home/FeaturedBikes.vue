<template>
  <section class="bg-brand-black py-20">
    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <div class="mb-14 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Hand-Picked Machines"
          title="Featured"
          accent="Motorcycles"
          description="Our flagship models, curated for performance and presence."
          align="left"
        />
        <Button to="/motorcycles" variant="ghost" trailing-arrow class="mb-2">View Full Collection</Button>
      </div>

      <div v-if="loading" class="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <ShopSkeletonCard v-for="i in 4" :key="i" />
      </div>

      <div v-else-if="bikes.length" class="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        <motion.div
          v-for="(bike, index) in bikes"
          :key="bike.id"
          class="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.05] to-white/[0.01] transition-all duration-500 hover:-translate-y-2 hover:border-brand-red/40 hover:shadow-[0_32px_70px_-24px_rgba(214,0,28,0.4)]"
          :initial="{ opacity: 0, y: 44 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :viewport="{ once: true, margin: '-50px' }"
          :transition="{ delay: index * 0.1, duration: 0.55, ease: 'easeOut' }"
        >
          <div class="relative aspect-[4/5] overflow-hidden bg-black">
            <NuxtLink :to="bikePath(bike)" class="block h-full w-full" tabindex="-1" aria-hidden="true">
              <img
                v-if="bike.images?.length"
                :src="pb.files.getURL(bike, bike.images[0], { thumb: '900x0' })"
                :alt="bike.name"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />
              <div v-else class="flex h-full w-full items-center justify-center bg-zinc-900">
                <Bike class="h-14 w-14 text-zinc-700" stroke-width="1" />
              </div>
              <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/25" />
            </NuxtLink>

            <div class="absolute left-3 top-3 flex flex-col items-start gap-1.5">
              <span v-if="bike.new_arrival" class="rounded-full bg-brand-red px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-white uppercase">New</span>
              <span v-if="bike.sale_price" class="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-black uppercase">Sale</span>
            </div>

            <button
              class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border bg-black/55 backdrop-blur-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red"
              :class="wishlist.isSaved('bike', bike.id) ? 'border-brand-red/60 text-brand-red' : 'border-white/15 text-white hover:border-brand-red/50 hover:text-brand-red'"
              :aria-label="wishlist.isSaved('bike', bike.id) ? `Remove ${bike.name} from wishlist` : `Save ${bike.name} to wishlist`"
              @click="toggleWishlist(bike)"
            >
              <Heart class="h-5 w-5" :class="{ 'fill-brand-red': wishlist.isSaved('bike', bike.id) }" :stroke-width="wishlist.isSaved('bike', bike.id) ? 2 : 1.8" />
            </button>

            <div class="absolute bottom-4 left-4 right-4">
              <p class="text-[11px] font-semibold tracking-[0.2em] text-brand-grey uppercase">{{ bike.expand?.brand?.name || bike.brand || 'Motorcycle' }}</p>
              <h3 class="mt-1 font-display text-2xl leading-snug font-bold tracking-display text-white">
                <NuxtLink :to="bikePath(bike)" class="transition-colors hover:text-brand-red">{{ bike.name }}</NuxtLink>
              </h3>
            </div>
          </div>

          <div class="flex flex-1 flex-col gap-5 p-6">
            <p class="text-sm leading-relaxed text-brand-grey line-clamp-2">{{ bike.description || 'Premium performance motorcycle' }}</p>

            <div class="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span v-if="bike.year" class="flex items-center gap-1.5 text-sm text-brand-grey">
                <Calendar class="h-4 w-4 text-brand-red" />{{ bike.year }}
              </span>
              <span v-if="bike.engine_cc" class="flex items-center gap-1.5 text-sm text-brand-grey">
                <Gauge class="h-4 w-4 text-brand-red" />{{ bike.engine_cc }}cc
              </span>
              <span v-if="bike.transmission" class="flex items-center gap-1.5 text-sm text-brand-grey">
                <Settings2 class="h-4 w-4 text-brand-red" />{{ bike.transmission }}
              </span>
            </div>

            <div class="mt-auto flex items-end justify-between gap-3">
              <div>
                <p class="font-heading text-3xl text-brand-red">{{ formatPrice(currentPrice(bike)) }}</p>
                <p v-if="bike.sale_price" class="text-sm text-brand-grey/60 line-through">KSh {{ formatPrice(bike.price) }}</p>
              </div>
              <div class="flex flex-col items-end gap-2">
                <span v-if="discount(bike)" class="rounded-full bg-brand-red/15 px-2.5 py-1 text-xs font-bold text-brand-red">{{ discount(bike) }} OFF</span>
                <span
                  v-if="isAvailable(bike)"
                  class="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400"
                >
                  <span class="relative flex h-1.5 w-1.5">
                    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  Available
                </span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              <Button :to="bikePath(bike)" variant="secondary" size="sm" class="col-span-2">
                <Eye class="h-4 w-4" />View Details
              </Button>
              <Button :to="`/service/test-ride?motorcycle=${bike.id}`" size="sm" variant="ghost">
                <CalendarClock class="h-4 w-4" />Book Test Ride
              </Button>
              <Button :to="`/motorcycles/compare?compare=${bike.id}`" size="sm" variant="ghost">
                <GitCompareArrows class="h-4 w-4" />Compare
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      <div v-else class="flex flex-col items-center rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
        <Bike class="h-14 w-14 text-brand-grey/40" stroke-width="1.2" />
        <p class="mt-4 font-display text-2xl tracking-display text-white">No featured machines yet</p>
        <p class="mt-2 max-w-md text-sm text-brand-grey/70">Featured models are on the way. Browse the full collection to find your next ride.</p>
        <Button to="/motorcycles" variant="secondary" size="sm" class="mt-6">
          <ArrowRight class="h-4 w-4" />Browse All Motorcycles
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { ArrowRight, Eye, CalendarClock, GitCompareArrows, Heart, Bike, Calendar, Gauge, Settings2 } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useWishlist } from '~/composables/useWishlist'

interface Brand { id: string; name: string }
interface Bike { id: string; name: string; brand: string; engine_cc?: string; year?: number; transmission?: string; price: number; sale_price?: number; description?: string; images?: string[]; new_arrival?: boolean; status?: string; expand?: { brand?: Brand } }

const pb = usePB()
const loading = ref(true)
const bikes = ref<Bike[]>([])
const wishlist = useWishlist()

function toggleWishlist(bike: Bike) {
  wishlist.toggle('bike', bike)
}

function bikePath(b: any) { return `/motorcycles/${b.slug || encodeURIComponent(b.name)}` }
function formatPrice(v: number) { return `KSh ${Number(v).toLocaleString('en-KE')}` }
function currentPrice(b: Bike) { return (b.sale_price || b.price) ?? 0 }
function discount(b: Bike) {
  if (!b.sale_price || !b.price || b.sale_price >= b.price) return ''
  const pct = Math.round((1 - b.sale_price / b.price) * 100)
  return pct > 0 ? `${pct}%` : ''
}

function isAvailable(b: Bike) {
  return !b.status || b.status === 'available'
}

async function loadBikes() {
  try {
    const records = await pb.collection('motorcycles').getList<Bike>(1, 8, { filter: 'featured = true && status = "available"', sort: 'sort_order, -created', expand: 'brand', requestKey: 'home-featured-bikes' })
    bikes.value = records.items
  } catch { bikes.value = [] }
  finally { loading.value = false }
}

onMounted(async () => {
  await Promise.all([loadBikes(), wishlist.load()])
  pb.collection('motorcycles').subscribe('*', () => loadBikes())
})

onUnmounted(() => {
  pb.collection('motorcycles').unsubscribe('*')
})
</script>