<script setup lang="ts">
import BasicMap from '@/components/BasicMap.vue'
</script>

<template>
  <BasicMap class="full-viewport-map" />
</template>

<style scoped>
.full-viewport-map {
  position: fixed;
  inset: 0;
}
</style>
