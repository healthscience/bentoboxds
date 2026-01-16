import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'

export const besearchStore = defineStore('besearchstore', {
  state: () => ({
    socketStore: new useSocketStore(),
    besearchCyles: [],
    spaceLocation: [
    ],
    // UI state for component communication
    selectedIntervention: null,
    selectedCategory: null,
    // Canvas state persistence
    canvasState: {
      peerPositions: {
        cues: { x: 400, y: 300 }, // Center of typical screen
        body: { x: 400, y: 300 },
        earth: { x: 400, y: 300 }
      },
      currentMode: 'cues',
      peerDirection: 'down',
      interventions: [],
      viewport: { x: 0, y: 0 }, // For game-world scrolling
      worldBounds: { width: 5000, height: 5000 } // Large game world
    }
  }),
  actions: {
    // Save besearch data to HOP with specific action
    saveToHOP(besearchData) {
      try {
        // Prepare message for HOP
        let bcContract = {
          type: 'library',
          action: 'besearch',
          reftype: 'besearch-create',
          task: 'PUT',
          privacy: 'private',
          data: besearchData
        }
        console.log('Saving to HOP besearch store:', bcContract)
        // Send via socket to HOP
        this.socketStore.send_message(bcContract)
        return { success: true, message: `operation saved successfully` }
      } catch (error) {
        console.error('Error saving to HOP:', error)
        return { success: false, message: 'Failed to save: ' + error.message }
      }
    },
    // delete besearch item
    deleteToHOP(besearchItem) {
      try {
        // Prepare message for HOP
        let bcContract = {
          type: 'besearch',
          action: 'besearch-cycle',
          reftype: 'besearch-cycle',
          task: 'DEL',
          privacy: 'private',
          data: besearchItem
        }
        console.log('Saving to HOP besearch store:', bcContract)
        // Send via socket to HOP
        this.socketStore.send_message(bcContract)
        return { success: true, message: `${action} operation saved successfully` }
      } catch (error) {
        console.error('Error saving to HOP:', error)
        return { success: false, message: 'Failed to save: ' + error.message }
      }
    },
    // Load besearch data from HOP
    async loadFromHOP() {
      try {
        const socketStore = this.socketStore

        // Prepare query message for HOP
        let queryContract = {
          type: 'besearch',
          action: 'besearch-cycle',
          reftype: 'train-hopquery',
          task: 'GET',
          privacy: 'private',
          data: {
            operation: 'load',
            timestamp: new Date().toISOString()
          }
        }

        console.log('Loading from HOP besearch store:', queryContract)

        if (socketStore.connection_ready) {
          socketStore.send_message(queryContract)
          return { success: true, message: 'Load request sent' }
        } else {
          console.warn('Socket not ready, cannot load from HOP')
          return { success: false, message: 'Connection not ready, please try again' }
        }
      } catch (error) {
        console.error('Error loading from HOP:', error)
        return { success: false, message: 'Failed to load: ' + error.message }
      }
    },
    // Process reply from HOP (to be called by socket store)
    processReply(replyData) {
      // saved or start data
      if (replyData.action === 'besearch-history') {
        console.log('start history besearch', replyData)
      } else if (replyData.action === 'besearch-contract') {
        // add besearch item to besearch world canvas
        try {
          console.log('Processing besearch reply from HOP:', replyData)
          if (replyData.data && replyData.data.besearchCycles) {
            // Update besearch cycles
            this.besearchCyles = replyData.data.besearchCycles
          }
          if (replyData.data && replyData.data.canvasState) {
            // Update canvas state
            this.canvasState = { ...this.canvasState, ...replyData.data.canvasState }
          }
          this.isLoaded = true
          this.isLoading = false
          this.loadError = null
          return { success: true, message: 'Data loaded successfully' }
        } catch (error) {
          console.error('Error processing HOP reply:', error)
          this.isLoading = false
          this.loadError = 'Failed to process reply: ' + error.message
          return { success: false, message: 'Failed to process reply: ' + error.message }
        }
      }
    },
    updatePeerPosition(position) {
      if (this.canvasState.peerPositions[this.canvasState.currentMode]) {
        this.canvasState.peerPositions[this.canvasState.currentMode] = { ...position }
      }
    },
    getPeerPosition(mode = null) {
      const targetMode = mode || this.canvasState.currentMode
      return this.canvasState.peerPositions[targetMode] || { x: 800, y: 450 }
    },
    setCurrentMode(mode) {
      this.canvasState.currentMode = mode
    },
    updatePeerDirection(direction) {
      this.canvasState.peerDirection = direction
    },
    updateViewport(viewport) {
      this.canvasState.viewport = { ...viewport }
    },
    addIntervention(intervention) {
      this.canvasState.interventions.push(intervention)
    },
    updateIntervention(id, updates) {
      const index = this.canvasState.interventions.findIndex(i => i.id === id)
      if (index !== -1) {
        this.canvasState.interventions[index] = { ...this.canvasState.interventions[index], ...updates }
      }
    },
    removeIntervention(id) {
      this.canvasState.interventions = this.canvasState.interventions.filter(i => i.id !== id)
    },
    // UI state management for component communication
    setSelectedIntervention(intervention) {
      this.selectedIntervention = intervention
    },
    setSelectedCategory(category) {
      this.selectedCategory = category
    },
    clearSelection() {
      this.selectedIntervention = null
      this.selectedCategory = null
    }
  }
})
