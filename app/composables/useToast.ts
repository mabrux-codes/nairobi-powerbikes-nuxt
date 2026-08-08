export type ToastType =
  | 'success' | 'error' | 'warning' | 'info'
  | 'booking' | 'test_ride' | 'contact' | 'user' | 'motorcycle' | 'stock' | 'gear' | 'system'

export interface ToastItem {
  id: string
  key?: string
  type: ToastType
  title: string
  message?: string
  to?: string
  duration: number
  createdAt: number
  remaining: number
  paused: boolean
}

const toasts = ref<ToastItem[]>([])
let counter = 0

export interface ToastInput {
  type: ToastType
  title: string
  message?: string
  to?: string
  duration?: number
  key?: string
}

export function useToast() {
  function add(t: ToastInput) {
    // Exactly one toast per event: if the caller supplied a dedupe key
    // (e.g. a PocketBase record id) and it is still on screen, skip.
    if (t.key && toasts.value.some(x => x.key === t.key)) return

    const id = `toast-${++counter}`
    const item: ToastItem = {
      id,
      key: t.key,
      type: t.type,
      title: t.title,
      message: t.message,
      to: t.to,
      duration: t.duration ?? 6000,
      createdAt: Date.now(),
      remaining: t.duration ?? 6000,
      paused: false,
    }
    toasts.value.unshift(item)
    if (toasts.value.length > 6) toasts.value.pop()
    scheduleRemove(item)

    if (import.meta.client) {
      const audio = useAudio()
      if (t.type === 'success' || t.type === 'info') audio.playSuccess()
      else if (t.type === 'error' || t.type === 'warning') audio.playError()
    }
  }

  function scheduleRemove(item: ToastItem) {
    setTimeout(() => {
      if (!item.paused) remove(item.id)
    }, item.remaining)
  }

  function remove(id: string) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx > -1) toasts.value.splice(idx, 1)
  }

  function pause(id: string) {
    const t = toasts.value.find(t => t.id === id)
    if (t) {
      t.paused = true
      t.remaining -= Date.now() - t.createdAt
    }
  }

  function resume(id: string) {
    const t = toasts.value.find(t => t.id === id)
    if (t) {
      t.paused = false
      t.createdAt = Date.now()
      scheduleRemove(t)
    }
  }

  return { toasts, add, remove, pause, resume }
}