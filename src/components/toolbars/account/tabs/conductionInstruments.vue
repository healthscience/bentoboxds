<template>
  <div id="conduction-lists">
    <div class="conduction-introduction">
      Conduction instruments coupled
    </div>
    <div class="conduction-instruments">
      {{ conductionInstruments }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeAI = aiInterfaceStore()

  /* computed */
  const conductionInstruments = computed(() => {
    return [ 'one', 'two']
  })



  /* methods */
  

</script>

<style scoped>
#conduction-lists {
  display: block;
  height: auto;
}

.active {
  padding: .4em;
  background-color: rgb(113, 172, 114);
}

@media (min-width: 1024px) {


}

</style>
