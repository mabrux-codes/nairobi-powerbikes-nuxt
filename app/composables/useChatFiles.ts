export const CHAT_MAX_FILE_BYTES = 8 * 1024 * 1024
export const CHAT_MAX_FILES = 4

export const CHAT_ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
]

export function isChatImage(file: { name: string; type?: string }) {
  return (file.type || '').startsWith('image/')
}

export function formatBytes(bytes: number): string {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function validateChatFiles(files: File[]): { ok: boolean; errors: string[] } {
  const errors: string[] = []
  if (files.length === 0) return { ok: true, errors }

  if (files.length > CHAT_MAX_FILES) {
    errors.push(`You can attach up to ${CHAT_MAX_FILES} files at once.`)
  }

  for (const f of files.slice(0, CHAT_MAX_FILES)) {
    if (f.size > CHAT_MAX_FILE_BYTES) {
      errors.push(`"${f.name}" is ${formatBytes(f.size)} — the limit is ${formatBytes(CHAT_MAX_FILE_BYTES)}.`)
    } else if (!CHAT_ACCEPTED_TYPES.includes(f.type) && f.type) {
      errors.push(`"${f.name}" (${f.type || 'unknown type'}) is not supported. Use images, PDF, Word, Excel or text files.`)
    }
  }

  return { ok: errors.length === 0, errors }
}
