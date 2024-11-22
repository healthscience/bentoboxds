<template>
  <h3>marker tools</h3>
  <div id="bento-marker-cues">
    <form id="add-marker-form" @submit.prevent="markerAdd()">
      <label for="marker"></label>
      <input type="input" id="marker-add" name="marker" placeholder="add marker" v-model="markerURLadd" autofocus>
      <input type="input" id="marker-add" name="marker" placeholder="add test source" v-model="markerTest" autofocus>
    </form>
    <button id="bento-marker-task" type="submit" @click.prevent="markerAdd()">
      + add marker
    </button>
  </div>
  <div id="marker-paper-list">
    <div id="marker-paper-select" v-for="mark in markerMatch" :value="mark.id">
      <button class="marker-paper-item" @click="viewMarker(mark.value.concept.marker)">
        {{ mark.value.concept.marker }}
      </button>
      <button class="marker-paper-source" @click="viewSourceMarker(mark.value.concept.marker)">
        View source
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed} from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { cuesStore } from '@/stores/cuesStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeAI = aiInterfaceStore()
  const storeLibrary = libraryStore()
  const storeCues = cuesStore()
  const storeBentobox = bentoboxStore()

  let markerURLadd = ref('')
  let markerTest = ref('')

  /* computed */
  const markerMatch = computed(() => {
    return storeCues.markerMatch
  })

  /* methods */
  const markerAdd = () => {
    // assume youtube and extract id
    if (markerURLadd.value.length > 0) {
      let newMarker = { spaceid: storeAI.liveBspace.spaceid, marker: markerURLadd.value, lab: markerTest.value }
      storeCues.markerMatch.push({ key: 'tempmark', value: { concept: { spaceid: storeAI.liveBspace.spaceid, marker: markerURLadd.value, lab: markerTest.value }}})
      // save and add to space ledger
      const cueMContract = {}
      cueMContract.type = 'library'
      cueMContract.action = 'marker'
      cueMContract.reftype = 'marker-cues'
      cueMContract.task = 'PUT'
      cueMContract.privacy = 'public'
      cueMContract.data = newMarker
      storeLibrary.sendMessage(cueMContract)
      markerURLadd.value = ''
    }
  }

  const viewMarker = (marker) => {
    let idMarker = marker
    if (idMarker.length > 0) {
      // check if holder setup
      if (storeBentobox.locationMarkerbox[storeAI.liveBspace.spaceid] === undefined) {
        storeBentobox.locationMarkerbox[storeAI.liveBspace.spaceid] = {}
      }
      storeBentobox.setLocationMarkerbox(storeAI.liveBspace.spaceid, idMarker)
      if (storeBentobox.markerMedia[storeAI.liveBspace.spaceid]) {
        storeBentobox.markerMedia[storeAI.liveBspace.spaceid].push({ key: idMarker, tag: 'marker', id: idMarker })
      } else {
        storeBentobox.markerMedia[storeAI.liveBspace.spaceid] = []
        storeBentobox.markerMedia[storeAI.liveBspace.spaceid].push({ key: idMarker, tag: 'marker', id: idMarker })
      }
    } else {
      console.log('empty marker')
    }
    //  need to emit to close one component up
    // spacemarker.value = false
  }

  const viewSourceMarker = (paper) => {
    // visit source in new tab
    window.open(paper, '_blank')
  }

</script>

<style scoped>

#bento-marker-task {
  margin-top: 1em;
}


#marker-paper-list {
  height: 200px;
  border: 1px solid red;
}
@media (min-width: 1024px) {


}

</style>