<template>
  <div class="heli-container">
    <div class="orbital-grid">
      <svg viewBox="0 0 100 100" class="heli-svg">
        <path 
          v-for="day in 365" 
          :key="day"
          :d="describeArc(50, 50, 42, (day-1) * 0.986, day * 0.986)"
          :class="day * 0.986 <= currentDegree ? 'cell-passed' : 'cell-future'"
        />

        <circle 
          cx="50" cy="50" r="42" 
          class="birth-line-fixed"
          :transform="`rotate(${birthSignature - 90} 50 50)`"
          stroke-dasharray="2, 360" 
        />

        <circle 
          cx="50" 
          :cy="50 - 42" 
          r="2.5" 
          class="current-dot-fixed"
          :transform="`rotate(${currentDegree} 50 50)`"
        />
      </svg>

      <div class="center-sun">
        <span class="degree-text">{{ currentDegree.toFixed(2) }}°</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import init, { HeliCore } from '../.././wasm/heli_engine.js';

const props = defineProps({
  birthSignature: { type: Number, default: 85.3 } // June 16th Signature
});

const currentDegree = ref(0);
const currentZenith = ref(0);
const isLoaded = ref(false);

const markerStyle = (deg) => ({
  transform: `rotate(${deg}deg) translateY(-140px)`
});

const seasonalLabel = computed(() => {
  const d = currentDegree.value;
  if (d < 90) return '↑ Vernal Ascent';
  if (d < 180) return '↓ Estival Peak';
  if (d < 270) return '↓ Autumnal Descent';
  return '↑ Hibernal Rest';
});

// WASM Helpers
const describeArc = (x, y, radius, start, end) => {
  const polarToCart = (r, deg) => ({
    x: x + r * Math.cos((deg - 90) * Math.PI / 180),
    y: y + r * Math.sin((deg - 90) * Math.PI / 180)
  });
  const s = polarToCart(radius, end);
  const e = polarToCart(radius, start);
  return `M ${s.x} ${s.y} A ${radius} ${radius} 0 0 0 ${e.x} ${e.y}`;
};

onMounted(async () => {
  await init();
  isLoaded.value = true;
  
  const tick = () => {
    const ts = BigInt(Date.now());
    currentDegree.value = HeliCore.get_orbital_degree(ts);
    // Lat/Lon for your local Zenith (example: 56.46, -2.97)
    currentZenith.value = HeliCore.get_zenith_angle(56.46, -2.97, ts);
    requestAnimationFrame(tick);
  };
  tick();
});
</script>

<style scoped>
.orbital-grid {
  position: relative; /* Anchor for anything absolute */
  width: 100%;
  max-width: 400px;
  aspect-ratio: 1 / 1;
  display: grid;
  place-items: center;
}

.heli-svg {
  width: 100%;
  height: 100%;
  overflow: visible; /* Ensures glow effects aren't clipped */
  filter: drop-shadow(0 0 10px rgba(0,0,0,0.05));
}

/* These are now SVG properties, not CSS box properties */
.cell-passed { stroke: #4facfe; stroke-width: 2; fill: none; }
.cell-future { stroke: #e1e8ed; stroke-width: 2; fill: none; }

.birth-line-fixed {
  stroke: #ffd700;
  stroke-width: 4;
  fill: none;
  stroke-linecap: round;
}

.current-dot-fixed {
  fill: #ffeb3b;
  filter: drop-shadow(0 0 4px gold);
}

.center-sun {
  position: absolute; /* Relative to orbital-grid center */
  text-align: center;
  pointer-events: none;
}
</style>