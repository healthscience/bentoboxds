<template>
  <div class="orbit-view">
    <Teleport to="body">
      <ProjectionHeli v-if="isExpanded" :contract-key="storeAI.contract_key" @close="handleExpand" />
    </Teleport>
    <div class="orbit-stage">
      <div class="hud-top">
        <div class="metric"><span>BESEARCH</span><strong>3</strong></div>
        <div class="metric"><span>DIALOGUE</span><strong>3</strong></div>
        <div class="metric"><span>CUES</span><strong>1234</strong></div>
      </div>

      <div class="world-canvas" 
        :class="{ 'dragging-active': orbitStore.draggingToolId }"
      >
       <div 
          v-if="orbitStore.tools.pulse"
          class="tool-grab-wrapper"
          :style="{ left: orbitStore.tools.pulse.x + '%', top: orbitStore.tools.pulse.y + '%', zIndex: orbitStore.draggingToolId === 'pulse' ? 300 : 100 }"
          @mousedown.stop="startDragging('pulse')"
        >
          <ResonancePulse />
        </div>

        <div 
          v-if="orbitStore.tools.heli"
          class="tool-grab-wrapper"
          :style="{ left: orbitStore.tools.heli.x + '%', top: orbitStore.tools.heli.y + '%', zIndex: orbitStore.draggingToolId === 'heli' ? 300 : 100 }"
          @mousedown.stop="startDragging('heli')"
          @mouseup.stop
          @click.stop
        >
        <HeliClock :mini="isMini" @expand="handleExpand()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue';
import HeliClock from '@/components/orbit/clock/HeliClock.vue';
import ProjectionHeli from '@/components/orbit/clock/projectionHeli.vue'
import ResonancePulse from '@/components/orbit/resonance/ResonancePulse.vue'

import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { useOrbitStore } from '@/stores/orbitStore.js'

const storeAI = aiInterfaceStore();
const orbitStore = useOrbitStore();

const props = defineProps({
  mini: { type: Boolean, default: false }
});

const expanded = ref(false);
const isMini = computed(() => props.mini || !expanded.value);
const isExpanded = ref(false)

/* Computed Logic */
const extractedData = computed(() => storeAI.extractedData);

/* methods*/
const handleExpand = () => {
  // expanded.value = !expanded.value;
  isExpanded.value = !isExpanded.value;
  
  // Update the store so the Bottom Panel or Left Panel can react
  if (isExpanded.value) {
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
    let xPerc = ((e.clientX - bounds.left) / bounds.width) * 100;
    let yPerc = ((e.clientY - bounds.top) / bounds.height) * 100;
    orbitStore.updatePosition(orbitStore.draggingToolId, xPerc, yPerc);
  }
};

const stopDragging = () => {
  if (orbitStore.draggingToolId) {
    orbitStore.stopDragging();
    window.removeEventListener('mousemove', handleGlobalDrag);
    window.removeEventListener('mouseup', stopDragging);
  }
};

const startDragging = (id) => {
  console.log('OrbitView: startDragging', id)
  orbitStore.startDragging(id);
  window.addEventListener('mousemove', handleGlobalDrag);
  window.addEventListener('mouseup', stopDragging);
};

onUnmounted(() => {
  window.removeEventListener('mousemove', handleGlobalDrag);
  window.removeEventListener('mouseup', stopDragging);
});

/* LAYOUT HELPERS */
/*const dynamicGridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `${panelWidth.value}px 1fr ${chatWidth.value}px`,
  gridTemplateRows: '100vh',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  gridTemplateAreas: '"tools stage chat"'
}));
*/
</script>

<style scoped>
.orbit-view {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* 2. CENTER STAGE: 3-Row Vertical Logic */
.orbit-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: white;
}

.hud-top {
  display: flex;
  justify-content: center;
  gap: 4rem;
  padding: 2rem;
  z-index: 10;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric span {
  font-size: 0.6rem;
  font-weight: 800;
  color: var(--sov-accent);
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}

.metric strong {
  font-size: 1.5rem;
  color: rgb(34, 13, 228);
  font-family: 'Space Mono', monospace;
}

.world-canvas {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.tool-grab-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: grab;
  transition: transform 0.2s ease;
}

.tool-grab-wrapper:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.05);
}

.dragging-active .tool-grab-wrapper {
  pointer-events: none;
}

.dragging-active .tool-grab-wrapper[style*="zIndex: 300"] {
  pointer-events: all;
}
</style>
