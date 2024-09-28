<template>
  <div v-if="pathListlive === true" id="story-list">
  <header>List of saved stories</header>
  <div v-for="storyi of livePathlist" :key="storyi.id" :value="storyi">
    <div class="story-list-live">
        {{ storyi }}
      <button @click.prevent="viewPath(storyi)" class="button is-primary">view</button>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'

  const storeCues = cuesStore()
  
  /* computed */
  const pathListlive = computed(() => {
    return storeCues.pathListActive
  })

  const bentoPaths = computed (() => {
    return storeCues.pathRefContracts
  })

  const livePathlist = computed(() => {
    let pathKeys = Object.keys(storeCues.pathRefContracts)
    return pathKeys
  })

  /* methods */
  const viewPath = (vs) => {
    console.log(vs)
    // match to cue
    let livePath = storeCues.pathRefContracts[vs]
    console.log(livePath)
    // go through stages and present stage1
    storeCues.pathListActive = false
  }


</script>

<style scoped>
#story-list {
  border: 1px solid lightgrey;
  margin: 1em;
}



</style>