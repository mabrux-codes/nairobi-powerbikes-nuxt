import {
  Bell, CalendarCheck, Wrench, Bike, Users, Shield, Settings, Image as ImageIcon,
  LogIn, MessageSquare, Package, Wallet, FileText, BadgePercent, Megaphone, Newspaper,
} from 'lucide-vue-next'
import type { Component } from 'vue'

export interface NotifMeta {
  icon: Component
  bg: string
  color: string
  label: string
}

export const NOTIF_META: Record<string, NotifMeta> = {
  booking: { icon: CalendarCheck, bg: 'bg-blue-500/15', color: 'text-blue-400', label: 'Booking' },
  service: { icon: Wrench, bg: 'bg-blue-500/15', color: 'text-blue-400', label: 'Service' },
  test_ride: { icon: Bike, bg: 'bg-sky-500/15', color: 'text-sky-400', label: 'Test Ride' },
  testimonial: { icon: MessageSquare, bg: 'bg-green-500/15', color: 'text-green-400', label: 'Testimonial' },
  contact: { icon: MessageSquare, bg: 'bg-green-500/15', color: 'text-green-400', label: 'Message' },
  offer: { icon: BadgePercent, bg: 'bg-amber-500/15', color: 'text-amber-400', label: 'Offer' },
  system: { icon: Settings, bg: 'bg-brand-grey/15', color: 'text-brand-grey/60', label: 'System' },
  message: { icon: MessageSquare, bg: 'bg-violet-500/15', color: 'text-violet-400', label: 'Message' },
  general: { icon: Megaphone, bg: 'bg-brand-grey/15', color: 'text-brand-grey/60', label: 'Update' },
  media: { icon: ImageIcon, bg: 'bg-pink-500/15', color: 'text-pink-400', label: 'Media' },
  user: { icon: Users, bg: 'bg-purple-500/15', color: 'text-purple-400', label: 'User' },
  staff: { icon: Shield, bg: 'bg-purple-500/15', color: 'text-purple-400', label: 'Staff' },
  auth: { icon: LogIn, bg: 'bg-brand-grey/15', color: 'text-brand-grey/60', label: 'Auth' },
  motorcycle: { icon: Bike, bg: 'bg-amber-500/15', color: 'text-amber-400', label: 'Motorcycle' },
  ecommerce: { icon: Package, bg: 'bg-emerald-500/15', color: 'text-emerald-400', label: 'Order' },
  stock: { icon: Package, bg: 'bg-rose-500/15', color: 'text-rose-400', label: 'Stock' },
  sale: { icon: Wallet, bg: 'bg-emerald-500/15', color: 'text-emerald-400', label: 'Sale' },
  payment: { icon: FileText, bg: 'bg-sky-500/15', color: 'text-sky-400', label: 'Payment' },
  finance: { icon: BadgePercent, bg: 'bg-violet-500/15', color: 'text-violet-400', label: 'Financing' },
  blog: { icon: Newspaper, bg: 'bg-amber-500/15', color: 'text-amber-400', label: 'Blog' },
}

export function notifMeta(type: string): NotifMeta {
  return NOTIF_META[type] || NOTIF_META.system
}

export function notifLabel(type: string): string {
  return notifMeta(type).label
}
