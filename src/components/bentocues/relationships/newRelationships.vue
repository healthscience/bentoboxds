<template>
  <div id="cue-relationships" class="pie">
    Cues to Cues   Cues to biomarkers  biomarkers to treatment, product etc etc.
  </div>
</template>

<script setup>
import hashObject from 'object-hash'
import { ref, computed } from 'vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { cuesStore } from '@/stores/cuesStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  const storeCues = cuesStore()


  /*  computed  */
  const referenceDataTypes = computed(() => {
    return storeLibrary.publicLibrary.referenceContracts['datatype']
  })

  /* methods */
  const newDatatypeadd = () => {
    newDatatype.value = true
  }

</script>

<style scoped>

#cue-relationships {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {


}
</style>
