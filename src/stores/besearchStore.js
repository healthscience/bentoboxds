import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'

export const besearchStore = defineStore('besearchstore', {
  state: () => ({
    socketStore: new useSocketStore(),
    besearchHistoryStatus: false,
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
    showBesearchDetail: false,
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
      emulationDepth: 0,
      peerDirection: 'down',
      interventions: [],
      viewport: { x: 0, y: 0 }, // For game-world scrolling
      zoom: 1.0,
      panOffset: { x: 0, y: 0 },
      showBottomPanel: false,
      bottomHeight: 60,
      worldBounds: { width: 5000, height: 5000 } // Large game world
    }
  }),
  getters: {
    besearchCyclesNormalized: (state) => {
      return state.besearchCyles.map((entry, index) => {
        const value = entry?.value || entry || {}
        return {
          hopKey: entry?.key,
          seq: entry?.seq ?? index,
          id: value.id || entry?.key || `cycle-${index}`,
          name: value.name || 'New Cycle',
          description: value.description || '',
          category: value.category || 'custom',
          status: value.status || 'pending',
          networkExperimentId: value.networkExperimentId || value.networkExperiment || '',
          markerIds: value.markerIds || value.marker || [],
          consilience: value.consilience || [],
          besearchCycles: value.besearchCycles || [],
          createdAt: value.createdAt,
          updatedAt: value.updatedAt,
          x: value.x ?? 200,
          y: value.y ?? 200,
          active: value.active !== false,
          linkedInterventions: value.linkedInterventions || []
        }
      })
    },
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
    deleteBesearch(besearchItem) {
      try {
        // Prepare message for HOP
        let bcContract = {
          type: 'library',
          action: 'besearch',
          reftype: 'besearch-cycle',
          task: 'DEL',
          privacy: 'private',
          data: besearchItem
        }
        // Send via socket to HOP
        this.socketStore.send_message(bcContract)
        // remove from besearch history
        this.besearchCyles = this.besearchCyles.filter(item => item.key !== besearchItem.id)
      } catch (error) {
        console.error('Error saving to HOP:', error)
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
    // Process reply from HOP
    processReply(replyData) {
      // saved or start data
      if (replyData.action === 'besearch-history') {
        this.besearchCyles = replyData.data
      } else if (replyData.action === 'besearch-contract') {
        // add besearch item to besearch world canvas
        console.log('besearch contract reply saved')
        console.log(replyData)
        const savedEntry = replyData.data?.data || replyData.data || replyData
        const normalizedEntry = savedEntry?.key && savedEntry?.value
          ? savedEntry
          : { key: savedEntry?.key || savedEntry?.id, value: savedEntry?.value || savedEntry }
        this.besearchCyles.push(normalizedEntry)
        /* try {
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
        }*/
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
    updateBesearchCycle(cycleId, updates) {
      const index = this.besearchCyles.findIndex((entry) => {
        const value = entry?.value || entry || {}
        return value.id === cycleId || entry?.key === cycleId
      })
      if (index === -1) return

      const entry = this.besearchCyles[index]
      const value = entry?.value || entry || {}
      const updatedValue = { ...value, ...updates, updatedAt: new Date().toISOString() }
      const updatedEntry = entry?.value
        ? { ...entry, value: updatedValue }
        : { ...updatedValue, key: entry?.key || updatedValue.id }

      this.besearchCyles.splice(index, 1, updatedEntry)
    },
    saveCyclePositionsToHOP() {
      const payload = this.besearchCyclesNormalized.map((cycle) => ({
        id: cycle.id,
        x: cycle.x,
        y: cycle.y,
        linkedInterventions: cycle.linkedInterventions || [],
        updatedAt: new Date().toISOString()
      }))
      this.saveToHOP({
        type: 'besearch-cycle-positions',
        cycles: payload
      })
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
    setSelectedIntervention (intervention) {
      this.selectedIntervention = intervention
      // show in bottom panel
      this.showBesearchDetail = true
      this.bottomHeight = 600
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
