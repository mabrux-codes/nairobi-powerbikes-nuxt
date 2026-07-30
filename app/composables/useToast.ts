interface ToastItem {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration: number
  createdAt: number
  remaining: number
  paused: boolean
}

const toasts = ref<ToastItem[]>([])
let counter = 0

export function useToast() {
  function add(toast: { type: ToastItem['type']; title: string; message?: string; duration?: number }) {
    const id = `toast-${++counter}`
    const item: ToastItem = {
      id,
      type: toast.type,
      title: toast.title,
      message: toast.message,
      duration: toast.duration ?? 4000,
      createdAt: Date.now(),
      remaining: toast.duration ?? 4000,
      paused: false,
    }
    toasts.value.unshift(item)
    scheduleRemove(item)
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
