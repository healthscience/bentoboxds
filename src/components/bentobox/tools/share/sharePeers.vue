<template>
  <div id="share-form">
    <form id="ask-ai-form" @submit.prevent="storeAccount.shareProtocol(props.bboxid, 'privatechart')">
      <label for="sharepeer"></label>
      <input type="input" id="sharekey" placeholder="publickey" v-model="storeAccount.sharePubkey" autofocus>
      <button id="share-send" type="submit">
        Send invite
      </button>
    </form>
    <div id="peers-available">
      <h3>Existing peers</h3>
      <select class="share-peer-list" id="peer-options-select" v-model="peerPshare" @change="selectPeerShare()">
        <option selected="" v-for="pp in peerWarmlist" :value="pp.publickey">
          {{ pp.publickey }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { accountStore } from '@/stores/accountStore.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAccount = accountStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()

  let peerPshare = ref('')

  /*  computed */
  const spaceList = computed(() => {
    return storeBentobox.spaceList
  })

  /* methods */
  const selectPeerShare = () => {
    storeAccount.sharePubkey = peerPshare.value 
  }
</script>

<style scoped>

</style>