import { getPB } from './usePocketBase'

export function useRealtimeCollection(collection: string) {
  const pb = getPB()
  const isConnected = ref(false)
  const lastEvent = ref<any>(null)

  function subscribe(callback?: (data?: any) => void) {
    pb.collection(collection).subscribe('*', (data) => {
      lastEvent.value = data
      callback?.(data)
    })
    isConnected.value = true
  }

  function unsubscribe() {
    pb.collection(collection).unsubscribe('*')
    isConnected.value = false
  }

  onUnmounted(() => {
    unsubscribe()
  })

  return { subscribe, unsubscribe, isConnected, lastEvent }
}
