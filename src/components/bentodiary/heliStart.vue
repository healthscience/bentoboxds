<template>
  <div class="heli-calibration-grid">
    <div v-if="!isCalibrated" class="calibration-form">
      <h3>Heli Calibration</h3>
      <p>Enter your arrival coordinates in the solar orbit.</p>
      
      <div class="input-group">
        <label>Birth Date</label>
        <input type="date" v-model="birthDate" @input="runWasmCalibration" />
      </div>

      <div class="input-group">
        <label>Time (UTC preferred)</label>
        <input type="time" v-model="birthTime" @input="runWasmCalibration" />
      </div>

      <div v-if="tempSignature" class="preview-box">
        <span class="sig-label">Detected Signature:</span>
        <span class="sig-value">{{ tempSignature.toFixed(4) }}°</span>
      </div>

      <button :disabled="!tempSignature" @click="saveAndLock">
        Lock Heli-Signature
      </button>
    </div>

    <HeliClock v-else :birthSignature="storedSignature" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import init, { HeliCore } from '../.././wasm/heli_engine.js';
import HeliClock from './heliClock.vue'; // The UI component from the previous step

const isCalibrated = ref(false);
const birthDate = ref('');
const birthTime = ref('12:00');
const tempSignature = ref(null);
const storedSignature = ref(0);

onMounted(async () => {
  await init();
  // Check if peer is already calibrated in this browser
  const saved = localStorage.getItem('heli_sig');
  if (saved) {
    storedSignature.value = parseFloat(saved);
    isCalibrated.value = true;
  }
});

const runWasmCalibration = () => {
  if (!birthDate.value) return;
  
  // Construct the timestamp for the Rust engine
  const ts = BigInt(new Date(`${birthDate.value}T${birthTime.value}:00Z`).getTime());
  
  // Option A Math: June 16 -> ~85°
  tempSignature.value = HeliCore.get_orbital_degree(ts);
};

const saveAndLock = () => {
  storedSignature.value = tempSignature.value;
  localStorage.setItem('heli_sig', storedSignature.value.toString());
  isCalibrated.value = true;
};
</script>

<style scoped>
.heli-calibration-grid {
  display: grid;
  place-items: center;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
}

.calibration-form {
  display: grid;
  gap: 1.5rem;
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.05);
  border: 1px solid #e1e8ed;
  max-width: 400px;
}

.input-group {
  display: grid;
  gap: 0.5rem;
  text-align: left;
}

input {
  padding: 0.8rem;
  border: 2px solid #f0f4f8;
  border-radius: 12px;
  background: #f8fafc;
}

.preview-box {
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #bae6fd;
}

.sig-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #0369a1;
}

button {
  background: #4facfe;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
}
</style>