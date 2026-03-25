<template>
  <div class="besearch-lens-grid">
    <!-- Capacity -->
    <div class="lens-box capacity">
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>capacity</h3>
      </header>
      <div class="variable-list">
        <div v-for="tag in lenses?.capacity" :key="tag" class="variable-tag">
          <button @click="handleCueSpace(tag)">{{ tag }}</button>
        </div>
        <div v-if="!lenses?.capacity?.length" class="empty-state">Initialize...</div>
      </div>
    </div>

    <!-- Context -->
    <div class="lens-box context">
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>context</h3>
      </header>
      
      <div class="context-sections">
        <!-- Knowledge Section -->
        <div class="context-group">
          <h4 class="group-title">Knowledge</h4>
          <div class="variable-list">
            <div v-for="tag in lenses?.context" :key="tag" class="variable-tag">
              <button @click="handleCueSpace(tag)">{{ tag }}</button>
            </div>
            <div v-if="!lenses?.context?.length" class="empty-state">Initialize...</div>
          </div>
        </div>

        <!-- Environment Section -->
        <div class="context-group">
          <h4 class="group-title">Environment</h4>
          <div class="variable-list">
            <div class="empty-state">Initialize...</div>
          </div>
        </div>

        <!-- Earth Section -->
        <div class="context-group">
          <h4 class="group-title">Earth</h4>
          <div class="variable-list">
            <div class="empty-state">Initialize...</div>
          </div>
        </div>
      </div>

      <div class="lens-actions">
        <button class="add-cue-btn" @click="addCueLifestap('context')">+ add a cue</button>
      </div>
    </div>

    <!-- Coherence -->
    <div class="lens-box coherence">
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>coherence</h3>
      </header>
      <div class="whole-resonance">
        <MiniWhole @click="handleWholeExpand()"></MiniWhole>
      </div>
      <!--<div class="variable-list">
        <div v-for="tag in lenses.coherence" :key="tag" class="variable-tag">
          <button @click="handleCueSpace(tag)">{{ tag }}</button>
        </div>
        <div v-if="!lenses.coherence?.length" class="empty-state">Initialize...</div>
      </div>-->
    </div>

    <!-- modals for tools -->
     <BentoSpace></BentoSpace>
     <WholeResonance v-if="wholeResStatus === true"></WholeResonance>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BentoSpace from '@/components/bentospace/spaceTemplate.vue'
import MiniWhole from '@/components/consilience/minWhole.vue'
import WholeResonance from '@/components/consilience/wholeResonance.vue'

import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

const storeCues = cuesStore()
const storeAI = aiInterfaceStore()

const props = defineProps({
  lenses: {
    type: Object,
    default: () => ({ capacity: [], coherence: [], context: [] })
  }
});

/* computed */
  const wholeResStatus = computed(() => storeAI.bentoflakeState)

/* methods */
const handleCueSpace = (spaceID) => {
  // does this cue exist in library?
  let lookupLibrarCue = {} // storeCues.queryLibrary(spaceID)
  let context = 'new' //  temp fix
  if (lookupLibrarCue) {
    // prepare chat for space
    let newChatItem = {}
    newChatItem.name = spaceID.name
    newChatItem.chatid = spaceID.cueid
    newChatItem.active = true
    //setup chat history holder
    storeAI.setupChatHistory(newChatItem)
    storeAI.chatAttention = spaceID.cueid
    // temp  if history cue the make stucture for space
    if (context === 'history') {
      storeAI.liveBspace = {
        name: spaceID.value.concept.name,
        spaceid: spaceID.key,
        cueid: spaceID.key,
        gluedown: 'down',
        active: true,
        expand: true
      }
      spaceID.name = spaceID.value.concept.name
      spaceID.cueid = spaceID.key
    } else {
      storeAI.liveBspace = spaceID
    }
  } else {
    // new space
  }
  storeCues.cueContext = 'space'
  storeAI.beebeeContext = 'chatspace'
  storeAI.bentospaceState = !storeAI.bentospaceState
}

const addCueLifestap = (lensType) => {
  // open cue modal
  storeAI.cueAction = 'cues'
  storeAI.bentocuesState = true
}

const handleWholeExpand = () => {
  storeCues.liveCueContext = 'flake'
  storeAI.bentoflakeState = !storeAI.bentoflakeState
}

</script>

<style scoped>
.besearch-lens-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 82vw;
  margin: 0 auto;
}

.lens-box {
  padding: 20px;
  border-radius: var(--sov-border-radius);
  border-top: 4px solid #ccc;
  background: transparent;
  transition: opacity 0.3s ease;
}

.capacity, .coherence {
  opacity: 0.6;
}

.context {
  opacity: 1;
  z-index: 1;
}

.capacity { border-top-color: var(--sov-capacity); }
.coherence { border-top-color: var(--sov-coherence); }
.context { border-top-color: var(--sov-context); }

.lens-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.whole-resonance {
  background: white;
  padding: 10px;
  border-radius: 8px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.variable-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  padding: 10px;
  border-radius: 8px;
}

.context-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.context-group {
  border-left: 2px solid rgba(0, 255, 200, 0.1);
  padding: 10px;
  background: white;
  border-radius: 0 8px 8px 0;
}

.group-title {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: var(--sov-accent);
  margin-bottom: 0.8rem;
  letter-spacing: 0.1em;
  font-weight: 800;
  opacity: 0.7;
}

.variable-tag button {
  width: 100%;
  text-align: left;
  padding: 8px 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--sov-text);
  cursor: pointer;
  transition: all 0.2s;
}

.variable-tag button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: currentColor;
}

.capacity .variable-tag button:hover { color: var(--sov-capacity); }
.context .variable-tag button:hover { color: var(--sov-context); }
.coherence .variable-tag button:hover { color: var(--sov-coherence); }

.empty-state {
  font-size: 0.8rem;
  opacity: 0.5;
  font-style: italic;
}

.lens-actions {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.add-cue-btn {
  width: 100%;
  padding: 6px;
  background: transparent;
  border: 1px dashed rgba(255, 255, 255, 0.2);
  color: var(--sov-text);
  font-size: 0.8rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.add-cue-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--sov-context);
}
</style>
