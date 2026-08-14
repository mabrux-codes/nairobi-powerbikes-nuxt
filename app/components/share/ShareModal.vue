<template>
  <Teleport to="body">
    <Transition name="share" appear>
      <div
        v-if="open"
        class="fixed inset-0 z-[150] flex items-end justify-center md:items-center md:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-modal-title"
        @keydown.esc="close"
      >
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" @click="close" />

        <div
          ref="panelRef"
          class="share-panel relative flex max-h-[92dvh] w-full flex-col overflow-hidden border border-white/10 bg-brand-black/95 shadow-2xl shadow-black/70 backdrop-blur-xl md:max-h-[85dvh] md:max-w-lg md:rounded-2xl rounded-t-3xl"
        >
          <!-- Mobile grab handle -->
          <div class="flex shrink-0 justify-center pt-3 md:hidden" aria-hidden="true">
            <span class="h-1 w-10 rounded-full bg-white/15" />
          </div>

          <!-- Header -->
          <div class="flex shrink-0 items-start justify-between gap-4 px-5 pt-4 pb-3 sm:px-6 md:pt-5">
            <div class="min-w-0">
              <p class="text-[11px] font-display font-bold uppercase tracking-[0.24em] text-brand-red">Share</p>
              <h2 id="share-modal-title" class="mt-1 font-heading text-2xl leading-tight text-white">Share this page</h2>
              <p class="mt-1 text-sm text-brand-grey">Share this with someone who might be interested.</p>
            </div>
            <button
              class="-mr-2 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-brand-grey/60 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
              :aria-label="'Close share dialog'"
              @click="close"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 sm:px-6">
            <!-- Content preview -->
            <div v-if="data" class="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3">
              <div class="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-brand-red/15 via-white/[0.03] to-transparent sm:h-24 sm:w-36">
                <img
                  v-if="previewImage"
                  :src="previewImage"
                  :alt="''"
                  class="h-full w-full object-cover"
                  loading="lazy"
                  @error="imgError = true"
                />
                <div v-else class="flex h-full w-full items-center justify-center">
                  <component :is="previewFallbackIcon" class="h-7 w-7 text-brand-red/40" :stroke-width="1.5" aria-hidden="true" />
                </div>
              </div>
              <div class="min-w-0">
                <p class="line-clamp-2 font-display text-sm font-semibold leading-snug text-white">{{ data.title }}</p>
                <p class="mt-1.5 flex items-center gap-1.5 text-xs text-brand-grey">
                  <Bike class="h-3.5 w-3.5 text-brand-red" aria-hidden="true" />Nairobi Powerbikes
                </p>
              </div>
            </div>

            <!-- Share link -->
            <div v-if="data" class="mt-5">
              <p class="text-[11px] font-display font-bold uppercase tracking-[0.2em] text-brand-grey">Share link</p>
              <div class="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2.5 focus-within:border-brand-red/40">
                <Link2 class="h-4 w-4 shrink-0 text-brand-red" aria-hidden="true" />
                <span class="min-w-0 flex-1 truncate font-mono text-xs text-brand-grey" :title="data.url">{{ data.url }}</span>
                <button
                  class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-brand-grey transition-colors hover:border-brand-red/50 hover:text-brand-red focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                  :aria-label="`Copy link ${data.url}`"
                  @click="copyLink"
                >
                  <Check v-if="copied" class="h-4 w-4 text-emerald-400" aria-hidden="true" />
                  <Copy v-else class="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <Button variant="primary" size="md" class="mt-2.5 w-full" :aria-label="copied ? 'Link copied' : 'Copy link to clipboard'" @click="copyLink">
                <Check v-if="copied" class="h-4 w-4" aria-hidden="true" />
                <Copy v-else class="h-4 w-4" aria-hidden="true" />
                {{ copied ? 'Copied' : 'Copy Link' }}
              </Button>
              <p v-if="copyFailed" class="mt-2 text-xs leading-relaxed text-red-400">
                Copying failed. You can manually select the link above and copy it.
              </p>
            </div>

            <!-- Social platforms -->
            <div class="mt-6">
              <p class="text-[11px] font-display font-bold uppercase tracking-[0.2em] text-brand-grey">Share via</p>
              <div class="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <button
                  v-for="p in platforms"
                  :key="p.id"
                  class="group flex min-w-0 flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-2 py-3.5 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
                  :style="p.brand ? { '--brand': p.brand } : undefined"
                  :aria-label="p.label"
                  @click="onPlatformClick(p)"
                >
                  <svg v-if="p.svg" viewBox="0 0 24 24" class="h-5 w-5 text-white/80 transition-colors duration-200 group-hover:text-[var(--brand)]" :aria-hidden="true">
                    <path :d="p.svg" fill="currentColor" />
                  </svg>
                  <Mail v-else-if="p.lucide === 'Mail'" class="h-5 w-5 text-white/80 transition-colors duration-200 group-hover:text-brand-red" :aria-hidden="true" />
                  <span class="truncate text-[11px] font-medium text-brand-grey transition-colors duration-200 group-hover:text-white">{{ p.name }}</span>
                </button>
              </div>
            </div>

            <!-- Native share sheet (when the browser supports it) -->
            <button
              v-if="nativeAvailable"
              class="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 py-2.5 text-xs font-medium text-brand-grey transition-colors hover:border-brand-red/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/60"
              :aria-label="'Open the system share sheet'"
              @click="shareNative"
            >
              <Share2 class="h-3.5 w-3.5 text-brand-red" aria-hidden="true" />
              Use system share options
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Bike, Copy, Check, Link2, Mail, Share2, Newspaper, Package, Shirt, Wrench, CalendarClock, Globe } from 'lucide-vue-next'
import { useToast } from '~/composables/useToast'
import {
  SHARE_PLATFORMS,
  platformShareUrl,
  copyText,
  canNativeShare,
  nativeShare,
  openSharePopup,
  type SharePlatform,
} from '~/utils/share'

const { state, close } = useShare()
const toast = useToast()

const open = computed(() => state.value.open)
const data = computed(() => state.value.data)

const copied = ref(false)
const copyFailed = ref(false)
const imgError = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null
let failureTimer: ReturnType<typeof setTimeout> | null = null

const platforms = SHARE_PLATFORMS
const nativeAvailable = computed(() => import.meta.client && canNativeShare())

const previewImage = computed(() => {
  if (imgError.value || !data.value?.image) return ''
  return data.value.image
})

const previewFallbackIcon = computed(() => {
  const type = data.value?.type
  if (type === 'blog') return Newspaper
  if (type === 'accessory') return Package
  if (type === 'apparel') return Shirt
  if (type === 'service') return Wrench
  if (type === 'test-ride') return CalendarClock
  if (type === 'motorcycle') return Bike
  return Globe
})

function resetTimers() {
  if (copyTimer) clearTimeout(copyTimer)
  if (failureTimer) clearTimeout(failureTimer)
  copyTimer = null
  failureTimer = null
}

watch(open, (o) => {
  resetTimers()
  if (o) {
    copied.value = false
    copyFailed.value = false
    imgError.value = false
    if (document.activeElement instanceof HTMLElement) lastFocused = document.activeElement
    document.body.style.overflow = 'hidden'
    nextTick(() => {
      const first = panelRef.value?.querySelector<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      first?.focus()
    })
  } else {
    document.body.style.overflow = ''
    restoreFocus()
  }
})

// Focus trap while the modal is open
const panelRef = ref<HTMLElement | null>(null)
let lastFocused: HTMLElement | null = null

function trapFocus(e: KeyboardEvent) {
  if (!open.value || !panelRef.value) return
  if (e.key === 'Tab') {
    const focusable = panelRef.value.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    if (!focusable.length) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
  }
}

function restoreFocus() {
  try { lastFocused?.focus() } catch { /* ignore */ }
  lastFocused = null
}

async function copyLink() {
  if (!data.value) return
  const ok = await copyText(data.value.url)
  resetTimers()
  if (ok) {
    copied.value = true
    toast.add({ type: 'success', title: 'Link copied', message: 'Share link copied to clipboard.' })
    copyTimer = setTimeout(() => { copied.value = false }, 2000)
  } else {
    copyFailed.value = true
    toast.add({
      type: 'error',
      title: 'Could not copy link',
      message: 'Copying failed. You can manually select the link and copy it.',
    })
    failureTimer = setTimeout(() => { copyFailed.value = false }, 4000)
  }
}

async function shareInstagram() {
  if (!data.value) return
  // Honest Instagram handling: Instagram has no public web URL-share endpoint.
  // Prefer the native share sheet when available, otherwise copy the link and
  // point the user at Instagram so they can paste it.
  if (canNativeShare()) {
    const result = await nativeShare(data.value)
    if (result === 'shared') close()
    else if (result === 'cancelled') return
    else { /* failed → fall through to clipboard */ }
  }
  const ok = await copyText(data.value.url)
  if (ok) {
    toast.add({ type: 'info', title: 'Link copied', message: 'Link copied. Paste it into Instagram.' })
    openSharePopup('https://www.instagram.com/')
  } else {
    toast.add({ type: 'error', title: 'Could not copy link', message: 'Copying failed. You can manually select the link and copy it.' })
  }
}

function onPlatformClick(p: SharePlatform) {
  if (!data.value) return
  if (p.id === 'instagram') { shareInstagram(); return }
  const url = platformShareUrl(p.id, data.value)
  if (!url) return
  const opened = openSharePopup(url)
  if (!opened) {
    toast.add({ type: 'warning', title: 'Popup blocked', message: 'Allow popups for this site to open the share window, or copy the link instead.' })
  }
}

async function shareNative() {
  if (!data.value) return
  const result = await nativeShare(data.value)
  if (result === 'shared') close()
  else if (result === 'failed') {
    toast.add({ type: 'error', title: 'Sharing unavailable', message: 'The system share sheet is not available on this device.' })
  }
  // cancelled → no-op, per spec
}

onMounted(() => {
  document.addEventListener('keydown', trapFocus)
})
onUnmounted(() => {
  document.removeEventListener('keydown', trapFocus)
  resetTimers()
  document.body.style.overflow = ''
})
</script>

<style scoped>
.share-enter-active .share-panel {
  transition: transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.25s ease;
}
.share-leave-active .share-panel {
  transition: transform 0.18s ease-in, opacity 0.18s ease-in;
}
.share-enter-from .share-panel,
.share-leave-to .share-panel {
  transform: translateY(100%);
  opacity: 0;
}
.share-enter-active,
.share-leave-active {
  transition: opacity 0.25s ease;
}
.share-enter-from,
.share-leave-to {
  opacity: 0;
}
@media (min-width: 768px) {
  .share-enter-from .share-panel,
  .share-leave-to .share-panel {
    transform: translateY(24px) scale(0.96);
  }
}
@media (prefers-reduced-motion: reduce) {
  .share-enter-active,
  .share-leave-active,
  .share-enter-active .share-panel,
  .share-leave-active .share-panel {
    transition: none !important;
  }
}
</style>
