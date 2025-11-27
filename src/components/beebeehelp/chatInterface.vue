<template>
  <div id="chat-interface">
    <welcome-beebee v-if="beginChat === false"></welcome-beebee>
    <div id="natlang-ai">
      <div id="conversation">
        <div v-for="(message, index) in chatHistory" :key="index">
          <!-- Peer message -->
          <div v-if="message.type === 'peer'" class="peer-message">
            <peer-message
              :message="message"
              :timestamp="message.timestamp"
              :bboxid="message.bboxid"
              :tools="message.metadata?.tools || message.tools"
            ></peer-message>
          </div>

          <!-- AI message with streaming support -->
          <div v-else-if="message.type === 'agent'" class="ai-message">
            <!-- Show loading indicator if message is pending -->
            <div v-if="message.status === 'pending'" class="ai-loading">
              <img class="loading-beebee" src="../../../assets/logo.png" alt="bbAI">
              <div class="loading-content">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span class="loading-text">beebee is shaping a reply...</span>
              </div>
            </div>
            <!-- Show streaming indicator if message is streaming but empty -->
            <div v-else-if="message.status === 'streaming' && !message.content" class="ai-loading">
              <img class="loading-beebee" src="../../../assets/logo.png" alt="bbAI">
              <div class="loading-content">
                <div class="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <span class="loading-text">beebee is shaping a reply...</span>
              </div>
            </div>
            <!-- Show actual message content -->
            <agent-message
              v-else
              :message="message.content"
              :timestamp="message.timestamp"
              :bboxid="message.bboxid"
              :status="message.status"
              :message-type="message.messageType"
              :metadata="message.metadata"
            ></agent-message>
            <div v-if="message.status === 'streaming' && message.content" class="streaming-indicator">...</div>
          </div>

          <!-- System message -->
          <div v-else-if="message.type === 'system'" class="system-message">
            <system-message
              :message="message.content"
              :timestamp="message.timestamp"
            ></system-message>
          </div>
        </div>
      </div>
      <div id="buttommove" ref="targetId">{{ updateBottom }}</div>
    </div>
    <div class="chat-input" v-if="!contextFilter">
      <input-box></input-box>
    </div>
  </div>
</template>

<script setup>
import WelcomeBeebee from '@/components/beebeehelp/welcomeBeebee.vue'
import inputBox from '@/components/beebeehelp/inputBox.vue'
import PeerMessage from '@/components/beebeehelp/messages/peerMessage.vue'
import AgentMessage from '@/components/beebeehelp/messages/AIMessage.vue'
import SystemMessage from '@/components/beebeehelp/messages/systemMessage.vue'
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { useChatStore } from '@/stores/chatStore.js'

const props = defineProps({
  contextFilter: { type: String, default: null }
})

const storeAI = aiInterfaceStore()
const storeLibrary = libraryStore()
const chatStore = useChatStore()

/* computed */
const libraryAvailable = computed(() => {
  if (Object.keys(storeLibrary.publicLibrary).length > 0) {
    return storeLibrary.publicLibrary.referenceContracts[storeLibrary.moduleNxpActive]
  } else {
    return []
  }
})

const chatPairs = computed(() => {
  return chatStore.chatPairs
})

const chatHistory = computed(() => {
  const all = chatStore.chatHistory
  if (props.contextFilter) {
    return all.filter(m => (m.context || m.metadata?.context || null) === props.contextFilter)
  }
  return all
})

const chatAsk = computed(() => {
  return chatStore.chatAsk
})

const aiResponse = computed(() => {
  return chatStore.aiResponse
})

const beginChat = computed(() => {
  return chatStore.beginChat
})

const bottom = ref(null)

/** subscribed to events */
// Add a subscribe method to the actions
const handleUpdate = (mutation, state) => {
  chatStore.handleIncomingMessage(mutation, state)
}

storeAI.subscribe(handleUpdate)

// Unsubscribe when the component is unmounted
onUnmounted(() => {
  storeAI.unsubscribe(handleUpdate)
})

/** computed */
const updateBottom = computed(() => {
  return chatStore.updateBottom
})

const targetId = ref(null)

// Watch for changes in chat history to auto-scroll
watch(chatHistory, () => {
  nextTick(() => {
    const conversation = document.getElementById('conversation')
    if (conversation) {
      conversation.scrollTop = conversation.scrollHeight
    }
  })
}, { deep: true })

// Function to handle incoming messages
const handleIncomingMessage = (message) => {
  // Update the chat store with the new message
  chatStore.handleIncomingMessage(message)

  // Scroll to the bottom of the conversation
  nextTick(() => {
    const conversation = document.getElementById('conversation')
    if (conversation) {
      conversation.scrollTop = conversation.scrollHeight
    }
  })
}

// Expose the handleIncomingMessage function to the template if needed
defineExpose({
  handleIncomingMessage
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#chat-interface {
  display: grid;
  height: 75vh;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
}

#natlang-ai {
  display: block;
  border: 1px solid grey;
  padding: 1em;
  border-radius: 1em;
  height: 60vh;
  overflow-y: scroll;
}

#conversation {
  display: block;
  min-height: 100px;
}

.message-container {
  margin-bottom: 1em;
}

.peer-message {
  text-align: right;
  margin-left: 20%;
}

.ai-message {
  text-align: left;
  margin-right: 20%;
}

.system-message {
  text-align: center;
  margin: 10px 0;
  color: #6c757d;
  font-size: 0.8em;
}

.streaming-indicator {
  display: inline-block;
  width: 1em;
  text-align: center;
  animation: blink 1s infinite;
}

@keyframes blink {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

.ai-loading {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background-color: #f0f0f0;
  border-radius: 18px;
  margin: 10px 0;
}

.loading-beebee {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.loading-content {
  display: flex;
  align-items: center;
}

.typing-indicator {
  display: flex;
  align-items: center;
  margin-right: 10px;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  background-color: #666;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}

.loading-text {
  color: #666;
  font-size: 0.9em;
}

    .chat-input {
  position: absolute;
  bottom: 10%;
  margin-top: .5em;
  margin-left: 30px;
  width: 80%;
}

#buttommove {
  color: white;
}

@media (min-width: 1024px) {
  #chat-interface {
    display: grid;
    height: 75vh;
    width: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  #natlang-ai {
    display: block;
    width: 100%;
    border: 0px solid grey;
    padding: 1em;
    border-radius: 1em;
    height: 80vh;
    overflow-y: scroll;
  }

  #conversation {
    display: block;
    min-height: 10vh;
    margin-top: 1em;
  }

  .chat-input {
    position: fixed;
    bottom: 20px;
    width: 76%;
    border: 0px solid red;
    z-index: 9;
  }
}
</style>