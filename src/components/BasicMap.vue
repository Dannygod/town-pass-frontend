<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import BottomSheet from './molecules/BottomSheet.vue'
import { mockColdSpots, mockPolygonRegions } from '@/data/mockMapData'
import type { LayerType } from '@/types/mapData'

const mapContainer = ref<HTMLDivElement | null>(null)
let map: mapboxgl.Map | null = null

// Bottom sheet state
const showLayerSheet = ref(false)

// Active layer state
const activeLayer = ref<LayerType>('none')

// Markers storage
const markers: mapboxgl.Marker[] = []

// Initialize map
onMounted(() => {
  const token = import.meta.env.VITE_MAPBOX_API_KEY
  if (!token) {
    console.warn('VITE_MAPBOX_API_KEY is not set')
  }
  mapboxgl.accessToken = token ?? ''

  if (!mapContainer.value) {
    return
  }

  map = new mapboxgl.Map({
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [121.56, 25.03],
    zoom: 15,
    minZoom: 6,
    maxZoom: 18,
    dragRotate: false,
    maxBounds: [
      [120.0, 21.8],
      [122.1, 25.4],
    ],
  })

  map.touchZoomRotate.disableRotation()
  map.touchPitch.disable()

  map.on('load', () => {
    if (!map) {
      return
    }

    if (!map.getSource('mrt-routes')) {
      map.addSource('mrt-routes', {
        type: 'geojson',
        data: '/data/routes.geojson',
      })
    }

    if (!map.getLayer('mrt-routes-layer')) {
      map.addLayer({
        id: 'mrt-routes-layer',
        type: 'line',
        source: 'mrt-routes',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-width': 4,
          'line-color': [
            'match',
            ['get', 'RouteName'],
            '信義線', '#f9000f',
            '淡水線', '#f9000f',
            '木柵線', '#ce8d13',
            '內湖線', '#ce8d13',
            '蘆洲線', '#ffb600',
            '新莊線', '#ffb600',
            '中和線', '#ffb600',
            '板橋線', '#006bc2',
            '南港線', '#006bc2',
            '小南門線', '#008c5a',
            '松山線', '#008c5a',
            '新店線', '#008c5a',
            '碧潭支線', '#d0e300',
            '#808080',
          ],
        },
      })
    }
  })
})

// Toggle layer sheet
const toggleLayerSheet = () => {
  showLayerSheet.value = !showLayerSheet.value
}

// Clear all markers
const clearMarkers = () => {
  markers.forEach(marker => marker.remove())
  markers.length = 0
}

// Clear all regions (polygon layers)
const clearRegions = () => {
  if (!map) return

  mockPolygonRegions.forEach(region => {
    if (map.getLayer(`region-fill-${region.id}`)) {
      map.removeLayer(`region-fill-${region.id}`)
    }
    if (map.getLayer(`region-outline-${region.id}`)) {
      map.removeLayer(`region-outline-${region.id}`)
    }
    if (map.getSource(`region-${region.id}`)) {
      map.removeSource(`region-${region.id}`)
    }
  })
}

// Show point markers (cold spots)
const showPointMarkers = () => {
  if (!map) return

  clearMarkers()

  mockColdSpots.forEach(spot => {
    // Create custom marker element
    const el = document.createElement('div')
    el.className = 'cold-spot-marker'
    el.style.width = '32px'
    el.style.height = '32px'
    el.style.borderRadius = '50%'
    el.style.backgroundColor = '#5AB4C5'
    el.style.border = '3px solid #fff'
    el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'
    el.style.cursor = 'pointer'

    // Create popup
    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<div style="padding: 8px;">
        <h3 style="margin: 0 0 4px 0; font-weight: bold; color: #5AB4C5;">${spot.name}</h3>
        <p style="margin: 0; font-size: 12px; color: #666;">${spot.description || ''}</p>
      </div>`
    )

    // Create marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat([spot.lon, spot.lat])
      .setPopup(popup)
      .addTo(map)

    markers.push(marker)
  })
}

// Show polygon regions
const showPolygonRegions = () => {
  if (!map) return

  clearRegions()

  mockPolygonRegions.forEach(region => {
    // Convert coordinates to GeoJSON format
    const coordinates = region.coordinates.map(coord => [coord.lon, coord.lat])
    // Close the polygon
    coordinates.push(coordinates[0])

    // Add source
    map.addSource(`region-${region.id}`, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [coordinates]
        },
        properties: {
          name: region.name,
          description: region.description
        }
      }
    })

    // Add fill layer
    map.addLayer({
      id: `region-fill-${region.id}`,
      type: 'fill',
      source: `region-${region.id}`,
      paint: {
        'fill-color': region.color,
        'fill-opacity': region.fillOpacity || 0.3
      }
    })

    // Add outline layer
    map.addLayer({
      id: `region-outline-${region.id}`,
      type: 'line',
      source: `region-${region.id}`,
      paint: {
        'line-color': region.color,
        'line-width': 2,
        'line-opacity': 0.8
      }
    })

    // Add click event for popup
    map.on('click', `region-fill-${region.id}`, (e) => {
      if (!e.features || !e.features[0]) return

      const feature = e.features[0]
      const props = feature.properties

      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `<div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold;"
                style="color: ${region.color};">${props.name}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">${props.description || ''}</p>
          </div>`
        )
        .addTo(map)
    })

    // Change cursor on hover
    map.on('mouseenter', `region-fill-${region.id}`, () => {
      if (map) map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mouseleave', `region-fill-${region.id}`, () => {
      if (map) map.getCanvas().style.cursor = ''
    })
  })
}

// Handle layer selection
const selectPointLayer = () => {
  if (activeLayer.value === 'points') {
    // Toggle off
    activeLayer.value = 'none'
    clearMarkers()
  } else {
    // Show points only
    activeLayer.value = 'points'
    clearRegions()
    showPointMarkers()
  }
  showLayerSheet.value = false
}

const selectRegionLayer = () => {
  if (activeLayer.value === 'regions') {
    // Toggle off
    activeLayer.value = 'none'
    clearRegions()
  } else {
    // Show regions only
    activeLayer.value = 'regions'
    clearMarkers()
    showPolygonRegions()
  }
  showLayerSheet.value = false
}

onUnmounted(() => {
  clearMarkers()
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div class="map-wrapper">
    <div ref="mapContainer" class="map-container"></div>

    <!-- Layer Toggle Button (Top Right) -->
    <button
      class="layer-toggle-btn"
      @click="toggleLayerSheet"
      :class="{ active: activeLayer !== 'none' }"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    </button>

    <!-- Bottom Sheet for Layer Selection -->
    <BottomSheet v-model:isShow="showLayerSheet">
      <div class="layer-selection">
        <h2 class="layer-title">選擇圖層</h2>

        <div class="layer-buttons">
          <button
            class="layer-btn"
            :class="{ active: activeLayer === 'points' }"
            @click="selectPointLayer"
          >
            <div class="layer-btn-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="12" r="8"/>
              </svg>
            </div>
            <div class="layer-btn-text">
              <h3>點區域</h3>
              <p>涼適點 (Cold Spots)</p>
            </div>
          </button>

          <button
            class="layer-btn"
            :class="{ active: activeLayer === 'regions' }"
            @click="selectRegionLayer"
          >
            <div class="layer-btn-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2"/>
              </svg>
            </div>
            <div class="layer-btn-text">
              <h3>範圍區域</h3>
              <p>舒適區域 (Comfort Zones)</p>
            </div>
          </button>
        </div>
      </div>
    </BottomSheet>
  </div>
</template>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-container {
  width: 100%;
  height: 100%;
}

/* Layer Toggle Button */
.layer-toggle-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #fff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475259;
  transition: all 0.2s ease;
  z-index: 100;
}

.layer-toggle-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
}

.layer-toggle-btn.active {
  background-color: #5AB4C5;
  color: #fff;
}

/* Layer Selection */
.layer-selection {
  padding: 8px 0;
}

.layer-title {
  font-size: 20px;
  font-weight: 700;
  color: #171B1D;
  margin: 0 0 20px 0;
  text-align: center;
}

.layer-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.layer-btn {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #E3E7E9;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.layer-btn:hover {
  border-color: #5AB4C5;
  background-color: #EDF8FA;
}

.layer-btn.active {
  border-color: #5AB4C5;
  background-color: #EDF8FA;
}

.layer-btn-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #DBF1F5;
  color: #5AB4C5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.layer-btn.active .layer-btn-icon {
  background-color: #5AB4C5;
  color: #fff;
}

.layer-btn-text {
  text-align: left;
  flex: 1;
}

.layer-btn-text h3 {
  font-size: 16px;
  font-weight: 600;
  color: #171B1D;
  margin: 0 0 4px 0;
}

.layer-btn-text p {
  font-size: 14px;
  color: #738995;
  margin: 0;
}
</style>
