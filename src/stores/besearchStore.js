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

  }
})
