export const REMEMBER_ME_DAYS = 30
export const REMEMBER_ME_MS = REMEMBER_ME_DAYS * 24 * 60 * 60 * 1000

export const AUTH_META_KEY = 'npb_auth_meta'
export const AUTH_STORAGE_PERSISTENT = 'pb_auth'
export const AUTH_STORAGE_SESSION = 'pb_auth_session'
export const USER_STORAGE_PERSISTENT = 'auth_user'
export const USER_STORAGE_SESSION = 'auth_user_session'

export interface AuthMeta {
  remember: boolean
  expiresAt: number
}

function safeLocal(): Storage | null {
  try { return typeof window !== 'undefined' ? window.localStorage : null } catch { return null }
}

function safeSession(): Storage | null {
  try { return typeof window !== 'undefined' ? window.sessionStorage : null } catch { return null }
}

export function readAuthMeta(): AuthMeta | null {
  try {
    const raw = safeLocal()?.getItem(AUTH_META_KEY)
    if (!raw) return null
    const p = JSON.parse(raw)
    if (p && typeof p.remember === 'boolean') {
      return { remember: p.remember, expiresAt: typeof p.expiresAt === 'number' ? p.expiresAt : 0 }
    }
  } catch {}
  return null
}

export function setRememberMeta(remember: boolean) {
  try {
    if (remember) safeLocal()?.setItem(AUTH_META_KEY, JSON.stringify({ remember: true, expiresAt: Date.now() + REMEMBER_ME_MS }))
    else safeLocal()?.setItem(AUTH_META_KEY, JSON.stringify({ remember: false, expiresAt: 0 }))
  } catch {}
}

// Legacy sessions (no meta) keep the previous persistent behaviour.
export function isRemembered(): boolean {
  const meta = readAuthMeta()
  return meta ? meta.remember : true
}

export function isRememberExpired(): boolean {
  const meta = readAuthMeta()
  if (!meta || !meta.remember || !meta.expiresAt) return false
  return Date.now() > meta.expiresAt
}

export function persistAuthPayload(token: string, model: unknown) {
  const payload = JSON.stringify({ token, model })
  try {
    if (isRemembered()) safeLocal()?.setItem(AUTH_STORAGE_PERSISTENT, payload)
    else safeSession()?.setItem(AUTH_STORAGE_SESSION, payload)
  } catch {}
}

export function readAuthPayload(): { token: string; model: any } | null {
  try {
    const raw = safeLocal()?.getItem(AUTH_STORAGE_PERSISTENT)
    if (raw) {
      const p = JSON.parse(raw)
      if (p?.token) return p
    }
  } catch {}
  try {
    const raw = safeSession()?.getItem(AUTH_STORAGE_SESSION)
    if (raw) {
      const p = JSON.parse(raw)
      if (p?.token) return p
    }
  } catch {}
  return null
}

export function persistUserCache(user: unknown | null) {
  try {
    if (user) {
      const payload = JSON.stringify(user)
      if (isRemembered()) safeLocal()?.setItem(USER_STORAGE_PERSISTENT, payload)
      else safeSession()?.setItem(USER_STORAGE_SESSION, payload)
    } else {
      safeLocal()?.removeItem(USER_STORAGE_PERSISTENT)
      safeSession()?.removeItem(USER_STORAGE_SESSION)
    }
  } catch {}
}

export function readUserCache(): any | null {
  try {
    const raw = safeLocal()?.getItem(USER_STORAGE_PERSISTENT)
    if (raw) return JSON.parse(raw)
  } catch {}
  try {
    const raw = safeSession()?.getItem(USER_STORAGE_SESSION)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

export function purgePersistentAuth() {
  try {
    safeLocal()?.removeItem(AUTH_STORAGE_PERSISTENT)
    safeLocal()?.removeItem(AUTH_META_KEY)
    safeLocal()?.removeItem(USER_STORAGE_PERSISTENT)
  } catch {}
}

export function purgeSessionAuth() {
  try {
    safeSession()?.removeItem(AUTH_STORAGE_SESSION)
    safeSession()?.removeItem(USER_STORAGE_SESSION)
  } catch {}
}

export function purgeAllAuth() {
  purgePersistentAuth()
  purgeSessionAuth()
}