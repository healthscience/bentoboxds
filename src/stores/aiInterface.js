import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const aiInterfaceStore = defineStore('beebeeAIstore', {
  state: () => ({
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
        active: false
      },
      helpchatReply: '',
      helpchatHistory: [],
      caleaiReply:
      {
        text: '... .. ...',
        time: '',
        data: {},
        active: false
      },
      liveFutureCollection: { active: false }
  }),
  actions: {
    actionNatlangIn00 () {
      console.log(this.beebeeStatus)
    },
    actionBBAI: () => {
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
    actionAskBB (update) {
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
    actionHelpaskentry (update) {
      let dataAI = {}
      dataAI.token = context.rootState.jwttoken
      dataAI.update = update
      if (inVerified.update === true) {
        thisstate.helpchatAsk, 'active', true
        let aiMessageout = {}
        aiMessageout.type = 'bbai'
        aiMessageout.reftype = 'ignore'
        aiMessageout.action = 'question'
        aiMessageout.data = state.helpchatAsk
        aiMessageout.jwt = inVerified.token
        const beebeeMessage = JSON.stringify(aiMessageout)
        Vue.prototype.$socket.send(beebeeMessage)
      } else {
        // local AI
        let date = new Date()
        // get the time as a string
        let time = date.toLocaleTimeString()
        this.state.caleaiReply.text = 'beebee is not connected'
        this.state.caleaiReply.time = time
        this.state.caleaiReply.active = false
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
