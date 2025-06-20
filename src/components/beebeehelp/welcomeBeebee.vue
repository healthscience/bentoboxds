<template>
  <div id="welcome" v-if="libraryAvailable === false">
    <div class="beebee-reply">
      <span class="right-time">Today</span>
      <div class="reply-text-chart">
        <div class="right-chat">
          <p>Welcome to BentoBoxDS.</p>
          <p>To get started, <button @click="setupLibrary()">add</button> contracts to Library or <button @click="openLibrary()">build</button> from stratch.</p>
          <p>Or ask beebee for help.</p>
        </div>
      </div>
      <div class="beebee">
        <img class="right-chat-beebee" src="../.././assets/logo.png" alt="bbAI">
      </div>
    </div>
  </div>
  <div v-else id="welcome-back">
    <div class="beebee-reply">
      <span class="right-time">Today</span>
        <div class="reply-text-chart">
          <div class="right-chat">
              Welcome back.
          </div>
        </div>
        <div class="beebee">
          <img class="right-chat-beebee" src="../.././assets/logo.png" alt="bbAI">
        </div>
      </div>
      <div class="beebee-reply">
      <span class="right-time">Today</span>
        <div class="reply-text-chart">
          <div class="right-chat">
              <div class="bb-commentary">
                <div id="text-summary">
                  Commentary:  beebee commentary coming soon
                </div>
                <div id="oracle-attention" v-if="oracleAttention.length > 0">
                  <div class="oracle-item" v-for="ori of oracleAttention">
                    {{ ori.name }} -- {{ ori.oracle }}
                  </div>
                </div>
                <div v-else>
                  beebee oracle has nothing to show. View the holistic wheel  <img class="cues-holitic-wheel" src="../.././assets/cues-holistic-icon.png" alt="cues" @click=cuesHolistic()>
                </div>
                <!--<bento-box :bboxid="commentaryBox"></bento-box>-->
              </div>
          </div>
        </div>
        <div class="beebee">
          <img class="right-chat-beebee" src="../.././assets/logo.png" alt="bbAI">
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import BentoBox from '@/components/bentobox/baseBox.vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeCues = cuesStore()
  const storeLibrary = libraryStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let commentaryBox = ref('7722c3b50c6e44827025cd3e86d3171ab376b599')

  /* computed */
  const libraryAvailable = computed (() => {
    let pubLiblive = Object.keys(storeLibrary.publicLibrary)
    if (pubLiblive.length > 0) {
      return true
    } else {
      return false
    }
  })

  const spaceList = computed(() => {
    return storeBentobox.spaceList
  })

  const oracleAttention  = computed(() => {
    return storeCues.oracleAttention
  })

  /* methods */
  const setupLibrary = () => {
    // setup default time datatype contract, observation compute contract and chartjs visualise contract
    storeLibrary.defaultLibContracts()
  }

  const cuesHolistic = () => {
    storeCues.liveCueContext = 'flake'
    storeAI.bentoflakeState = !storeAI.bentoflakeState
  }

  const openLibrary = () => {
    storeAI.dataBoxStatus = true
    storeAI.uploadStatus = false
    storeLibrary.libraryStatus = true
  }

  const spaceCommentary = (spaceID) => {
    storeAI.bentospaceState = !storeAI.bentospaceState
    storeAI.liveBspace = spaceID
    // make button green
    let spaceLiveList = []
    for (let spi of storeBentobox.spaceList) {
      if (spi.spaceid === spaceID.spaceid) {
        spi.active = true
        spaceLiveList.push(spi)
      } else {
        spi.active = false
        spaceLiveList.push(spi)
      }
    }
    storeBentobox.spaceList = spaceLiveList
  }

  const uploadButton = () =>  {
    storeAI.dataBoxStatus = true
    storeLibrary.uploadStatus = true
    storeLibrary.libraryStatus = false
  }

  const openExperiments = () => {
    storeAI.dataBoxStatus = true
    storeAI.uploadStatus = false
    storeLibrary.libraryStatus = false
    storeLibrary.libPeerview = true
  }

</script>


<style scoped>
p {
  line-height: 2em;
}

.beebee-reply {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  background-color:  #d8d7e2;
  width: 90%;
  border-radius: 25px;
  margin-top: .5em;
  margin-left: 40px;
  opacity: 94%;
}

.right-chat-beebee {
  width: 50px;
}

.beebee {
  display: grid;
  justify-self: end;
}

.bb-commentary {
  padding: 1em;
  border-radius: 25px;
  background-color: rgb(245, 243, 241);
}

#text-summary {
  display: grid;
  grid-template-columns: 1fr;
  padding: 1.4em;
}

.bb-commentary-text {
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
}

.space-commentary-text {
  padding: 1.4em;
}

.space-container-buttons {
  display: block;
}

.space-list{
  display: inline;
  padding: 0.5em;
}

.bb-shortcuts {
  margin: 1em;
}

.shortcut-buttons {
  margin-left: 1em;
  color: darkblue;
}

@media (min-width: 1024px) {
  p {
    line-height: 2em;
  }

  .beebee-reply {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    background-color:  #d8d7e2;
    width: 90%;
    border-radius: 25px;
    margin-top: .5em;
    margin-left: 40px;
    opacity: 94%;
  }

  .right-chat-beebee {
    width: 50px;
  }

  .beebee {
   display: grid;
   justify-self: end;
  }

  .bb-commentary {
    padding: 1em;
    border-radius: 25px;
    background-color: rgb(245, 243, 241);
  }

  #text-summary {
    display: grid;
    grid-template-columns: 1fr;
    padding: 1.4em;
  }

  .bb-commentary-text {
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }

  .space-commentary-text {
    padding: 1.4em;
  }

  .space-container-buttons {
    display: block;
  }

  .space-list{
    display: inline;
    padding: 0.5em;
  }

  .bb-shortcuts {
    margin: 1em;
  }

  .shortcut-buttons {
    margin-left: 1em;
    color: darkblue;
  }

 }
</style>