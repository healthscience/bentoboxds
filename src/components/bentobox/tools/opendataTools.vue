<template>
  <div id="open-data-tools" v-if="opendataSettingsLive !== false">
    <div id="live-context-datatypes" class="knowledge-item">
      <div id="context-devices" class="live-kelement">
        <header>Devices:</header>
        <label for="devices-select"></label>
        <select class="select-device-id" id="device-mapping-build" v-model="opendataSettings.device">
          <option value="none" >please select</option>
          <option v-for="dev in deviceList">
            <div v-if="dev?.NAME">
              {{ dev.NAME }}
            </div>
            <div v-else>
              {{ dev }}
            </div>
          </option>
        </select>
      </div>
    </div>
    <div id="context-compute" class="knowledge-item">
      <header>Compute:</header>
      <label for="compute-select"></label>
      <select class="select-compute-id" id="compute-mapping-build" v-model="opendataSettings.compute">
        <option value="none" >please select</option>
        <option v-for="compL in computeList">
          {{ compL.value.computational.name }}
        </option>
      </select>
    </div>
    <div id="live-context-datatypes" class="knowledge-item">
      <div class="live-dtitem">
        <header>X-axis</header>
        <div v-if="opendataSettingsLive.xaxis.length > 0">
          <label for="xaxis-select"></label>
          <select class="select-xaxis-id" id="xaxis-mapping-build" v-model="opendataSettings.xaxis">
            <option value="none" selected="">please select</option>
            <option v-for="colpair in opendataSettingsLive.xaxis">
            {{ colpair }}
            </option>
          </select>
        </div>
      </div>
      <div class="live-dtitem">
        <header>Y-axis</header>
        <div v-if="opendataSettingsLive.yaxis.length > 0">
          <label for="yaxis-select"></label>
          <select id="yaxis-mapping-build" v-model="opendataSettings.yaxis" multiple>
            <option value="none" selected="">please select</option>
            <option v-for="colpairy in opendataSettingsLive.yaxis" :value="colpairy">
            {{ colpairy.column }}
            </option>
          </select>
        </div>
      </div>
    </div>
    <div id="live-context-category" class="knowledge-item">
      <header>Category</header>
        <div id="cat-items">
          <label for="category-select"></label>
          <select class="select-category-id" id="category-mapping-build" v-model="opendataSettings.category">
            <option value="please" selected="">Please select</option>
            <option v-for="catL in opendataSettingsLive.category">
              {{ catL.category }}
            </option>
          </select>
        </div>
        <button id="update-open-data" @click="updateOpenDataHOP()">update</button>
        <div v-if="feedback.categories" class="feedback">---</div>
    </div>
    <!--<div id="context-time" class="live-kelement knowledge-item">
      <header>Time Period:</header>
          <div id="time-items">
            <label for="time-select"></label>
            <select class="select-time-id" id="time-mapping-build" v-model="opendataSettings.timeperiod">
              <option value="none" selected="">please select</option>
              <option v-for="t in time">
                {{ t.text }}
              </option>
            </select>
          </div>
        <div v-if="feedback.time" class="feedback">---</div>
    </div>
    <div id="context-resolution" class="live-kelement knowledge-item">
      <header>Resolution:</header>
        <div class="live-item"></div>
          <div id="resolution-items">
            <label for="resolution-select"></label>
            <select class="select-resolution-id" id="resolution-mapping-build" v-model="opendataSettings.resolution">
              <option value="none" selected="">please select</option>
              <option v-for="rs in resolution">
                {{ rs.text }}
              </option>
            </select>
          </div>
    </div>-->
  </div>
</template>

<script setup>
import { ref, computed, shallowRef } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeLibrary = libraryStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let feedback = ref([])
  let opendataSettings = ref( {
      device: {},
      xaxis: '',
      yaxis: [],
      category: ''
    })

  /* props */
  const props = defineProps({
    bboxid: String
  })

  /*  computed */
  const deviceList = computed(() => {
    return storeBentobox.openDataSettings[props.bboxid].devices
  })

  const computeList = computed(() => {
    return storeLibrary.publicLibrary.referenceContracts.compute
  })

  const opendataSettingsLive = computed(() => {
    return storeBentobox.openDataSettings[props.bboxid]
  })

  const resolution = computed(() => {
    let resolutionOptions =  [22, 22, 22]
    return resolutionOptions
  })

  /* methods */
  const updateOpenDataHOP = () => {
    // get the library contracts
    storeAI.prepareLibrarySummary(props.bboxid)
    // no summary if already save  NEED other way to set contect
    // what updates are there moduels?  Device/source, compute, vis controls or settings?
    let moduleUpdate = {}
    let computeChanges = {}
    let selectedDevice = opendataSettings.value.device
    let mutDate = ''
    let tidyOp = true
    // controls
    computeChanges.controls = { xaxis: opendataSettings.value.xaxis, yaxis: opendataSettings.value.yaxis, device: selectedDevice, tidy: tidyOp, category: false }
    computeChanges.settings = { xaxis: opendataSettings.value.xaxis, yaxis: opendataSettings.value.yaxis }
    // keep track of latest controls for other toolbars context
    storeBentobox.openDataControls[props.bboxid] = computeChanges.controls
    // any settings changes?
    moduleUpdate.compute = computeChanges
    // prepare HOPquery
    let HOPcontext = {}
    let entityID = Object.keys(storeAI.boxLibSummary[props.bboxid].data)
    HOPcontext.entityUUID = storeAI.boxLibSummary[props.bboxid].data[entityID[0]].shellID
    HOPcontext.bbid = props.bboxid
    // HOPcontext.modules = storeAI.boxLibSummary[props.bboxid].data[entityID[0]].modules
    HOPcontext.exp = { key: entityID[0], update: storeAI.boxLibSummary[props.bboxid].data }
    HOPcontext.update = {}
    let updateECS = {}
    updateECS.entityUUID = storeAI.boxLibSummary[props.bboxid].data[entityID[0]].shellID
    updateECS.input = 'refUpdate'
    updateECS.modules = storeAI.boxLibSummary[props.bboxid].data[entityID[0]].modules
    updateECS.changes = moduleUpdate
    HOPcontext.update = updateECS
    // close the calendar options and dispay date summary selected
    storeLibrary.updateHOPqueryContracts(HOPcontext)
  }

</script>

<style scoped>


@media (min-width: 1024px) {

  header {
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  #open-data-tools {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    height: 200px;
    background-color: rgb(224, 227, 243);
    z-index: 4;
  }

  .select-device-id {
    width: 120px;
  }

  .knowledge-item {
    border: 1px solid rgb(174, 174, 231);
    padding-left: 2em;
  }

  #yaxis-mapping-build {
    height: 80px;
    overflow-y: scroll;
  }

  #update-open-data {
    margin-top: 4em;
    font-size: 1.2em;
    padding-left: 2em;
    padding-right: 2em;
  }

}

</style>