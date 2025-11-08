<script setup lang="ts">
import BasicMap from '@/components/BasicMap.vue'
</script>

<template>
  <div class="full-map-wrapper">
    <BasicMap />
  </div>
</template>

<style scoped>
.full-map-wrapper {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
