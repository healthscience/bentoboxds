<template>
  <div class="orbit-stage">
    <div class="clock-buffer">
      <HeliClock :mini="true" />
    </div>
    <transition name="sov-fade">
      <div v-if="isInitialState" class="launchpad-stack">
        <div class="avatar-cell"><BeeBeeAvatar /></div>
        <div class="text-cell"><p>What resonance shall we track today?</p></div>
        <div class="input-cell"><inputBox @submit="handleInitialIntent" /></div>
        <div class="demo-cell">
          <button class="sov-demo-btn" @click="launchDemo">🏊 Experience 400IM</button>
        </div>
      </div>
      <div v-else class="besearch-stack">
        <BesearchLens :lenses="extractedData.extract" />
        <div class="beebee-dialogue">
          <p class="beebee-text">{{ beebeeMessage.message }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import HeliClock from '@/components/orbit/clock/HeliClock.vue';
import BesearchLens from '@/components/orbit/BesearchLens.vue';
import BeeBeeAvatar from '@/components/agents/BeeBeeAvatar.vue';
import { aiInterfaceStore } from '@/stores/aiInterface.js'

const storeAI = aiInterfaceStore();

let isProcessing = ref(false);

// TOOLBARS & INPUTS
// Assuming inputBox is in your orbit or common folder - update path if needed:
import inputBox from '@/components/beebeehelp/inputBox.vue';

const isInitialState = ref(true);

  /* computed */
  const extractedData = computed(() => {
    return storeAI.digestInput
  })

  const beebeeMessage = computed(() => {
    return storeAI.digestInput
  })


/* methods */
const handleInitialIntent = async (text) => {
  isInitialState.value = false;
  isProcessing.value = true;
  await storeAI.beebeeDigest(text);
  isProcessing.value = false;
};

const launchDemo = () => {
  const demoText = "I want to swim 400m in 10 orbits, but my skin gets dry and itchy with the chlorine.";
  // We simulate typing or just pass it directly
  handleInitialIntent(demoText);
};

</script>

<style scoped>
.orbit-stage {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  height: 90vh;
  width: 100vw;
  background: var(--sov-bg);
}

/* 1. The Constant Clock (Top Right) */
.clock-buffer {
  grid-column: 11 / 13;
  grid-row: 1 / 3;
  display: grid;
  place-items: center;
  padding: 1.5rem;
  z-index: 100;
}

/* 2. The Launchpad Stack (Centered Rows) */
.launchpad-stack {
  grid-column: 4 / 10;
  grid-row: 3 / 10;
  display: grid;
  grid-template-rows: subgrid; /* Aligns to the parent 12-row grid */
  align-items: center;
}

.avatar-cell { grid-row: 2; display: grid; place-items: center; }
.text-cell   { grid-row: 3; text-align: center; font-weight: 300; }
.input-cell  { grid-row: 4; display: grid; place-items: center; }
.demo-cell   { grid-row: 6; display: grid; place-items: center; }

/* 3. The Besearch Stack */
.besearch-stack {
  grid-column: 2 / 12;
  grid-row: 3 / 11;
  display: grid;
  gap: 2rem;
}

/* 4. Nexus Toolbar */
.nexus-zone {
  grid-column: 11 / 13;
  grid-row: 11 / 13;
  display: grid;
  place-items: center;
}

/* Transitions */
.sov-fade-enter-active, .sov-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.sov-fade-enter-from, .sov-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>