<script setup lang="ts">
import { watch, onUnmounted, computed, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import type { PointArea } from '@/types/mapData'

interface Props {
  map: mapboxgl.Map | null
  points: PointArea[]
  visible: boolean
}

const props = defineProps<Props>()

const markers: mapboxgl.Marker[] = []
const isUpdating = ref(false)

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

// 獲取 location_type 圖標 HTML
const getLocationTypeIcon = (locationType?: string): string => {
  if (locationType === '戶外') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/></svg>`
  } else if (locationType === '室內') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><path d="M11 20H2"/><path d="M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z"/><path d="M11 4H8a2 2 0 0 0-2 2v14"/><path d="M14 12h.01"/><path d="M22 20h-3"/></svg>`
  }
  return ''
}

const showMarkers = () => {
  if (!props.map || isUpdating.value) return
  
  isUpdating.value = true
  
  try {
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

    // 構建 popup HTML 內容
    let popupContent = `<div style="padding: 12px; min-width: 200px; max-width: 300px;">
      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
        <h3 style="margin: 0; font-weight: bold; color: ${color}; font-size: 14px;">${spot.name}</h3>
        ${spot.location_type ? getLocationTypeIcon(spot.location_type) : ''}
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #666;">`
    
    if (spot.address) {
      popupContent += `<div style="display: flex; gap: 8px;">
        <span style="font-weight: 500; min-width: 40px;">地址：</span>
        <span>${spot.address}</span>
      </div>`
    }
    
    if (spot.district_name) {
      popupContent += `<div style="display: flex; gap: 8px;">
        <span style="font-weight: 500; min-width: 40px;">區域：</span>
        <span>${spot.district_name}</span>
      </div>`
    }
    
    if (spot.open_hours) {
      popupContent += `<div style="display: flex; gap: 8px;">
        <span style="font-weight: 500; min-width: 40px;">時間：</span>
        <span style="white-space: pre-line;">${spot.open_hours}</span>
      </div>`
    }
    
    if (spot.facilities && spot.facilities.length > 0) {
      popupContent += `<div style="display: flex; gap: 8px;">
        <span style="font-weight: 500; min-width: 40px;">設施：</span>
        <span>${spot.facilities.join('、')}</span>
      </div>`
    }
    
    if (spot.notes) {
      popupContent += `<div style="display: flex; gap: 8px;">
        <span style="font-weight: 500; min-width: 40px;">備註：</span>
        <span style="white-space: pre-line;">${spot.notes}</span>
      </div>`
    }
    
    popupContent += `</div></div>`

    // Create popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent)

    // Create marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat([spot.lon, spot.lat])
      .setPopup(popup)
      .addTo(props.map!)

      markers.push(marker)
    })
  } finally {
    isUpdating.value = false
  }
}

// 使用 computed 來生成一個穩定的標識符，避免深度監聽導致的無限循環
// 使用所有 id 的組合來確保準確檢測變化
const pointsKey = computed(() => {
  if (!props.points || props.points.length === 0) return ''
  // 使用 points 的長度和所有 id 的組合來生成標識符
  const ids = props.points.map(p => p.id).join(',')
  return `${props.points.length}-${ids.substring(0, 100)}` // 限制長度避免過長
})

// 監聽 visible、map 和 pointsKey 的變化
watch(
  () => [props.visible, props.map, pointsKey.value],
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

