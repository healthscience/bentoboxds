import { ref, computed } from 'vue'
import { shallowRef } from 'vue'
import { markRaw } from 'vue'
import { defineStore } from 'pinia'
import hashObject from 'object-hash'
import { useSocketStore } from '@/stores/socket.js'
import DataPraser from '@/stores/hopUtility/dataParse.js'

export const aiInterfaceStore = defineStore('beebeeAIstore', {
  state: () => ({
    sendSocket: useSocketStore(),
    liveDataParse: new DataPraser(),
    startChat: true,
    historyBar: false,
    beginChat: false,
    beebeeStatus: false,
    qcount: 0,
    chatBottom: 0,
    askQuestion: {
      text: ''
    },
    inputAskHistory: [],
    statusCALE:
    {
      text: 'off',
      active: false
    },
    helpchatAsk: markRaw(
    {
      text: '',
      time: '',
      active: true
    }),
    helpchatReply: '',
    helpchatHistory: shallowRef([]),
    historyPair: [],
    beebeeReply:
    {
      text: '... .. ...',
      time: '',
      data: {},
      active: false
    },
    liveFutureCollection: { active: false },
    tempNumberData: [],
    tempLabelData: [],
    bentospaceState: false,
    longPress: false,
    bentoboxList: [] // ['123', '345', '564343']
  }),
  actions: {
    actionBBAI () {
      // filter a list of Kentity bundles given the Experiment CNRL
      // check current state and reverse
      if (this.statusCALE.active === false) {
        this.statusCALE.active = true
        thisstate.statusCALE.text = on
      } else {
        this.state.statusCALE.active = false
        this.state.statusCALE.text = 'off'
      }
    },
    actionBBstate (context) {
      this.beebeeStatus = !this.beebeeStatus
    },
    actionNatlangIn (event, update) {
      // set context
      if (event.key === 'Enter') {
        // process the input
        this.submitAsk()
      } else {
        console.log(this.askQuestion)
      }
    },
    submitAsk () {
      // remove start boxes
      this.startChat = false
      this.historyBar = true
      let saveQ = {}
      saveQ.count = this.qcount
      saveQ.text = this.askQuestion.text
      saveQ.active = true
      let date = new Date()
      // get the time as a string
      let time = date.toLocaleTimeString()
      saveQ.time = time
      this.inputAskHistory.push(saveQ)
      // provide feedback else forward to beebeeLogic via HOP
      this.actionHelpAskInput()
    },
    actionHelpAskInput () {
      if (this.inputAskHistory[this.qcount].text.length > 0) {
        let hashQuestion = hashObject(this.inputAskHistory[this.qcount])
        // thisstate.helpchatAsk, 'active', true
        let aiMessageout = {}
        aiMessageout.type = 'bbai'
        aiMessageout.reftype = 'ignore'
        aiMessageout.action = 'question'
        aiMessageout.data = this.inputAskHistory[this.qcount]
        aiMessageout.bbid = hashQuestion
        // const sendocket = useSocketStore()
        this.sendSocket.send_message(aiMessageout)
        this.helpchatHistory.push(aiMessageout)
        this.askQuestion.text = ''
        this.qcount++
      } else {
        // local AI
        let date = new Date()
        // get the time as a string
        let time = date.toLocaleTimeString()
        this.beebeeReply.text = 'beebee is not connected'
        this.beebeeReply.time = time
        this.beebeeReply.active = false
      }
    },
    processReply (received) {
      // match to question via bbid
      for (let histMatch of this.helpchatHistory) {
        if (histMatch.bbid === received.bbid) {
          let pairBB = {}
          pairBB.question = histMatch
          pairBB.reply = received
          // temporary parse check for number and chart if numbers
          // check for numbers, files, excel etc. or spam check for size
          let numberCheck = this.liveDataParse.numberParse(histMatch.data.text)
          if (numberCheck.status === true) {
            this.tempNumberData = numberCheck.data
            this.tempLabelData = numberCheck.label
            histMatch.data.text = numberCheck.data
          }
          this.historyPair.push(pairBB)
        }
      }
      this.beginChat = true 
      this.chatBottom++
    }    
  }
})
