<template>
  <div class="tinker-layer-container">
    <div class="lens-box coherence standalone-layer">
      <header class="lens-header standalone-header">
        <div class="header-main">
          <div class="header-left">
            <span class="pulse-dot"></span>
            <h3>Tinkering: Optimization</h3>
          </div>
        </div>
      </header>
      <div class="tinker-content">
        <div class="tinker-controls">
           <div class="control-group">
             <span class="control-label">Logic Neat-Evolution</span>
             <button class="tinker-btn">Run Optimization Loop</button>
           </div>
           <div class="control-group">
             <span class="control-label">Scientific Validation</span>
             <button class="tinker-btn secondary">Find Better Science</button>
           </div>
        </div>
        <div class="tinker-status">
          <div class="status-item">
            <span class="label">System Stability</span>
            <span class="value">98.4%</span>
          </div>
          <div class="status-item">
            <span class="label">Evolutionary Iterations</span>
            <span class="value">42</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { besearchStore } from "@/stores/besearchStore.js";
const storeBesearch = besearchStore();
</script>

<style scoped>
.tinker-layer-container {
  width: 100%;
  margin-top: 10px;
}

.standalone-layer {
  padding: 20px 30px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-top: 4px solid #ffcc00;
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  color: #1a202c;
}

.lens-header h3 {
  color: #ffcc00 !important;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.tinker-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.tinker-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #718096;
}

.tinker-btn {
  background: #1a202c;
  color: #ffcc00;
  border: 1px solid #ffcc00;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tinker-btn:hover {
  background: #ffcc00;
  color: #1a202c;
}

.tinker-btn.secondary {
  color: #00ffcc;
  border-color: #00ffcc;
}

.tinker-btn.secondary:hover {
  background: #00ffcc;
  color: #1a202c;
}

.tinker-status {
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

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #ffcc00;
  border-radius: 50%;
  box-shadow: 0 0 10px #ffcc00;
}
</style>
