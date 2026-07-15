import { useAuthStore } from '~/stores/auth'
import { getPB } from './usePocketBase'

export function useAuth() {
  const auth = useAuthStore()
  const pb = getPB()
  const router = useRouter()

  async function login(email: string, password: string) {
    const result = await pb.collection('users').authWithPassword(email, password)
    auth.setUser(result.record as any)
    return result
  }

  async function register(email: string, password: string, data: any) {
    const record = await pb.collection('users').create({
      email,
      password,
      passwordConfirm: password,
      ...data,
      role: 'customer',
      availability: 'online',
    })
    return record
  }

  async function logout() {
    pb.authStore.clear()
    auth.clear()
    await router.push('/')
  }

  return { login, register, logout }
}
