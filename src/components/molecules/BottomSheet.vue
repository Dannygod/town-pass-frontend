<template>
  <transition name="bottom-sheet">
    <div v-if="isShow" class="bottom-sheet-mask" @click="handleMaskClick">
      <div class="bottom-sheet-container" @click.stop>
        <div class="bottom-sheet-header">
          <div class="bottom-sheet-handle"></div>
        </div>
        <div class="bottom-sheet-body">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
const props = defineProps({
  isShow: {
    type: Boolean,
    default: false
  },
  closeOnMaskClick: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:isShow', 'close'])

const handleMaskClick = () => {
  if (props.closeOnMaskClick) {
    emit('update:isShow', false)
    emit('close')
  }
}
</script>

<style scoped>
.bottom-sheet-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  transition: opacity 0.3s ease;
}

.bottom-sheet-container {
  width: 100%;
  background-color: #fff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -2px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.bottom-sheet-header {
  padding: 12px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-sheet-handle {
  width: 40px;
  height: 4px;
  background-color: #d1d5db;
  border-radius: 2px;
}

.bottom-sheet-body {
  padding: 0 24px 32px 24px;
  overflow-y: auto;
}

/* Transition animations */
.bottom-sheet-enter-active,
.bottom-sheet-leave-active {
  transition: opacity 0.3s ease;
}

.bottom-sheet-enter-from,
.bottom-sheet-leave-to {
  opacity: 0;
}

.bottom-sheet-enter-active .bottom-sheet-container {
  transition: transform 0.3s ease;
}

.bottom-sheet-enter-from .bottom-sheet-container {
  transform: translateY(100%);
}

.bottom-sheet-leave-to .bottom-sheet-container {
  transform: translateY(100%);
}
</style>
