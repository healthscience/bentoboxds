import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'

export const besearchStore = defineStore('besearchstore', {
  state: () => ({
    socketStore: new useSocketStore(),
    besearchCyles: [],
    spaceLocation: [
    ],
    interventions: [],
    markers: [],
    networkExperiments: [],
    // UI state for component communication
    selectedIntervention: null,
    selectedCategory: null,
    showCreateForm: false,
    // bbNexus shared context payload
    nexusContext: {
      world: 'cues',
      cueId: null,
      spaceId: null,
      bentoboxId: null,
      source: 'besearch'
    },
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
      zoom: 1.0,
      panOffset: { x: 0, y: 0 },
      worldBounds: { width: 5000, height: 5000 } // Large game world
    }
  }),
  getters: {
    interventionsByCategory: (state) => {
      const grouped = {
        prevention: [],
        repair: [],
        rejuvenation: [],
        experimental: [],
        custom: []
      }
      for (const intervention of state.interventions) {
        const category = intervention.category || 'custom'
        if (!grouped[category]) {
          grouped[category] = []
        }
        grouped[category].push(intervention)
      }
      return grouped
    },
    activeNetworkExperiments: (state) => {
      return state.networkExperiments.map(nxp => ({
        id: nxp.id,
        name: nxp.name,
        cueId: nxp.cueId,
        status: nxp.status
      }))
    },
    availableMarkers: (state) => {
      return state.markers.map(marker => ({
        id: marker.id,
        name: marker.name,
        cueId: marker.cueId,
        datatype: marker.datatype
      }))
    }
  },
  actions: {
    openCreateForm() {
      this.showCreateForm = true
    },
    closeCreateForm() {
      this.showCreateForm = false
    },
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
      } else if (replyData.action === 'besearch-contract') {
        // add besearch item to besearch world canvas
        try {
          if (replyData.data && replyData.data.besearchCycles) {
            // Update besearch cycles
            this.besearchCyles = replyData.data.besearchCycles
          }
          if (replyData.data && replyData.data.interventions) {
            this.interventions = replyData.data.interventions
          }
          if (replyData.data && replyData.data.markers) {
            this.markers = replyData.data.markers
          }
          if (replyData.data && replyData.data.networkExperiments) {
            this.networkExperiments = replyData.data.networkExperiments
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
      } else {
        this.canvasState.peerPositions[this.canvasState.currentMode] = { ...position }
      }
    },
    getPeerPosition(mode = null) {
      const targetMode = mode || this.canvasState.currentMode
      const position = this.canvasState.peerPositions[targetMode] || { x: 800, y: 450 }
      return position
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
    updateZoom(zoom) {
      this.canvasState.zoom = zoom
    },
    updatePanOffset(panOffset) {
      this.canvasState.panOffset = { ...panOffset }
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
    },
    setNexusContext(context) {
      this.nexusContext = { ...this.nexusContext, ...context }
    },
    setNexusWorld(world) {
      this.nexusContext.world = world
      this.canvasState.currentMode = world
    },
    setNexusSource(source) {
      this.nexusContext.source = source
    },
    setNexusCue(cueId) {
      this.nexusContext.cueId = cueId
    },
    setNexusSpace(spaceId) {
      this.nexusContext.spaceId = spaceId
    },
    setNexusBentobox(bentoboxId) {
      this.nexusContext.bentoboxId = bentoboxId
    }
  }
})
