<template>
  <transition name="lens-slide">
    <div
      class="besearch-lens-grid full-lab-view"
      :class="{ 
        'has-selection': hasSelection
      }"
    >
      <!-- Left Pane: Story Canvas / Residue Dock -->
      <div class="sieve-pane narrative-pane">
        <header class="pane-header">
          <span class="pulse-dot"></span>
          <h3>Narrative Story</h3>
        </header>
        
        <div class="story-canvas-wrapper">
          <textarea
            v-model="storeBesearch.activeBesearchContext.story"
            class="story-input"
            placeholder="Describe your current state or the resonance you wish to explore..."
          ></textarea>
          
          <div class="token-overlay" v-if="highlightedTokens.length">
            <span 
              v-for="token in highlightedTokens" 
              :key="token"
              class="story-token"
              @click="handleTokenClick(token)"
            >
              {{ token }}
            </span>
          </div>
        </div>

        <div class="residue-dock-inline">
          <h4 class="dock-label">Unmapped Fragments</h4>
          <div class="bubble-stream mini">
            <button
              v-for="word in unmappedFragments"
              :key="word"
              class="fragment-bubble"
              :class="{ selected: selectedWord === word }"
              draggable="true"
              @dragstart="onDragStart($event, word)"
              @click="selectedWord = word"
            >
              {{ word }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right Pane: Sieve Columns -->
      <div class="sieve-pane columns-pane">
        <div class="pane-header-actions">
          <header class="pane-header">
            <span class="pulse-dot"></span>
            <h3>Sieve Columns</h3>
          </header>
          <button 
            class="enter-bench-btn"
            :class="{ active: canEnterBench }"
            @click="storeBesearch.setHUUDState('besearch')"
          >
            Activate Besearch Cycle
          </button>
        </div>

        <div class="columns-grid">
          <!-- Pillar 1: Capacity -->
          <div
            class="lens-box capacity zone"
            :class="{ 'active-zone': activeZone === 'capacity' }"
            @drop.prevent="onDrop($event, 'capacity')"
            @dragover.prevent="onDragOver($event, 'capacity')"
            @dragleave="onDragLeave"
          >
            <header class="lens-header">
              <h3>capacity</h3>
            </header>
            <LensColumn
              :groups="[{ id: 'capacity', title: 'Capacity', items: capacityItems }]"
              :show-item-labels="true"
              @dragstart="onDragStart"
              @unmap="unmapFragment"
              @select="selectCapacity"
              @drop="onDrop"
              @dragover="onDragOver"
              @dragleave="onDragLeave"
            />
          </div>

          <!-- Pillar 2: Context -->
          <div 
            class="lens-box context zone"
            :class="{ 'active-zone': activeZone === 'context' }"
            @drop.prevent="onDrop($event, 'context')"
            @dragover.prevent="onDragOver($event, 'context')"
            @dragleave="onDragLeave"
          >
            <header class="lens-header">
              <h3>context</h3>
            </header>
            <LensColumn
              :groups="[
                { id: 'peer', title: 'Body/Peer', items: bodyPeerItems },
                { id: 'environment', title: 'Building Environment', items: environmentItems },
                { id: 'earth', title: 'Earth Scales', items: earthItems },
              ]"
              :show-item-labels="true"
              @dragstart="onDragStart"
              @unmap="unmapFragment"
              @select="handleCueSpace"
              @drop="onDrop"
              @dragover="onDragOver"
              @dragleave="onDragLeave"
            />
          </div>

          <!-- Pillar 4: Attunement -->
          <div 
            class="lens-box coherence zone"
            :class="{ 'active-zone': activeZone === 'attunement' }"
            @drop.prevent="onDrop($event, 'attunement')"
            @dragover.prevent="onDragOver($event, 'attunement')"
            @dragleave="onDragLeave"
          >
            <header class="lens-header">
              <h3>Attunement</h3>
            </header>
            <LensColumn
              :groups="[{ id: 'attunement', title: 'Attunement', items: attunementItems }]"
              :show-item-labels="true"
              @dragstart="onDragStart"
              @unmap="unmapFragment"
              @select="handleCueSpace"
              @drop="onDrop"
              @dragover="onDragOver"
              @dragleave="onDragLeave"
            />
          </div>
        </div>
      </div>

      <!-- Modals for tools -->
      <BentoSpace></BentoSpace>
      <WholeResonance v-if="wholeResStatus === true"></WholeResonance>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BentoSpace from "@/components/bentospace/spaceTemplate.vue";
import WholeResonance from "@/components/consilience/wholeResonance.vue";
import LensColumn from "@/components/orbit/parts/shared/LensColumn.vue";

import { besearchStore } from "@/stores/besearchStore.js";
import { cuesStore } from "@/stores/cuesStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { diaryStore } from "@/stores/diaryStore.js";

const storeCues = cuesStore();
const storeAI = aiInterfaceStore();
const storeDiary = diaryStore();
const storeBesearch = besearchStore();

const props = defineProps({
  lenses: {
    type: Object,
    default: () => ({
      pillars: {
        capacity: [],
        context: [],
        heli: [],
        coherence: { isStable: false, resonance: 0 },
      },
      residue: [],
      key: "",
    }),
  },
});

/* serious intent state */
const selectedWord = ref(null);
const hasSelection = computed(() => !!selectedWord.value);
const activeZone = ref(null);

/* computed */
const wholeResStatus = computed(() => storeAI.bentoflakeState);

const highlightedTokens = computed(() => {
  const story = storeBesearch.activeBesearchContext.story || "";
  return story.split(/\s+/).filter(word => word.length > 3 && word.charAt(0) === word.charAt(0).toUpperCase());
});

const canEnterBench = computed(() => {
  return capacityItems.value.length > 0 && contextItems.value.length > 0;
});

const unmappedFragments = computed(() => {
  return storeAI.lifestrapTexture?.residue || [];
});

const capacityItems = computed(() => {
  const items = storeAI.lifestrapTexture?.pillars?.capacity || [];
  console.log('LENS DEBUG - capacityItems:', items);
  return items;
});

const contextItems = computed(() => {
  const items = storeAI.lifestrapTexture?.pillars?.context || [];
  console.log('LENS DEBUG - contextItems:', items);
  return items;
});

const attunementItems = computed(() => {
  const items = storeAI.lifestrapTexture?.pillars?.attunement || [];
  console.log('LENS DEBUG - attunementItems:', items);
  return items;
});

const bodyPeerItems = computed(() => {
  const items = contextItems.value || [];
  const filtered = items.filter(
    (i) => i.label === "Activity" || i.label === "Body/Peer",
  );
  console.log('LENS DEBUG - bodyPeerItems:', filtered);
  return filtered;
});
const environmentItems = computed(() => {
  const items = contextItems.value || [];
  const filtered = items.filter(
    (i) => i.label === "Space" || i.label === "Environment",
  );
  console.log('LENS DEBUG - environmentItems:', filtered);
  return filtered;
});
const earthItems = computed(() => {
  const items = contextItems.value || [];
  const filtered = items.filter(
    (i) => i.label === "Temporal" || i.label === "Earth Scales",
  );
  console.log('LENS DEBUG - earthItems:', filtered);
  return filtered;
});

/* methods */
const selectCapacity = (val) => {
  storeBesearch.activeBesearchContext.capacity = val;
};

const handleTokenClick = (token) => {
  selectedWord.value = token;
  // Visual feedback placeholder for floating
  console.log(`Token ${token} clicked for floating animation`);
};

const onDragStart = (e, word) => {
  selectedWord.value = word;
  e.dataTransfer.setData("text/plain", word);
  e.dataTransfer.effectAllowed = "move";
};

const onDragOver = (e, zone) => {
  activeZone.value = zone;
  e.dataTransfer.dropEffect = "move";
};

const onDragLeave = () => {
  activeZone.value = null;
};

const onDrop = (e, zone) => {
  const word = e.dataTransfer.getData("text/plain");
  if (!word) return;
  
  // Determine default label for drop
  let label = null;
  if (zone === "context") label = "Activity";
  if (zone === "attunement") label = "Attunement";

  if (zone === "capacity") {
    // Solid Single Selection: Remove existing capacity first
    if (capacityItems.value.length > 0) {
      capacityItems.value.forEach(item => {
        storeAI.updateResonWeight(item.value, "residue");
      });
    }
  }

  commitAlignment(word, zone, label);
  activeZone.value = null;
  selectedWord.value = null;
};

const commitAlignment = (word, zone, label = null) => {
  storeAI.updateResonWeight(word, zone, label);
};

const unmapFragment = (word) => {
  storeAI.updateResonWeight(word, "residue");
};

const handleCueSpace = (spaceID) => {
  storeCues.cueContext = "space";
  storeAI.beebeeContext = "chatspace";
  storeAI.bentospaceState = !storeAI.bentospaceState;
  storeAI.liveBspace = spaceID;
};

onMounted(() => {
  // Initialize context
});
</script>

<style scoped>
.full-lab-view {
  --sov-accent: #3b82f6;
  --sov-capacity: #00c8ff;
  --sov-context: #00ffcc;
  --sov-coherence: #a685ff;
  --sov-text: #1a202c;
  
  height: 100%;
  width: 100%;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  z-index: 10;
  padding: 10px;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 30px;
  overflow: hidden;
  box-sizing: border-box;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  border: none;
  pointer-events: auto;
}

.columns-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  flex: 1;
  padding-right: 10px;
  min-height: 200px;
  pointer-events: auto; /* Ensure clicks reach the columns */
}

.lens-box {
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ccc;
  border-radius: 16px;
  transition: all 0.3s ease;
  flex-shrink: 0;
  min-height: 100px;
  color: #1a202c; /* Ensure text color is visible */
}

.lens-slide-enter-from,
.lens-slide-leave-to {
  transform: translateY(100%);
}

.sieve-pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.pane-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 25px;
  flex-shrink: 0;
}

.pane-header h3 {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 900;
  margin: 0;
  font-size: 1.1rem;
  color: #3b82f6;
  text-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

.story-canvas-wrapper {
  flex: 1;
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
}

.story-input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  padding: 24px;
  color: #1a202c;
  font-family: "Space Mono", monospace;
  font-size: 1.2rem;
  line-height: 1.6;
  resize: none;
  outline: none;
}

.token-overlay {
  position: absolute;
  top: 24px;
  left: 24px;
  right: 24px;
  bottom: 24px;
  pointer-events: none;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.story-token {
  padding: 2px 8px;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.4);
  border-radius: 4px;
  color: #2563eb;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "Space Mono", monospace;
  font-size: 1rem;
}

.story-token:hover {
  background: rgba(59, 130, 246, 0.35);
  transform: scale(1.05);
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.3);
}

.residue-dock-inline {
  padding: 15px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  flex-shrink: 0;
}

.pane-header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-shrink: 0;
}

.enter-bench-btn {
  padding: 12px 24px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #718096;
  border-radius: 30px;
  font-weight: 900;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  cursor: not-allowed;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.enter-bench-btn.active {
  background: #1a202c;
  color: #00ffcc;
  border-color: #00ffcc;
  cursor: pointer;
  box-shadow: 0 0 25px rgba(0, 255, 204, 0.3);
}

.enter-bench-btn.active:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 0 35px rgba(0, 255, 204, 0.5);
  background: #2d3748;
}

.columns-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  flex: 1;
  padding-right: 10px;
}

.lens-box {
  padding: 20px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #ccc;
  border-radius: 16px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.lens-box.active-zone {
  background: rgba(0, 255, 204, 0.05);
  border-color: #00ffcc;
}

.capacity { border-top-color: #00c8ff; }
.context { border-top-color: #00ffcc; }
.coherence { border-top-color: #a685ff; }

.lens-header h3 {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8rem;
  margin-bottom: 15px;
  color: #1a202c;
}

.fragment-bubble {
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #1a202c;
  cursor: grab;
  transition: all 0.3s;
}

.fragment-bubble:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
  box-shadow: 0 0 10px #3b82f6;
}

.dock-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.5;
  margin-bottom: 12px;
  color: #1a202c;
}

.bubble-stream.mini {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
