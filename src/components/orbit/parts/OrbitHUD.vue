<template>
  <div
    id="orbit-hud"
    :class="{
      'is-expanded': isExpanded,
      'lens-active': storeBesearch.besearchMode !== 'default',
      'has-strand': storeBesearch.strandMode,
    }"
  >
    <div class="hud-container">
      <div class="hud-top">
        <!-- 1. World / Context Icon -->
        <div class="hud-world-icon" @click="rotateHUUD">
          <span v-if="huudContext === 'world'">{{ worldIcon }}</span>
          <span v-else-if="huudContext === 'lens'">🔍</span>
          <span v-else-if="huudContext === 'lab'">🛠️</span>
          <span v-else-if="huudContext === 'heli'">☀️</span>
        </div>

        <div class="hud-metrics">
          <!-- Layer 1: World Context -->
          <template v-if="huudContext === 'world'">
            <div class="metric be-metric" @click="toggleLensLayer">
              <span>Be</span><strong>{{ activeLifeStrapName }}</strong>
            </div>
            <div class="metric">
              <span>WORLD</span><strong>{{ activeWorldLabel }}</strong>
            </div>
            <template v-if="activeWorld === 'orbit'">
              <div class="metric">
                <span>LIFE-STRAPS</span><strong>{{ countLifeStraps }}</strong>
              </div>
            </template>
            <template v-else-if="activeWorld === 'body'">
              <div class="metric"><span>VITALS</span><strong>NOMINAL</strong></div>
            </template>
            <template v-else-if="activeWorld === 'earth'">
              <div class="metric"><span>SCALE</span><strong>TERRAIN</strong></div>
            </template>
          </template>

          <!-- Layer 2: Lens / Story Context -->
          <template v-else-if="huudContext === 'lens'">
            <div class="metric story-summary" :class="{ long: isStoryLong }">
              <span>STORY</span><strong>{{ storySummary }}</strong>
            </div>
            <div class="metric">
              <span>STRANDS</span><strong>{{ strandCount }}</strong>
            </div>
            <div class="metric">
              <span>ATTUNE</span><strong>{{ attunementCount }}</strong>
            </div>
            <div class="metric">
              <span>CYCLES</span><strong>{{ cycleCount }}</strong>
            </div>
          </template>

          <!-- Layer 3: Sculpting Lab -->
          <template v-else-if="huudContext === 'lab'">
            <div class="metric"><span>LAB</span><strong>SCULPTING</strong></div>
            <div class="metric"><span>SEEDS</span><strong>4</strong></div>
            <div class="metric"><span>TUNING</span><strong>ACTIVE</strong></div>
          </template>

          <!-- Layer 4: Heli Projection -->
          <template v-else-if="huudContext === 'heli'">
            <div class="metric"><span>HELI</span><strong>PROJECTION</strong></div>
            <div class="metric"><span>PROJECTS</span><strong>2 ACTIVE</strong></div>
          </template>
        </div>

        <div class="hud-actions">
          <div class="rotation-controls">
            <button class="hud-rotate up" @click="storeBesearch.rotateHUUD('up')">
              ▲
            </button>
            <button
              class="hud-rotate down"
              @click="storeBesearch.rotateHUUD('down')"
            >
              ▼
            </button>
          </div>
          <button class="hud-toggle" @click="isExpanded = !isExpanded">
            {{ isExpanded ? "<" : ">" }}
          </button>
          <button
            class="hud-expand-down"
            :class="{ active: storeBesearch.besearchMode !== 'default' }"
            @click="toggleLensLayer"
          >
            {{ storeBesearch.besearchMode === "default" ? "↓" : "↑" }}
          </button>
        </div>
      </div>

      <!-- Persistent Line 2: Besearch Cycle & Workflow -->
      <div v-if="storeBesearch.besearchMode !== 'default'" class="hud-strand-line besearch-second-line">
        <div class="besearch-branding" @click="toggleLensLayer">
          <img src="@/assets/besearch-cycle.png" class="besearch-icon" />
          <span class="besearch-label">Besearch</span>
        </div>

        <div class="besearch-toggles">
          <div class="strand-toggle-wrapper">
            <span class="strand-label">Strand</span>
            <div 
              class="strand-slider" 
              :class="{ active: storeBesearch.strandMode }"
              @click="storeBesearch.strandMode = !storeBesearch.strandMode"
            >
              <div class="slider-knob"></div>
            </div>
          </div>

          <div class="strand-toggle-wrapper orgo-logic-wrapper">
            <span class="strand-label">Orgo</span>
            <div 
              class="strand-slider orgo-slider" 
              :class="{ active: storeBesearch.isOrgoLogic }"
              @click="storeBesearch.isOrgoLogic = !storeBesearch.isOrgoLogic"
            >
              <div class="slider-knob"></div>
            </div>
          </div>
        </div>

        <div class="workflow-stages">
          <div 
            v-for="stage in stages" 
            :key="stage.id"
            class="workflow-stage"
            :class="{ active: currentBesearchMode === stage.mode }"
            @click="setHUUDState(stage.mode)"
          >
            <span class="stage-number">{{ stage.id }}</span>
            <span class="stage-name">{{ stage.name }}</span>
            <span v-if="stage.id < 6" class="stage-arrow">──►</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { libraryStore } from "@/stores/libraryStore.js";
import { besearchStore } from "@/stores/besearchStore.js";

const storeAI = aiInterfaceStore();
const storeLibrary = libraryStore();
const storeBesearch = besearchStore();

const isExpanded = ref(false);

const stages = [
  { id: 1, name: "Grounded", mode: "lens" },
  { id: 2, name: "Heli", mode: "heli" },
  { id: 3, name: "Attunement", mode: "attunement" },
  { id: 4, name: "Grafting", mode: "graft" },
  { id: 5, name: "Emulation", mode: "emulation" },
  { id: 6, name: "Tinkering", mode: "tinker" }
];

const currentBesearchMode = computed(() => storeBesearch.besearchMode);
const huudContext = computed(() => storeBesearch.huudContext);
const activeWorld = computed(() => storeAI.activeWorld);

const worldIcon = computed(() => {
  const worlds = {
    orbit: "🌌",
    body: "👤",
    earth: "🌍",
  };
  return worlds[activeWorld.value] || "🌌";
});

const activeWorldLabel = computed(() => {
  return activeWorld.value.toUpperCase();
});

const storySummary = computed(() => {
  const story = storeBesearch.activeBesearchContext.story || "";
  console.log("HUD: activeBesearchContext.story is:", story);
  if (!story) return "NO STORY";
  return story.split(/\s+/).slice(0, 4).join(" ");
});

const strandCount = computed(() => {
  const pillars = storeAI.lifestrapTexture?.pillars || {};
  return (pillars.capacity?.length || 0) + (pillars.context?.length || 0);
});

const attunementCount = computed(() => {
  return storeAI.lifestrapTexture?.pillars?.attunement?.length || 0;
});

const cycleCount = computed(() => {
  return storeBesearch.besearchCyles?.length || 0;
});

const hasActiveStrand = computed(() => {
  return storeBesearch.strandMode && activeStrandItems.value.length > 0;
});

const activeStrandItems = computed(() => {
  const conduction = storeBesearch.evaluateConduction;
  if (!conduction) return [];
  return conduction.nodes || conduction.pipeline || [];
});

/* Get the active life-strap name */
const activeLifeStrapName = computed(() => {
  const id = storeAI.activeLifeStrapID;
  if (!id) return "SOV-01";

  if (typeof id === "string" && id.length > 20 && !id.includes("[object")) {
    return id.slice(-8);
  }

  try {
    const key = storeAI.activeLifestrapKey || id;
    const str = typeof key === "string" ? key : String(key);

    if (str.includes("[object")) return "SOV-01";
    return str.length > 8 ? str.slice(-8) : str;
  } catch (e) {
    return "SOV-01";
  }
});

const countLifeStraps = computed(() => {
  return storeLibrary.straps.length;
});

const setHUUDState = (mode) => {
  storeBesearch.setHUUDState(mode);
};

const toggleLensLayer = () => {
  if (storeBesearch.besearchMode === "default") {
    storeBesearch.setHUUDState("lens");
  } else {
    storeBesearch.setHUUDState("default");
  }
};

const rotateHUUD = () => {
  storeBesearch.rotateHUUD("down");
};

// Auto-expand story summary if it looks truncated
const isStoryLong = computed(() => storySummary.value.length > 20);
</script>

<style scoped>
#orbit-hud {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 500;
  display: flex;
  justify-content: center;
}

.hud-container {
  margin: 0.5rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  pointer-events: auto;
}

.hud-top {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 0.4rem 1.2rem;
  background: var(--color-background-soft);
  opacity: 0.95;
  border-radius: 12px;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.besearch-second-line {
  background: rgba(26, 32, 44, 0.9);
  backdrop-filter: blur(8px);
  padding: 6px 20px;
  border-radius: 20px;
  border: 1px solid rgba(0, 255, 204, 0.2);
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 95vw;
  pointer-events: auto;
}

.besearch-branding {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding-right: 15px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.besearch-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.besearch-label {
  font-family: "Space Mono", monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: #00ffcc;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.besearch-toggles {
  display: flex;
  gap: 15px;
  padding-right: 15px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.strand-toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.strand-label {
  font-size: 0.55rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #718096;
  font-weight: 800;
}

.strand-slider {
  width: 28px;
  height: 14px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.strand-slider.active {
  background: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
}

.orgo-slider.active {
  background: #a685ff;
  box-shadow: 0 0 8px rgba(166, 133, 255, 0.4);
}

.slider-knob {
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: 1px;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.strand-slider.active .slider-knob {
  left: 15px;
}

.workflow-stages {
  display: flex;
  align-items: center;
  gap: 10px;
}

.workflow-stage {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.workflow-stage.active {
  opacity: 1;
}

.workflow-stage:hover {
  opacity: 0.8;
}

.stage-number {
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  font-weight: 800;
  color: #00ffcc;
  background: rgba(0, 255, 204, 0.1);
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.workflow-stage.active .stage-number {
  background: #00ffcc;
  color: #1a202c;
  box-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
}

.stage-name {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: white;
}

.workflow-stage.active .stage-name {
  color: #00ffcc;
}

.stage-arrow {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.2);
  margin-left: 4px;
}

.hud-world-icon {
  font-size: 1.2rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  transition: transform 0.2s;
}

.hud-world-icon:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
}

.hud-metrics {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
}

.metric span {
  font-size: 0.5rem;
  font-weight: 800;
  color: var(--sov-accent);
  letter-spacing: 0.1em;
  margin-bottom: 0.1rem;
  text-transform: uppercase;
  opacity: 0.7;
}

.metric strong {
  font-size: 0.85rem;
  color: #3b82f6;
  font-family: "Space Mono", monospace;
  white-space: nowrap;
}

.story-summary strong {
  font-size: 0.75rem;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: max-width 0.3s ease;
}

.story-summary.long strong {
  max-width: 250px;
}

.hud-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  border-left: 1px solid var(--color-border);
  padding-left: 15px;
}

.rotation-controls {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hud-rotate {
  background: none;
  border: none;
  color: #718096;
  font-size: 8px;
  cursor: pointer;
  padding: 2px;
  line-height: 1;
}

.hud-rotate:hover {
  color: #3b82f6;
}

.hud-toggle,
.hud-expand-down {
  background: rgba(158, 113, 231, 0.1);
  border: 1px solid rgba(158, 113, 231, 0.2);
  color: #9e71e7;
  border-radius: 4px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 10px;
  transition: all 0.2s;
}

.hud-expand-down.active {
  background: rgba(0, 255, 204, 0.1);
  border-color: rgba(0, 255, 204, 0.3);
  color: #00ffcc;
}

#orbit-hud.is-expanded .hud-top {
  padding: 0.6rem 2rem;
}

#orbit-hud.is-expanded .metric strong {
  font-size: 1rem;
}
</style>
