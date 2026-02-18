<template>
  <div 
    class="bottom-panel overlay-blur"
    :class="{ 'is-dragging': isDragging }"
    :style="{ height: height + 'px' }"
  >
    <button
      @mousedown.stop="handleMouseDown"
      @click="handleToggle"
      class="bottom-toggle-button"
    >
      <div class="handle-bar"></div>
    </button>

    <div v-show="height > 80" class="bottom-panel-content">
      <besearch-detail v-if="showBesearchDetail === true"></besearch-detail>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BesearchDetail from '@/components/besearch/interventions/besearchDetail.vue'

import { besearchStore } from '@/stores/besearchStore.js'

const storeBesearch = besearchStore()

const props = defineProps({
  height: Number,
  isOpen: Boolean,
  isDragging: Boolean
});

const emit = defineEmits(['startDrag', 'update:height', 'update:isOpen']);

const dragStartTime = ref(0)

/* computed */
const showBesearchDetail = computed(() => {
  return storeBesearch.showBesearchDetail
})


/* methods */
const handleMouseDown = (e) => {
  dragStartTime.value = Date.now()
  emit('startDrag')
}

const handleToggle = () => {
  const duration = Date.now() - dragStartTime.value
  // If it was a quick click, toggle
  if (duration < 200) {
    const nextState = !props.isOpen;
    emit('update:isOpen', nextState);
    emit('update:height', nextState ? 400 : 60);
  }
};
</script>

<style scoped>
.bottom-panel {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(15px);
  border-top: 1px solid rgba(185, 173, 207, 0.2);
  z-index: 600;
  display: flex;
  flex-direction: column;
  transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;
}

.bottom-panel.is-dragging {
  transition: none;
}

.bottom-toggle-button {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 24px;
  background: #9e71e7;
  border: none;
  border-radius: 12px;
  cursor: ns-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 -2px 10px rgba(158, 113, 231, 0.3);
  z-index: 1610;
}

.handle-bar {
  width: 30px;
  height: 4px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2px;
}

.bottom-panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
</style>
