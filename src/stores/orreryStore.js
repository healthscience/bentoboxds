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
      console.log('Processing message:', message)
      if (message.action === 'seed-base-biology') {
        const { cueContracts, referenceContracts, verification } = message.data
        
        if (verification) {
          const actual = verification.actual || 0
          const expected = verification.expected || 1
          this.seedingProgress = Math.round((actual / expected) * 100)
          
          if (verification.success === true || this.seedingProgress >= 95) {
            this.isSeeding = false
          }
        }

        if (cueContracts) {
          this.storeCues.cuesList = message.data.cueContracts;
          // Populate registry for categorization
          cueContracts.forEach(c => {
            const hexC = this.storeCues.utilCues?.convertBinaryToHex(c) || c;
            const key = hexC.key || (hexC.value?.id);
            if (key) this.registry.set(key, hexC.value);
          });
        }
        
        if (referenceContracts) {
          this.storeCues.integrateReferenceContracts(referenceContracts);
          Object.values(referenceContracts).forEach(contracts => {
            if (Array.isArray(contracts)) {
              contracts.forEach(c => {
                const hexC = this.storeCues.utilCues?.convertBinaryToHex(c) || c;
                const key = hexC.key || (hexC.value?.id);
                if (key) this.registry.set(key, hexC.value);
              });
            }
          });
        }
      } else if (message.action === 'seed-library') {
        this.storeCues.cuesList = message.data.cueContracts
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
