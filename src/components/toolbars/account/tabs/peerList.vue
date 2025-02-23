<template>
  <div id="list-space">
    <div id="network-keys">
      <div class="type-peer">Share key:</div>
      <div class="raw-share-live">
        {{ storeAccount.networkInfo.publickey }} 
      </div>
      <button class="raw-share-live" @click="copyKey(storeAccount.networkInfo.publickey)">copy</button>
    </div>
    <div id="generate-invite">
      <div id="invite-peer-codename">
        <div id="invite-peer-name">Name:</div>
        <input v-model="peerName" placeholder="name">
        <button id="invite-generation-button" @click="generateInvite()"> Generate invite</button>
      </div>
      <div id="form-invite-code" v-if="genInvite === true">
        <div id="invite-peer-crypto" v-for="genInvite of inviteList">
          <div id="send-invite-gen">
            <div class="gen-crypt-code">{{ genInvite.name }}</div>
            <div class="gen-crypt-code" id="pubkey-session-live">{{ genInvite.publickey }}</div>
            <div class="gen-crypt-code" id="name-as-code">-{{ genInvite.codename }}</div>
            <button class="gen-crypt-code" id="button-copy-invite" type="button" @click="copyGenInvite(genInvite.codename)">Copy invite</button>
            <button class="gen-crypt-code" id="button-remove-invite" type="button" @click="removeInvite(genInvite.codename)">remove</button>
          </div>
        </div>
      </div>
    </div>
    <div id="add-peer">
      <div id="prepare-invite">
        <button type="button" class="btn-peer-add" @click.prevent="addWarmpeer()">Add new</button>
        <div v-if="addWarm === true" id="add-warm-peer">
          <input v-model="newPeername" placeholder="name">
          <input v-model="newPeerPubKey" placeholder="public key">
          <button type="button" class="btn" @click="sendInviteWarmpeer()">Send invite</button>
        </div>
        <div id="beebee-message-feedback">
          {{ beebeeMessage }}
        </div>
      </div>
      <div id="pending-invites" v-if="investPending.length > 0">
        Invites pending:
        <div v-for='peer in investPending' :key='peer.key'>
          {{ peer?.name }} --  --- {{ peer.key }} -- sent
        </div>
      </div>
    </div>
    <div class="peer-list-set" v-for='peer in peerNetwork' :key='peer.key'>
      <div class="peer-g">
        <div class="longterm-peer">
          {{ peer?.value?.name }} -- {{ peer?.value?.live }} --- {{ peer.key }} --- <button @click="copyKey(peer.key)">copy</button>
        </div>
        <!--if longterm show button to reconnect or (TODO remove)-->
        <div class="longterm-peer" v-if="peer?.longterm === true">
          <button @click="directConnectPeer(peer)">reconnect</button>
        </div>
        <div class="longterm-peer">
          <button @click="removePeer(peer)">remove</button>
        </div>
      </div>
    </div>
    <div id="social-graph-space">
      <social-graph></social-graph>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { accountStore } from '@/stores/accountStore.js'
import SocialGraph from '@/components/toolbars/account/graphs/socialGraph.vue'

  const storeAccount = accountStore()

  let addWarm = ref(false)
  let newPeername = ref('')
  let newPeerPubKey = ref('')
  let genInvite = ref(true)
  let peerName = ref('')
  let randomName = ref('')
  let inviteGenCode = ref('')


  /* computed */
  const peerNetwork = computed(() => {
    return storeAccount.warmPeers
  })

  const inviteList = computed(() => {
    return storeAccount.inviteListGenerated
  })

  const investPending = computed(() => {
    return storeAccount.pendingInvites
  })

  const beebeeMessage = computed(() => {
    return storeAccount.beebeeAccountFeedback
  })

  /* methods */
  const addWarmpeer = () => {
    addWarm.value = !addWarm.value
  }

  const generateInvite = () => {
    if (peerName.value.length > 0) {
      // genInvite.value = !genInvite.value
      const byteBuffer = nameTo32Bytes(peerName.value)
      console.log('32 Byte Buffer:', byteBuffer)

      // Convert byteBuffer to a binary string
      let binaryString = ''
      for (let i = 0; i < byteBuffer.length; i++) {
          binaryString += String.fromCharCode(byteBuffer[i])
      }

      // Encode the binary string to Base64
      const base64String = btoa(binaryString)
      randomName.value = base64String
      let inviteBundle = { name: peerName.value, publickey: storeAccount.networkInfo.publickey, codename: base64String }
      storeAccount.inviteListGenerated.push(inviteBundle)
      // HOP needs to keep track of codename
      storeAccount.shareCodename(inviteBundle)
      /*
      console.log('Base64 String:', base64String) // Log the Base64 string

          // Convert the binary string back to a byte buffer
          const newByteBuffer = binaryStringToByteBuffer(binaryString)
      console.log('New Byte Buffer:', newByteBuffer)


      const originalNameCC = bytesToName(newByteBuffer); // Convert back to name
      console.log('Original Name:', originalNameCC)

      const originalName = bytesToName(byteBuffer) // Convert back to name
      console.log('Original Name:', originalName) */
    }
  }

  const bytesToName =(byteBuffer) => {
    let name = ''
    for (let i = 0; i < byteBuffer.length; i++) {
        name += String.fromCharCode(byteBuffer[i])
    }
    return name
  }

  const binaryStringToByteBuffer = (binaryString) => {
    let byteBuffer = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        byteBuffer[i] = binaryString.charCodeAt(i)
    }
    return byteBuffer
  }

  const copyGenInvite = (codename) => {
    // loop over invite list and match to code name
    let copyInvite = {}
    for (let invite of inviteList.value) {
      if (invite.codename === codename) {
        copyInvite = invite
      }
    }
    inviteGenCode.value = 'hop-' + copyInvite.publickey + '-' + copyInvite.codename
    navigator.clipboard.writeText(inviteGenCode.value)
  }
  
  const removeInvite = (codename) => {
    let updateInvite = []
    for (let invite of inviteList) {
      if (invite.codename !== codename) {
        updateInvite.push(invite)
      }
    }
    storeAccount.inviteListGenerated = updateInvite
  }
  const nameTo32Bytes = (name) => {
    const buffer = new Uint8Array(32) // Create a 32-byte buffer
    for (let i = 0; i < 32; i++) {
        buffer[i] = i < name.length ? name.charCodeAt(i) : 0 // Fill with char codes or pad with 0
    }
    return buffer; // Return the 32-byte buffer
  }

  const sendInviteWarmpeer = () => {
    // send to HOP to save
    // temp
    let peerPair = {}
    peerPair.publickey = newPeerPubKey.value
    peerPair.name = newPeername.value
    peerPair.longterm = true
    peerPair.topic = ''
    peerPair.settopic = false
    peerPair.live = false
    // save to HOP and add
    console.log(peerPair)
    storeAccount.investPending.push(peerPair)
    storeAccount.addPeertoNetwork(peerPair)
    // clear the form
    newPeerPubKey.value = ''
    newPeername.value = ''
  }

  const directConnectPeer = (peer) => {
    // direct peer connect again
  }

  const removePeer = (peer) => {
    // remove peer
    storeAccount.removePeerfromNetwork(peer)

  }

  const copyKey = (key) => {
    navigator.clipboard.writeText(key)
  }

</script>

<style scoped>

#list-space {
  width: 80%;
  min-height: 80vh;
}

.type-peer {
  font-weight: bold;
  padding-left: 2em;
}

.raw-share-live {
  display: grid-inline;
  height: 3em;
}

#network-keys {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  padding: 1em;
}

#add-peer {
  padding: 2em;
}

#add-warm-peer {
  height: 80px;
  margin: 1em;
}

.peer-list-set {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid lightgrey;
  border-radius: 4%;
  margin-left: 1em;
  margin-left: 1em;
  margin-bottom: 1em;
  padding: 2em;
}

.peer-g {
  display: grid;
  grid-template-columns: 6fr 1fr 1fr;
}

#social-graph-space {
  display: grid;
  grid-template-columns: 1fr;
  height: 800px;
  width: 800px;
}

#beebee-message-feedback {
  display: grid;
  grid-template-columns: 1fr;
  color: rgb(221, 20, 47);
  border: 1px solid lightgrey;
  border-radius: 4%;
  margin-left: 1em;
  margin-left: 1em;
  margin-bottom: 1em;
  padding: 2em;
}

#invite-generation-button {
  width: 10em;
  height: 4em;
}

#generate-invite {
  display: grid;
  grid-template-columns: 1fr;
  padding: 2em;
}

#form-invite-code {
  display: grid;
  grid-template-columns: 1fr;
  padding: 2em;
  border: 1px solid lightgrey;
  width: 100%;
}

#invite-peer-crypto {
  display: grid;
  border: 0px solid lightgrey;
}

#send-invite-gen {
  display: grid;
  grid-template-columns: 1fr 3fr 5fr 1fr 1fr;
  border-bottom: 0px solid lightgrey;
  margin-bottom: 1em;
}

#button-copy-invite {
  height: 24px;
}

#button-remove-invite {
  height: 24px;
}

.gen-crypt-code {
  display: grid;
  border: 1px solid lightgrey;
  overflow: hidden;
}

#pending-invites {
  border: 2px solid rgb(208, 211, 240);
  padding: 2em;
}

@media (min-width: 1024px) {

  #list-space {
    width: 80%;
    min-height: 80vh;
  }

  #network-keys {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    border-bottom: 1px solid lightgrey;
  }

  .type-peer {
    display: grid;
    grid-template-columns: 3fr 5fr 1fr;
    font-weight: bold;
    padding-left: 1em;
    padding-bottom: 1em;
    margin-bottom: 1em;
  }

}

</style>