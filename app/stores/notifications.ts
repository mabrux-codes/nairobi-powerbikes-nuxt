import { defineStore } from 'pinia'

export interface NotificationItem {
  id: string
  type: 'booking' | 'test_ride' | 'testimonial' | 'motorcycle' | 'user' | 'staff' | 'system' | 'media' | 'auth' | 'general'
  title: string
  message: string
  read: boolean
  createdAt: string
  link?: string
}

export const useNotificationStore = defineStore('notifications', () => {
  const notifications = ref<NotificationItem[]>([])
  const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

  function add(n: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>) {
    notifications.value.unshift({
      ...n,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString(),
    })
    persist()
  }

  function addFromPB(pbRec: { id: string; type: string; title: string; message: string; link?: string; read: boolean; created: string }) {
    const id = `notif-${pbRec.id}`
    if (notifications.value.some(n => n.id === id)) return
    notifications.value.unshift({
      id,
      type: pbRec.type as NotificationItem['type'],
      title: pbRec.title,
      message: pbRec.message,
      link: pbRec.link || '',
      read: pbRec.read,
      createdAt: pbRec.created,
    })
    persist()
  }

  function set(items: NotificationItem[]) {
    notifications.value = items
    persist()
  }

  function markRead(id: string) {
    const n = notifications.value.find(x => x.id === id)
    if (n) { n.read = true; persist() }
  }

  function markAllRead() {
    notifications.value.forEach(n => { n.read = true })
    persist()
  }

  function remove(id: string) {
    notifications.value = notifications.value.filter(x => x.id !== id)
    persist()
  }

  function clearAll() {
    notifications.value = []
    persist()
  }

  function persist() {
    if (import.meta.client) {
      localStorage.setItem('npb_notifications', JSON.stringify(notifications.value))
    }
  }

  function loadFromStorage() {
    if (import.meta.client) {
      try {
        const stored = localStorage.getItem('npb_notifications')
        if (stored) notifications.value = JSON.parse(stored)
      } catch { /* ignore */ }
    }
  }

  return {
    notifications,
    unreadCount,
    add,
    addFromPB,
    set,
    markRead,
    markAllRead,
    remove,
    clearAll,
    loadFromStorage,
  }
})
