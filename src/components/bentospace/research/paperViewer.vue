<template>
  <div id="research-box">
    <div id="research-bar" >
     Research Bar
    </div>
      URL brwoser please {{ props.bstag }}  {{ props.bsresearch }}
      <iframe id="paper-view" ref="paperpub" :src="props.bsresearch"></iframe>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  
  const props = defineProps({
    bstag: String,
    bsresearch: String
  })

  /* methods */


  /* computed */


</script>

<style scoped>
.active {
  background-color: darkblue;
  border: 1px solid lightblue;
}

@media (min-width: 1024px) {

  #research-box {
    height: 300px;
    width: 100%;
  }

  .active {
    background-color: darkblue;
    border: 1px solid lightblue;
  }

  #research-bar {
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
    align-items: center;
    width: 100%;
    height: 3em;
    background-color:  rgb(141, 145, 226);
  }

  #paper-view {
    width: 100%;
    height: 100%;
  }

}

</style>