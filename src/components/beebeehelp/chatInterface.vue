<template>
  <div id="chat-interface">
    <!-- Natural Language Chat -->
    <div id="natlang-ai">
      <div id="conversation" v-if="beginChat === true"  v-for="chati in chatPairs">
        <div class="peer-ask">
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
                <button id="shareNetwork">Share</button>
              </div>
            </div>
          </div>
          <div class="beebee">
            <img class="right-chat-beebee" src="../.././assets/logo.png" alt="bbAI">beebee
          </div>
        </div>
      </div>
      <!--<div id="buttommove"></div>-->
      <div id="buttommove" ref="targetId" >{{ updateBottom  }}</div>
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
import { ref, computed, onMounted } from 'vue'
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

  const bottom = ref(null)
  onMounted(() => {
    // console.log(bottom.value)
    // bottom.value.scrollIntoView({behavior: "smooth"})
  })

  const updateBottom = computed(() => {
    setTimeout(scrollToElement, 500)
    return storeAI.chatBottom
  })

  const targetId = ref(null)

  const scrollToElement = () =>  {
    const el = document.getElementById('buttommove');
    if (el) {
      el.scrollIntoView({ block: "end" });
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#natlang-ai {
  display: block;
  border: 1px solid grey;
  padding: 1em;
  border-radius: 1em;
  height: 100%;
  overflow-y: scroll;
}

#conversation {
  display: block;
  min-height: 100px;
}

.peer-ask {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  background-color: pink;
  border-radius: 25px;
  width: 80%;
}

.left-chat-peer {
  width: 50px;
}

.right-chat-beebee {
  width: 50px;
}

.left-chat {
  padding-top: .8em;
  display: inline-grid;
}

.beebee-reply {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  background-color: #d8d7e2;
  width: 96%;
  border-radius: 25px;
  margin-top: .5em;
  margin-left: 8%;
}

.right-chat {
  padding-top: 1em;
}

#beebee-chartspace {
  border: 1px solid purple;
  width: 220px;
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
      display: block;
      width: 100%;
      border: 3px solid grey;
      padding: 1em;
      border-radius: 1em;
      height: 64vh;
      overflow-y: scroll;
    }

    #conversation {
      display: block;
      min-height: 10vh;
      margin-top: 1em;
    }

    #beebee-chartspace {
      height: auto;
      background-color: white;
      border: 1px solid purple;
    }

    .chat-input {
      position: fixed;
      bottom: 4%;
      width: 76%;
      border: 0px solid red;
    }

    #snap {
     scroll-snap-align: end;
    }

  }

</style>
