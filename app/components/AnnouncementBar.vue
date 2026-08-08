<template>
  <Transition name="announce">
    <div
      v-if="store.isEnabled"
      ref="barRef"
      data-announce-bar
      class="announce-bar"
      :aria-label="'Announcements'"
    >
      <div class="mx-auto flex h-full max-w-[90rem] items-center gap-3 px-4 sm:px-6 lg:px-8">
        <span class="flex shrink-0 items-center gap-2" aria-hidden="true">
          <span class="flex h-6 w-6 items-center justify-center rounded-full bg-brand-red/15">
            <Megaphone class="h-3.5 w-3.5 text-brand-red" />
          </span>
          <span class="hidden h-4 w-px bg-white/15 sm:block" />
        </span>

        <div ref="viewportRef" class="relative min-w-0 flex-1 overflow-hidden">
          <span ref="measureRef" class="ticker-measure" v-html="tickerHtml" aria-hidden="true" />
          <Transition name="announce-fade" mode="out-in">
            <div :key="tickerText" class="min-w-0">
              <div v-if="overflow" class="ticker-track" :style="{ animationDuration }">
                <span class="ticker-inner" v-html="tickerHtml" aria-hidden="true" />
                <span class="ticker-inner" v-html="tickerHtml" aria-hidden="true" />
              </div>
              <div v-else class="ticker-center" v-html="tickerHtml" />
            </div>
          </Transition>
        </div>
      </div>
      <div class="announce-accent" aria-hidden="true" />
    </div>
  </Transition>

  <!-- Screen-reader only summary -->
  <ul v-if="store.isEnabled" class="sr-only">
    <li v-for="a in store.visibleAnnouncements" :key="a.id">{{ [a.icon, a.title, a.message].filter(Boolean).join(' — ') }}</li>
  </ul>
</template>

<script setup lang="ts">
import { Megaphone } from 'lucide-vue-next'
import { useAnnouncementsStore } from '~/stores/announcements'
import { sanitizeHtml } from '~/composables/useSanitize'

const store = useAnnouncementsStore()

const barRef = ref<HTMLElement | null>(null)
const viewportRef = ref<HTMLElement | null>(null)
const measureRef = ref<HTMLElement | null>(null)
const overflow = ref(false)
const measureWidth = ref(0)

const tickerHtml = computed(() => {
  const segments = store.visibleAnnouncements.map((a) => {
    const icon = a.icon ? `<span class="announce-icon">${escapeHtml(a.icon)}</span>` : ''
    return `<span class="announce-seg">${icon}${sanitizeHtml(a.message || a.title)}</span>`
  })
  return segments.join('<span class="announce-sep" aria-hidden="true"> • </span>')
})

const tickerText = computed(() =>
  store.visibleAnnouncements.map(a => `${a.icon} ${a.message} ${a.title}`).join(' • '),
)

const animationDuration = computed(() => `${Math.max(14, Math.round((measureWidth.value || 400) / 60))}s`)

function measure() {
  const mw = measureRef.value?.offsetWidth || 0
  const vw = viewportRef.value?.clientWidth || 0
  measureWidth.value = mw
  overflow.value = mw > 0 && mw > vw
}

function syncHeaderHeight() {
  const h = barRef.value ? barRef.value.offsetHeight : 0
  document.documentElement.style.setProperty('--announce-h', `${h}px`)
  window.dispatchEvent(new Event('announce:resize'))
}

function onTickerClick(e: MouseEvent) {
  const target = (e.target as HTMLElement).closest?.('a') as HTMLAnchorElement | null
  if (!target) return
  const href = target.getAttribute('href') || ''
  if (href.startsWith('/')) {
    e.preventDefault()
    navigateTo(href)
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

let ro: ResizeObserver | null = null

onMounted(() => {
  store.init()
  watch(
    [() => store.isEnabled, tickerText],
    async () => {
      await nextTick()
      measure()
      syncHeaderHeight()
    },
    { immediate: true },
  )
  ro = new ResizeObserver(() => { measure(); syncHeaderHeight() })
  if (viewportRef.value) ro.observe(viewportRef.value)
  if (barRef.value) ro.observe(barRef.value)
  window.addEventListener('resize', measure)
})

onUnmounted(() => {
  ro?.disconnect()
  window.removeEventListener('resize', measure)
  document.documentElement.style.setProperty('--announce-h', '0px')
})
</script>

<style scoped>
.announce-bar {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 60;
  height: 44px;
  background: #0A0A0A;
  color: #fff;
  box-shadow: 0 10px 28px -14px rgba(0, 0, 0, 0.65);
  overflow: hidden;
}
@media (min-width: 640px) {
  .announce-bar { height: 48px; }
}
.announce-accent {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, #D6001C, rgba(214, 0, 28, 0.4), transparent);
}

.ticker-measure {
  position: absolute;
  left: -99999px;
  top: 0;
  visibility: hidden;
  white-space: nowrap;
}

.ticker-track {
  display: inline-flex;
  white-space: nowrap;
  will-change: transform;
  animation: ticker-scroll linear infinite;
}
.ticker-track:hover {
  animation-play-state: paused;
}
.ticker-inner {
  display: inline-block;
  padding-right: 2.5rem;
}
.ticker-center {
  display: flex;
  justify-content: center;
  white-space: nowrap;
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.announce-seg {
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.95);
}
.announce-icon {
  margin-right: 0.35rem;
}
.announce-sep {
  margin-inline: 0.75rem;
  color: #D6001C;
  font-weight: 700;
}
.announce-seg a {
  color: #D6001C;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 2px;
}
.announce-seg a:hover {
  color: #fff;
}

@keyframes ticker-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .ticker-track { animation: none !important; }
}

.announce-enter-active, .announce-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.announce-enter-from { opacity: 0; transform: translateY(-100%); }
.announce-leave-to { opacity: 0; transform: translateY(-100%); }

.announce-fade-enter-active, .announce-fade-leave-active { transition: opacity 0.25s ease; }
.announce-fade-enter-from, .announce-fade-leave-to { opacity: 0; }
</style>
