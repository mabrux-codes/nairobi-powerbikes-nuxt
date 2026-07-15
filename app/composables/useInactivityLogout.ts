import { useAuthStore } from '~/stores/auth'
import { getPB } from './usePocketBase'

const INACTIVITY_TIMEOUT = 15 * 60 * 1000
const WARNING_TIMEOUT = 14 * 60 * 1000

let inactivityTimer: ReturnType<typeof setTimeout> | null = null

export function useInactivityLogout() {
  const auth = useAuthStore()
  const pb = getPB()
  const router = useRouter()
  const showWarning = ref(false)
  const warningCountdown = ref(60)
  let countdownTimer: ReturnType<typeof setInterval> | null = null

  function resetTimer() {
    if (inactivityTimer) clearTimeout(inactivityTimer)
    inactivityTimer = setTimeout(showWarningModal, WARNING_TIMEOUT)
  }

  function showWarningModal() {
    if (!auth.isAuthenticated) return
    showWarning.value = true
    warningCountdown.value = 60
    countdownTimer = setInterval(() => {
      warningCountdown.value--
      if (warningCountdown.value <= 0) {
        forceLogout()
      }
    }, 1000)
    inactivityTimer = setTimeout(forceLogout, INACTIVITY_TIMEOUT - WARNING_TIMEOUT)
  }

  function forceLogout() {
    if (countdownTimer) clearInterval(countdownTimer)
    countdownTimer = null
    showWarning.value = false
    pb.authStore.clear()
    auth.clear()
    router.push('/login')
  }

  function stayLoggedIn() {
    if (countdownTimer) clearInterval(countdownTimer)
    countdownTimer = null
    showWarning.value = false
    if (inactivityTimer) clearTimeout(inactivityTimer)
    resetTimer()
  }

  function setupListeners() {
    if (!import.meta.client) return
    const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove']
    const handler = () => resetTimer()
    events.forEach(e => window.addEventListener(e, handler, { passive: true }))
    resetTimer()
    onBeforeUnmount(() => {
      events.forEach(e => window.removeEventListener(e, handler))
      if (inactivityTimer) clearTimeout(inactivityTimer)
      if (countdownTimer) clearInterval(countdownTimer)
    })
  }

  return { showWarning, warningCountdown, setupListeners, stayLoggedIn, forceLogout }
}
