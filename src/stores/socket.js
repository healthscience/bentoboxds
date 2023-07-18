import { defineStore } from "pinia";
// import { store } from "@/stores/store.js";

export const useSocketStore = defineStore({
  id: "socket",
  state: () => ({
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
      // this.send_message()
      //check if it's our message or from a friend
      this.messages.push(received)
      console.log('messages2')
      console.log(this.messages)
    },
    send_message () {
      var to_send = { from: 'yyyyaj', message: 'mmmmmbaba' }
      this.websocket.send( JSON.stringify(to_send) )
      this.messages.push( { from: "send", message: to_send.message } )
    },    
    onSockerError (evt) {
      this.connection_error = true
    }
  }
})