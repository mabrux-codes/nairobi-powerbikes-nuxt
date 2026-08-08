import { getPB } from './usePocketBase'
import { useAuthStore } from '~/stores/auth'
import { useAudio } from '~/composables/useAudio'

export interface GuestProfile {
  name: string
  email: string
  phone: string
}

const TOKEN_KEY = 'npb_chat_token'
const PROFILE_KEY = 'npb_chat_profile'
const LAST_SEEN_KEY = 'npb_chat_last_seen'
const HEARTBEAT_MS = 25000
const TYPING_SEND_THROTTLE_MS = 1400
const TYPING_STOP_MS = 2200

function readLS(key: string): string {
  if (!import.meta.client) return ''
  try { return localStorage.getItem(key) || '' } catch { return '' }
}

function writeLS(key: string, value: string) {
  if (!import.meta.client) return
  try { localStorage.setItem(key, value) } catch { /* ignore */ }
}

export function useChatGuest() {
  const pb = getPB()
  const auth = useAuthStore()

  const availability = ref<{ open: boolean; config: any } | null>(null)
  const mode = computed(() => (auth.user?.role === 'customer' ? 'customer' : 'guest'))
  const token = ref(readLS(TOKEN_KEY))

  const convs = ref<any[]>([])
  const conv = ref<any | null>(null)
  const messages = ref<any[]>([])
  const loading = ref(false)
  const starting = ref(false)
  const sending = ref(false)
  const readyConv = ref(false)
  const typingAt = ref(0)
  const typingName = ref('')
  const unseen = ref(0)
  const initError = ref('')
  const staffPresence = ref<Record<string, any>>({})
  const customerOnline = ref(false)

  let customerSubscribed = false
  let convTopicOff: (() => void) | null = null
  let typingTopicOff: (() => void) | null = null
  let presenceOff: (() => void) | null = null
  let heartbeatTimer: ReturnType<typeof setInterval> | null = null
  let lastTypingSentAt = 0
  let lastTypingSentValue = false
  let active = false
  const offCallbacks: (() => void)[] = []

  const profile = computed<GuestProfile>({
    get() {
      try { return JSON.parse(readLS(PROFILE_KEY) || 'null') || { name: '', email: '', phone: '' } } catch { return { name: '', email: '', phone: '' } }
    },
    set(v: GuestProfile) { writeLS(PROFILE_KEY, JSON.stringify(v)) },
  })

  const isCustomer = computed(() => mode.value === 'customer')
  const openNow = computed(() => availability.value?.open ?? true)

  const isResolved = computed(() => {
    const s = conv.value?.status
    return s === 'resolved' || s === 'closed'
  })

  const assignedAgent = computed(() => {
    const id = conv.value?.assigned_to
    if (!id) return null
    return staffPresence.value[id] || null
  })

  const assignedAgentName = computed(() => {
    const a = assignedAgent.value
    if (a?.name) return a.name
    if (conv.value?.expand?.assigned_to?.name) return conv.value.expand.assigned_to.name
    return ''
  })

  const supportStatus = computed<'online' | 'away' | 'offline'>(() => {
    const a = assignedAgent.value
    if (a?.availability === 'online') return 'online'
    if (a?.availability === 'away' || a?.availability === 'busy') return 'away'
    if (a?.availability === 'offline') return 'offline'
    return openNow.value ? 'online' : 'offline'
  })

  const isAway = computed(() => supportStatus.value === 'away' || supportStatus.value === 'offline')

  async function fetchAvailability() {
    try {
      const res: any = await fetch(pb.buildURL('/api/chat/availability')).then(r => r.json())
      availability.value = res
    } catch { availability.value = { open: true, config: null } }
  }

  function activeConvId() {
    return conv.value?.id || ''
  }

  function upsertBubble(msg: any) {
    if (!msg || msg?.conversation !== activeConvId()) return
    const idx = messages.value.findIndex(m => m.id === msg.id)
    if (idx > -1) {
      messages.value[idx] = { ...messages.value[idx], ...msg }
      return
    }
    messages.value.push(msg)
    messages.value.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime())
    if (msg.sender_type === 'agent' && !msg.customer_read_at) recomputeUnseen()
    // Inbound support reply -> notify the recipient (skip the user's own messages).
    if (msg.sender_type === 'agent') useAudio().playSuccess()
  }

  function applyConvUpdate(rec: any) {
    if (!rec?.id || rec.id !== activeConvId()) return
    conv.value = { ...conv.value, ...rec }
  }

  function recomputeUnseen() {
    const lastSeen = Number(readLS(LAST_SEEN_KEY) || 0)
    unseen.value = messages.value.filter(m => m.sender_type === 'agent' && !m.customer_read_at && new Date(m.created).getTime() > lastSeen).length
  }

  async function loadConversations() {
    if (isCustomer.value) {
      const id = auth.user?.id
      if (!id) { convs.value = []; return }
      const items = await pb.collection('chat_conversations').getFullList({ filter: pb.filter('customer = {:u}', { u: id }), sort: '-created' }).catch(() => [])
      convs.value = items as any[]
      return
    }
    const t = token.value
    if (!t) { convs.value = []; return }
    try {
      const res: any = await fetch(`${pb.buildURL('/api/chat/guest/conversations')}?token=${encodeURIComponent(t)}`).then(r => r.json())
      convs.value = res?.items || []
    } catch { convs.value = [] }
  }

  async function start(data: { name: string; email: string; phone: string; message: string; subject?: string }) {
    starting.value = true
    initError.value = ''
    profile.value = { name: data.name, email: data.email, phone: data.phone }
    try {
      if (isCustomer.value) {
        const rec = await pb.collection('chat_conversations').create({
          subject: data.subject || data.message.slice(0, 120),
          customer: auth.user?.id,
          status: 'waiting',
          priority: 'normal',
        })
        await pb.collection('chat_messages').create({
          conversation: rec.id,
          sender_type: 'customer',
          sender: auth.user?.id,
          body: data.message,
        })
        convs.value.unshift(rec)
        conv.value = rec
        await selectConversation(rec.id)
        return rec
      }
      const body = {
        guest_name: data.name,
        guest_email: data.email,
        guest_phone: data.phone,
        subject: data.subject || '',
        message: data.message,
        token: token.value || '',
      }
      const res: { ok: boolean; json: any } = await fetch(pb.buildURL('/api/chat/guest/start'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }).then(async r => ({ ok: r.ok, json: await r.json() }))
      if (!res.ok) throw new Error(res.json?.message || 'Failed to start conversation')
      writeLS(TOKEN_KEY, res.json.token)
      token.value = res.json.token
      await loadConversations()
      await selectConversation(res.json.conversation.id)
      return res.json
    } catch (e: any) {
      initError.value = e?.message || 'Something went wrong. Please try again.'
      throw e
    } finally {
      starting.value = false
    }
  }

  function startNewConversation() {
    return start({
      name: profile.value.name || (auth.user as any)?.name || '',
      email: profile.value.email || (auth.user as any)?.email || '',
      phone: profile.value.phone,
      message: '',
      subject: 'New conversation',
    })
  }

  async function selectConversation(convId: string) {
    const found = convs.value.find(c => c.id === convId)
    if (found) conv.value = found
    readyConv.value = false
    await loadMessages(convId)
    readyConv.value = true
    markSeen()
    recomputeUnseen()
    void subscribeThread(convId)
    void subscribeTyping(convId)
    startHeartbeat()
  }

  async function loadMessages(convId: string) {
    messages.value = []
    loading.value = true
    try {
      if (isCustomer.value) {
        const res = await pb.collection('chat_messages').getList(1, 200, {
          filter: pb.filter('conversation = {:c} && sender_type != {:n}', { c: convId, n: 'note' }),
          sort: '+created',
        }).catch(() => null)
        messages.value = (res?.items || []) as any[]
        return
      }
      const q = `token=${encodeURIComponent(token.value)}&conversation=${encodeURIComponent(convId)}`
      const res: any = await fetch(`${pb.buildURL('/api/chat/guest/messages')}?${q}`).then(r => r.json())
      messages.value = res?.items || []
    } catch (e: any) {
      initError.value = e?.message || 'Failed to load messages.'
    } finally {
      loading.value = false
    }
  }

  async function send(body: string, files: File[]) {
    const convId = activeConvId()
    if (!convId || isResolved.value) return
    sending.value = true
    initError.value = ''
    try {
      let bubble: any
      if (isCustomer.value) {
        const form = new FormData()
        form.append('conversation', convId)
        form.append('sender_type', 'customer')
        form.append('sender', auth.user?.id || '')
        if (body.trim()) form.append('body', body.trim())
        files.forEach(f => form.append('attachments', f))
        bubble = await pb.collection('chat_messages').create(form)
      } else {
        const form = new FormData()
        form.append('token', token.value)
        form.append('conversation', convId)
        if (body.trim()) form.append('body', body.trim())
        files.forEach(f => form.append('attachments', f))
        const res = await fetch(pb.buildURL('/api/chat/guest/message'), { method: 'POST', body: form }).then(async r => ({ ok: r.ok, json: await r.json() }))
        if (!res.ok) throw new Error(res.json?.message || 'Failed to send message.')
        bubble = res.json?.message
      }
      if (bubble) upsertBubble(bubble)
      heartbeatNow()
      return bubble
    } catch (e: any) {
      initError.value = e?.message || 'Failed to send message.'
      throw e
    } finally {
      sending.value = false
    }
  }

  function sendTypingFlag(isTyping: boolean) {
    const convId = activeConvId()
    if (!convId || isResolved.value) return
    const now = Date.now()
    if (isTyping && lastTypingSentValue && now - lastTypingSentAt < TYPING_SEND_THROTTLE_MS) return
    if (!isTyping && !lastTypingSentValue) return
    lastTypingSentAt = now
    lastTypingSentValue = isTyping
    const url = isCustomer.value ? pb.buildURL('/api/chat/typing') : pb.buildURL('/api/chat/guest/typing')
    try {
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isCustomer.value
            ? { conversation: convId, typing: isTyping }
            : { token: token.value, conversation: convId, typing: isTyping }
        ),
      }).catch(() => {})
    } catch { /* ignore */ }
  }

  async function markRead() {
    const convId = activeConvId()
    if (!convId) return
    if (isCustomer.value) {
      const unread = messages.value.filter(m => m.sender_type === 'agent' && !m.customer_read_at)
      for (const m of unread) {
        try { await pb.collection('chat_messages').update(m.id, { customer_read_at: new Date().toISOString() }) } catch { /* ignore */ }
      }
    } else {
      try {
        await fetch(pb.buildURL('/api/chat/guest/read'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: token.value, conversation: convId }),
        })
      } catch { /* ignore */ }
    }
    markSeen()
  }

  function markSeen() {
    if (!import.meta.client) return
    localStorage.setItem(LAST_SEEN_KEY, String(Date.now()))
    unseen.value = 0
  }

  async function subscribeThread(convId: string) {
    if (isCustomer.value) {
      if (customerSubscribed) return
      customerSubscribed = true
      try {
        await pb.collection('chat_messages').subscribe('*', (e: any) => {
          if (e.action === 'create' || e.action === 'update') upsertBubble(e.record)
        })
      } catch { /* ignore */ }
      try {
        await pb.collection('chat_conversations').subscribe('*', (e: any) => {
          if (e.action === 'update' || e.action === 'create') applyConvUpdate(e.record)
        })
      } catch { /* ignore */ }
      return
    }
    try {
      convTopicOff = await pb.realtime.subscribe(`chat_${convId}`, (e: any) => {
        const rec = e?.record
        if (!rec) return
        if (rec.sender_type) {
          upsertBubble(rec)
          if (rec.sender_type === 'agent' && !rec.customer_read_at) recomputeUnseen()
        } else {
          applyConvUpdate(rec)
        }
      })
      offCallbacks.push(convTopicOff)
    } catch { /* ignore */ }
  }

  async function subscribeTyping(convId: string) {
    try {
      typingTopicOff = await pb.realtime.subscribe(`chat_typing_${convId}`, (e: any) => {
        if (isCustomer.value && e?.user?.id && e.user.id === auth.user?.id) return
        if (!isCustomer.value && e?.user?.id === 'guest') return
        if (!e?.typing) { typingAt.value = 0; typingName.value = ''; return }
        typingAt.value = Date.now()
        const name = e.user?.name || 'Support'
        typingName.value = e.user?.role === 'customer' ? 'Customer' : name
        setTimeout(() => { typingAt.value = 0; typingName.value = '' }, 3000)
      })
      offCallbacks.push(typingTopicOff)
    } catch { /* ignore */ }
  }

  async function subscribePresence() {
    try {
      presenceOff = await pb.realtime.subscribe('chat_staff_presence', (p: any) => {
        if (!p?.id) return
        staffPresence.value[p.id] = p
      })
      offCallbacks.push(presenceOff)
    } catch { /* ignore */ }
  }

  async function heartbeatNow() {
    const convId = activeConvId()
    if (!convId) return
    const body: any = { conversation: convId }
    if (!isCustomer.value) body.token = token.value
    try {
      await fetch(pb.buildURL('/api/chat/heartbeat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (conv.value) conv.value.customer_last_seen = new Date().toISOString()
      customerOnline.value = true
    } catch { /* ignore */ }
  }

  function startHeartbeat() {
    stopHeartbeat()
    heartbeatNow()
    heartbeatTimer = setInterval(heartbeatNow, HEARTBEAT_MS)
  }

  function stopHeartbeat() {
    if (heartbeatTimer) { clearInterval(heartbeatTimer); heartbeatTimer = null }
  }

  async function attachmentUrl(convId: string, msgId: string, file: string, download = false): Promise<string> {
    try {
      const params: Record<string, string> = {}
      if (isCustomer.value) {
        const res: any = await pb.send(`/api/chat/attachment?conversation=${encodeURIComponent(convId)}&message=${encodeURIComponent(msgId)}&file=${encodeURIComponent(file)}${download ? '&download=1' : ''}`, { method: 'GET' })
        return res?.url ? pb.buildURL(res.url) : ''
      }
      const q = new URLSearchParams({ token: token.value, conversation: convId, message: msgId, file })
      if (download) q.set('download', '1')
      const res: any = await fetch(`${pb.buildURL('/api/chat/attachment')}?${q.toString()}`).then(r => r.json())
      if (res?.url) return res.url.startsWith('http') ? res.url : pb.buildURL(res.url)
    } catch { /* fall through */ }
    return ''
  }

  async function ensureActive() {
    if (active) return
    active = true
    await fetchAvailability()
    await loadConversations()
    const latest = convs.value[0]
    if (latest && !conv.value) {
      conv.value = latest
      await loadMessages(latest.id)
      readyConv.value = true
      recomputeUnseen()
      void subscribeThread(latest.id)
      void subscribeTyping(latest.id)
      startHeartbeat()
    }
    void subscribePresence()
  }

  function dispose() {
    active = false
    stopHeartbeat()
    for (const off of offCallbacks) { try { off() } catch { /* ignore */ } }
    offCallbacks.length = 0
  }

  return {
    availability,
    openNow,
    mode,
    isCustomer,
    token,
    convs,
    conv,
    messages,
    loading,
    starting,
    sending,
    readyConv,
    unseen,
    typingAt,
    typingName,
    initError,
    profile,
    staffPresence,
    customerOnline,
    assignedAgent,
    assignedAgentName,
    supportStatus,
    isAway,
    isResolved,
    ensureActive,
    dispose,
    start,
    startNewConversation,
    selectConversation,
    loadConversations,
    loadMessages,
    send,
    sendTypingFlag,
    markRead,
    attachmentUrl,
  }
}
