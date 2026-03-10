<template>
  <div class="heli-wrapper" @click.self="emit('close')">
    <HeliGenesis v-if="!isCalibrated" @calibrated="setCloseGenesis()" />

    <div v-if="isCalibrated" class="heli-main-layout" :style="dynamicAtmosphere">
      
      <aside class="heli-sidebar">
        <div class="bento-card">
          <header class="card-header">Navigator</header>
          <div class="stepper">
            <button @click="adjustProjection(-1)">−</button>
            <input type="number" :value="daySeeker" @input="e => handleManualInput(e.target.value)" />
            <button @click="adjustProjection(1)">+</button>
          </div>
          <div class="status-zone">
            <span :class="['status-tag', { active: isProjecting }]">
              {{ isProjecting ? `PROJECTING +${daySeeker}d` : 'LIVE SYNC' }}
            </span>
          </div>
        </div>
      </aside>

      <section class="clock-display">
        <div class="orbital-grid">
          
          <svg viewBox="0 0 100 100" class="heli-svg">
            <defs>
              <clipPath id="innerRingClip"><circle cx="50" cy="50" r="38" /></clipPath>
              
              <radialGradient id="skyGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" :stop-color="isDaylight ? '#fbbf24' : '#6366f1'" stop-opacity="0.15" />
                <stop offset="100%" :stop-color="isDaylight ? '#fbbf24' : '#0f172a'" stop-opacity="0" />
              </radialGradient>
            </defs>

            <circle cx="50" cy="50" r="48" fill="url(#skyGradient)" />

            <g clip-path="url(#innerRingClip)">
              <path 
                :d="describeArc(50, 50, 38, nightArc.start, nightArc.end)" 
                fill="#0f172a" 
                fill-opacity="0.3" 
              />
            </g>

            <g class="markers" stroke="#cbd5e1" stroke-width="0.5" opacity="0.6">
              <line x1="50" y1="2" x2="50" y2="7" />
              <line x1="98" y1="50" x2="93" y2="50" />
              <line x1="50" y1="98" x2="50" y2="93" />
              <line x1="2" y1="50" x2="7" y2="50" />
            </g>

            <g v-if="storedSignature?.birthorbital !== undefined" :transform="`rotate(${storedSignature.birthorbital}, 50, 50)`">
              <line x1="50" y1="1" x2="50" y2="12" stroke="#f59e0b" stroke-width="1" />
              <circle cx="50" cy="2" r="1.5" fill="#f59e0b" />
            </g>

            <g class="rings">
              <circle cx="50" cy="50" r="44" class="track-outline" />
              <path :d="describeArc(50, 50, 44, 0, displayYearly)" class="wedge-fill-year" />
              
              <circle cx="50" cy="50" r="36" class="track-outline" />
              <path :d="describeArc(50, 50, 36, 0, displayDaily)" class="wedge-fill-day" />
            </g>

            <g :transform="`rotate(${displayDaily}, 50, 50)`">
              <circle cx="50" cy="14" r="3.5" :class="isDaylight ? 'sun-body' : 'moon-body'" />
              <text y="10.5" x="50" font-size="5" text-anchor="middle" class="body-icon">
                {{ isDaylight ? '☀️' : '🌙' }}
              </text>
            </g>
          </svg>

          <div class="sun-readout-overlay">
            <div class="cycles-whole">{{ activeCycles?.whole || 0 }}</div>
            <div class="cycles-decimal">.{{ activeCycles?.decimal || '000' }}</div>
            <div class="date-label">{{ projectedDateString }}</div>
          </div>
        </div>
        <div class="clock-actions">
          <button class="action-btn" @click="storeDiary.heliClockSet = false">
            ⚙️ Update Genesis Anchor
          </button>
        </div>
      </section>

      <aside class="heli-sidebar">
        <div class="bento-card" v-if="isProjecting">
          <header class="card-header">Commit Anchor</header>
          <input type="text" v-model="newEventLabel" placeholder="Solar Event..." class="anchor-input" />
          <button class="primary-btn" @click="confirmEvent">LOCK ANCHOR</button>
          <button class="secondary-btn" @click="resetToNow">COLLAPSE</button>
        </div>
      </aside>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import HeliGenesis from '@/components/orbit/clock/HeliGenesis.vue';
import { diaryStore } from '@/stores/diaryStore.js';

const storeDiary = diaryStore();
const emit = defineEmits(['close']);

/* --- STATE --- */
const isProjecting = ref(false);
const daySeeker = ref(0);
const newEventLabel = ref('');

/* --- COMPUTED --- */
const isCalibrated = computed(() => storeDiary.heliClockSet);
const storedSignature = computed(() => storeDiary.orbitSignature);
const displayDaily = computed(() => (isProjecting.value ? storeDiary.projectionData?.daily : storeDiary.heliSignature.daily) || 0);
const displayYearly = computed(() => (isProjecting.value ? storeDiary.projectionData?.yearly : storeDiary.heliSignature.yearly) || 0);
const activeCycles = computed(() => storeDiary.heliSignature.age);

const dynamicAtmosphere = computed(() => ({
  '--bg-color': isDaylight.value ? '#ffffff' : '#f8fafc',
  'background-color': 'var(--bg-color)',
  'transition': 'background-color 2s ease'
}));

/* --- DYNAMIC NIGHT/DAY ARC --- */
const nightArc = computed(() => {
  // Convert 24h time to degrees (0-360)
  // Formula: (Hours * 15) + (Minutes * 0.25)
  
  // Sunset 18:03
  const sunsetDeg = (18 * 15) + (3 * 0.25); // ~270.75°
  
  // Sunrise 06:42
  const sunriseDeg = (6 * 15) + (42 * 0.25); // ~100.5°
  
  return {
    start: sunsetDeg,
    end: sunriseDeg
  };
});

// Update isDaylight to be smarter: check if current sun degree is NOT in the night arc
const isDaylight = computed(() => {
  const deg = displayDaily.value % 360;
  // If sunset is 270 and sunrise is 100, we are in daylight if degree is between 100 and 270
  return deg > nightArc.value.end && deg < nightArc.value.start;
});


const projectedDateString = computed(() => {
  const ts = Date.now() + (daySeeker.value * 86400000);
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
});

/* --- METHODS --- */
const setCloseGenesis = () => {
  isProjecting.value = false;
  storeDiary.heliClockSet = !storeDiary.heliClockSet
}

const describeArc = (x, y, r, start, end) => {
  const rad = (deg) => (deg - 90) * Math.PI / 180.0;
  const s = { x: x + r * Math.cos(rad(end)), y: y + r * Math.sin(rad(end)) };
  const e = { x: x + r * Math.cos(rad(start)), y: y + r * Math.sin(rad(start)) };
  const largeArc = (end - start + 360) % 360 <= 180 ? "0" : "1";
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y}`;
};

const adjustProjection = (d) => { daySeeker.value += d; sync(); };
const handleManualInput = (v) => { daySeeker.value = parseInt(v) || 0; sync(); };
const sync = () => {
  isProjecting.value = daySeeker.value !== 0;
  storeDiary.sendMessageHOP({ type: 'heli-project', timestamp: Date.now() + (daySeeker.value * 86400000) });
};
const resetToNow = () => { daySeeker.value = 0; isProjecting.value = false; };
</script>

<style scoped>
/* WRAPPER & LAYOUT */
.heli-wrapper {
  position: fixed; inset: 0; z-index: 9999;
  display: grid; place-items: center;
  background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(12px);
  font-family: 'Inter', sans-serif;
}

.heli-main-layout {
  display: grid; grid-template-columns: 280px 1fr 280px;
  width: 95vw; height: 85vh; padding: 2rem; border-radius: 40px;
  align-items: center;
}

/* CLOCK VISUALS */
.orbital-grid {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: 100%; max-width: 500px; margin: 0 auto;
}

.heli-svg { width: 100%; height: auto; overflow: visible; }
.track-outline { fill: none; stroke: #e2e8f0; stroke-width: 0.75; stroke-dasharray: 1, 3; }
.wedge-fill-day { fill: none; stroke: #fbbf24; stroke-width: 3.5; stroke-linecap: round; }
.wedge-fill-year { fill: none; stroke: #3b82f6; stroke-width: 2.5; stroke-linecap: round; }

.sun-body { fill: #fbbf24; filter: drop-shadow(0 0 4px rgba(251, 191, 36, 0.3)); }
.moon-body { fill: #94a3b8; }
.body-icon { pointer-events: none; }

/* CENTER READOUT */
.sun-readout-overlay {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
  display: flex; flex-direction: column; align-items: center;
}

.cycles-whole {
  font-size: 4.5rem; font-weight: 900; line-height: 0.85;
  color: #1e293b; letter-spacing: -2px;
}

.cycles-decimal {
  font-size: 1.3rem; font-weight: 700; color: #94a3b8;
  font-family: 'Space Mono', monospace; margin-top: 0.3rem;
}

.date-label {
  margin-top: 0.8rem; font-weight: 700; color: #64748b;
  letter-spacing: 1px; font-size: 0.65rem; text-transform: uppercase;
  background: rgba(255, 255, 255, 0.6); padding: 2px 10px; border-radius: 6px;
}

.clock-actions {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
}

.action-btn {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn:hover {
  background: #e2e8f0;
  color: #1e293b;
  transform: translateY(-1px);
}

.action-btn:active {
  transform: translateY(0);
}

/* SIDEBAR & BENTO */
.heli-sidebar { display: flex; flex-direction: column; gap: 1.5rem; }
.bento-card { background: white; padding: 1.5rem; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); }
.card-header { font-weight: 800; font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; margin-bottom: 1rem; }

.stepper { display: flex; align-items: center; gap: 0.5rem; background: #f1f5f9; padding: 0.5rem; border-radius: 12px; }
.stepper button { width: 34px; height: 34px; border-radius: 8px; border: none; background: white; cursor: pointer; font-weight: bold; }
.stepper input { width: 60px; text-align: center; background: transparent; border: none; font-weight: 800; font-family: 'Space Mono', monospace; }

.anchor-input { width: 100%; padding: 0.8rem; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600; margin-bottom: 1rem; }
.primary-btn { background: #0f172a; color: white; width: 100%; padding: 1rem; border-radius: 16px; border: none; font-weight: 800; cursor: pointer; }
.secondary-btn { background: none; border: none; color: #94a3b8; width: 100%; margin-top: 0.8rem; font-size: 0.75rem; cursor: pointer; }

.status-tag { padding: 0.4rem 0.8rem; border-radius: 20px; font-size: 0.65rem; font-weight: 800; background: #f1f5f9; color: #64748b; }
.status-tag.active { background: #3b82f6; color: white; }
</style>