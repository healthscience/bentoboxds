<template>
  <!-- Two-column grid layout -->
  <div id="library-cues-container">
    <!-- Left Column - Chart and Controls -->
    <div id="chart-column">
      <div id="cue-bentobox" v-if="cueKnowledge === 'concept'">
        <!-- produce cue wheel based on active cue -->
        <div id="cue-wheel">
          <div id="cues-doughnut">
            <pie-chartcues v-if="Object.keys(liveDoughData).length > 0" :chartData="liveDoughData" :options="{}" @segmentClick="cueSegSelect" ></pie-chartcues>
          </div>
          <div id="beebee-feedback">
            {{ beebeeFeedback }}
          </div>
          <div id="cue-history">
            <div id="cue-history-title">
              History
            </div>
            <div class="cue-history-item" v-for="cueH of glueHistoryList">
              <div class="cue-relationship-history" v-if="cueH.type !== undefined">
                <button class="cue-history-button" @click="glueType(cueH.type)">{{ cueH.type }}</button>
              </div>
              <div v-else>
                <button class="cue-history-button" @click="viewCueHistory(cueH.key, cueH)">{{ cueH.data.labels[0] }}</button>
              </div>
            </div>
          </div>
          <div id="remove-cue">
            <button id="view-cue-button" @click="bentoSpaceOpen()">Open Space</button>
          </div>
        </div>
        <!-- cognative glue options -->
        <div id="relationship-glue" v-if="cueSelectrel === false">
          <div id="beebee-rel">
            <div id="connection-glue">
              <button class="glue-btn" :class="{ active: activeGlueType === 'down' }" @click="glueType('down')">Down</button>
              <button class="glue-btn" :class="{ active: activeGlueType === 'up' }" @click="glueType('up')">Up</button>
              <button class="glue-btn" :class="{ active: activeGlueType === 'equal' }" @click="glueType('equal')">Equal</button>
              <button class="glue-btn" :class="{ active: activeGlueType === 'measure' }" @click="glueType('measure')">Measure</button>
              <button class="glue-btn" :class="{ active: activeGlueType === 'unknown' }" @click="glueType('unknown')">Unknown</button>
              <button class="glue-btn" :class="{ active: activeGlueType === 'compute' }" @click="glueType('compute')">Compute</button>
            </div>
          </div>
        </div>
        <!--markers for this cue? -->
        <div id="cue-markers" v-if="markerContext.length > 0 && cueConext !== 'space'">
          <div class="marker-button-item" v-for="mark in markerContext">
            <button class="marker-button" @click="viewMarker(mark)">{{ mark[0].value.concept.name }}</button>
          </div> 
        </div>
      </div>
      <div id="no-cue-selected" v-else>
        <p>Select a cue from the list to explore its relationships.</p>
      </div>
    </div>
    
    <!-- Knowledge cues - Filter and List -->
    <div id="cues-column">
      <div v-if="storeOrrery.isSeeding" class="seeding-status pulse">
        seeding biology knowledge... {{ storeOrrery.seedingProgress }}%
      </div>
      
      <div id="minimise-cues" v-if="minCues === true">
        <!-- a to z and filter -->
        <div id="filter-cues">
          <div class="filter-alphabet">
            <button class="filter-letter" v-for="letter of alaphabestLetters" @click="filterCuesLetter(letter)" v-bind:class="{ active: liveLetter === letter }">{{ letter }}</button>
            <button id="refresh-cues-btn" @click="refreshCues()">refresh</button>
          </div>
        </div>
        
        <div id="saved-cues" v-if="cueConext === 'cueall' && cuesNetworkList.length > 0">
          <div id="no-filter" v-if="liveLetter === ''">
            <div class="network-cues" v-for="ncue of cuesNetworkList" :key="ncue.key">
              <button class="cue-item" @click="viewCue(ncue.key, ncue)">{{ ncue.value.concept.name }}</button>
            </div>
          </div>
          <div v-else>
            <div class="network-cues" v-for="ncue of filteredCues" :key="ncue.key">
              <button class="cue-item" @click="viewCue(ncue.key, ncue)">{{ ncue.value.concept.name }}</button>
            </div>
          </div>
        </div>
        
        <div v-else-if="cueConext === 'space'" id="cue-space">
          <button class="cue-item" @click="viewCue(storeAI.liveBspace.spaceid, storeAI.liveBspace)">{{ storeAI.liveBspace.name }}</button>
        </div>
        
        <div id="sync-cues" v-else-if="!storeOrrery.isSeeding">
          <div id="sync-message">
             Seeded biology cues will appear here. Click "Seed public library" above to start.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { ref, computed, onMounted } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { orreryStore } from '@/stores/orreryStore.js'

const storeCues = cuesStore()
const storeAI = aiInterfaceStore()
const storeBentobox = bentoboxStore()
const storeOrrery = orreryStore()
const storeLibrary = libraryStore()

let cueSelectrel = ref(false)
let liveLetter = ref('')
let activeGlueType = ref('')

/* computed */
const cueConext = computed(() => {
  return storeCues.cueContext
})

const glueHistoryList = computed(() => {
  return storeCues.glueHistory
})

const minCues = computed(() => {
  return storeCues.minCuesStatus
})

const cueKnowledge = computed(() => {
  return storeCues.cueKnowledge
})

const beebeeFeedback = computed(() => {
  return storeAI.cuesFeedback
})

const cuesNetworkList = computed(() => {
  const contracts = storeCues.cuesList
  return [...contracts].sort((a, b) => {
    if (a.value.concept.name < b.value.concept.name) return -1
    if (a.value.concept.name > b.value.concept.name) return 1
    return 0
  })
})

const filteredCues = computed(() => {
  return storeCues.cuesListFilter
})

const markerContext = computed(() => {
  return storeCues.cueMatchMarkersLive
})

const liveDoughData = computed(() => {
  return storeCues.activeDougnnutData
})

const alaphabestLetters = computed(() => {
  return 'abcdefghijklmnopqrstuvwxyz'.split('')
})

/* methods */
const refreshCues = () => {
  storeCues.refreshGetCues()
}

const filterCuesLetter = (letter) => {
  if (letter === liveLetter.value) {
    letter = ''
  }
  liveLetter.value = letter
  storeCues.cuesListFilter = storeCues.cuesList.filter(cue => 
    cue.value.concept.name.toLowerCase().charAt(0) === letter.toLowerCase()
  )
}

const viewCue = (cueKey, cueR) => {
  storeCues.updateCueTimestamp(cueKey)
  storeCues.glueHistory = []
  storeCues.cueMatchMarkersLive = [] 
  storeCues.cueKnowledge = 'concept'
  storeCues.activeCue = cueKey
  storeCues.activeDougnnutData = storeCues.cueDisplayBuilder(cueKey, cueR, {})
  storeCues.glueRelActive = ''
  storeCues.checkCueContext()
}

const viewCueHistory = (cueKey, cueH) => {
  storeCues.activeDougnnutData = cueH.data
}

const bentoSpaceOpen = () => {
  storeCues.cueContext = 'space'
  storeAI.beebeeContext = 'chatspace'
  storeAI.bentospaceState = true
  
  let cueContract = storeCues.cuesList.find(cue => cue.key === storeCues.activeCue)
  
  if (cueContract) {
    storeAI.liveBspace = {
      name: cueContract.value.concept.name,
      spaceid: storeCues.activeCue,
      cueid: storeCues.activeCue,
      gluedown: 'down',
      active: false,
      expand: true
    }
  }
  storeAI.chatAttention = storeCues.activeCue
  storeBentobox.spaceList.push(storeCues.activeCue)
  storeCues.cogGlueSpace(storeCues.activeCue)
}

const cueSegSelect = async (segType, segInfo) => {
  let matchCue = storeCues.matchCueContractLabel(segInfo)
  if (matchCue.key) {
    storeCues.activeCue = matchCue.key
    storeCues.activeDougnnutData = storeCues.cueDisplayBuilder(matchCue.key, matchCue, {})
    storeCues.cueKnowledge = 'concept'
  }
}

const glueType = (type) => {
  storeCues.cueGluePrepare(type)
  activeGlueType.value = type
}

const viewMarker = (mid) => {
  // logic for viewing markers if needed
}

onMounted(() => {
  // Reset cue context when entering library
  storeCues.cueContext = 'cueall'
})
</script>

<style scoped>
#library-cues-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  background-color: #fcfcfc;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

#chart-column {
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

#cue-bentobox {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

#cue-wheel {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #eee;
}

#beebee-feedback {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  font-size: 0.9rem;
  min-height: 60px;
}

#relationship-glue {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.glue-btn {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.glue-btn:hover {
  background: #f1f5f9;
}

.glue-btn.active {
  background: var(--sov-accent, #3b82f6);
  color: white;
  border-color: var(--sov-accent, #3b82f6);
}

.filter-alphabet {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 1.5rem;
  justify-content: center;
}

.filter-letter {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.filter-letter.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

#saved-cues {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 0.75rem;
  max-height: 500px;
  overflow-y: auto;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 12px;
  background: white;
}

.cue-item {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  cursor: pointer;
  text-align: center;
  font-size: 0.85rem;
  transition: all 0.2s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cue-item:hover {
  border-color: #3b82f6;
  background: #eff6ff;
  transform: translateY(-2px);
}

.seeding-status {
  padding: 1rem;
  margin-bottom: 1rem;
  background: #eff6ff;
  color: #1d4ed8;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

#refresh-cues-btn {
  padding: 6px 12px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

@media (min-width: 1024px) {
  #library-cues-container {
    grid-template-columns: 1.2fr 1fr;
  }
}
</style>
