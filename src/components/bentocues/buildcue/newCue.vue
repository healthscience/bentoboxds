<template>
  <div id="cue-doughnut" class="pie">
    <div id="new-cue-space">
      <form id="add-cue-form" @submit.prevent="cueAdd()">
        <label for="benefit"></label><!--  v-on:keyup="storeAI.actionNatlangIn($event)" -->
        <input type="input" id="cuenameadd" name="cuename" placeholder="cue name" v-model="cueName" autofocus>
      </form>
      <div id="build-segments">
        <form id="add-cue-segment" @submit.prevent="cueAdd()">
          <label for="benefit"></label><!--  v-on:keyup="storeAI.actionNatlangIn($event)" -->
          <input type="input" id="cuesegadd" name="cuepadd" placeholder="segment name" v-model="cueSegment" autofocus>
        </form>
        <ColorPicker v-model:pureColor="pureColor" format="hex" shape="square" />
        <button id="cue-add" type="submit" @click="cueAdd()">
          + cue
        </button>
      </div>
    </div>
    <div id="build-cues">
      <div id="new-doughnut-cues">
        <div id="doughnut-size-add">
          <pie-chartcues v-if="cuesNew.labels.length > 0" :cueType="'new'" :chartData="cuesNew" :options="{}" @segmentClick="cueSelectAdd"></pie-chartcues>
        </div>
        <div id="sub-wheel">sub segment</div>
      </div>
      <!--<div id="name-cue-wheel">
        OPTI JUV MED
      </div>
      <div id="addMarker">
        <button @click="addSubCue()">Add sub cue</button>
        <button @click="addSegMarker()">Add marker</button>
        <div id="attach-marker" v-if="cueMarkerSelect === true">
          <form id="marker-cue-form" @submit.prevent="cueAttachMarker()">
            <label for="cuemarker"></label>
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
      </div>-->
      <div id="save-cues-network">
        <button id="save-cues-library" @click="saveCues()">Contribute cues</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import hashObject from 'object-hash'
import { ref, computed } from 'vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { cuesStore } from '@/stores/cuesStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  const storeCues = cuesStore()

  let cueName = ref('')
  let cueSegment = ref('')
  let pureColor = ref('')
  let cueMarkerSelect = ref(false)
  let cueMarker = ref('')
  let markerSelected = ref('')
  let cuesNew = ref({ labels: [], datasets: [] })


  /* computed */
  const cueAdd = () => {
    let newSegment = { label: cueSegment.value, datasets: { backgroundColor: pureColor.value, data: 30 }}
    addCueSegment(newSegment)
    cueSegment.value = ''
  }

  /* methods */
  const addCueSegment = (cSeg) => {
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

  const saveCues = () => {
    console.log('save cues')
    console.log(cueName.value)
    console.log(cuesNew.value)
    // 1 create new datatype ref contract and auto look up wikipedia API if internet 2. save cues info. seperate vis info plus relationship e.g cue name and via cue connection if present
    // uuid for cue wheel
    let cueID = hashObject(cueName.value + new Date())
    let newCue= {}
    newCue.name = cueName.value
    newCue.cueid = cueID
    newCue.active = false
    storeCues.cuesList.push(newCue)
    // build data cue holder
    let cueHolder = {}
    cueHolder.cuid = cueID // ask LLM to prepare ref contract next release tiny LLM
    cueHolder.name = cueName.value
    cueHolder.relationship = cuesNew.value
    // pull together other parts of refcontract
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    // refContract.data = storeLibrary.datatypeForm  // ask LLM to prepare ref contract next release tiny LLM
    // storeLibrary.sendMessage(refContract)
    // save cues & relationship(s)
    const cueContract = {}
    cueContract.type = 'library'
    cueContract.action = 'cues'
    cueContract.reftype = 'new-cues'
    cueContract.task = 'PUT'
    cueContract.privacy = 'private'
    cueContract.data = cueHolder
    storeLibrary.sendMessage(cueContract)
  }
  
</script>

<style scoped>

#new-cue-space {
  display: grid;
  grid-template-columns: 1fr;
  margin: 2em;
  border: 1px solid lightblue;
  min-height: 80px;
}

#build-segments {
  display: grid;
  grid-template-columns: 8fr 3fr 1fr;
  margin: 2em;
  border: 1px solid lightblue;
  min-height: 80px;
}

input {
  width: 300px;
  font-size: 1.2em;
}

#cue-add {
  height: 2em;
}

#save-cues-network {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
}

#save-cues-library {
  height: 2em;
  width: 200px;
  font-size: 1.2em;
  margin-top: 2em;
  margin-bottom: 2em;
}
@media (min-width: 1024px) {


}
</style>
