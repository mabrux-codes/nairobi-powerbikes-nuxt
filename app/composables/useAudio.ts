import { useAuthStore } from '~/stores/auth'

// Central audio notification service.
// - Lazy-loads and reuses a single Audio instance per sound (no repeated new Audio()).
// - Coalesces rapid requests so sounds never overlap.
// - Respects the per-user sound preference (falling back to a guest localStorage flag).
// - Unlocks playback after the first user interaction (mobile autoplay rules).
// - Default volume 70% (exposed for a future volume slider).

const SUCCESS_SRC = '/audio/green.mp3'
const ERROR_SRC = '/audio/red.mp3'
const LOGIN_SRC = '/audio/applepay.mp3'
const LS_KEY = 'npb_sound_enabled'
const DEFAULT_VOLUME = 0.7
const THROTTLE_MS = 600

export type SoundKind = 'success' | 'error' | 'login'

let successEl: HTMLAudioElement | null = null
let errorEl: HTMLAudioElement | null = null
let loginEl: HTMLAudioElement | null = null
let unlocked = false
let volume = DEFAULT_VOLUME
let lastPlayAt = 0
let pendingKind: SoundKind | null = null
let pendingTimer: ReturnType<typeof setTimeout> | null = null

function audioEl(src: string): HTMLAudioElement {
  const a = new Audio(src)
  a.preload = 'none'
  a.volume = volume
  return a
}

function getEl(kind: SoundKind): HTMLAudioElement | null {
  if (kind === 'success') {
    if (!successEl) successEl = audioEl(SUCCESS_SRC)
    return successEl
  }
  if (kind === 'error') {
    if (!errorEl) errorEl = audioEl(ERROR_SRC)
    return errorEl
  }
  if (!loginEl) loginEl = audioEl(LOGIN_SRC)
  return loginEl
}

function soundEnabled(): boolean {
  try {
    const auth = useAuthStore()
    if (auth.isAuthenticated) return auth.user?.soundEnabled !== false
  } catch { /* pinia not ready yet */ }
  try {
    return localStorage.getItem(LS_KEY) !== 'false'
  } catch {
    return true
  }
}

function doPlay(kind: SoundKind) {
  const el = getEl(kind)
  if (!el) return
  try {
    el.volume = volume
    el.currentTime = 0
    const p = el.play()
    if (p) p.catch(() => { /* autoplay still blocked */ })
  } catch { /* ignore */ }
}

function requestPlay(kind: SoundKind) {
  if (!soundEnabled()) return
  if (!unlocked) return
  const now = Date.now()
  const elapsed = now - lastPlayAt
  if (elapsed >= THROTTLE_MS) {
    lastPlayAt = now
    doPlay(kind)
  } else {
    // coalesce rapid requests into a single trailing play
    if (pendingTimer) clearTimeout(pendingTimer)
    pendingKind = kind
    pendingTimer = setTimeout(() => {
      pendingTimer = null
      lastPlayAt = Date.now()
      doPlay(kind)
      pendingKind = null
    }, THROTTLE_MS - elapsed)
  }
}

function unlock() {
  unlocked = true
  try {
    if (successEl) successEl.preload = 'auto'
    if (errorEl) errorEl.preload = 'auto'
  } catch { /* ignore */ }
  document.removeEventListener('pointerdown', unlock)
  document.removeEventListener('keydown', unlock)
  document.removeEventListener('touchstart', unlock)
  document.removeEventListener('visibilitychange', unlock)
}

export function useAudio() {
  function playSuccess() { requestPlay('success') }
  function playError() { requestPlay('error') }
  function playLogin() { requestPlay('login') }
  function setVolume(v: number) { volume = Math.min(1, Math.max(0, v)) }

  return { playSuccess, playError, playLogin, setVolume }
}

// Register the autoplay-unlock listeners at module load (app boot) so the very
// first interaction unlocks playback, before any sound is requested.
if (import.meta.client) {
  document.addEventListener('pointerdown', unlock)
  document.addEventListener('keydown', unlock)
  document.addEventListener('touchstart', unlock)
  // Also unlock once the tab is visible even without interaction (desktop).
  document.addEventListener('visibilitychange', unlock)
}
