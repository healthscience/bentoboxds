<template>
  <div id="ai-interaction">
    <div class="teaching-mode-banner" v-if="storeTeaching.isTeachingMode">
      <div class="teaching-status">
        🎯 Teaching Mode Active - Query: "{{ storeTeaching.currentQuery }}"
        <span class="action-count">({{ storeTeaching.sessionActionCount }} actions logged)</span>
      </div>
    </div>
    <div class="agent-feedback-progress" v-for="agentFeedback of agentProgressUpdate">
      <div class="progress-feedback" v-if="agentFeedback.show === true">
      {{ agentFeedback.feedback }}
      </div>
    </div>
    <div id="upload-summary" v-if="uploadCurrent === true">
      <div class="file-upload-summary" v-for="file of filesUploaded">
          {{ file.name }}
      </div>
    </div>
    <div id="input-tools">
      <form id="ask-ai-form" @submit.prevent="storeAI.beebeeDigest()">
        <textarea 
          id="askinput" 
          v-model="storeAI.askQuestion.text" 
          placeholder="What resonance shall we shape today?"
          @keyup.enter.exact.prevent="storeAI.beebeeDigest()"
        ></textarea>
      </form>
      <button id="natlang-ask" type="submit" v-if="beebeeAIStatus.active === true" @click="storeAI.beebeeDigest()">
        BeeBee
      </button>
      <div id="agent-tools">
        <button class="bbnexus-anchor" @click="openBbNexus" aria-label="Open bbNexus">
          <img class="bbnexus-icon" src="../../assets/bbNexus-icon.png" alt="bbNexus" />
        </button>
        <div id="agent-status" v-bind:class="{ active: agentStatus }" @mouseover="showAgents" @mouseleave="hideAgents">@a</div>
        <div id="agent-list" v-if="modelLoadingStatus === false && agentsActive === true">
          LLM is active
        </div>
        <div id="loading-agent" class="blink_me" v-if="modelLoadingStatus === true">
          Loading
        </div>
      </div>
    </div>
    <bb-nexus-toolbar
      v-if="showBbNexus"
      anchor="bottom-right"
      :initial-open="storeAI.nexusAutoOpen"
      @action="handleNexusAction"
      @close="showBbNexus = false"
    />
    <div id="tool-agents">
      <div id="tools-list">
          <div id="upload-link" class="tool-type" @click="toolAgent('upload')" :class="{ 'active-tool': storeAI.isUploadMode, 'nexus-focus': nexusFocus === 'upload' }">@upload</div>
          <div class="tool-type" @click="toolAgent('library')" :class="{ 'nexus-focus': nexusFocus === 'library' }">@library</div>
          <div class="tool-type" :class="{ 'active-tool': storeTeaching.isTeachingMode }" @click="toolAgent('teaching')">
            {{ storeTeaching.isTeachingMode ? '@teach ✓' : '@teach' }}
          </div>
      </div>
    </div>
    <data-box v-if="dataBoxStatus === true"></data-box>
  </div>
</template>

<script setup>
  import DataBox from '@/components/dataspace/dataBox.vue'
  import BbNexusToolbar from '@/components/nexus/bbNexusToolbar.vue'
import { libraryStore } from '@/stores/libraryStore.js'
import { besearchStore } from '@/stores/besearchStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { teachingStore } from '@/stores/teachingStore.js'
import { ref, computed, watch } from 'vue'

  const storeLibrary = libraryStore()
  const storeAI = aiInterfaceStore()
  const storeTeaching = teachingStore()
  const storeBesearch = besearchStore()

  const props = defineProps({
    prompt: Object,
    chatcontext: String
   })

  let agentsActive = ref(false)
  const showBbNexus = ref(false)
  const nexusFocus = ref(null)
  // For watching the entire object
  /*
  watch(
    () => storeAI.agentProgress,
    (newValue) => {
      console.log('agentProgress changed:', newValue)
      // Your logic here
    },
    { deep: true }
  )

  // For watching a specific property
  const specificProperty = computed(() => storeAI.agentProgress[storeAI.chatAttention])
  watch(
    specificProperty,
    (newValue) => {
      console.log('Specific property changed:', newValue)
      // Your logic here
    },
    { immediate: true }
  ) */

  /* computed */
  const beebeeAIStatus = computed(() => {
    return storeAI.helpchatAsk
  })

  const uploadCurrent = computed(() => {
    return storeLibrary.uploadFileStatus
  })

  const filesUploaded = computed(() => {
    return storeLibrary.fileBundleList
  })

  const agentProgressUpdate = computed(() => {
    if (storeAI.agentProgress[storeAI.chatAttention] !== undefined) {
      let chatFeedback = storeAI.agentProgress[storeAI.chatAttention]
      let feedbackKeys = Object.keys(chatFeedback)
      let agentProgressFeeback = []
      for (let feedAgent of feedbackKeys) {
        if (chatFeedback[feedAgent].show === true) {
          agentProgressFeeback.push(chatFeedback[feedAgent])
        }
      }
      return agentProgressFeeback
    } else {
      return []
    }
  })

  const modelLoadingStatus = computed(() => {
    return storeAI.modelLoading
  })
  const agentStatus = computed(() => { 
    return storeAI.agentStatus
  })

  // a computed ref
  const dataBoxStatus = computed(() => {
    return storeAI.dataBoxStatus
  })

  const teachingModeBackground = computed(() => {
    return storeTeaching.isTeachingMode ? 'rgb(208, 209, 224)' : 'white'
  })

  /* methods */
  const showAgents = () => {
    agentsActive.value = true
  }

  const hideAgents = () => {
    agentsActive.value = false
  }

  const toolAgent = (tool) => {
    storeAI.inputTools.push(tool)
    if (tool === 'upload') {
      storeAI.isUploadMode = true
      storeAI.dataBoxStatus = true
      storeLibrary.uploadStatus = true
      storeLibrary.libraryStatus = false
    } else if (tool === 'library') {
      storeAI.dataBoxStatus = true
      storeAI.uploadStatus = false
      storeLibrary.libraryStatus = true
    } else if (tool === 'teaching') {
      storeAI.dataBoxStatus = false
      storeAI.uploadStatus = false
      storeLibrary.libraryStatus = false

      // Toggle teaching mode
      if (!storeTeaching.isTeachingMode && storeAI.askQuestion.text) {
        // Start teaching session with current query
        storeTeaching.startTeachingSession(storeAI.askQuestion.text)
      } else if (storeTeaching.isTeachingMode) {
        // Complete or cancel teaching session
        if (storeTeaching.sessionActionCount > 0) {
          storeTeaching.completeSession()
        } else {
          storeTeaching.cancelSession()
        }
      } else {
        // No query entered
        alert('Please enter a query before starting teaching mode')
      }
    }
  }

  const openBbNexus = () => {
    storeAI.nexusAutoOpen = true
    showBbNexus.value = !showBbNexus.value
  }

  const handleNexusAction = (action) => {
    console.log('Nexus action:', action)
    if (action === 'besearch:create') {
      storeAI.bentobesearchState = false
      storeBesearch.setNexusContext({ source: 'beebee' })
      storeBesearch.openCreateForm()
      return
    }
    if (action === 'context:library') {
      nexusFocus.value = 'library'
      toolAgent('library')
      return
    }
    if (action === 'data:devices') {
      nexusFocus.value = 'upload'
      toolAgent('upload')
      return
    }
    if (action === 'world:body') {
      storeAI.bentobesearchState = true
      storeBesearch.setNexusWorld('body')
      return
    }
    if (action === 'world:cue') {
      storeAI.bentobesearchState = true
      storeBesearch.setNexusWorld('cues')
      return
    }
    if (action === 'world:earth') {
      storeAI.bentobesearchState = true
      storeBesearch.setNexusWorld('earth')
      return
    }
    if (action === 'context:cues') {
      storeAI.cueAction = 'cues'
      storeAI.bentocuesState = true
      return
    }
    if (action === 'context:space') {
      storeAI.bentospaceState = true
      return
    }
    if (action === 'data:diary') {
      storeAI.bentodiaryState = true
      return
    }
    if (action === 'peers:add' || action === 'peers:share') {
      storeAccount.accountStatus = true
      return
    }
  }

</script>

<style scoped>

#ai-interaction {
  display: grid;
  grid-template-columns: 1fr;
  padding-bottom: 10px;
}

.teaching-mode-banner {
  background-color: #f0f8ff;
  border: 2px solid #4a90e2;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
}

.teaching-status {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.action-count {
  font-size: 12px;
  color: #666;
  margin-left: 10px;
}

.active-tool {
  background-color: #4a90e2;
  color: white;
  border-radius: 4px;
  padding: 2px 6px;
}

#input-tools {
    display: grid;
    grid-template-columns: 1fr;
  }

#askinput {
  font-size: 1.2em;
  height: 3em;
  width: 100%;
  background-color: v-bind(teachingModeBackground);
}

#tool-agents {
  display: grid;
  grid-template-columns: 1fr;
}

#tools-list {
  justify-self: end;
  margin-right: 1em;
  color: rgb(125, 137, 204);
}

.tool-type {
  display: inline-block;
  margin-right: 1em;
  cursor: pointer;
}

.bbnexus-anchor {
  padding: 0;
  border: none;
  background: transparent;
}

.bbnexus-icon {
  width: 20px;
  height: 20px;
  vertical-align: middle;
}

.nexus-focus {
  color: #1e40af;
  font-weight: 600;
}

.active-tool {
  color: blue;
}

  #natlang-ask {
  height: 60px;
  }

  #agent-status {
    color: lightgray;
  }

  #agent-status.active {
    color: rgb(113, 172, 114);
  }

  .blink_me {
    animation: blinker 2s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

@keyframes gentleFlash {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.7; }
}

.progress-feedback {
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  font-size: 1.1em;
  animation: gentleFlash 2s ease-in-out infinite;
}

@media (min-width: 1024px) {
  #ai-interaction {
    display: grid;
    grid-template-columns: 1fr;
  }

  #input-tools {
    display: grid;
    grid-template-columns: 8fr 1fr 1fr;
  }

  #tool-agents {
    display: grid;
    grid-template-columns: 8fr 1fr 1fr;
  }

  #tools-list {
    justify-self: end;
    margin-right: 1em;
    color:  rgb(125, 137, 204);
  }

  .tool-type {
    display: inline-block;
    margin-right: 1em;
    cursor: pointer;
  }

  #askinput {
    font-size: 1.2em;
    padding-left: 1em;
    height: 3em;
    width: 100%;
    opacity: 100%;
    background-color: v-bind(teachingModeBackground);
  }

  #natlang-ask {
    height: auto;
  }

  #agent-status {
    margin-left: .6em;
    color: lightgray;
  }

  #agent-status.active {
    color: rgb(113, 172, 114);
    font-weight: bold;
  }

  .blink_me {
    margin-left: .6em;
    animation: blinker 2s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }

}

</style>
