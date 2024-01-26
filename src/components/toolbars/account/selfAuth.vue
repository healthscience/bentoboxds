<template>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal-auth :show="accountBoxStatus" @close="closeAccount">
      <template #header>
        <!-- The code below goes into the header slot -->
        <div id="space-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closedataBox"
            aria-label="Close modal"
          >
            Close
          </button>
          <div id="return-modal-close" @click="closeAccount">return</div>
        </div>
        <div>Account</div>
      </template>
      <template #body>
        <div id="connect-wallet">
          <div id="self-verify">
            <form id="self-signin-form" >
              <div class="self-inputs">
                <label class="form-couple-type" for="password-account">password</label>
                <input class="form-couple" type="password" id="password" name="password" v-model="selfpwInput">
                <button id="self-auth" @click.prevent="selfVerify">Self Verify</button>
              </div>
            </form>
          </div>
        </div>
      </template>
      <template #connect>connect
        <!-- <div id="network-status" v-if="peerauth === true">
          <div class="status-info">
            Connection Status: <div class="hon-square-status" v-bind:class="{ active: connectNetworkstatus === true && peerauth === true }"></div>
          </div>
          <div class="status-info">
            Warm peers connected: {{ warmPeers.length }}
          </div>
          <div v-if="peerauth === true" class="status-info">
            <button class="buttonspaces" @click.prevent="closeModal">go to bento spaces</button>
          </div>
        </div>-->
      </template>
      <template #tabs>tabs
        <account-tabs v-if="storeAccount.peerauth === true"></account-tabs>
      </template>
      <template #footer>
      </template>
    </modal-auth>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalAuth from '@/components/toolbars/account/authModal.vue'
import AccountTabs from '@/components/toolbars/account/accountTabs.vue'

import { accountStore } from '@/stores/accountStore.js'

  const storeAccount = accountStore()

  let selfpwInput = ref('')

  const closeAccount = () => {
    storeAccount.accountStatus = !storeAccount.accountStatus
  }

  const selfVerify = () => {
    // need to setup pub/private key schnorr sign utilities
    storeAccount.peerauth = true
  }

  const accountBoxStatus = computed(() => {
    return storeAccount.accountStatus
  })
</script>

<style scoped>

@media (min-width: 1024px) {

}

</style>