<template>
  <div class="swim-emulator bento-diary-node">
    <div class="emulator-header">
      <h3>🏊 Tiny Agent: Swimming Peer</h3>
      <div class="status-badge" :class="{ 'resonance': globalResonance }">
        {{ globalResonance ? 'RESONANCE ACTIVE' : 'SEARCHING FOR FLOW' }}
      </div>
    </div>
    <div class="emulator-layout">
      <StrokeToggle 
        :profiles="imProfiles" 
        :currentStroke="currentStrokeKey"
        @change-stroke="handleStrokeChange"
      />
      <HolisticWheel
        :cues="currentEntities"
        :solarAngle="timeAngle"  />
      <WheelLegend />
      <TuningControls 
        @update-tuning="handleTuningUpdate"  />
    </div>
    <div class="controls">
      <input 
        v-model="teachInput" 
        @keyup.enter="handleTeach"
        placeholder="@teach BeeBee..." 
        class="zero-draft-input"
      />
      <button @click="toggleSim">{{ running ? 'PAUSE' : 'START LAP' }}</button>
    </div>
    <GreatOrbitp />
    <BodyHardware @update-flesh="handleFleshUpdate" />
    <LaticMet :stats="currentLacticStats"/>
    <SwimWearable @tick="handleMockTick"></SwimWearable>
    <MicroCellular :cellStats="currentCellStats" />
    <SkinBarrierMonitor 
      :hydration="activeFleshData.hydration" 
      :duration="60" 
    />

    <div class="learning-log-mini">
      <p v-for="log in logs" :key="log.time">
        <small>[{{ log.time }}°]</small> {{ log.msg }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import HolisticWheel from './HolisticWheel.vue';
import WheelLegend from './WheelLegend.vue';
import { SwimECS } from './SwimECS.js';
import { swimSeed } from './SwimSeed.js';
import { imProfiles } from './SwimSeed.js';
import { LacticECS } from './LacticECS.js'
import { calculateCellularResonance } from './MitoResonance.js'
import TuningControls from './TuningControls.vue';
import StrokeToggle from './StrokeToggle.vue';
import GreatOrbitp from './OrbitTimeline.vue'
import BodyHardware from './WithingsSync.vue'
import LaticMet from './LacticCore.vue'
import SwimWearable from './SessionMockTrigger.vue'
import MicroCellular from './CellularMicroWheel.vue'
import SkinBarrierMonitor from './SkinBarrierMonitor.vue'

  const teachInput = ref('');
  const running = ref(false);
  const currentEntities = ref(swimSeed.initial_entities);
  const logs = ref([]);
  const timeAngle = ref(45); // Starting Solar Arc
  const handleTuningUpdate = ref(null)

  // 2. Instantiate the engine immediately
  const lacticEngine = new LacticECS();

  // const currentCellStats =  calculateCellularResonance()
  const currentCellStats = ref({ 
  mitochondrialFlux: 0, 
  atpProduction: 'Resting', 
  cellularStress: 'Low' 
});

  let ecs = new SwimECS(swimSeed);
  let timer = null;
  const currentStrokeKey = ref('freestyle');

  const handleStrokeChange = (key) => {
    currentStrokeKey.value = key;
    // Trigger BeeBee commentary
    logs.value.unshift({ 
      time: "NOW", 
      msg: `BeeBee: Shifting physics to ${imProfiles[key].name}. Watch the Ecological ring.` 
    });
  };

  // 1. Setup the reactive state
  const currentLacticStats = ref({ 
    level: 0.5, 
    isRedlining: false, 
    efficiencyLoss: 0 
  });



/* Inside SwimEmulator.vue <script setup> */

const activeFleshData = ref({ hydration: 55 }); // Default fallback

const handleFleshUpdate = (newData) => {
  activeFleshData.value = newData;
};

const handleMockTick = (dataPoint) => {
  // 1. Update Lactic
  currentLacticStats.value = lacticEngine.update(
    dataPoint.intensity, 
    currentStrokeKey.value
  );

  // 2. Update Cellular using the NEW caught data
  // Now it's mapped correctly to activeFleshData.value.hydration
  currentCellStats.value = calculateCellularResonance(
    currentLacticStats.value.level, 
    activeFleshData.value.hydration 
  );
};











  // Update the wheel's "Target Zones" based on the stroke
  const currentTargets = computed(() => imProfiles[currentStrokeKey.value].orbit_targets);

  /* computed */
  const globalResonance = computed(() => {
    return currentEntities.value.every(e => e.inResonance);
  });

  const toggleSim = () => {
    running.value = !running.value;
    if (running.value) {
      timer = setInterval(() => {
        currentEntities.value = ecs.update();
        timeAngle.value = (timeAngle.value + 0.1) % 360;
      }, 100);
    } else {
      clearInterval(timer);
    }
  };

  const handleTeach = () => {
    const input = teachInput.value.toLowerCase();
    
    // Logic: "I'm tired" -> Shrink the Goldilocks Zone (Higher sensitivity)
    if (input.includes('tired') || input.includes('fatigue')) {
      swimSeed.goldilocks_zones.hrv.min += 5; 
      logs.value.unshift({ time: Math.round(timeAngle.value), msg: "BeeBee: Adjusting sensitivity for fatigue recovery." });
    }

    // Logic: "Perfect" -> Lock the current Arc as the "Ideal Genome"
    if (input.includes('perfect') || input.includes('flow')) {
      logs.value.unshift({ time: Math.round(timeAngle.value), msg: "BeeBee: Success Vector captured. Updating Genome..." });
      triggerResonanceFlash();
    }

    teachInput.value = '';
  };
</script>

<style scoped>
.swim-emulator {
  width: 80vw;
  background: #0a0a0a;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #333;
  color: white;
}

.emulator-layout {
  display: grid;
  grid-template-columns: 1fr 6fr 1fr 1fr;
}
.zero-draft-input {
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #444;
  color: #00f2ff;
  padding: 10px;
  margin-top: 20px;
  font-family: 'Courier New', Courier, monospace;
}
.resonance {
  color: #4dff88;
  text-shadow: 0 0 10px #4dff88;
}
.learning-log-mini {
  margin-top: 15px;
  height: 80px;
  overflow-y: auto;
  font-size: 0.8rem;
  opacity: 0.7;
}
</style>