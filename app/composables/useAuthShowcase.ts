import { usePB } from './usePocketBase'

interface ShowcaseSlide {
  id: string
  url: string
  name: string
  brand: string
}

const CYCLE_MS = 5000

export function useAuthShowcase() {
  const pb = usePB()
  const slides = ref<ShowcaseSlide[]>([])
  const currentIndex = ref(0)
  const loading = ref(true)
  let interval: ReturnType<typeof setInterval> | null = null

  const currentSlide = computed(() => slides.value[currentIndex.value] || null)

  function buildSlides(records: any[]): ShowcaseSlide[] {
    return records
      .filter((r) => Array.isArray(r.images) && r.images.length > 0)
      .map((r) => ({
        id: r.id,
        url: pb.files.getURL(r, r.images[0], { thumb: '1200x900' }),
        name: r.name,
        brand: typeof r.brand === 'string' ? r.brand : '',
      }))
  }

  async function load() {
    try {
      const records = await pb.collection('motorcycles').getList(1, 10, {
        filter: 'images != ""',
        sort: '-created',
        requestKey: 'auth-showcase',
      })
      slides.value = buildSlides(records.items)
      if (currentIndex.value >= slides.value.length) currentIndex.value = 0
    } catch {
      slides.value = []
    } finally {
      loading.value = false
    }
  }

  function advance() {
    if (slides.value.length < 2) return
    currentIndex.value = (currentIndex.value + 1) % slides.value.length
  }

  function start() {
    if (interval) return
    interval = setInterval(() => {
      if (document.visibilityState !== 'hidden') advance()
    }, CYCLE_MS)
  }

  function stop() {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  onMounted(async () => {
    await load()
    start()
    pb.collection('motorcycles').subscribe('*', () => load())
  })

  onBeforeUnmount(() => {
    stop()
    pb.collection('motorcycles').unsubscribe('*')
  })

  return { slides, currentIndex, currentSlide, loading }
}