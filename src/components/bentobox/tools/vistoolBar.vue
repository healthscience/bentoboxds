<template>
  <div id="diy-tools">vis toolbar
    <div id="chart-type">
      <!-- <div class="network-tools">
        <div class="context-network">
          <button @click.prevent="setNetworkgraph('networkview')">{{ network.text }}</button>
        </div>
        <div class="context-network">
          <button @click.prevent="setNetworkmap('mapview')">{{ mapButton.text }}</button>
        </div>
      </div> -->
      <div class="network-tools">
        <calendar-tool></calendar-tool>
      </div>
      <!-- <div class="network-tools">
        <div class="chart-style-tools">
          <li>
            <button @click.prevent="chartSelect()">Bar</button>
          </li>
          <li>
            <button @click.prevent="chartSelect()">Line</button>
          </li>
          <li>
            <button @click.prevent="chartSelect()">Mixed</button>
          </li>
          <div>
            <button @click.prevent="labelsSelect()">Labels</button>
          </div>
        </div>
      </div> -->
      <div class="network-tools" v-if="openDataLive !== undefined">
        <a href="#" id="opendata-space" @click.prevent="openDataToolbar()">{{ openDataLive.text }}</a>
      </div>
    </div>
    <div v-if="openDataLive !== undefined" id="open-knowledge">
      <opendata-tool v-if="openDataLive[mData].active === true" :toolInfo="visToolbarStatusLive"></opendata-tool>
    </div>
    <!-- <div id="social-graph">
      <div id="social-network" v-if="socialState === true && socialgraphActive !== undefined && socialgraphActive.length > 0">
        <div id="network-graph-container">
          <header>SOCAIL GRAPH</header>
          Select Peers
          <ul class="graph-peer" v-for="sg in socialgraphActive" :key="sg.key" v-bind:value="sg.key">
            <li>
              {{ sg }}
            </li>
          </ul>
          <button class="button-past" @click.prevent="setPastNetwork()">Now</button>
          <button class="button-future" @click.prevent="setFutureNetwork()">Future</button>
        </div>
      </div>
    </div>
    <div id="map-network">
      <div id="open-map" v-if="mapState === true && networkMap !== undefined && networkMap.length > 0">
        <div id="network-graph-container">
          <header>MAP</header>
          <ul  v-for="map in networkMap" :key="map.key" v-bind:value="map.key">
            <li class="map-peer">
              {{ map }}
            </li>
          </ul>
        </div>
      </div>
    </div> -->
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

  const storeAccount = accountStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

const props = defineProps({
    bboxid: String
  })

/*  computed */
const openDataLive = computed(() => {
  return storeBentobox.openDatatools[props.bboxid]
})

const visToolbarStatusLive = computed(() => {
  return storeBentobox.vistoolsStatus[props.bboxid]
})



</script>


<style scoped>

#diy-tools {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {

  #diy-tools {
    display: grid;
    grid-template-columns: 1fr;
  }

}

</style>