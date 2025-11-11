import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import TrainingUtility from '@/stores/hopUtility/trainingUtility.js'

export const trainingStore = defineStore('training', {
  state: () => ({
    storeBentoBox: bentoboxStore(),
    sendSocket: useSocketStore(),
    trainingUtil: new TrainingUtility(),
    isTrainingMode: false,
    currentQuery: '',
    currentSession: {
      id: null,
      query: '',
      actions: [],
      startTime: null,
      peerId: null
    },
    completedSessions: [],
    pendingSessions: [],
    trainingStats: {
      totalSessions: 0,
      totalActions: 0,
      lastSessionDate: null
    },
    trainingFeedback: '',
    saveStatus: false,
    syncStatus: false
  }),

  getters: {
    hasActiveSession: (state) => state.isTrainingMode && state.currentSession.id !== null,
    sessionActionCount: (state) => state.currentSession.actions.length,
    recentSessions: (state) => state.completedSessions.slice(-10)
  },

  actions: {
    startTrainingSession(query) {
      this.isTrainingMode = true
      this.currentQuery = query
      this.currentSession = {
        id: Date.now().toString(),
        query: query,
        actions: [],
        startTime: new Date().toISOString(),
        peerId: this.getPeerId()
      }
      console.log('Training session started:', this.currentSession)
    },

    logAction(component, method, args, result = null) {
      if (!this.isTrainingMode) return
      
      const action = {
        component,
        method,
        args,
        result,
        timestamp: Date.now(),
        order: this.currentSession.actions.length
      }
      
      this.currentSession.actions.push(action)
      console.log('Action logged:', action)
    },

    async completeSession() {
      if (!this.isTrainingMode || !this.currentSession.id) return
      
      const session = {
        ...this.currentSession,
        endTime: new Date().toISOString(),
        completed: true
      }
      
      // Add to completed sessions
      this.completedSessions.push(session)
      this.pendingSessions.push(session)
      
      // Update stats
      this.trainingStats.totalSessions++
      this.trainingStats.totalActions += session.actions.length
      this.trainingStats.lastSessionDate = session.endTime
      
      // Save to HOP
      try {
        await this.saveToHOP(session)
        this.trainingFeedback = 'Training example saved successfully!'
        this.saveStatus = true
      } catch (error) {
        console.error('Error saving training session:', error)
        this.trainingFeedback = 'Error saving training example. Will retry later.'
        this.saveStatus = false
      }
      
      // Reset session
      this.resetSession()
    },

    async saveToHOP(session) {
      // Prepare message for HOP
      const hopMessage = {
        type: 'training-session',
        action: 'save',
        data: session
      }
      
      // Send via socket to HOP
      console.log('Saving to HOP besearch store:', hopMessage)
      // TODO: Implement actual HOP integration
      // this.sendSocket.emit('hop-training-save', hopMessage)
      
      // For now, just log it
      console.log('Training session to save:', JSON.stringify(session, null, 2))
    },

    cancelSession() {
      if (this.isTrainingMode) {
        console.log('Training session cancelled')
        this.trainingFeedback = 'Training session cancelled'
      }
      this.resetSession()
    },

    resetSession() {
      this.isTrainingMode = false
      this.currentQuery = ''
      this.currentSession = {
        id: null,
        query: '',
        actions: [],
        startTime: null,
        peerId: null
      }
    },

    getPeerId() {
      // Get peer ID from bentobox store or generate one
      const peerId = this.storeBentoBox.peerId || 'peer-' + Date.now()
      return peerId
    },

    async syncPendingSessions() {
      if (this.pendingSessions.length === 0) return
      
      this.syncStatus = true
      const sessionsToSync = [...this.pendingSessions]
      this.pendingSessions = []
      
      for (const session of sessionsToSync) {
        try {
          await this.saveToHOP(session)
        } catch (error) {
          console.error('Error syncing session:', error)
          this.pendingSessions.push(session)
        }
      }
      
      this.syncStatus = false
    },

    clearCompletedSessions() {
      this.completedSessions = []
      this.trainingStats = {
        totalSessions: 0,
        totalActions: 0,
        lastSessionDate: null
      }
    }
  }
})