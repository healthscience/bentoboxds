<template>
  <div id="ai-interaction">
    <form id="ask-ai-form" @submit.prevent="storeAI.submitAsk()">
      <label for="askname"></label><!--  v-on:keyup="storeAI.actionNatlangIn($event)" -->
      <input type="text-area" id="askinput" name="ainame" placeholder="What would you like to chart?" v-model="storeAI.askQuestion.text">
    </form>
    <button type="submit" v-if="beebeeAIStatus.active === true" id="natlang-ask" @click="storeAI.submitAsk">
      Ask BeeBee
    </button>
  </div>
</template>

<script setup>
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { ref } from 'vue'
import { computed } from 'vue'

  let storeInfo = ref('local not store')

  const beebeeAIStatus = computed(() => {
    return storeAI.helpchatAsk
    })

  const storeAI = aiInterfaceStore()


</script>

<style scoped>

#ai-interaction {
  display: grid;
  grid-template-columns: 1fr
}

#askinput {
  font-size: 1.2em;
  height:4em;
  width: 100%;
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