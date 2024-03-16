<template>
  <div id="experiment-builder-header">Module Builder</div>
  <div id="experiment-holder">
    <div id="modules-available"
      v-on:dragover.prevent
      v-on:drop="handleDrop($event, 'modules-available')"
    >
      <div class="mod-active" 
          v-for="(element) in libraryAvailable"
          :key="element.key"
          draggable="true"
          v-on:dragstart="handleDragStart($event, element)"
        >
          {{ element.text }}
      </div>
    </div>
    <div id="modules-selected"
      v-on:dragover.prevent
      v-on:drop="handleDrop($event, 'modules-selected')"
    >
      <div class="mod-selected"
        v-for="newMod in storeLibrary.newModuleList" 
        draggable="true"
        v-on:dragstart="handleDragStart($event, newMod)"
      >
        new-- {{ newMod.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// import draggable from 'vuedraggable'
import NxpQuestion from '@/components/dataspace/modules/nxpQuestion.vue'
import NxpDevice from '@/components/dataspace/modules/nxpDevice.vue'
import NxpDapp from '@/components/dataspace/modules/nxpDapp.vue'
import NxpCompute from '@/components/dataspace/modules/nxpCompute.vue'
import NxpControl from '@/components/dataspace/modules/nxpControl.vue'
import NxpVisualise from '@/components/dataspace/modules/nxpBuildVisualise.vue'

import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAI = aiInterfaceStore()
  const bboxStore = bentoboxStore()
  const storeLibrary = libraryStore()

  // temp data
  let libraryAvailable = ref([ { id: 1, text: 'Item 1' }, { id: 2, text: 'Item 2' }, { id: 3, text: 'Item 3' }])

  /* computed */
  const boxContracts = computed (() => {
    return {}
  })


  const handleDragStart = (event, itemData) => {
    event.dataTransfer.setData('application/json', JSON.stringify(itemData))
  }

  const handleDrop = (event, targetContainer) => {
    const itemData = JSON.parse(event.dataTransfer.getData('application/json'))
    if (targetContainer === 'modules-selected') {
      storeLibrary.newModuleList = storeLibrary.newModuleList.filter(i => i.id !== itemData.id)
      storeLibrary.newModuleList.push(itemData)
      // remove from available list
      libraryAvailable.value = libraryAvailable.value.filter(i => i.id !== itemData.id)
    } else if (targetContainer === 'modules-available') {
      libraryAvailable.value = libraryAvailable.value.filter(i => i.id !== itemData.id)
      libraryAvailable.value.push(itemData)
      // remove from selected list
      storeLibrary.newModuleList = storeLibrary.newModuleList.filter(i => i.id !== itemData.id)
    }
  }
</script>


<style scoped>

@media (min-width: 1024px) {

  #experiment-builder-header {
    font-weight: bold;
  }

  #experiment-holder {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 120px;
  }

  #modules-available {
    display: grid;
    grid-template-columns: 1fr;
    border: 1px solid lightblue;
    padding: 2em;
  }

  #modules-selected {
    display: grid;
    grid-template-columns: 1fr;
    border: 1px solid orange;
    padding: 2em;
  }

  .mod-active {
    background-color: antiquewhite;
    width: 80%;
    margin: 0.5em;
  }

  .mod-selected {
    background-color: orange;
    width: 80%;
    margin: 0.5em;
  }

}

</style>