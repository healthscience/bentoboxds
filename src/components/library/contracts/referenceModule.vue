<template>
  <div id="reference-tools">
    <div id="task-select">
      <div class="contract-task">
        <button id="get-referencecontract" @click.prevent="getRefContracts()">Get Ref. Contract</button>
      </div>
      <!-- <div class="view-refconts">
        <button id="build-modulecontracts" @click.prevent="makeModulecontracts()">Make modules</button>
      </div> -->
      <div class="contract-task">
        <button id="build-new-referencecontract" @click.prevent="newSetRefContract(startRefContract)">{{ startRefContract.text }}</button>
      </div>
    </div>
    <header>Reference Contracts</header>
    <div id="ref-contracts-view">
      <div class="view-contract">
        <button id="datatypesCNRL" @click.prevent="viewRefContracts('datatype')">datatypes</button>
      </div>
      <div class="view-contract">
        <button id="computeCNRL" @click.prevent="viewRefContracts('compute')">compute</button>
      </div>
      <!-- <div class="view-contract">
        <button id="unitsCNRL" @click.prevent="viewRefContracts(CNRLunitseen.text)"> {{ CNRLunitseen.text }}</button>
      </div> -->
      <div class="view-contract">
        <button id="packaingCNRL" @click.prevent="viewRefContracts('packaging')">Data Packaging</button>
      </div>
      <div class="view-contract">
        <button id="visualiseRefs" @click.prevent="viewRefContracts('visualise')">Visualise</button>
      </div>
    </div>
    </div>
    <header>Module Contracts</header>
    <div id="module-contracts">
      <div class="mod-contracts-view">
        <button  id="experimentCNRL" @click.prevent="viewRefContracts('experiment-public')">modules-public</button>
      </div>
      <div class="mod-contracts-view">
        <button id="moduleRefs" @click.prevent="viewRefContracts('modules-public')">modules-public</button>
      </div>
      <div class="mod-contracts-view">
        <button  id="experimentCNRL" @click.prevent="viewRefContracts('peer-experiment')">peer-experiment</button>
      </div>
      <div class="mod-contracts-view">
        <button id="moduleRefs" @click.prevent="viewRefContracts('peer-modules')">peer-modules </button>
      </div>
    </div>
    <div id="ledger-view">
      <!--<div class="mod-contracts-view">
        <button id="peer-results" @click.prevent="viewRefContracts(peerResults.text)"> {{ peerResults.text }}</button>
      </div>
      <div class="mod-contracts-view">
        <button id="peer-kbl" @click.prevent="viewRefContracts(peerKBL.text)"> {{ peerKBL.text }}</button>
      </div>-->
    </div>
    <view-reference v-if="referenceState === true" :refTypeLive="referenceLive"></view-reference>
    <!--<view-results v-if="startRefContract.active !== true && referenceLive === 'peer-results'" :refTypeLive="referenceLive"></view-results>
    <view-ledger v-if="startRefContract.active !== true && referenceLive === 'peer-KBL'" :refTypeLive="referenceLive"></view-ledger>
    <new-refcontract v-if="startRefContract.active"></new-refcontract>-->
</template>

<script setup>
import ViewReference from '@/components/library/contracts/viewReference.vue'
import { ref, computed, toDisplayString } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()


  /* data */
  let referenceLive = ref('')
  let referenceState = ref(false)

  let statusContract = ref(
    {
      active: false,
      text: 'Reference'
    }
  )

  let startRefContract = ref(
    {
      active: false,
      text: 'New Reference Contract'
    }
  )

  /* methods */

  const newSetRefContract = (ap) => {
      // set describe data tools hidden
      this.$store.dispatch('actionDatadescribe', false)
      if (this.startRefContract.active === false) {
        this.startRefContract.active = true
        this.startRefContract.text = 'close'
      } else {
        this.startRefContract.active = false
        this.startRefContract.text = 'New ref. contract'
      }
    }

    const getRefContracts = () => {
      statusContract.active = true
      // referenceLive.value = 'datatype'
      // ask network library for contracts via HOP
      storeLibrary.sendMessage('get-library')
    }

    const viewRefContracts = (type) => {
      console.log('view ref cont type')
  
      // ask network library for contracts for this peer
      referenceLive.value = type
      referenceState.value = true
      console.log(referenceLive.value)
      console.log(referenceState.value)
    }

    const makeModulecontracts = () => {
      const refModContract = {}
      refModContract.type = 'library'
      refModContract.reftype = 'module'
      refModContract.action = 'contracts'
      refModContract.task = 'PUT'
      const refModJSON = JSON.stringify(refModContract)
      // ask network library for contracts for this peer
      this.$store.dispatch('actionMakeModuleRefContract', refModJSON)
    }

    const makeVisuailsecontracts = () => {
      const refVisContract = {}
      refVisContract.reftype = 'visualise'
      refVisContract.action = 'PUT'
      const refVisJSON = JSON.stringify(refVisContract)
      // ask network library for contracts for this peer
      this.$store.dispatch('actionMakeVisualiseRefContract', refVisJSON)
    }

</script>

<style scoped>

#reference-tools {
  display: grid;
  grid-template-columns: 1fr;
  background-color: antiquewhite;
}

#task-select {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#ref-contracts-view {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

#module-contracts {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

@media (min-width: 1024px) {



}

</style>