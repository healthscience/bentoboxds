<template>
  <div id="modules-list-box">
    <div class="module-box">
      <div class="module-header">Data</div>
        <div id="data-module">data reference contract</div>
      </div>
    <div class="module-box">
      <div class="module-header">Compute</div>
      <div id="computes-list">
        <div class="compute-header">NOW</div>
        <div class="compute-ref-contracts">
           Observation - view compute reference contract
        </div>
      </div>
      <div id="computes-list-future">
        <div class="compute-header">FUTURE</div>
        <div class="compute-ref-contracts">
          Linear regression
          <div class="compute-stages">
            <div class="stage-compute-task">train</div>
            <div class="stage-compute-task">predict</div>
            <div class="stage-compute-task">evaluate</div>
          </div>
        </div>
        <div class="compute-ref-contracts">
          Auto regression
          <div class="compute-stages">
            <div class="stage-compute-task"><!--<button @click="trainStart()">train-Evolution</button>--></div>
            <div class="stage-compute-task">predict</div>
            <div class="stage-compute-task">evaluate</div>
          </div>
        </div>
      </div>
    </div>
    <div class="module-box">
      <div class="module-header">Visualisation</div>
      <div id="data-module">data reference contract</div>
    </div>
    <div class="module-box">
      <div class="module-header">Other modules</div>
      <div id="data-module">action prescire video exerseise etc.</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
 
  /* props */
  const props = defineProps({
    bboxid: String
  })


  /* computed */
  const start = computed(() => {
    return 3
  })

  /* methods */
  const trainStart = () => {
    console.log('start evolution training of autoregression model, find peers')
    console.log(props.bboxid)
    let aiMessage = {}
    aiMessage.type = 'bbai'
    aiMessage.reftype = 'ai'
    aiMessage.action = 'ai-task'
    aiMessage.data = {}
    aiMessage.bbid = props.bboxid
    storeAI.prepareAI(aiMessage)
  }

</script>

<style scoped>
#modules-list-box {
  background-color: antiquewhite; 
}

@media (min-width: 1024px) {
  #modules-list-box {
    background-color: antiquewhite; 
  }

  .module-box {
    display: grid;
    grid-template-columns: 1fr;
    border: 1px solid lightblue;
    margin: 1em;
    padding: 1em;
  }

  .compute-ref-contracts {
    border-bottom: 1px solid blue;
    padding-bottom: 2em;
  }

  .compute-stages {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .compute-header {
    font-weight: bold;
  }
}
</style>
