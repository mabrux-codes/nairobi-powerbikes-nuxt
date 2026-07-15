<template>
  <div ref="mapContainer" class="leaflet-map w-full" :style="{ height: height }" />
</template>

<script setup lang="ts">
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface BranchLocation { name: string; address?: string; phone?: string; hours?: string; lat: number; lng: number }

const props = withDefaults(defineProps<{ branches: BranchLocation[]; height?: string; zoom?: number }>(), { height: '400px', zoom: 12 })

const mapContainer = ref<HTMLElement | null>(null)
let map: L.Map | null = null

const redIcon = L.divIcon({
  html: '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#D6001C" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3" fill="#FFFFFF" stroke="none"/></svg>',
  className: 'custom-marker-icon', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -36],
})

onMounted(() => {
  if (!mapContainer.value || !props.branches.length) return
  map = L.map(mapContainer.value, { zoomControl: true, scrollWheelZoom: true })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19 }).addTo(map)
  const bounds = L.latLngBounds([])
  props.branches.forEach((branch) => {
    const marker = L.marker([branch.lat, branch.lng], { icon: redIcon }).addTo(map!)
    const popupContent = `<div class="leaflet-popup-brand"><h3 class="leaflet-popup-title">${branch.name}</h3>${branch.address ? `<p class="leaflet-popup-text">${branch.address}</p>` : ''}${branch.phone ? `<p class="leaflet-popup-text">${branch.phone}</p>` : ''}${branch.hours ? `<p class="leaflet-popup-text leaflet-popup-hours">${branch.hours.replace(/\n/g, '<br/>')}</p>` : ''}</div>`
    marker.bindPopup(popupContent, { className: 'leaflet-popup-brand-wrapper', maxWidth: 300 })
    bounds.extend([branch.lat, branch.lng])
  })
  if (props.branches.length === 1) map.setView([props.branches[0].lat, props.branches[0].lng], props.zoom)
  else map.fitBounds(bounds, { padding: [50, 50] })
})

onUnmounted(() => { if (map) { map.remove(); map = null } })
</script>

<style>
.leaflet-map { border-radius: 2px; z-index: 1; }
.custom-marker-icon { background: none !important; border: none !important; }
.leaflet-popup-brand-wrapper .leaflet-popup-content-wrapper { background: #1a1a1a; color: #f2f2f2; border-radius: 2px; border: 1px solid rgba(74, 74, 74, 0.3); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5); }
.leaflet-popup-brand-wrapper .leaflet-popup-tip { background: #1a1a1a; border: 1px solid rgba(74, 74, 74, 0.3); }
.leaflet-popup-brand-wrapper .leaflet-popup-content { margin: 12px 16px; }
.leaflet-popup-title { font-family: 'Sakana', sans-serif; font-size: 1.125rem; letter-spacing: 0.04em; color: #D6001C; margin-bottom: 6px; line-height: 1.2; }
.leaflet-popup-text { font-size: 0.8125rem; color: #b0b0b0; margin: 4px 0; line-height: 1.4; }
.leaflet-popup-hours { color: #f2f2f2; font-size: 0.75rem; }
</style>
