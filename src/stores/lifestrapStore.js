import { defineStore } from 'pinia'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { loomStore } from '@/stores/loomStore.js'
import libraryUtility from '@/stores/hopUtility/libraryUtility.js'

export const lifestrapStore = defineStore('lifestrapstore', {
  state: () => ({
    straps: [],
    activeStrapID: null,
    activeStrapKey: null,
    utilLibrary: new libraryUtility()
  }),
  getters: {
    storeAI: () => aiInterfaceStore()
  },
  actions: {
    addStrap(strap) {
      console.log('lifestrapStore: adding strap', JSON.stringify(strap, null, 2))
      if (!strap.key && strap.id) {
        strap.key = strap.id
      }
      if (!strap.key) {
        console.error('lifestrapStore: strap has no key or id', strap)
        return
      }
      const exists = this.straps.find(s => s.key === strap.key)
      if (!exists) {
        this.straps.push(strap)
      } else {
        // Update existing strap in case it was a summary and now has more data
        const index = this.straps.findIndex(s => s.key === strap.key)
        this.straps[index] = strap
      }
      console.log('lifestrapStore: straps list now', this.straps)
      
      const ai = aiInterfaceStore()
      // Update Loom's current texture key if it's a temporary one
      const loom = loomStore()
      if (loom.lifestrapTexture && (loom.lifestrapTexture.key === 'new-ls' || loom.lifestrapTexture.key === 'prime-life-strap')) {
        loom.lifestrapTexture.key = strap.key
      }

      // Force this strap to be live if it was just created or if it's the first one
      if (this.straps.length === 1 || ai.newLifestrap) {
        this.setActiveStrap(strap)
      }
      
      // Initialize session in AI store
      console.log('lifestrapStore: initializing session for', strap.key)
      ai.initializeSovereignSession(strap.key)
    },
    setActiveStrap(strap) {
      if (!strap) return;
      const ai = aiInterfaceStore();
      this.activeStrap = strap;
      this.activeStrapID = strap.key;
      this.activeStrapKey = strap.key;
      ai.activeLifestrapKey = strap.key;
      ai.activeLifeStrapID = strap.key;
      ai.activeContractKey = strap.key;
      ai.chatAttention = strap.key;
      ai.setActiveLifeStrap(strap);
    },
    setLens(lens) {
      // Find the strap if it exists and update its lens info
      const strap = this.straps.find(s => s.key === lens.key)
      if (strap) {
        strap.lens = lens
      }
      // Also update the active strap ID if this is a first-time story
      if (!this.activeStrapID) {
        this.activeStrapID = lens.key
      }
    },
    processReply(received) {
      console.log('lifestrapStore: processReply', received)
      if (received.action === "ls-pattern") {
        const loom = loomStore();
        loom.weavePattern(received.data.index);
      } else if (received.action === 'lifestrap-genesis' || received.action === 'bringtobe-start' || received.action === 'lifestrap-contract') {
        console.log('lifestrapStore: strap message received', received.action, received)
        const straps = Array.isArray(received.data) ? received.data : [received.data]
        straps.forEach(s => {
          if (s) this.addStrap(s)
        })
      }
    }
  }
})
