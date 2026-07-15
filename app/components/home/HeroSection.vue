<template>
  <section class="relative h-screen w-full overflow-hidden">
    <!-- Background image for mobile/tablet -->
    <div class="absolute inset-0 lg:hidden">
      <img
        v-for="(url, i) in bikeImageUrls"
        :key="i"
        :src="url"
        class="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        :class="i === currentImage ? 'opacity-100' : 'opacity-0'"
        :alt="`Bike ${i + 1}`"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-brand-black/70 via-brand-black/50 to-brand-black/80" />
    </div>

    <div class="asphalt-grid absolute inset-0 bg-brand-black max-lg:hidden" />

    <div class="relative z-10 mx-auto flex h-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
      <div class="flex flex-1 flex-col items-center justify-center gap-8 text-center lg:flex-row lg:text-left lg:items-center">
        <motion.div
          class="z-20 w-full lg:w-1/2 lg:pr-12"
          :initial="{ opacity: 0, x: -60 }"
          :animate="{ opacity: 1, x: 0 }"
          :transition="{ duration: 0.8, ease: 'easeOut' }"
        >
          <motion.p
            class="mb-2 font-display text-sm tracking-[0.3em] text-red-400 lg:text-brand-red"
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
            <NuxtLink to="/motorcycles" class="btn-primary">
              <ArrowRight class="h-5 w-5" />
              Browse Motorcycles
            </NuxtLink>
            <NuxtLink to="/service/test-ride" class="btn-secondary">
              <Calendar class="h-5 w-5" />
              Book a Test Ride
            </NuxtLink>
          </motion.div>
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

    <!-- Mobile/tablet dots -->
    <div class="absolute bottom-32 left-1/2 z-20 flex -translate-x-1/2 gap-2 lg:hidden">
      <button
        v-for="(url, i) in bikeImageUrls"
        :key="i"
        class="h-2 rounded-full transition-all duration-300"
        :class="i === currentImage ? 'w-6 bg-brand-red' : 'w-2 bg-white/40 hover:bg-white/70'"
        @click="currentImage = i"
        :aria-label="`Go to slide ${i + 1}`"
      />
    </div>

    <div class="absolute bottom-0 left-0 right-0 z-20 border-t border-brand-grey/10 bg-brand-black/80 backdrop-blur-md">
      <div class="mx-auto max-w-7xl overflow-hidden px-4 sm:px-6 lg:px-8">
        <div class="flex whitespace-nowrap py-4" ref="tickerRef">
          <div class="flex animate-marquee gap-16" :style="{ animationDuration: `${tickerDuration}s` }">
            <div v-for="(bike, i) in [...featuredBikes, ...featuredBikes]" :key="`${bike.name}-${i}`" class="flex items-center gap-6">
              <span class="font-display text-lg tracking-display text-white">{{ bike.name }}</span>
              <span class="text-sm text-brand-grey">{{ bike.cc }}cc</span>
              <span class="h-4 w-px bg-brand-grey/20" />
              <span class="font-display text-lg text-brand-red">KSh {{ formatPrice(bike.price) }}</span>
              <span class="h-4 w-px bg-brand-grey/20" />
            </div>
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

interface HeroImage { id: string; image: string; alt?: string; sort_order?: number; collectionId: string }
interface Bike { id: string; name: string; cc: number; price: number }

const pb = usePB()
const tickerRef = ref<HTMLElement | null>(null)
const tickerDuration = ref(30)

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
  interval = setInterval(() => {
    if (!paused.value && bikeImageUrls.value.length) {
      currentImage.value = (currentImage.value + 1) % bikeImageUrls.value.length
    }
  }, 4000)
}

const featuredBikes = ref<Bike[]>([])

function formatPrice(amount: number): string { return amount.toLocaleString('en-KE') }

async function loadHeroImages() {
  try {
    const records = await pb.collection('hero_images').getList<HeroImage>(1, 20, { filter: 'active = true', sort: 'sort_order' })
    heroImages.value = records.items
  } catch {}
}

async function loadFeatured() {
  try {
    const records = await pb.collection('motorcycles').getList<Bike>(1, 8, { filter: 'featured = true && status = "available"', sort: '-created' })
    featuredBikes.value = records.items.length ? records.items : []
  } catch {}
  if (featuredBikes.value.length <= 3) tickerDuration.value = 20
}

onMounted(async () => {
  await Promise.all([loadHeroImages(), loadFeatured()])
  startAutoScroll()
  pb.collection('hero_images').subscribe('*', () => loadHeroImages())
  pb.collection('motorcycles').subscribe('*', () => loadFeatured())
})

onBeforeUnmount(() => {
  if (interval) clearInterval(interval)
  pb.collection('hero_images').unsubscribe('*')
  pb.collection('motorcycles').unsubscribe('*')
})
</script>

<style scoped>
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
.animate-marquee { animation: marquee linear infinite; }

</style>
