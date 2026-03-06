<template>
  <div class="heli-wrapper" @click.self="emit('close')" @dblclick.stop>
    <transition name="heli-zoom">
      <div v-if="!isCalibrated" class="heli-modal-overlay">
        <div class="calibration-card">
          <header class="modal-header">
            <div class="orb-icon"></div>
            <h2>Solar Alignment</h2>
          </header>

          <!-- ask for orbit gensis ingredients -->
          <div class="orbit-counter">
            <label>Earth Orbits Completed</label>
            <div class="counter-controls">
              <button @click="orbits--" :disabled="orbits <= 0">−</button>
              <span class="orbit-value">{{ orbits }}</span>
              <button @click="orbits++">+</button>
            </div>
            <p class="help-text">How many times have you circled the Sun?</p>
          </div>

          <div class="location-toggle">
            <button :class="{ active: useCurrentLocation }" @click="requestLocation">
              📍 Current GPS
            </button>
            <button :class="{ active: !useCurrentLocation }" @click="useCurrentLocation = false">
              🗺️ Pick Birthplace
            </button>
          </div>

          <div v-if="currentLocation" class="location-info">
            <p>Current: {{ currentLocation.lat.toFixed(4) }}, {{ currentLocation.lng.toFixed(4) }}</p>
            <div class="mini-map">
              <ol-map style="width: 100%; height: 150px;">
                <ol-view :center="[currentLocation.lng, currentLocation.lat]" :zoom="12" projection="EPSG:4326" />
                <ol-tile-layer>
                  <ol-source-osm />
                </ol-tile-layer>
              </ol-map>
            </div>
            
            <div class="comparison-zone">
              <p>Is this different from your birth location?</p>
              <div class="choice-btns">
                <button @click="isDifferentFromBirth = true">Yes, Different</button>
                <button @click="isDifferentFromBirth = false">No, Same</button>
              </div>
            </div>
          </div>

          <div v-if="isDifferentFromBirth" class="birth-location-form">
            <h3>Describe Birth Location</h3>
            <div class="input-group">
              <input type="text" v-model="birthPlaceName" placeholder="Place Name (e.g. London)" />
              <!--<input type="text" v-model="birthCountry" placeholder="Country" />-->
            </div>
            <div class="mini-map" v-if="birthPlaceName">
               <!-- In a real local-first app, we'd need a local geocoder or manual lat/lng -->
               <p class="help-text">Confirming location: {{ birthPlaceName }}, {{ birthCountry }} @ Long: {{ birthLocationData?.longitude }}, Lat: {{ birthLocationData?.latitude }}</p>
            </div>
            <button @click="convertGPS()">Find location</button>
          </div>
          <header>
            <h2>Rotate the Earth to your Genesis Position.</h2>
          </header>
          <!-- peer can set angle -->
          <div class="dual-dial-zone">
            <svg viewBox="0 0 100 100" class="preview-mini-svg">
              <circle cx="50" cy="50" r="45" class="track-bg-preview" />
              <g :transform="`rotate(${sliderOrbital} 50 50)`">
                <line x1="50" y1="5" x2="50" y2="12" class="needle-year" />
                <circle cx="50" cy="5" r="2" class="dot-year" />
              </g>

              <circle cx="50" cy="50" r="30" class="track-bg-preview" style="opacity: 0.5" />
              <g :transform="`rotate(${sliderDaily} 50 50)`">
                <line x1="50" y1="20" x2="50" y2="30" class="needle-day" />
                <circle cx="50" cy="20" r="1.5" class="dot-day" />
              </g>

              <circle cx="50" cy="50" r="15" :style="{ fill: lightColor, filter: 'blur(4px)' }" />
            </svg>

            <div class="control-stack">
              <div class="input-group">
                <label>Rotate the Year (Season)</label>
                <input type="range" min="0" max="360" step="0.1" v-model="sliderOrbital" />
              </div>
              
              <div class="input-group">
                <label>Rotate the Day (Moment)</label>
                <input type="range" min="0" max="360" step="0.1" v-model="sliderDaily" />
              </div>
            </div>

            <div class="readout-bento">
              <div class="old-world-time">{{ translatedOldWorldDate }}</div>
              <div class="solar-stats">
                <span>Elevation: {{ heliOrbit }}°</span>
                <span>Intensity: {{ heliZenith }}%</span>
              </div>
            </div>
          </div>


          <button class="init-button" @click="lockHeliGenesis()">
            LOCK HELI-GENESIS
          </button>
          <div id="explain-genesis-birth">
            "By locking these angles, you tether your digital identity to the physical sun. This is your Solar Signature—the exact tilt and rotation of the Earth when you began. From this moment, the Heli Clock will always know where you are in relation to where you started."
          </div>
        </div>
      </div>
    </transition>
    <!-- main heli clock -->
    <div v-if="isCalibrated" class="heli-main-layout" style="--sun-intensity: atmosphereOpacity">
      <aside class="heli-sidebar">
        <div class="bento-card">
          <header class="card-header">Navigator</header>
          <div class="nav-group">
            <label>Solar Day Stepper</label>
            <div class="stepper">
              <button @click="adjustProjection(-1)">-</button>
              <input type="number" :value="daySeeker" @input="e => handleManualInput(e.target.value)" />
              <button @click="adjustProjection(1)">+</button>
            </div>
          </div>
          <div class="bundle-row">
            <button @click="adjustProjection(10)" class="bundle-btn">+10d</button>
            <button @click="adjustProjection(30)" class="bundle-btn">+30d</button>
          </div>
          <div class="status-zone">
            <span :class="['status-tag', { active: isProjecting }]">
              {{ isProjecting ? `PROJECTING +${daySeeker}d` : 'LIVE SYNC' }}
            </span>
          </div>
        </div>

        <div class="bento-card manifest-area" v-if="committedEvents.length > 0">
          <label class="card-header">Active Manifest</label>
          <div class="manifest-scroll">
            <div v-for="e in committedEvents" :key="e.id" class="manifest-item" @click="jumpToEvent(e)">
              <div class="manifest-info">
                <strong>{{ e.label }}</strong>
                <small>{{ new Date(e.ts).toLocaleDateString() }}</small>
              </div>
              <span class="mini-degree">{{ e.dailyDegree.toFixed(0) }}°</span>
            </div>
          </div>
        </div>
      </aside>
      <!-- the heli clock  digital solar clock -->
      <section class="clock-display">dd {{ storeDiary.heliSignature }}  ss {{ storedSignature }}
        <div class="orbital-grid">
          <svg viewBox="0 0 100 100" class="heli-svg">
            <defs>
              <clipPath id="innerRingClip">
                <circle cx="50" cy="50" r="36" />
              </clipPath>
              
              <filter id="sunGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <g clip-path="url(#innerRingClip)">
              <g :transform="`rotate(${activeDailyDegree + 180}, 50, 50)`">
                <rect x="0" y="0" width="100" height="50" fill="#0f172a" fill-opacity="0.2" />
              </g>
            </g>

            <g class="year-segments">
              <path 
                v-for="deg in 360" 
                :key="'y'+deg"
                :d="describeArc(50, 50, 46, deg-1, deg)"
                :class="deg <= displayYearly ? 'wedge-passed-year' : 'wedge-future'"
              />
            </g>

            <g class="day-segments">
              <path 
                v-for="deg in 360" 
                :key="'d'+deg"
                :d="describeArc(50, 50, 36, deg-1, deg)"
                :class="deg <= displayDaily ? 'wedge-passed-day' : 'wedge-future'"
              />
            </g>

            <g clip-path="url(#innerRingClip)">
              <g :transform="`rotate(${displayDaily - 90}, 50, 50)`">
                <rect x="0" y="50" width="100" height="50" fill="#0f172a" fill-opacity="0.3" />
              </g>
            </g>

            <g v-if="storedSignature" :transform="`rotate(${storedSignature.birthorbital}, 50, 50)`">
              <line x1="50" y1="2" x2="50" y2="8" stroke="#f59e0b" stroke-width="2" />
              <circle cx="50" cy="5" r="1.5" fill="#f59e0b" />
            </g>

            <!-- markers for equinox -->
             <g class="markers">
                <line x1="50" y1="0" x2="50" y2="6" class="pillar" stroke-width="2" /> 
                
                <line x1="94" y1="50" x2="100" y2="50" class="pillar" stroke-width="2" /> 
                
                <line x1="50" y1="94" x2="50" y2="100" class="pillar" stroke-width="2" /> 
                
                <line x1="0" y1="50" x2="6" y2="50" class="pillar" stroke-width="2" /> 
              </g>

            <!-- marker for night day-->
              <g :transform="`rotate(${displayYearly}, 50, 50)`" filter="url(#sunGlow)">
                <circle cx="50" cy="4" r="2.5" fill="#3b82f6" /> <circle cx="50" cy="4" r="1" fill="white" />
              </g>

              <g :transform="`rotate(${displayDaily}, 50, 50)`" filter="url(#sunGlow)">
                <circle cx="50" cy="14" r="3.5" fill="#fbbf24" /> <circle cx="50" cy="14" r="1.5" fill="white" />
                
                <text v-if="displayDaily > 90 && displayDaily < 270" 
                      y="10" x="50" class="mini-icon" text-anchor="middle">☀️</text>
                <text v-else 
                      y="10" x="50" class="mini-icon" text-anchor="middle">🌙</text>
              </g>

              <!-- match real sunrise sun set -->
              <defs>
              <radialGradient id="daylightGlow" cx="50%" cy="50%" r="50%">
                <stop offset="70%" stop-color="#fbbf24" stop-opacity="0.1" />
                <stop offset="100%" stop-color="#fbbf24" stop-opacity="0" />
              </radialGradient>
            </defs>

            <g class="daylight-range">
              <path 
                :d="describeArc(50, 50, 38, daylightSpan.start, daylightSpan.end)" 
                fill="none" 
                stroke="url(#daylightGlow)" 
                stroke-width="8" 
                stroke-linecap="round"
                style="filter: blur(2px); opacity: 0.6;"
              />
              <line :transform="`rotate(${daylightSpan.start}, 50, 50)`" x1="50" y1="34" x2="50" y2="40" stroke="#fbbf24" stroke-width="0.5" />
              <line :transform="`rotate(${daylightSpan.end}, 50, 50)`" x1="50" y1="34" x2="50" y2="40" stroke="#fbbf24" stroke-width="0.5" />
            </g>
          </svg>

          <div class="sun-readout">
            <div class="cycles-whole">{{ activeCycles.orbits }}</div>
            <div class="cycles-decimal">.{{ activeCycles?.decimal }}</div>
            <div class="date-label">{{ projectedDateString }}</div>
          </div>
        </div>
      </section>

      <aside class="heli-sidebar">
        <div class="bento-card scheduler" v-if="isProjecting">
          <header class="card-header">Commit Anchor</header>
          <div class="input-group">
            <label>Event Name</label>
            <input type="text" v-model="newEventLabel" placeholder="Solar Sync..." />
          </div>
          <div v-if="hasCollision" class="collision-alert">RESONANCE COLLISION</div>
          <button class="primary-btn" :disabled="hasCollision" @click="confirmEvent">LOCK ANCHOR</button>
          <button class="secondary-btn" @click="resetToNow">COLLAPSE TO PRESENT</button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { diaryStore } from '@/stores/diaryStore.js';

const storeDiary = diaryStore();
const emit = defineEmits(['close']);

/* --- 1. INITIALIZATION STATE --- */
const orbits = ref(30);
const sliderOrbital = ref(90);
const sliderDaily = ref(180);
const useCurrentLocation = ref(false);
const currentLocation = ref(null);
const isDifferentFromBirth = ref(null);
const birthPlaceName = ref('');
const birthCountry = ref('');

/* Computed Store Accessors */
const isCalibrated = computed(() => storeDiary.heliClockSet);
const storedSignature = computed(() => storeDiary.orbitSignature);
const birthLocationData = computed(() => storeDiary.birthLocation);
const heliZenith = computed(() => storeDiary.calibrationZenith);
const heliOrbit = computed(() => storeDiary.calibrationOrbit);

// Unified Daily: If projecting, show projection. If not, show live signature.
const displayDaily = computed(() => {
  if (isProjecting.value && storeDiary.projectionData?.daily !== undefined) {
    return storeDiary.projectionData.daily;
  }
  return storeDiary.heliSignature.daily || 0;
});

// Unified Yearly: Same logic for the outer ring
const displayYearly = computed(() => {
  if (isProjecting.value && storeDiary.projectionData?.yearly !== undefined) {
    return storeDiary.projectionData.yearly;
  }
  return storeDiary.heliSignature.yearly || 0;
});

/* --- 2. LIVE CLOCK & PROJECTION --- */
const isProjecting = ref(false);
const daySeeker = ref(0);
const newEventLabel = ref('');
const committedEvents = ref([]); // Pull from store in production

const currentYearlyDegree = computed(() => storeDiary.heliSignature.yearly || 0);
const currentDailyDegree = computed(() => (storeDiary.heliSignature.daily) % 360);

const projectionTargetYearly = computed(() => storeDiary.projectionData?.yearly || 0);
const projectionTargetDaily = computed(() => storeDiary.projectionData?.daily || 0);
const activeDailyDegree = computed(() => storeDiary.projectionData?.daily)

/* --- 3. METHODS --- */
const requestLocation = () => {
  useCurrentLocation.value = true;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      currentLocation.value = { lat: position.coords.latitude, lng: position.coords.longitude };
    });
  }
};

const convertGPS = () => {
  storeDiary.sendMessageHOP({
    type: 'heliclock',
    action: 'birth-location-search',
    data: { town: birthPlaceName.value, country: birthCountry.value }
  });
};

const lockHeliGenesis = () => {
  storeDiary.sendMessageHOP({
    type: 'heliclock',
    action: 'HELI_GENESIS_SAVE',
    data: {
      orbital: heliOrbit.value,
      daily: heliZenith.value,
      location: { 
        place: birthLocationData.value?.name, 
        lat: birthLocationData.value?.latitude, 
        long: birthLocationData.value?.longitude 
      },
      orbits: orbits.value
    }
  });
  storeDiary.heliClockSet = true;
};

// Unified Watcher for Calibration
watch([sliderOrbital, sliderDaily], () => {
  const loc = birthLocationData.value;
  if (!loc?.longitude) return;

  storeDiary.sendMessageHOP({
    type: 'heliclock',
    action: 'HELI_CALIBRATE_PREVIEW',
    data: {
      angle: sliderOrbital.value,
      lon: loc.longitude,
      lat: loc.latitude,
      orbits: orbits.value,
      dayAngle: sliderDaily.value,
    }
  });
});

const translatedOldWorldDate = computed(() => storeDiary.calibrationPreviewDate);

/* sun rise sun set */
  const daylightSpan = computed(() => {
  // We need the 'Length' of the day in degrees. 
  // At the Equinox (now), it's roughly 180° (12 hours).
  // In mid-winter Aboyne, it's ~100° (6.5 hours).
  
  // For now, we'll approximate based on the current Yearly position,
  // but the WASM can provide exact sunrise/sunset soon.
  const orbit = currentYearlyDegree.value;
  const tiltFactor = Math.cos((orbit - 90) * Math.PI / 180); // Max at Summer Solstice
  
  // Aboyne Range: ~90° to ~270° span
  const halfSpan = 90 + (tiltFactor * 45); 
  
  return {
    start: 180 - halfSpan, // Sunrise
    end: 180 + halfSpan    // Sunset
  };
});

const atmosphereOpacity = computed(() => {
  // If Zenith is > 90, it's night. 
  // If Zenith is 0, it's max brightness.
  const z = storeDiary.heliSignature.zenith || 90;
  return Math.max(0.1, 1 - (z / 110)); 
});

/* --- 4. HELPERS --- */
const describeArc = (x, y, r, start, end) => {
  const rad = (deg) => (deg - 90) * Math.PI / 180.0;
  const s = { x: x + r * Math.cos(rad(end)), y: y + r * Math.sin(rad(end)) };
  const e = { x: x + r * Math.cos(rad(start)), y: y + r * Math.sin(rad(start)) };
  const largeArc = (end - start + 360) % 360 <= 180 ? "0" : "1";
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y}`;
};

const syncFromDays = () => {
  isProjecting.value = daySeeker.value !== 0;
  const ts = Date.now() + (daySeeker.value * 86400000);
  storeDiary.sendMessageHOP({ type: 'heli-project', timestamp: ts });
};

const adjustProjection = (days) => { daySeeker.value += days; syncFromDays(); };
const handleManualInput = (val) => { daySeeker.value = parseInt(val) || 0; syncFromDays(); };
const resetToNow = () => { isProjecting.value = false; daySeeker.value = 0; };

const activeCycles = computed(() => {
  const total = storeDiary.heliSignature.age
  return {
    orbits: Math.floor(total),
    decimal: (total % 1).toFixed(6).split('.')[1]
  };
});

const projectedDateString = computed(() => {
  const ts = Date.now() + (daySeeker.value * 86400000);
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
});

const hasCollision = computed(() => {
  if (!isProjecting.value) return false;
  return committedEvents.value.some(e => Math.abs(e.dailyDegree - projectionTargetDaily.value) < 2.5);
});
</script>

<style scoped>
/* BASE WRAPPER */
.heli-wrapper { display: grid; place-items: center; min-height: 100vh; background: rgba(0,0,0,0.6); position: fixed; inset: 0; z-index: 9999; backdrop-filter: blur(12px); font-family: 'Inter', sans-serif; }

/* MODAL / CALIBRATION */
.heli-modal-overlay { background: #fff; padding: 2rem; border-radius: 40px; width: 450px; box-shadow: 0 30px 60px rgba(0,0,0,0.3); text-align: center; max-height: 90vh; overflow-y: auto; }
.location-toggle { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
.location-toggle button { flex: 1; padding: 0.8rem; border-radius: 12px; border: 1px solid #e2e8f0; background: white; cursor: pointer; font-weight: 600; }
.location-toggle button.active { background: #0f172a; color: white; border-color: #0f172a; }

.location-info { background: #f8fafc; padding: 1rem; border-radius: 20px; margin-bottom: 1.5rem; }
.mini-map { border-radius: 12px; overflow: hidden; margin: 1rem 0; border: 1px solid #e2e8f0; }
.comparison-zone { margin-top: 1rem; }
.choice-btns { display: flex; gap: 0.5rem; justify-content: center; margin-top: 0.5rem; }
.choice-btns button { padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid #cbd5e1; background: white; cursor: pointer; }

.birth-location-form { background: #f1f5f9; padding: 1.5rem; border-radius: 20px; margin-bottom: 1.5rem; text-align: left; }
.birth-location-form h3 { font-size: 1rem; margin-bottom: 1rem; color: #1e293b; }
.birth-location-form .input-group { display: flex; flex-direction: column; gap: 0.75rem; }
.birth-location-form input { padding: 0.8rem; border-radius: 10px; border: 1px solid #cbd5e1; }

.slider-zone { margin: 2rem 0; display: grid; gap: 1rem; place-items: center; }
.preview-mini-svg { width: 180px; height: 180px; }
.track-bg-preview { fill: none; stroke: #f1f5f9; stroke-width: 2; }
.preview-needle { stroke: #3b82f6; stroke-width: 3; stroke-linecap: round; }
.preview-dot { fill: #3b82f6; }
.readout-container { margin: 1rem 0; }
.old-world-preview { font-weight: 800; font-size: 1.1rem; color: #1e293b; }
.degree-readout { font-family: 'Space Mono'; color: #64748b; font-size: 0.9rem; }
.solar-range { width: 100%; cursor: pointer; }

/* ORBIT COUNTER */
.orbit-counter { background: #f8fafc; padding: 1.5rem; border-radius: 20px; margin-bottom: 2rem; }
.counter-controls { display: flex; justify-content: center; align-items: center; gap: 1.5rem; margin: 1rem 0; }
.counter-controls button { width: 40px; height: 40px; border-radius: 50%; border: 1px solid #cbd5e1; background: white; font-size: 1.2rem; cursor: pointer; }
.orbit-value { font-size: 2.5rem; font-weight: 900; color: #0f172a; }
.help-text { font-size: 0.75rem; color: #94a3b8; }
.init-button { background: #0f172a; color: white; width: 100%; padding: 1.2rem; border-radius: 16px; font-weight: 800; border: none; cursor: pointer; transition: transform 0.2s; }
.init-button:active { transform: scale(0.98); }

/* MAIN LAYOUT */
.heli-main-layout {
  display: grid;

  background: rgba(
    calc(250 * var(--sun-intensity)), 
    calc(250 * var(--sun-intensity)), 
    calc(255 * var(--sun-intensity)), 
    1
  );
  /* Smooth transition so it doesn't 'jump' when the pulse hits */
  transition: background 2s ease-in-out;
  grid-template-columns: 320px 1fr 320px;
  gap: 2rem;
  width: 90vw;
  max-width: 1400px;
  height: 85vh;
  padding: 2rem;
  background: #fafafa;
  border-radius: 40px;
  align-items: center;
  overflow: hidden;
}

.heli-main-layout::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* Orange tint that only appears near sunset */
  background: orange;
  opacity: calc(1 - abs(var(--sun-intensity) - 0.5) * 2); 
  mix-blend-mode: soft-light;
}

.heli-sidebar { display: flex; flex-direction: column; gap: 1.5rem; height: 100%; overflow-y: auto; }
.bento-card { 
  background: rgba(255, 255, 255, var(--sun-intensity));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: background 2s ease; box-shadow: 0 4px 20px rgba(0,0,0,0.02);
}

/* SVG CLOCK ELEMENTS */
.orbital-grid { display: grid; grid-template-areas: "stack"; place-items: center; width: 520px; height: 520px; }
.heli-svg { grid-area: stack; width: 100%; height: 100%; overflow: visible; filter: drop-shadow(0 0 10px rgba(251, 191, 36, calc(var(--sun-intensity) * 0.3))); }
.atmosphere-glow { fill: #fbbf24; filter: blur(25px); transition: opacity 0.8s; }
.track-line { fill: none; stroke: #e2e8f0; }
.track-inner { stroke-width: 4; stroke-opacity: 0.5; }
.arc-yearly { fill: none; stroke: #3b82f6; stroke-width: 3; stroke-linecap: round; }
.cell-passed { stroke: #3b82f6; stroke-width: 2.5; opacity: 0.2; }
.cell-future { stroke: #e2e8f0; stroke-width: 1; }

/* TETHERS & SUNS */
.tether-birth { stroke: #f59e0b; stroke-width: 1; stroke-dasharray: 2 2; }
.birth-needle { fill: #f59e0b; }
.sun-glow { fill: #fbce1e; fill-opacity: 0.4; }
.sun-glow.colliding { fill: #ef4444; }
.sun-core { fill: white; stroke: #fbce1e; stroke-width: 2; }
.tether-bridge { stroke: #fbce1e; stroke-width: 1; stroke-dasharray: 3 3; }

/* READOUT */
.sun-readout { grid-area: stack; pointer-events: none; text-align: center; }
.cycles-whole { font-size: 3rem; font-weight: 900; color: #0f172a; line-height: 1; }
.cycles-decimal { font-family: 'Space Mono'; font-size: 1rem; color: #3b82f6; }
.date-label { font-weight: 800; text-transform: uppercase; color: #94a3b8; letter-spacing: 2px; margin-top: 1rem; }

/* UTILS */
.status-tag { font-size: 0.7rem; font-weight: 800; padding: 4px 10px; border-radius: 99px; background: #f1f5f9; }
.status-tag.active { background: #dcfce7; color: #15803d; }
.collision-alert { color: #ef4444; font-weight: 800; font-size: 0.75rem; margin: 1rem 0; }
.primary-btn { background: #0f172a; color: white; padding: 1rem; border-radius: 12px; width: 100%; border: none; font-weight: 700; cursor: pointer; }


.needle-year { stroke: #3b82f6; stroke-width: 2; stroke-linecap: round; }
.dot-year { fill: #3b82f6; }

.needle-day { stroke: #fbbf24; stroke-width: 2.5; stroke-linecap: round; }
.dot-day { fill: #fbbf24; }

.readout-bento {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 20px;
  margin-top: 1rem;
  border: 1px solid #e2e8f0;
}

.old-world-time {
  font-family: 'Space Mono', monospace;
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
}

/* The Segments */
.wedge-future {
  stroke: #1e293b; /* Dark slate for the 'unlived' future */
  stroke-width: 1;
  stroke-opacity: 0.2;
  fill: none;
}

.wedge-passed-year {
  stroke: #3b82f6;
  stroke-width: 4; /* Thick block for the year */
  stroke-linecap: butt;
  fill: none;
}

.wedge-passed-day {
  stroke: #fbbf24;
  stroke-width: 4; /* Depth of the ring */
  stroke-linecap: butt; /* Prevents gaps between segments */
  fill: none;
  transition: stroke 0.3s ease;
}

.pillar {
  stroke: #94a3b8;
  stroke-width: 1.5;
  stroke-linecap: round;
}

.mini-icon {
  font-size: 5px; /* Tiny emojis */
  text-anchor: middle;
  pointer-events: none;
}

</style>