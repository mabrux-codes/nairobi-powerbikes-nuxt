export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const auth = useAuthStore()
  auth.loadFromStorage()

  const onDashboard = to.path.startsWith('/dashboard')
  const onAuthPages = to.path === '/login' || to.path === '/register'

  // Suspended users can never enter the dashboard; refresh already fails at the
  // backend, this is a second line of defence.
  if (onDashboard && auth.isAuthenticated && auth.user?.status === 'inactive') {
    auth.clear()
    return navigateTo('/login?reason=suspended')
  }

  if (onDashboard && !auth.isAuthenticated) return navigateTo('/login')
  const roles = to.meta.roles as string[] | undefined
  if (onDashboard && roles && auth.userRole && !roles.includes(auth.userRole)) return navigateTo('/dashboard')

  // Staff invited via onboarding must set a password before using any tool.
  if (onDashboard && auth.mustChangePassword && to.path !== '/dashboard/change-password') {
    return navigateTo('/dashboard/change-password')
  }

  if (onAuthPages && auth.isAuthenticated) return navigateTo('/dashboard')
})