<template>
  <div
    class="besearch-lens-grid full-lab-view"
    :class="{ 'has-selection': hasSelection }"
  >
    <!-- Pillar 1: Capacity -->
    <div
      class="lens-box capacity zone"
      @drop="onDrop($event, 'capacity')"
      @dragover.prevent
      @click="
        storeBesearch.openBesearchLayer({
          capacity: capacityItems[0]?.value || 'New Besearch',
        })
      "
    >
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>capacity</h3>
      </header>
      <p class="probe-text" v-if="hasSelection">
        Physics & Vitality: How does this impact your performance/body?
      </p>

      <div class="variable-list">
        <div
          v-for="item in capacityItems"
          :key="item.value"
          class="variable-tag"
        >
          <button>
            <span class="tag-label" v-if="item.label">{{ item.label }}:</span>
            {{ item.value }}
          </button>
        </div>

        <div v-if="!capacityItems.length && !hasSelection" class="empty-state">
          Initialize...
        </div>
      </div>
    </div>

    <!-- Pillar 2: Context -->
    <div
      class="lens-box context zone active-lab"
      @drop="onDrop($event, 'context')"
      @dragover.prevent
    >
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>context</h3>
      </header>
      <p class="probe-text" v-if="hasSelection">
        Geography & Environment: Where does this happen?
      </p>

      <div class="context-sections">
        <!-- Body/Peer Bucket -->
        <div
          class="context-group bucket"
          @click="assignSelectedTo('peer', 'Activity')"
        >
          <h4 class="group-title">Body/Peer</h4>
          <div class="variable-list mini">
            <div
              v-for="item in bodyPeerItems"
              :key="item.value"
              class="variable-tag assigned"
            >
              <button @click.stop="handleCueSpace(item.value)">
                {{ item.value }}
              </button>
            </div>
          </div>
        </div>

        <!-- Environment Section -->
        <div
          class="context-group bucket"
          @click="assignSelectedTo('environment', 'Space')"
        >
          <h4 class="group-title">Environment</h4>
          <div class="variable-list mini">
            <div
              v-for="item in environmentItems"
              :key="item.value"
              class="variable-tag assigned"
            >
              <button @click.stop="handleCueSpace(item.value)">
                {{ item.value }}
              </button>
            </div>
          </div>
        </div>

        <!-- Earth Section -->
        <div
          class="context-group bucket"
          @click="assignSelectedTo('earth', 'Temporal')"
        >
          <h4 class="group-title">Earth Scales</h4>
          <div class="variable-list mini">
            <div
              v-for="item in earthItems"
              :key="item.value"
              class="variable-tag assigned"
            >
              <button @click.stop="handleCueSpace(item.value)">
                {{ item.value }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pillar 3: Heli (H) -->
    <div
      class="lens-box heli-pillar zone"
      @drop="onDrop($event, 'heli')"
      @dragover.prevent
    >
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>Heli (H)</h3>
      </header>

      <div class="heli-visual-wrapper">
        <HeliStart :mini="true" />
      </div>

      <div class="context-sections">
        <!-- Orbits Bucket -->
        <div
          class="context-group bucket heli-well"
          :class="{ 'pulse-active': heliMathGhost?.unit === 'orbits' }"
          @click="assignSelectedTo('orbits', 'Orbit Target')"
          @dragover.prevent="handleDragOverHeli($event, 'orbits')"
          @dragleave="handleDragLeaveHeli"
          @drop="onDrop($event, 'orbits')"
        >
          <h4 class="group-title">Orbits (Age 65)</h4>
          <div class="ghost-math" v-if="orbitsMath">{{ orbitsMath }}</div>
          <div class="variable-list mini">
            <div
              v-for="item in heliItems.filter(
                (i) => i.label === 'Orbit Target',
              )"
              :key="item.value"
              class="variable-tag assigned"
            >
              <button @click.stop="handleCueSpace(item.value)">
                {{ item.value }}
              </button>
            </div>
          </div>
        </div>

        <!-- Solar Days -->
        <div
          class="context-group bucket heli-well"
          @click="assignSelectedTo('days', 'Rhythm')"
          @drop="onDrop($event, 'days')"
        >
          <h4 class="group-title">Solar Days (Rhythms)</h4>
          <div class="variable-list mini">
            <div
              v-for="item in heliItems.filter((i) => i.label === 'Rhythm')"
              :key="item.value"
              class="variable-tag assigned"
            >
              <button @click.stop="handleCueSpace(item.value)">
                {{ item.value }}
              </button>
            </div>
          </div>
        </div>

        <!-- Arcs -->
        <div
          class="context-group bucket heli-well"
          @click="assignSelectedTo('arcs', 'Performance')"
          @dragover.prevent="handleDragOverHeli($event, 'arcs')"
          @dragleave="handleDragLeaveHeli"
          @drop="onDrop($event, 'arcs')"
        >
          <h4 class="group-title">Arcs (Performance)</h4>
          <div class="ghost-math" v-if="heliMathGhost?.unit === 'arcs'">
            {{ heliMathGhost.text }}
          </div>
          <div class="variable-list mini">
            <div
              v-for="item in heliItems.filter((i) => i.label === 'Performance')"
              :key="item.value"
              class="variable-tag assigned"
            >
              <button @click.stop="handleCueSpace(item.value)">
                {{ item.value }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pillar 4: Coherence -->
    <div class="lens-box coherence zone" @click="assignSelectedTo('coherence')">
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>coherence</h3>
      </header>

      <div class="emulation-meter">
        <div class="meter-label">Emulation Stability</div>
        <div class="meter-bar">
          <div
            class="meter-fill"
            :style="{
              width: lenses?.pillars?.coherence?.isStable ? '100%' : '35%',
            }"
          ></div>
        </div>
      </div>

      <div class="whole-resonance">
        <MiniWhole @click="handleWholeExpand()"></MiniWhole>
        <div class="stability-readout">
          {{
            lenses?.pillars?.coherence?.isStable
              ? "Stable"
              : "Awaiting Alignment"
          }}
        </div>
      </div>
    </div>

    <!-- Residue Dock (Full Width Bottom Tray) -->
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
import HeliStart from "@/components/orbit/clock/HeliStart.vue";

import { besearchStore } from "@/stores/besearchStore.js";
import { cuesStore } from "@/stores/cuesStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { diaryStore } from "@/stores/diaryStore.js";

const storeCues = cuesStore();
const storeAI = aiInterfaceStore();
const storeDiary = diaryStore();

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

const storeBesearch = besearchStore();

/* serious intent state */
const selectedWord = ref(null);
const hasSelection = computed(() => !!selectedWord.value);
const heliMathGhost = ref(null);

/* computed */
const wholeResStatus = computed(() => storeAI.bentoflakeState);

const unmappedFragments = computed(() => {
  console.log(
    "[LifestrapLens] Computing unmappedFragments:",
    props.lenses?.residue,
  );
  return props.lenses?.residue || [];
});

const capacityItems = computed(() => {
  console.log(
    "[LifestrapLens] Computing capacityItems:",
    props.lenses?.pillars?.capacity,
  );
  return props.lenses?.pillars?.capacity || [];
});
const contextItems = computed(() => {
  console.log(
    "[LifestrapLens] Computing contextItems:",
    props.lenses?.pillars?.context,
  );
  return props.lenses?.pillars?.context || [];
});
const heliItems = computed(() => {
  console.log(
    "[LifestrapLens] Computing heliItems:",
    props.lenses?.pillars?.heli,
  );
  return props.lenses?.pillars?.heli || [];
});

const bodyPeerItems = computed(() =>
  contextItems.value.filter(
    (i) => i.label === "Activity" || i.label === "Body/Peer",
  ),
);
const environmentItems = computed(() =>
  contextItems.value.filter(
    (i) => i.label === "Space" || i.label === "Environment",
  ),
);
const earthItems = computed(() =>
  contextItems.value.filter(
    (i) => i.label === "Temporal" || i.label === "Earth Scales",
  ),
);

const orbitsMath = computed(() => {
  if (heliMathGhost.value?.unit === "orbits") return heliMathGhost.value.text;
  return null;
});

/* methods */
const performHeliMath = (word, unit) => {
  const currentHeliAge = storeDiary.heliSignature?.age?.whole || 52;
  const val = parseFloat(word);

  if (isNaN(val)) return null;

  if (unit === "orbits") {
    const delta = val - currentHeliAge;
    return {
      delta,
      unit: "orbits",
      text: `${delta >= 0 ? "+" : ""}${delta.toFixed(2)} Orbits`,
    };
  }

  if (unit === "arcs") {
    return {
      value: val,
      unit: "arcs",
      text: `${val} Arcs Threshold`,
    };
  }

  return null;
};

const handleDragOverHeli = (e, unit) => {
  if (!selectedWord.value) return;
  const math = performHeliMath(selectedWord.value, unit);
  if (math) {
    heliMathGhost.value = math;
  }
};

const handleDragLeaveHeli = () => {
  heliMathGhost.value = null;
};

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
  // Determine default label for drop
  let label = null;
  if (zone === "peer") label = "Activity";
  if (zone === "environment") label = "Space";
  if (zone === "earth") label = "Temporal";
  if (zone === "orbits") label = "Orbit Target";
  if (zone === "days") label = "Rhythm";
  if (zone === "arcs") label = "Performance";

  commitAlignment(word, zone, label);
  heliMathGhost.value = null;
};

const assignSelectedTo = (zone, label = null) => {
  if (!selectedWord.value) return;
  commitAlignment(selectedWord.value, zone, label);
  selectedWord.value = null; // Clear selection after assignment
  heliMathGhost.value = null;
};

const commitAlignment = (word, zone, label = null) => {
  // If heli zone, perform math and update store
  const math = performHeliMath(word, zone);
  if (math) {
    if (zone === "orbits") storeAI.setEmulationHorizon(math.delta);
    if (zone === "arcs") storeAI.setPerformanceVelocity(math.value);
  }

  storeAI.updateResonWeight(word, zone, label);
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
  padding: 20px 20px 20px 60px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.besearch-lens-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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
  min-height: 400px;
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

.heli-pillar {
  border-top-color: var(--sov-earth);
}

.heli-visual-wrapper {
  width: 100%;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
}

.heli-well {
  position: relative;
  overflow: hidden;
}

.pulse-active {
  animation: well-pulse 1.5s infinite ease-in-out;
  border-color: var(--sov-earth);
  background: rgba(var(--sov-earth-rgb), 0.1);
}

@keyframes well-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(0, 255, 200, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 255, 200, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 255, 200, 0);
  }
}

.ghost-math {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: "Space Mono", monospace;
  font-size: 1.2rem;
  font-weight: 900;
  color: var(--sov-earth);
  text-shadow: 0 0 10px var(--sov-earth);
  pointer-events: none;
  z-index: 10;
  background: rgba(0, 0, 0, 0.6);
  padding: 5px 10px;
  border-radius: 4px;
}

.emulation-meter {
  margin-bottom: 20px;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
}

.meter-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
  margin-bottom: 8px;
}

.meter-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--sov-accent), var(--sov-coherence));
  transition: width 0.5s ease;
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

.variable-list.mini {
  background: transparent;
  padding: 0;
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

.tag-label {
  font-weight: 800;
  opacity: 0.6;
  margin-right: 4px;
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
  grid-column: 1 / span 4;
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
