<template>
  <div class="beebee-reply">
    <span class="right-time">{{ formattedTime }}</span>
    <div class="reply-text-chart">
      <div class="right-chat" v-if="messageData">
        <!-- Simple text message -->
        <div v-if="isSimpleTextMessage" class="ai-text-message">
          {{ messageContent }}
        </div>
        <!-- Complex message types -->
        <div v-else-if="messageData.type !== undefined">
          <tool-message v-if="messageData.type === 'upload' || messageData.type === 'library-peerlibrary' || messageData.action === 'library'" :message="messageData"></tool-message>
          <chart-message v-else-if="messageData.type === 'hopquery' || messageData.type === 'experiment' || messageData.type === 'network-library-n1'" :message="messageData"></chart-message>
          <system-message v-else-if="messageData.action === 'agent-response' || messageData.action === 'hop-learn-feedback'" :message="messageData"></system-message>
          <div v-else-if="messageData.type === 'bbai-reply'">
          <div v-if="message?.action === 'hello'">
            {{ message.data }}
          </div>
          <div v-if="message.data?.type !== 'library-peerlibrary'">
            <div class="beeebee-text">
              {{ message?.data?.text}} - {{ message.data?.type }}
              </div>
              <div v-if="message?.data?.filedata" class="bee-file-data">
                <div class="file-feedback-csv">
                  {{ message.data.filedata.type }} - {{ message.data.filedata.file?.name }} -- {{ message.data.filedata.columns }}
                </div>
                <button id="csv-file-summary" @click="viewSummaryCSV(message.bbid)">view summary</button>
                <csv-preview v-if="storeLibrary.imagepreviewLive !== true && storeLibrary.csvpreviewLive === summaryCSVState" :summarydata="message.data.filedata.grid"></csv-preview>
                <image-preview v-if="storeLibrary.imagepreviewLive === true && summaryCSVState === false" :summaryimagedata="message.data.filedata.grid"></image-preview>
              </div>
              <div v-if="message?.data?.prompt?.length > 0" class="bee-prompt-question">
                {{ message.data.prompt }}
                <!-- if csv file, show column to chart else sql need to select table then columns to chart-->
                <div id="type-data-options" v-if="message?.data?.filedata.type !== 'sqlite'">
                  <div class="data-options"  v-for="(dopt, index) in message?.data?.options">
                    <!-- csv or json format -->
                    <div v-if="typeof dopt === 'string'">
                      <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, message.bbid, message?.data?.options, message?.data?.filedata.size)">
                        {{ dopt }}
                      </button>
                    </div>
                    <div v-else>
                        <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, message.bbid, message?.data?.options )">
                          {{ dopt.name }}
                        </button>
                    </div>
                    <button class="data-option-select" :class="{ active: index === isDateColumn }" @click.prevent="dateOptionSelect(index, dopt, message.bbid)">date</button>
                  </div>
                </div>
                <div v-else> <!-- sqlite data structure -->
                  <describe-datastructure :bboxid="message.bbid" :fileTypeIn="message?.data?.filedata.type"></describe-datastructure>
                  <div class="data-options"  v-for="(dopt, index) in storeLibrary.newDatafile.columns">
                    <div v-if="typeof dopt === 'string'">
                      <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, message.bbid, message?.data?.options )">
                        {{ dopt }}
                      </button>
                    </div>
                    <div v-else>
                        <button class="data-option-select" @click.prevent="dataOptionVis(index, dopt, message.bbid)">
                          {{ dopt.name }}
                        </button>
                    </div>
                    <button class="data-option-select" :class="{ active: index === isDateColumn }" @click.prevent="dateOptionSelect(index, dopt, message.bbid)">date</button>
                  </div>
                  <div id="further-filter">Want to further filter the data query?  Select a column</div>
                  <div class="data-options"  v-for="(dopt, index) in storeLibrary.newDatafile.columns">
                    <div v-if="typeof dopt === 'string'">
                      <button class="data-option-select" @click.prevent="dataOptionFilter(index, dopt, message.bbid)">
                        {{ dopt }}
                      </button>
                    </div>
                    <div v-else>
                        <button class="data-option-select" @click.prevent="dataOptionFilter(index, dopt, message.bbid)">
                          {{ dopt.name }}
                        </button>
                    </div>
                  </div>
                  <div id="filter-options" v-if="filterActive === true">filter
                    <describe-devicestructure :bboxid="message.bbid" :fileTypeIn="message?.data?.filedata.type" @device-filter="filterdeviceEvent()" @device-id="choicedeviceEvent()"></describe-devicestructure>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
      <chart-message v-else :message="message"></chart-message>
    </div>
    <div class="beebee">
      <img class="right-chat-beebee" src="../../../assets/logo.png" alt="bbAI">
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { useChatStore } from '@/stores/chatStore.js'
import CsvPreview from '@/components/dataspace/upload/csvPreview.vue'
import ImagePreview from '@/components/dataspace/upload/imagePreview.vue'
import DescribeDatastructure from '@/components/library/contracts/contribute/forms/packaging/describeSourceStructure.vue'
import DescribeDevicestructure from '@/components/library/contracts/contribute/forms/packaging/describeDeviceStructure.vue'
import ToolMessage from '@/components/beebeehelp/messages/ToolMessage.vue'
import ChartMessage from '@/components/beebeehelp/messages/ChartMessage.vue'
import SystemMessage from '@/components/beebeehelp/messages/SystemMessage.vue'

const props = defineProps({
  message: [String, Object],
  timestamp: Date,
  bboxid: String,
  status: String,
  messageType: String,
  metadata: Object
})

const messageData = computed(() => {
  if (typeof props.message === 'string') {
    return { content: props.message }
  }
  return props.message || {}
})

const messageContent = computed(() => {
  if (typeof props.message === 'string') {
    return props.message
  }
  if (props.message && typeof props.message === 'object') {
    return props.message.content || props.message.text || props.message.data?.text || ''
  }
  return ''
})

const isSimpleTextMessage = computed(() => {
  return typeof props.message === 'string' || 
         (props.message && !props.message.type && !props.message.action)
})

const formattedTime = computed(() => {
  if (props.timestamp) {
    const date = new Date(props.timestamp)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return ''
})


const storeAI = aiInterfaceStore()
const storeLibrary = libraryStore()
const chatStore = useChatStore()

let columnFilter = ref('')
let deviceFilter = ref('')
let columnLive = ref('')
let datecolLive = ref('')
let bbidLive = ref('')
let isDateColumn = ref(0)
let filterActive = ref(false)
let summaryCSVState = ref(false)

const viewSummaryCSV = (bbid) => {
  chatStore.viewSummaryCSV(bbid)
}

const dataOptionVis = (did, colName, bbid, options, size) => {
  chatStore.dataOptionVis(did, colName, bbid, options, size)
}
const dataOptionFilter = (did, colName, bbid) => {
  chatStore.dataOptionFilter(did, colName, bbid)
}

const dateOptionSelect = (did, colName, bbid) => {
  chatStore.dateOptionSelect(did, colName, bbid)
}

const filterdeviceEvent = () => {
  chatStore.filterdeviceEvent()
}
const choicedeviceEvent = () => {
  chatStore.choicedeviceEvent()
}
</script>

<style scoped>
.beebee-reply {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  background-color: #d8d7e2;
  width: 90%;
  border-radius: 25px;
  margin-top: .5em;
  margin-left: 40px;
}

.right-chat-beebee {
  width: 50px;
}

.right-time {
  color: blue;
  font-size: 0.8em;
}

.right-chat {
  padding-top: 1em;
  display: block;
}

.beebee {
  display: grid;
  justify-self: end;
}

.networkactive {
  background-color: rgb(227, 243, 218);
}

.active {
  border: 2px solid orange;
  background-color: antiquewhite;
}

.data-options {
  display: grid;
  grid-template-columns: 8fr 1fr;
}

.data-option-select {
  display: inline-block;
  padding: 0.25em;
  margin-bottom: 0.6em;
  width: 100%;
}

.date-option-select {
  display: inline-block;
  padding: 0.25em;
  margin-bottom: 0.6em;
}

.active {
  background-color: rgb(113, 172, 114);
}

.file-feedback-csv {
  display: grid;
  grid-template-columns: 1fr;
}

.ai-text-message {
  padding: 10px 15px;
  background-color: #f8f8f8;
  border-radius: 18px;
  margin: 5px 0;
  word-wrap: break-word;
}
</style>