import { storeToRefs } from 'pinia'
import { useWishlistStore } from '~/stores/wishlist'
import type { WishlistKind } from '~/stores/wishlist'

// Thin proxy over the shared Pinia store so every existing consumer
// (cards, navbar badge, wishlist page) keeps its current call signature.
export function useWishlist() {
  const store = useWishlistStore()
  const { count, ready } = storeToRefs(store)
  return {
    isSaved: (kind: WishlistKind, id: string) => store.isSaved(kind, id),
    toggle: (kind: WishlistKind, item: { id: string; name?: string }) => store.toggle(kind, item),
    load: () => store.load(),
    ready,
    count,
  }
}
