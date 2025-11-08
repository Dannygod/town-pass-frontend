<script setup lang="ts">
// Layer selection UI with grouped buttons (no click logic yet)
type Item = {
  key: string
  label: string
  color: string
  icon: 'marker' | 'fire' | 'heart' | 'thermo' | 'cloud' | 'wave'
}

const placeItems: Item[] = [
  { key: 'cold_spots', label: '涼適點', color: '#5AB4C5', icon: 'marker' },
  { key: 'fire_noncompliant', label: '消防不合格場所', color: '#F87171', icon: 'fire' },
  { key: 'aed', label: 'AED', color: '#22C55E', icon: 'heart' }
]

const areaItems: Item[] = [
  { key: 'heat_index', label: '熱傷害指數', color: '#FB923C', icon: 'thermo' },
  { key: 'aqi', label: 'AQI', color: '#7C3AED', icon: 'cloud' },
  { key: 'temp_diff_alert', label: '溫差提醒指數', color: '#0EA5E9', icon: 'wave' }
]
</script>

<template>
  <div class="py-2 pb-2 px-6">
    <!-- B. 區域 -->
    <h2 class="text-base font-bold text-[#171B1D] mb-3">區域</h2>
    <div class="grid grid-cols-3 gap-4">
      <button
        v-for="item in areaItems"
        :key="item.key"
        type="button"
        class="group flex flex-col items-center text-center"
      >
        <div
          class="w-16 h-16 rounded-xl bg-white border border-[#E3E7E9] p-2 flex items-center justify-center shadow-sm transition-all group-hover:shadow-md"
        >
          <svg v-if="item.icon === 'thermo'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10" :style="{ color: item.color }" fill="currentColor">
            <path d="M15 14.5V5a3 3 0 1 0-6 0v9.5a4.5 4.5 0 1 0 6 0ZM12 20a2.5 2.5 0 0 1-1-4.8V5a1 1 0 0 1 2 0v10.2A2.5 2.5 0 0 1 12 20Z"/>
          </svg>
          <svg v-else-if="item.icon === 'cloud'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10" :style="{ color: item.color }" fill="currentColor">
            <path d="M7 18a5 5 0 1 1 1.3-9.8A6 6 0 0 1 19 10a4 4 0 1 1 0 8H7Z"/>
          </svg>
          <svg v-else-if="item.icon === 'wave'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-10 h-10" :style="{ color: item.color }" fill="currentColor">
            <path d="M3 12c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2v2c-2 0-2-2-4-2s-2 2-4 2-2-2-4-2-2 2-4 2v-2Z"/>
          </svg>
        </div>
        <span class="mt-2 text-xs text-[#171B1D]">{{ item.label }}</span>
      </button>
    </div>
  </div>
</template>

