<script setup lang="ts">
import type { PointArea } from '@/types/mapData'

interface Props {
  locations: PointArea[]
  title: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectLocation: [location: PointArea]
}>()

const handleLocationClick = (location: PointArea) => {
  emit('selectLocation', location)
}
</script>

<template>
  <div class="py-2">
    <h2 class="text-xl font-bold text-[#171B1D] mb-4 text-center">{{ title }}</h2>
    
    <div class="space-y-2">
      <button
        v-for="location in locations"
        :key="location.id"
        class="w-full text-left p-4 rounded-xl border-2 border-[#E3E7E9] bg-white hover:border-[#5AB4C5] hover:bg-[#EDF8FA] transition-all duration-200"
        @click="handleLocationClick(location)"
      >
        <h3 class="text-base font-semibold text-[#171B1D] mb-1">{{ location.name }}</h3>
        <p v-if="location.description" class="text-sm text-[#738995] m-0">
          {{ location.description }}
        </p>
      </button>
    </div>
  </div>
</template>

