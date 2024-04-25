<template>
  <div id="visualise-nxp-build">
    <header>VISUALISE DASHBOARD BUILDER:</header>
    <div id="prime-visualise-build">
      <header>Type of visualisation:</header>
      <div class="visualise-medium-item">
        Network Library Reference Contract:<input v-model="visualRefCont" placeholder="Reference Contract">
        <button type="button" class="btn" @click="refContractLookup()">Lookup</button>
      </div>
      <div  v-if="refContractVisualise">
        <div class="vis-refcontract" v-for="visc of refContractVisualise">
          <div class="vis-key">{{ visc.key }}</div>
          <div class="vis-key">{{ visc.value.computational.name }}</div>
          <div class="vis-key">{{ visc.value.computational.description }}</div>
          <div class="vis-key"> --- </div>
        </div>
      </div>
    </div>
    <!--<chart-builder v-if="type === 'chart.js'" :shellID="shellID" :moduleCNRL="moduleCNRL" :moduleType="moduleType" :mData="mData"></chart-builder>-->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { libraryStore } from '@/stores/libraryStore.js'


  const storeLibrary = libraryStore()

  let visualRefCont = ref('')
  /* computed */
  const refContractVisualise = computed (() => {
    return storeLibrary.newnxp.visualiseLive
  })

</script>

<style scoped>

@media (min-width: 1024px) {
  #k-toolkit {
    border: 0px solid red;
  }

  .vis-refcontract {
    border: 1px solid white;
    margin: 1em;
  }
}
</style>
