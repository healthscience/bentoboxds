<template>
  <div id="vis-tools">
    <div class="network-tools">
      <div class="context-network">ng
        <!--<button @click.prevent="setNetworkgraph('networkview')">{{ network.text }}</button>-->
      </div>
      <div class="context-network">nm
        <!--<button @click.prevent="setNetworkmap('mapview')">{{ mapButton.text }}</button>-->
      </div>
    </div>
    <div class="network-tools">
      <calendar-tool></calendar-tool>
    </div>
    <div id="chart-style-tools" class="network-tools">
      <li>
        <button @click.prevent="chartSelect()">Bar</button>
      </li>
      <li>
        <button @click.prevent="chartSelect()">Line</button>
      </li>
      <!--<li>
        <button @click.prevent="chartSelect()">Mixed</button>
      </li>
      <div>
        <button @click.prevent="labelsSelect()">Labels</button>
      </div>-->
    </div>
    <div class="network-tools">
      <button href="#" id="opendata-space" @click.prevent="openDataToolbar()">open data</button>
    </div>
    <div id="update-manual" class="network-tools">
      <button id="update-chart" @click.prevent="updateKbundle($event)">Update</button>
    </div>
  </div>
  <div class="network-tools" v-if="openDataLive !== undefined" id="open-knowledge">
    <opendata-tool v-if="openDataLive.active === true" :toolInfo="visToolbarStatusLive"></opendata-tool>
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

/* methods */
const updateKbundle = () => {
  // prepare update for HOP
  let contextK = {}
  contextK.nxpCNRL = this.shellID
  contextK.moduleCNRL = this.moduleCNRL
  contextK.moduleType = this.moduleType
  contextK.mData = this.mData
  contextK.startperiod = moment(this.calendarvalue).valueOf()
  contextK.startperiodchange = 0
  let rangeSet = []
  if (this.timeRange === undefined) {
    rangeSet = []
  } else {
    rangeSet = this.timeRange
  }
  contextK.rangechange = rangeSet
  // contextK.singlechart = true
  contextK.singlechart = this.selectedChartnumber
  contextK.timeformat = this.selectedTimeFormat
  // check that time is selected
  if (contextK.rangechange.length === undefined || contextK.rangechange.length === 0) {
    let feedbackDevice = {}
    feedbackDevice.device = this.mData
    feedbackDevice.message = 'please select a date'
    this.$store.dispatch('actionFeeback', feedbackDevice)
  } else {
    this.$store.dispatch('actionVisUpdate', contextK)
 }

}

const openDataToolbar = () => {
  console.log('open data')
}

/*  computed */
const openDataLive = computed(() => {
  return storeBentobox.openDatatools[props.bboxid]
})

const visToolbarStatusLive = computed(() => {
  return storeBentobox.vistoolsStatus[props.bboxid]
})

/*

    updateKbundle (cm) {
      // prepare update for safeFLOW
      let contextK = {}
      contextK.nxpCNRL = this.shellID
      contextK.moduleCNRL = this.moduleCNRL
      contextK.moduleType = this.moduleType
      contextK.mData = this.mData
      contextK.startperiod = moment(this.calendarvalue).valueOf()
      contextK.startperiodchange = 0
      let rangeSet = []
      if (this.timeRange === undefined) {
        rangeSet = []
      } else {
        rangeSet = this.timeRange
      }
      contextK.rangechange = rangeSet
      // contextK.singlechart = true
      contextK.singlechart = this.selectedChartnumber
      contextK.timeformat = this.selectedTimeFormat
      // check that time is selected
      if (contextK.rangechange.length === undefined || contextK.rangechange.length === 0) {
        let feedbackDevice = {}
        feedbackDevice.device = this.mData
        feedbackDevice.message = 'please select a date'
        this.$store.dispatch('actionFeeback', feedbackDevice)
      } else {
        this.$store.dispatch('actionVisUpdate', contextK)
      }
    }

    */

</script>


<style scoped>

#vis-tools {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 1024px) {

  #vis-tools {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }

  .network-tools {
    border: 1px solid blue;
  }

}

</style>