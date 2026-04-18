<template>
  <transition name="besearch-slide">
    <div
      v-if="isOpen"
      class="besearch-layer smelter-v2"
      :class="{ 'dark-theme': isDarkMode }"
    >
      <div class="besearch-controls-top">
        <div class="thread-indicator">
          <span class="pulse-dot"></span>
          {{ activeThread }}
        </div>
        <button class="close-layer" @click="closeLayer">✕</button>
      </div>

      <div class="smelter-container">
        <!-- 1. The Orgo Drawer (Seeding Logic) -->
        <aside class="orgo-drawer" :class="{ open: isDrawerOpen }">
          <header class="drawer-header" @click="isDrawerOpen = !isDrawerOpen">
            <h5>Logic Seeds</h5>
            <span class="toggle-icon">{{ isDrawerOpen ? "←" : "→" }}</span>
          </header>
          <div class="seed-list">
            <div class="seed-section">
              <h6>Orgos</h6>
              <div
                v-for="seed in orgoStore.availableSeeds"
                :key="seed.id"
                class="seed-item"
                draggable="true"
                @dragstart="handleSeedDragStart($event, seed, 'orgo')"
              >
                <div class="seed-icon">{{ seed.icon }}</div>
                <div class="seed-info">
                  <span class="seed-name">{{ seed.name }}</span>
                </div>
              </div>
            </div>
            <div class="seed-section">
              <h6>Gelles</h6>
              <div
                v-for="texture in gelleStore.availableTextures"
                :key="texture.id"
                class="seed-item"
                draggable="true"
                @dragstart="handleSeedDragStart($event, texture, 'gelle')"
              >
                <div class="seed-icon">{{ texture.icon }}</div>
                <div class="seed-info">
                  <span class="seed-name">{{ texture.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main class="lab-space">
          <!-- A. The Orgo Bay (Active Oscillators) -->
          <section
            class="lab-bay orgo-bay"
            @drop.prevent="handleSeedDrop($event, 'orgo')"
            @dragover.prevent
          >
            <header class="bay-header">
              <h4>Orgo Bay (Structural Logic)</h4>
            </header>

            <div v-if="activeOrgos.length === 0" class="bay-placeholder">
              Drag Orgo Seeds here to begin
            </div>

            <div
              v-for="orgo in activeOrgos"
              :key="orgo.instanceId"
              class="active-instance"
            >
              <div class="instance-header">
                <span class="instance-name">{{ orgo.name }}</span>
                <span class="instance-id">{{ orgo.instanceId }}</span>
              </div>
              <div class="tuning-controls">
                <div
                  class="slider-group"
                  v-for="(val, key) in orgo.params"
                  :key="key"
                >
                  <label>{{ key }}</label>
                  <input
                    type="range"
                    v-model="orgo.params[key]"
                    min="0"
                    :max="key === 'damping' ? 1 : 100"
                    :step="key === 'damping' ? 0.01 : 1"
                    @input="logMutation('orgo', orgo.instanceId, key, val)"
                  />
                </div>
              </div>
            </div>
          </section>

          <!-- B. The Gelle Pocket (Active Textures) -->
          <section
            class="lab-bay gelle-pocket"
            @drop.prevent="handleSeedDrop($event, 'gelle')"
            @dragover.prevent
          >
            <header class="bay-header">
              <h4>Gelle Pocket (Adaptive Texture)</h4>
            </header>

            <div v-if="activeGelles.length === 0" class="bay-placeholder">
              Drag Gelle Textures here to begin
            </div>

            <div
              v-for="gelle in activeGelles"
              :key="gelle.instanceId"
              class="active-instance"
            >
              <div class="instance-header">
                <div class="strategy-selector">
                  <button
                    v-for="s in ['Prevention', 'Repair', 'Rejuvenation']"
                    :key="s"
                    :class="{ active: gelle.strategy === s }"
                    @click="updateGelleStrategy(gelle.instanceId, s)"
                  >
                    {{ s }}
                  </button>
                </div>
              </div>

              <div
                class="graft-zone"
                @drop.prevent="handleGraftDrop($event, gelle.instanceId)"
                @dragover.prevent
              >
                <div v-if="gelle.grafts.length === 0" class="placeholder">
                  Drag Residue Bubbles here
                </div>
                <div
                  v-for="graft in gelle.grafts"
                  :key="graft"
                  class="graft-bubble"
                >
                  {{ graft }}
                </div>
              </div>
            </div>
          </section>

          <!-- C. The Instrument Rack (Evidence) -->
          <section class="lab-bay instrument-rack">
            <header class="bay-header">
              <h4>Instrument Rack (Evidence)</h4>
            </header>
            <div class="instrument-list">
              <div
                v-for="device in activeInstruments"
                :key="device.id"
                class="instrument-item"
                @click="snapOrgoToDevice(device)"
              >
                <div
                  class="device-status"
                  :class="{ online: device.online }"
                ></div>
                <div class="device-info">
                  <span class="device-name">{{ device.name }}</span>
                  <span class="device-type">{{ device.type }}</span>
                </div>
                <button class="snap-btn">SNAP</button>
              </div>
            </div>
          </section>

          <!-- D. Scavenger Tray -->
          <section class="scavenger-tray">
            <h5>Unmapped Residue</h5>
            <div class="bubble-stream">
              <div
                v-for="word in unmappedFragments"
                :key="word"
                class="residue-bubble"
                draggable="true"
                @dragstart="handleResidueDragStart($event, word)"
              >
                {{ word }}
              </div>
            </div>
          </section>
        </main>
      </div>

      <!-- E. The Gemini Fold (Validation & Portal) -->
      <footer
        class="gemini-fold"
        :class="{ active: isTriPointLocked, expanded: isFoldExpanded }"
      >
        <div class="fold-status-bar" @click="toggleFold">
          <div class="lock-indicator" :class="{ locked: isTriPointLocked }">
            {{
              isTriPointLocked
                ? "Tri-Point Lock Achieved"
                : "Awaiting Tri-Point Lock"
            }}
          </div>
          <div class="fold-actions" v-if="isTriPointLocked">
            <button class="launch-btn" @click.stop="launchEmulation">
              Launch Body Emulation
            </button>
          </div>
        </div>
        <div class="fold-content" v-if="isFoldExpanded">
          <div class="scribe-pane">
            <h5>The Scribe (Evidence)</h5>
            <div class="evidence-log">
              <div v-for="(log, i) in evidenceLogs" :key="i" class="log-entry">
                {{ log }}
              </div>
            </div>
          </div>
          <div class="seer-pane">
            <h5>The Seer (Projection)</h5>
            <div class="visual-projection">
              <div class="orgo-wave" :style="waveStyle"></div>
              <div class="gelle-aura" :style="auraStyle"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { besearchStore } from "@/stores/besearchStore.js";
import { aiInterfaceStore } from "@/stores/aiInterface.js";
import { useOrgoStore } from "@/stores/orgoStore.js";
import { useGelleStore } from "@/stores/gelleStore.js";

const storeBesearch = besearchStore();
const storeAI = aiInterfaceStore();
const orgoStore = useOrgoStore();
const gelleStore = useGelleStore();
const router = useRouter();

const isDarkMode = ref(false);

onMounted(() => {
  const theme = document.documentElement.getAttribute("data-theme");
  isDarkMode.value = theme === "dark";

  // Watch for theme changes on the html element
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "data-theme") {
        const newTheme = document.documentElement.getAttribute("data-theme");
        isDarkMode.value = newTheme === "dark";
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
});

const isOpen = computed(() => storeBesearch.isBesearchLayerOpen);
const activeThread = computed(() => storeBesearch.activeBesearchThread);
const unmappedFragments = computed(
  () => storeAI.lifestrapTexture?.residue || [],
);

const isDrawerOpen = ref(true);
const isFoldExpanded = ref(false);
const evidenceLogs = ref([
  "Awaiting data ingestion...",
  "Scanning resonance patterns...",
]);

const activeOrgos = computed(() => orgoStore.activeOrgos);
const activeGelles = computed(() => gelleStore.activeGelles);

const isTriPointLocked = computed(() => storeBesearch.verifyTriPointLock());

const activeInstruments = ref([
  { id: "polar-h10", name: "Polar H10", type: "HRM", online: true },
  { id: "withings-body", name: "Withings Body+", type: "Scale", online: true },
]);

// Cross-thread damping logic
watch(
  activeGelles,
  (newGelles) => {
    const repairActive = newGelles.some((g) => g.strategy === "Repair");
    if (repairActive) {
      activeOrgos.value.forEach((orgo) => {
        orgo.params.damping = Math.min(1, orgo.params.damping + 0.1);
        evidenceLogs.value.push(`Global Damping increased via Repair Gelle`);
      });
    }
  },
  { deep: true },
);

const handleSeedDragStart = (e, seed, type) => {
  e.dataTransfer.setData(
    "application/besearch-seed",
    JSON.stringify({ ...seed, type }),
  );
};

const handleSeedDrop = (e, targetType) => {
  const data = JSON.parse(e.dataTransfer.getData("application/besearch-seed"));
  if (data.type === targetType) {
    if (targetType === "orgo") {
      orgoStore.instantiateOrgo(data.id);
    } else {
      gelleStore.graftGelle(data.id);
    }
    evidenceLogs.value.push(`Instantiated ${data.name}`);
  }
};

const handleResidueDragStart = (e, word) => {
  e.dataTransfer.setData("text/plain", word);
};

const handleGraftDrop = (e, instanceId) => {
  const word = e.dataTransfer.getData("text/plain");
  if (word) {
    gelleStore.addGraft(instanceId, word);
    evidenceLogs.value.push(`Grafted residue: ${word}`);
  }
};

const updateGelleStrategy = (instanceId, strategy) => {
  gelleStore.updateStrategy(instanceId, strategy);
};

const snapOrgoToDevice = (device) => {
  evidenceLogs.value.push(`Snapping to ${device.name}...`);
  // Mock snap logic
  if (activeOrgos.value.length > 0) {
    const firstOrgo = activeOrgos.value[0];
    firstOrgo.params.amplitude = 75;
    firstOrgo.params.wavelength = 40;
    evidenceLogs.value.push(
      `${firstOrgo.name} frequency aligned to Peer rhythm.`,
    );
  }
};

const logMutation = (type, instanceId, key, value) => {
  storeBesearch.updateBesearchThread({
    component: type,
    instance: instanceId,
    property: key,
    value: value,
  });
};

const toggleFold = () => {
  if (isTriPointLocked.value) {
    isFoldExpanded.value = !isFoldExpanded.value;
  }
};

const launchEmulation = () => {
  // Pass 400IM Orgo math to Body World
  const orgoParams =
    activeOrgos.value.length > 0 ? activeOrgos.value[0].params : {};
  router.push({
    name: "BodyWorld",
    query: { ...orgoParams },
  });
};

const closeLayer = () => {
  storeBesearch.closeBesearchLayer();
};

const waveStyle = computed(() => {
  const orgo = activeOrgos.value[0];
  if (!orgo) return { height: "0%" };
  return {
    height: `${orgo.params.amplitude || 50}%`,
    opacity: 0.7,
  };
});

const auraStyle = computed(() => {
  const gelle = activeGelles.value[0];
  if (!gelle) return { opacity: 0 };
  return {
    opacity: gelle.grafts.length * 0.2 + 0.2,
  };
});
</script>

<style scoped>
.besearch-layer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 95vh;
  background: #f8f9fa;
  backdrop-filter: blur(30px);
  z-index: 5000;
  display: flex;
  flex-direction: column;
  color: #2c3e50;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  transition:
    background 0.3s,
    color 0.3s;
}

.besearch-layer.dark-theme {
  background: rgba(5, 5, 10, 0.98);
  color: #e0e0e0;
  border-top: 1px solid rgba(0, 255, 204, 0.2);
}

.besearch-controls-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 30px;
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dark-theme .besearch-controls-top {
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.thread-indicator {
  font-family: "Space Mono", monospace;
  font-size: 0.75rem;
  color: #00796b;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.dark-theme .thread-indicator {
  color: #00ffcc;
  font-weight: 400;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #00796b;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 121, 107, 0.3);
  animation: pulse 2s infinite;
}

.dark-theme .pulse-dot {
  background: #00ffcc;
  box-shadow: 0 0 10px #00ffcc;
}

.smelter-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.orgo-drawer {
  width: 60px;
  background: #f0f2f5;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
}

.dark-theme .orgo-drawer {
  background: rgba(0, 0, 0, 0.4);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.orgo-drawer.open {
  width: 250px;
}

.drawer-header {
  padding: 20px 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dark-theme .drawer-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.drawer-header h5 {
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  opacity: 0.8;
  color: #546e7a;
}

.dark-theme .drawer-header h5 {
  color: #e0e0e0;
}

.seed-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.seed-section h6 {
  font-size: 0.65rem;
  text-transform: uppercase;
  margin-bottom: 10px;
  opacity: 0.5;
  color: #78909c;
}

.dark-theme .seed-section h6 {
  color: #e0e0e0;
}

.seed-item {
  padding: 12px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  border-radius: 8px;
  cursor: grab;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  color: #37474f;
  transition: all 0.2s;
}

.dark-theme .seed-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
}

.seed-item:hover {
  background: #ffffff;
  border-color: #00796b;
  box-shadow: 0 4px 8px rgba(0, 121, 107, 0.1);
  transform: translateY(-1px);
}

.dark-theme .seed-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #00ffcc;
  box-shadow: none;
  transform: none;
}

.seed-icon {
  font-size: 1.2rem;
}

.lab-space {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 200px;
  gap: 20px;
  padding: 30px;
  overflow-y: auto;
  background: #f8f9fa;
}

.dark-theme .lab-space {
  background: transparent;
}

.lab-bay {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  border-radius: 16px;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.dark-theme .lab-bay {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

.bay-header h4 {
  margin: 0 0 20px 0;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #455a64;
  font-weight: 700;
}

.dark-theme .bay-header h4 {
  color: #00ffcc;
  font-weight: 400;
}

.bay-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  font-size: 0.85rem;
  opacity: 0.5;
  color: #90a4ae;
}

.dark-theme .bay-placeholder {
  border: 2px dashed rgba(255, 255, 255, 0.05);
  color: inherit;
}

.active-instance {
  background: #f1f3f4;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.dark-theme .active-instance {
  background: rgba(0, 0, 0, 0.2);
  border: none;
}

.instance-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.instance-name {
  color: #00796b;
  font-weight: 600;
  font-size: 0.9rem;
}

.dark-theme .instance-name {
  color: #00ffcc;
  font-weight: 600;
}

.instance-id {
  font-family: monospace;
  font-size: 0.65rem;
  opacity: 0.5;
  color: #78909c;
}

.dark-theme .instance-id {
  color: inherit;
}

.tuning-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slider-group label {
  font-size: 0.7rem;
  text-transform: capitalize;
  opacity: 0.7;
  color: #546e7a;
  font-weight: 500;
}

.dark-theme .slider-group label {
  color: inherit;
}

.strategy-selector {
  display: flex;
  gap: 8px;
  width: 100%;
}

.strategy-selector button {
  flex: 1;
  padding: 8px;
  font-size: 0.65rem;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #546e7a;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.2s;
}

.dark-theme .strategy-selector button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
}

.strategy-selector button.active {
  background: #00796b;
  color: #ffffff;
  border-color: #00796b;
}

.dark-theme .strategy-selector button.active {
  background: #00ffcc;
  color: #000;
  border-color: #00ffcc;
}

.graft-zone {
  margin-top: 15px;
  min-height: 120px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
}

.dark-theme .graft-zone {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: none;
}

.instrument-rack .instrument-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.instrument-item {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  color: #37474f;
}

.dark-theme .instrument-item {
  background: rgba(255, 255, 255, 0.03);
  color: #e0e0e0;
  border: 1px solid transparent;
}

.instrument-item:hover {
  background: #ffffff;
  border-color: #00796b;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.dark-theme .instrument-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(0, 255, 204, 0.3);
  box-shadow: none;
}

.device-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ef5350;
}

.device-status.online {
  background: #4caf50;
  box-shadow: 0 0 8px rgba(76, 175, 80, 0.4);
}

.dark-theme .device-status.online {
  background: #00ffcc;
  box-shadow: 0 0 5px #00ffcc;
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.device-name {
  font-size: 0.85rem;
  font-weight: 600;
}

.device-type {
  font-size: 0.65rem;
  opacity: 0.6;
}

.snap-btn {
  background: transparent;
  border: 1.5px solid #00796b;
  color: #00796b;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 6px;
  text-transform: uppercase;
}

.dark-theme .snap-btn {
  border-color: #00ffcc;
  color: #00ffcc;
  border-width: 1px;
}

.gemini-fold {
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.dark-theme .gemini-fold {
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: none;
}

.gemini-fold.expanded {
  height: 400px;
}

.fold-status-bar {
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.lock-indicator {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.5;
  color: #607d8b;
  font-weight: 600;
}

.lock-indicator.locked {
  opacity: 1;
  color: #00796b;
}

.dark-theme .lock-indicator.locked {
  color: #00ffcc;
}

.launch-btn {
  background: #00796b;
  color: #ffffff;
  border: none;
  padding: 10px 24px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 121, 107, 0.2);
  transition: all 0.2s;
}

.launch-btn:hover {
  background: #00695c;
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 121, 107, 0.3);
}

.dark-theme .launch-btn {
  background: #00ffcc;
  color: #000;
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.3);
}

.dark-theme .launch-btn:hover {
  background: #00ffcc;
  transform: scale(1.02);
}

.fold-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 0 40px 40px 40px;
  height: calc(100% - 60px);
}

.scribe-pane,
.seer-pane {
  display: flex;
  flex-direction: column;
}

.evidence-log {
  flex: 1;
  background: #1a1c1e;
  border-radius: 12px;
  padding: 15px;
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  color: #4caf50;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.visual-projection {
  flex: 1;
  background: #0a0c0e;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.3);
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Scavenger Tray overrides */
.scavenger-tray {
  grid-column: span 2;
  background: #eceff1;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 20px;
  border-radius: 16px;
}

.dark-theme .scavenger-tray {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.scavenger-tray h5 {
  margin: 0 0 15px 0;
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #546e7a;
  letter-spacing: 0.05em;
}

.dark-theme .scavenger-tray h5 {
  color: inherit;
}

.residue-bubble {
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 30px;
  cursor: grab;
  font-size: 0.75rem;
  color: #37474f;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
  transition: all 0.2s;
}

.residue-bubble:hover {
  border-color: #00796b;
  transform: translateY(-1px);
}

.dark-theme .residue-bubble {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  box-shadow: none;
}

.graft-bubble {
  padding: 6px 14px;
  background: #e0f2f1;
  border: 1px solid #00796b;
  color: #00796b;
  border-radius: 30px;
  font-size: 0.7rem;
  font-weight: 600;
}

.dark-theme .graft-bubble {
  background: rgba(0, 255, 204, 0.1);
  border: 1px solid #00ffcc;
  color: #00ffcc;
}

.close-layer {
  background: #f1f3f4;
  border: none;
  color: #546e7a;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
}

.close-layer:hover {
  background: #e8eaed;
  color: #2c3e50;
}

.dark-theme .close-layer {
  background: rgba(255, 255, 255, 0.05);
  color: #e0e0e0;
}

.dark-theme .close-layer:hover {
  background: rgba(255, 255, 255, 0.1);
}

.besearch-layer.dark-theme {
  background: rgba(5, 5, 10, 0.98);
  color: #e0e0e0;
  border-top: 1px solid rgba(0, 255, 204, 0.2);
}

.besearch-controls-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(0, 0, 0, 0.03);
}

.dark-theme .besearch-controls-top {
  background: rgba(255, 255, 255, 0.02);
}

.thread-indicator {
  font-family: "Space Mono", monospace;
  font-size: 0.75rem;
  color: #008877;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dark-theme .thread-indicator {
  color: #00ffcc;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #008877;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 136, 119, 0.5);
  animation: pulse 2s infinite;
}

.dark-theme .pulse-dot {
  background: #00ffcc;
  box-shadow: 0 0 10px #00ffcc;
}

.smelter-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.orgo-drawer {
  width: 60px;
  background: rgba(0, 0, 0, 0.05);
  border-right: 1px solid rgba(0, 0, 0, 0.05);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
}

.dark-theme .orgo-drawer {
  background: rgba(0, 0, 0, 0.4);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.orgo-drawer.open {
  width: 250px;
}

.drawer-header {
  padding: 20px 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.dark-theme .drawer-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.drawer-header h5 {
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  opacity: 0.8;
}

.seed-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.seed-section h6 {
  font-size: 0.65rem;
  text-transform: uppercase;
  margin-bottom: 10px;
  opacity: 0.4;
}

.seed-item {
  padding: 12px;
  background: rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  cursor: grab;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  color: inherit;
}

.dark-theme .seed-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.seed-item:hover {
  background: rgba(0, 136, 119, 0.05);
  border-color: #008877;
}

.dark-theme .seed-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #00ffcc;
}

.seed-icon {
  font-size: 1.2rem;
}

.lab-space {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 200px;
  gap: 20px;
  padding: 30px;
  overflow-y: auto;
}

.lab-bay {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 16px;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.dark-theme .lab-bay {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.bay-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  font-size: 0.85rem;
  opacity: 0.3;
}

.dark-theme .bay-placeholder {
  border: 2px dashed rgba(255, 255, 255, 0.05);
}

.active-instance {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.dark-theme .active-instance {
  background: rgba(0, 0, 0, 0.2);
  border: none;
}

.instance-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.instance-name {
  color: #008877;
  font-weight: 600;
}

.dark-theme .instance-name {
  color: #00ffcc;
}

.instance-id {
  font-family: monospace;
  font-size: 0.65rem;
  opacity: 0.4;
}

.tuning-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slider-group label {
  font-size: 0.7rem;
  text-transform: capitalize;
  opacity: 0.6;
}

.strategy-selector {
  display: flex;
  gap: 8px;
  width: 100%;
}

.strategy-selector button {
  flex: 1;
  padding: 6px;
  font-size: 0.65rem;
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: inherit;
  cursor: pointer;
  border-radius: 4px;
}

.dark-theme .strategy-selector button {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.strategy-selector button.active {
  background: #008877;
  color: #fff;
  border-color: #008877;
}

.dark-theme .strategy-selector button.active {
  background: #00ffcc;
  color: #000;
  border-color: #00ffcc;
}

.graft-zone {
  margin-top: 15px;
  min-height: 120px;
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.dark-theme .graft-zone {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.instrument-rack .instrument-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.instrument-item {
  background: rgba(0, 0, 0, 0.03);
  padding: 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
  color: inherit;
}

.dark-theme .instrument-item {
  background: rgba(255, 255, 255, 0.03);
}

.instrument-item:hover {
  background: rgba(0, 136, 119, 0.05);
  border-color: rgba(0, 136, 119, 0.3);
}

.dark-theme .instrument-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(0, 255, 204, 0.3);
}

.device-status {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff4444;
}

.device-status.online {
  background: #008877;
  box-shadow: 0 0 5px rgba(0, 136, 119, 0.5);
}

.dark-theme .device-status.online {
  background: #00ffcc;
  box-shadow: 0 0 5px #00ffcc;
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.device-name {
  font-size: 0.85rem;
  font-weight: 500;
}

.device-type {
  font-size: 0.65rem;
  opacity: 0.4;
}

.snap-btn {
  background: transparent;
  border: 1px solid #008877;
  color: #008877;
  font-size: 0.6rem;
  padding: 4px 8px;
  border-radius: 4px;
}

.dark-theme .snap-btn {
  border-color: #00ffcc;
  color: #00ffcc;
}

.gemini-fold {
  background: rgba(255, 255, 255, 0.8);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.dark-theme .gemini-fold {
  background: rgba(0, 0, 0, 0.6);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.gemini-fold.expanded {
  height: 400px;
}

.fold-status-bar {
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.lock-indicator {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.4;
}

.lock-indicator.locked {
  opacity: 1;
  color: #008877;
}

.dark-theme .lock-indicator.locked {
  color: #00ffcc;
}

.launch-btn {
  background: #008877;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0, 136, 119, 0.3);
}

.dark-theme .launch-btn {
  background: #00ffcc;
  color: #000;
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.3);
}

.fold-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 0 40px 40px 40px;
  height: calc(100% - 60px);
}

.scribe-pane,
.seer-pane {
  display: flex;
  flex-direction: column;
}

.evidence-log {
  flex: 1;
  background: #000;
  border-radius: 8px;
  padding: 15px;
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  color: #00ff66;
  overflow-y: auto;
}

.visual-projection {
  flex: 1;
  background: #050505;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Scavenger Tray overrides */
.scavenger-tray {
  grid-column: span 2;
  background: rgba(0, 0, 0, 0.02);
}

.dark-theme .scavenger-tray {
  background: rgba(255, 255, 255, 0.01);
}

.residue-bubble {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  cursor: grab;
  font-size: 0.75rem;
  color: inherit;
}

.dark-theme .residue-bubble {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.graft-bubble {
  padding: 4px 10px;
  background: rgba(0, 136, 119, 0.1);
  border: 1px solid #008877;
  color: #008877;
  border-radius: 20px;
  font-size: 0.7rem;
}

.dark-theme .graft-bubble {
  background: rgba(0, 255, 204, 0.1);
  border: 1px solid #00ffcc;
  color: #00ffcc;
}

.close-layer {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.close-layer:hover {
  opacity: 1;
}

.besearch-controls-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background: rgba(255, 255, 255, 0.02);
}

.thread-indicator {
  font-family: "Space Mono", monospace;
  font-size: 0.75rem;
  color: #00ffcc;
  display: flex;
  align-items: center;
  gap: 10px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #00ffcc;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ffcc;
  animation: pulse 2s infinite;
}

.smelter-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.orgo-drawer {
  width: 60px;
  background: rgba(0, 0, 0, 0.4);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  transition: width 0.3s ease;
  display: flex;
  flex-direction: column;
}

.orgo-drawer.open {
  width: 250px;
}

.drawer-header {
  padding: 20px 15px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.drawer-header h5 {
  margin: 0;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
  overflow: hidden;
  opacity: 0.8;
}

.seed-list {
  flex: 1;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.seed-section h6 {
  font-size: 0.65rem;
  text-transform: uppercase;
  margin-bottom: 10px;
  opacity: 0.4;
}

.seed-item {
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  cursor: grab;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.seed-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #00ffcc;
}

.seed-icon {
  font-size: 1.2rem;
}

.lab-space {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 200px;
  gap: 20px;
  padding: 30px;
  overflow-y: auto;
}

.lab-bay {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 25px;
  display: flex;
  flex-direction: column;
}

.bay-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  font-size: 0.85rem;
  opacity: 0.3;
}

.active-instance {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.instance-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.instance-name {
  color: #00ffcc;
  font-weight: 600;
}

.instance-id {
  font-family: monospace;
  font-size: 0.65rem;
  opacity: 0.4;
}

.tuning-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.slider-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.slider-group label {
  font-size: 0.7rem;
  text-transform: capitalize;
  opacity: 0.6;
}

.strategy-selector {
  display: flex;
  gap: 8px;
  width: 100%;
}

.strategy-selector button {
  flex: 1;
  padding: 6px;
  font-size: 0.65rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  border-radius: 4px;
}

.strategy-selector button.active {
  background: #00ffcc;
  color: #000;
  border-color: #00ffcc;
}

.graft-zone {
  margin-top: 15px;
  min-height: 120px;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.instrument-rack .instrument-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
}

.instrument-item {
  background: rgba(255, 255, 255, 0.03);
  padding: 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.instrument-item:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(0, 255, 204, 0.3);
}

.device-status {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff4444;
}

.device-status.online {
  background: #00ffcc;
  box-shadow: 0 0 5px #00ffcc;
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.device-name {
  font-size: 0.85rem;
  font-weight: 500;
}

.device-type {
  font-size: 0.65rem;
  opacity: 0.4;
}

.snap-btn {
  background: transparent;
  border: 1px solid #00ffcc;
  color: #00ffcc;
  font-size: 0.6rem;
  padding: 4px 8px;
  border-radius: 4px;
}

.gemini-fold {
  background: rgba(0, 0, 0, 0.6);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.gemini-fold.expanded {
  height: 400px;
}

.fold-status-bar {
  padding: 15px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.lock-indicator {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  opacity: 0.4;
}

.lock-indicator.locked {
  opacity: 1;
  color: #00ffcc;
}

.launch-btn {
  background: #00ffcc;
  color: #000;
  border: none;
  padding: 8px 20px;
  border-radius: 30px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.3);
}

.fold-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 0 40px 40px 40px;
  height: calc(100% - 60px);
}

.scribe-pane,
.seer-pane {
  display: flex;
  flex-direction: column;
}

.evidence-log {
  flex: 1;
  background: #000;
  border-radius: 8px;
  padding: 15px;
  font-family: "Space Mono", monospace;
  font-size: 0.7rem;
  color: #00ff66;
  overflow-y: auto;
}

.visual-projection {
  flex: 1;
  background: #050505;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Scavenger Tray overrides */
.scavenger-tray {
  grid-column: span 2;
  background: rgba(255, 255, 255, 0.01);
}

.residue-bubble {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  cursor: grab;
  font-size: 0.75rem;
}

.graft-bubble {
  padding: 4px 10px;
  background: rgba(0, 255, 204, 0.1);
  border: 1px solid #00ffcc;
  color: #00ffcc;
  border-radius: 20px;
  font-size: 0.7rem;
}
</style>
