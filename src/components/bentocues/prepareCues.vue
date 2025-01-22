<template>
  <!-- list of active cue wheels made per account -->
  <div id="saved-cues" v-if="cuesNetworkList.length > 0">
    <div class="network-cues" v-for="ncue of cuesNetworkList" :value="ncue">
      <button class="cue-item" @click="viewCue(ncue.key, ncue)">{{ ncue.value.concept.name }}</button>
    </div>
  </div>
  <!--start sync option -->
  <div id="sync-cues" v-else>
    <div id="sync-message">
      Sync <a href="#" @click="gaiaSyncStart()">Gaia cues</a> or create new cues
    </div>
  </div>
  <!-- default wheels holistic segments haulmarks aging -->
  <div id="view-cues" v-if="cueActive !== 'concept'">
    <div class="pie" v-if="cueType === 'simple'">
      <pie-chartcues :cueType="'simple'" :chartData="cuesHolistic" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
    </div>
  </div>
  <div id="cue-bentobox" v-if="cueActive === 'concept'">
    <!-- produce cue wheel based on active cue -->
    <pie-chartcues v-if="Object.keys(liveDoughData).length > 0" :chartData="liveDoughData" :options="{}" @segmentClick="cueSegSelect" ></pie-chartcues>
    <div id="relationship-glue" v-if="cueSelectrel === false">
      <div id="beebee-rel">
        <div id="connection-glue">
          <button @click="glueType('down')">Down</button>
          <button @click="glueType('up')">Up</button>
          <button @click="glueType('equal')">Equal</button>
          <button @click="glueType('measure')">Measure</button>
          <button @click="glueType('unknown')">Unknown</button>
          <button @click="glueType('compute')">Compute</button>
        </div>
        <!--markers for this cue? -->
        <div id="cue-markers" v-if="markerContext.length > 0">
          <div class="marker-button-item" v-for="mark in markerContext">
           <button class="marker-button" @click="viewMarker(mark)">{{ mark[0].type }}</button>
          </div> 
        </div>
        <div id="beebee-feedback">
          {{ beebeeFeedback }}
        </div>
      </div>
    </div>
    <div id="remove-cue">
      <button id="remove-cue-delete" @click="removeCue()">Delete</button>
      <button id="view-cue-button" @click="bentoSpaceOpen()">View</button>
    </div>
  </div>
</template>

<script setup>
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { ref, computed } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let cueType = ref('')
  let cueSelectrel = ref(false)
  let cueActive = ref('')

  /* cumputed */
  const beebeeFeedback = computed(() => {
    return storeAI.cuesFeedback
  })

  const cuesHolistic = computed(() => {
    return storeCues.hopCues
  })

  const cuesNetworkList = computed(() => {
    return storeCues.cuesList
  })

  const markerContext = computed(() => {
    return storeCues.cueMatchMarkersLive
  })

  const liveDoughData = computed(() => {
    return storeCues.activeDougnnutData
  })


  /* methods */
  const gaiaSyncStart = () => {
    // inform library to prepare gaia datatype contracts
    storeCues.prepareGaia()
  }

  const viewCue = (cueKey, cueR) => {
    // reset any context
    storeCues.cueMatchMarkersLive = [] 
    cueActive.value = 'concept'
    storeCues.activeCue = cueKey
    storeCues.activeDougnnutData = storeCues.cueDisplayBuilder(cueKey, cueR, {})
    // check in other context e.g. flake
    storeCues.glueRelActive = ''
    storeCues.checkCueContext()
  }

  const bentoSpaceOpen = (spaceID) => {
    storeAI.beebeeContext = 'cue'
    storeAI.bentospaceState = !storeAI.bentospaceState
    // mmach to contract and form space structure
    let cueContract = {}
    for (let cue of storeCues.cuesList) {
      if (cue.key === storeCues.activeCue) {
        cueContract = cue
      }  
    }
    storeAI.liveBspace = {
      name: cueContract.value.concept.name, cueid: storeCues.activeCue,
      gluedown: 'down',
      active: false,
      expand: false
    }
    storeBentobox.spaceList.push(storeCues.activeCue)
  }

  const removeCue = () => {
    // delete cue
    let liveCuesUpdate = []
    for (let cl of storeCues.cuesList) {
      if (cl.key !== storeCues.activeCue) {
        liveCuesUpdate.push(cl)
      }
    }
    storeCues.cuesList = liveCuesUpdate
    // remove wheel data
    storeCues.activeDougnnutData = {}
    // message to HOP to delete cue
    let cueMessage = {}
    cueMessage.type = 'library'
    cueMessage.reftype = 'cue-history'
    cueMessage.action = 'cues'
    cueMessage.task = 'DEL'
    cueMessage.privacy = 'private'
    cueMessage.data = { cueid: storeCues.activeCue }
    cueMessage.bbid = ''
    storeAI.sendMessageHOP(cueMessage)
  }

  const cueSelect = async (segType, segInfo) => {
    cueSelectrel.value = !cueSelectrel.value
    // match seg to data set
    // what relationships for this cue?
    cueActive.value = 'concept'
  }

  const cueSegSelect = async (segType, segInfo) => {
    // match seg to cue contract
    let matchCue = storeCues.matchCueContractLabel(segInfo)
    storeCues.activeCue = matchCue.key
    storeCues.activeDougnnutData = storeCues.cueDisplayBuilder(matchCue.key, matchCue, {})
    // what relationships for this cue?
    cueActive.value = 'concept'

  }

  const glueType = (glueType) => {
    storeCues.cueGluePrepare(glueType)
  }

</script>


<style scoped>

.network-cues{
  display: inline-block;
  margin-top: 1em;
  margin-right: .8em;
}

#sync-message {
  margin: 2em;
}

#saved-cues {
  margin: 2em;
}

#cue-bentobox {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 2em;

}

#relationship-glue {
  border: 0px solid lightblue;
}

#cue-markers {
  margin: 2em;
}

.marker-button-item {
  margin-bottom: .5em;
}

@media (min-width: 1024px) {


}

</style>