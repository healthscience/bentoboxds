import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'

export const accountStore = defineStore('account', {
  state: () => ({
    sendSocket: useSocketStore(),
    accountStatus: false,
    peerauth: false,
    warmPeers: [],
    publickeyDrive: [],
    publicKeysList: []
  }),
  actions: {
    processReply (received) {
      if (received.action === 'hyperbee-pubkeys') {
        this.publicKeysList = received.data
        console.log(this.publicKeysList)
      } else if (received.action === 'drive-pubkeys') {
        this.publickeyDrive = received.data
      } else if (received.action === 'warm-peers') {
        this.warmPeers = received.data
      }
    },
    sendMessageHOP (message) {
      console.log('send mpapage socket')
      console.log(message)
      this.sendSocket.send_message(message)
    }
  }
})