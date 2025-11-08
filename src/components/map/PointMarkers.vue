<script setup lang="ts">
import { watch, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import type { PointArea } from '@/types/mapData'

interface Props {
  map: mapboxgl.Map | null
  points: PointArea[]
  visible: boolean
}

const props = defineProps<Props>()

const markers: mapboxgl.Marker[] = []

// Color mapping based on type
const getMarkerColor = (type: PointArea['type']): string => {
  const colorMap: Record<PointArea['type'], string> = {
    cold: '#5AB4C5', // primary500
    fire_safety: '#D45251', // red500
    air_pollution: '#FD853A', // orange500
    public_safety: '#F5BA4B' // secondary500
  }
  return colorMap[type] || '#5AB4C5'
}

const clearMarkers = () => {
  markers.forEach(marker => marker.remove())
  markers.length = 0
}

const showMarkers = () => {
  if (!props.map) return

  clearMarkers()

  props.points.forEach(spot => {
    const color = getMarkerColor(spot.type)
    
    // Create custom marker element
    const el = document.createElement('div')
    el.className = 'location-marker'
    el.style.width = '20px'
    el.style.height = '20px'
    el.style.borderRadius = '50%'
    el.style.backgroundColor = color
    el.style.border = '2px solid #fff'
    el.style.boxShadow = '0 2px 6px rgba(0,0,0,0.25)'
    el.style.cursor = 'pointer'

    // Create popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<div style="padding: 8px;">
        <h3 style="margin: 0 0 4px 0; font-weight: bold; color: ${color};">${spot.name}</h3>
        <p style="margin: 0; font-size: 12px; color: #666;">${spot.description || ''}</p>
      </div>`
    )

    // Create marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat([spot.lon, spot.lat])
      .setPopup(popup)
      .addTo(props.map!)

    markers.push(marker)
  })
}

watch(
  () => [props.visible, props.map],
  () => {
    if (props.visible && props.map) {
      showMarkers()
    } else {
      clearMarkers()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  clearMarkers()
})
</script>

<template></template>

