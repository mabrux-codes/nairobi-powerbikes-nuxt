<template>
  <section class="screen-dvh relative w-full overflow-hidden bg-brand-black">
    <!-- Dark grid background used on tablet + mobile; desktop keeps the framed showroom carousel -->
    <div class="asphalt-grid absolute inset-0 bg-brand-black" />

    <div class="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
      <div class="flex flex-1 flex-col items-center justify-center gap-8 text-center lg:flex-row lg:text-left lg:items-center">
        <motion.div
          class="z-20 w-full lg:w-1/2 lg:pr-12"
          :initial="{ opacity: 0, x: -60 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
        >
          <motion.p
            class="mb-2 font-display text-sm tracking-[0.3em] text-brand-red"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 0.2, duration: 0.5 }"
          >
            NAIROBI'S PREMIER MOTO DEALERSHIP
          </motion.p>

          <motion.h1
            class="font-heading text-6xl text-white sm:text-[6rem] lg:text-[7rem] xl:text-[8rem]"
            :initial="{ opacity: 0, y: 40 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 0.4, duration: 0.6 }"
          >
            RIDE THE
            <br />
            <span class="text-brand-red">POWER</span>
          </motion.h1>

          <motion.p
            class="mx-auto mt-4 max-w-md font-display text-lg tracking-display text-gray-300 lg:text-brand-grey lg:mx-0"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 0.6, duration: 0.5 }"
          >
            Explore Nairobi's finest collection of performance motorcycles. From street machines to adventure tourers — find your next ride.
          </motion.p>

          <motion.div
            class="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 0.8, duration: 0.5 }"
          >
            <Button to="/motorcycles" variant="primary" size="lg">
              <ArrowRight class="h-5 w-5" />
              Browse Motorcycles
            </Button>
            <Button to="/service/test-ride" variant="secondary" size="lg">
              <Calendar class="h-5 w-5" />
              Book a Test Ride
            </Button>
          </motion.div>

          <motion.dl
            class="mx-auto mt-10 grid w-[90vw] max-w-md grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] sm:grid-cols-3 md:mt-12 md:w-[92%] md:max-w-none lg:mx-0 lg:mt-10 lg:w-auto lg:max-w-md"
            :initial="{ opacity: 0, y: 20 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: 1, duration: 0.5 }"
          >
            <div v-for="s in heroStats" :key="s.label" class="bg-brand-black/85 px-4 py-4 text-center backdrop-blur-sm lg:text-left">
              <dd class="font-heading text-2xl text-white sm:text-3xl">{{ s.value }}</dd>
              <dt class="mt-1 font-display text-[10px] font-semibold tracking-[0.18em] text-brand-grey uppercase">{{ s.label }}</dt>
            </div>
          </motion.dl>
        </motion.div>

        <!-- Desktop/tablet card (1024px+) -->
        <div
          class="relative hidden w-full lg:block lg:w-1/2 lg:h-[70vh]"
          @mouseenter="desktopHovered = true; paused = true"
          @mouseleave="desktopHovered = false; paused = false"
        >
          <motion.div
            class="relative h-full w-full"
            :initial="{ opacity: 0, y: 40, scale: 0.96 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{ duration: 0.7, ease: 'easeOut' }"
          >
            <div class="relative h-full w-full">
              <motion.div
                class="absolute inset-0 bg-black"
                :animate="{ x: desktopHovered ? 28 : 20, y: desktopHovered ? 28 : 20 }"
                :transition="{ duration: 0.35, ease: 'easeOut' }"
              />
              <motion.div
                class="relative h-full w-full border-[12px] border-[#E30613] overflow-hidden"
                :animate="{ y: desktopHovered ? -10 : 0 }"
                :transition="{ duration: 0.35, ease: 'easeOut' }"
              >
                <div class="relative h-full w-full overflow-hidden">
                  <img
                    v-for="(url, i) in bikeImageUrls"
                    :key="i"
                    :src="url"
                    class="absolute inset-0 h-full w-full object-cover transition-all duration-[350ms] ease-out"
                    :class="[i === currentImage ? 'opacity-100' : 'opacity-0', desktopHovered ? 'scale-[1.03]' : 'scale-100']"
                    :alt="`Bike ${i + 1}`"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </motion.div>
              <div class="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
                <button
                  v-for="(url, i) in bikeImageUrls"
                  :key="i"
                  class="h-2 transition-all duration-300"
                  :class="i === currentImage ? 'w-6 bg-[#E30613]' : 'w-2 bg-white/40 hover:bg-white/70'"
                  @click="currentImage = i"
                  :aria-label="`Go to slide ${i + 1}`"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0 z-20 border-t border-brand-grey/10 bg-brand-black/80 backdrop-blur-md">
      <div class="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
        <div
          ref="tickerRef"
          class="flex items-center whitespace-nowrap py-4"
          :class="tickerItems.length ? '' : 'justify-center'"
          @mouseenter="tickerPaused = true"
          @mouseleave="tickerPaused = false"
        >
          <div
            v-if="tickerItems.length"
            class="flex animate-marquee"
            :style="{ animationDuration: `${tickerDuration}s`, animationPlayState: tickerPaused ? 'paused' : 'running' }"
          >
            <div v-for="copy in 2" :key="copy" class="flex items-center gap-5 pr-5 sm:gap-8 sm:pr-8 lg:gap-14 lg:pr-14">
              <div
                v-for="bike in tickerItems"
                :key="bike.id"
                class="flex shrink-0 items-center gap-5 sm:gap-8 lg:gap-14"
              >
                <span class="font-display text-sm tracking-display text-white sm:text-base lg:text-lg">{{ bike.name }}</span>
                <span class="text-xs text-brand-grey sm:text-sm">{{ ccLabel(bike.engine_cc) }}</span>
                <span class="rounded-full border px-2.5 py-0.5 text-[9px] font-bold tracking-[0.14em] uppercase sm:text-[10px]" :class="badgeClass(bike)">
                  {{ badgeLabel(bike) }}
                </span>
                <span class="text-sm font-bold text-brand-red sm:text-base lg:text-lg">KSh {{ formatPrice(currentPrice(bike)) }}</span>
                <span class="h-4 w-px bg-brand-grey/20" />
              </div>
            </div>
          </div>
          <div v-else class="flex items-center gap-3 py-0.5">
            <span class="h-4 w-px bg-brand-red" />
            <span class="font-display text-sm tracking-display text-white/70 sm:text-base">New motorcycles arriving soon.</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { motion } from 'motion-v'
import { ArrowRight, Calendar } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'
import { useMediaQuery } from '@vueuse/core'

interface HeroImage { id: string; image: string; alt?: string; sort_order?: number; collectionId: string }
interface Bike { id: string; name: string; price: number }
interface PriceBike { id: string; price?: number; sale_price?: number }
interface TickerBike { id: string; name: string; engine_cc?: string; price: number; sale_price?: number; featured?: boolean; new_arrival?: boolean; status?: string }

const pb = usePB()
const isDesktop = useMediaQuery('(min-width: 1024px)')
const tickerRef = ref<HTMLElement | null>(null)
const tickerDuration = ref(0)
const tickerPaused = ref(false)

const heroImages = ref<HeroImage[]>([])
const currentImage = ref(0)
const paused = ref(false)
const desktopHovered = ref(false)

const fallbackImages = ['tekken.jpg', 'tekken-2.jpeg', 'tekken-3.jpg', 'taro.jpg', 'qj-motor.jpeg']

const bikeImageUrls = computed(() => {
  if (heroImages.value.length) return heroImages.value.map(h => pb.files.getURL(h, h.image, { thumb: '0x800' }))
  return fallbackImages.map(f => `/images/bikes/${f}`)
})

let interval: ReturnType<typeof setInterval> | null = null
function startAutoScroll() {
  if (interval) return
  interval = setInterval(() => {
    if (!paused.value && bikeImageUrls.value.length) {
      currentImage.value = (currentImage.value + 1) % bikeImageUrls.value.length
    }
  }, 4000)
}

function stopAutoScroll() {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

const featuredBikes = ref<Bike[]>([])
const tickerBikes = ref<TickerBike[]>([])
const lowestPrice = ref<number | null>(null)

const tickerItems = computed<TickerBike[]>(() => {
  const featured = tickerBikes.value.filter(b => b.featured)
  const arrivals = tickerBikes.value.filter(b => !b.featured && b.new_arrival)
  const inStock = tickerBikes.value.filter(b => !b.featured && !b.new_arrival)
  return [...featured, ...arrivals, ...inStock]
})

function badgeLabel(b: TickerBike): string {
  if (b.featured) return 'FEATURED'
  if (b.new_arrival) return 'NEW ARRIVAL'
  return 'IN STOCK'
}

function badgeClass(b: TickerBike): string {
  if (b.featured) return 'border-brand-red/40 bg-brand-red/10 text-brand-red'
  if (b.new_arrival) return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400'
  return 'border-white/15 bg-white/5 text-brand-grey'
}

function currentPrice(b: TickerBike): number {
  return (b.sale_price || b.price) ?? 0
}

function ccLabel(value?: string): string {
  if (!value) return '—'
  const s = String(value).trim()
  return /cc$/i.test(s) ? s : `${s}cc`
}

function measureTicker() {
  const t = tickerRef.value
  if (!t || !t.scrollWidth) return
  tickerDuration.value = Math.max(15, Math.round(t.scrollWidth / 2 / 50))
}

const heroStats = computed(() => {
  return [
    { label: 'Featured Models', value: featuredBikes.value.length },
    { label: 'Premium Brands', value: 12 },
    { label: 'From', value: lowestPrice.value != null ? `KSh ${lowestPrice.value.toLocaleString('en-KE')}` : 'N/A' },
  ]
})

function formatPrice(amount: number): string { return amount.toLocaleString('en-KE') }

async function loadHeroImages() {
  if (!isDesktop.value) return
  try {
    const records = await pb.collection('hero_images').getList<HeroImage>(1, 20, { filter: 'active = true', sort: 'sort_order', requestKey: 'hero-hero-images' })
    heroImages.value = records.items
  } catch {}
}

async function loadFeatured() {
  try {
    const records = await pb.collection('motorcycles').getList<Bike>(1, 8, { filter: 'featured = true && status = "available"', sort: '-created', requestKey: 'hero-featured' })
    featuredBikes.value = records.items.length ? records.items : []
  } catch {}
}

async function loadTicker() {
  try {
    const records = await pb.collection('motorcycles').getList<TickerBike>(1, 50, {
      filter: '(featured = true || new_arrival = true || status = "available") && status != "sold"',
      sort: 'sort_order, -created',
      requestKey: 'hero-ticker',
    })
    tickerBikes.value = records.items
  } catch { tickerBikes.value = [] }
}

async function loadLowestPrice() {
  try {
    const records = await pb.collection('motorcycles').getList<PriceBike>(1, 200, {
      filter: 'status = "available" && in_stock = true',
      sort: 'price',
      fields: 'id,price,sale_price',
      requestKey: 'hero-lowest-price',
    })
    let min: number | null = null
    for (const bike of records.items) {
      const selling = bike.sale_price || bike.price
      if (selling && (min === null || selling < min)) min = selling
    }
    lowestPrice.value = min
  } catch { lowestPrice.value = null }
}

let tickerObserver: ResizeObserver | null = null

onMounted(async () => {
  await Promise.all([loadHeroImages(), loadFeatured(), loadTicker(), loadLowestPrice()])
  if (isDesktop.value) startAutoScroll()
  await nextTick()
  measureTicker()
  if (tickerRef.value) {
    tickerObserver = new ResizeObserver(measureTicker)
    tickerObserver.observe(tickerRef.value)
  }
  pb.collection('hero_images').subscribe('*', () => loadHeroImages())
  pb.collection('motorcycles').subscribe('*', () => { loadFeatured(); loadTicker(); loadLowestPrice() })
})

watch(isDesktop, (desktop) => {
  if (desktop) {
    loadHeroImages()
    startAutoScroll()
  } else {
    stopAutoScroll()
  }
})

watch(tickerItems, () => { nextTick(measureTicker) })

onBeforeUnmount(() => {
  stopAutoScroll()
  tickerObserver?.disconnect()
  pb.collection('hero_images').unsubscribe('*')
  pb.collection('motorcycles').unsubscribe('*')
})
</script>

<style scoped>
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.animate-marquee { animation: marquee linear infinite; }
</style>
