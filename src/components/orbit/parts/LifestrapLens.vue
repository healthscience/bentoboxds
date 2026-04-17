<template>
  <div class="besearch-lens-grid full-lab-view">
    <!-- Capacity -->
    <div
      class="lens-box capacity zone"
      @drop="onDrop($event, 'capacity')"
      @dragover.prevent
      @click="assignSelectedTo('capacity')"
    >
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>capacity</h3>
      </header>
      <p class="probe-text" v-if="hasSelection">
        How does this impact your performance/body?
      </p>

      <div class="variable-list">
        <div v-for="tag in lenses?.capacity" :key="tag" class="variable-tag">
          <button @click="handleCueSpace(tag)">{{ tag }}</button>
        </div>
        <div
          v-if="!lenses?.capacity?.length && !hasSelection"
          class="empty-state"
        >
          Initialize...
        </div>
      </div>
    </div>

    <!-- Context -->
    <div class="lens-box context zone active-lab">
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>context</h3>
      </header>

      <div class="context-sections">
        <!-- Body/Peer Bucket -->
        <div class="context-group bucket" @click="assignSelectedTo('peer')">
          <h4 class="group-title">Body/Peer</h4>
          <p class="probe-text-small" v-if="hasSelection">
            Life goal or physical intent?
          </p>
          <div class="variable-list">
            <!-- Peer specific slots -->
            <div
              v-for="slot in peerSlots"
              :key="slot.index || slot.label"
              class="variable-tag assigned"
            >
              <button @click.stop="handleCueSpace(slot.value || slot.label)">
                {{ slot.value || slot.label }}
              </button>
            </div>
            <!-- Standard tags if any -->
            <div
              v-for="tag in lenses?.context?.peer"
              :key="tag"
              class="variable-tag assigned"
            >
              <button @click.stop="handleCueSpace(tag)">{{ tag }}</button>
            </div>
            <div
              v-if="
                !peerSlots?.length &&
                !lenses?.context?.peer?.length &&
                !hasSelection
              "
              class="empty-state"
            >
              Initialize...
            </div>
          </div>
        </div>

        <!-- Environment Section -->
        <div
          class="context-group bucket"
          @click="assignSelectedTo('environment')"
        >
          <h4 class="group-title">Environment</h4>
          <p class="probe-text-small" v-if="hasSelection">
            Where does this happen?
          </p>
          <div class="variable-list">
            <!-- Environment specific slots -->
            <div
              v-for="slot in environmentSlots"
              :key="slot.index || slot.label"
              class="variable-tag assigned"
            >
              <button @click.stop="handleCueSpace(slot.value || slot.label)">
                {{ slot.value || slot.label }}
              </button>
            </div>
            <!-- Standard tags if any -->
            <div
              v-for="tag in lenses?.context?.environment"
              :key="tag"
              class="variable-tag assigned"
            >
              <button @click.stop="handleCueSpace(tag)">{{ tag }}</button>
            </div>
            <div
              v-if="
                !environmentSlots?.length &&
                !lenses?.context?.environment?.length &&
                !hasSelection
              "
              class="empty-state"
            >
              Initialize...
            </div>
          </div>
        </div>

        <!-- Earth Section -->
        <div class="context-group bucket" @click="assignSelectedTo('earth')">
          <h4 class="group-title">Earth Scales</h4>
          <p class="probe-text-small" v-if="hasSelection">
            Heli-Clock / Temporal location?
          </p>
          <div class="variable-list">
            <!-- Earth specific slots -->
            <div
              v-for="slot in earthSlots"
              :key="slot.index || slot.label"
              class="variable-tag assigned"
            >
              <button @click.stop="handleCueSpace(slot.value || slot.label)">
                {{ slot.value || slot.label }}
              </button>
            </div>
            <!-- Standard tags if any -->
            <div
              v-for="tag in lenses?.context?.earth"
              :key="tag"
              class="variable-tag assigned"
            >
              <button @click.stop="handleCueSpace(tag)">{{ tag }}</button>
            </div>
            <div
              v-if="
                !earthSlots?.length &&
                !lenses?.context?.earth?.length &&
                !hasSelection
              "
              class="empty-state"
            >
              Initialize...
            </div>
          </div>
        </div>
      </div>

      <div class="lens-actions" v-if="!hasSelection">
        <button class="add-cue-btn" @click="addCueLifestap('context')">
          + add a cue
        </button>
      </div>
    </div>

    <!-- Coherence -->
    <div class="lens-box coherence zone" @click="assignSelectedTo('coherence')">
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>coherence</h3>
      </header>
      <div class="whole-resonance">
        <MiniWhole @click="handleWholeExpand()"></MiniWhole>
        <div class="stability-readout">
          {{ lenses?.isStable ? "Stable" : "Awaiting Alignment" }}
        </div>
      </div>
    </div>

    <!-- Residue Dock -->
    <div class="residue-dock">
      <h4 class="dock-label">Unmapped Fragments</h4>
      <div class="bubble-stream">
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
        <div v-if="!unmappedFragments?.length" class="empty-dock">
          All fragments aligned.
        </div>
      </div>
    </div>

    <!-- modals for tools -->
    <BentoSpace></BentoSpace>
    <WholeResonance v-if="wholeResStatus === true"></WholeResonance>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import BentoSpace from "@/components/bentospace/spaceTemplate.vue";
import MiniWhole from "@/components/consilience/minWhole.vue";
import WholeResonance from "@/components/consilience/wholeResonance.vue";

import { cuesStore } from "@/stores/cuesStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";

const storeCues = cuesStore();
const storeAI = aiInterfaceStore();

const props = defineProps({
  lenses: {
    type: Object,
    default: () => ({
      capacity: [],
      coherence: [],
      context: { peer: [], environment: [], earth: [], unmappedFragments: [] },
      isStable: false,
    }),
  },
});

/* serious intent state */
const selectedWord = ref(null);
const hasSelection = computed(() => !!selectedWord.value);

/* computed */
const wholeResStatus = computed(() => storeAI.bentoflakeState);

const unmappedFragments = computed(() => {
  return props.lenses?.context?.unmappedFragments || [];
});

const contextSlots = computed(() => {
  return props.lenses?.context?.slots || [];
});

const peerSlots = computed(() => {
  return contextSlots.value.filter(
    (slot) => slot.label === "Target" && slot.value,
  );
});

const environmentSlots = computed(() => {
  // mapping logic for quantity vs environment?
  // for now, let's take quantities that aren't 'Target' labels
  return contextSlots.value.filter(
    (slot) => slot.type === "enviroment" && slot.value,
  );
});

const earthSlots = computed(() => {
  return contextSlots.value.filter(
    (slot) => slot.label === "Temporal" && slot.value,
  );
});

/* methods */
const handleCueSpace = (spaceID) => {
  // does this cue exist in library?
  let lookupLibrarCue = {}; // storeCues.queryLibrary(spaceID)
  let context = "new"; //  temp fix
  if (lookupLibrarCue) {
    // prepare chat for space
    let newChatItem = {};
    newChatItem.name = spaceID.name;
    newChatItem.chatid = spaceID.cueid;
    newChatItem.active = true;
    //setup chat history holder
    storeAI.setupChatHistory(newChatItem);
    storeAI.chatAttention = spaceID.cueid;
    // temp  if history cue the make stucture for space
    if (context === "history") {
      storeAI.liveBspace = {
        name: spaceID.value.concept.name,
        spaceid: spaceID.key,
        cueid: spaceID.key,
        gluedown: "down",
        active: true,
        expand: true,
      };
      spaceID.name = spaceID.value.concept.name;
      spaceID.cueid = spaceID.key;
    } else {
      storeAI.liveBspace = spaceID;
    }
  } else {
    // new space
  }
  storeCues.cueContext = "space";
  storeAI.beebeeContext = "chatspace";
  storeAI.bentospaceState = !storeAI.bentospaceState;
};

const addCueLifestap = (lensType) => {
  // open cue modal
  storeAI.cueAction = "cues";
  storeAI.bentocuesState = true;
};

const handleWholeExpand = () => {
  storeCues.liveCueContext = "flake";
  storeAI.bentoflakeState = !storeAI.bentoflakeState;
};

/* serious intent interactions */
const onDragStart = (e, word) => {
  selectedWord.value = word;
  e.dataTransfer.setData("text/plain", word);
};

const onDrop = (e, zone) => {
  const word = e.dataTransfer.getData("text/plain");
  commitAlignment(word, zone);
};

const assignSelectedTo = (zone) => {
  if (!selectedWord.value) return;
  commitAlignment(selectedWord.value, zone);
  selectedWord.value = null; // Clear selection after assignment
};

const commitAlignment = (word, zone) => {
  storeAI.updateResonWeight(word, zone);
};
</script>

<style scoped>
.full-lab-view {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: rgba(255, 255, 255, 0.02);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 2000;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.besearch-lens-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 10px; /* space for scrollbar */
}

.lens-box {
  padding: 20px;
  border-radius: var(--sov-border-radius);
  border-top: 4px solid #ccc;
  background: rgba(255, 255, 255, 0.03);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  min-height: 300px;
}

.zone {
  cursor: pointer;
}

.zone:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: currentColor;
}

.has-selection .zone {
  border: 2px dashed rgba(255, 255, 255, 0.2);
}

.probe-text {
  font-size: 0.9rem;
  color: var(--sov-accent);
  margin-bottom: 15px;
  font-style: italic;
  animation: fadeIn 0.3s ease;
}

.probe-text-small {
  font-size: 0.75rem;
  color: var(--sov-accent);
  margin-bottom: 10px;
  opacity: 0.8;
}

.capacity {
  border-top-color: var(--sov-capacity);
}
.coherence {
  border-top-color: var(--sov-coherence);
}
.context {
  border-top-color: var(--sov-context);
}

.lens-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.lens-header h3 {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 900;
  margin: 0;
  font-size: 1rem;
}

.whole-resonance {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.variable-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 12px;
  flex-grow: 1;
}

.context-sections {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.context-group {
  border-left: 2px solid rgba(0, 255, 200, 0.1);
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 0 12px 12px 0;
  transition: background 0.2s;
}

.group-title {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--sov-accent);
  margin-bottom: 0.5rem;
  letter-spacing: 0.15em;
  font-weight: 800;
  opacity: 0.7;
}

.variable-tag button,
.assigned {
  width: 100%;
  text-align: left;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--sov-text);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.residue-dock {
  grid-column: 1 / span 3;
  margin-top: 0;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.dock-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.5;
  margin-bottom: 12px;
  text-align: center;
}

.lens-header h3 {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-weight: 900;
  margin: 0;
  font-size: 1rem;
}

.whole-resonance {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.stability-readout {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.pulse-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 10px currentColor;
}

.variable-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 12px;
  flex-grow: 1;
}

.context-sections {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.context-group {
  border-left: 2px solid rgba(0, 255, 200, 0.1);
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 0 12px 12px 0;
  transition: background 0.2s;
}

.context-group:hover {
  background: rgba(255, 255, 255, 0.04);
}

.group-title {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--sov-accent);
  margin-bottom: 0.5rem;
  letter-spacing: 0.15em;
  font-weight: 800;
  opacity: 0.7;
}

.variable-tag button,
.assigned {
  width: 100%;
  text-align: left;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--sov-text);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.assigned {
  cursor: default;
  border-color: var(--sov-context);
  background: rgba(0, 255, 200, 0.05);
}

.variable-tag button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: currentColor;
}

.capacity .variable-tag button:hover {
  color: var(--sov-capacity);
}
.context .variable-tag button:hover {
  color: var(--sov-context);
}
.coherence .variable-tag button:hover {
  color: var(--sov-coherence);
}

.residue-dock {
  grid-column: 1 / span 3;
  margin-top: 0;
  padding: 15px 25px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.dock-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.5;
  margin-bottom: 12px;
  text-align: center;
}

.bubble-stream {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.fragment-bubble {
  padding: 10px 20px;
  border-radius: 30px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--sov-text);
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.fragment-bubble:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.fragment-bubble.selected {
  background: var(--sov-accent);
  color: black;
  border-color: var(--sov-accent);
  box-shadow: 0 0 20px var(--sov-accent);
  transform: scale(1.1);
}

.empty-dock {
  opacity: 0.4;
  font-style: italic;
  font-size: 0.9rem;
}

.empty-state {
  font-size: 0.8rem;
  opacity: 0.3;
  font-style: italic;
  padding: 10px;
}

.lens-actions {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.add-cue-btn {
  width: 100%;
  padding: 10px;
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  color: var(--sov-text);
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
}

.add-cue-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--sov-context);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
