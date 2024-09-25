<template>
  <div v-if="stageActive === true" class="stage-build-holder">
    <div id="setup-tools">
      <form id="stage-name">
        <label>Stage Name</label>
        <input name="query" v-model="stageName">
        <label for="stagetype-select">type</label>
        <select class="select-stage-id" id="stage-mapping-build" @change="statetypeSelect" v-model="stageType">
          <!-- <option value="none" selected="">please select</option> -->
          <option v-for="stype in stagetypeList" :key="stype.id" v-bind:value="stype">
            {{ stype.name }}
          </option>
        </select>
      </form>
      <div v-if="stageType.id === 0" >
        text box - please write story
        <form id="stage_form" name="stage_form" method="post" action="#">
          <div class="stage-text">
            <textarea required="" v-model="stageText" placeholder="write story"></textarea>
          </div>
        </form>
      </div>
      <div v-if="stageType.id === 1" >
        data
      </div>
      <div v-if="stageType.id === 2" >
        Image
      </div>
      <div v-if="stageType.id === 3" >
        <header>Experiment</header>
        <form id="experiment_form" name="experiment_form" method="post" action="#">
          <div class="stage-experiment">
            <input required="" v-model="stageExperiment" @change="experimentLookup" placeholder="experiment reference">
          </div>
        </form>
      </div>
      <div v-if="stageType.id === 4">
        Select a cue wheel please
      </div>
      <button @click.prevent="saveStage" class="button is-primary">Save</button>
    </div>
    <div v-if="stageActive === true" id="stage-display-preview">
      <header>Stage preview area {{ stageID }} </header>
        <div>
          Stage name: {{ stageName }}
        </div>
        <div>
          Type: {{ stageType }}
        </div>
        <div>
          Text: {{ stageText }}
        </div>
        <div>
          Experiment Reference {{ stageExperiment }}
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  const props = defineProps({
    stageID: Object,
    stageActive: null
  })

  let stageName = ref('')
  let stageType = ''
  let stagetypeList = 
    ref([
      { id: 4, name: 'Cue wheel' },
      { id: 0, name: 'Text' },
      { id: 1, name: 'Data' },
      { id: 2, name: 'Image' },
      { id: 3, name: 'Experiment' }
    ])
  let stageText = ref('')
  let stageExperiment = ('')

   /* computed */   
  const liveStageCount = computed(() => {
    return storeCues.stageCount
  })

   /* methods */
  const saveStage = (ev) => {
    console.log(ev)
    console.log('save stage')
    // first stage if yes, save name of story
    console.log('stage count')
    console.log(storeCues.stageCount)
    if (storeCues.stageCount === 0) {
      // save story name and create holder for story
      storeCues.stageCount++
      storeCues.pathRefContracts['name'] = ev
      let pathSummary = {}
      pathSummary.name = storeCues.pathName
      pathSummary.id = storeCues.stageCount
      console.log(pathSummary)
      storeCues.bentopathLive.push(pathSummary)
      console.log(storeCues.bentopathLive)
    }
    // clear the forms
    stageText = ''
    stageName = ''
    stageExperiment = ''
  }

  const statetypeSelect = () => {
    console.log('change s')
  }

  const experimentLookup = () => {
    console.log('lookup reference contract')
    console.log(stageExperiment.value)
  }

</script>

<style scoped>

#stage-story-holder {
}

#setup-tools {

}

#stage-display-preview {
  border: 2px solid lightgrey;
}

@media (min-width: 1024px) {

  
}
</style>
