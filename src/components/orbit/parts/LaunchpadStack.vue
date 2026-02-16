<template>
  <div id="launchpad-experience">
    <div v-if="isInitialState === true" class="launchpad-stack">
      <div class="avatar-zone"><BeeBeeAvatar /></div>
      <div class="input-zone">
        <div class="input-constraint"><inputBox/></div>
      </div>
      <div class="demo-zone">
        <button class="sov-demo-btn" @click="launchDemo('sport')">🏊 Experience 400IM</button>
        <button class="sov-demo-btn" @click="launchDemo('water')">Water</button>
        <button class="sov-demo-btn" @click="launchDemo('earth')">Earth</button>
      </div>
    </div>
    <div v-else class="active-resonance">
      <BesearchLens :lenses="extractedData" />
      <div class="meta-actions-zone">
        <button class="sov-btn exit" @click="exitDemo">Exit Demo</button>
        <button class="sov-btn clone" @click="cloneExperience">📁 Clone & Personalize</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BesearchLens from '@/components/orbit/BesearchLens.vue';
import BeeBeeAvatar from '@/components/agents/BeeBeeAvatar.vue';
import inputBox from '@/components/beebeehelp/inputBox.vue';

import { aiInterfaceStore } from '@/stores/aiInterface.js'

const storeAI = aiInterfaceStore();

const showBesearchDrawer = ref(true);
const isInitialState = computed(() => {
  return storeAI.isInitialState
});
const extractedData = computed(() => storeAI.digestInput);

/* methods */
const launchDemo = (demoType) => {
  console.log(`Launching ${demoType} demo`);
  if (demoType === 'sport') {
    storeAI.beebeeDigest("I want to swim 400m in 10 orbits, but chlorine makes my skin itchy.", true);
  }
};

const exitDemo = () => {
  storeAI.isInitialState = true;
  showBesearchDrawer.value = false;
};

const cloneExperience = () => {
  alert("Protocol Cloned!");
};

</script>

<style scoped>

.launchpad-stack {
  display: grid;
  grid-template-rows: repeat(12, 1fr);
  height: 100%;
  width: 100%;
}

</style>