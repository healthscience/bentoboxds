<template>
  <div class="heli-modal-overlay">
    <button v-if="!storeDiary.heliClockSet" class="close-btn-top" @click="emit('calibrated')">✕</button>
    <div class="calibration-card">
      <header class="modal-header">
        <div class="orb-icon"></div>
        <h2>Solar Alignment</h2>
      </header>

      <div class="orbit-counter">
        <label>Earth Orbits Completed</label>
        <div class="counter-controls">
          <button @click="orbits--" :disabled="orbits <= 0">−</button>
          <span class="orbit-value">{{ orbits }}</span>
          <button @click="orbits++">+</button>
        </div>
      </div>

      <div class="location-toggle">
        <button :class="{ active: useCurrentLocation }" @click="requestLocation">📍 Current GPS</button>
        <button :class="{ active: !useCurrentLocation }" @click="useCurrentLocation = false">🗺️ Pick Birthplace</button>
      </div>

      <div v-if="currentLocation && useCurrentLocation" class="location-info">
        <p>Current: {{ currentLocation.lat.toFixed(4) }}, {{ currentLocation.lng.toFixed(4) }}</p>
        </div>

      <div v-if="!useCurrentLocation" class="birth-location-form">
        <input type="text" v-model="birthPlaceName" placeholder="Place Name (e.g. London)" />
        <button @click="convertGPS()">Find location</button>
      </div>

      <div class="dual-dial-zone">
        <svg viewBox="0 0 100 100" class="preview-mini-svg">
          <circle cx="50" cy="50" r="45" class="track-bg-preview" />
          <g :transform="`rotate(${sliderOrbital} 50 50)`">
            <line x1="50" y1="5" x2="50" y2="12" class="needle-year" stroke="#3b82f6" />
          </g>
          <g :transform="`rotate(${sliderDaily} 50 50)`">
            <line x1="50" y1="20" x2="50" y2="30" class="needle-day" stroke="#fbbf24" />
          </g>
          <circle cx="50" cy="50" r="15" fill="#fbbf24" style="filter: blur(4px)" />
        </svg>

        <div class="control-stack">
          <input type="range" min="0" max="360" step="0.1" v-model="sliderOrbital" />
          <input type="range" min="0" max="360" step="0.1" v-model="sliderDaily" />
        </div>
      </div>

      <div class="readout-bento">
        <div class="old-world-time">{{ translatedOldWorldDate }}</div>
      </div>

      <button class="init-button" @click="lockHeliGenesis">LOCK HELI-GENESIS</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { diaryStore } from '@/stores/diaryStore.js';

const storeDiary = diaryStore();
const emit = defineEmits(['calibrated']);

const orbits = ref(30);
const sliderOrbital = ref(90);
const sliderDaily = ref(180);
const useCurrentLocation = ref(false);
const currentLocation = ref(null);
const birthPlaceName = ref('');

const translatedOldWorldDate = computed(() => storeDiary.calibrationPreviewDate);
const birthLocationData = computed(() => storeDiary.birthLocation);
const heliOrbit = computed(() => storeDiary.calibrationOrbit);
const heliZenith = computed(() => storeDiary.calibrationZenith);

const requestLocation = () => {
  useCurrentLocation.value = true;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((p) => {
      currentLocation.value = { lat: p.coords.latitude, lng: p.coords.longitude };
    });
  }
};

const convertGPS = () => {
  storeDiary.sendMessageHOP({
    type: 'heliclock',
    action: 'birth-location-search',
    data: { town: birthPlaceName.value }
  });
};

const lockHeliGenesis = () => {
  storeDiary.sendMessageHOP({
    type: 'heliclock',
    action: 'HELI_GENESIS_SAVE',
    data: {
      orbital: heliOrbit.value,
      daily: heliZenith.value,
      orbits: orbits.value,
      location: birthLocationData.value || currentLocation.value
    }
  });
  storeDiary.heliClockSet = true;
  emit('calibrated');
};

watch([sliderOrbital, sliderDaily], () => {
  const loc = birthLocationData.value || currentLocation.value;
  if (!loc) return;
  storeDiary.sendMessageHOP({
    type: 'heliclock',
    action: 'HELI_CALIBRATE_PREVIEW',
    data: { 
      angle: sliderOrbital.value, 
      dayAngle: sliderDaily.value, 
      lon: loc.longitude || loc.lng, 
      lat: loc.latitude || loc.lat 
    }
  });
});
</script>

<style scoped>
/* MODAL / CALIBRATION */
.heli-modal-overlay {
  position: relative;
  background: #fff;
  padding: 2rem;
  border-radius: 40px;
  width: 550px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  max-height: 90vh;
  overflow-y: auto;
}

.location-toggle {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.location-toggle button {
  flex: 1;
  padding: 0.8rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  font-weight: 600;
}

.location-toggle button.active {
  background: #0f172a;
  color: white;
  border-color: #0f172a;
}

.location-info {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
}

.birth-location-form {
  background: #f1f5f9;
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 1.5rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.birth-location-form input {
  padding: 0.8rem;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
}

.preview-mini-svg {
  width: 180px;
  height: 180px;
}

.track-bg-preview {
  fill: none;
  stroke: #f1f5f9;
  stroke-width: 2;
}

/* ORBIT COUNTER */
.orbit-counter {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
}

.counter-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin: 1rem 0;
}

.counter-controls button {
  width: 40px; height: 40px;
  border-radius: 50%;
  border: 1px solid #cbd5e1;
  background: white;
  font-size: 1.2rem;
  cursor: pointer;
}

.orbit-value {
  font-size: 2.5rem;
  font-weight: 900;
  color: #0f172a;
}

.init-button {
  background: #0f172a;
  color: white;
  width: 100%;
  padding: 1.2rem;
  border-radius: 16px;
  font-weight: 800;
  border: none;
  cursor: pointer;
  transition: transform 0.2s;
}

.init-button:active {
  transform: scale(0.98);
}

.close-btn-top {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #64748b;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 10;
}

.close-btn-top:hover {
  background: #e2e8f0;
  color: #1e293b;
  transform: scale(1.1);
}

.readout-bento {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 20px;
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.old-world-time {
  font-family: 'Space Mono', monospace;
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
}

.control-stack {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}

.control-stack input[type="range"] {
  width: 100%;
}
</style>