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
            <div id="cues-connector">
              <button @click="cueConnect()" v-bind:class="{ active: cuesTools === true }">Cues</button>
            </div>
            <div id="cues-connector">
              <button @click="cueCorridor()" v-bind:class="{ active: cuesCorridor === true }">Corridor</button>
            </div>
            <div id="juv-holder">
              <div id="health-Rejuvenation">Rejuvenation</div>
             <button id="health-optimisation" @click="juvCycle()">Options</button>
            </div>
            <div id="opti-holder">
              <div id="health-optimisation">Optimisation</div>
             <button id="health-optimisation" @click="optiCycle()">Start</button>
            </div>
            <div id="stacks-holder">
              <div id="health-optimisation">Stacks</div>
              <button id="stacks-optimisation" @click="stackProtocols()">Protocols</button>
              <div id="stack-types" v-if="stacksOpen === true">
                Markers Product - supplements  Treatments etc.
              </div>
            </div>
          </div>
          <div id="cues-context-flake">
            <div id="cues-context-tools" v-if="cuesTools === true">
              <!-- existing cues -->
              <cues-prepared v-if="wheelType === 'cues'"></cues-prepared>
            </div>
            <div id="cues-corridor-tools" v-if="cuesCorridor === true">
              <!-- cues over time past future corridors of life -->
              Coming soon cues over time, past, present and future
            </div>
            <beebee-ai></beebee-ai>
            <button id="open-beebee" @click.prevent="setShowBeeBee">beebee</button>
            <div id="bento-flake">
              <!-- make three by three grid to postion branches from -->
              <div class="center-grid"></div>
              <div class="center-grid"></div>
              <div class="center-grid"></div>
              <div class="center-grid"></div>
              <div id="center-flake" class="center-grid singularity">
                <div class="cue-holistic" v-if="cueBalance.length > 0">
                  <div class="cues-segs" v-for="cue of cuesFlakesH" :style="cue.style">
                      --------------------
                    <div class="cues-status flake-cue" v-for="cstatus of cuesStatusH[cue.cue]"  :style="{ backgroundColor: cstatus.cuecolor }" @click="viewCueHex(cstatus)">
                      {{ cstatus.name }}
                    </div>
                    <div class="cue-branch">
                      {{  }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="center-grid"></div>
              <div class="center-grid"></div>
              <div class="center-grid"></div>
              <div class="center-grid"></div>
            </div>
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
import CuesPrepared from '@/components/bentocues/prepareCues.vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let cuesTools = ref(false)
  let cuesCorridor = ref(false)
  let wheelType = ref('cues')
  let stacksOpen = ref(false)

  /* computed */
  const cueBalance = computed(() => {
    return storeCues.activeCue
  })

  const bentoFlakeStatus = computed(() => {
    return storeAI.bentoflakeState
  })

  const cuesFlakesH = computed(() => {
    return storeCues.cuesFlakeList
  })

  const cuesStatusH = computed(() => {
    let flakesList = storeCues.flakeCues
    return flakesList
  })

  /* methods */
  const closeBentoFlake = () => {
    storeAI.bentoflakeState = !storeAI.bentoflakeState
    storeCues.liveCueContext = 'menu'
  }

  const stackProtocols = () => {
    stacksOpen.value = !stacksOpen.value
  }

  const cueConnect = () => {
    cuesTools.value = !cuesTools.value
    cueConnect.value = !cueConnect.value
  }

  const cueCorridor = () => {
    cuesCorridor.value = !cuesCorridor.value
  }

  const viewCueHex = (cue) => {
    storeAI.beebeeContext = 'bentoflake'
    storeAI.bentospaceState = !storeAI.bentospaceState
    let tempSpace = {}
    tempSpace.active = true
    tempSpace.name = 'nmn'
    tempSpace.spaceid = 'f6b145fd4b8f507622b597537b0e5e5459da2189'
    storeAI.liveBspace = tempSpace // cue.spaceID
    // make button green
    let spaceLiveList = []
    storeBentobox.spaceList = spaceLiveList
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

#cues-holistic {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  background-color: antiquewhite;
  text-align: center;
}

#cues-context-flake {
  display: grid;
  grid-template-columns: 1fr;
  place-self: center;
}

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

#bento-flake {
  display: grid;
  grid-template-columns: 1fr;
  background: #faf5ec;
  align-items: center;
  opacity: 90%;
  box-shadow: inset 0px 0px 0px 300px rgb(241, 212, 212);
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

.cue-branch {
  display: inline;
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

.active {
  background-color: rgb(113, 172, 114);
}

  @media (min-width: 1024px) {

    #bento-flake {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      border: 1px solid lightblue;
      margin-top: 40px;
      border-radius: 50%;
      height: 900px;
      width: 900px;
      align-content: center;
    }

    .center-grid {
      height: 20vh;
      border: 0px solid blue;
    }

    #center-flake {
      display: grid;
    }

    .singularity {
      position: relative;
      display: grid;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
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
      cursor: pointer;
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