import { defineStore } from 'pinia'
import { getPB } from '~/composables/usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useAudio } from '~/composables/useAudio'

export interface ChatMessage {
  id: string
  collectionId: string
  conversation: string
  sender: string
  sender_type: 'customer' | 'agent' | 'system' | 'note'
  body: string
  attachments: string[]
  created: string
  updated: string
  delivered_at?: string
  customer_read_at?: string
  agent_read_at?: string
  expand?: any
}

export interface StaffPresence {
  id: string
  name: string
  role: string
  availability: 'online' | 'away' | 'busy' | 'offline'
  status: string
  at: number
}

const ONLINE_WINDOW_MS = 45000

export const useChatStore = defineStore('chat', () => {
  const pb = getPB()
  const auth = useAuthStore()

  const ready = ref(false)
  const status = ref<'connecting' | 'connected' | 'reconnecting'>('connecting')
  const conversations = ref<any[]>([])
  const messagesByConv = ref<Record<string, ChatMessage[]>>({})
  const selectedId = ref<string | null>(null)
  const sending = ref(false)
  const typing = ref<Record<string, { name: string; at: number }>>({})
  const staffPresence = ref<Record<string, StaffPresence>>({})
  const lastUpdated = ref('')

  let refCount = 0
  let initPromise: Promise<void> | null = null
  let subscribed = false
  const typingTopics = new Set<string>()
  let presenceOff: (() => void) | null = null

  const selectedConv = computed(() => conversations.value.find(c => c.id === selectedId.value) || null)

  const onlineStaff = computed(() =>
    Object.values(staffPresence.value).filter(s => s.availability === 'online' && s.status !== 'inactive')
  )

  function sortConvs() {
    conversations.value.sort((a, b) => {
      const ta = a.last_message_at || a.created
      const tb = b.last_message_at || b.created
      return new Date(tb).getTime() - new Date(ta).getTime()
    })
  }

  function upsertConv(rec: any) {
    if (!rec) return
    const idx = conversations.value.findIndex(c => c.id === rec.id)
    if (idx > -1) conversations.value[idx] = { ...conversations.value[idx], ...rec }
    else conversations.value.unshift(rec)
    sortConvs()
  }

  function upsertMessage(msg: any) {
    const convId = msg?.conversation
    if (!convId) return
    const list = messagesByConv.value[convId] || (messagesByConv.value[convId] = [])
    const idx = list.findIndex(m => m.id === msg.id)
    if (idx > -1) list[idx] = msg
    else list.push(msg)
    list.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())

    const conv = conversations.value.find(c => c.id === convId)
    if (conv && msg.sender_type !== 'note') {
      conv.last_message_at = msg.created
      conv.last_message_preview = (msg.body || `[${msg.attachments?.length || 0} attachment]`).slice(0, 90)
      sortConvs()
    }
  }

  function removeMessage(msg: any) {
    const list = messagesByConv.value[msg?.conversation]
    if (!list) return
    const idx = list.findIndex(m => m.id === msg.id)
    if (idx > -1) list.splice(idx, 1)
  }

  function unreadFor(conv: any): number {
    const list = messagesByConv.value[conv?.id] || []
    return list.filter(m => m.sender_type === 'customer' && !m.agent_read_at).length
  }

  const totalUnread = computed(() =>
    conversations.value.reduce((acc, c) => acc + (c._unread || 0), 0)
  )

  function attachUnreadCounts() {
    for (const c of conversations.value) {
      c._unread = unreadFor(c)
    }
  }

  function customerOnline(c: any): boolean {
    const lastSeen = c?.customer_last_seen
    if (!lastSeen) return false
    return Date.now() - new Date(lastSeen).getTime() < ONLINE_WINDOW_MS
  }

  async function fetchConversations() {
    const items = await pb.collection('chat_conversations').getFullList({
      sort: '-last_message_at,-created',
      expand: 'customer,assigned_to,resolved_by',
    }).catch(() => [])
    conversations.value = items as any[]
    sortConvs()
  }

  async function fetchMessages(convId: string) {
    const res = await pb.collection('chat_messages').getList(1, 200, {
      filter: pb.filter('conversation = {:c} && sender_type != {:n}', { c: convId, n: 'note' }),
      sort: '+created',
      expand: 'sender',
    }).catch(() => null)
    if (res) messagesByConv.value[convId] = res.items as ChatMessage[]
  }

  async function ensureMessages(convId: string) {
    if (messagesByConv.value[convId]) return
    await fetchMessages(convId)
  }

  async function select(convId: string | null) {
    selectedId.value = convId
    if (!convId) return
    await ensureMessages(convId)
    await markConversationRead(convId)
    attachUnreadCounts()
    subscribeTypingTopic(convId)
    if (convId) void joinConversation(convId)
  }

  async function markConversationRead(convId: string) {
    const list = messagesByConv.value[convId]
    if (!list) return
    const unread = list.filter(m => m.sender_type === 'customer' && !m.agent_read_at)
    for (const m of unread) {
      try {
        await pb.collection('chat_messages').update(m.id, { agent_read_at: new Date().toISOString() })
      } catch { /* keep going */ }
    }
  }

  async function sendMessage(convId: string, body: string, files: File[]) {
    const user = auth.user
    if (!user) throw new Error('Not authenticated')
    const form = new FormData()
    form.append('conversation', convId)
    form.append('sender_type', 'agent')
    form.append('sender', user.id)
    if (body.trim()) form.append('body', body.trim())
    for (const f of files) form.append('attachments', f)
    sending.value = true
    try {
      const rec = await pb.collection('chat_messages').create(form)
      upsertMessage(rec)
      return rec
    } finally {
      sending.value = false
    }
  }

  async function setStatus(convId: string, status: 'resolved' | 'active' | 'waiting') {
    const user = auth.user
    const data: any = { status }
    if (status === 'resolved') {
      data.resolved_at = new Date().toISOString()
      if (user) data.resolved_by = user.id
    } else {
      data.resolved_at = ''
      data.resolved_by = ''
    }
    const rec = await pb.collection('chat_conversations').update(convId, data)
    upsertConv(rec)
    return rec
  }

  function sendTyping(convId: string, isTyping: boolean) {
    try {
      pb.send('/api/chat/typing', {
        method: 'POST',
        body: JSON.stringify({ conversation: convId, typing: isTyping }),
      }).catch(() => {})
    } catch { /* ignore */ }
  }

  function setTyping(convId: string, payload: any) {
    if (payload?.user?.id && payload.user.id === auth.user?.id) return
    if (!payload?.typing) {
      delete typing.value[convId]
      return
    }
    typing.value[convId] = { name: payload.user?.name || 'Support', at: Date.now() }
  }

  async function joinConversation(convId: string) {
    try {
      await pb.send('/api/chat/join', {
        method: 'POST',
        body: JSON.stringify({ conversation: convId }),
      })
    } catch { /* non-fatal */ }
  }

  async function transferConversation(convId: string, to: string) {
    const res: any = await pb.send('/api/chat/transfer', {
      method: 'POST',
      body: JSON.stringify({ conversation: convId, to }),
    })
    await fetchConversations()
    return res
  }

  async function setMyAvailability(availability: 'online' | 'away' | 'offline') {
    const user = auth.user
    if (!user) return
    const res: any = await pb.send('/api/chat/availability', {
      method: 'POST',
      body: JSON.stringify({ availability }),
    })
    if (user) {
      auth.setUser({ ...user, availability } as any)
    }
    if (res?.availability) {
      staffPresence.value[user.id] = { id: user.id, name: user.name || 'Support', role: user.role || 'admin', availability: res.availability, status: user.status || 'active', at: Date.now() }
    }
    return res
  }

  async function fetchStaff() {
    const res: any = await pb.send('/api/chat/staff', { method: 'GET' }).catch(() => null)
    return res?.items || []
  }

  async function attachmentUrl(convId: string, msgId: string, file: string, download = false): Promise<string> {
    try {
      const res: any = await pb.send(`/api/chat/attachment?conversation=${encodeURIComponent(convId)}&message=${encodeURIComponent(msgId)}&file=${encodeURIComponent(file)}${download ? '&download=1' : ''}`, { method: 'GET' })
      if (res?.url) return pb.buildURL(res.url)
    } catch { /* fall through to raw URL */ }
    const msg = messagesByConv.value[convId]?.find(m => m.id === msgId)
    if (msg) return pb.files.getURL(msg, file, download ? { download: true } : {})
    return ''
  }

  function subscribeTypingTopic(convId: string) {
    if (typingTopics.has(convId)) return
    typingTopics.add(convId)
    try {
      pb.realtime.subscribe(`chat_typing_${convId}`, (payload: any) => {
        setTyping(convId, payload)
      }).catch(() => {})
    } catch { /* ignore */ }
  }

  async function subscribeStaffPresence() {
    if (presenceOff) return
    try {
      presenceOff = await pb.realtime.subscribe('chat_staff_presence', (p: any) => {
        if (!p?.id) return
        staffPresence.value[p.id] = p
      })
    } catch { /* ignore */ }
  }

  async function init() {
    if (initPromise) return initPromise
    initPromise = (async () => {
      status.value = 'connecting'
      try {
        pb.realtime.onDisconnect = () => { status.value = 'reconnecting' }
      } catch { /* realtime unavailable */ }

      try {
        await pb.collection('chat_conversations').subscribe('PB_CONNECT', () => {
          status.value = 'connected'
          if (!ready.value) fetchAll().then(() => { ready.value = true }).catch(() => {})
        })
      } catch { /* ignore */ }

      await fetchAll()
      await subscribeStaffPresence()
      const me = auth.user
      if (me) {
        staffPresence.value[me.id] = { id: me.id, name: me.name || 'Support', role: me.role || 'admin', availability: me.availability || 'offline', status: me.status || 'active', at: Date.now() }
      }

      if (!subscribed) {
        subscribed = true
        try {
          await pb.collection('chat_conversations').subscribe('*', (e: any) => {
            if (e.action === 'delete') {
              conversations.value = conversations.value.filter(c => c.id !== e.record?.id)
            } else {
              upsertConv(e.record)
            }
            attachUnreadCounts()
          })
        } catch { /* ignore */ }

        try {
          await pb.collection('chat_messages').subscribe('*', (e: any) => {
            if (e.action === 'delete') removeMessage(e.record)
            else upsertMessage(e.record)
            attachUnreadCounts()
            // Inbound customer message -> notify the admin (recipient) only.
            if (e.action === 'create' && e.record?.sender_type === 'customer' && auth.user?.role !== 'customer') {
              useAudio().playSuccess()
            }
          })
        } catch { /* ignore */ }
      }

      status.value = 'connected'
      ready.value = true
    })()
    return initPromise
  }

  async function fetchAll() {
    await fetchConversations()
    if (selectedId.value) await ensureMessages(selectedId.value)
    lastUpdated.value = new Date().toLocaleString()
  }

  async function ensureActive() {
    refCount++
    await init()
  }

  async function release() {
    refCount = Math.max(0, refCount - 1)
    if (refCount === 0 && subscribed) {
      subscribed = false
      try {
        pb.collection('chat_conversations').unsubscribe('*')
      } catch { /* ignore */ }
      try {
        pb.collection('chat_messages').unsubscribe('*')
      } catch { /* ignore */ }
      for (const t of typingTopics) {
        try { pb.realtime.unsubscribe(`chat_typing_${t}`) } catch { /* ignore */ }
      }
      typingTopics.clear()
      if (presenceOff) { try { presenceOff() } catch { /* ignore */ } presenceOff = null }
      try {
        pb.realtime.onDisconnect = undefined
      } catch { /* ignore */ }
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
    ready, status, conversations, messagesByConv, selectedId, selectedConv, sending, typing, staffPresence, onlineStaff, lastUpdated, totalUnread,
    ensureActive, release, refresh, select, sendMessage, setStatus, sendTyping, setTyping, attachmentUrl,
    unreadFor, customerOnline, joinConversation, transferConversation, setMyAvailability, fetchStaff,
  }
})
