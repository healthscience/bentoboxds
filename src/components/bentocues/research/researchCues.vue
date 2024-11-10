<template>
  <h3>Research tools</h3>
  <div id="bento-research-cues">
    <form id="add-research-form" @submit.prevent="researchAdd()">
      <label for="research"></label>
      <input type="input" id="research-add" name="research" placeholder="add research url" v-model="researchURLadd" autofocus>
    </form>
    <button id="bento-research-task" type="submit" @click.prevent="researchAdd()">
      + add paper
    </button>
  </div>
  <div id="research-paper-list" v-if="researchPapers.length > 0">
    <div id="research-paper-select" v-for="pap in researchPapers" :value="pap.id">
      <button class="research-paper-item" @click="viewResearch(pap)">
        {{ pap }}
      </button>
      <button class="research-paper-source" @click="viewSourcePaper(pap)">
        View source
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed} from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { cuesStore } from '@/stores/cuesStore.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()
  const storeAI = aiInterfaceStore()
  const storeCues = cuesStore()
  const storeBentobox = bentoboxStore()

  let researchURLadd = ref('')
  let spaceResearch = ref(false)


    /* computed */
    const researchMedia = computed(() => {
      return storeBentobox.researchMedia
    })

    const researchPapers = computed(() => {
      console.log(storeCues.researchPapers)
      return storeCues.researchPapers
    })

  /* methods */
  const researchAdd = () => {
    // need to add to space history TODO make save entry
    // const spaceList.push(research info for this space only ie context)
    // assume youtube and extract id
    if (researchURLadd.value.length > 0) {
      storeCues.researchPapers.push(researchURLadd.value)
      // save to store
      const cueRContract = {}
      cueRContract.type = 'library'
      cueRContract.action = 'research'
      cueRContract.reftype = 'research-cues'
      cueRContract.task = 'PUT'
      cueRContract.privacy = 'public'
      cueRContract.data = storeCues.researchPapers
      storeLibrary.sendMessage(cueRContract)
      researchURLadd.value = ''
    }
  }

  const viewResearch = (paper) => {
    if (paper.length > 0) {
      // check if holder setup
      if (storeBentobox.locationRbox[storeAI.liveBspace.spaceid] === undefined) {
        storeBentobox.locationRbox[storeAI.liveBspace.spaceid] = {}
      }
      storeBentobox.setLocationRbox(storeAI.liveBspace.spaceid, paper)
      if (storeBentobox.researchMedia[storeAI.liveBspace.spaceid]) {
        storeBentobox.researchMedia[storeAI.liveBspace.spaceid].push({ tag: 'paper', id: paper })
      } else {
        storeBentobox.researchMedia[storeAI.liveBspace.spaceid] = []
        storeBentobox.researchMedia[storeAI.liveBspace.spaceid].push({ tag: 'paper', id: paper })
      }
    } else {
      console.log('empty URL')
    }
    //  need to emit to close one component up
    // spaceResearch.value = false
  }

  const viewSourcePaper = (paper) => {
    // visit source in new tab
    window.open(paper, '_blank')
  }

</script>

<style scoped>

#bento-research-task {
  margin-top: 1em;
}

@media (min-width: 1024px) {


}

</style>