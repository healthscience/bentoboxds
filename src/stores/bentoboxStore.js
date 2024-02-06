import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

export const bentoboxStore = defineStore('bentostore', {
  state: () => ({
    storeAI: aiInterfaceStore(),
    chatList: [
      {
        name:'chat1', chatid:'12345', active: true
      }
    ],
    chartStyle: {},
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
    setChartstyle (id, style) {
      this.chartStyle[id] = style
    },
    setBoxlocation (loc) {
      // const tempLoc = {}
      // tempLoc.x = 10
      // tempLoc.y = 10
      this.boxLocation = loc
      this.locX = loc.x
      this.locY = loc.y
    },
    processReply (message) {
      // prepare chat menu and pairs
      if (message.reftype.trim() === 'chat-history') {
        if (message.action.trim() === 'start') {
          // set the saved chats for peer
          let chatMenu = []
          for (let cm of message.data) {
            if(cm?.value?.chat) {
              chatMenu.push(cm.value.chat)
            }
            // build datapair
            if (cm?.value?.pair) {
              this.storeAI.historyPair[cm.key] = cm.value.pair
              this.storeAI.beebeeChatLog[cm.key] = true
              console.log(cm.value.visData)
              this.storeAI.visData[cm.key] = cm.value.visData
            }
          }
          this.chatList = chatMenu
        }
        console.log('vis data saved repared')
        console.log(this.storeAI.visData)
      }
    }
  }
})
