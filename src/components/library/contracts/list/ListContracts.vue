<template>
  <div id="grid-contracts">
    <div class="list-table">
      <div class="table-header">
        <div class="row-header">
          <div class="header-items" v-for="key in props.columns" :key="key.id">
            {{ key }}
          </div>
        </div>
      </div>
      <div class="table-rows">
        <div class="alternate-bk" v-for="entry in props.experiments" :key="entry.id">
          <div class="table-row-columns" v-for="key in props.columns" :key="key.id">
            <div v-if="key !== 'action'">
            {{entry[key]}}
            </div>
            <div v-else>
              <button type="button" class="btn" @click="actionBoard(entry.id, entry)">{{ entry[key] }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  const sortOrders = ref({})

  const props = defineProps({
    experiments: Array,
    columns: Array,
    filterKey: String
  })

  const sortBy = (key) => {
    this.sortKey = key
    this.sortOrders[key] = this.sortOrders[key] * -1
  }

  const actionBoard = (board, NXPcontract) => {
      if (NXPcontract.action === 'View') {
        console.log('view bentoboard and its boxes')
        storeLibrary.prepareLibraryMessage(board, 'networkexperiment')
        // this.$store.dispatch('actionHOPoutState', board)
        // this.$store.dispatch('actionDashboardState', board)
        // close BeeBee
        // this.$store.dispatch('actionBBstate')
      } else {
        console.log('preview')
        // preview network experiment
        // this.$store.dispatch('actionJOINViewexperiment', board)
        // this.refContractLookup()
      }
    }

/*
export default {

  computed: {
    showExperimentList: function () {
      return this.$store.state.experimentListshow
    },
    peerExperimentListlive: function () {
      return this.$store.state.joinedNXPlist
    },
    visDefaults: function () {
      return this.$store.state.visModuleHolder
    },
    selectedOptions: function () {
      return this.$store.state.joinNXPselected
    },
    NXPstatusData: function () {
      return this.$store.state.nxpModulelist
    },
    NXPprogress: function () {
      return this.$store.state.nxpProgress
    },
    ecsMessage: function () {
      return this.$store.state.ecsMessageLive
    },
    filteredExperiments: function () {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var experiments = this.experiments
      if (filterKey) {
        experiments = experiments.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (sortKey) {
        experiments = experiments.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      this.setactiveXNPlist(experiments)
      return experiments
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  data: function () {
    var sortOrders = {}
    this.columns.forEach(function (key) {
      sortOrders[key] = 1
    })
    return {
      shellContract: '',
      sortKey: '',
      sortOrders: sortOrders,
      actionKBundle: {},
      previewSeen: false,
      type: 'chart.js',
      shellID: null,
      moduleCNRL: '',
      moduleType: '',
      mData: '',
      visualRefCont: '',
      messageRemove: false,
      removeNXPid: ''
    }
  },
  methods: {
    sortBy: function (key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    refContractLookup () {
      // create new temp shellID
      this.shellID = '7654321'
      this.mData = '8855332211'
    },
    setactiveXNPlist (nxp) {
      this.$store.dispatch('actionLiveNXPlist', nxp)
    }
  }
}
*/
</script>

<style scoped>
#grid-contracts {
  max-height: 30em;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: 1fr;
  width: 96%;
}

.list-table {
}

.row-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  border: 1px solid lightgrey;
  height: 40px;
}

.header-items {
  align-self: center;
  background-color: lightgrey;
  padding: .4em;
}

.header-items:nth-child(1) {
  width: 21em;
}

.table-rows {
  display: grid;
  grid-template-columns: 1fr;
}

.alternate-bk {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  height: 50px;
  justify-content: bottom;
  background-color: white;
}

.table-row-columns {
  align-self: center;
}

.alternate-bk:nth-child(even) {
  background-color: #ffefd5;
}

.scale-space.active {
  background-color: #4CAF50; /* Green */
}
</style>
