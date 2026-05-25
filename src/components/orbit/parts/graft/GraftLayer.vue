<template>
  <div v-if="storeBesearch.isGraftLayerOpen" class="graft-layer-container">
    <div class="lens-box coherence standalone-graft">
      <header class="lens-header standalone-header">
        <div class="header-main">
          <div class="header-left">
            <span class="pulse-dot"></span>
            <h3>Graft</h3>
          </div>
        </div>
      </header>
      <div class="graft-content">
        <div class="graft-left">
           <button class="lab-btn" @click="goToSculptingLab">
             Go to Sculpting lab ➔
           </button>
        </div>
        <div class="graft-right summary-section">
          <div class="status-item">
            <span class="label">Work in progress</span>
            <span class="value">0</span>
          </div>
          <div class="status-item">
            <span class="label">Finished</span>
            <span class="value">0</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { besearchStore } from "@/stores/besearchStore.js";
const storeBesearch = besearchStore();

const goToSculptingLab = () => {
  storeBesearch.setHUUDState('besearch');
};
</script>

<style scoped>
.graft-layer-container {
  width: 100%;
  margin-top: 10px;
}

.standalone-graft {
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #00d4ff;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: #1a202c;
  position: relative;
  z-index: 1;
}

.lens-header h3 {
  color: #00d4ff !important;
}

.lens-header {
  margin-bottom: 20px;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #00d4ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00d4ff;
}

.graft-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.lab-btn {
  background: #1a202c;
  color: #00ffcc;
  border: 1px solid #00ffcc;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.lab-btn:hover {
  background: #00ffcc;
  color: #1a202c;
}

.summary-section {
  display: flex;
  gap: 40px;
}

.status-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-item .label {
  font-size: 0.65rem;
  font-weight: 900;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-item .value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  font-family: "Space Mono", monospace;
}
</style>
