<template>


<Teleport to="body">
    <modal-cues :show="bentoCuesStatus" @close="closeBentoCues">
      Cues
      <template #header>
        <div id="cues-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeBentoCues"
            aria-label="Close modal"
          >
            Close
          </button>
          <div id="cues-context">Cues</div>
          <div id="return-modal-close" @click="closeBentoCues">return</div>
        </div>
      </template>
      <template #body>
        <div id="bento-cues">
          <div id="cues-wheel">
            <div id="wheel-tools">
              <button class="cue-select-btn" id="decision-start" @click="selectWheel('decision')">+ Decision</button>
              <button class="cue-select-btn" id="decision-start" @click="selectWheel('newcue')">+ Cue</button>
              <button class="cue-select-btn" id="simple-wheel" @click="selectWheel('simple')">Simple</button>
              <button class="cue-select-btn" id="simple-segments" @click="selectWheel('segments')">Segments</button>
              <button class="cue-select-btn" id="simple-segments" @click="selectWheel('aging')">Aging</button>
            </div>
            <div id="cue-doughnut" class="pie" v-if="wheelType === 'newcue'">
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
                  </div>
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
            <div id="decision-doughnut" class="pie" v-if="wheelType === 'decision'">
              <beebee-ai v-if="beebeeCues"></beebee-ai>
              <div id="cues-decision-flow" v-if="decisionDlive === true">
                <h3>Decision cue</h3>
                <div id="decision-doughnut-cues">
                  <div id="doughnut-size">
                    <pie-chartcues v-if="cuesDecision.labels.length > 0" :cueType="'simple'" :chartData="cuesDecision" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
                  </div>
                  <div id="cue-drill-in">
                    decision cue -- {{ cueActive }}
                    <div id="cue-type" v-if="cueActive.length > 0 && decisionCues[cueActive] !== undefined">
                      <pie-chartcues :chartData="decisionCues[cueActive]" :options="{}" @segmentClick="cueSelect" ></pie-chartcues>
                    </div>
                  </div>
                </div>
                <div id="decision-reason">
                  <div id="positive-reason" class="reason-container">
                    <h3>Postive</h3>
                    <div class="decision-elements" v-for="ditem of oracleItems">
                      <button class="decision-element-btn" @click="addDecisionElement(ditem)">{{ ditem.label }}</button>
                    </div>
                    <div id="peer-add-positive">
                      <form id="add-positive-form" @submit.prevent="positiveAdd()">
                        <label for="benefit"></label><!--  v-on:keyup="storeAI.actionNatlangIn($event)" -->
                       <input type="input" id="positiveadd" name="cuepositive" placeholder="positive expectations" v-model="positivePeeradd" autofocus>
                      </form>
                      <button id="natlang-ask" type="submit" @click="positiveAdd()">
                        + add
                      </button>
                    </div>
                  </div>
                  <div id="negative-reason" class="reason-container">
                    <h3>Concerns</h3>
                    <div id="decision-risks">
                      <div class="decision-elements" v-for="ditem of oracleConerns">
                        <button class="decision-element-btn" @click.prevent="addDecisionElement(ditem)">{{ ditem.label }}</button>
                      </div>
                    </div>
                    <div id="peer-add-concern">
                      <form id="add-positive-form" @submit.prevent="concernAdd()">
                        <label for="benefit"></label><!--  v-on:keyup="storeAI.actionNatlangIn($event)" -->
                       <input type="input" id="positiveadd" name="cuepositive" placeholder="positive expectations" v-model="concernPeeradd" autofocus>
                      </form>
                      <button id="natlang-ask" type="submit" @click.prevent="concernAdd()">
                        + add
                      </button>
                    </div>
                  </div>
                </div>
                <div id="decision-biomarkers" v-if="bioMarker.state === true">
                  <h3>Biomarkers</h3>
                  <div id="positive-reason" class="reason-container">
                    <h3>Postive</h3>
                    <div class="decision-elements" v-for="ditem of oracleBioMItems">
                      <button class="decision-element-btn" @click="addDecisionElement(ditem)">{{ ditem.label }}</button>
                    </div>
                  </div>
                  <div id="negative-reason" class="reason-container">
                    <h3>Concerns</h3>
                    <div id="decision-risks">
                      <div class="decision-elements" v-for="ditem of oracleBioMConerns">
                        <button class="decision-element-btn" @click="addDecisionElement(ditem)">{{ ditem.label }}</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="decision-risk">
                  <h3>Risk expectations</h3>
                </div>
                <div id="decision-make">
                  <h3>Make decision</h3>
                </div>
                <div id="decision-diary">
                  <h3>Time line diary</h3>
                   MINI CALENDAR MODAL view
                </div>
                <div id="decision-diary">
                  <h3>Recomend network N=1 boards</h3>
                </div>
              </div>
            </div>
            <div class="pie" v-if="wheelType === 'simple'">
              <pie-chartcues :cueType="'simple'" :chartData="cuesHolistic" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
            </div>
            <div class="pie-segments" v-if="wheelType === 'segments'">
              <pie-chartcues :cueType="'segments'" :chartData="cuesSegments" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
            </div>
            <div class="pie-segments" v-if="wheelType === 'aging'">
              <pie-chartcues :cueType="'aging'" :chartData="cuesData" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
              Source: <a href="https://peterattiamd.com/the-challenges-of-defining-aging/" target="_blank">All marks of aging</a>
            </div>
          </div>
          <div id="filter-cues">
            <header>Filters</header>
            <div id="slider-holder">
              <div class="container" style="margin-left: 0px">
                <br>
                Motivation
                <br>
                <input class="range vertical-lowest-first" type="range" min="0" max="1" step="0.1" value="1">
                <br>
              </div>
              <div class="container">
                <br>
                Price
                <br>
                <input class="range vertical-heighest-first" type="range" min="0" max="1" step="0.1" value="1">
                <br>
              </div>
              <div class="container">
                <br>
                Biomarkers
                <br>
                <button id="biomarkerSwitch" @click="biomarkerSwitch()">{{ bioMarker.name }}</button>
                <br>
              </div>
              <div class="container" style="margin-right: 0px">
                <br>
                Devices
                <br>
                <input class="range vertical-heighest-first round" type="range" min="0" max="1" step="0.1" value="1">
                <br>
              </div>
              <div class="container" style="margin-right: 0px">
                <br>
                Science
                <br>
                <input class="range vertical-heighest-first round" type="range" min="0" max="1" step="0.1" value="1">
                <br>
              </div>
            </div>
          </div>
          <div id="cue-bentobox">
            Expand cue -- {{ cueActive }}
            <div id="cue-type" v-if="cueActive === 'Body'">
              <pie-chartcues :chartData="cuesBody" :options="{}" @segmentClick="cueSelect" ></pie-chartcues>
            </div>
            <div id="cue-type" v-if="cueActive === 'Buildings'">
              <pie-chartcues :chartData="cuesBuilding" :options="{}" @segmentClick="cueSelect" ></pie-chartcues>
            </div>
            <div id="cue-type" v-if="cueActive === 'Climate/weather'">
              <pie-chartcues :chartData="cuesNature" :options="{}" @segmentClick="cueSelect" ></pie-chartcues>
            </div>
          </div>
        </div>

      </template>
      <template #footer>
      </template>
    </modal-cues>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import BeebeeAi from '@/components/beebeehelp/inputBox.vue'
import ModalCues from '@/components/bentocues/cuesModal.vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'  // pieChart.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let wheelType = ref('simple')
  let cueActive = ref('whole')
  let beebeeCues = ref(false)
  let cuesNew = ref({ labels: [], datasets: [] })
  let cuesDecision = ref({ labels: [], datasets: [] })
  let bioMarker = ref({ name: 'Off', state: false })
  let positivePeeradd = ref('')
  let concernPeeradd = ref('')
  let cueSegment = ref('')
  let pureColor = ref('')
  let cueMarkerSelect = ref(false)
  let cueMarker = ref('')
  let markerSelected = ref('')

  const bentoCuesStatus = computed(() => {
    return storeAI.bentocuesState
  })

  const decisionDlive = computed(() => {
    return storeAI.decisionDoughnutCue
  })

  const oracleItems = computed(() => {
    return storeAI.oracleData.elements
  })

  const oracleConerns = computed(() => {
    return storeAI.oracleData.concerns
  })

  const oracleBioMItems = computed(() => {
    return storeAI.oracleData.elementsBioM
  })

  const oracleBioMConerns = computed(() => {
    return storeAI.oracleData.concernsBioM
  })

  const cuesHolistic = computed(() => {
    let testPie = {
      labels: ['Nature', 'Environment', 'Culture', 'Life'],
      datasets: [
        {
        backgroundColor: ['#09921c', '#920914', '#191fe7', '#560992'],
        data: [90, 90, 90, 90]
        }
      ]}
    return testPie
  })


  const cuesSegments = computed(() => {
    let testPie = {
      labels: ['Farming', 'Buildings', 'Culture', 'Money', 'Work', 'Lifestyle', 'Food', 'Movement', 'Body', 'Sleep/mind', 'Universe', 'Climate/weather'],
      datasets: [
        {
        backgroundColor: ['#098133', '#920914', '#09921c', '#560992', '#17c8d1', '#f08113', '#61819c', '#e66553', '#8bf5b0', '#999999', '#000000' ,'#191fe7', '#999999'],
        data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
        }
      ]}
    return testPie
  })

  const cuesNature = computed(() => {
    let testPie = {
      labels: ['Novel entities', 'Ozone depletion', 'Aresol loading', 'Ocean acidification', 'Bio geochemical flows', 'Freshwater change', 'Landsystem change', 'Biosphere integrity', 'Climate change CO2', 'Climate radiating forcing', 'Besearch', 'Besearch'],

      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992', '#17c8d1', '#f08113', '#61819c', '#e66553', '#8bf5b0', '#181fe7' ,'#174fe7', '#999999'],
        data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
        }
      ]}
    return testPie
  })

  const cuesBody = computed(() => {
    let testPie = {
      labels: ['Brain', 'Skin', 'Heart', 'Immunesystem', 'Cardio', 'Muscle mass', 'Inflamation', 'Blood', 'Hormones', 'Sight', 'Mouth/teeth'],

      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992', '#17c8d1', '#f08113', '#61819c', '#e66553', '#8bf5b0', '#999999' ,'#999999', '#999999'],
        data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
        }
      ]}
    return testPie
  })

  const cuesBuilding = computed(() => {
    let testPie = {
      labels: ['Hotel1', 'Hotel2', 'Hotel3', 'Hotel4', 'Hotel5', 'Hotel6', 'Hotel7', 'Hotel8', 'Hotel9', 'Hotel10', 'Hotel11'],

      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992', '#17c8d1', '#f08113', '#61819c', '#e66553', '#8bf5b0', '#999999' ,'#999999', '#999999'],
        data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
        }
      ]}
    return testPie
  })

  const cuesData = computed(() => {
    let testPie = {
      labels: ['Genomic instability', 'Telomere attrition', 'Epigenetic alterations', 'Loss of proteostasis', 'Deregulated nutrient-sensing', 'Mitochondrial dysfunction', 'Cellular senescence', 'Stem cell exhaustion', 'Altered intercellular communication', 'besearch'],
      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992', '#17c8d1', '#f08113', '#61819c', '#e66553', '#8bf5b0', '#999999'],
        data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36]
        }
      ]}
    return testPie
  })

  const decisionCues = computed(() => {
    let testPie = {}
    testPie['muscle mass'] = {
      labels: ['movement', 'strength', 'immunine system', 'bone density', 'grip', 'heart cardio'],
      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992', '#17c8d1', '#f08113'],
        data: [36, 36, 36, 36, 36, 36]
        }
      ]}
      testPie['brain'] = {
      labels: ['fog', 'concentration', 'better sleep', 'prevent cog decline'],
      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992'],
        data: [36, 36, 36, 36]
        }
      ]}
    return testPie
  })

  // temp mark list
  const cueMarkerTest = computed(() => {
    let testMarkers = []
    testMarkers = [{ category: 'immunesystem', test: 'Antinuclear Antibodies (ANA) Screen' }, { category: 'immunesystem', test: 'Celiac Disease (Comprehensive Panel)' }, { category: 'immunesystem', test: 'Antinuclear Antibodies (ANA) Pattern' }, { category: 'immunesystem', test: 'Antinuclear Antibodies (ANA) Titer' }]
    return testMarkers 
  })

  /* methods */
  const cueAdd = () => {
    let newSegment = { label: cueSegment.value, datasets: { backgroundColor: pureColor.value, data: 30 }}
    addCueSegment(newSegment)
    cueSegment.value = ''
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

  const closeBentoCues = () => {
    storeAI.bentocuesState = !storeAI.bentocuesState
  }

  const cueSelectAdd = (type, seg) => {
    console.log('new seg add biomarker')
    console.log(type)
    console.log(seg)
  }

  const cueSelect = (cueID, segID) => {
    console.log(segID.label)
    cueActive.value = segID.label
    if (segID.label === 'Blood') {
      spaceSelect('b6e81d8bed9758b538aa25c13239968813b17f5a', segID.label)
    } else if (segID.label === 'Hotel1') {
      spaceSelect('6b58a76357424b4a7382f3c891b07db74c8d871a', segID.label)
    } else if (segID.label === 'Freshwater change') {
      spaceSelect('9e71b5fc3f1ea1c4e08a75478ef2ffcb7b43d7ff', segID.label)
    } else if (segID.label === 'immunine system') {
      spaceSelect('9e71b5fc3f1ea1c4e08a75478ef2ffcb7b43d7ff', segID.label)
    }

    // four major segments
    if (segID.label === 'Life' || segID.label === 'Nature' || segID.label === 'Environment' || segID.label === 'Culture') {
      wheelType.value = 'segments'
    }
  }

  const spaceSelect = (spaceID, label) => {
    storeAI.bentospaceState = !storeAI.bentospaceState
    storeAI.liveBspace = {name: label, spaceid: spaceID}
  }

  const selectWheel = (type) => {
    console.log('wheel' + type)
    wheelType.value = type
    if (wheelType.value === 'decision') {
      // bring beebee to life
      beebeeCues.value = true
      storeAI.beebeeContext = 'cues-decision'
    } else if (wheelType.value === 'newcue') {
      console.log('new cue cycle')
    } else {
      beebeeCues.value = false
    }
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

  const addDecisionElement = (ditem) => {
    // add data to doughnut
    console.log(ditem)
    let updatePie = {}
    updatePie.labels = []
    updatePie.datasets = []
    // current labels
    let currentLabels = cuesDecision.value.labels
    let currentDatasets = cuesDecision.value.datasets
    let newColor
    let newData
    // new array for color and data
    if (currentDatasets.length === 0) {
      newColor = [ditem.datasets.backgroundColor]
      newData = [ditem.datasets.data]
    } else {
      let existing = currentDatasets[0]
      newColor = existing['backgroundColor'].concat([ditem.datasets.backgroundColor])
      newData = existing['data'].concat([ditem.datasets.data])
    }
    // add to arrays
    currentLabels.push(ditem.label)
    currentDatasets = [{ backgroundColor: newColor, data: newData }]
    let updatePieObj = {}
    updatePieObj.labels = currentLabels
    updatePieObj.datasets = currentDatasets
    cuesDecision.value = updatePieObj
  }

  const positiveAdd =  () => {
    let newPositve = { label: positivePeeradd.value, datasets: { backgroundColor: '#6ab866', data: 30 }}
    addDecisionElement(newPositve)
    storeAI.oracleData.elements.push(newPositve)
  }

  const concernAdd =  () => {
    let newConcern = { label: concernPeeradd.value, datasets: { backgroundColor: '#deb8bd', data: 30 }}
    addDecisionElement(newConcern)
    storeAI.oracleData.concerns.push(newConcern)
  }

  const biomarkerSwitch = () => {
    if (bioMarker.value.state === true) {
      bioMarker.value = { name: 'Off', state: false }
    } else {
      bioMarker.value = { name: 'On', state: true }
    }
  }

</script>

<style scoped>



  @media (min-width: 1024px) {

    #bento-cues {
      display: grid;
      grid-template-columns: 3fr 1fr;
      border: 1px solid green;
    }

    .cue-select-btn {
      margin-left: .6em;
      padding: .4em;
    }

    #cue-doughnut {
      display: grid;
      grid-template-columns: 1fr;
    }

    #new-cue-space {
      display: grid;
      grid-template-columns: 3fr 1fr 2fr;
    }

    #build-cues {
      display: grid;
      grid-template-columns: 1fr;
    }

    #add-cue-form {
      display: grid;
      align-self: end;
      margin-left: 2em;
    }

    #add-cue-form input{
      width: 40vw;
      font-size: 1.2em;
    }

    #cue-add {
      display: grid;
      justify-items: start;
      margin-left: .1em;
      font-size: 1.2em;
      width: 100px;
    }

    #wheel-tools {
      margin: 1em;
    }

    #cues-decision-flow {
      border: 0px solid red;
    }

    /* four basic quadrants */
    #decision-doughnut {
      border: 1px solid blue;
      min-height: 60vh;
    }

    #decision-doughnut-cues {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    #decision-reason {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    #decision-biomarkers {
      min-height: 10vh;
      margin:1em;
    }

    #decision-diary {
      min-height: 10vh;
      margin:1em;
    }

    .reason-container {
      padding: 1.2em;
      margin: 1.2em;
      border: 1px solid lightblue;
    }

    #peer-add-positive {
      background-color: #e6e7e7;
      display: grid;
      grid-template-columns: 2fr 1fr;
      justify-items: center;
      margin-top: 2em;
    } 

    #peer-add-concern {
      background-color: #e6e7e7;
      display: grid;
      grid-template-columns: 2fr 1fr;
      justify-items: center;
      margin-top: 2em;
    } 

    /* four basic quadrants */
    #new-doughnut-cues {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }


    #doughnut-size {
      min-height: 40vh;
      min-width: 40vw;
    }

    .pie {
      position: relative;
    }

    #cues-context {
      display: inline;
      font-size: 2em;
      padding-left: 1em
    }
    #return-modal-close {
      text-align: right;
    }

    .decision-elements {
      display: inline-block;
    }

    .decision-element-btn {
      margin-left: 1em;
      padding: .4em;
    }

    /*  fliters  */
    #filter-cues {
      margin-left: 2em;
    }

  }

</style>