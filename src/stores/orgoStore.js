import { defineStore } from "pinia";
import { createOscillatorOrgo } from "@/orgos/oscillator.js";

export const useOrgoStore = defineStore("orgostore", {
  state: () => ({
    orgoMorphogens: [],
      /*{
        id: "oscillator",
        name: "OscillatorOrgo",
        icon: "pulse", // Icon placeholder
        description: "A rhythmic wave representing Effort and Recovery.",
        logic: createOscillatorOrgo,
      },
    ],*/
    activeOrgos: [],
    saveConfirm: false
  }),
  actions: {
    instantiateOrgo(seedId, initialState = {}) {
      const seed = this.orgoMorphogens.find((s) => s.id === seedId);
      if (seed) {
        const instance = {
          ...seed,
          instanceId: `${seedId}-${Date.now()}`,
          params: seed.logic(initialState).params,
        };
        this.activeOrgos.push(instance);
        return instance;
      }
      return null;
    },
    saveOrogContract(orgoContract) {
      this.orgoMorphogens.push(orgoContract)
      this.saveConfirm = true
    },
    updateOrgoParam(instanceId, param, value) {
      const orgo = this.activeOrgos.find((o) => o.instanceId === instanceId);
      if (orgo) {
        orgo.params[param] = value;
      }
    },
    removeOrgo(orgoKey) {
      const index = this.orgoMorphogens.findIndex((o) => o.key === orgoKey);
      if (index !== -1) {
          this.activeOrgos.splice(index, 1);
      }
    }
  }
});