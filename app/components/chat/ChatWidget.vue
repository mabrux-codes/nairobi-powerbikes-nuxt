<template>
  <ClientOnly>
    <div v-if="enabled" class="chat-widget-root">
      <!-- Launcher -->
      <button
        v-if="!open"
        class="chat-launcher"
        :aria-label="unseen ? `Open chat (${unseen} unread)` : 'Open chat'"
        :aria-expanded="open"
        @click="openPanel"
      >
        <span class="chat-launcher-icon">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        </span>
        <span v-if="unseen > 0" class="chat-launcher-badge">{{ unseen > 9 ? '9+' : unseen }}</span>
      </button>

      <!-- Panel -->
      <transition name="chat-pop">
        <div v-if="open" class="chat-panel">
          <header class="chat-header">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-red/50 to-brand-grey/30 text-white" role="img" aria-label="Support avatar">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M7 11a5 5 0 0110 0" /></svg>
              </div>
              <div>
                <p class="text-sm font-semibold text-white">{{ headerName }}</p>
                <p class="flex items-center gap-1.5 text-xs" :class="statusTextClass" aria-live="polite">
                  <span class="relative flex h-1.5 w-1.5">
                    <span v-if="supportStatus === 'online'" class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span class="relative inline-flex h-1.5 w-1.5 rounded-full" :class="statusDotClass" />
                  </span>
                  {{ statusLabel }}
                </p>
              </div>
            </div>
            <button class="chat-header-close" aria-label="Close chat" @click="close">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </header>

          <!-- Body -->
          <div class="chat-body">
            <!-- Thread -->
            <template v-if="conv">
              <div ref="scrollRef" class="chat-scroll">
                <div v-if="!openNow" class="chat-note">
                  <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>
                  We're currently closed. You can still leave a message and we'll reply as soon as we're back.
                </div>

                <div v-else-if="isAway" class="chat-note">
                  <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2" /></svg>
                  Support is currently away. We'll respond as soon as we're back online.
                </div>

                <div v-if="isResolved" class="chat-closed" role="status" aria-live="polite">
                  <svg class="h-5 w-5 shrink-0 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  <div>
                    <p class="text-sm font-semibold text-white">Conversation Closed</p>
                    <p class="text-xs text-brand-grey">This conversation has been resolved by our support team.</p>
                  </div>
                </div>

                <div v-if="loading" class="chat-empty">
                  <div class="h-3 w-24 rounded bg-brand-grey/20 animate-pulse" />
                  <div class="h-3 w-40 rounded bg-brand-grey/15 animate-pulse" />
                </div>

                <div v-for="m in messages" :key="m.id" class="chat-row" :class="m.sender_type === 'system' ? 'chat-row-system' : m.sender_type === 'customer' ? 'chat-row-mine' : 'chat-row-theirs'">
                  <div v-if="m.sender_type === 'system'" class="chat-system">
                    <span class="chat-system-text">{{ m.body }}</span>
                  </div>
                  <div v-else class="chat-bubble" :class="m.sender_type === 'customer' ? 'chat-bubble-mine' : 'chat-bubble-theirs'">
                    <div v-if="m.body" class="chat-bubble-text whitespace-pre-wrap">{{ m.body }}</div>

                    <div v-if="m.attachments?.length" class="mt-1.5 flex flex-col gap-1.5">
                      <template v-for="f in m.attachments" :key="f">
                        <a
                          v-if="isImage(f)"
                          :href="previewUrl(m, f)"
                          target="_blank"
                          rel="noopener"
                          class="chat-attach-img"
                          @click.prevent="openImage(previewUrl(m, f))"
                        >
                          <img :src="previewUrl(m, f)" :alt="f" loading="lazy" />
                        </a>
                        <a
                          v-else
                          :href="downloadUrl(m, f)"
                          target="_blank"
                          rel="noopener"
                          class="chat-attach-chip"
                        >
                          <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                          <span class="truncate">{{ f }}</span>
                        </a>
                      </template>
                    </div>

                    <div class="chat-meta">
                      <span>{{ formatTime(m.created) }}</span>
                      <span v-if="m.sender_type === 'customer'" class="inline-flex items-center gap-0.5">
                        <svg v-if="m.customer_read_at || m.delivered_at" class="h-3 w-3 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                        <svg v-else class="h-3 w-3 text-brand-grey/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                        <span v-if="m.customer_read_at" class="text-[9px] text-sky-400">Read</span>
                        <span v-else-if="m.delivered_at" class="text-[9px] text-brand-grey">Delivered</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div v-if="typingAt" class="chat-typing">
                  <span class="typing-dot" /><span class="typing-dot" /><span class="typing-dot" />
                  <span class="ml-2 text-[11px] text-brand-grey">{{ typingName }} is typing…</span>
                </div>
              </div>

              <!-- Composer -->
              <div class="chat-composer">
                <template v-if="isResolved">
                  <div class="flex flex-col items-center gap-2 py-3 text-center">
                    <p class="text-xs text-brand-grey">Need more help?</p>
                    <button class="chat-btn-primary w-full" @click="openStartForm">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                      Start New Conversation
                    </button>
                  </div>
                </template>
                <template v-else>
                  <div v-if="attachList.length" class="chat-composer-attachments">
                  <div v-for="(f, i) in attachList" :key="i" class="chat-chip">
                    <svg class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                    <span class="truncate">{{ f.name }}</span>
                    <span class="shrink-0 text-[10px] opacity-70">{{ formatBytes(f.size) }}</span>
                    <button class="chat-x" aria-label="Remove file" @click="attachList.splice(i, 1)">
                      <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                </div>
                <div v-if="composerError" class="chat-note chat-note-error">{{ composerError }}</div>

                <div class="chat-composer-row">
                  <textarea
                    ref="inputRef"
                    v-model="draft"
                    class="chat-input"
                    rows="1"
                    maxlength="5000"
                    :placeholder="openNow ? 'Type a message…' : 'Leave a message…'"
                    aria-label="Message"
                    :disabled="isResolved"
                    @keydown.enter.exact.prevent="submit"
                    @input="onTyping"
                  />
                  <div class="chat-composer-actions">
                    <label class="chat-icon-btn cursor-pointer" title="Attach a file">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.485 8.486L20.5 13" /></svg>
                      <input
                        type="file"
                        class="hidden"
                        :accept="acceptedAttrs"
                        multiple
                        @change="onPickFiles"
                      />
                    </label>
                    <button class="flex btn-icon-send justify-center" :disabled="sending || (!draft.trim() && !attachList.length)" aria-label="Send message" @click="submit">
                      <svg v-if="!sending" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 10l18-7-7 18-2.5-7.5L3 10z" /></svg>
                      <svg v-else class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                    </button>
                  </div>
                </div>
                </template>
              </div>
            </template>

            <!-- Start / resume -->
            <template v-else>
              <div class="chat-scroll">
                <p class="chat-intro">Hi! 👋 Got a question about a motorcycle, accessories, financing or servicing? Our team is here to help.</p>

                <div v-if="convs.length" class="mb-3 flex flex-col gap-2">
                  <button v-for="c in convs" :key="c.id" class="chat-resume" @click="resume(c.id)">
                    <div class="min-w-0">
                      <p class="truncate text-sm font-medium text-white">{{ c.subject || (c.guest_name || 'Conversation') }}</p>
                      <p class="truncate text-[11px] text-brand-grey">{{ chatStatusText(c.status) }}</p>
                    </div>
                    <svg class="h-4 w-4 shrink-0 text-brand-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>

                <form class="chat-form" @submit.prevent="submitStart">
                  <label v-if="!isCustomer" class="chat-label">Your name</label>
                  <input v-if="!isCustomer" v-model="form.name" required class="chat-input" placeholder="John Mwangi" maxlength="120" />
                  <label v-if="!isCustomer" class="chat-label">Email</label>
                  <input v-if="!isCustomer" v-model="form.email" type="email" required class="chat-input" placeholder="you@email.com" maxlength="160" />
                  <label v-if="!isCustomer" class="chat-label">Phone <span class="opacity-60 font-normal">(optional)</span></label>
                  <input v-if="!isCustomer" v-model="form.phone" class="chat-input" placeholder="+254 7xx xxx xxx" maxlength="40" />
                  <label class="chat-label">Message</label>
                  <textarea v-model="form.message" required class="chat-input" rows="4" maxlength="5000" placeholder="How can we help?"></textarea>
                  <div v-if="startError" class="chat-composer-error">{{ startError }}</div>
                  <button type="submit" class="chat-btn-primary w-full" :disabled="starting">
                    <svg v-if="starting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    {{ starting ? 'Starting…' : 'Start conversation' }}
                  </button>
                  <p v-if="!openNow" class="text-center text-[11px] text-amber-400/90">
                    We're currently offline. Your message will reach us the moment we're back.
                  </p>
                </form>
              </div>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useChatGuest } from '~/composables/useChatGuest'
import { useAuthStore } from '~/stores/auth'
import { isChatImage, validateChatFiles, formatBytes, CHAT_ACCEPTED_TYPES, CHAT_MAX_FILES } from '~/composables/useChatFiles'
import { getPB } from '~/composables/usePocketBase'

const route = useRoute()
const pb = getPB()
const auth = useAuthStore()
const {
  openNow, isCustomer, convs, conv, messages, loading, starting, sending, readyConv,
  unseen, typingAt, typingName, profile, isResolved, supportStatus, assignedAgentName,
  ensureActive, dispose, start, startNewConversation, selectConversation, send, sendTypingFlag, markRead, attachmentUrl,
} = useChatGuest()

const enabled = computed(() => route.meta.layout !== 'dashboard' && route.path !== '/login' && route.path !== '/register')
const open = ref(false)
const draft = ref('')
const attachList = ref<File[]>([])
const composerError = ref('')
const startError = ref('')
const scrollRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLElement | null>(null)

const form = reactive({ name: '', email: '', phone: '', message: '' })

const acceptedAttrs = CHAT_ACCEPTED_TYPES.join(',')

const headerName = computed(() => {
  if (assignedAgentName.value) return assignedAgentName.value
  return 'Nairobi Powerbikes Support'
})

const statusLabel = computed(() => {
  if (supportStatus.value === 'away') return 'Away'
  if (supportStatus.value === 'offline') return 'Offline'
  return 'Online'
})

const statusTextClass = computed(() => {
  if (supportStatus.value === 'online') return 'text-emerald-400'
  if (supportStatus.value === 'away') return 'text-amber-400'
  return 'text-brand-grey'
})

const statusDotClass = computed(() => {
  if (supportStatus.value === 'online') return 'bg-emerald-400'
  if (supportStatus.value === 'away') return 'bg-amber-400'
  return 'bg-brand-grey/60'
})

function formPrefill() {
  const p = profile.value
  if (auth.user) {
    form.name = (auth.user as any)?.name || ''
    form.email = (auth.user as any)?.email || ''
  }
  form.name = form.name || p?.name || ''
  form.email = form.email || p?.email || ''
  form.phone = p?.phone || ''
}

async function openPanel() {
  open.value = true
  await ensureActive()
  formPrefill()
  if (!conv && convs[0]) await selectConversation(convs[0].id)
  if (conv) await markRead()
}

function close() {
  open.value = false
}

function openStartForm() {
  conv.value = null
  draft.value = ''
  attachList.value = []
  composerError.value = ''
  nextTick(() => { inputRef.value?.focus() })
}

async function submitStart() {
  startError.value = ''
  try {
    if (isResolved.value) {
      await startNewConversation()
      form.message = ''
      return
    }
    await start({
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    })
    form.message = ''
  } catch (e: any) {
    startError.value = e?.message || 'Failed to start.'
  }
}

async function resume(convId: string) {
  await selectConversation(convId)
  await markRead()
  nextTick(scrollToBottom)
}

async function submit() {
  const body = draft.value.trim()
  if (!body && attachList.value.length === 0) return
  // revalidate files
  const v = validateChatFiles(attachList.value)
  if (!v.ok) { composerError.value = v.errors.join(' '); return }
  composerError.value = ''
  try {
    await send(body, attachList.value)
    attachList.value = []
    draft.value = ''
    sendTypingFlag(false)
    nextTick(scrollToBottom)
  } catch (e: any) {
    composerError.value = e?.message || 'Failed to send.'
  }
}

let typingTimer: ReturnType<typeof setTimeout> | null = null
function onTyping() {
  sendTypingFlag(true)
  if (typingTimer) clearTimeout(typingTimer)
  typingTimer = setTimeout(() => sendTypingFlag(false), 1200)
}

function onPickFiles(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files || [])
  input.value = ''
  addFiles(files)
}

function addFiles(files: File[]) {
  const next = [...attachList.value, ...files].slice(0, CHAT_MAX_FILES)
  const v = validateChatFiles(next)
  composerError.value = v.ok ? '' : v.errors.join(' ')
  if (v.ok || next.length && !v.ok && files.length === 0) attachList.value = next
  else attachList.value = next
}

function previewUrl(m: any, f: string): string {
  return pb.files.getURL(m, f)
}

async function downloadUrl(m: any, f: string): Promise<string> {
  const url = await attachmentUrl(m.conversation, m.id, f, true)
  return url || previewUrl(m, f)
}

function isImage(f: string) {
  return /\.(jpe?g|png|gif|webp|heic|heif)$/i.test(f)
}

function openImage(url: string) {
  window.open(url, '_blank', 'noopener')
}

function chatStatusText(s: string) {
  const map: Record<string, string> = { waiting: 'Waiting for an agent', assigned: 'With an agent', active: 'Active', resolved: 'Resolved', closed: 'Closed' }
  return map[s] || s
}

function formatTime(d?: string) {
  if (!d) return ''
  const t = new Date(d)
  return t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom() {
  const el = scrollRef.value
  if (el) el.scrollTop = el.scrollHeight
}

watch(() => messages.length, () => nextTick(scrollToBottom))
watch(open, (o) => { if (o) { formPrefill(); if (conv) markRead() } })

onBeforeUnmount(() => { dispose() })
</script>

<style scoped>
.chat-widget-root {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 60;
  font-family: 'Inter', system-ui, sans-serif;
}

.chat-launcher {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
  border-radius: 9999px;
  border: none;
  background: linear-gradient(180deg, #d6001c, #99120b);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(214, 0, 28, 0.35);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.chat-launcher:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 36px rgba(214, 0, 28, 0.5);
}

.chat-launcher-icon,
.chat-launcher-icon svg { display: flex; }

.chat-launcher-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 22px;
  height: 22px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: #0d0d0d;
  border: 2px solid #d6001c;
  border-radius: 9999px;
}

.chat-panel {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: min(400px, calc(100vw - 32px));
  max-height: min(640px, calc(100vh - 120px));
  display: flex;
  flex-direction: column;
  border-radius: 18px;
  overflow: hidden;
  background: #121216;
  border: 1px solid rgba(214, 0, 28, 0.25);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: linear-gradient(180deg, #1a1a1f, #121216);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.chat-header-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}
.chat-header-close:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }

.chat-body { display: flex; flex-direction: column; flex: 1; min-height: 0; }

.chat-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
}

.chat-note {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 11px;
  line-height: 1.5;
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.08);
  border: 1px solid rgba(251, 191, 36, 0.2);
  border-radius: 10px;
}
.chat-note-error { color: #f87171; background: rgba(248, 113, 113, 0.08); border-color: rgba(248, 113, 113, 0.25); }

.chat-empty {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  align-items: center;
}

.chat-row { display: flex; }
.chat-row-mine { justify-content: flex-end; }
.chat-row-theirs { justify-content: flex-start; }
.chat-row-system { justify-content: center; }

.chat-system {
  display: flex;
  justify-content: center;
  max-width: 88%;
}
.chat-system-text {
  padding: 5px 12px;
  border-radius: 9999px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.chat-closed {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.chat-bubble {
  max-width: 82%;
  padding: 9px 12px;
  border-radius: 14px;
  font-size: 13px;
  line-height: 1.5;
  color: #fff;
  word-wrap: break-word;
}
.chat-bubble-mine {
  background: linear-gradient(180deg, #d6001c, #a80f16);
  border-bottom-right-radius: 4px;
}
.chat-bubble-theirs {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-bottom-left-radius: 4px;
}

.chat-bubble-text { white-space: pre-wrap; }

.chat-meta {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 4px;
  font-size: 9.5px;
  color: rgba(255, 255, 255, 0.5);
}

.chat-attach-img {
  display: block;
  border-radius: 10px;
  overflow: hidden;
  max-width: 260px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
}
.chat-attach-img img { display: block; width: 100%; height: auto; max-height: 220px; object-fit: cover; }

.chat-attach-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  font-size: 12px;
  transition: background 0.2s ease;
}
.chat-attach-chip:hover { background: rgba(255, 255, 255, 0.1); }

.chat-typing {
  display: flex;
  align-items: center;
  padding: 4px 2px;
}
.typing-dot {
  width: 6px;
  height: 6px;
  margin-right: 4px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  animation: blink 1.2s infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink { 0%, 60%, 100% { opacity: 0.25; } 30% { opacity: 1; } }

.chat-composer {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px 12px;
  background: #141419;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-composer-attachments { display: flex; flex-wrap: wrap; gap: 6px; }
.chat-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  max-width: 100%;
  padding: 5px 8px;
  border-radius: 8px;
  font-size: 11px;
  color: #e2e8f0;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.chat-x {
  display: flex;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 2px;
}
.chat-x:hover { color: #fff; }

.chat-composer-row { display: flex; align-items: flex-end; gap: 8px; }

.chat-input {
  flex: 1;
  resize: none;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: #fff;
  padding: 10px 12px;
  font-size: 13px;
  outline: none;
  max-height: 110px;
  line-height: 1.5;
}
.chat-input:focus { border-color: rgba(214, 0, 28, 0.6); }

.chat-composer-actions { display: flex; align-items: center; gap: 6px; }
.chat-icon-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 10px; color: rgba(255, 255, 255, 0.6); transition: all 0.2s ease; }
.chat-icon-btn:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }

.btn-icon-send {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(180deg, #d6001c, #a80f16);
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.btn-icon-send:disabled { opacity: 0.4; cursor: not-allowed; }

.chat-intro {
  font-size: 12.5px;
  line-height: 1.6;
  color: #a3a3a3;
  margin-bottom: 14px;
}

.chat-resume {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  text-align: left;
  padding: 11px 13px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}
.chat-resume:hover { background: rgba(214, 0, 28, 0.1); border-color: rgba(214, 0, 28, 0.4); }

.chat-form { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }

.chat-label {
  font-size: 10px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.chat-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  background: linear-gradient(180deg, #d6001c, #8b0f16);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.chat-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(214, 0, 28, 0.35); }
.chat-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

.chat-composer-error {
  font-size: 11px;
  color: #f87171;
  padding: 6px 8px;
  border-radius: 8px;
  background: rgba(248, 113, 113, 0.1);
}

.chat-pop-enter-active, .chat-pop-leave-active { transition: opacity 0.18s ease, transform 0.18s ease; }
.chat-pop-enter-from, .chat-pop-leave-to { opacity: 0; transform: translateY(14px) scale(0.98); }
</style>