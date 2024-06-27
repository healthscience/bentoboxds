<template>
  <div id="vis-tools">
    <div id="grap-map" class="network-tools">
      <div class="context-network">
        <button id="network-graph" @click="viewNetworkGrpah()" v-bind:class="{ active: storeBentobox.networkGraph }">graph</button>
      </div>
      <div class="context-network">
        <button id="network-graph" @click="viewMap()" v-bind:class="{ active: storeBentobox.geoMap }">map</button>
      </div>
    </div>
    <div class="network-tools">
      <calendar-tool :bboxid="props.bboxid"></calendar-tool>
    </div>
    <div class="network-tools">
      <div id="chart-options">
        <div class="chart-calendar-update">
          <select v-model="selectedTimeFormat" @change.prevent="setTimeFormat()">
            <option class="data-vis-action" v-for="tfoption in timeformatoptions" v-bind:value="tfoption.value" :key='tfoption.id' :selected="selectedChartnumber">
            {{ tfoption.text }}
            </option>
          </select>
        </div>
        <div>
          <button class="data-vis-action" @click.prevent="labelsSelect()">Labels</button>
          <button class="data-vis-action" @click.prevent="tidySelect()"  v-bind:class="{ active: tidyData }">Tidy</button>
        </div>
      </div>
    </div>
    <div id="chart-style-tools" class="network-tools">
        <button class="chart-type" @click.prevent="chartSelect()">Bar</button>
        <button class="chart-type" @click.prevent="chartSelect()">Line</button>
        <button class="chart-type" @click.prevent="chartSelect()">Simulation</button>
        <button class="chart-type" @click.prevent="chartSelect()">Table</button>
      <!--<li>
        <button @click.prevent="chartSelect()">Mixed</button>
      </li>
      <div>
        <button @click.prevent="labelsSelect()">Labels</button>
      </div>-->
    </div>
    <div class="network-tools">
      <button href="#" id="opendata-space" @click.prevent="openDataToolbar()"  v-bind:class="{ active: visToolbarStatus }">open data</button>
    </div>
  </div>
  <div class="network-tools" id="open-knowledge">
    <opendata-tool v-if="visToolbarStatus === true" :bboxid="props.bboxid"></opendata-tool>
  </div>
  <!--<div id="feedback-time" v-if="feedbackmessage !== 'clear'" v-bind:class="{ active: feedbackActive }">
    {{ feedbackmessage }}
  </div>-->
</template>

<script setup>

import CalendarTool from '@/components/bentobox/tools/calendarTools.vue'
import OpendataTool from '@/components/bentobox/tools/opendataTools.vue'
import { ref, computed } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { accountStore } from '@/stores/accountStore.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAccount = accountStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  
  const selectedChartnumber = ref('singlechart')
  const tidyData = ref(false)

  const props = defineProps({
    bboxid: String
  })

const timeformatoptions = ref([
  { text: 'Time series', value: 'timeseries', id: 0 },
  { text: 'Overlay', value: 'overlay', id: 1 }
])

const selectedTimeFormat = ref('timeseries')

/* methods */
const openDataToolbar = () => {
  console.log('open toolba r clicke')
 // storeBentobox.boxToolStatus[props.bboxid].opendatatools.active = !storeBentobox.boxToolStatus[props.bboxid].opendatatools.active
 storeBentobox.bbToolbarOpendata[props.bboxid] = !storeBentobox.bbToolbarOpendata[props.bboxid]
 storeAI.prepareLibrarySummary(props.bboxid)
}

const viewNetworkGrpah = () => {
  storeBentobox.networkGraph = !storeBentobox.networkGraph
}

const viewMap = () => {
  storeBentobox.geoMap = !storeBentobox.geoMap
}

const setTimeFormat = () => {
  console.log('set time format')
}

const labelsSelect = () => {
  // this.liveData.data.chartOptions.legend.display = !this.liveData.data.chartOptions.legend.display
  let legendContext = {}
  legendContext.shellID = '' // this.shellID
  legendContext.moduleCNRL = '' // this.moduleCNRL
  legendContext.moduleType = '' // this.moduleType
  legendContext.mData = '' // his.mData
  // this.$store.dispatch('actionLegendStatus', legendContext)
}

const tidySelect = () => {
  tidyData.value = !tidyData.value
  // get the modules to update HOPquery
  storeAI.prepareLibrarySummary(props.bboxid)
  console.log('exsting HOPquery')
  let entityID = Object.keys(storeAI.boxLibSummary[props.bboxid].data)
  console.log(entityID)
  console.log(props.bboxid)
  // match box to HOPid
  let matchHOPid = ''
  for (let hpbid of storeAI.bbidHOPid) {
    if (hpbid.bbid === props.bboxid) {
      matchHOPid = hpbid.HOPid
    }
  }
  // console.log(storeLibrary.peerExperimentList)
  console.log(matchHOPid)
  console.log(storeAI.hopSummary)
  console.log(storeAI.hopSummary)
  let existingNXP = {}
  for (let summaryMatch of storeAI.hopSummary) {
    if (summaryMatch.HOPid === matchHOPid) {
      existingNXP = summaryMatch.summary
    }
  }
  console.log(existingNXP.data)
  console.log(Object.keys(existingNXP.data))
  let expID = Object.keys(existingNXP.data)
  // prepare structure for updates
  // any settings changes?
  let moduleUpdate = {}
  let computeChanges = { controls: { tidy: tidyData.value } }
  moduleUpdate['compute'] = computeChanges
  // prepare HOPquery
  let HOPcontext = {}
  HOPcontext.entityUUID = matchHOPid
  HOPcontext.bbid = props.bboxid
  HOPcontext.exp = { key: matchHOPid, update: existingNXP.data }
  HOPcontext.update = {}
  let updateECS = {}
  updateECS.entityUUID = matchHOPid
  updateECS.input = 'refUpdate'
  updateECS.modules = existingNXP.data[expID].modules
  updateECS.changes = moduleUpdate
  HOPcontext.update = updateECS
  storeLibrary.updateHOPqueryContracts(HOPcontext)
}

const chartSelect = () => {
  console.log('char ttype')
}

/*  computed */
const boxSettings = computed(() => {
  return storeBentobox.boxToolStatus[props.bboxid]
})

const visToolbarStatus = computed(() => {
  return storeBentobox.bbToolbarOpendata[props.bboxid]
})

</script>


<style scoped>

#vis-tools {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  background-color:rgb(224, 227, 243);
  z-index: 12;
}

@media (min-width: 1024px) {

  #vis-tools {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr 1fr 1fr;
  }

  #grap-map {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .network-tools {
    border: 1px solid rgb(171, 171, 227);
  }

  .context-network {
    margin-top: 1em;
    margin-left: 2em;
  }

  .data-vis-action, .chart-calendar-update {
    margin-left: 10px;
  }

  .active {
    background-color: rgb(113, 172, 114);
    border: 1px solid green;
  }
}

</style>