<template>
  <div id="life-dialogue">
    <div id="chatspace-modal-header">
      <button
        type="button"
        class="btn-green"
        @click="closeBentoChat"
        aria-label="Close modal"
      >
        Close
      </button>
      <div id="spacechat">CueChat # {{ storeAI.liveBspace.name }}</div>
      <div id="return-modal-close" @click="closeBentoChat">return</div>
    </div>
    <div class="space-chat">
      <div class="context-content">
        <chat-interface :context-filter="{ type: 'chatspace', id: storeAI.liveBspace?.cueid || storeAI.liveBspace?.spaceid }"></chat-interface>
      </div>
    </div>
    <div class="chat-input">
      <input-box></input-box>
    </div>
  </div>
</template>

<script setup>
import ChatInterface from '@/components/beebeehelp/chatInterface.vue'
import inputBox from '@/components/beebeehelp/inputBox.vue'
import { computed, onMounted, onBeforeUnmount } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

const storeAI = aiInterfaceStore()
let previousContext = null

/* computed */
const bentochatStatus = computed(() => {
  return storeAI.bentochatState
})

onMounted(() => {
  previousContext = storeAI.beebeeContext
  storeAI.beebeeContext = 'chatspace'
  // Ensure the space chat is present in the chat menu with timestamps
  const cueId = storeAI.liveBspace?.cueid || storeAI.liveBspace?.spaceid
  const name = storeAI.liveBspace?.name
  if (cueId) {
    storeAI.ensureSpaceChatInMenu(cueId, name)
  }
})

onBeforeUnmount(() => {
  storeAI.beebeeContext = previousContext || 'chat'
})

/* methods */
const closeBentoChat = () => {
  storeAI.bentochatState = !storeAI.bentochatState
}
</script>


<style scoped>

</style>