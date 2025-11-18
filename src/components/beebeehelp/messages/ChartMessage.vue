<template>
  <div class="chart-message">
    <div v-if="message.type === 'hopquery'">
      <span>Datatype: {{ message.data.library.text }} for month {{ message.data.time.words.day }} day {{ message.data.time.words.month }}</span>---
      <button id="new-query" @click.prevent="beebeeChartSpace(message.data)">yes, produce chart</button>
    </div>
    <div v-else-if="message.type === 'experiment' && message.data">
      <button @click="viewSaveExperiment(message.bbid, message.data)">View experiment</button>
    </div>
    <div v-else-if="message.type === 'network-library-n1'">
      {{ message?.data?.text?.boardname }}<button @click="publibLibAdd(message.data.text)"> yes add this Cue space to public library</button>
    </div>
    <div id="beebee-chartspace" v-if="storeAI.beebeeChatLog[message?.bbid] === true && storeAI.visData[message.bbid].datasets[0]?.data !== undefined">
      <!--the slimed down bentobox to chart and bring in tools as needed  storeAI.beebeeChatLog[chati?.question] !== undefined &&  -->
      <div  v-if="message?.data?.text !== undefined && message?.data?.text.length > 0">
        {{ message?.data?.text }}
      </div>
      <bento-box :bboxid="message?.bbid"></bento-box>
    </div>
    <div v-else-if="message?.data?.text !== undefined && message?.data?.text.length > 0">
      {{ message?.data?.text }}
      <bento-box :bboxid="message?.bbid"></bento-box>
    </div>
  </div>
</template>

<script setup>
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'
import BentoBox from '@/components/bentobox/baseBox.vue'

const props = defineProps({
  message: Object
})

const storeAI = aiInterfaceStore()
const storeLibrary = libraryStore()

const viewSaveExperiment = (bbid, contractID) => {
  storeLibrary.prepareLibraryViewFromContract(bbid, contractID)
}

const publibLibAdd = (board) => {
  storeLibrary.confrimAddPublicLibrary(board.data)
}

const beebeeChartSpace = (data) => {
  // Implement the chart space functionality
  console.log('Chart space data:', data)
}
</script>

<style scoped>
.chart-message {
  padding: 1em;
  background-color: #e6f7ff;
  border-radius: 8px;
  margin: 0.5em 0;
}

#beebee-chartspace {
  display: grid;
  grid-template-columns: 1fr;
  width: 80%;
  height: auto;
}
</style>