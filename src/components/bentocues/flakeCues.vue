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
          <div id="cues-holistic">
            <div id="juv-holder">
              <div id="health-Rejuvenation">Rejuvenation</div>
             <button id="health-optimisation" @click="juvCycle()">Options</button>
            </div>
            <div id="opti-holder">
              <div id="health-optimisation">Optimisation</div>
             <button id="health-optimisation" @click="optiCycle()">Start</button>
            </div>
          </div>
          <beebee-ai></beebee-ai>
          <button id="open-beebee" @click.prevent="setShowBeeBee">beebee</button>
          <div id="bento-flake">
            <!-- make three by three grid to postion branches from -->
            <div class="center-grid">1</div>
            <div class="center-grid">2</div>
            <div class="center-grid">3</div>
            <div class="center-grid">4</div>
            <div id="center-flake" class="center-grid singularity">5
              <div class="cues-segs" v-for="cueseg of cuesFlakes.cues" :style="cuesBBitems[cueseg]">
                  center {{ cuesBBitems[cueseg].transform }}
                <div class="cues-status flake-cue" v-for="cstatus of cuesStatus"  :style="{ backgroundColor: cstatus.cuecolor }" @click="viewCrystal(cstatus)">
                  {{ cstatus.name }}
                </div>
              </div>
            </div>
            <div class="center-grid">6</div>
            <div class="center-grid">7</div>
            <div class="center-grid">8</div>
            <div class="center-grid">9</div>
            <!--<div id="bento-flake-center">
            </div>--> 
            <!--<div class="bento-flake-quant">
              <div id="cues-one" class="container-flake">
                <span v-for="flake in bFlakes">
                  <div class="flake-cue" :style="{ backgroundColor: flake.cuecolor }" @click="viewCrystal(flake)">{{ flake.name }}</div>
                </span>
              </div>
              <div id="cues-two" class="container-flake">
                <span v-for="flake in bFlakesTwo">
                  <div class="flake-cue" :style="{ backgroundColor: flake.cuecolor }" @click="viewCrystal(flake)">{{ flake.name }}</div>
                </span>
              </div>
            </div>
            <div class="bento-flake-quant">
              <div id="cues-three" class="container-flake">
                <span v-for="flake in bFlakesThree">
                  <div class="flake-cue" :style="{ backgroundColor: flake.cuecolor }" @click="viewCrystal(flake)">{{ flake.name }}</div>
                </span>
              </div>
              <div id="cues-four" class="container-flake">
                <span v-for="flake in bFlakesFour">
                  <div class="flake-cue" :style="{ backgroundColor: flake.cuecolor }" @click="viewCrystal(flake)">{{ flake.name }}</div>
                </span>
              </div>
            </div>-->
          </div>
        </div>
      </template>
      <template #footer>
        Flake hex
      </template>
    </modal-cues>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import BeebeeAi from '@/components/beebeehelp/spaceChat.vue'
import ModalCues from '@/components/bentocues/cuesModal.vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  const bentoFlakeStatus = computed(() => {
    return storeAI.bentoflakeState
  })

  const flakePosition  = computed(() => {
    let transportPos  = [30, 60, 90, 120]
    let posSeg = { transform: 'rotate(' + transportPos[0] + 'deg)'}
    return posSeg
  })

  const cuesFlakes = computed(() => {
    let cuesF = { cues: ['nature', 'environment', 'culture', 'life', 'nature2', 'environment2', 'culture2', 'life2'] }
    // need to map to sub cues and then to N=1/decisions to show boundry state ie. low just right  concern
    return cuesF
  })

  const cuesBBitems = computed(() => {
    let branchItems =
    {
      nature: { transform: 'rotate('  + '0' + 'deg)'},
      environment: { transform: 'rotate(' + '10' + 'deg)'},
      culture: { transform: 'rotate(' + '20' + 'deg)'},
      life: { transform: 'rotate(' + '30' + 'deg)'},
      nature2: { transform: 'rotate('  + '40' + 'deg)'},
      environment2: { transform: 'rotate(' + '50' + 'deg)'},
      culture2: { transform: 'rotate(' + '60' + 'deg)'},
      life2: { transform: 'rotate(' + '70' + 'deg)'},
    }
    return branchItems
  })

  const cuesStatus = computed(() => {
    let flakesList = [ { cue: 1, name: 'swimming', cuecolor: 'green' }, { cue: 1, name: 'blood', cuecolor: 'green' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'green' }, { cue: 1, name: 'swimming', cuecolor: 'green' }, { cue: 1, name: 'blood', cuecolor: 'green' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'orange' }, { cue: 1, name: 'sleep', cuecolor: 'red' }]
    return flakesList
  })

  const bFlakes = computed(() => {
    let flakesList = [{ cue: 1, name: 'heart', cuecolor: 'red' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'green' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'green' }, { cue: 1, name: 'swimming', cuecolor: 'green' }, { cue: 1, name: 'blood', cuecolor: 'green' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'green' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'green' }, { cue: 1, name: 'swimming', cuecolor: 'green' }, { cue: 1, name: 'blood', cuecolor: 'green' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'green' }, { cue: 1, name: 'swimming', cuecolor: 'green' }, { cue: 1, name: 'blood', cuecolor: 'green' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'green' }, { cue: 1, name: 'swimming', cuecolor: 'green' }, { cue: 1, name: 'blood', cuecolor: 'green' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'green' }, { cue: 1, name: 'blood', cuecolor: 'green' }]
    return flakesList
  })

  const bFlakesTwo = computed(() => {
    let flakesList = [{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' }]
    return flakesList
  })

  const bFlakesThree = computed(() => {
    let flakesList = [{ cue: 1, name: 'heart', cuecolor: 'red' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'green' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'green' }, { cue: 1, name: 'swimming', cuecolor: 'green' }, { cue: 1, name: 'blood', cuecolor: 'green' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'green' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'green' }, { cue: 1, name: 'swimming', cuecolor: 'green' }, { cue: 1, name: 'blood', cuecolor: 'green' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'green' }, { cue: 1, name: 'swimming', cuecolor: 'green' }, { cue: 1, name: 'blood', cuecolor: 'green' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'green' }, { cue: 1, name: 'swimming', cuecolor: 'green' }, { cue: 1, name: 'blood', cuecolor: 'green' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'green' }, { cue: 1, name: 'blood', cuecolor: 'green' }]
    return flakesList
  })

  const bFlakesFour = computed(() => {
    let flakesList = [{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'orange' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'orange' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'orange' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'orange' }, { cue: 1, name: 'blood', cuecolor: 'orange' },{ cue: 1, name: 'heart', cuecolor: 'green' }, { cue: 1, name: 'courage', cuecolor: 'green' }, { cue: 1, name: 'sleep', cuecolor: 'orange' }, { cue: 1, name: 'swimming', cuecolor: 'red' }, { cue: 1, name: 'blood', cuecolor: 'orange' }]
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

  const setShowBeeBee = () => {
    // beebeeSpace.value = !beebeeSpace.value
    storeAI.bentochatState = !storeAI.bentochatState
  }

  const juvCycle = () => {
    storeAI.liveBspace = { name: 'juv' }
    setShowBeeBee()
  }

  const optiCycle = () => {
    storeAI.liveBspace = { name: 'opti' }
    setShowBeeBee()
  }

</script>

<style scoped>

#open-beebee {
  position: fixed;
  bottom: 10px;
  right: 120px;
  z-index: 31;
  display: grid;
  justify-content: center;
  place-self: start;
  align-self: start;
  height: 2em;
  width: 5em;
  background-color: white;
}

#cues-holistic {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#bento-flake {
  display: grid;
  grid-template-columns: 1fr;
  background: #faf5ec;
  border-radius: 50%;
  align-items: center;
  opacity: 90%;
  box-shadow: inset 0px 0px 0px 300px rgb(238, 222, 222);
}

#bento-flake-center {
  position: fixed;
  display: grid;
  border: 0px solid rgb(5, 29, 170);
  background: #faf5ec;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  justify-content: center;
  align-items: center;
  text-align: center;
  opacity: 90%;
}

.container-flake {
  border: 1px solid lightgray;
  width: 30vw;
}

#cues-one {
  transform: rotate(30deg)
}

#cues-two {
  position: relative;
  left: 100px;
  top: 0px;
  transform: rotate(320deg)
}

#cues-three {
  margin-top: 120px;
  margin-left: 0px;
  transform: rotate(-30deg)
}

#cues-four {
  position: relative;
  left: 100px;
  top: 120px;
  transform: rotate(30deg)
}
  @media (min-width: 1024px) {

    #bento-flake {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      border: 1px solid black;
      min-height: 60vh;
      height: 100%;
      margin-top: 2em;
    }

    .center-grid {
      height: 20vh;
      border: 2px solid blue;
    }

    #center-flake {
      display: grid;
    }

    .singularity {
      position: relative;
      display: grid;
      justify-content: center;
      align-items: center;
      background-color: orange;
    }

    .cues-segs {
      display: inline;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 50vw;
      padding-left: 100px;
      transform-origin: top left;
    }

    .cues-status {
      display: inline;
      border: 2px solid pink;
    }

    .bento-flake-quant {
      display: grid;
      grid-template-columns: 1fr 1fr;
      margin-top: 120px;
      margin-left: 80px;
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
      --s: 32px;  /* size  */
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