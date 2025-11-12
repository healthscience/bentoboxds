import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const besearchStore = defineStore('besearchstore', {
  state: () => ({
    besearchCyles: [
      {
        name:'besearch1', besearchid:'0123456543210', cueSpace: { location: { width: 200, height: 200 }}, active: true
      },
      {
        name:'besearch2', besearchid:'0123456543212', cueSpace: { location: { width: 500, height: 300 }}, active: true
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
