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
    <div class="pie-segments" v-if="cueType === 'segments'">
      <pie-chartcues :cueType="'segments'" :chartData="cuesSegments" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
    </div>
    <div class="pie-segments" v-if="cueType === 'aging'">
      <pie-chartcues :cueType="'aging'" :chartData="cuesData" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
      Source: <a href="https://peterattiamd.com/the-challenges-of-defining-aging/" target="_blank">All marks of aging</a>
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
          <button @click="glueType('unknown')">Unknown</button>
          <button @click="glueType('compute')">Compute</button>
        </div>
        <div id="beebee-feedback">
          {{ beebeeFeedback }}
        </div>
      </div>
    </div>
    <div id="remove-cue">
      <button id="remove-cue-delete" @click="removeCue()">Delete</button>
    </div>
  </div>
</template>

<script setup>
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { ref, computed } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()

  let cueType = ref('')
  let cueSelectrel = ref(false)
  let wheelType = ref('')
  let cueActive = ref('')
  let beebeeFeedback = ref('')

  /* cumputed */
  const cuesHolistic = computed(() => {
    return storeCues.hopCues
  })

  const cuesSegments = computed(() => {
    return storeCues.cuesSegments
  })

  const cuesData = computed(() => {
    return storeCues.longevityCues
  })

  const cuesNetworkList = computed(() => {
    return storeCues.cuesList
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
    cueActive.value = 'concept'
    storeCues.activeCue = cueKey
    storeCues.activeDougnnutData = storeCues.cueDisplayBuilder(cueKey, cueR, {})
    // check in other context e.g. flake
    storeCues.glueRelActive = ''
    storeCues.checkCueContext()
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
    let cogGlueDisplay = storeCues.cueGluePrepare(glueType)
    storeCues.activeCueExpanded = cogGlueDisplay.expandedcues
    if (cogGlueDisplay?.wheeldata?.labels.length > 1) {
      storeCues.checkCueContext()
      storeCues.activeDougnnutData = cogGlueDisplay.wheeldata
    }
    beebeeFeedback.value = cogGlueDisplay.feedback
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

@media (min-width: 1024px) {


}

</style>