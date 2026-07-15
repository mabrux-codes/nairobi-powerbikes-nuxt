import PocketBase from 'pocketbase'

let pbInstance: PocketBase | null = null
let hydrated = false

export function getPB(): PocketBase {
  if (!pbInstance) {
    const config = useRuntimeConfig()
    const url = config.public.pocketBaseUrl as string
    pbInstance = new PocketBase(url)

    if (import.meta.client) {
      pbInstance.authStore.onChange(() => {
        try { localStorage.setItem('pb_auth', JSON.stringify({ token: pbInstance.authStore.token, model: pbInstance.authStore.model })) } catch {}
        document.cookie = pbInstance.authStore.exportToCookie('pb_auth')
      })
    }
  }

  if (import.meta.client && !hydrated) {
    hydrated = true
    if (!pbInstance.authStore.token) {
      try {
        const stored = localStorage.getItem('pb_auth')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.token) {
            pbInstance.authStore.save(parsed.token, parsed.model)
          }
        }
      } catch {}
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
