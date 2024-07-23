import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import VisPositionUtility from '@/stores/hopUtility/positionUtility.js'
const PositionUtility = new VisPositionUtility()


export const mapminiStore = defineStore('mapministore', {
  state: () => ({
    liveSpaceCoord: {},
    c: {},
    ctx: PositionUtility,
    spaceClick: true,
    minmapClick: false,
    mouseClickCount: 0
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    setMapstyle (style) {
      console.log(style)
    },
    actionSetminmap: (update) => {
      this.ctx.setCanvas(update)
    },
    actionResetMmap: () => {
      this.ctx.clearMMap()
    },
    actionPostionCoordMouse: (update) => {
      // has the minimouse area been clicked?
      this.ctx.mousePointer(update)
    },
    actionPostionCoord: (update) => {
      // keep track of position in bento space
      let positionTrack = this.ctx.startPositionSpace(update.nxp, update.coord, update.type)
      // Vue.set(this.liveSpaceCoord, update.nxp, positionTrack)
      // update the minimap
      this.ctx.miniMapLocations()
    },
    actionClearPosition: () => {
      let coordKeys = Object.keys(this.liveSpaceCoord)
      const clearCoord = { ...this.liveSpaceCoord }
      for (let ck of coordKeys) {
        delete clearCoord[ck]
      }
    },
    actionMMapMove: (update) => {
      // context.rootState.activeScalevalue = 1
      this.ctx.scrollTODashboard(update)
    },
    actionDashBmove: (update) => {
      let updateCOORD = this.ctx.updateMMapSpace(update)
      let updateXY = {}
      updateXY.x = updateCOORD.x
      updateXY.y = updateCOORD.y
      // Vue.set(this.liveSpaceCoord, inVerified.nxp, updateXY) use
    },
    actionDashBRemove: (update) => {
      // let updateCOORD = state.ctx.removeMMapSpace(inVerified)
      this.ctx.removeMMapSpace(update)
      /* let updateXY = {}
      updateXY.x = updateCOORD.x
      updateXY.y = updateCOORD.y
      Vue.set(state.liveSpaceCoord, inVerified.nxp, updateXY) */
    },
    actionZoomset: (update) => {
      this.ctx.setZoom(update)
    },
    actionRefreshminimap: (update) => {
      console.log(update)
    }
  }
})