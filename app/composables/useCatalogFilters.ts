export type CatalogKind = 'bike' | 'accessory' | 'apparel'

export interface CatalogFilters {
  search: string
  sort: string
  brand: string
  category: string
  type: string
  size: string
  color: string
  priceMin: string
  priceMax: string
  inStock: boolean
  featured: boolean
  sale: boolean
  newArrival: boolean
}

const defaultFilters = (): CatalogFilters => ({
  search: '',
  sort: '-created',
  brand: '',
  category: '',
  type: '',
  size: '',
  color: '',
  priceMin: '',
  priceMax: '',
  inStock: false,
  featured: false,
  sale: false,
  newArrival: false,
})

export const SORT_OPTIONS: Record<CatalogKind, { value: string; label: string }[]> = {
  bike: [
    { value: '-created', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A-Z' },
    { value: '-year', label: 'Year: Newest' },
  ],
  accessory: [
    { value: '-created', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A-Z' },
  ],
  apparel: [
    { value: '-created', label: 'Newest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A-Z' },
  ],
}

export function priceOf(item: any, kind: CatalogKind): number {
  if (kind === 'bike') return Number(item.sale_price || item.price || 0)
  return Number(item.price || 0)
}

export function useCatalogFilters(kind: CatalogKind) {
  const filters = reactive<CatalogFilters>(defaultFilters())

  const activeCount = computed(() => {
    let n = 0
    if (filters.search) n++
    if (filters.brand) n++
    if (filters.category) n++
    if (filters.type) n++
    if (filters.size) n++
    if (filters.color) n++
    if (filters.priceMin || filters.priceMax) n++
    if (filters.inStock) n++
    if (filters.featured) n++
    if (filters.sale) n++
    if (filters.newArrival) n++
    return n
  })

  function matches(item: any): boolean {
    if (filters.search) {
      const q = filters.search.toLowerCase()
      const hay = [item.name, item.brand_name, item.category, item.type, item.description, item.brand?.name]
        .filter(Boolean).join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (filters.brand && item.brand !== filters.brand) return false
    if (filters.category) {
      const catVal = kind === 'apparel' ? (item.type || item.category) : (item.category || item.type)
      if (catVal !== filters.category) return false
    }
    if (filters.type && item.type !== filters.type) return false
    if (filters.size && item.size !== filters.size) return false
    if (filters.color) {
      const c = (item.color || '').toLowerCase()
      if (!c.includes(filters.color.toLowerCase())) return false
    }
    const price = priceOf(item, kind)
    if (filters.priceMin && price < Number(filters.priceMin)) return false
    if (filters.priceMax && price > Number(filters.priceMax)) return false
    if (filters.inStock && !item.in_stock) return false
    if (filters.featured && !item.featured) return false
    if (filters.sale && !item.sale_price) return false
    if (filters.newArrival && !item.new_arrival) return false
    return true
  }

  function sortItems(list: any[]): any[] {
    const [key, dir] = filters.sort.startsWith('-')
      ? [filters.sort.slice(1), -1]
      : [filters.sort, 1]
    return [...list].sort((a, b) => {
      const va = a[key] ?? ''
      const vb = b[key] ?? ''
      return va > vb ? dir : va < vb ? -dir : 0
    })
  }

  function filterAndSort(list: any[]): any[] {
    return sortItems(list.filter(matches))
  }

  function reset() {
    Object.assign(filters, defaultFilters())
  }

  return { filters, activeCount, filterAndSort, matches, sortItems, reset }
}
