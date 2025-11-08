<script setup lang="ts">
import { computed } from 'vue'
import type { FilterType, FilterButton } from '@/types/mapData'

interface Props {
  filters: FilterButton[]
  activeFilter: FilterType | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  selectFilter: [filter: FilterType]
}>()

const handleFilterClick = (filterId: FilterType) => {
  emit('selectFilter', filterId)
}
</script>

<template>
  <div class="absolute top-4 left-4 right-20 z-[100] flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
    <button
      v-for="filter in filters"
      :key="filter.id"
      class="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap shadow-sm"
      :class="[
        props.activeFilter === filter.id
          ? 'bg-[#5AB4C5] text-white shadow-md'
          : 'bg-white text-[#475259] border border-[#E3E7E9] hover:border-[#5AB4C5] hover:text-[#5AB4C5]'
      ]"
      @click="handleFilterClick(filter.id)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>

