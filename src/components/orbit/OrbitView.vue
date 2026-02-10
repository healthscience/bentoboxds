<template>
  <div class="orbit-view" :class="{ 'is-electron': isElectron }">
    <main class="orbit-container">
      <section class="stage-area">
        <div class="geometry-stack">
          <div class="layer resonance">
            <resonance-wheel :mode="resonanceActivity" />
          </div>
          <div class="layer clock">
            <heli-clock :show-seconds="isElectron" /> 
          </div>
          <div class="layer beebee">
            <beebee-avatar :state="beebeeState" :platform="platform" />
          </div>
        </div>
      </section>

      <aside class="stream-area">chat
        <!-- Narrative Peek Component <narrative-peek /> -->
      </aside>
    </main>
  </div>
  <bento-heliclock>clock</bento-heliclock>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { accountStore } from '@/stores/accountStore'
import ResonanceWheel from '@/components/orbit/resonance/ResonancePulse.vue';
import HeliClock from '@/components/orbit/clock/heliClock.vue';
import BeebeeAvatar from '@/components/beebeehelp/inputBox.vue';
// import NarrativePeek from '@components/orbit/narrative/NarrativePeek.vue';
import BentoHeliclock from '@/components/bentodiary/diaryTemplate.vue'

  const storeAccount = accountStore()

  // 1. Environment Detection
  const isElectron = ref(false);
  const platform = ref('web');

  onMounted(() => {
    // Check if we are in Electron
    isElectron.value = !!(window && window.process && window.process.type);
    platform.value = isElectron.value ? 'Sovereign Desktop' : 'Web Browser';
    
    console.log(`🚀 Orbit initialized on ${platform.value}`);
  });

  /* computed */
  // 2. BeeBee State (Tied to WASM & Identity)
  const beebeeState = computed(() => {
    if (accountStore.isInitializing) return 'thinking'; // Spinner/WASM loading
    if (accountStore.hasIdentity) return 'awake';      // Key found in localStorage
    return 'dormant';                                  // Waiting for handshake
  });

  // 3. Connectivity (For the Resonance Wheel)
  const resonanceActivity = computed(() => {
    // If we're in Electron, we might have more direct P2P stats
    return accountStore.peerCount > 0 ? 'active' : 'idle';
  });

  const bentoHeliClockLive = computed(() => {
    return storeAI.bentodiaryState
  })

</script>

<style scoped>
/* 1. MOBILE FIRST (Default) */
.orbit-view {
  display: grid;
  grid-template-rows: auto 1fr auto; /* Tools | Stage | Stream */
  height: 100dvh; /* Dynamic viewport height for mobile browsers */
  background: var(--bg-deep);
}

.orbit-container {
  display: grid;
  grid-template-rows: 1fr 1.5fr; /* Stage takes top, Stream takes bottom */
  overflow: hidden;
  border: 1px solid blue;
}

/* The "Stacking" logic using Grid */
.geometry-stack {
  display: grid;
  place-items: center;
  width: 90vmin; /* Perfect circle based on smallest dimension */
  height: 90vmin;
}

.layer {
  grid-area: 1 / 1; /* All layers occupy the same cell */
}

.beebee { z-index: 10; transform: scale(0.8); }
.clock { z-index: 5;   border: 1px solid purple;}
.resonance { z-index: 1; opacity: 0.4;   border: 1px solid green;}

/* Subtle polish for the Electron App */
.is-electron {
  border-top: 1px solid rgba(255, 255, 255, 0.1); /* "Window" feel */
}

/* Add a dragging area for Electron header if needed */
.orbit-header {
  -webkit-app-region: drag;
}

/* 2. DESKTOP (1024px and up) */
@media (min-width: 1024px) {
  .orbit-container {
    grid-template-rows: 1fr;
    grid-template-columns: 1.5fr 1fr; /* Stage Left | Stream Right */
  }

  .geometry-stack {
    width: 75vmin; /* Slightly smaller to allow for side-panel breathing room */
    height: 75vmin;
  }

  .beebee {
    transform: scale(1);
    border: 1px solid pink; 
  }
  /* Larger Presence on Desktop */
}
</style>