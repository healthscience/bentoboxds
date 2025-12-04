<template>
  <div id="chat-interface">
    <welcome-beebee v-if="beginChat === false && (!props.contextFilter || (typeof props.contextFilter==='string' && props.contextFilter==='chat'))"></welcome-beebee>
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

          <!-- Agent/AI message: render content and support streaming -->
          <div v-else-if="message.type === 'agent' || message.type === 'agent-reply'" class="ai-message">
            <!-- Optional loading indicator for pending -->
            <div v-if="message.status === 'pending' && !message.content" class="ai-loading">
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
            <!-- Actual message (streaming or complete) -->
            <agent-message
              :message="message.type === 'agent-reply' ? (message.data || message.content) : message.content"
              :timestamp="message.timestamp"
              :bboxid="message.bboxid || message.bbid"
              :status="message.status"
              :messageType="message.type === 'agent' ? 'agent' :
               message.messageType === 'bentobox' ? 'bentobox' :
               message.messageType || (message.data && message.data.type) || 'text'"
              :metadata="message.metadata"
            />
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
    <div class="chat-input" v-if="contextFilter === 'chat'">
      <input-box></input-box>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import WelcomeBeebee from '@/components/beebeehelp/welcomeBeebee.vue'
import inputBox from '@/components/beebeehelp/inputBox.vue'
import PeerMessage from '@/components/beebeehelp/messages/peerMessage.vue'
import AgentMessage from '@/components/beebeehelp/messages/AgentMessage.vue'
import SystemMessage from '@/components/beebeehelp/messages/systemMessage.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { useChatStore } from '@/stores/chatStore.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

const props = defineProps({
  contextFilter: { type: [String, Object], default: null }
})


const storeBentobox = bentoboxStore()

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
  const f = props.contextFilter
  if (!f) return all

  if (typeof f === 'string') {
    return all.filter(m => {
      const ctx = m.context || m.metadata?.context
      if (!ctx) return false
      if (f === 'chat') {
        if (typeof ctx === 'string') return ctx === 'chat'
        const attention = storeAI.chatAttention
        if (ctx.type === 'chatspace' && (ctx.id === attention || ctx.cueid === attention)) return true
        return false
      }
      return (typeof ctx === 'string') ? ctx === f : (ctx.type === f)
    })
  }

  if (typeof f === 'object') {
    return all.filter(m => {
      const ctx = m.context || m.metadata?.context
      if (!ctx) return false
      if (typeof ctx === 'string') return ctx === f.type
      if (f.id != null) return ctx.type === f.type && (ctx.id === f.id || ctx.cueid === f.id)
      return ctx.type === f.type
    })
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

// Clear conversation flow when active chat menu selection changes
watch(
  () => storeBentobox.chatList.map(c => ({ id: c.chatid, active: c.active }))),
  (newList, oldList) => {
    const prevActive = oldList?.find(c => c.active)
    const nextActive = newList?.find(c => c.active)
    if (!prevActive || !nextActive) return
    if (prevActive.id !== nextActive.id) {
      chatStore.chatHistory = chatStore.chatHistory.filter(m => {
        const ctx = m.context || m.metadata?.context
        if (!ctx) return false
        if (typeof ctx === 'string') return ctx === 'chat'
        const attention = storeAI.chatAttention
        return ctx.type === 'chatspace' && (ctx.id === attention || ctx.cueid === attention)
      })
    }
  },
  { deep: true }
)

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
    font-size: .8em;
	background-color: #e7eaf5;
	background-image:
		linear-gradient(
		    25deg,
			  transparent 65%,
			  hsla(205,50%,90%,1),
			  transparent 70%
		    ),
		linear-gradient(
		    -25deg,
			  transparent 65%,
			  hsla(205,50%,90%,1),
			  transparent 70%
		    ),
		linear-gradient(
		    -25deg,
			  transparent 30%,
			  hsla(205,50%,90%,1),
			  transparent 35%
		    ),
		linear-gradient(
		    25deg,
			  transparent 30%,
			  hsla(205,50%,90%,1),
			  transparent 35%
		    ),		
		linear-gradient(
		    65deg,
			  transparent 65%,
			  hsla(205,50%,90%,1),
			  transparent 70%
		    ),
		linear-gradient(
		    -65deg,
			  transparent 65%,
			  hsla(205,50%,90%,1),
			  transparent 70%
		    ),
		linear-gradient(
		    -65deg,
			  transparent 30%,
			  hsla(205,50%,90%,1),
			  transparent 35%
		    ),
		linear-gradient(
		    65deg,
			  transparent 30%,
			  hsla(205,50%,90%,1),
			  transparent 35%
		    );
	background-size: 
		5em 2em,
		5em 2em,
		5em 2em,
		5em 2em,	
		2em 5em,
		2em 5em,
		2em 5em,
		2em 5em;
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
  min-height: 400px;
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