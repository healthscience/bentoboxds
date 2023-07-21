import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useSocketStore } from "@/stores/socket.js"

export const aiInterfaceStore = defineStore('beebeeAIstore', {
  state: () => ({
    sendSocket: useSocketStore(),
    beginChat: false,
    beebeeStatus: false,
    statusCALE:
    {
      text: 'off',
      active: false
    },
    helpchatAsk:
    {
      text: '',
      time: '',
      active: true
    },
    helpchatReply: '',
    helpchatHistory: [],
    beebeeReply:
    {
      text: '... .. ...',
      time: '',
      data: {},
      active: false
    },
    liveFutureCollection: { active: false }
  }),
  actions: {
    processReply (received) {
      console.log('update UI with reply data')
      console.log(received)
      this.beginChat = true
      this.beebeeReply = received.data
    },
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
    actionNatlangIn (update) {
      // set context
      console.log('nat alng start')
      console.log(this.beebeeStatus)
      this.helpchatAsk.text = update
      let date = new Date()
      // get the time as a string
      let time = date.toLocaleTimeString()
      this.helpchatAsk.time = time
      console.log(this.helpchatAsk)
    },
    submitAsk (update) {
      console.log('sumbmit  bbbbbeebee')
      // check for numbers, files, excel etc. or spam check for size
      let firstAnalysis = update
      // provide feedback else forward to beebeeLogic via HOP
      this.actionHelpAskInput(firstAnalysis)
      // context.commit('SET_ASKBB_HELP', update)
      // context.rootState.liveHelpcontext = 'BB-AI'
      // thiscontext.rootState.helpModal, 'active', true)
    },
    actionHelpAsk (update) {
      // set context
      this.state.helpchatAsk.text = inVerified
      let date = new Date()
      // get the time as a string
      let time = date.toLocaleTimeString()
      this.state.helpchatAsk.time = time
    },
    actionHelpAskInput () {
      console.log('ready to send')
      console.log(this.helpchatAsk)
      // let dataAI = {}
      // dataAI.token = context.rootState.jwttoken
      // dataAI.update = update
      if (this.helpchatAsk.text.length > 0) {
        // thisstate.helpchatAsk, 'active', true
        let aiMessageout = {}
        aiMessageout.type = 'bbai'
        aiMessageout.reftype = 'ignore'
        aiMessageout.action = 'question'
        aiMessageout.data = this.helpchatAsk
        aiMessageout.jwt = ''
        // const sendocket = useSocketStore()
        this.sendSocket.send_message(aiMessageout)
        // Vue.prototype.$socket.send(beebeeMessage)
      } else {
        console.log('reply')
        // local AI
        let date = new Date()
        // get the time as a string
        let time = date.toLocaleTimeString()
        this.beebeeReply.text = 'beebee is not connected'
        this.beebeeReply.time = time
        this.beebeeReply.active = false
      }
    },
    actionFuture (update) {
      let dataAI = {}
      dataAI.token = context.rootState.jwttoken
      dataAI.update = update
      let fstate = !this.liveFutureCollection.active
      this.state.liveFutureCollection.active = 'fstate'
      // data nxp context ref contracts
      let refBundle = {}
      refBundle.future = true
      refBundle.contracts = inVerified.update.contracts
      let aiMessageout = {}
      aiMessageout.type = 'caleai'
      aiMessageout.reftype = 'ignore'
      aiMessageout.action = 'future'
      aiMessageout.data = refBundle
      aiMessageout.jwt = inVerified.token
      // const caleMessage = JSON.stringify(aiMessageout)
      // Vue.prototype.$socket.send(caleMessage)
    },
    actionBBstate (context) {
      this.beebeeStatus = !this.beebeeStatus
    }    
  }
})
