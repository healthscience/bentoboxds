<template>
  <div id="chat-interface">
    <!-- Natural Language Chat -->
    <div id="natlang-ai">
      <div class="chat-flow" id="conversation" v-if="beginChat === true"  v-for="chati in chatPairs">
        <div class="peer-ask"  id="peer-chat-left">
          <img class="left-chat-peer" src="../.././assets/peerlogo.png" alt="Avatar">
          <div v-if="chati.question.data.active === true" class="left-chat"> {{ chati.question.data.text }} </div>
          <span class="left-chat">{{ chati.question.data.time }}</span>
        </div>
        <div class="beebee-reply">
          <span class="right-time">{{ chati.reply.time }}</span>
          <div class="reply-text-chart">
            <div class="right-chat">{{ chati.reply.data.text }}
              <div v-if="chati.reply.type === 'hopquery'">
                <span>Datatype: {{ chati.data.library.text }} for month {{ chati.data.time.words.day }} day {{ chati.data.time.words.month }}</span>--- <button id="new-query" @click.prevent="beebeeChartSpace(chati.data)">yes, produce chart</button>
              </div>
              <div v-else-if="chati.reply.data.type === 'bbai'">
                Please select a chart style
                  <button @click="chartBuild('bar')">bar</button> <button @click="chartBuild('line')">line</button> <button>pie</button>
              </div>
              <div v-else-if="chati.type === 'upload'">
                <button>start file upload</button>
              </div>
              <div v-else-if="chati.query === false && chati.type !== 'hello'">
                {{ chati }}
              </div>
            </div>
            <div id="beebee-chartspace" v-if="chartLive === true">
              <bar-chart  v-if="chartStyle === 'bar'"></bar-chart>
              <line-chart v-if="chartStyle === 'line'"></line-chart>
              <div id="space-tools">
                <button id="saveTospace">add to space</button>
              </div>
            </div>
          </div>
          <img class="right-chat-beebee" src="../.././assets/logo.png" alt="bbAI">
        </div>
      </div>
    </div>
    <div class="chat-input">
      <input-box></input-box>
    </div>
  </div>
</template>


<script setup>
import inputBox from '@/components/beebeehelp/inputBox.vue'
import barChart from '@/components/visualisation/charts/barChart.vue'
import lineChart from '@/components/visualisation/charts/lineChart.vue'
import { ref } from 'vue'
import { computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const askStart = ref('What would you like to chart?')
  const chartLive = ref(false)
  const chartStyle = ref('')

  const storeAI = aiInterfaceStore()

  function chartBuild (style) {
    this.chartLive = true
    this.chartStyle = style
  }

  // a computed ref
  const chatPairs = computed(() => {
   return storeAI.historyPair
  })

  const chatHistory = computed(() => {
   return storeAI.helpchatHistory
  })

  const chatAsk = computed(() => {
   return storeAI.helpchatAsk
  })

  const aiResponse = computed(() => {
   return storeAI.beebeeReply
  })

  const beginChat = computed(() => {
   return storeAI.beginChat
  })

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#natlang-ai {
  grid-template-columns: 1fr;
  align-items: center;
  justify-content: center;
  border: 1px solid grey;
  padding: 1em;
  border-radius: 1em;
  height: 100%;
  overflow-y: scroll;
}

.chat-flow {
  display: grid;
  grid-template-columns: 1fr;
  margin-top: .5em;
  width: 70%;
  border: 0px solid red;
}

#conversation {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100px;
}

.peer-ask {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  background-color: pink;
  border-radius: 25px;
  width: 60%;
}

.left-chat-peer {
  width: 50px;
}

.right-chat-beebee {
  width: 50px;
}

#peer-chat-left {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
}

.left-chat {
  padding-top: .8em;
  display: inline-grid;
}

.beebee-reply {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  background-color: #d8d7e2;
  width: 90%;
  border-radius: 25px;
  justify-self: end;
  margin-top: .5em;
}

.right-chat {
  padding-top: 1em;
}

#beebee-chartspace {
  border: 1px solid purple;
}


.chat-input {
  position: fixed;
  margin-top: .5em;
  width: 80%;
  border: 1x solid red;
}

#natlang-ask {
}

  @media (min-width: 1024px) {
    #chat-interface {
      border: 0px solid blue;
      width: 100%;
    }

    #natlang-ai {
      display: grid;
      grid-template-columns: 1fr;
      width: 100%;
      align-items: center;
      justify-content: center;
      border: 3px solid grey;
      padding: 1em;
      border-radius: 1em;
      max-height: 63vh;
      overflow-y: scroll;
    }

    #conversation {
      display: grid;
      grid-template-columns: 1fr;
    }

    .chat-flow {
      display: grid;
      grid-template-columns: 1fr;
      margin-top: .5em;
      width: 99%;
      border: 0x solid rgb(11, 113, 11);
    }

    #beebee-chartspace {
     border: 1px solid purple;
    }

    .chat-input {
      position: fixed;
      bottom: 4%;
      width: 76%;
      border: 0px solid red;
    }
  }

</style>
