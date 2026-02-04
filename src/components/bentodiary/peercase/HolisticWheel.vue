<template>
  <div class="holistic-wheel-container">
    <svg :viewBox="`-50 -50 100 100`" class="holistic-svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <circle class="orbit-ring economic-ring" r="36" />
      <circle class="orbit-ring ecological-ring" r="24" />
      <circle class="orbit-ring metabolic-ring" r="12" />

      <line 
        v-if="hasResonance"
        x1="0" y1="0" 
        :x2="resonanceLine.x" :y2="resonanceLine.y"
        class="resonance-spoke"
      />

      <circle 
        v-for="cue in activeCues" 
        :key="cue.id"
        :class="['cue-point', cue.orbit, { 'pulse': cue.active }]" 
        :cx="cue.x" 
        :cy="cue.y" 
        r="2"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';

  const props = defineProps({
    cues: { type: Array, default: () => [] },
    solarAngle: { type: Number, default: 0 }
  });

  // 1. Coordinate Math (The existing logic you have)
  const activeCues = computed(() => {
    return props.cues.map(cue => {
      const radiusMap = { metabolic: 12, ecological: 24, economic: 36 };
      const r = radiusMap[cue.orbit] || 10;
      const rad = (cue.angle - 90) * (Math.PI / 180);
      return {
        ...cue,
        x: r * Math.cos(rad),
        y: r * Math.sin(rad)
      };
    });
  });

  // 2. NEW: Resonance Detection Logic
  // Checks if at least 2 dots from different orbits are within 5 degrees of each other
  const hasResonance = computed(() => {
    if (props.cues.length < 2) return false;
    
    // Simple check: are there dots close to each other?
    const angles = props.cues.map(c => c.angle);
    const minAngle = Math.min(...angles);
    const maxAngle = Math.max(...angles);
    
    // If the spread between all dots is less than 10 degrees, trigger resonance
    return (maxAngle - minAngle) < 10;
  });

  // 3. NEW: Resonance Line Calculation
  // This draws the "Spoke" toward the average angle of the resonant cluster
  const resonanceLine = computed(() => {
    if (!hasResonance.value) return { x: 0, y: 0 };
    
    const avgAngle = props.cues.reduce((acc, c) => acc + c.angle, 0) / props.cues.length;
    const rad = (avgAngle - -90) * (Math.PI / 180); // Using outer ring radius (36)
    
    return {
      x: 36 * Math.cos(rad),
      y: 36 * Math.sin(rad)
    };
  });

  // Calculate the Solar Hand position (Heli-Clock)
  const solarHand = computed(() => {
    const rad = (props.solarAngle - 90) * (Math.PI / 180);
    return {
      x: 40 * Math.cos(rad),
      y: 40 * Math.sin(rad)
    };
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

  /* Individual Ring Colors */
  .metabolic-ring  { stroke: rgba(255, 77, 77, 0.2); stroke-dasharray: 1 2; }
  .ecological-ring { stroke: rgba(64, 224, 255, 0.2); stroke-dasharray: 2 2; }
  .economic-ring   { stroke: rgba(182, 255, 59, 0.2); stroke-dasharray: 3 3; }

  .orbit-ring {
    fill: none;
    stroke-width: 0.4;
  }

  /* The Resonance Spoke: The "Aha!" moment */
  .resonance-spoke {
    stroke: white;
    stroke-width: 0.2;
    stroke-dasharray: 1 1;
    filter: url(#glow);
    opacity: 0.6;
  }

  /* Ensure dots are vibrant */
  .metabolic { fill: #ff4d4d; filter: drop-shadow(0 0 4px #ff4d4d); }
  .ecological { fill: #40e0ff; filter: drop-shadow(0 0 4px #40e0ff); }
  .economic   { fill: #b6ff3b; filter: drop-shadow(0 0 4px #b6ff3b); }
</style>