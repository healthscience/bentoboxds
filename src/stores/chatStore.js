import { defineStore } from 'pinia'
import { aiInterfaceStore } from "@/stores/aiInterface.js"
import ChatService from '@/services/chatService.js'

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

    viewSaveExperiment(bbid, contractID) {
      this.storeAI.viewSaveExperiment(bbid, contractID)
    },

    publibLibAdd(board) {
      this.storeAI.publibLibAdd(board)
    },

    uploadButton() {
      this.storeAI.uploadButton()
    },

    openLibrary() {
      this.storeAI.openLibrary()
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
      // Handle incoming messages and update the chat state
      console.log('Handling incoming message:', message)

      // Check if this is a peer question
      if (message.type === 'peer-question') {
        // Construct peer message structure
        const peerMessage = {
          type: 'peer',
          content: message.data || message.text,
          timestamp: new Date(),
          bboxid: message.bbid,
          tools: message.tools || [],
          context: message.context
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
          context: message.context
        }
        this.addMessage(aiPlaceholder)
        
        // Mark that chat has begun
        this.beginChat = true
      }
      // Handle agent replies
      else if (message.type === 'agent-reply') {
        console.log('agent reply received:', message)
        console.log('message.data:', message.data)
        console.log('message.data.text:', message.data?.text)
        console.log('message.streaming:', message.streaming)
        
        // Check if this is explicitly marked as a streaming message
        const isStreaming = message.streaming === true || message.data?.streaming === true
        
        // Find the pending or current streaming message for this bboxid
        const existingIndex = this.chatHistory.findIndex(
          msg => msg.type === 'agent' && msg.bboxid === message.bbid && (msg.status === 'pending' || msg.status === 'streaming')
        )
        
        if (existingIndex !== -1) {
          // Update existing message
          if (isStreaming) {
            // For streaming messages, append the new text
            this.chatHistory[existingIndex] = {
              ...this.chatHistory[existingIndex],
              content: (this.chatHistory[existingIndex].content || '') + (message.data.text || ''),
              status: 'streaming',
              timestamp: new Date(),
              metadata: message.metadata || {}
            }
          } else {
            // For complete messages, replace the entire content
            this.chatHistory[existingIndex] = {
              ...this.chatHistory[existingIndex],
              content: message.data.text || message.data || '',
              status: 'complete',
              timestamp: new Date(),
              metadata: message.metadata || {}
            }
          }
          
          // Notify subscribers about the update
          this.notifySubscribers({ type: 'messageUpdate', payload: this.chatHistory[existingIndex] }, this.$state)
        } else {
          // If no existing message found, this shouldn't happen in normal flow
          // but we'll handle it just in case
          console.warn('No pending message found for agent reply, creating new message')
          const aiMessage = {
            type: 'agent',
            content: message.data.text || message.data || '',
            timestamp: new Date(),
            bboxid: message.bbid,
            status: isStreaming ? 'streaming' : 'complete',
            messageType: message.messageType || 'response',
            metadata: message.metadata || {},
            context: message.context
          }
          this.addMessage(aiMessage)
        }
      }
      // Handle streaming tokens
      else if (message.type === 'token') {
        this.updateStreamingMessage(message.data)
      }
      // Handle end of streaming
      else if (message.type === 'stream-end') {
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
    addUserQuestion(text, tools = []) {
      const userMessage = {
        type: 'peer',
        content: text,
        timestamp: new Date(),
        bboxid: null, // Will be set by HOP
        tools: tools,
        context: this.storeAI.beebeeContext || 'chat'
      }
      
      this.addMessage(userMessage)
      
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
      
      return userMessage
    }
}
})

