import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const bentoboxStore = defineStore('bentostore', {
  state: () => ({
    chartStyle: 'bar',
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    setChartstyle (style) {
      this.chartStyle = style
    }
  }
})
