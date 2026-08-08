<template>
  <section class="relative overflow-hidden border-y border-white/[0.06] bg-gradient-to-b from-brand-black via-[#141414] to-brand-black py-20">
    <div class="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
      <div class="mb-10 flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Just Landed"
          title="New"
          accent="Arrivals"
          description="The freshest machines on the showroom floor, updated live."
          align="left"
        />
        <div class="flex items-center gap-3 pb-1">
          <button
            class="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-200 hover:border-brand-red hover:bg-brand-red hover:shadow-lg hover:shadow-brand-red/25 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Scroll new arrivals left"
            :disabled="!canPrev"
            @click="prev"
          >
            <ChevronLeft class="h-5 w-5" />
          </button>
          <button
            class="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-all duration-200 hover:border-brand-red hover:bg-brand-red hover:shadow-lg hover:shadow-brand-red/25 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Scroll new arrivals right"
            :disabled="!canNext"
            @click="next"
          >
            <ChevronRight class="h-5 w-5" />
          </button>
          <Button to="/new-arrivals" variant="ghost" size="sm" trailing-arrow class="ml-2">View All</Button>
        </div>
      </div>

      <div v-if="loading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ShopSkeletonCard v-for="i in 4" :key="i" />
      </div>

      <div v-else-if="bikes.length" ref="trackRef" class="relative -mx-4 overflow-hidden sm:mx-0">
        <div
          ref="innerRef"
          class="flex gap-5 transition-transform duration-500 ease-out"
          :style="{ transform: `translateX(-${offset}px)` }"
        >
          <NuxtLink
            v-for="bike in extended"
            :key="bike.key"
            :to="bikePath(bike.item)"
            class="group relative block w-[82vw] shrink-0 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] sm:w-[46vw] lg:w-[30vw] xl:w-[22.5vw]"
          >
            <div class="relative aspect-[4/5] overflow-hidden bg-black">
              <img
                v-if="bike.item.images?.length"
                :src="pb.files.getURL(bike.item, bike.item.images[0], { thumb: '800x0' })"
                :alt="bike.item.name"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
              />
              <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10" />
              <div class="absolute left-3 top-3 flex flex-col items-start gap-1.5">
                <span class="rounded-full bg-brand-red px-3 py-1 text-[10px] font-bold tracking-[0.18em] text-white uppercase">New</span>
                <span v-if="bike.item.featured" class="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-brand-black uppercase">Featured</span>
              </div>
              <div class="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div>
                  <p class="text-[11px] font-semibold tracking-[0.2em] text-brand-grey uppercase">{{ bike.item.brand_name || bike.item.expand?.brand?.name || bike.item.type || 'Motorcycle' }}</p>
                  <h3 class="mt-0.5 font-display text-xl leading-snug font-bold tracking-display text-white">{{ bike.item.name }}</h3>
                </div>
                <p class="shrink-0 font-heading text-xl text-brand-red">{{ formatPrice(bike.item.sale_price || bike.item.price) }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>

      <div v-else class="rounded-2xl border border-dashed border-white/15 p-14 text-center">
        <PackageOpen class="mx-auto mb-4 h-10 w-10 text-brand-grey/50" />
        <p class="font-display text-2xl tracking-display text-brand-grey">No new arrivals yet</p>
        <p class="mt-2 text-sm text-brand-grey/60">We update this the moment new models hit the floor</p>
        <Button to="/motorcycles" variant="ghost" class="mt-5">Browse All Motorcycles</Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, PackageOpen } from 'lucide-vue-next'
import { usePB } from '~/composables/usePocketBase'

interface Bike { id: string; name: string; brand_name?: string; type?: string; price: number; sale_price?: number; images?: string[]; featured?: boolean; expand?: { brand?: { name?: string } } }

const pb = usePB()
const loading = ref(true)
const bikes = ref<Bike[]>([])
const trackRef = ref<HTMLElement | null>(null)
const innerRef = ref<HTMLElement | null>(null)
const offset = ref(0)
const cardStep = ref(0)

function bikePath(b: any) { return `/motorcycles/${b.slug || encodeURIComponent(b.name)}` }
function formatPrice(v: number) { return `KSh ${Number(v).toLocaleString('en-KE')}` }

const extended = computed(() => bikes.value.map((item, i) => ({ key: `${item.id}-${i}`, item })))

function measure() {
  if (!innerRef.value) return
  const first = innerRef.value.firstElementChild as HTMLElement | null
  cardStep.value = first ? first.getBoundingClientRect().width + 20 : 0
}

const maxOffset = computed(() => cardStep.value * Math.max(0, bikes.value.length - countVisible()))
const canPrev = computed(() => offset.value > 0)
const canNext = computed(() => offset.value < maxOffset.value)

function countVisible() {
  const w = innerRef.value?.clientWidth ?? 0
  return Math.max(1, Math.floor(w / cardStep.value))
}

function next() {
  offset.value = Math.min(maxOffset.value, offset.value + cardStep.value * countVisible())
}

function prev() {
  offset.value = Math.max(0, offset.value - cardStep.value * countVisible())
}

async function loadBikes() {
  try {
    const records = await pb.collection('motorcycles').getList<Bike>(1, 8, {
      filter: 'new_arrival=true && status="available"',
      sort: '-created',
      expand: 'brand',
      requestKey: 'home-new-arrivals',
    })
    bikes.value = records.items.map(b => ({ ...b, brand_name: (b as any).expand?.brand?.name || '' }))
  } catch { bikes.value = [] }
  finally { loading.value = false }
}

onMounted(async () => {
  await loadBikes()
  await nextTick()
  measure()
  window.addEventListener('resize', onResize)
  pb.collection('motorcycles').subscribe('*', () => loadBikes())
})

function onResize() {
  measure()
  offset.value = 0
}

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
  pb.collection('motorcycles').unsubscribe('*')
})
</script>