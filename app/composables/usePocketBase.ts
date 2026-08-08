import PocketBase, { BaseAuthStore, type AuthRecord } from 'pocketbase'
import { useAuthStore } from '~/stores/auth'
import {
  isRememberExpired,
  purgePersistentAuth,
  persistAuthPayload,
  readAuthPayload,
  purgeAllAuth,
} from '~/utils/authSession'

let pbInstance: PocketBase | null = null

function syncPiniaStore() {
  try {
    const auth = useAuthStore()
    const model = pbInstance?.authStore?.model
    auth.setUser(model as any ?? null)
  } catch {}
}

/**
 * Auth store that persists credentials to localStorage when the user opted into
 * "Remember me" and to sessionStorage otherwise. Session-only logins therefore
 * survive page reloads but are dropped when the browser tab/browser is closed.
 */
class SessionAwareAuthStore extends BaseAuthStore {
  override get token(): string {
    const stored = readAuthPayload()
    return stored?.token || this.baseToken || ''
  }

  override get model(): AuthRecord | null {
    const stored = readAuthPayload()
    return stored?.model || this.baseModel || null
  }

  override get record(): AuthRecord | null {
    return this.model
  }

  override save(token: string, model?: AuthRecord | null): void {
    persistAuthPayload(token, model || null)
    super.save(token, model || null)
  }

  override clear(): void {
    purgeAllAuth()
    super.clear()
  }
}

export function getPB(): PocketBase {
  if (!pbInstance) {
    const config = useRuntimeConfig()
    const url = config.public.pocketBaseUrl as string
    pbInstance = new PocketBase(url, new SessionAwareAuthStore())

    if (import.meta.client) {
      pbInstance.authStore.onChange(() => {
        try {
          document.cookie = pbInstance!.authStore.exportToCookie('pb_auth')
        } catch {}
        syncPiniaStore()
      })

      // Enforce the 30-day limit for remembered sessions.
      if (isRememberExpired()) {
        purgePersistentAuth()
        pbInstance.authStore.clear()
      }

      const stored = readAuthPayload()
      if (stored?.token && !pbInstance.authStore.token) {
        try {
          pbInstance.authStore.save(stored.token, stored.model || null)
          pbInstance.collection('users').authRefresh().catch(() => {
            pbInstance!.authStore.clear()
            document.cookie = 'pb_auth=; path=/; max-age=0'
            syncPiniaStore()
          })
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