export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore()
  auth.loadFromStorage()

  if (to.path.startsWith('/dashboard') && !auth.isAuthenticated) return navigateTo('/login')
  const roles = to.meta.roles as string[] | undefined
  if (to.path.startsWith('/dashboard') && roles && auth.userRole && !roles.includes(auth.userRole)) return navigateTo('/dashboard')
  if ((to.path === '/login' || to.path === '/register') && auth.isAuthenticated) return navigateTo('/dashboard')
})
