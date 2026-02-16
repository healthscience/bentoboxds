<template>
  <div class="world-canvas-container" :class="activeWorld">world canvas {{ activeWorld }}
    <section class="world-layer-stack">
      <div v-show="activeWorld === 'body'" class="world-view body-grid">
        <div class="anatomy-silhouette">body</div>
        <div class="bio-zones">
          <div class="zone heart"></div>
          <div class="zone lungs"></div>
        </div>
      </div>

      <div v-show="activeWorld === 'earth'" class="world-view earth-grid">
        <div class="map-projection">earth</div>
        <div class="geo-cues">
          <div class="meridian"></div>
          <div class="equator"></div>
        </div>
      </div>

      <div v-show="activeWorld === 'orbit'" class="world-view orbit-grid">
        <div class="celestial-plane">orit</div>
      </div>
    </section>

    <div class="tool-interaction-layer" :class="{ 'is-dragging': draggingId }">
      <div 
        v-if="tools.pulse"
        class="tool-wrapper"
        :style="{ gridArea: '1 / 1', transform: `translate(${tools.pulse.x}vw, ${tools.pulse.y}vh)` }"
        @mousedown.stop="$emit('startToolDrag', 'pulse')"
      >
        <ResonancePulse />
      </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ResonancePulse from '@/components/orbit/resonance/ResonancePulse.vue';

import { aiInterfaceStore } from '@/stores/aiInterface.js';

  const storeAI = aiInterfaceStore();

  const props = defineProps({
    tools: Object,
    draggingId: String,
    activeWorld: String // New Prop
  });

  /* computed */
  const activeWorld = computed(() => {
    return storeAI.activeWorld
  })

</script>

<style scoped>
/* THE STACKING CONTEXT */
.world-canvas-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

/* Force everything into the first cell to overlap */
.world-layer-stack,
.tool-interaction-layer {
  grid-area: 1 / 1; 
  display: grid;
}

/* WORLD VIEWS: Shared Layout */
.world-view {
  grid-area: 1 / 1;
  display: grid;
  place-items: center;
  transition: opacity 0.5s ease, transform 0.5s ease;
}

/* BODY WORLD: Specific Anatomy Grid */
.body-grid {
  background: radial-gradient(circle, rgba(255, 200, 200, 0.1) 0%, transparent 70%);
  grid-template-areas: "head" "torso" "base";
}

.anatomy-silhouette {
  grid-area: torso;
  opacity: 0.2;
  filter: saturate(0.5);
}

/* EARTH WORLD: Specific Geographic Grid */
.earth-grid {
  background: radial-gradient(circle, rgba(200, 220, 255, 0.1) 0%, transparent 70%);
  /* 12-column grid for mapping coordinates */
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
}

/* TOOL LAYER */
.tool-interaction-layer {
  z-index: 10;
  pointer-events: none;
}

.tool-wrapper {
  pointer-events: auto;
  cursor: grab;
  width: fit-content;
  height: fit-content;
}

.is-dragging {
  pointer-events: auto; /* Catch moves while dragging */
}
</style>