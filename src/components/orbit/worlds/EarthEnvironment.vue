<template>
  <div class="earth-grid-container" @mousemove="handleMouseMove">
    <section class="grid-main-viewport base-map">
      <OpenStreetMap 
        :center="[genesisLocation.lat, genesisLocation.lon]" 
        :zoom="genesisLocation.zoom" 
        ref="mapRef"
      />
    </section>

    <section 
      class="grid-main-viewport portal-lens" 
      :style="lensStyle"
      :class="{ 'drawing-mode': isDrawingActive, 'tagging-mode': isTaggingActive }"
      @click="handleLensClick"
    >
      <PathTool 
        v-if="isDrawingActive" 
        @path-complete="handleNewRiverStrapDraw" 
      />

      <RiverEmulation 
        v-else 
        :strapped-paths="savedRivers" 
      />

      <div class="home-anchor" @click.stop="returnToGenesis">
        <div class="pulse-ring"></div>
        <span>⌂</span>
      </div>
    </section>

    <!-- Lens HUD -->
    <div 
      class="lens-hud" 
      :style="hudStyle"
      :class="{ 'is-locked': isLocked }"
    >
      <div class="depth-control">
        <input type="range" min="0" max="2" v-model.number="zoomDepth" orient="vertical">
        <span class="depth-label">{{ depthName }}</span>
      </div>

      <button class="lock-btn" @click="toggleLock">
        {{ isLocked ? '🔓 UNLOCK' : '🔒 LOCK' }}
      </button>

      <div class="strap-status" v-if="linkedCue">
        Linked to: {{ linkedCue.name }} | Coherence: {{ linkedCue.coherence }}%
      </div>
    </div>

    <aside class="grid-sidebar">
      <div class="glass-panel">
        <h3>Earth Tools</h3>
        <button @click="isDrawingActive = !isDrawingActive" :class="{ active: isDrawingActive }">
          {{ isDrawingActive ? '💾 Save Trace' : '📏 Trace River' }}
        </button>
        <button @click="isTaggingActive = !isTaggingActive" :class="{ active: isTaggingActive }">
          {{ isTaggingActive ? '❌ Cancel Tagging' : '🎯 Tag Location' }}
        </button>
        <hr />
        <div class="reson-list">
          <p v-for="r in savedRivers" :key="r.id">📍 River Strap #{{ r.id }}</p>
          <p v-for="t in savedTags" :key="t.id">🎯 Tag: {{ t.cue }}</p>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import heliToGPS from '@/stores/hopUtility/heliToCoordUtil.js'
import OpenStreetMap from '@/components/orbit/worlds/map/OpenstreetMap.vue';
import PathTool from '@/components/orbit/worlds/tools/PathTool.vue';
import RiverEmulation from '@/components/orbit/emulations/river/RiverEmulation.vue';
import { useLensStability } from '@/composables/useLensStability';

const mapRef = ref(null);
const isDrawingActive = ref(false);
const isTaggingActive = ref(false);
const savedRivers = ref([]);
const savedTags = ref([]);

const { lensPos, isLocked, zoomDepth, linkedCue, handleMouseMove, toggleLock } = useLensStability();

const depthName = computed(() => ['SURFACE', 'BIOMARKER', 'CELLULAR'][zoomDepth.value]);

/* genesis location convert */
const genesisLocation = ref({ lat: 51.505, lon: -0.09, zoom: 13 }); // Set during Handshake

const handleLensClick = (e) => {
  if (!isTaggingActive.value) return;
  
  // Calculate relative offset from genesis
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const clickY = e.clientY - rect.top;
  
  const geoPoint = heliToGPS(genesisLocation.value, { x: clickX, y: clickY });
  
  const newTag = {
    id: Date.now(),
    x: clickX,
    y: clickY,
    coordinates: geoPoint,
    cue: linkedCue.value ? linkedCue.value.name : 'Custom Location'
  };
  
  savedTags.value.push(newTag);
  isTaggingActive.value = false;
  
  console.log(`Location tagged at ${geoPoint.lat}, ${geoPoint.lon}`);
  // Here we would save to the Peer's local store
};

const handleNewRiverStrap = (pixelPoints) => {
  // Convert the "Ink" into real-world "Strap Data"
  const geoPoints = pixelPoints.map(pt => heliToGPS(genesisLocation.value, pt));
  
  const newStrap = {
    id: Date.now(),
    pixels: pixelPoints, // For the Emulation layer
    coordinates: geoPoints, // For the Ledger/OSM
    context: 'bioregional-flow'
  };

  savedRivers.value.push(newStrap);
  
  // Acknowledge the Peer
  console.log(`River strapped to Genesis at ${newStrap.coordinates[0].lat}`);
};


/* methods */
const returnToGenesis = () => {
  // Directly command the map to snap home
  mapRef.value.panTo([genesisLocation.lat, genesisLocation.lon]);
  // Reset the Portal Lens to center
  lensPos.value = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
};

const handleNewRiverStrapDraw = (points) => {
  savedRivers.value.push({ id: Date.now(), points });
  isDrawingActive.value = false;
};

const lensStyle = computed(() => ({
  'mask-image': `radial-gradient(circle 250px at ${lensPos.value.x}px ${lensPos.value.y}px, black 100%, transparent 100%)`,
  '-webkit-mask-image': `radial-gradient(circle 250px at ${lensPos.value.x}px ${lensPos.value.y}px, black 100%, transparent 100%)`
}));

const hudStyle = computed(() => ({
  transform: `translate(${lensPos.value.x}px, ${lensPos.value.y}px)`
}));
</script>

<style scoped>
.earth-grid-container {
  display: grid;
  grid-template-columns: 1fr 300px; /* Main view | Sidebar */
  grid-template-rows: 1fr;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #000;
  position: relative;
}

.grid-main-viewport {
  grid-column: 1;
  grid-row: 1;
}

.portal-lens {
  z-index: 2;
  background: rgba(0, 255, 200, 0.05); /* Subtle data glow */
  pointer-events: none; /* By default, clicks go to map */
}

.portal-lens.drawing-mode,
.portal-lens.tagging-mode {
  pointer-events: auto; /* Intercept clicks to draw or tag */
}

.grid-sidebar {
  grid-column: 2;
  z-index: 10;
  padding: 20px;
  background: #0a0a0a;
  border-left: 1px solid #222;
}

.glass-panel button.active { background: var(--sov-accent); color: black; }

.home-anchor {
  position: absolute;
  bottom: 100px; /* Above the agents footer */
  left: 20px;
  width: 50px;
  height: 50px;
  background: var(--sov-accent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 20;
  box-shadow: 0 0 15px var(--resonance-color);
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 2px solid var(--sov-accent);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(2.5); opacity: 0; }
}

/* Lens HUD Styles */
.lens-hud {
  position: absolute;
  top: -125px; /* Offset to sit above the lens circle */
  left: -125px;
  width: 250px;
  height: 250px;
  pointer-events: none;
  z-index: 100;
  border: 2px solid rgba(0, 255, 200, 0.3);
  border-radius: 50%;
  transition: border-color 0.3s;
}

.lens-hud.is-locked { 
  border-color: #ff4400; 
  pointer-events: auto; 
}

.depth-control {
  position: absolute;
  right: -60px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 8px;
  color: white;
}

.depth-control input[type=range][orient=vertical] {
  writing-mode: bt-lr; /* IE */
  -webkit-appearance: slider-vertical; /* WebKit */
  width: 8px;
  height: 100px;
  padding: 0 5px;
}

.depth-label {
  margin-top: 10px;
  font-size: 12px;
  font-weight: bold;
}

.lock-btn {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 15px;
  border-radius: 15px;
  cursor: pointer;
}

.lock-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.strap-status {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: #00ffc8;
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 12px;
  white-space: nowrap;
}
</style>