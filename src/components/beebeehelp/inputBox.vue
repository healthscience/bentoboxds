<template>
  <div id="ai-interaction">
    <form id="ask-ai-form" v-on:submit.prevent @keyup.enter.prevent="submitAsk">
      <label for="askname"></label>
      <input type="text-area" id="askinput" name="ainame" v-on:keyup="storeAI.actionNatlangIn($event, askInput)" placeholder="What would you like to chart?" v-model="askInput">
    </form>
    <button v-if="beebeeAIStatus.active === true" id="natlang-ask" @click.prevent="storeAI.submitAsk()" v-on:keyup.enter.prevent="storeAI.submitAsk()">
      Ask BeeBee
    </button>
  </div>
</template>

<script setup>
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { ref } from 'vue'
import { computed } from 'vue'

  const askStart = ref('What would you like to chart?')
  const askInput = ref('')
  let storeInfo = ref('local not store')

  const beebeeAIStatus = computed(() => {
    return storeAI.helpchatAsk
    })


  const storeAI = aiInterfaceStore()
  storeInfo.value = storeAI.beebeeStatus

</script>

<style scoped>

#ai-interaction {
  display: grid;
  grid-template-columns: 1fr
}

#askinput {
  font-size: 1.2em;
  padding-left: 1em;
  height:4em;
  width: 70vw;
}

@media (min-width: 1024px) {
  #ai-interaction {
    display: grid;
    grid-template-columns: 4fr 1fr
  }

  #askinput {
    font-size: 1.2em;
    padding-left: 1em;
    height:4em;
    width: 100%;
    opacity: 100%;
  } 
}

</style>