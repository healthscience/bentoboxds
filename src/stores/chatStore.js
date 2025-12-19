import { defineStore } from 'pinia'
import { aiInterfaceStore } from "@/stores/aiInterface.js"

export const useChatStore = defineStore('chat', {
  state: () => ({
    storeAI: aiInterfaceStore(),
    subscribers: [],
    bottom: null,
    chatHistory: {}, // { [conversationId]: Message[] }
    bbidToConv: {},
    currentStreamingMessage: null,
    beginChat: false
  }),

  getters: {
    chatPairs: (state) => {
      return state.storeAI.historyPair[state.storeAI.chatAttention]
    },
    chatAsk: (state) => {
      return state.storeAI.helpchatAsk
    },
    aiResponse: (state) => {
      return state.storeAI.beebeeReply
    },
    updateBottom: (state) => {
      return state.storeAI.chatBottom
    }
  },
  actions: {
    subscribe(callback) {
      this.subscribers.push(callback)
    },
    unsubscribe(callback) {
      this.subscribers = this.subscribers.filter(sub => sub !== callback)
    },
    notifySubscribers(mutation, state) {
      this.subscribers.forEach(callback => callback(mutation, state))
    },
    switchContext(context) {
      this.storeAI.switchContext(context)
    },
    dataOptionVis(did, colName, bbid, options, size) {
      this.storeAI.dataOptionVis(did, colName, bbid, options, size)
    },
    viewSummaryCSV(bbid) {
      this.storeAI.viewSummaryCSV(bbid)
    },
    dataOptionFilter(did, colName, bbid) {
      this.storeAI.dataOptionFilter(did, colName, bbid)
    },
    dateOptionSelect(did, colName, bbid) {
      this.storeAI.dateOptionSelect(did, colName, bbid)
    },
    filterdeviceEvent() {
      this.storeAI.filterdeviceEvent()
    },
    choicedeviceEvent() {
      this.storeAI.choicedeviceEvent()
    },
    addMessage(message) {
      if (!message) return
      // Determine conversation id
      let convId = message.conversationId
      if (!convId) {
        const ctx = message.context || message.metadata?.context
        if (ctx && typeof ctx === 'object' && ctx.type === 'chatspace') {
          convId = ctx.id || ctx.cueid
        }
      }
      if (!convId) convId = this.storeAI.chatAttention || 'chat'
      message.conversationId = convId
      // Track bbid mapping for streaming updates
      if (message.bbid || message.bboxid) {
        const bb = message.bbid || message.bboxid
        this.bbidToConv[bb] = convId
      }
      // Ensure bucket
      if (!this.chatHistory[convId]) this.chatHistory[convId] = []
      this.chatHistory[convId].push(message)
      this.notifySubscribers({ type: 'newMessage', payload: message }, this.$state)
    },
    addUploadMessag(uploadInfo) {
      const peerMessage = {
        type: 'peer',
        content: uploadInfo.content,
        timestamp: new Date(),
        bboxid: null, // Will be set by HOP
        tools: tools,
        context: this.storeAI.beebeeContext || 'chat'
      }
      this.chatHistory.push(message)
      // this.notifySubscribers({ type: 'newMessage', payload: message }, this.$state)
    },
    startStreamingMessage() {
      this.currentStreamingMessage = {
        type: 'agent',
        content: '',
        streaming: true,
        timestamp: new Date()
      }
      this.addMessage(this.currentStreamingMessage)
    },
    updateStreamingMessage(content) {
      if (this.currentStreamingMessage) {
        this.currentStreamingMessage.content += content
        this.notifySubscribers({ type: 'streamingUpdate', payload: this.currentStreamingMessage }, this.$state)
      }
    },
    endStreamingMessage() {
      if (this.currentStreamingMessage) {
        this.currentStreamingMessage.streaming = false
        this.currentStreamingMessage = null
        this.notifySubscribers({ type: 'streamingComplete' }, this.$state)
      }
    },
    handleIncomingMessage(message) {
      // console.log('incoming message======chatStore')
      // console.log(message)
      // Handle incoming messages and update the chat state
      // Check if this is a peer question
      if (message.type === 'peer-question') {
        // Construct peer message structure
        const peerMessage = {
          type: 'peer',
          content: message.data || message.text,
          timestamp: new Date(),
          bboxid: message.bbid,
          tools: message.tools || [],
          context: message.context,
          conversationId: this.storeAI.chatAttention
        }

        // Add peer message to chat history
        this.addMessage(peerMessage)

        // Add placeholder for AI response
        const aiPlaceholder = {
          type: 'agent',
          content: '',
          timestamp: new Date(),
          bboxid: message.bbid,
          status: 'pending',
          messageType: 'response',
          metadata: {},
          context: message.context,
          conversationId: this.storeAI.chatAttention
        }
        this.addMessage(aiPlaceholder)
        
        // Mark that chat has begun
        this.beginChat = true
      }
      // Handle agent replies
      else if (message.type === 'agent-reply') {
        // Check if this is actually a token message wrapped in agent-reply
        if (message.data?.type === 'token') {
          console.log('toekn in')
          // Redirect to token handler with proper structure
          this.handleIncomingMessage({
            type: 'token',
            data: message.data.data,
            bbid: message.data.bboxid || message.bbid
          })
          return
        } else if (message.data.type === 'bentobox') {
          // bentobox reply message (non-text) -> add as its own entry so UI can render bentobox block
          console.log('bentobox data please')
          this.addMessage({
            ...message,
            status: message.status || 'complete'
          })
          return
        }
        // Extract the text content
        let textContent = ''
        if (typeof message.data === 'string') {
          textContent = message.data
        } else if (message.data?.text) {
          textContent = message.data.text
        } else if (message.data?.content) {
          textContent = message.data.content
        } else if (message.text) {
          textContent = message.text
        } else if (message.content) {
          textContent = message.content
        }
        // Find ANY agent message that isn't complete
        // First try to match by bboxid if available
        // Resolve conversation bucket via explicit conversationId, mapping, or current attention
        const convId = message.conversationId || this.bbidToConv[message.bbid] || (() => {
          const ctx = message.context || message.metadata?.context
          if (ctx && typeof ctx === 'object' && ctx.type === 'chatspace') return ctx.id || ctx.cueid
          return this.storeAI.chatAttention || 'chat'
        })()
        if (!this.chatHistory[convId]) this.chatHistory[convId] = []
        // Find ANY agent message in this conversation that isn't complete
        let existingIndex = -1
        if (message.bbid) {
          existingIndex = this.chatHistory[convId].findIndex(
            msg => msg.type === 'agent' && msg.bboxid === message.bbid && msg.status !== 'complete'
          )
        }
        if (existingIndex === -1) {
          for (let i = this.chatHistory[convId].length - 1; i >= 0; i--) {
            const msg = this.chatHistory[convId][i]
            if (msg.type === 'agent' && (msg.status === 'pending' || msg.status === 'streaming')) {
              existingIndex = i
              break
            }
          }
        }
        if (existingIndex !== -1) {
          // Update bboxid if it was null
          if (!this.chatHistory[convId][existingIndex].bboxid && message.bbid) {
            this.chatHistory[convId][existingIndex].bboxid = message.bbid
          }
          // Check if this looks like a streaming update
          // Always treat as streaming if the message is already streaming or if it's short content
          const isPartialContent = textContent && textContent.length < 50 && !textContent.includes('.') && !textContent.includes('!')
          const isAlreadyStreaming = this.chatHistory[convId][existingIndex].status === 'streaming'

          if (isPartialContent || isAlreadyStreaming) {
            // Append to existing content for streaming
            // Add a space between words when appending
            const currentContent = this.chatHistory[convId][existingIndex].content || ''
            const needsSpace = currentContent.length > 0 && !currentContent.endsWith(' ') && textContent.length > 0
            this.chatHistory[convId][existingIndex] = {
              ...this.chatHistory[convId][existingIndex],
              content: currentContent + (needsSpace ? ' ' : '') + textContent,
              status: 'streaming',
              timestamp: new Date(),
              metadata: message.metadata || {}
            }
          } else {
            // Replace content for complete messages
            this.chatHistory[convId][existingIndex] = {
              ...this.chatHistory[convId][existingIndex],
              content: textContent,
              status: 'complete',
              timestamp: new Date(),
              metadata: message.metadata || {},
              conversationId: this.storeAI.chatAttention || this.chatHistory[convId][existingIndex].conversationId
            }
          }
          // Notify subscribers about the update
          this.notifySubscribers({ type: 'messageUpdate', payload: this.chatHistory[convId][existingIndex] }, this.$state)
        } else {
          // This really shouldn't happen - it means we got an agent reply without a pending message
          // Don't create a new message - this is likely a duplicate
          // Just log the error and skip
          console.error('Skipping message creation to avoid duplicates')
        }
      }
      // Handle streaming tokens
      else if (message.type === 'token') {
        // console.log('Full token message:', message)
        // console.log('Token data:', message.data)
        // console.log('Token bbid:', message.bbid)
        // Find the most recent pending/streaming agent message
        // Resolve conversation bucket via bbid mapping or fallback
        const convId = this.bbidToConv[message.bbid] || this.storeAI.chatAttention || 'chat'
        if (!this.chatHistory[convId]) this.chatHistory[convId] = []
        // Find the most recent pending/streaming agent message in this conversation
        let targetIndex = -1
        if (message.bbid) {
          for (let i = this.chatHistory[convId].length - 1; i >= 0; i--) {
            const msg = this.chatHistory[convId][i]
            if (msg.type === 'agent' && msg.bboxid === message.bbid && (msg.status === 'pending' || msg.status === 'streaming')) {
              targetIndex = i
              break
            }
          }
        }
        if (targetIndex === -1) {
          for (let i = this.chatHistory[convId].length - 1; i >= 0; i--) {
            const msg = this.chatHistory[convId][i]
            if (msg.type === 'agent' && (msg.status === 'pending' || msg.status === 'streaming')) {
              targetIndex = i
              break
            }
          }
        }
        if (targetIndex !== -1) {
          // Update bbid if it was null
          if (!this.chatHistory[convId][targetIndex].bboxid && message.bbid) {
            this.chatHistory[convId][targetIndex].bboxid = message.bbid
          }
          // Extract text from token data - it should be a simple string
          let tokenText = ''
          if (typeof message.data === 'string') {
            tokenText = message.data
          } else if (message.data?.text) {
            tokenText = message.data.text
          } else if (message.data?.content) {
            tokenText = message.data.content
          }
          // Append token to existing message
          const currentContent = this.chatHistory[convId][targetIndex].content || ''
          // Don't add space before punctuation
          const needsSpace = currentContent.length > 0 && 
                           !currentContent.endsWith(' ') && 
                           tokenText.length > 0 &&
                           !tokenText.match(/^[.,!?;:]/)
          
          this.chatHistory[convId][targetIndex] = {
            ...this.chatHistory[convId][targetIndex],
            content: currentContent + (needsSpace ? ' ' : '') + tokenText,
            status: 'streaming',
            timestamp: new Date()
          }
          // Notify subscribers
          this.notifySubscribers({ type: 'messageUpdate', payload: this.chatHistory[convId][targetIndex] }, this.$state)
        } else {
          console.error('No pending/streaming message found for token')
          console.error('Current chat history:', this.chatHistory)
        }
      }
      // Handle end of streaming
      else if (message.type === 'stream-end' || message.type === 'streaming-complete') {     
        // Find the most recent streaming agent message
        // End streaming within active conversation bucket
        {
          const convId = this.storeAI.chatAttention || 'chat'
          const bucket = this.chatHistory[convId] || []
          for (let i = bucket.length - 1; i >= 0; i--) {
            const msg = bucket[i]
            if (msg.type === 'agent' && msg.status === 'streaming') {
              this.chatHistory[convId][i] = {
                ...this.chatHistory[convId][i],
                status: 'complete',
                timestamp: new Date()
              }
              this.notifySubscribers({ type: 'messageUpdate', payload: this.chatHistory[convId][i] }, this.$state)
              break
            }
          }
        }
        this.endStreamingMessage()
      }
      // Handle system messages
      else if (message.type === 'system') {
        // Construct system message structure
        const systemMessage = {
          type: 'system',
          content: message.content,
          timestamp: new Date()
        }
        // Add system message to chat history
        this.addMessage(systemMessage)
      }
      // Notify subscribers of the incoming message
      this.notifySubscribers({ type: 'incomingMessage', payload: message }, this.storeAI.$state)
    },
    // Add a method to handle user questions
    addPeerQuestion(text, tools = []) {
      const convId = this.storeAI.chatAttention
      const peerMessage = {
        type: 'peer',
        content: text,
        timestamp: new Date(),
        bboxid: null, // Will be set by HOP
        tools: tools,
        context: this.storeAI.beebeeContext || 'chat',
        conversationId: convId
      }
      this.addMessage(peerMessage)
      // Add placeholder for AI response
      const aiPlaceholder = {
        type: 'agent',
        content: '',
        timestamp: new Date(),
        bboxid: null,
        status: 'pending',
        messageType: 'response',
        metadata: {},
        context: this.storeAI.beebeeContext || 'chat',
        conversationId: convId
      }
      this.addMessage(aiPlaceholder)
      this.beginChat = true
      return peerMessage
    }
}
})

