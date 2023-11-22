import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

export const libraryStore = defineStore('librarystore', {
  state: () => ({
    liveBentoBox: aiInterfaceStore(),
    libraryMessage: ''
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    processReply (message, questionStart) {
      console.log('library store process')
      console.log(message)
      console.log(questionStart)
      if (message.action === 'save-file') {
        // set message
        this.libraryMessage = message.data.text
        // console.log(this.libraryMessage)
      } else if (message.action === 'library-peerlibrary') {
        // prepare network experiment lists
        console.log('peer library')
        let newPair = {}
        newPair.question = questionStart
        newPair.reply = message.data
        this.liveBentoBox.historyPair.push(newPair)
      }
    }
  }
})