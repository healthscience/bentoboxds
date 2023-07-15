<template>
  <div id="chat-interface">
    <!-- Natural Language Chat -->
    <div id="natlang-ai">
      <div class="chat-flow" id="conversation">
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
      <div class="chat-flow" id="ai-interaction">
        <form id="ask-ai-form" v-on:submit.prevent @keyup.enter.prevent="submitAsk">
          <label for="askname"></label>
          <input type="text" id="askinput" name="ainame" v-on:keyup="askebeebeesave" v-model="askInput">
        </form>
        <button v-if="beebeeAIStatus.active === true" id="natlang-ask" @click.prevent="submitAsk">
          Ask BeeBee
        </button>
      </div>
    </div>
    <!-- <div v-if="helpState.type === 'future'" id="feedback-action">
      Date asked for: {{ helpState.data }}
      <beebeendar-tool :shellID="helpState.refcontract" :moduleCNRL="'future'" :moduleType="'future'" :mData="'future'"></beebeendar-tool>
    </div> -->
  </div>
</template>


<script setup>
  import { ref } from 'vue'
  import { computed } from 'vue'

  const askInput = ref('hello majae')

  // a computed ref
  const chatAsk = computed(() => {
   return {
            active: true,
            text: 'please',
            time: '3333'
          }
  })

  const aiResponse = computed(() => {
   return {
            active: true,
            text: 'please',
            time: '44444'
          }
  })

  const beebeeAIStatus = computed(() => {
   return {
            active: true,
            text: 'please',
            time: '5555'
          }
  })

// import beebeendarTool from '@/components/visualise/tools/beebeendarTool'

/* export default {
  name: 'Help-AI',
  components: {
    // beebeendarTool
  },
  props: {
  },
  computed: {
    beebeeAIStatus: function () {
      return this.$store.state.aiInterface.statusbeebee
    },
    chatAsk: function () {
      return this.$store.state.aiInterface.helpchatAsk
    },
    aiResponse: function () {
      return this.$store.state.aiInterface.beebeeaiReply
    }
  },
  data () {
    return {
      askInput: ''
    }
  },
  methods: {
    askebeebeesave () {
      let chatASKbeebee = this.askInput
      this.$store.dispatch('actionHelpAsk', chatASKbeebee)
    },
    submitAsk () {
      this.$store.dispatch('actionHelpaskentry', true)
      this.askInput = ''
    },
    beebeeChartSpace (query) {
      console.log('beebee chart dispaly')
      console.log(query)
      let spaceContext = {}
      spaceContext.nxpCNRL = query.library.board
      spaceContext.moduleCNRL = query.library.mod
      spaceContext.moduleType = 'cnrl-114'
      spaceContext.mData = '3'
      this.$store.dispatch('actionVisSpaceAdd', spaceContext)
    }
  }
}
*/

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

#natlang-ai {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid grey;
  padding: 1em;
  border-radius: 1em;
}

.chat-flow {
  display: block;
  margin-top: .5em;
  width: 800px;
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
  width: 90%;
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

#ai-interaction {
  display: grid;
  grid-template-columns: 4fr 1fr
}

#askinput {
  font-size: 1.2em;
  padding-left: 1em;
  height:4em;
  width: 600px;
}

#natlang-ask {
}
</style>
