<template>
  <div class="world-stage">
    <transition name="world-fade" mode="out-in">
      <div v-if="storeAccount.currentPhase === 'learn'" class="stage-layer">
        <HeliClock :mini="false">
          <template #projections>
            </template>
        </HeliClock>
      </div>

      <div v-else-if="storeAccount.currentPhase === 'flow'" class="stage-layer">
        <div class="placeholder-flow">400IM EMULATION ACTIVE</div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { accountStore } from '@/stores/accountStore.js';
import HeliClock from '@/components/orbit/clock/HeliClock.vue';

const storeAccount = accountStore();
</script>

<style scoped>
.world-stage, .stage-layer {
  width: 100%;
  height: 100%;
  display: grid;
  justify-content: center;
  align-items: center;
}
</style>