<script setup lang="ts">
import { computed } from 'vue'
import type { LayerType } from '@/types/mapData'

interface Props {
  activeLayer: LayerType
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectLayer: [layer: 'points' | 'regions']
  close: []
}>()

const isPointsActive = computed(() => props.activeLayer === 'points')
const isRegionsActive = computed(() => props.activeLayer === 'regions')

const handlePointClick = () => {
  emit('selectLayer', 'points')
  emit('close')
}

const handleRegionClick = () => {
  emit('selectLayer', 'regions')
  emit('close')
}
</script>

<template>
  <div class="py-2">
    <h2 class="text-xl font-bold text-[#171B1D] mb-5 text-center">選擇圖層</h2>

    <div class="flex flex-col gap-3">
      <button
        class="flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200"
        :class="[
          isPointsActive
            ? 'border-[#5AB4C5] bg-[#EDF8FA]'
            : 'border-[#E3E7E9] bg-white hover:border-[#5AB4C5] hover:bg-[#EDF8FA]'
        ]"
        @click="handlePointClick"
      >
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200"
          :class="[
            isPointsActive
              ? 'bg-[#5AB4C5] text-white'
              : 'bg-[#DBF1F5] text-[#5AB4C5]'
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="8" />
          </svg>
        </div>
        <div class="text-left flex-1">
          <h3 class="text-base font-semibold text-[#171B1D] m-0 mb-1">點區域</h3>
          <p class="text-sm text-[#738995] m-0">涼適點 (Cold Spots)</p>
        </div>
      </button>

      <button
        class="flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200"
        :class="[
          isRegionsActive
            ? 'border-[#5AB4C5] bg-[#EDF8FA]'
            : 'border-[#E3E7E9] bg-white hover:border-[#5AB4C5] hover:bg-[#EDF8FA]'
        ]"
        @click="handleRegionClick"
      >
        <div
          class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200"
          :class="[
            isRegionsActive
              ? 'bg-[#5AB4C5] text-white'
              : 'bg-[#DBF1F5] text-[#5AB4C5]'
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        </div>
        <div class="text-left flex-1">
          <h3 class="text-base font-semibold text-[#171B1D] m-0 mb-1">範圍區域</h3>
          <p class="text-sm text-[#738995] m-0">舒適區域 (Comfort Zones)</p>
        </div>
      </button>
    </div>
  </div>
</template>

