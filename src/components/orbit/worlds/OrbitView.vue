<template>
  <div class="orbit-view">
    <Teleport to="body">
      <ProjectionHeli v-if="heliClockExpand" :contract-key="storeAI.contract_key" @close="handleExpand" />
    </Teleport>
    <div class="orbit-stage">
      <OrbitHUD />

      <div class="world-canvas" 
        :class="{ 'dragging-active': orbitStore.draggingToolId }"
      >
        <!-- Draggable Cube Navigation -->
        <div 
          v-if="orbitStore.tools.cube"
          class="tool-grab-wrapper"
          :style="{ left: orbitStore.tools.cube.x + '%', top: orbitStore.tools.cube.y + '%', zIndex: orbitStore.draggingToolId === 'cube' ? 300 : 100 }"
          @mousedown.stop="startDragging('cube')"
        >
          <CubeStructure />
        </div>

       <div 
          v-if="orbitStore.tools.pulse"
          class="tool-grab-wrapper"
          :style="{ left: orbitStore.tools.pulse.x + '%', top: orbitStore.tools.pulse.y + '%', zIndex: orbitStore.draggingToolId === 'pulse' ? 300 : 100 }"
          @mousedown.stop="startDragging('pulse')"
        >
          <!-- ghost of live resPulse -->
           <div id="pulse-state" v-if="pulseState === 'ghost'">
            <ResonancePulseghost />
           </div>
           <div v-else>
              <ResonancePulse />
           </div>
        </div>

        <div 
          v-if="isCalibrated === true"
          class="tool-grab-wrapper"
          :style="{ left: orbitStore.tools.heli.x + '%', top: orbitStore.tools.heli.y + '%', zIndex: orbitStore.draggingToolId === 'heli' ? 300 : 100 }"
          @mousedown.stop="startDragging('heli')"
        >
          <StartClock :mini="isMini" @expand="handleExpand()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import StartClock from '@/components/orbit/clock/HeliStart.vue'
import ProjectionHeli from '@/components/orbit/clock/projectionHeli.vue'
import ResonancePulse from '@/components/orbit/resonance/ResonancePulse.vue'
import ResonancePulseghost from '@/components/orbit/resonance/ResonancePulseghost.vue'
import CubeStructure from '@/components/orbit/cueCude/cubeStructure.vue'
import OrbitHUD from '@/components/orbit/parts/OrbitHUD.vue'

import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { useOrbitStore } from '@/stores/orbitStore.js'
import { diaryStore } from '@/stores/diaryStore.js';

const storeAI = aiInterfaceStore();
const orbitStore = useOrbitStore();
const storeDiary = diaryStore()

const props = defineProps({
  mini: { type: Boolean, default: false }
});

const isMini = computed(() => props.mini || !heliClockExpand);

/* Computed Logic */
const isCalibrated = computed(() => storeDiary.heliClockSet);
const pulseState = computed(() => {
    if (storeAI.currentMode === 'zen') {
      return 'ghost'
    } else  {
      return 'alive'
    }
});

const heliClockExpand = computed(() => orbitStore.expandedHeliClock);
const extractedData = computed(() => storeAI.extractedData);

/* methods*/
const handleExpand = () => {
  // expanded.value = !expanded.value;
  orbitStore.expandedHeliClock= !orbitStore.expandedHeliClock;
  
  // Update the store so the Bottom Panel or Left Panel can react
  if (heliClockExpand) {
    storeAI.currentMode = 'projecting'; // This could trigger the Bottom Panel
    storeAI.chatAttention = 'future-timeline';
  } else {
    storeAI.currentMode = 'zen';
  }
};

/* CORE DRAG ENGINE */
const handleGlobalDrag = (e) => {
  if (orbitStore.draggingToolId) {
    const stage = document.querySelector('.orbit-stage');
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    const x = ((e.clientX - bounds.left) / bounds.width) * 100;
    const y = ((e.clientY - bounds.top) / bounds.height) * 100;
    orbitStore.updatePosition(orbitStore.draggingToolId, x, y);
  }
};

const startDragging = (id) => {
  orbitStore.startDragging(id);
  window.addEventListener('mousemove', handleGlobalDrag);
  window.addEventListener('mouseup', stopDragging);
};

const stopDragging = () => {
  orbitStore.stopDragging();
  window.removeEventListener('mousemove', handleGlobalDrag);
  window.removeEventListener('mouseup', stopDragging);
};

onUnmounted(() => {
  window.removeEventListener('mousemove', handleGlobalDrag);
  window.removeEventListener('mouseup', stopDragging);
});
</script>

<style scoped>
.orbit-view {
  width: 100%;
  height: 100%;
  position: relative;
}

.orbit-stage {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.world-canvas {
  width: 100%;
  height: 100%;
  position: relative;
}

.static-cube-nav {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 200;
}

.tool-grab-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: transform 0.1s ease-out;
}

.tool-grab-wrapper:active {
  cursor: grabbing;
}

.dragging-active .tool-grab-wrapper {
  pointer-events: none;
}

.dragging-active .tool-grab-wrapper:has(:active) {
  pointer-events: auto;
}
</style>
