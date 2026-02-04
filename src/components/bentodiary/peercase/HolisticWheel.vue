<template>
  <div class="holistic-wheel-container">
    <svg :viewBox="`-50 -50 100 100`" class="holistic-svg">
      <defs>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="rgba(0, 242, 255, 0.15)" />
          <stop offset="100%" stop-color="rgba(0, 0, 0, 0)" />
        </radialGradient>
        
        <filter id="neonBlur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle r="45" fill="url(#centerGlow)" />

      <circle class="orbit-ring" r="36" stroke-dasharray="0.5 2" />
      <circle class="orbit-ring" r="24" stroke-dasharray="0.5 2" />
      <circle class="orbit-ring" r="12" stroke-dasharray="0.5 2" />
    </svg>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

// props for external data injection
const props = defineProps({
  cues: { type: Array, default: () => [] },
  solarAngle: { type: Number, default: 0 }
});

// Calculate the Solar Hand position (Heli-Clock)
const solarHand = computed(() => {
  const rad = (props.solarAngle - 90) * (Math.PI / 180);
  return {
    x: 40 * Math.cos(rad),
    y: 40 * Math.sin(rad)
  };
});

// Mapping cues to their respective Orbit Radius
const activeCues = computed(() => {
  return props.cues.map(cue => {
    const radius = cue.orbit === 'metabolic' ? 12 : cue.orbit === 'ecological' ? 24 : 36;
    const rad = (cue.angle - 90) * (Math.PI / 180);
    return {
      ...cue,
      x: radius * Math.cos(rad),
      y: radius * Math.sin(rad)
    };
  });
});
</script>

<style scoped>
@import "./css/flake.css";
/* Leveraging your existing flake style logic */
.orbit-ring {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 0.5;
}

.solar-hand {
  stroke: var(--primary-glow, #00f2ff);
  stroke-width: 0.2;
  stroke-dasharray: 2, 2;
}

.cue-point.metabolic { fill: #ff4d4d; filter: drop-shadow(0 0 2px #ff4d4d); }
.cue-point.ecological { fill: #4dff88; filter: drop-shadow(0 0 2px #4dff88); }
.cue-point.economic   { fill: #4da6ff; filter: drop-shadow(0 0 2px #4da6ff); }

.pulse {
  animation: cue-glow 2s infinite;
}

@keyframes cue-glow {
  0% { opacity: 1; r: 1.5; }
  50% { opacity: 0.5; r: 2.5; }
  100% { opacity: 1; r: 1.5; }
}
</style>