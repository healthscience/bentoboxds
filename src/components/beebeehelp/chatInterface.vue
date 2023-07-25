<template>
  <div id="chat-interface">
    <!-- Natural Language Chat -->
    <div id="natlang-ai">
      <div class="chat-flow" id="conversation" v-if="beginChat === true">
        <div class="peer-ask"  id="peer-chat-left">
          <img class="left-chat-peer" src="../.././assets/peerlogo.png" alt="Avatar">
          <div v-if="chatAsk.active === true" class="left-chat"> {{ chatAsk.text }} </div>
          <span class="left-chat">{{ chatAsk.time }}</span>
        </div>
        <div class="beebee-reply" id="beebee-chat-right">
          <span class="right-chat">{{ aiResponse.time }}</span>
          <div class="right-chat">{{ aiResponse.text }}
            <div v-if="aiResponse.type === 'hopquery'">
              <span>Datatype: {{ aiResponse.data.library.text }} for month {{ aiResponse.data.time.words.day }} day {{ aiResponse.data.time.words.month }}</span>--- <button id="new-query" @click.prevent="beebeeChartSpace(aiResponse.data)">yes, produce chart</button>
            </div>
            <div v-else-if="aiResponse.type === 'upload'">
              <button>start file upload</button>
            </div>
            <div v-else-if="aiResponse.query === false && aiResponse.type !== 'hello'">
              {{ aiResponse.data }}
            </div>
          </div>
          <img class="right-chat-beebee" src="../.././assets/logo.png" alt="bbAI">
        </div>
      </div>
      <div class="chat-flow">
        <input-box></input-box>
      </div>
    </div>
  </div>
</template>


<script setup>
import inputBox from '@/components/beebeehelp/inputBox.vue'
import { ref } from 'vue'
import { computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const askStart = ref('What would you like to chart?')
  const askInput = ref('')
  let storeInfo = ref('local not store')

  const storeAI = aiInterfaceStore()
  storeInfo.value = storeAI.beebeeStatus

  // a computed ref
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
  align-items: center;
  justify-content: center;
  border: 1px solid grey;
  padding: 1em;
  border-radius: 1em;
}

.chat-flow {
  display: block;
  margin-top: .5em;
  width: 70%;
  border: 0px solid red;
}

#conversation {
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100px;
  overflow-y: scroll;
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

#natlang-ask {
}

  @media (min-width: 1024px) {
    #chat-interface {
      border: 0px solid blue;
      width: 60vw;
    }

    #natlang-ai {
      display: grid;
      grid-template-columns: 1fr;
      align-items: center;
      justify-content: center;
      border: 0px solid grey;
      padding: 1em;
      border-radius: 1em;
    }

    .chat-flow {
      display: block;
      margin-top: .5em;
      width: 99%;
      border: 0x solid rgb(11, 113, 11);
    }
  }

</style>
