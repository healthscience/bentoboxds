<template>
  <div v-if="pathListlive === true" id="story-list">
    <header>List of saved stories</header>
    <div v-for="storyi of livePathlist" :key="storyi.id" :value="storyi">
      <div class="story-list-live">
        {{ storyi }}
        <button @click.prevent="viewPath(storyi)" class="button is-primary">view</button>
       </div>
    </div>
  </div>
  <div id="bentopath-cues" v-if="pathCues === true">
    cues experience
    <div class="stage-comptypes" v-for="ctype in stagesLive.stages">pp {{ ctype }}
      <pie-chartcues v-if="ctype.stagetype.id === 5" :chartData="cuesHolistic"></pie-chartcues>
      <beebee-ai v-if="ctype.stagetypetwo.id === 4"></beebee-ai>
    </div>
  </div>
</template>

<script setup>
import BeebeeAi from '@/components/beebeehelp/inputBox.vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { ref, computed } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'

  const storeCues = cuesStore()

  let pathCues = ref(false)
  let stagesLive = ref([])
  
  /* computed */
  const pathListlive = computed(() => {
    return storeCues.pathListActive
  })

  const bentoPaths = computed (() => {
    return storeCues.pathRefContracts
  })

  const livePathlist = computed(() => {
    let pathKeys = Object.keys(storeCues.pathRefContracts)
    return pathKeys
  })


  const cuesHolistic = computed(() => {
    return storeCues.hopCues
  })

  /* methods */
  const viewPath = (vs) => {
    console.log(vs)
    // match to cue
    let livePath = storeCues.pathRefContracts[vs]
    console.log(livePath)
    stagesLive = livePath
    // go through stages and present stage1
    // storeCues.pathListActive = false
    pathCues.value = !pathCues.value
  }


</script>

<style scoped>
#story-list {
  border: 1px solid lightgrey;
  margin: 1em;
}



</style>