export const STOCK_THRESHOLDS = {
  OUT_OF_STOCK: 0,
  LOW_STOCK: 2,
  FEW_REMAINING: 5,
} as const

export type StockLevel = 'out' | 'low' | 'few' | 'in'

export interface StockStatus {
  level: StockLevel
  label: string
  message: string
  short: string
  dot: string
  text: string
  badge: string
  chip: string
}

/**
 * Single source of truth for stock status. Adjust the labels/thresholds here
 * and every badge, card and admin surface picks them up automatically.
 */
export function getStockStatus(quantity: number): StockStatus {
  const q = Math.max(0, Number.isFinite(Number(quantity)) ? Math.floor(Number(quantity)) : 0)

  if (q <= STOCK_THRESHOLDS.OUT_OF_STOCK) {
    return {
      level: 'out',
      label: 'Out of Stock',
      message: '0 available',
      short: 'OUT OF STOCK',
      dot: 'bg-brand-grey',
      text: 'text-brand-grey',
      badge: 'border-white/10 bg-brand-black/70 text-brand-grey',
      chip: 'out_of_stock',
    }
  }

  if (q <= STOCK_THRESHOLDS.LOW_STOCK) {
    return {
      level: 'low',
      label: `Only ${q} left — Hurry!`,
      message: `${q} left — low stock`,
      short: 'CRITICAL — LOW STOCK',
      dot: 'bg-rose-500 animate-pulse',
      text: 'text-rose-400',
      badge: 'border-rose-500/40 bg-rose-500/15 text-rose-400',
      chip: 'low_stock',
    }
  }

  if (q <= STOCK_THRESHOLDS.FEW_REMAINING) {
    return {
      level: 'few',
      label: 'Few Remaining',
      message: `${q} available`,
      short: 'FEW REMAINING',
      dot: 'bg-amber-400',
      text: 'text-amber-400',
      badge: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
      chip: 'few_remaining',
    }
  }

  return {
    level: 'in',
    label: 'In Stock',
    message: `${q} available`,
    short: 'IN STOCK',
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
    badge: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
    chip: 'in_stock',
  }
}

/** Normalize the raw record (motorcycles have stock_quantity; older gear only has in_stock). */
export function stockOf(item: any): number {
  const q = Number(item?.stock_quantity)
  if (Number.isFinite(q) && q >= 0) return Math.floor(q)
  return item?.in_stock ? 10 : 0
}

export function isOutOfStock(item: any): boolean {
  return stockOf(item) <= STOCK_THRESHOLDS.OUT_OF_STOCK
}

export function stockOfStatus(item: any): StockStatus {
  return getStockStatus(stockOf(item))
}