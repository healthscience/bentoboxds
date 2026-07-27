import { defineStore } from "pinia";
import LibraryUtility from '@/stores/hopUtility/libraryUtility.js'

export const useExocueStore = defineStore("exocuestore", {
  state: () => ({
    libUtil: new LibraryUtility(),
    organelles: [],
    activeexocues: [],
  }),
  actions: {
    instantiateexocue(seedId, initialState = {}) {
      const seed = this.exocueMorphogens.find((s) => s.id === seedId);
      if (seed) {
        const instance = {
          ...seed,
          instanceId: `${seedId}-${Date.now()}`,
          params: seed.logic(initialState).params,
        };
        this.activeexocues.push(instance);
        return instance;
      }
      return null;
    },
    processReply(exocueList) {
      for (let exoCont of exocueList) {
        let hexOrgoContract = this.libUtil.convertBinaryToHex(exoCont);
        this.saveExocueContract(hexOrgoContract)
      }
    },
    saveExocueContract(exocueContract) {
      this.organelles.push(
      {
        contract: exocueContract,
        state: {
          isActive: false,
          buttonColor: '#4a5568',
          isExpanded: false
        }
      })
    },
    updateexocueParam(instanceId, param, value) {
      const exocue = this.activeexocues.find((o) => o.instanceId === instanceId);
      if (exocue) {
        exocue.params[param] = value;
      }
    },
    removeExocue(exocueKey) {
      const index = this.activeOrgos.findIndex((o) => o.key === exocueKey);
      if (index !== -1) {
          this.activeOrgos.splice(index, 1);
      }
    }
  },
});