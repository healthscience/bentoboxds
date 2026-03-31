<template>
  <div id="orbit-hud">
    <div class="hud-top">
      <div class="metric">
        <span>Be</span><strong>{{ activeLifeStrapName }}</strong>
      </div>
      <div class="metric">
        <span>LIFE-STRAPS</span><strong>{{ countLifeStraps }}</strong>
      </div>
      <div class="metric"><span>BESEARCH</span><strong>0</strong></div>
      <div class="metric"><span>DIALOGUE</span><strong>0</strong></div>
      <div class="metric"><span>CUES</span><strong>0</strong></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { libraryStore } from "@/stores/libraryStore.js";
import { compute } from "three/src/nodes/gpgpu/ComputeNode.js";

const storeAI = aiInterfaceStore();
const storeLibrary = libraryStore();

/* Get the active life-strap name */
const activeLifeStrapName = computed(() => {
  const activeId = storeAI.activeLifeStrapID;
  if (!activeId) return "---";

  // Find the strap in library by matching the ID or original ID
  const strap = storeLibrary.straps.find(
    (s) => s.id === activeId || s.id === storeAI.activeLifeStrapID
  );

  if (strap) return strap.name;
  return activeId;
});

const countLifeStraps = computed(() => {
  return storeLibrary.straps.length;
});
</script>

<style scoped>
#orbit-hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 500;
}

.hud-top {
  display: flex;
  justify-content: center;
  gap: 4rem;
  padding: 2rem;
  z-index: 10;
  pointer-events: auto;
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
  font-size: 1.1rem;
  color: rgb(34, 13, 228);
  font-family: "Space Mono", monospace;
}
</style>
