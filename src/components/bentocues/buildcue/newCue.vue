<template>
  <div id="cue-doughnut" class="pie">
    <div id="new-cue-space">
      <form id="add-cue-form" @submit.prevent="cueAdd()">
        <label for="benefit"></label><!--  v-on:keyup="storeAI.actionNatlangIn($event)" -->
        <input type="input" id="cuesegadd" name="cuepadd" placeholder="cue name" v-model="cueSegment" autofocus>
      </form>
      <ColorPicker v-model:pureColor="pureColor" format="hex" shape="square" />
      <button id="cue-add" type="submit" @click="cueAdd()">
        + cue
      </button>
    </div>
    <div id="build-cues">
      <div id="name-cue-wheel">
        OPTI JUV MED
      </div>
      <div id="new-doughnut-cues">
        <div id="doughnut-size-add">
          <pie-chartcues v-if="cuesNew.labels.length > 0" :cueType="'new'" :chartData="cuesNew" :options="{}" @segmentClick="cueSelectAdd"></pie-chartcues>
        </div>
        <div id="sub-wheel">sub segment</div>
      </div>
      <div id="addMarker">
        <button @click="addSubCue()">Add sub cue</button>
        <button @click="addSegMarker()">Add marker</button>
        <div id="attach-marker" v-if="cueMarkerSelect === true">
          <form id="marker-cue-form" @submit.prevent="cueAttachMarker()">
            <label for="cuemarker"></label><!--  v-on:keyup="storeAI.actionNatlangIn($event)" -->
            <input type="input" id="cuemarker" name="cuemarker" placeholder="marker name" v-model="cueMarker" autofocus>
          </form>
          <button id="cue-add-marker" type="submit" @click="cueAttachMarker()">
            Attach marker
          </button>
          <div id="select-marker-list">
            <select class="select-model-save" id="bbox-model-save" v-model="markerSelected" @change="attachMarker()">
            <option selected="" v-for="ctest in cueMarkerTest" :value="ctest.test">
              {{ ctest.test }}
              </option>
            </select>
            <button id="select-market-cue" @click="attachMarker()"> + marker</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let cueSegment = ref('')
  let pureColor = ref('')
  let cueMarkerSelect = ref(false)
  let cueMarker = ref('')
  let markerSelected = ref('')
  let cuesNew = ref({ labels: [], datasets: [] })

  const cueAdd = () => {
    let newSegment = { label: cueSegment.value, datasets: { backgroundColor: pureColor.value, data: 30 }}
    addCueSegment(newSegment)
    cueSegment.value = ''
  }

  const addCueSegment = (cSeg) => {
    console.log(cSeg)
    let updatePie = {}
    updatePie.labels = []
    updatePie.datasets = []
    // current labels
    let currentLabels = cuesNew.value.labels
    let currentDatasets = cuesNew.value.datasets
    let newColor
    let newData
    // new array for color and data
    if (currentDatasets.length === 0) {
      newColor = [cSeg.datasets.backgroundColor]
      newData = [cSeg.datasets.data]
    } else {
      let existing = currentDatasets[0]
      newColor = existing['backgroundColor'].concat([cSeg.datasets.backgroundColor])
      newData = existing['data'].concat([cSeg.datasets.data])
    }
    // add to arrays
    currentLabels.push(cSeg.label)
    currentDatasets = [{ backgroundColor: newColor, data: newData }]
    let updatePieObj = {}
    updatePieObj.labels = currentLabels
    updatePieObj.datasets = currentDatasets
    cuesNew.value = updatePieObj
  }

  const cueSelectAdd = (type, seg) => {
    console.log('new seg add biomarker')
    console.log(type)
    console.log(seg)
  }

  const addSubCue = () => {
    console.log('create new sub cue')
  }

  const addSegMarker = () => {
    console.log('attach marker to cue')
    cueMarkerSelect.value = true
  }

  const cueAttachMarker = () => {
    console.log('marker attache')
  }

  const attachMarker = () => {
    console.log('list attach marker')
  }

  const cueMarkerTest = computed(() => {
    let testMarkers = []
    testMarkers = [{ category: 'immunesystem', test: 'Antinuclear Antibodies (ANA) Screen' }, { category: 'immunesystem', test: 'Celiac Disease (Comprehensive Panel)' }, { category: 'immunesystem', test: 'Antinuclear Antibodies (ANA) Pattern' }, { category: 'immunesystem', test: 'Antinuclear Antibodies (ANA) Titer' }]
    return testMarkers 
  })
  
</script>

<style scoped>


@media (min-width: 1024px) {

  

}
</style>
