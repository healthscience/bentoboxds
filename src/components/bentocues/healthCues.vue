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
              <button class="cue-select-btn" id="decision-doughnut" @click="selectWheel('decision')">+ Decision</button>
              <button class="cue-select-btn" id="simple-wheel" @click="selectWheel('simple')">Simple</button>
              <button class="cue-select-btn" id="simple-segments" @click="selectWheel('segments')">Segments</button>
              <button class="cue-select-btn" id="simple-segments" @click="selectWheel('aging')">Aging</button>
            </div>
            <div class="pie" v-if="wheelType === 'decision'">
              <beebee-ai v-if="beebeeCues"></beebee-ai>
              <pie-chartcues v-if="cuesDecision.labels.length > 0" :cueType="'simple'" :chartData="cuesDecision" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
              <div id="decision-elements">
                Suggested benefits/reasons:
                <div class="decision-elements" v-for="ditem of oracleItems">
                  <button class="decision-element-btn" @click="addDecisionElement(ditem)">{{ ditem.label }}</button>
                </div>
              </div>
              <div id="decision-risks">
                Risks: upset stommach 
              </div>
              <div id="decision-biomarkers" v-if="bioMarker.state === true">
                Biomarkers recommend per segment
              </div>
              <div id="decision-diary">
                Time line diary MINI CALENDAR MODAL view
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
  let cuesDecision = ref({ labels: [], datasets: [] })
  let bioMarker = ref({ name: 'Off', state: false })

  const bentoCuesStatus = computed(() => {
    return storeAI.bentocuesState
  })

  const oracleItems = computed(() => {
    return storeAI.oracleData.elements
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
      labels: ['Farming', 'Buildings', 'Money', 'Work', 'Lifestyle', 'Food', 'Movement', 'Body', 'Culture', 'Sleep/mind', 'Universe', 'Climate/weather'],
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

  /* methods */

  const closeBentoCues = () => {
    storeAI.bentocuesState = !storeAI.bentocuesState
  }

  const cueSelect = (cueID, segID) => {
    console.log(segID.label)
    cueActive.value = segID.label
    if (segID.label === 'Blood') {
      spaceSelect('b6e81d8bed9758b538aa25c13239968813b17f5a', segID.label)
    } else if (segID.label === 'Hotel1') {
      spaceSelect('6b58a76357424b4a7382f3c891b07db74c8d871a', segID.label)
    } else if (segID.label === 'Freshwater change') {
      console.log('freshshsh')
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
    } else {
      beebeeCues.value = false
    }
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
      console.log('elese')
      console.log(currentDatasets[0])
      let existing = currentDatasets[0]
      newColor = existing['backgroundColor'].concat([ditem.datasets.backgroundColor])
      newData = existing['data'].concat([ditem.datasets.data])
    }
    console.log('uddapa soloosososos')
    console.log(newColor)
    console.log(newData)

    // add to arrays
    currentLabels.push(ditem.label)
    currentDatasets = [{ backgroundColor: newColor, data: newData }]
    console.log('afafafafafa')
    console.log(currentLabels)
    console.log(currentDatasets)
    let updatePieObj = {}
    updatePieObj.labels = currentLabels
    updatePieObj.datasets = currentDatasets
    cuesDecision.value = updatePieObj
    console.log(cuesDecision)
  }

  const biomarkerSwitch = () => {
    console.log('biomarker')
    console.log(bioMarker.value)
    if (bioMarker.value.state === true) {
      bioMarker.value = { name: 'On', state: false }
    } else {
      bioMarker.value = { name: 'Off', state: true }
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

    /* four basic quadrants */
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

  }

</style>