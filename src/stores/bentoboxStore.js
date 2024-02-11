import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

export const bentoboxStore = defineStore('bentostore', {
  state: () => ({
    storeAI: aiInterfaceStore(),
    historyActive: false,
    chatList: [
      {
        name:'chat1', chatid:'12345', active: true
      }
    ],
    spaceList: [
      {
        name:'space1', spaceid:'91919191', active: true
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
              // is setting for chat or space?
              if ('space' in cm.value !== true ) {
                this.storeAI.historyPair[cm.key] = cm.value.pair
                // loop over boxids for this chat
                for (let pair of cm?.value?.pair) {
                  this.storeAI.beebeeChatLog[pair.reply.bbid] = true
                  if (cm.value?.visData) {
                    let hopDataChart = {}
                    hopDataChart.datasets = [ { data: cm.value?.visData[0]?.datasets[0]?.data } ]
                    hopDataChart.labels = cm.value?.visData[0]?.labels
                    this.storeAI.visData[pair.reply.bbid] = hopDataChart
                  }
                  this.chartStyle[pair.reply.bbid] = 'line'
                }
              } else {
                this.storeAI.liveBspace = cm.value.space
                if (cm.value.bboxlist.length > 0) {
                  this.storeAI.bentoboxList[cm.value.space.spaceid] = cm.value.bboxlist
                } else {
                  this.storeAI.bentoboxList[cm.value.space.spaceid] = []
                }
              }
            }
          }
          this.chatList = chatMenu
        }
        // set the chat list live
        this.storeAI.historyList = 'history'
        this.storeAI.chatAttention = this.chatList[0].chatid
        this.storeAI.setupChatHistory(this.chatList[0])
        this.historyActive = true
      }
    }
  }
})
