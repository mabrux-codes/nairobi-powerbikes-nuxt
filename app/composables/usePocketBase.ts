import PocketBase from 'pocketbase'
import { useAuthStore } from '~/stores/auth'

let pbInstance: PocketBase | null = null

function syncPiniaStore() {
  try {
    const auth = useAuthStore()
    const model = pbInstance?.authStore?.model
    if (model) {
      auth.setUser(model as any)
    } else {
      auth.clear()
    }
  } catch {}
}

export function getPB(): PocketBase {
  if (!pbInstance) {
    const config = useRuntimeConfig()
    const url = config.public.pocketBaseUrl as string
    pbInstance = new PocketBase(url)

    if (import.meta.client) {
      pbInstance.authStore.onChange(() => {
        try {
          localStorage.setItem('pb_auth', JSON.stringify({
            token: pbInstance.authStore.token,
            model: pbInstance.authStore.model,
          }))
        } catch {}
        document.cookie = pbInstance.authStore.exportToCookie('pb_auth')
        syncPiniaStore()
      })

      const stored = localStorage.getItem('pb_auth')
      if (stored && !pbInstance.authStore.token) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed.token) {
            pbInstance.authStore.save(parsed.token, parsed.model)
            pbInstance.collection('users').authRefresh().catch(() => {
              pbInstance.authStore.clear()
              localStorage.removeItem('pb_auth')
              document.cookie = 'pb_auth=; path=/; max-age=0'
              syncPiniaStore()
            })
          }
        } catch {}
      }

      syncPiniaStore()
    }
  }

  return pbInstance
}

export function usePB() {
  return getPB()
}

export function pbImageUrl(record: { collectionId?: string; id: string }, filename: string): string {
  const config = useRuntimeConfig()
  const baseUrl = config.public.pocketBaseUrl as string
  return `${baseUrl}/api/files/${record.collectionId}/${record.id}/${filename}`
}
