<script setup lang="ts">
import { watch, onUnmounted } from 'vue'
import mapboxgl from 'mapbox-gl'
import type { PolygonRegion } from '@/types/mapData'

interface Props {
  map: mapboxgl.Map | null
  regions: PolygonRegion[]
  visible: boolean
}

const props = defineProps<Props>()

const clearRegions = () => {
  if (!props.map) return

  props.regions.forEach(region => {
    if (props.map!.getLayer(`region-fill-${region.id}`)) {
      props.map!.removeLayer(`region-fill-${region.id}`)
    }
    if (props.map!.getLayer(`region-outline-${region.id}`)) {
      props.map!.removeLayer(`region-outline-${region.id}`)
    }
    if (props.map!.getSource(`region-${region.id}`)) {
      props.map!.removeSource(`region-${region.id}`)
    }
  })
}

const showRegions = () => {
  if (!props.map) return

  clearRegions()

  props.regions.forEach(region => {
    // Convert coordinates to GeoJSON format
    const coordinates = region.coordinates.map(coord => [coord.lon, coord.lat])
    // Close the polygon
    coordinates.push(coordinates[0])

    // Add source
    props.map!.addSource(`region-${region.id}`, {
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
    props.map!.addLayer({
      id: `region-fill-${region.id}`,
      type: 'fill',
      source: `region-${region.id}`,
      paint: {
        'fill-color': region.color,
        'fill-opacity': region.fillOpacity || 0.3
      }
    })

    // Add outline layer
    props.map!.addLayer({
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
    props.map!.on('click', `region-fill-${region.id}`, (e) => {
      if (!e.features || !e.features[0]) return

      const feature = e.features[0]
      const props = feature.properties

      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `<div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold; color: ${region.color};">${props.name}</h3>
            <p style="margin: 0; font-size: 12px; color: #666;">${props.description || ''}</p>
          </div>`
        )
        .addTo(props.map!)
    })

    // Change cursor on hover
    props.map!.on('mouseenter', `region-fill-${region.id}`, () => {
      if (props.map) props.map.getCanvas().style.cursor = 'pointer'
    })
    props.map!.on('mouseleave', `region-fill-${region.id}`, () => {
      if (props.map) props.map.getCanvas().style.cursor = ''
    })
  })
}

watch(
  () => [props.visible, props.map],
  () => {
    if (props.visible && props.map) {
      showRegions()
    } else {
      clearRegions()
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  clearRegions()
})
</script>

<template></template>

