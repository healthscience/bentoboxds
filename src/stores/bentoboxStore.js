import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const bentoboxStore = defineStore('bentostore', {
  state: () => ({
    chartStyle: 'bar',
    boxLocation:
    {
      x: 200,
      y: 200
    },
    locX: 140,
    locY: 140
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    setChartstyle (style) {
      this.chartStyle = style
    },
    setBoxlocation (loc) {
      console.log(loc)
      // const tempLoc = {}
      // tempLoc.x = 10
      // tempLoc.y = 10
      this.boxLocation = loc
      this.locX = loc.x
      this.locY = loc.y
    }
  }
})
