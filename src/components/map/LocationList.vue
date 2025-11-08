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

// 獲取 location_type 圖標
const getLocationTypeIcon = (locationType?: string) => {
  if (locationType === '戶外') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trees"><path d="M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"/></svg>`
  } else if (locationType === '室內') {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-door-open"><path d="M11 20H2"/><path d="M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z"/><path d="M11 4H8a2 2 0 0 0-2 2v14"/><path d="M14 12h.01"/><path d="M22 20h-3"/></svg>`
  }
  return null
}
</script>

<template>
  <div class="py-2">
    <h2 class="text-xl font-bold text-[#171B1D] mb-4 text-center">{{ title }}</h2>
    
    <div class="flex flex-col gap-2 my-1.5">
      <button
        v-for="location in locations"
        :key="location.id"
        class="w-full text-left p-4 rounded-xl border-2 border-[#E3E7E9] bg-white hover:border-[#5AB4C5] hover:bg-[#EDF8FA] transition-all duration-200"
        @click="handleLocationClick(location)"
      >
        <!-- 標題和類型圖標 -->
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-base font-semibold text-[#171B1D]">{{ location.name }}</h3>
          <span 
            v-if="location.location_type" 
            class="inline-flex items-center text-[#738995]"
            v-html="getLocationTypeIcon(location.location_type)"
          ></span>
        </div>
        
        <!-- 分段顯示描述信息 -->
        <div class="flex flex-col gap-1.5 text-sm text-[#738995]">
          <div v-if="location.address" class="flex items-start gap-1.5">
            <span class="font-medium min-w-[3rem]">地址：</span>
            <span>{{ location.address }}</span>
          </div>
          
          <div v-if="location.district_name" class="flex items-start gap-1.5">
            <span class="font-medium min-w-[3rem]">區域：</span>
            <span>{{ location.district_name }}</span>
          </div>
          
          <div v-if="location.open_hours" class="flex items-start gap-1.5">
            <span class="font-medium min-w-[3rem]">時間：</span>
            <span class="whitespace-pre-line">{{ location.open_hours }}</span>
          </div>
          
          <div v-if="location.facilities && location.facilities.length > 0" class="flex items-start gap-1.5">
            <span class="font-medium min-w-[3rem]">設施：</span>
            <span>{{ location.facilities.join('、') }}</span>
          </div>
          
          <div v-if="location.notes" class="flex items-start gap-1.5">
            <span class="font-medium min-w-[3rem]">備註：</span>
            <span class="whitespace-pre-line">{{ location.notes }}</span>
          </div>
        </div>
      </button>
    </div>
  </div>
</template>

