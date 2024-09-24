<template>
  <Teleport to="body">
    <modal-cues :show="bentoFlakeStatus" @close="closeBentoFlake">
      Cues
      <template #header>
        <div id="cues-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeBentoFlake"
            aria-label="Close modal"
          >
            Close
          </button>
          <div id="cues-context">Flake</div>
          <div id="return-modal-close" @click="closeBentoFlake">return</div>
        </div>
      </template>
      <template #body>
        <div class="main">
          <div id="bento-flake">
            <div class="container-flake">
              <span v-for="flake in bFlakes">
                <div class="flake-cue" :style="{ backgroundColor: flake.cuecolor }" @click="viewCrystal(flake)">{{ flake.name }}</div>
              </span>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
      </template>
    </modal-cues>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalCues from '@/components/bentocues/cuesModal.vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()


  const bentoFlakeStatus = computed(() => {
    return storeAI.bentoflakeState
  })

  const bFlakes = computed(() => {
    let flakesList = [{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' }]
    return flakesList
  })

  /* methods */
  const closeBentoFlake = () => {
    storeAI.bentoflakeState = !storeAI.bentoflakeState
  }

  const viewCrystal = (crystal) => {
    console.log('one crystal color')
    console.log(crystal)
  }

</script>

<style scoped>



  @media (min-width: 1024px) {

    #bento-flake {
      display: grid;
      grid-template-columns: 3fr 1fr;
      border: 1px solid green;
      height: 100%;
    }

    /* four basic quadrants */
    #decision-doughnut {
      border: 1px solid blue;
      min-height: 60vh;
    }

    #decision-doughnut-cues {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    /* four basic quadrants */
    #new-doughnut-cues {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }


    #doughnut-size {
      min-height: 40vh;
      min-width: 40vw;
    }

    .pie {
      position: relative;
    }

    #return-modal-close {
      text-align: right;
    }

    /*  fliters  */
    #filter-cues {
      margin-left: 2em;
    }

    /* flake */

    .main {
      display: grid;
      --s: 60px;  /* size  */
      --m: 4px;    /* margin */
      --f: calc(1.732 * var(--s) + 4 * var(--m)  - 1px);
    }

    .container {
      font-size: 0; /*disable white space between inline block element */
    }

    .flake-cue {
      width: var(--s);
      margin: var(--m);
      height: calc(var(--s)*1.1547); 
      display: inline-block;
      font-size:initial;
      clip-path: polygon(0% 25%, 0% 75%, 50% 100%, 100% 75%, 100% 25%, 50% 0%);
      background: red;
      margin-bottom: calc(var(--m) - var(--s)*0.2885); 
    }

    .flake-cue:nth-child(odd) {
      background:green;
    }

    .container::before {
      content: "";
      width: calc(var(--s)/2 + var(--m));
      float: left;
      height: 120%;
      shape-outside: repeating-linear-gradient(     
      #0000 0 calc(var(--f) - 3px),
      #000  0 var(--f));
    }


  }

</style>