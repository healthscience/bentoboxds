<template>
  <div id="cues-holistic">
    <button class="cue-select-btn" id="simple-wheel" @click="selectCue('simple')" v-bind:class="{ active: wheelType === 'simple' }">Holistic</button>
    <button class="cue-select-btn" id="simple-segments" @click="selectCue('segments')" v-bind:class="{ active: wheelType === 'segments' }">Segments</button>
    <button class="cue-select-btn" id="simple-segments" @click="selectCue('aging')" v-bind:class="{ active: wheelType === 'aging' }">Longevity</button>
  </div>
  <div v-if="pathListlive === true" id="story-list">
    <header>List of saved stories</header>
    <div v-for="storyi of livePathlist" :key="storyi.id" :value="storyi">
      <div class="story-list-live">
        {{ storyi }}
        <button @click.prevent="viewPath(storyi)" class="button is-primary">view</button>
       </div>
    </div>
  </div>
  <div id="view-cues">
    <div class="pie" v-if="cueType === 'simple'">
      <pie-chartcues :cueType="'simple'" :chartData="cuesHolistic" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
    </div>
    <div class="pie-segments" v-if="cueType === 'segments'">
      <pie-chartcues :cueType="'segments'" :chartData="cuesSegments" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
    </div>
    <div class="pie-segments" v-if="cueType === 'aging'">
      <pie-chartcues :cueType="'aging'" :chartData="cuesData" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
      Source: <a href="https://peterattiamd.com/the-challenges-of-defining-aging/" target="_blank">All marks of aging</a>
    </div>
  </div>
  <div id="bentopath-cues" v-if="pathCues === true">
    cues experience
    <div class="stage-comptypes" v-for="ctype in stagesLive.stages">
      <pie-chartcues v-if="ctype.stagetype.id === 4" :chartData="cuesHolistic"></pie-chartcues>
      <beebee-ai v-if="ctype.stagetype.id === 5" :prompt="ctype"></beebee-ai>
      <pie-chartcues v-if="ctype.stagetypetwo.id === 4" :chartData="cuesHolistic"></pie-chartcues>
      <beebee-ai v-if="ctype.stagetypetwo.id === 5" :prompt="ctype"></beebee-ai>
    </div>
  </div>
  <div id="cue-bentobox">
    Expand cue:  {{ cueActive }}
    <div id="cue-type" v-if="cueActive === 'segdown'">
      <pie-chartcues v-if="liveDoughData" :chartData="liveDoughData" :options="{}" @segmentClick="cueSelect" ></pie-chartcues>
    </div>
    <div id="cue-type" v-if="cueActive === 'Movement'">
      <pie-chartcues :chartData="cuesBody" :options="{}" @segmentClick="cueSelect" ></pie-chartcues>
    </div>
    <div id="cue-type" v-if="cueActive === 'Buildings'">
      <pie-chartcues :chartData="cuesBuilding" :options="{}" @segmentClick="cueSelect" ></pie-chartcues>
    </div>
    <div id="cue-type" v-if="cueActive === 'Climate/weather'">
      <pie-chartcues :chartData="cuesNature" :options="{}" @segmentClick="cueSelect" ></pie-chartcues>
    </div>
  </div>
</template>

<script setup>
import BeebeeAi from '@/components/beebeehelp/inputBox.vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { ref, computed, nextTick, reactive } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'

  const storeCues = cuesStore()

  let cueType = ref('')
  let pathCues = ref(false)
  let stagesLive = ref([])
  let wheelType = ref('')
  let cueActive = ref('')

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

  const cuesSelection = computed(() => {
    return storeCues.activeCueSegment
  })


  const cuesHolistic = computed(() => {
    return storeCues.hopCues
  })

  const cuesSegments = computed(() => {
    return storeCues.cuesSegments
  })

  const cuesNature = computed(() => {
    return storeCues.natureBoundries
  })

  const cuesEnvironment = computed(() => {
    return storeCues.cuesEnvironment
  })

  const cuesCulture = computed(() => {
    return storeCues.cuesCulture
  })

  const cuesLife = computed(() => {
    return storeCues.cuesLife
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
    return storeCues.longevityCues
  })

  const liveDoughData = computed(() => {
    return storeCues.activeDougnnutData
  })

  /* methods */
  const selectCue = (type) => {
    console.log('wheel' + type)
    cueType.value = type
  }

  const cueSelect = async (segType, segInfo) => {
    console.log('event from cue seg')
    // match seg to data set
    cueActive.value = 'segdown'
    if (segInfo.label === 'Nature') {
      storeCues.activeDougnnutData = cuesNature
    } else if (segInfo.label === 'Environment') {
      storeCues.activeDougnnutData = cuesNature
    } else if (segInfo.label === 'Culture') {
      storeCues.activeDougnnutData = cuesNature
    } else if (segInfo.label === 'Life') {
      storeCues.activeDougnnutData = cuesLife
    }
  }

  const viewPath = (vs) => {
    console.log(vs)
    // match to cue
    let livePath = storeCues.pathRefContracts[vs]
    console.log(livePath)
    stagesLive = livePath
    // go through stages and present stage1
    // storeCues.pathListActive = false
    pathCues.value = !pathCues.value
  }


</script>

<style scoped>
#story-list {
  border: 1px solid lightgrey;
  margin: 1em;
}



</style>