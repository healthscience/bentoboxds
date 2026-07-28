<template>
  <div id="conduction-isolated-builder">
    <h3>Isolated Conduction Device Setup</h3>
    <div class="source-form-item">
      <select class="select-source-id" @change="sourceSelect" v-model="fileType">
        <option value="none" disabled selected>Please select source type</option>
        <option value="json">JSON</option>
        <option value="csv">CSV</option>
        <option value="sqlite">SQLite</option>
        <option value="duckdb">DuckDB</option>
        <option value="hyperdrive">Hyperdrive</option>
        <option value="hyperbee">Hyperbee</option>        
      </select>
    </div>

    <!-- Step 1: Upload Radia Payload -->
    <div v-if="uploadStatus === true">
      <upload-space :inline="true" @upload-sent="handleUploadSent"></upload-space>
      <div v-if="fileMatch?.success === true" class="upload-success-message">
        ✅ {{ fileIDoutgoing }} uploaded
      </div>
    </div>

    <!-- Step 2: Parse and Describe Payload Structure -->
    <div v-if="datasourceLive">
      <div id="data-viewer">
          view data sample {{ conductionData }}
          <conduction-data :extractedData="conductionData"></conduction-data>
      </div>
      <!--<conduction-describe />-->
      
       Step 3: Map Discovered Source Keys to exoCue Cues
      <!--<map-cues :requiredCues="activeContractCues" />-->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'
import UploadSpace from '@/components/dataspace/upload/uploadSpace.vue'
import ConductionData from '@/components/library/contracts/contribute/forms/conductiondevice/OverlayDataBuilder.vue'
import ConductionDescribe from './conductionDescribe.vue'
import MapCues from './mapCues.vue'

const storeLibrary = libraryStore()

const fileType = ref('none')
const fileIDoutgoing = ref('')

/* computed */
const datasourceLive = computed(() => storeLibrary.sourceDataSelected)

const uploadStatus = computed(() => {
  return storeLibrary.uploadStatus
})

const conductionData = computed(() => {
  return storeLibrary.conductionOverlay
})


const sourceSelect = () => {
  console.log('source select')
  console.log(fileType.value)
  // set file context to new overlay
  storeLibrary.newFileIntent = 'overlay-data'
  if (fileType.value === 'none') return

  storeLibrary.uploadStatus = true
  storeLibrary.sourceDataSelected = true
  storeLibrary.sourceFiletype = fileType.value
  storeLibrary.newConductionForm.type = fileType.value
  storeLibrary.fileFeedback = []
  
}

const handleUploadSent = (payload) => {
  fileIDoutgoing.value = payload.fileBundle.name
}

const fileMatch = computed(() => {
  let fileSavedMatch = storeLibrary.fileSaveList.find(
    f => f.file.name === fileIDoutgoing.value
  );
  return fileSavedMatch
})

</script>

<style scoped>
#conduction-isolated-builder {
  padding: 1.5em;
  background: #fff;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}
.upload-success-message {
  color: green;
  font-weight: bold;
  margin-top: 10px;
  text-align: center;
}
</style>