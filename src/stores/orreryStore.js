import { defineStore } from 'pinia'
import { cuesStore } from '@/stores/cuesStore.js'

export const orreryStore = defineStore('orrerystore', {
  state: () => ({
    registry: new Map(),
    seedingProgress: 0,
    isSeeding: false,
    storeCues: cuesStore()
  }),
  actions: {
    processReply(message) {
      if (message.action === 'seed-base-biology') {
        const { referenceContracts, verification } = message.data
        
        if (verification) {
          const actual = verification.actual || 0
          const expected = verification.expected || 1
          this.seedingProgress = Math.round((actual / expected) * 100)
          
          if (verification.success === true || this.seedingProgress >= 95) {
            this.isSeeding = false
          }
        }

        if (referenceContracts) {
          // Pass reference contracts directly to cuesStore for integration
          this.storeCues.integrateReferenceContracts(referenceContracts)
          
          // Also store in registry if needed
          // For now mirroring existing behavior but adding to registry Map
          // This will be expanded as we define exactly how structural primitives are stored
        }
      } else if (message.action === 'reference-contract') {
        // Handle reference contracts specifically if they come in isolation
      }
    },
    addToRegistry(key, value) {
      this.registry.set(key, value)
    },
    getFromRegistry(key) {
      return this.registry.get(key)
    }
  }
})
