<template>
  <div id="launchpad-experience">
    
    <div v-if="mode === 'zen'" class="launchpad-stack">
      <div class="avatar-zone">
        <BeeBeeAvatar />
      </div>
      
      <div class="input-zone">
        <div class="input-constraint">
          <inputBox />
        </div>
      </div>

      <div class="demo-zone">
        <button class="sov-demo-btn" @click="$emit('launch', 'sport')">
          🏊 Experience 400IM
        </button>
        <button class="sov-demo-btn" @click="$emit('launch', 'earth')">
          Water
        </button>
        <button class="sov-demo-btn" @click="$emit('launch', 'earth')">
          Earth
        </button>
      </div>
    </div>

    <div v-else class="active-resonance-grid">
      <header class="resonance-header">
        <h2 v-if="mode === 'demo'">Demo Protocol</h2>
        <h2 v-else>Intent Extraction</h2>
      </header>

      <BesearchLens :lenses="extractedData" />

      <div class="meta-actions-grid">
        <template v-if="mode === 'extracting'">
          <button class="sov-btn reset" @click="$emit('reset')">
            ⟲ Reset Prompt
          </button>
          <div class="manifest-nudge">
            Check BeeBee to Manifest ⮕
          </div>
        </template>

        <template v-else-if="mode === 'demo'">
          <button class="sov-btn exit" @click="$emit('reset')">
            Exit Demo
          </button>
          <button class="sov-btn clone" @click="cloneExperience">
            📁 Clone & Personalize
          </button>
        </template>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue';
import BesearchLens from '@/components/orbit/BesearchLens.vue';
import BeeBeeAvatar from '@/components/agents/BeeBeeAvatar.vue';
import inputBox from '@/components/beebeehelp/inputBox.vue';

// PROPS: Controlled by PrimeInterface
const props = defineProps({
  mode: {
    type: String,
    default: 'zen' // 'zen', 'extracting', 'demo'
  },
  extractedData: {
    type: Object,
    default: () => ({ capacity: [], coherence: [], context: [] })
  }
});

// EMITS: Signal back to PrimeInterface
defineEmits(['launch', 'reset']);

const cloneExperience = () => {
  alert("Protocol Cloned to your Library!");
};
</script>

<style scoped>
#launchpad-experience {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

/* ZEN LAYOUT */
.launchpad-stack {
  display: grid;
  grid-template-rows: auto auto auto;
  gap: 2rem;
  justify-items: center;
  text-align: center;
}

/* RESONANCE LAYOUT (The 3 Cs View) */
.active-resonance-grid {
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 2rem;
  width: 90%;
  max-width: 1000px;
  height: auto;
}

.resonance-header h2 {
  font-size: 1.5rem;
  color: #38205f;
  letter-spacing: -0.02em;
}

/* BUTTON GRIDS */
.demo-zone {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.meta-actions-grid {
  display: grid;
  grid-template-columns: auto auto;
  gap: 40px;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 100px;
}

/* BUTTON STYLES */
.sov-demo-btn {
  padding: 12px 20px;
  background: white;
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.sov-demo-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.sov-btn {
  padding: 10px 24px;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  border: none;
}

.sov-btn.exit, .sov-btn.reset {
  background: white;
  border: 1px solid #ef4444;
  color: #ef4444;
}

.sov-btn.clone {
  background: #38205f;
  color: white;
}

.manifest-nudge {
  font-weight: 800;
  color: #38205f;
  animation: nudge-x 2s infinite ease-in-out;
}

@keyframes nudge-x {
  0%, 100% { transform: translateX(0); opacity: 0.7; }
  50% { transform: translateX(10px); opacity: 1; }
}
</style>