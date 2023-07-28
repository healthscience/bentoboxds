<template>
  <div id="beebee-shaper">
    <div class="bento-history">
      <div class="history">
        <button @click="historyType('history')">History</button>
      </div>
      <div class="spaces">
        <button @click="historyType('space')">Spaces</button>
      </div>
      <div class="live-drop-zone">
        list {{ historyList }}
        <div v-if="historyList === 'history'">
          {{ chartList }}
        </div>
        <div v-else>
          {{ spaceList }}
        </div>
      </div>
    </div>
    <div class="bentospace">
      <div class="beebee-home">
        <beebee-chat></beebee-chat>
       </div>
    </div>
  </div>
</template>

<script setup>
import BeebeeChat from '@/components/beebeehelp/chatInterface.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { ref } from 'vue'

const storeAI = aiInterfaceStore()

const startChat = ref(true)
let historyList = ref('history')
let chartList = ref(['chart1', 'chart2', 'chart3',])
let spaceList = ref(['space1', 'space2', 'space3',])

function historyType (type) {
  this.historyList = type
}

</script>

<style scoped>
#beebee-shaper {
  display: grid;
  grid-template-columns: 1fr 7fr;
  width: 90vw;
  height: 90vh;
  border: 0px dashed green;
}

.bento-history {
  display: grid;
  grid-template-columns: 1fr;
  margin-top: 8.5em;
  border: 3px solid green;
}

.history {
  display: relative;
  align-items: top;
  height: 2em;
  border: 2px dashed green;
}
.spaces {
  display: relative;
  height: 2em;
  border: 2px dashed green;
}

.live-drop-zone {
  display: relative;
  height: 2em;
  border: 2px dashed green;
}

.bentospace {
  display: grid;
  grid-template-columns: 1fr;
  border: 2px solid green;
  height: 90vh;
  padding-top: 2px;
  transform-origin: left top;
  border: 1px solid orange;
  background-color: #fff4f4;
  background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px;
  border:1px green;
}

.beebee-home {
  display: grid;
  border: 0px dashed red;
}

  @media (min-width: 1024px) {

    #beebee-shaper {
      display: grid;
      grid-template-columns: 1fr 7fr;
      border: 0px dashed rgb(0, 15, 128);
    }

    .bento-history {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 10fr;
      margin-top: 8.5em;
      height: 60vh;
      border: 6x solid red;
    }

    .history {
      height: 2em;
      border: 2px dashed blue;
    }

    .spaces {
      position: relative;
      height: 2em;
      border: 2px dashed blue;
    }

    .live-drop-zone {
      height: 100%;
      border: 4px dashed rgb(228, 137, 39);
    }

    .bentospace {
      display: grid;
      grid-template-columns: 1fr;
      border: 2px solid green;
      height: 80vh;
      width: 100%;
      margin-top: 8.5em;
      transform-origin: left top;
      border: 1px solid orange;
      background-color: #fff4f4;
      background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
      background-size: 60px 60px, 60px 60px;
    }

    #message-question {
      text-align: center;
    }
    .beebee-home {
      display: grid;
      grid-template-columns: 1fr;
      border: 3px dashed rgb(207, 108, 21);
    }
  }
</style>