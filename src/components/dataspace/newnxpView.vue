<template>
  <div id="build-new-nxp">
    <header>Board Builder</header>
    <module-builder></module-builder>
    <button class="contribute-nxp-button" @click="contributeNXP" >Contribute Board</button>
    {{ storeLibrary.newnxp }}
    <div v-if="savenxpSuccess" class="newnxp-form-feeback">
        <div id="hop-feedback">
          New network experiment saved.
        </div>
      </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import moduleBuilder from '@/components/dataspace/modules/moduleBuilder.vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  // a computed ref
  const savenxpSuccess = computed(() => {
    return storeLibrary.saveSuccessnxp
  })

  const peerNXPlib = computed(() => {
    return storeLibrary.peerExperimentList
  })

  const contributeNXP = () => {
    console.log('new network expimrent geneiss to start')
    storeLibrary.prepareGenesisContract(storeLibrary.newnxp)
  }

</script>

<style scoped>

  @media (min-width: 1024px) {

  }
</style>