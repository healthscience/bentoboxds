<template>
  <div class="world-canvas-container" :class="activeWorld">world canvas {{ activeWorld }}
    <section class="world-layer-stack">
      <!-- orbit of cues and besearch -->
      <div v-show="activeWorld === 'orbit'" class="world-view orbit-grid">
        <OrbitView />
      </div>
      <!-- human body -->
      <div v-show="activeWorld === 'body'" class="world-view body-grid">
         <HumanWorld ref="humanWorldRef" />
      </div>
      <!-- earth nature & environment -->
      <div v-show="activeWorld === 'earth'" class="world-view earth-grid">
        <EarthEnvironment ref="earthEnvironmentRef" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import OrbitView from '@/components/orbit/worlds/OrbitView.vue';
import HumanWorld from '@/components/orbit/worlds/Cues-BodyWorld.vue';
import EarthEnvironment from '@/components/orbit/worlds/EarthEnvironment.vue';

import { aiInterfaceStore } from '@/stores/aiInterface.js';

  const storeAI = aiInterfaceStore();
  const humanWorldRef = ref(null);
  const earthEnvironmentRef = ref(null);

  const props = defineProps({
    tools: Object,
    draggingId: String,
    activeWorld: String // New Prop
  });

  /* computed */
  const activeWorld = computed(() => {
    return storeAI.activeWorld
  })

  const saveCue = (cueId) => {
    if (humanWorldRef.value) {
      humanWorldRef.value.saveCueLocation(cueId);
    }
  };

  const startDrawing = () => {
    if (storeAI.activeWorld === 'earth' && earthEnvironmentRef.value) {
      earthEnvironmentRef.value.startDrawing();
    }
  };

  const startTagging = () => {
    if (storeAI.activeWorld === 'earth' && earthEnvironmentRef.value) {
      earthEnvironmentRef.value.startTagging();
    }
  };

  defineExpose({ saveCue, startDrawing, startTagging });

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
  min-height: 0;
  position: absolute;
  top: 0;
  left: 0;
}

/* Force everything into the first cell to overlap */
.world-layer-stack,
.tool-interaction-layer {
  grid-area: 1 / 1; 
  display: grid;
  height: 100%;
  width: 100%;
}

/* WORLD VIEWS: Shared Layout */
.world-view {
  grid-area: 1 / 1;
  display: grid;
  place-items: center;
  transition: opacity 0.5s ease, transform 0.5s ease;
  width: 100%;
  height: 100%;
}

/* BODY WORLD: Specific Anatomy Grid */
.body-grid {
  background: radial-gradient(circle, rgba(255, 200, 200, 0.1) 0%, transparent 70%);
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}

.anatomy-silhouette {
  grid-area: torso;
  opacity: 0.2;
  filter: saturate(0.5);
}

/* EARTH WORLD: Specific Geographic Grid */
.earth-grid {
  background: radial-gradient(circle, rgba(200, 220, 255, 0.1) 0%, transparent 70%);
  width: 100%;
  height: 100%;
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