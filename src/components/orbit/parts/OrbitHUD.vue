<template>
  <div id="orbit-hud">
    <div class="hud-top">
      <div class="hud-metrics">
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
      <div class="metric altruism-metric">
        <span>Altrusim</span><strong>help 20%</strong>
      </div>
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
  height: 100%;
  pointer-events: none;
  z-index: 500;
}

.hud-visor-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  /* 1. THE POLARIZED TINT */
  background: radial-gradient(
    circle at center,
    transparent 40%,
    rgba(0, 80, 150, 0.03) 100%
  );
  /* 2. THE INNER LENS REFLECTION */
  background-image: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.05) 0%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
  /* 3. PERIPHERAL DISTORTION (The 'Goggle' Frame) */
  box-shadow: inset 0 0 100px rgba(0, 0, 0, 0.1);
}

.hud-top {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4rem;
  padding: 1rem 3rem;
  margin: 1rem auto;
  width: fit-content;
  background: rgba(255, 255, 255, 0.16);
  border-radius: 16px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  z-index: 10;
  pointer-events: auto;
}

.hud-metrics {
  display: flex;
  gap: 4rem;
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
