import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const besearchStore = defineStore('besearchstore', {
  state: () => ({
    besearchCyles: [
      {
        id: 'cycle-1',
        name:'besearch1', 
        besearchid:'0123456543210', 
        x: 200,
        y: 200,
        cueSpace: { location: { width: 200, height: 200 }}, 
        active: true,
        isDragging: false
      },
      {
        id: 'cycle-2',
        name:'besearch2', 
        besearchid:'0123456543212', 
        x: 500,
        y: 300,
        cueSpace: { location: { width: 500, height: 300 }}, 
        active: true,
        isDragging: false
      }
    ],
    spaceLocation: [
    ]
  }),
  actions: {
    saveToHOP(bcInfo) {
      // Prepare message for HOP
      let bcContract = {}
      bcContract.type = 'library'
      bcContract.action = 'besearch-cycle'
      bcContract.reftype = 'train-hopquery'
      bcContract.task = 'PUT'
      bcContract.privacy = 'private'
      bcContract.data = bcInfo
      // Send via socket to HOP
      console.log('Saving to HOP besearch store:', bcContract)
     // this.sendSocket.send_message(bcContract)
    },
  }
})
