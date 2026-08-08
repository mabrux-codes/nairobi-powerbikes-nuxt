import { defineStore } from 'pinia'
import {
  isRememberExpired,
  purgePersistentAuth,
  persistUserCache,
  readUserCache,
} from '~/utils/authSession'

interface PBUser {
  id: string
  email: string
  name?: string
  avatar?: string
  role: string
  branch?: string
  status: string
  availability: string
  soundEnabled?: boolean
  email_notifications?: boolean
  sms_notifications?: boolean
  collectionId?: string
  collectionName?: string
  expand?: Record<string, any>
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<PBUser | null>(null)
  const isAuthenticated = computed(() => !!user.value)
  const userRole = computed(() => user.value?.role || null)
  const isAdmin = computed(() => userRole.value === 'admin')
  const isCustomer = computed(() => userRole.value === 'customer')

  function setUser(u: PBUser | null) {
    user.value = u
    if (import.meta.client) {
      persistUserCache(u)
    }
  }

  function loadFromStorage() {
    if (import.meta.client) {
      if (isRememberExpired()) {
        purgePersistentAuth()
        user.value = null
        return
      }
      user.value = readUserCache()
    }
  }

  function clear() {
    user.value = null
    if (import.meta.client) {
      persistUserCache(null)
    }
  }

  function getDashboardRoute() {
    if (!user.value) return '/login'
    return '/dashboard'
  }

  return {
    user,
    isAuthenticated,
    userRole,
    isAdmin,
    isCustomer,
    setUser,
    loadFromStorage,
    clear,
    getDashboardRoute,
  }
})