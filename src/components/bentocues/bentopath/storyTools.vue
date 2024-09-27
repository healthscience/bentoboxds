<template>
  <div class="bento-path">
  <story-modal :show="bentopathStatus" @close="closeModal">
    <template #header>
      <!-- The code below goes into the header slot -->
      <div id="space-modal-header">
        <button
          type="button"
          class="btn-green"
          @click="closeModal"
          aria-label="Close modal"
        >
          Close
        </button>
        <h3>BentoPath</h3>
        <div id="return-modal-close" @click="closeModal">return</div>
      </div>
    </template>
    <template #body>
      <div class="story-tools-holder">
        <div id="story-toolbar">
            <div class="tools-stage">
              <a @click.prevent="listStory" href="" class="story-button">list</a>
            </div>
            <div class="tools-stage">
              <a @click.prevent="newStory" href="" class="story-button">new</a>
            </div>
            <div class="tools-story">
              Record
            </div>
            <div class="play-path">
              <button @click.prevent="startStory" class="button is-primary">Play</button>
            </div>
        </div>
        <div v-if="storyListlive === true" id="story-list">
          <header>List of saved stories</header>pp{{ liveStorylist }}
          <div v-for="storyi of liveStorylist" :key="storyi.id" v-bind:value="storyi">
            <div class="story-list-live">
              {{ storyi.name }}
              <button @click.prevent="viewStory(storyi.id)" class="button is-primary">view</button>
            </div>
          </div>
        </div>
        <div v-if="stageView === true" id="story-stages-summary">
           name: {{ storeCues.pathName }} {{ storyStages }}
            <div class="tools-stage">
              <a @click.prevent="addStorystage" href="" class="story-button">add</a>
            </div>
          <div v-for="stagei in storyStages" :key='stagei.id'>
            <div class="story-stage">ss== {{ stagei }}
              <story-stage :stageID="stagei"></story-stage>
            </div>
          </div>
          <div class="clearFloat"></div>
        </div>
        <div v-if="viewBuildtools === true" id="new-story-holder">
          <div id="setup-new-story">
            <form id="story-name">
              <label>Path name:</label>
              <input name="query" v-model="storeCues.pathName">
            </form>
            <a @click.prevent="addStorystage" href="" class="story-button">add stage</a>
            <story-buildstage :stageActive="addStageactive"></story-buildstage>
            <div id="path-buttons">
              <button @click.prevent="saveBpath" id="complete-path-button">Path complete & save</button>
            </div>
          </div>
        </div>
      </div>
      </template>
      <template #footer>
        <div id="return-modal-close" @click="closeModal">return</div>
      </template>
    </story-modal>
  </div>
</template>

<script setup>
import BeebeeAi from '@/components/beebeehelp/inputBox.vue'
import StoryModal from '@/components/bentocues/bentopath/storyModal.vue'
import StoryBuildstage from '@/components/bentocues/bentopath/buildStage.vue'
import StoryStage from '@/components/bentocues/bentopath/viewStage.vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { ref, computed } from 'vue'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

const props = defineProps({
    solospace: String
  })

  let storyListlive = ref(false)
  let stageView = ref(true)
  let addStageactive = ref(false)
  let viewBuildtools = ref(false)

  /* computed */
  const bentopathStatus = computed(() => {
    return storeCues.bentopathState
  })

  const liveStorylist = computed(() => {
    return storeCues.bentopathLive
  })

  const storyStages = computed(() => {
    return storeCues.bentopathStages
  })
  

  /* methods */
  const listStory = () => {
    storyListlive.value = !storyListlive.value
  }

  const viewStory = (vs) => {
    console.log(vs)
    console.log(liveStorylist.value)
    for (let sn of liveStorylist.value) {
      if (sn.id === vs) {
        storeCues.pathName = sn.name
      }
    }
    storyListlive.value = false
  }

  const newStory = () => {
    viewBuildtools.value = true
    // this.$store.dispatch('actionNewstoryCount')
    // this.$store.dispatch('actionEmptystages')
  }

  const addStorystage = (ev) => {
    // if the build stage tools are not visible make them
    if (viewBuildtools.value === false) {
      viewBuildtools.value = true
    }
    addStageactive.value = !addStageactive.value
  }

  const saveBpath = () => {
    console.log('path complete')
    // save all stage and save to bentostore
    console.log(storeCues.pathName)
    storeCues.pathRefContracts[storeCues.pathName] = storeCues.bentopathStages
    console.log(storeCues.pathRefContracts)
    storeCues.pathName = ''
  }

  const closeModal = () => {
    storeCues.bentopathState = false
    // this.$store.dispatch('actionStoryspace', this.solospace)
  }

</script>

<style scoped>
#story-list {
  border: 1px solid lightgrey;
  margin: 1em;
}
#story-stages-summary {
  border: 1px solid lightgrey;
  margin: 1em;
  min-height: 100px;
}
.story-button {
  margin-right: 0.4em;
}
.clearFloat {
  clear: both;
}

#story-toolbar {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}


#return-modal-close {
  display: grid;
  grid-template-columns: 1fr;
  text-align: right;
}


@media (min-width: 1024px) {

  #space-modal-header {
    display: grid;
    grid-template-columns: 1fr 8fr 1fr;
  }

}
</style>
