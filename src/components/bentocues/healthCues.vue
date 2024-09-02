<template>


<Teleport to="body">
    <modal-cues :show="bentoCuesStatus" @close="closeBentoCues">
      Cues
      <template #header>
        <div id="cues-modal-header">
          <button
            type="button"
            class="btn-green"
            @cdivck="closeBentoCues"
            aria-label="Close modal"
          >
            Close
          </button>
          <h3>Cues</h3>
          <div id="return-modal-close" @click="closeBentoCues">return</div>
        </div>
      </template>
      <template #body>
        <div id="bento-cues">
          <div id="cues-wheel">
            <div id="wheel-tools">
              <button id="simple-wheel" @click="selectWheel('simple')">Simple</button>
              <button id="simple-segments" @click="selectWheel('segments')">Segments</button>
              <button id="simple-segments" @click="selectWheel('aging')">Aging</button>
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
                <br><br>
                <input class="range vertical-lowest-first" type="range" min="0" max="1" step="0.1" value="1">
                <br><br><br>
                Motivation
              </div>
              <div class="container">
                <br><br>
                <input class="range vertical-heighest-first" type="range" min="0" max="1" step="0.1" value="1">
                <br><br><br>
                Price
              </div>
              <div class="container">
                <br><br>
                <input class="range vertical-lowest-first round" type="range" min="0" max="1" step="0.1" value="1">
                <br><br><br>
                Biomarkers
              </div>
              <div class="container" style="margin-right: 0px">
                <br><br>
                <input class="range vertical-heighest-first round" type="range" min="0" max="1" step="0.1" value="1">
                <br><br><br>
                Devices
              </div>
              <div class="container" style="margin-right: 0px">
                <br><br>
                <input class="range vertical-heighest-first round" type="range" min="0" max="1" step="0.1" value="1">
                <br><br><br>
                Science
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
import ModalCues from '@/components/bentocues/cuesModal.vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'  // pieChart.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let wheelType = ref('simple')
  let cueActive = ref('whole')

  const bentoCuesStatus = computed(() => {
    return storeAI.bentocuesState
  })

  const cuesHolistic = computed(() => {
    let testPie = {
      labels: ['Nature', 'Environment', 'Social', 'Self'],
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
    console.log(cueID)
    console.log(segID)
    console.log(segID.label)
    cueActive.value = segID.label
    if (segID.label === 'Blood') {
      spaceSelect('b6e81d8bed9758b538aa25c13239968813b17f5a')
    } else if (segID.label === 'Hotel1') {
      spaceSelect('6b58a76357424b4a7382f3c891b07db74c8d871a')
    }
  }

  const spaceSelect = (spaceID) => {
    console.log('spaceid' + spaceID)
    storeAI.bentospaceState = !storeAI.bentospaceState
    storeAI.liveBspace = {name: 'blood', spaceid: spaceID}
  }

  const selectWheel = (type) => {
    console.log('wheel' + type)
    wheelType.value = type
  }

</script>

<style scoped>



  @media (min-width: 1024px) {

    #bento-cues {
      display: grid;
      grid-template-columns: 3fr 1fr;
      border: 1px solid green;
    }

    /* four basic quadrants */
    .pie {
      position: relative;
    }

  }

</style>