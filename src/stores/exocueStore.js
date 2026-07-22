import { defineStore } from "pinia";

export const useExocueStore = defineStore("exocuestore", {
  state: () => ({
    exocueMorphogens: [],
      /*{
        id: "oscillator",
        name: "Oscillatorexocue",
        icon: "pulse", // Icon placeholder
        description: "A rhythmic wave representing Effort and Recovery.",
        logic: createOscillatorexocue,
      },
    ],*/
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
    saveOrogContract(exocueContract) {
      this.exocueMorphogens.push(exocueContract)
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