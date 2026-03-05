<template>
  <!--<div class="heli-wrapper">-->
  <div class="heli-clock-wrapper" :class="{ 'is-mini': mini }" @mousedown.stop @mouseup.stop @click.stop="handleClockClick()">
    <transition name="heli-zoom">
      <div v-if="isCalibrated === false" class="heli-main-layout">
        <div class="calibration-card">
          <button class="init-button" :disabled="tempSignature === false" @click="setClock()">
            SET CLOCK
          </button>
        </div>
      </div>
    </transition>

    <transition>
      <div id="mini-heli" v-if="isCalibrated === true"  class="heli-main-layout">
        <!--<aside class="heli-legend-left">
          <div class="legend-item">
            <span class="degree-mark">0°</span>
            <div class="legend-text"><strong>Vernal Origin</strong><p>Spring Equinox reset.</p></div>
          </div>
          <div class="legend-item">
            <span class="degree-mark">90°</span>
            <div class="legend-text"><strong>Estival Peak</strong><p>Summer Solstice.</p></div>
          </div>
          <div class="legend-item">
            <div class="icon-container"><div class="signature-needle-key"></div><div class="signature-ring-key"></div></div>
            <div class="legend-text"><strong>Your Signature</strong><p>Arrival: {{ storedSignature.toFixed(4) }}°</p></div>
          </div>
        </aside>-->

        <section class="clock-display">
          <div class="orbital-grid">heli clock222
            <!--<svg viewBox="0 0 100 100" class="heli-svg">
              <circle cx="50" cy="50" r="42" class="track-bg" />
              <path :d="describeArc(50, 50, 42, 0, currentDegree)" class="progress-path" />
              <g :transform="`rotate(${storedSignature} 50 50)`">
                <line x1="50" y1="4" x2="50" y2="14" class="signature-needle" />
                <circle cx="50" cy="8" r="3.5" class="signature-ring-target" />
              </g>
              <g :transform="`rotate(${currentDegree} 50 50)`">
                <circle cx="50" cy="8" r="4" class="current-glow" />
                <circle cx="50" cy="8" r="2.2" class="current-dot-core" />
              </g>
              solar cycle in arcs
              <circle cx="50" cy="50" r="32" class="track-bg" style="opacity: 0.3;" />
              <path :d="describeArc(50, 50, 32, 0, dailyDegree)" class="daily-progress-path" />

              <g v-if="solarMarkers.noon !== null">
                <line :transform="`rotate(${solarMarkers.sunrise} 50 50)`" x1="50" y1="16" x2="50" y2="20" class="marker-line sunrise" />
                <line :transform="`rotate(${solarMarkers.sunset} 50 50)`" x1="50" y1="16" x2="50" y2="20" class="marker-line sunset" />
                <circle :transform="`rotate(${solarMarkers.noon} 50 50)`" cx="50" cy="18" r="1.5" class="marker-dot noon" />
              </g>
            </svg>-->

            <div class="sun-core">
              <div class="cycles-whole">{{ precisionCycles.whole }}</div>
              <div class="cycles-decimal">.{{ precisionCycles.decimal }}</div>
              <div class="cycles-label">EARTH ORBITS</div>
              <div class="degree-sub">{{ currentDegree.toFixed(4) }}°</div>
            </div>
          </div>
        </section>

        <!--<aside class="heli-legend-right">
          <div class="legend-item">
            <span class="degree-mark">180°</span>
            <div class="legend-text"><strong>Autumnal Pivot</strong><p>Fall Equinox.</p></div>
          </div>
          <div class="legend-item">
            <span class="degree-mark">270°</span>
            <div class="legend-text"><strong>Hibernal Rest</strong><p>Winter Solstice.</p></div>
          </div>
          <div class="legend-item">
            <div class="icon-container"><div class="current-dot-key"></div></div>
            <div class="legend-text"><strong>Current Orbit</strong><p>Real-time solar progress.</p></div>
          </div>
        </aside>-->
      </div>
  </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { diaryStore } from '@/stores/diaryStore.js';
import { useOrbitStore } from '@/stores/orbitStore.js'

const storeDiary = diaryStore();
const storeOrbit = useOrbitStore();

const emit = defineEmits(['expand', 'select']);

defineProps({
  mini: { type: Boolean, default: false },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 }
});

let clickCount = 0;
let clickTimer = null;
const birthDate = ref('');
const birthTime = ref('12:00');
const storedSignature = ref(0);
const birthTimestamp = ref(0);
const nowTs = ref(Date.now());

onMounted(() => {
});

/* computed */
const isCalibrated = computed(() => {
  console.log(storeDiary.heliClockSet)
  return storeDiary.heliClockSet
});
const currentDegree = computed(() => storeDiary.currentVector);
const tempSignature = computed(() => storeDiary.tempSignature);

const precisionCycles = computed(() => {
  return { whole: 52, decimal: '43434'}
});

// --- Daily Cycle Logic ---


// --- Solar Mathematics (Simplified for PEER Experience) ---


/* methods */
const setClock = () => {
  storeOrbit.heliClockExpand = true
};
const handleClockClick = () => {
  if (storeOrbit.expandedHeliClock) return;
  console.log('click');
  clickCount++;
  if (clickCount === 1) {
    clickTimer = setTimeout(() => {
      if (clickCount === 1) {
        // --- SINGLE CLICK ACTION ---
        emit('select'); 
      }
      clickCount = 0;
    }, 250); // The "window" for the second click
  } else if (clickCount === 2) {
    // --- DOUBLE CLICK ACTION ---
    clearTimeout(clickTimer);
    console.log('double click');
    clickCount = 0;
    emit('expand');
  }
};

</script>

<style scoped>
.heli-clock-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.heli-clock-wrapper.is-mini {
  width: 160px;
  height: 160px;
}

.is-mini .heli-main-layout {
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  grid-template-columns: 1fr;
  grid-template-areas: "center";
  gap: 0;
  border: 2px solid red;
}

.is-mini .heli-legend-left,
.is-mini .heli-legend-right,
.is-mini .recalibrate-trigger {
  display: none;
}

.is-mini .orbital-grid {
  width: 140px;
  height: 140px;
}

.is-mini .sun-core {
  transform: scale(0.35);
}

.is-mini .heli-main-layout,
.is-mini .orbital-grid,
.is-mini .heli-svg,
.is-mini .sun-core,
.is-mini .sun-readout,
.is-mini .cycles-whole,
.is-mini .cycles-decimal,
.is-mini .cycles-label,
.is-mini .degree-sub {
  pointer-events: none;
}

/* GRID WRAPPER */
.heli-wrapper {
  display: grid;
  place-items: center;
  min-height: 50vh;
  background: #fdfdfd;
  font-family: 'Inter', sans-serif;
}

/* MODAL & DASHBOARD LAYOUT (Grid Only) */
.heli-modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  display: grid; place-items: center; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(20px); z-index: 9999;
}
.calibration-card { display: grid; gap: 1.5rem; padding: 3rem; background: white; border-radius: 40px; box-shadow: 0 40px 100px rgba(0,0,0,0.1); width: 400px; text-align: center; }

.heli-main-layout {
  display: grid;
  grid-template-columns: 260px minmax(400px, 1fr) 260px;
  grid-template-areas: "left center right";
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.heli-legend-left { grid-area: left; display: grid; gap: 2rem; padding-left: 2rem; }
.heli-legend-right { grid-area: right; display: grid; gap: 2rem; padding-right: 2rem; }

.clock-display { grid-area: center; display: grid; place-items: center; }

.orbital-grid {
  display: grid;
  grid-template-areas: "stack";
  place-items: center;
  width: 420px;
  height: 420px;
}

.heli-svg { grid-area: stack; width: 100%; height: 100%; overflow: visible; }

/* PRECISION SUN CORE GRID */
.sun-core {
  grid-area: stack;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto auto;
  align-items: end;
  justify-content: center;
  pointer-events: none;
}

.cycles-whole {
  grid-column: 1;
  font-size: 6rem;
  font-weight: 900;
  line-height: 0.8;
  color: #0f172a;
}

.cycles-decimal {
  grid-column: 2;
  font-size: 1.5rem;
  font-family: 'Space Mono', monospace;
  font-weight: 700;
  color: #3b82f6;
  padding-bottom: 0.8rem;
  padding-left: 4px;
}

.cycles-label {
  grid-column: 1 / span 2;
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 4px;
  text-align: center;
  margin: 1rem 0 0.5rem;
}

.degree-sub {
  grid-column: 1 / span 2;
  font-size: 1.1rem;
  font-family: 'Space Mono', monospace;
  font-weight: 600;
  color: #64748b;
  text-align: center;
}

/* VISUAL ELEMENTS (Icons, Marks, Markers) */
.legend-item { display: grid; grid-template-columns: 60px 1fr; gap: 1rem; }
.degree-mark { display: grid; place-items: center; background: #eff6ff; color: #3b82f6; font-family: 'Space Mono'; padding: 4px; border-radius: 6px; font-size: 0.8rem; }
.legend-text strong { font-size: 0.8rem; text-transform: uppercase; }
.legend-text p { font-size: 0.7rem; color: #64748b; }

.icon-container { display: grid; place-items: center; position: relative; height: 32px; }
.signature-needle-key { width: 3px; height: 14px; background: #f59e0b; border-radius: 2px; }
.signature-ring-key { position: absolute; width: 20px; height: 20px; border: 1.5px dashed #f59e0b; border-radius: 50%; }
.current-dot-key { width: 12px; height: 12px; background: white; border: 2px solid #fbce1e; border-radius: 50%; box-shadow: 0 0 10px #fbce1e; }

.track-bg { fill: none; stroke: #f1f5f9; stroke-width: 2; }
.cell-passed { stroke: #4facfe; stroke-width: 2; fill: none; }
.cell-future { stroke: #e1e8ed; stroke-width: 2; fill: none; }
.progress-path { fill: none; stroke: #3b82f6; stroke-width: 4; stroke-linecap: round; }
.signature-needle { stroke: #f59e0b; stroke-width: 2; }
.signature-ring-target { fill: none; stroke: #f59e0b; stroke-width: 1; stroke-dasharray: 1, 2; }
.current-dot-core { fill: white; stroke: #fbce1e; stroke-width: 2; }
.current-glow { fill: #fbce1e; fill-opacity: 0.3; filter: blur(4px); }

.init-button { background: #0f172a; color: white; border: none; padding: 1rem; border-radius: 12px; font-weight: 800; }
.recalibrate-trigger { background: none; border: none; color: #cbd5e1; text-decoration: underline; margin-top: 2rem; cursor: pointer; }

@media (max-width: 1000px) {
  .heli-main-layout { grid-template-columns: 1fr; grid-template-areas: "center" "left" "right"; }
}


.daily-progress-path {
  fill: none;
  stroke: #10b981; /* Emerald for daily vitality */
  stroke-width: 2.5;
  stroke-linecap: round;
  filter: drop-shadow(0 0 2px rgba(16, 185, 129, 0.4));
}

.marker-line {
  stroke: #2c63b1;
  stroke-width: 1;
}

.marker-line.sunrise { stroke: #fb923c; stroke-width: 2; } /* Orange */
.marker-line.sunset { stroke: #6366f1; stroke-width: 2; }  /* Indigo */
.marker-dot.noon { fill: #facc15; } /* Bright Yellow Zenith */


</style>