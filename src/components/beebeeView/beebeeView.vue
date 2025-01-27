<template>
  <div id="beebee-shaper">
    <div id="beebee-bentos">
      <button id="cues-button" class="cue-cues" @click="openBentoAgent('cues')" :class="{ active: agentActive === 'cues' }">Cues</button>
      <button id="flake-button" class="cue-cues" @click="openBentoAgent('flake')" :class="{ active: agentActive === 'flake' }">Flake</button>
      <button id="besearch-button" class="cue-cues" @click="openBentoAgent('besearch')" :class="{ active: agentActive === 'besearch' }">Besearch</button>
      <button id="graph-button" class="cue-cues" @click="openBentoAgent('graph')" :class="{ active: agentActive === 'graph' }">Graph</button>
      <button id="diary-button" class="cue-cues" @click="openBentoAgent('diary')" :class="{ active: agentActive === 'diary' }">Diary</button>
    </div>
    <div id="beebee-history">
      <div id="bento-history">
        <div class="history-buttons">
          <div class="history-menu">
            <button @click="historyType('history')" class="button-chat-menu" v-bind:class="{ active: historyList === 'history' }">Chat</button>
          </div>
          <div class="history-menu">
            <button @click="historyType('space')" class="button-chat-menu" v-bind:class="{ active: historyList === 'space' }">Spaces</button>
          </div>
          <div id="body-cues">
            <button id="body-image" @click="viewBody()" class="button-chat-menu" :class="{ active: bodyDiagramShow === true }">Body</button>
             <Teleport to="body">
                <div id="body-daigram-interactive">
                  <body-diagram v-if="bodyDiagramShow === true"></body-diagram>
                </div>
            </Teleport>
          </div>
        </div>
        <div id="active-history-menu">
          <chat-menu v-if="historyList ===  'history'"></chat-menu>
          <space-menu v-if="historyList ===  'space'"></space-menu>
        </div>
      </div>
      <div class="bentospace-chat">
        <div class="beebee-home">
          <beebee-chat></beebee-chat>
        </div>
        <bento-cues></bento-cues>
        <bento-space></bento-space>
        <bento-diary></bento-diary>
        <bento-flake></bento-flake>
        <bento-graph v-if="bentoGraphStatus === true"></bento-graph>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BodyDiagram from '@/components/beebeeView/diagrams/bodyDiagram.vue'
import ChatMenu from '@/components/beebeeView/navigation/chatMenu.vue'
import BentoCues from '@/components/bentocues/healthCues.vue'
import BentoFlake from '@/components/bentocues/flakeCues.vue'
import BentoGraph from '@/components/bentocues/graphCues.vue'
import SpaceMenu from '@/components/beebeeView/navigation/spaceMenu.vue'
import BeebeeChat from '@/components/beebeehelp/chatInterface.vue'
import BentoSpace from '@/components/bentospace/spaceTemplate.vue'
import BentoDiary from '@/components/bentodiary/diaryTemplate.vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { computed } from 'vue'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let agentActive = ref('')
  let bodyDiagramShow = ref(false)

  const bentoGraphStatus = computed(() => {
    return storeAI.bentographState
  })

  const historyActive = computed(() => {
    return storeBentobox.historyActive
  })

  const historyList = computed(() => {
    return storeAI.historyList
  })


  let historyType = (type) => {
    storeAI.historyList = type
    storeBentobox.historyActive = !storeBentobox.historyActive // true
  }

  const openBentoAgent = (agent) => {
    agentActive.value = agent
    if (agent === 'cues') {
      storeAI.bentocuesState = !storeAI.bentocuesState
    } else if (agent === 'flake') {
      storeAI.bentoflakeState = !storeAI.bentoflakeState
    } else if (agent === 'besearch') {
      // storeAI.bentobesearchState = !storeAI.bentobesearchState
    } else if (agent === 'graph') {
      storeAI.bentographState = !storeAI.bentographState
    } else if (agent === 'diary') {
      storeAI.bentodiaryState = !storeAI.bentodiaryState
    }
  }

  const viewBody = () => {
    bodyDiagramShow.value = !bodyDiagramShow.value
  }

</script>

<style scoped>
#beebee-shaper {
  display: grid;
  grid-template-columns: 1fr;
  width: 90vw;
  height: 94vh;
}

#beebee-history {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 7fr;
}

#bento-history {
  display: grid;
  grid-template-columns: 1fr;
  height: 120px;
}

.history-buttons {
  display: grid;
  grid-template-columns: 1fr;
  min-width: 160px;
}

.history-menu {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
}

#active-history-menu {
  display: grid;
  grid-template-columns: 1fr;
  height: 100%;
}

.active {
  background-color: rgb(113, 172, 114);
}

.bentospace-chat {
  display: grid;
  grid-template-columns: 1fr;
  height: 80vh;
  width: 90vw;
  padding-top: 2px;
  transform-origin: left top;
  background-color: #fff4f4;
  background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px; 
}

.beebee-home {
  display: grid;
  height: 90vh;
}

.button-chat-menu {
  width: 90%;
}

#beebee-bentos {
      display: grid;
      grid-template-columns: 1fr;
      margin-top: 2em;
      margin-bottom: 2em;
    }

.cue-cues {
  display: inline-grid;
  margin-right: .4em;
}

  @media (min-width: 1024px) {

    #beebee-shaper {
      display: grid;
      grid-template-columns: 1fr;
      height: 100%;
      width: 100%;
    }

    #beebee-bentos {
      position: fixed;
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      width: 94%;
      height: 26px;
      margin-top: 5em;
      margin-bottom: 2em;
      z-index: 23;
    }

    #beebee-history {
      position: relative;
      display: grid;
      grid-template-columns: 1fr 7fr;
      margin-top: 7.5em;
    }

    #bento-history {
      display: grid;
      grid-template-columns: 1fr;
    }

    .history-buttons {
      display: grid;
      grid-template-columns: 1fr;
    }

    .history-menu {
      position: relative;
      display: grid;
      grid-template-columns: 1fr;
      height: 28px;
    }

    #active-history-menu {
      display: grid;
      grid-template-columns: 1fr;
      height: 100%;
    }

    .bentospace-chat {
      display: grid;
      grid-template-columns: 1fr;
      height: 80vh;
      width: 100%;
      transform-origin: left top;
      border: 0px solid orange;
      background-color: #fff4f4;
      background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
      background-size: 60px 60px, 60px 60px;
    }

    .beebee-home {
      display: grid;
      grid-template-columns: 1fr;
      border: 0px dashed rgb(207, 108, 21);
    }

    .button-chat-menu {
      width: 100%;
    }

    #body-cues {
      position: relative;
    }

    #body-daigram-interactive {
      position: absolute;
      left: 210px;
      top: 0;
      background-color: white;
      border: 2px solid rgb(69, 69, 230);
      /* background-color: white; */
      z-index: 88;
    }

  }
</style>