import { defineStore } from "pinia";

export const useGelleStore = defineStore("gellestore", {
  state: () => ({
    gelleMorphogens: [],
    availableTextures: [],
    activeGelles: [],
  }),
  actions: {
    graftGelle(textureId, initialState = {}) {
      const texture = this.availableTextures.find((t) => t.id === textureId);
      if (texture) {
        const instance = {
          ...texture,
          instanceId: `${textureId}-${Date.now()}`,
          grafts: initialState.grafts || [],
          strategy: initialState.strategy || texture.strategy,
        };
        this.activeGelles.push(instance);
        return instance;
      }
      return null;
    },
    addGraft(instanceId, word) {
      const gelle = this.activeGelles.find((g) => g.instanceId === instanceId);
      if (gelle && !gelle.grafts.includes(word)) {
        gelle.grafts.push(word);
      }
    },
    saveGelleContract(gelleContract) {
      this.gelleMorphogens.push(
        {
          contract: gelleContract,
          state: {
            isActive: false,
            buttonColor: '#4a5568',
            isExpanded: false
          }
        }
      )
      this.saveConfirm = true
    },
    updateStrategy(instanceId, strategy) {
      const gelle = this.activeGelles.find((g) => g.instanceId === instanceId);
      if (gelle) {
        gelle.strategy = strategy;
      }
    },
    removeOrgo(gelleKey) {
      const index = this.activeOrgos.findIndex((o) => o.key === gelleKey);
      if (index !== -1) {
          this.activeGelles.splice(index, 1);
      }
    }
  },
});
