import { defineStore } from 'pinia'
import { aiInterfaceStore } from "@/stores/aiInterface.js"

export const useChatStore = defineStore('chat', {
  state: () => ({
    storeAI: aiInterfaceStore(),
    subscribers: [],
    bottom: null,
    chatHistory: [],
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
      this.chatHistory.push(message)
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
      console.log('incoming message======chatStore')
      console.log(message)
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
        let existingIndex = -1
        if (message.bbid) {
          existingIndex = this.chatHistory.findIndex(
            msg => {
              return msg.type === 'agent' && msg.bboxid === message.bbid && msg.status !== 'complete'
            }
          )
        }
        // If no match by bboxid, find the most recent pending/streaming agent message
        if (existingIndex === -1) {
          // Look for the last agent message that's pending or streaming
          for (let i = this.chatHistory.length - 1; i >= 0; i--) {
            const msg = this.chatHistory[i]
            if (msg.type === 'agent' && (msg.status === 'pending' || msg.status === 'streaming')) {
              existingIndex = i
              break
            }
          }
        }
        if (existingIndex !== -1) {
          // Update bboxid if it was null
          if (!this.chatHistory[existingIndex].bboxid && message.bbid) {
            this.chatHistory[existingIndex].bboxid = message.bbid
          }
          // Check if this looks like a streaming update
          // Always treat as streaming if the message is already streaming or if it's short content
          const isPartialContent = textContent && textContent.length < 50 && !textContent.includes('.') && !textContent.includes('!')
          const isAlreadyStreaming = this.chatHistory[existingIndex].status === 'streaming'

          if (isPartialContent || isAlreadyStreaming) {
            // Append to existing content for streaming
            // Add a space between words when appending
            const currentContent = this.chatHistory[existingIndex].content || ''
            const needsSpace = currentContent.length > 0 && !currentContent.endsWith(' ') && textContent.length > 0
            this.chatHistory[existingIndex] = {
              ...this.chatHistory[existingIndex],
              content: currentContent + (needsSpace ? ' ' : '') + textContent,
              status: 'streaming',
              timestamp: new Date(),
              metadata: message.metadata || {}
            }
          } else {
            // Replace content for complete messages
            this.chatHistory[existingIndex] = {
              ...this.chatHistory[existingIndex],
              content: textContent,
              status: 'complete',
              timestamp: new Date(),
              metadata: message.metadata || {}
            }
          }
          // Notify subscribers about the update
          this.notifySubscribers({ type: 'messageUpdate', payload: this.chatHistory[existingIndex] }, this.$state)
        } else {
          // This really shouldn't happen - it means we got an agent reply without a pending message
          // Don't create a new message - this is likely a duplicate
          // Just log the error and skip
          console.error('Skipping message creation to avoid duplicates')
        }
      }
      // Handle streaming tokens
      else if (message.type === 'token') {
        console.log('=== TOKEN MESSAGE RECEIVED ===')
        // console.log('Full token message:', message)
        // console.log('Token data:', message.data)
        // console.log('Token bbid:', message.bbid)
        // Find the most recent pending/streaming agent message
        let targetIndex = -1
        // First try to find by bbid if available
        if (message.bbid) {
          for (let i = this.chatHistory.length - 1; i >= 0; i--) {
            const msg = this.chatHistory[i]
            console.log('exising mememe')
            console.log(msg)
            if (msg.type === 'agent' && msg.bboxid === message.bbid && (msg.status === 'pending' || msg.status === 'streaming')) {
              targetIndex = i
              break
            }
          }
        }
        // If not found by bbid, find the most recent pending/streaming message
        if (targetIndex === -1) {
          for (let i = this.chatHistory.length - 1; i >= 0; i--) {
            const msg = this.chatHistory[i]
            if (msg.type === 'agent' && (msg.status === 'pending' || msg.status === 'streaming')) {
              targetIndex = i
              break
            }
          }
        }
        if (targetIndex !== -1) {
          // Update bbid if it was null
          if (!this.chatHistory[targetIndex].bboxid && message.bbid) {
            this.chatHistory[targetIndex].bboxid = message.bbid
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
          const currentContent = this.chatHistory[targetIndex].content || ''
          // Don't add space before punctuation
          const needsSpace = currentContent.length > 0 && 
                           !currentContent.endsWith(' ') && 
                           tokenText.length > 0 &&
                           !tokenText.match(/^[.,!?;:]/)
          
          this.chatHistory[targetIndex] = {
            ...this.chatHistory[targetIndex],
            content: currentContent + (needsSpace ? ' ' : '') + tokenText,
            status: 'streaming',
            timestamp: new Date()
          }
          console.log('index update')
          console.log(this.chatHistory[targetIndex])
          // Notify subscribers
          this.notifySubscribers({ type: 'messageUpdate', payload: this.chatHistory[targetIndex] }, this.$state)
        } else {
          console.error('No pending/streaming message found for token')
          console.error('Current chat history:', this.chatHistory)
        }
      }
      // Handle end of streaming
      else if (message.type === 'stream-end' || message.type === 'streaming-complete') {     
        // Find the most recent streaming agent message
        for (let i = this.chatHistory.length - 1; i >= 0; i--) {
          const msg = this.chatHistory[i]
          if (msg.type === 'agent' && msg.status === 'streaming') {
            this.chatHistory[i] = {
              ...this.chatHistory[i],
              status: 'complete',
              timestamp: new Date()
            }
            this.notifySubscribers({ type: 'messageUpdate', payload: this.chatHistory[i] }, this.$state)
            break
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
      const peerMessage = {
        type: 'peer',
        content: text,
        timestamp: new Date(),
        bboxid: null, // Will be set by HOP
        tools: tools,
        context: this.storeAI.beebeeContext || 'chat'
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
        context: this.storeAI.beebeeContext || 'chat'
      }
      this.addMessage(aiPlaceholder)
      this.beginChat = true
      return peerMessage
    }
}
})

