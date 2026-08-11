import { defineStore } from 'pinia'
import { usePB } from '~/composables/usePocketBase'

export interface EmailQueueItem {
  id: string
  recipient: string
  recipientName: string
  template: string
  category: string
  priority: string
  status: string
  attempts: number
  scheduledFor: string
  sentAt: string
  failedAt: string
  lastError: string
  relatedType: string
  relatedId: string
  idempotencyKey: string
  created: string
}

export interface EmailLogItem {
  id: string
  queueId: string
  recipient: string
  subject: string
  template: string
  category: string
  status: string
  attempts: number
  sentAt: string
  failedAt: string
  error: string
  relatedType: string
  relatedId: string
  created: string
}

export interface EmailTemplateItem {
  id: string
  name: string
  key: string
  category: string
  subject: string
  html: string
  text: string
  body: string
  variables: string
  enabled: boolean
  active: boolean
}

export const useEmailStore = defineStore('email', () => {
  const pb = usePB()

  const ready = ref(false)
  const status = ref<'connecting' | 'connected' | 'reconnecting'>('connecting')
  const lastUpdated = ref('')

  const queue = ref<EmailQueueItem[]>([])
  const logs = ref<EmailLogItem[]>([])
  const templates = ref<EmailTemplateItem[]>([])
  const subscribers = ref<any[]>([])
  const automations = ref<any[]>([])
  const campaigns = ref<any[]>([])

  let refCount = 0
  let initPromise: Promise<void> | null = null
  let subscribed = false

  const COLLECTIONS = ['email_queue', 'email_logs', 'email_templates', 'subscribers', 'email_automations', 'email_campaigns']

  function applyDelta(list: any, action: string, record: any) {
    if (!record) return
    const idx = list.value.findIndex((r: any) => r.id === record.id)
    if (action === 'create') {
      if (idx === -1) list.value.unshift(record)
    } else if (action === 'update') {
      if (idx > -1) list.value[idx] = record
      else list.value.unshift(record)
    } else if (action === 'delete') {
      if (idx > -1) list.value.splice(idx, 1)
    }
  }

  function fetchAll() {
    const opts = { sort: '-created' }
    return Promise.all([
      pb.collection('email_queue').getFullList(opts).catch(() => []),
      pb.collection('email_logs').getFullList(opts).catch(() => []),
      pb.collection('email_templates').getFullList({ sort: 'name' }).catch(() => []),
      pb.collection('subscribers').getFullList(opts).catch(() => []),
      pb.collection('email_automations').getFullList({ sort: 'name' }).catch(() => []),
      pb.collection('email_campaigns').getFullList(opts).catch(() => []),
    ]).then(([q, l, t, s, a, c]: any[]) => {
      queue.value = q
      logs.value = l
      templates.value = t
      subscribers.value = s
      automations.value = a
      campaigns.value = c
      lastUpdated.value = new Date().toLocaleString()
    })
  }

  function init() {
    if (initPromise) return initPromise
    initPromise = (async () => {
      status.value = 'connecting'
      try {
        pb.realtime.onDisconnect = () => { status.value = 'reconnecting' }
      } catch { /* ignore */ }

      try {
        await pb.collection('email_queue').subscribe('PB_CONNECT', () => {
          status.value = 'connected'
          if (!ready.value) fetchAll().then(() => { ready.value = true }).catch(() => {})
        })
      } catch { /* ignore */ }

      await fetchAll()

      if (!subscribed) {
        subscribed = true
        for (const coll of COLLECTIONS) {
          const target = coll === 'email_queue' ? queue : coll === 'email_logs' ? logs : coll === 'email_templates' ? templates : coll === 'subscribers' ? subscribers : coll === 'email_automations' ? automations : campaigns
          try {
            pb.collection(coll).subscribe('*', (e: any) => applyDelta(target, e.action, e.record))
          } catch { /* ignore */ }
        }
      }

      status.value = 'connected'
      ready.value = true
    })()
    return initPromise
  }

  async function ensureActive() {
    refCount++
    await init()
  }

  function release() {
    refCount = Math.max(0, refCount - 1)
    if (refCount === 0 && subscribed) {
      subscribed = false
      for (const coll of COLLECTIONS) {
        try { pb.collection(coll).unsubscribe('*') } catch { /* ignore */ }
      }
      try { pb.realtime.onDisconnect = undefined } catch { /* ignore */ }
      ready.value = false
      initPromise = null
    }
  }

  async function refresh() {
    try {
      await fetchAll()
      status.value = 'connected'
    } catch { /* keep existing data */ }
  }

  return {
    ready, status, lastUpdated,
    queue, logs, templates, subscribers, automations, campaigns,
    ensureActive, release, refresh,
  }
})
