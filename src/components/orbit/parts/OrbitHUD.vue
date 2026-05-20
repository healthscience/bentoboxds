<template>
  <div id="orbit-hud" :class="{ 'is-expanded': isExpanded, 'lens-active': storeBesearch.besearchMode !== 'default' }">
    <div class="hud-top">
      <div class="hud-metrics">
        <!-- Be Section - Always Visible -->
        <div class="metric be-metric" @click="toggleLensLayer">
          <span>Be</span><strong>{{ activeLifeStrapName }}</strong>
        </div>
        
        <!-- Standard Metrics (State 1) -->
        <template v-if="storeBesearch.besearchMode === 'default'">
          <div class="metric" @click="setMode('lens')">
            <span>LIFE-STRAPS</span><strong>{{ countLifeStraps }}</strong>
          </div>
          <div class="metric" @click="setMode('lens')">
             <span>LENS</span>
          </div>
          <template v-if="isExpanded">
            <div class="metric" @click="setMode('besearch')"><span>BESEARCH</span><strong>0</strong></div>
            <div class="metric"><span>DIALOGUE</span><strong>0</strong></div>
          </template>
        </template>

        <!-- Operational Metrics (State 2 & 3) -->
        <template v-else>
          <div class="metric" :class="{ active: storeBesearch.besearchMode === 'lens' }" @click="setMode('lens')">
            <span>STORY</span><strong>{{ mappedWordsCount }}</strong>
          </div>
          <div class="metric" :class="{ active: storeBesearch.besearchMode === 'besearch' }" @click="setMode('besearch')">
            <span>LAB</span><strong>{{ extractedCuesCount }}</strong>
          </div>
          <div class="metric agent-activity">
            <span>AGENT</span><strong>{{ agentStatus }}</strong>
          </div>
        </template>
      </div>

      <div v-if="isExpanded && storeBesearch.besearchMode === 'default'" class="metric altruism-metric">
        <span>Altrusim</span><strong>help 20%</strong>
      </div>

      <div class="hud-actions">
        <button class="hud-toggle" @click="isExpanded = !isExpanded">
          {{ isExpanded ? "<" : ">" }}
        </button>
        <button 
          class="hud-expand-down" 
          :class="{ active: storeBesearch.besearchMode !== 'default' }"
          @click="toggleLensLayer"
        >
          {{ storeBesearch.besearchMode === 'default' ? "↓" : "↑" }}
        </button>
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

/* Get the active life-strap name */
const activeLifeStrapName = computed(() => {
  const id = storeAI.activeLifeStrapID;
  if (!id) return "SOV-01";
  
  // Check if it's already a string and not an object string representation
  if (typeof id === 'string' && id.length > 20 && !id.includes('[object')) {
     return id.slice(-8);
  }
  
  // Handle Buffer/Uint8Array or other objects
  try {
    // If it's a Buffer or similar, we might have it in hex in another property or need to convert it.
    // For now, let's look at activeLifestrapKey in storeAI if available.
    const key = storeAI.activeLifestrapKey || id;
    const str = typeof key === 'string' ? key : String(key);
    
    if (str.includes('[object')) return "SOV-01";
    return str.length > 8 ? str.slice(-8) : str;
  } catch (e) {
    return "SOV-01";
  }
});

const countLifeStraps = computed(() => {
  return storeLibrary.straps.length;
});

const mappedWordsCount = computed(() => {
  const pillars = storeAI.lifestrapTexture?.pillars || {};
  const count = (pillars.capacity?.length || 0) + 
         (pillars.context?.length || 0) + 
         (pillars.attunement?.length || 0);
  return count;
});

const extractedCuesCount = computed(() => {
  if (!storeLibrary.availableMarkers) return 0;
  return storeLibrary.availableMarkers.length;
});

const agentStatus = computed(() => {
  return storeAI.beebeeStatus === 'thinking' ? 'ACTIVE' : 'IDLE';
});

const setMode = (mode) => {
  storeBesearch.setHUUDState(mode);
};

const toggleLensLayer = () => {
  if (storeBesearch.besearchMode === "default") {
    storeBesearch.setHUUDState("lens");
  } else {
    storeBesearch.setHUUDState("default");
  }
};
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
  gap: 2rem;
  padding: 0.5rem 1.5rem;
  margin: 0.5rem auto;
  width: fit-content;
  background: var(--color-background-soft);
  opacity: 0.9;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border: 1px solid var(--color-border);
  z-index: 10;
  pointer-events: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

#orbit-hud.is-expanded .hud-top {
  gap: 4rem;
  padding: 1rem 3rem;
  margin: 1rem auto;
  border-radius: 16px;
}

.hud-metrics {
  display: flex;
  gap: 2rem;
  transition: gap 0.3s ease;
}

#orbit-hud.is-expanded .hud-metrics {
  gap: 4rem;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.metric span {
  font-size: 0.55rem;
  font-weight: 800;
  color: var(--sov-accent);
  letter-spacing: 0.1em;
  margin-bottom: 0.15rem;
  transition: font-size 0.3s ease;
}

#orbit-hud.is-expanded .metric span {
  font-size: 0.6rem;
  margin-bottom: 0.25rem;
}

.metric strong {
  font-size: 0.9rem;
  color: #3b82f6;
  font-family: "Space Mono", monospace;
  transition: font-size 0.3s ease;
}

.metric.active strong {
  color: #00ffcc;
  text-shadow: 0 0 10px rgba(0, 255, 204, 0.6);
}

.metric.active span {
  opacity: 1;
}

.be-metric {
  cursor: pointer;
  transition: all 0.2s;
}

.be-metric:hover {
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.agent-activity strong {
  animation: pulse-text 2s infinite;
}

@keyframes pulse-text {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.hud-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 0.5rem;
}

.hud-toggle, .hud-expand-down {
  background: rgba(158, 113, 231, 0.2);
  border: 1px solid rgba(158, 113, 231, 0.3);
  color: #9e71e7;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-family: "Space Mono", monospace;
  font-weight: bold;
  font-size: 14px;
  transition: all 0.2s ease;
}

.hud-expand-down.active {
  background: rgba(0, 255, 204, 0.2);
  border-color: rgba(0, 255, 204, 0.4);
  color: #00ffcc;
  box-shadow: 0 0 10px rgba(0, 255, 204, 0.2);
}

.hud-toggle:hover, .hud-expand-down:hover {
  background: rgba(158, 113, 231, 0.4);
  transform: scale(1.1);
}

.hud-expand-down.active:hover {
  background: rgba(0, 255, 204, 0.4);
}
</style>
