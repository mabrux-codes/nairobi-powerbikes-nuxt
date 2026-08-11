export interface ImageItem {
  key: string
  url: string
  file?: File
  name?: string
  category?: string
}

export const MC_IMAGE_CATEGORIES = [
  'Overview', 'Engine', 'Fuel Tank', 'Brakes', 'Suspension', 'Wheels & Tyres',
  'Lights', 'Dashboard/Controls', 'Exhaust', 'Seat', 'Storage', 'Accessories',
  'Rear', 'Front', 'Side',
]

export const ACCESSORY_IMAGE_CATEGORIES = [
  'Helmet', 'Gloves', 'Luggage', 'Protection', 'Electronics', 'Riding Gear', 'Bike Accessories',
]

export const APPAREL_IMAGE_CATEGORIES = [
  'Jacket', 'Trousers', 'Gloves', 'Boots', 'Helmet', 'Riding Suit', 'Casual Wear',
]

export function buildImageItems(
  record: any,
  field = 'images',
  urlFor?: (rec: any, file: string) => string,
): { items: ImageItem[]; main: number } {
  const files: string[] = Array.isArray(record?.[field]) ? record[field] : (record?.[field] ? [record[field]] : [])
  const cats: string[] = Array.isArray(record?.image_categories) ? record.image_categories : []
  const items: ImageItem[] = files.map((name, i) => ({
    key: name,
    name,
    url: urlFor ? urlFor(record, name) : name,
    category: cats[i] || '',
  }))
  const main = Math.min(Math.max(Number(record?.main_image) || 0, 0), Math.max(0, items.length - 1))
  return { items, main }
}

/** Append images + metadata to a FormData payload for PocketBase. */
export function appendImagePayload(
  fd: FormData,
  items: ImageItem[],
  field = 'images',
): void {
  // keep existing files (send filename string), add new files
  for (const it of items) {
    if (it.file) fd.append(field, it.file)
    else if (it.name) fd.append(field, it.name)
  }
  const cats = items.map(it => it.category || '')
  fd.append('image_categories', JSON.stringify(cats))
}

/** First image filename from a file field that may be string or array. */
export function firstFile(record: any, field = 'images'): string {
  const v = record?.[field]
  if (Array.isArray(v)) return v[0] || ''
  return v || ''
}
