<template>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal-chat :show="bentochatStatus" @close="closeBentoChat">
      <template #header>
        <!-- The code below goes into the header slot -->
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
      </template>
      <template #body>
        <div class="space-chat">
          <div class="context-selector">
            <button
              v-for="context in contexts"
              :key="context.value"
              @click="switchContext(context.value)"
              :class="{ active: currentContext === context.value }"
            >
              {{ context.label }}
            </button>
          </div>
          <div class="context-content">
            <component :is="currentContextComponent" :message="currentMessage"></component>
          </div>
        </div>
        <div class="chat-input">
          <input-box :chatcontext="currentContext"></input-box>
        </div>
      </template>
      <template #footer>
      </template>
    </modal-chat>
  </Teleport>
</template>

<script setup>
import ModalChat from '@/components/beebeehelp/chatModal.vue' 
import inputBox from '@/components/beebeehelp/inputBox.vue'
import CuespaceContext from '@/components/beebeehelp/contexts/CuespaceContext.vue'
import GraphContext from '@/components/beebeehelp/contexts/GraphContext.vue'
import ChartContext from '@/components/beebeehelp/contexts/ChartContext.vue'
import SearchContext from '@/components/beebeehelp/contexts/SearchContext.vue'
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { useChatStore } from '@/stores/chatStore.js'

  const storeAI = aiInterfaceStore()
const chatStore = useChatStore()

  /* computed */
  const bentochatStatus = computed(() => {
    return storeAI.bentochatState
  })

/* context management */
const contexts = [
  { value: 'cuespace', label: 'Cuespace' },
  { value: 'graph', label: 'Graph' },
  { value: 'chart', label: 'Chart' },
  { value: 'search', label: 'Search' }
]

const currentContext = ref('cuespace')

const currentContextComponent = computed(() => {
  switch (currentContext.value) {
    case 'cuespace':
      return CuespaceContext
    case 'graph':
      return GraphContext
    case 'chart':
      return ChartContext
    case 'search':
      return SearchContext
    default:
      return CuespaceContext
  }
})

const currentMessage = computed(() => {
  return chatStore.chatPairs
})

const switchContext = (context) => {
  currentContext.value = context
  chatStore.switchContext(context)
}

  /* methods */
  const closeBentoChat = () => {
    storeAI.bentochatState = !storeAI.bentochatState
  }
</script>

<style scoped>
#chatspace-modal-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.btn-green {
  display: inline;
  width: 120px;
}

#spacechat {
  display: inline;
  font-size: 1.2em;
  font-weight: bold;
}

#return-modal-close {
  text-align: right;
}

.space-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.context-selector {
  display: flex;
  justify-content: space-around;
  padding: 1em;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

.context-selector button {
  padding: 0.5em 1em;
  background-color: #e0e0e0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.context-selector button.active {
  background-color: #007bff;
  color: white;
}

.context-content {
  flex: 1;
  padding: 1em;
  overflow-y: auto;
}

  .chat-input {
    position: fixed;
    bottom: 26px;
  }

@media (min-width: 1024px) {
  #chatspace-modal-header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    z-index: 1299;
  }

  .btn-green {
    display: inline;
    width: 120px;
    height: 30px;
  }

  #spacechat {
    display: inline;
    font-size: 1.2em;
    font-weight: bold;
  }

  #return-modal-close {
    text-align: right;
  }

  .chat-input {
    position: fixed;
    bottom: 26px;
  }

  .space-chat {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .context-selector {
    display: flex;
    justify-content: space-around;
    padding: 1em;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ccc;
  }

  .context-selector button {
    padding: 0.5em 1em;
    background-color: #e0e0e0;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .context-selector button.active {
    background-color: #007bff;
    color: white;
  }

  .context-content {
    flex: 1;
    padding: 1em;
    overflow-y: auto;
  }
}
</style>