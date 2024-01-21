import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'

export const accountStore = defineStore('account', {
  state: () => ({
    sendSocket: useSocketStore(),
    accountStatus: false,
    peerauth: false,
    networkInfo: {},
    warmPeers: [],
    publickeyDrive: [],
    publicKeysList: [],
    sharePubkey: ''
  }),
  actions: {
    processReply (received) {
      if (received.action === 'hyperbee-pubkeys') {
        this.publicKeysList = received.data
      } else if (received.action === 'drive-pubkeys') {
        this.publickeyDrive = received.data
      } else if (received.action === 'warm-peers') {
        this.warmPeers = received.data
      } else if (received.action === 'network-keys') {
        this.networkInfo.publickey = received.data.publickey
      }
    },
    shareProtocol (boxid) {
      let shareContext = {}
      // need to lookup nxp from boxid
      shareContext.boxid = boxid
      shareContext.publickey = this.sharePubkey
      let shareInfo = {}
      shareInfo.type = 'network'
      shareInfo.action = 'share'
      shareInfo.task = 'peer-join'
      shareInfo.reftype = 'null'
      shareInfo.privacy = 'private'
      shareInfo.data = shareContext
      console.log('share')
      console.log(shareInfo)
      this.sendMessageHOP(shareInfo)
    },
    sendMessageHOP (message) {
      this.sendSocket.send_message(message)
    }
  }
})