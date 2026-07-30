export function formatDate(d: string): string {
  if (!d) return 'N/A'
  const [y, m, day] = d.split('-').map(Number)
  const date = new Date(y, m - 1, day)
  return date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function formatTime(t: string): string {
  if (!t) return 'N/A'
  const [h, m] = t.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return t
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export function formatDateTime(d: string): string {
  if (!d) return 'N/A'
  const date = new Date(d)
  return date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}
