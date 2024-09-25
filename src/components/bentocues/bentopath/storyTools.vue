<template>
  <div class="bento-path">bpath
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
          <ul>
            <li class="tools-stage">
              <a @click.prevent="listStory" href="" class="story-button">list</a>
            </li>
            <li class="tools-stage">
              <a @click.prevent="newStory" href="" class="story-button">new</a>
            </li>
            <li class="tools-story">
              Record</li>
            <li>
              <button @click.prevent="startStory" class="button is-primary">Play story</button>
            </li>
          </ul>
        </div>
        <div v-if="storyListlive === true" id="story-list">
          <header>List of saved stories</header>
          <ul v-for="storyi of liveStorylist" :key="storyi.id" v-bind:value="storyi">
            <li class="story-list-live">
              {{ storyi.name }}
              <button @click.prevent="viewStory(storyi.id)" class="button is-primary">view</button>
            </li>
          </ul>
        </div>
        <div v-if="stageView === true" id="story-stages-summary">
          Story name: {{ storyName }}
          <ul>
            <li class="tools-stage">
              <a @click.prevent="addStorystage" href="" class="story-button">add</a>
            </li>
          </ul>
          <ul v-for="stagei in storyStages" :key='stagei.id'>
            <li class="story-stage">
              <story-stage :stageID="stagei"></story-stage>
            </li>
          </ul>
          <div class="clearFloat"></div>
        </div>
        <div v-if="viewBuildtools === true" id="new-story-holder">
          <div id="setup-new-story">
            <form id="story-name">
              <label>Story Name</label>
              <input name="query" v-model="storyName" @input="storyNameText" @change="storyNameText">
            </form>
          </div>
          <a @click.prevent="addStorystage" href="" class="story-button">add stage</a>
          <story-buildstage :stageActive="addStageactive"></story-buildstage>
        </div>
        </div>
      </template>
    </story-modal>
  </div>
</template>

<script setup>
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
  let storyName = ref('')
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
    // this.$store.dispatch('actionLivestory', vs)
    for (let sn of liveStorylist) {
      if (sn.id === vs) {
        storyName.value = sn.name
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

  const storyNameText = () => {
    // this.$store.dispatch('actionStoryname', this.storyName)
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
</style>
