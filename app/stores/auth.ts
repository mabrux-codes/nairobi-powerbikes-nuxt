import { defineStore } from 'pinia'

interface PBUser {
  id: string
  email: string
  name?: string
  avatar?: string
  role: string
  branch?: string
  status: string
  availability: string
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
      localStorage.setItem('auth_user', u ? JSON.stringify(u) : '')
    }
  }

  function loadFromStorage() {
    if (import.meta.client) {
      const stored = localStorage.getItem('auth_user')
      if (stored) {
        try {
          user.value = JSON.parse(stored)
        } catch {
          localStorage.removeItem('auth_user')
        }
      }
    }
  }

  function clear() {
    user.value = null
    if (import.meta.client) {
      localStorage.removeItem('auth_user')
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
