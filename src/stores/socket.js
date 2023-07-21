import { defineStore } from "pinia";
// import { store } from "@/stores/store.js"
import { aiInterfaceStore } from "@/stores/aiInterface.js"

export const useSocketStore = defineStore({
  id: "socket",
  state: () => ({
    aiStore: aiInterfaceStore(),
    count: 0,
    websocket: {},
    connection_ready: false,
    connection_error: false,
    messages: []
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    increment () {
      this.count++
    },
    randomizeCounter () {
      this.count = Math.round(100 * Math.random())
    },
    init_chat () {
      console.log('chat live')
      //connect to Sockets Bay
      const sockets_bay_url = `wss://127.0.0.1:9888`
      this.websocket = new WebSocket(sockets_bay_url)
      console.log(this.websocket)
      this.websocket.onopen = this.onSocketOpen
      this.websocket.onmessage = this.onSocketMessage
      this.websocket.onerror = this.onSockerError
    },
    onSocketOpen (evt) {
      this.connection_ready = true
    },
    onSocketMessage (evt) {
      console.log(evt.data)
      //we parse the json that we receive
      var received = JSON.parse(evt.data)
      console.log(received)
      // keep in message log for session?
      this.messages.push(received)
      // parse and route to logic processing
      if (received.type === 'library') {
        console.log('library')
      } else if (received.type == '') {
        console.log('safeflow')
      } else if (received.type == 'bbai-reply') {
        console.log('beebee')
        console.log(this.aiStore)
        this.aiStore.processReply(received)
      } else if (received.type == '') {
        console.log('error')       
      }
    
    },
    send_message (data) {
      this.websocket.send(JSON.stringify(data))
      // keep list of message per session live?
      // this.messages.push( { from: "send", message: to_send.message } )
    },    
    onSockerError (evt) {
      this.connection_error = true
    }
  }
})