<template>
  <div class="swim-emulator bento-diary-node">
    <div class="emulator-header">
      <h3>🏊 Tiny Agent: Swimming Peer</h3>
      <div class="status-badge" :class="{ 'resonance': globalResonance }">
        {{ globalResonance ? 'RESONANCE ACTIVE' : 'SEARCHING FOR FLOW' }}
      </div>
    </div>

    <HolisticWheel 
      :cues="currentEntities" 
      :solarAngle="timeAngle" 
    />

    <div class="controls">
      <input 
        v-model="teachInput" 
        @keyup.enter="handleTeach"
        placeholder="@teach BeeBee..." 
        class="zero-draft-input"
      />
      <button @click="toggleSim">{{ running ? 'PAUSE' : 'START LAP' }}</button>
    </div>

    <div class="learning-log-mini">
      <p v-for="log in logs" :key="log.time">
        <small>[{{ log.time }}°]</small> {{ log.msg }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import HolisticWheel from './HolisticWheel.vue'; // Adjust path
import { SwimECS } from './SwimECS.js';
import { swimSeed } from './SwimSeed.js';

const teachInput = ref('');
const running = ref(false);
const currentEntities = ref(swimSeed.initial_entities);
const logs = ref([]);
const timeAngle = ref(45); // Starting Solar Arc

let ecs = new SwimECS(swimSeed);
let timer = null;

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
  logs.value.unshift({ 
    time: Math.round(timeAngle.value), 
    msg: `Peer Input: ${teachInput.value}` 
  });
  
  // Example @teach logic: "Lower drag"
  if (teachInput.value.includes('lower drag')) {
    const drag = currentEntities.value.find(e => e.type === 'drag');
    if (drag) drag.value -= 0.1;
  }
  teachInput.value = '';
};
</script>

<style scoped>
.swim-emulator {
  background: #0a0a0a;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #333;
  color: white;
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