import { usePB } from '~/composables/usePocketBase'

export function useNotify() {
  const pb = usePB()

  async function create(data: {
    type: string
    title: string
    message: string
    link?: string
  }) {
    try {
      await pb.collection('notifications').create({
        type: data.type,
        title: data.title,
        message: data.message,
        link: data.link || '',
        read: false,
      })
    } catch {
      // notification creation is best-effort
    }
  }

  return { create }
}
