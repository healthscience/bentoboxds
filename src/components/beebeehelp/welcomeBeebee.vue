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
                Commentary:  new dataed and analyssed, looks like a standard Tuesday.  Average heart rate, XX normal day.  Predictions on going.
                <bento-box :bboxid="commentaryBox"></bento-box>
              </div>
            <div class="bb-commentary-spaces">
              Click on space for detailed commentary for that context.
              <div class="space-list" v-for="sis in spaceList">
                <button
                    class="flat-history"  @click="spaceCommentary(sis)"> {{ sis.name }}
                  </button>
              </div>
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
import { libraryStore } from '@/stores/libraryStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

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

  /* methods */
  const setupLibrary = () => {
    // setup default time datatype contract, observation compute contract and chartjs visualise contract
    storeLibrary.defaultLibContracts()
  }

  const openLibrary = () => {
    storeAI.dataBoxStatus = true
    storeAI.uploadStatus = false
    storeLibrary.libraryStatus = true
  }

  const spaceCommentary = () => {
    console.log('agent review of this space')
  }

</script>


<style scoped>

@media (min-width: 1024px) {
  p {
    line-height: 2em;
  }

  .beebee-reply {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    background-color: #d8d7e2;
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
  }

 }
</style>