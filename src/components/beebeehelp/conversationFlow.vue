<template>
  <div id="conversation" v-for="chati in chatspacePairs">
    <div class="peer-ask">
      <img class="left-chat-peer" src="../.././assets/peerlogo.png" alt="Avatar">
      <div v-if="chati.question?.data?.active === true" class="left-chat"> {{ chati.question?.data?.text }} </div>
      <span class="left-chat">{{ chati.question?.data?.time }}</span>
    </div>
    <div class="beebee-reply" v-bind:class="{ networkactive: chati.reply.network === true }"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'


  const storeAI = aiInterfaceStore()
  const storeLibrary = libraryStore()


  /* computed */
  const chatspacePairs = computed(() => {
   return storeAI.historySpacePair[storeAI.liveBspace.spaceid]
  })



</script>


<style scoped>

</style>