<template>
  <div class="orbit-stage" :class="{ 'immersive-mode': isEmulationActive }">
    <div :class="['heli-container', isInitialState ? 'mini-anchor' : 'center-anchor']">
      <HeliClock :mini="isInitialState" />
    </div>
    <div class="sovereign-launchpad" v-if="isInitialState">
      <button class="demo-trigger" @click="launchDemo">
        <span class="icon">🏊</span> Experience the 400IM Demo
      </button>
    </div>
    <WorldSwitcher v-else />
    <bbNexus v-if="storeAccount.handshakeComplete" class="nexus-position" />
    <BeeBeeAvatar @goal-set="handleGoalSet" class="beebee-position" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { accountStore } from '@/stores/accountStore.js'

import WorldSwitcher from '@/components/orbit/WorldSwitcher.vue';
import bbNexus from '@/components/nexus/bbNexusToolbar.vue';
import BeeBeeAvatar from '@/components/agents/BeeBeeAvatar.vue';
import HeliClock from '@/components/orbit/clock/HeliClock.vue'; // Imported here for persistence

const storeAccount = accountStore();
const isInitialState = ref(true); 
const isEmulationActive = computed(() => storeAccount.currentPhase === 'flow');

const handleGoalSet = () => {
  isInitialState.value = false;
};

const launchDemo = () => {
  isInitialState.value = false;
  storeAccount.currentPhase = 'flow';
};
</script>

<style scoped>
  /* The Magic Layout Switcher */
  .heli-anchor {
    position: absolute;
    top: 2rem;
    right: 2rem;
    width: 150px; /* Mini size */
    height: 150px;
    transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 20;
  }

  .heli-anchor.full-stage {
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
    width: 90vmin;
    height: 90vmin;
  }

  .nexus-position {
    position: absolute;
    bottom: 2rem;
    right: 2rem;
  }

  .orbit-stage {
    display: flex; /* Changed from grid for simpler centering */
    justify-content: center;
    align-items: center;
    width: 100%;
    height: calc(100vh - 120px);
    position: relative;
    background: #000; /* Force dark background for visibility */
  }

  .heli-container {
    position: absolute;
    transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
    /* Remove overflow: hidden if it was clipping */
    z-index: 100; 
  }

  .mini-anchor {
    top: 40px; /* Lowered slightly to ensure it's below any headers */
    right: 40px;
    width: 100px; /* Slightly larger for easier spotting */
    height: 100px;
  }

  .center-anchor {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80vmin;
    height: 80vmin;
  }

  .sovereign-launchpad {
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

</style>




