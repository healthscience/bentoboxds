<template>
  <div class="heli-container">
    <div class="orbital-grid">
      <svg viewBox="0 0 100 100" class="layer progress-ring-svg">
        <path 
          v-for="day in 365" 
          :key="day"
          :d="describeArc(50, 50, 42, (day-1) * 0.986, day * 0.986)"
          :class="{
            'cell-passed': (day * 0.986) <= currentDegree,
            'cell-future': (day * 0.986) > currentDegree
          }"
        />
        <path 
          :d="describeArc(50, 50, 42, birthSignature - 1, birthSignature + 1)"
          class="cell-birth"
        />
      </svg>

      <div class="layer markers-container">
        <div class="marker birth-signature" :style="markerStyle(birthSignature)"></div>
        <div class="marker current-position" :style="markerStyle(currentDegree)"></div>
      </div>
      
      <div class="center-sun">
        <span class="degree-text">{{ currentDegree.toFixed(2) }}°</span>
        <span class="label">HELI</span>
      </div>
    </div>

    <div class="solar-stats">
      <h3>Solar Signature: {{ birthSignature }}°</h3>
      <p>Zenith: {{ currentZenith.toFixed(2) }}°</p>
      <p class="status">{{ seasonalLabel }}</p>
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
/* Simplified BentoBox Grid logic */
.heli-container {
  display: grid;
  justify-items: center;
  gap: 20px;
  background: #fdfdfd;
  padding: 30px;
  border-radius: 24px;
}
.orbital-grid {
  display: grid;
  grid-template-areas: "content";
  place-items: center;
  width: 320px;
  height: 320px;
}
.layer { grid-area: content; width: 100%; height: 100%; }
.cell-passed { stroke: #4facfe; stroke-opacity: 0.6; fill: none; stroke-width: 4; }
.cell-future { stroke: #e1e8ed; fill: none; stroke-width: 4; }
.cell-birth { stroke: #ffd700; fill: none; stroke-width: 8; stroke-linecap: round; }
.marker { position: absolute; width: 12px; height: 12px; border-radius: 50%; top: 50%; left: 50%; margin: -6px; }
.current-position { background: #ffeb3b; box-shadow: 0 0 15px gold; }
.birth-signature { border: 2px solid #ffd700; background: white; }
.center-sun { grid-area: content; z-index: 3; text-align: center; }
</style>