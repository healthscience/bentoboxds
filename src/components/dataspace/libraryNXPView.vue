<template>
  <div id="live-network-experiment">Peer experiments
    <div id="show-nxplists" v-if="spaceType === 'Boards'">
      <list-contracts v-if="spaceState === 'private' && peerNXPlib.data?.length > 0"
        class="experiment-info"
        :experiments="peerNXPlib.data"
        :columns="peerNXPlib.columns"
        :filter-key="searchQuery">
      </list-contracts>
      <!--<start-experience id="start-demo-nxp" v-else></start-experience>-->
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// import StartExperience from '@/components/beebeeView/library/StartExperience.vue'
import ListContracts from '@/components/library/contracts/list/ListContracts.vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  const spaceType = ref('Boards')
  const spaceState = ref('private')
  const searchQuery = ref('')

  // a computed ref
  const peerNXPlib = computed(() => {
    return storeLibrary.peerExperimentList
  })

/*
export default {
  name: 'LiveNetwork',
  components: {
    StartExperience,
    ListContracts
  },
  computed: {
    showExperimentList: function () {
      return this.$store.state.experimentListshow
    },
    peerExperimentListlive: function () {
      return this.$store.state.joinedNXPlist
    },
    networkNXPListlive: function () {
      return this.$store.state.NXPexperimentList
    },
    searchQuery: function () {
      return this.$store.state.searchQuery
    },
    nxpView: function () {
      return this.$store.state.viewNXP
    },
    nxpState: function () {
      return this.$store.state.nxpState
    },
    spaceType: function () {
      return this.$store.state.spaceType
    },
    spaceState: function () {
      return this.$store.state.spaceState
    },
    spaceStateShow: function () {
      return this.$store.state.spaceStateShow.state
    }
  },
  data () {
    return {
      isModalNewNetworkExperiment: false
    }
  },
  methods: {
  }
}
*/
</script>

<style scoped>
#live-network-experiment {
  width: 100%;
  z-index: 23;
  border: 0px dashed blue;
}

.nxplist-showspace {
  padding-left: 2em;
}

.nxplist-space.active {
  font-size: 1.2em;
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 6px 14px;
  margin-right: 2em;
  margin-left: 2em;
  text-align: center;
}

.nxp-experimentslist {
  padding: 1em;
}

.experiment-info {
  border: 0px solid grey;
  text-align: center;
}

</style>