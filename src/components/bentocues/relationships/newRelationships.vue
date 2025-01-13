<template>
  <div id="cue-relationships" class="pie">
    <div id="rel-tools">
      tools
    </div>
    <div id="rel-columns">
      <div id="rel-one">
        <div id="select-cue-a">
          Select a Cue
          <div class="cues-list" v-for="whCue in cuesList">
            <button  v-bind:class="{ active: cueSelect[whCue.key]?.active === true}" @click="selectCue(whCue)">{{ whCue.value.concept.name }}</button>
          </div>
        </div>
        <div id="doughnut-size-add" v-if="columnA === 'cueA'">
          <pie-chartcues v-if="cuesNew.labels.length > 0" :cueType="'view'" :chartData="cuesColA" :options="{}" @segmentClick="cueSelectAdd"></pie-chartcues>
        </div>
      </div>
      <div id="relationship-glue">
        Relationship
        <div id="connection-glue">
          <button v-bind:class="{ active: glueMatch === 'down'}" @click="glueType('down')">Down</button>
          <button v-bind:class="{ active: glueMatch === 'up'}" @click="glueType('up')">Up</button>
          <button v-bind:class="{ active: glueMatch === 'equal' }" @click="glueType('equal')">Equal</button>
          <button v-bind:class="{ active: glueMatch === 'unknown' }" @click="glueType('unknown')">Unknown</button>
          <button v-bind:class="{ active: glueMatch === 'compute' }" @click="glueType('compute')">Compute</button>
        </div>
      </div>
      <div id="rel-two">
        <div id="match-type">
          <div class="match-source" @click="matchStyle('cue')" v-bind:class="{ active: matchType === 'cue' }">Cues</div>
          <div class="match-source" @click="matchStyle('media')">Media</div>
          <div class="match-source" @click="matchStyle('research')">Research</div>
          <div class="match-source" @click="matchStyle('marker')">Markers</div>
          <div class="match-source" @click="matchStyle('product')">Product</div>
        </div>
        <div id="select-cue-a" v-if="matchType === 'cue'">
          Select a cue please
          <!-- existing cues -->
          <div class="cues-list" v-for="whCue in cuesList">
            <button  v-bind:class="{ active: cueSelectRel[whCue.key]?.active === true}" @click="selectCueRel(whCue.key)">{{ whCue.value.concept.name }}</button>
          </div>
        </div>
      </div>
    </div>
    <div id="glue-relationship">
      <div id="glue-wheel">
        <div id="doughnut-size-add" v-if="columnB === true">bb {{ cuesColB }}
          <pie-chartcues v-if="cuesColB?.labels?.length > 0" :cueType="'view'" :chartData="cuesColB" :options="{}" @segmentClick="cueSelectAdd"></pie-chartcues>
        </div>
      </div>
      selected {{ cueSelect }} -- {{ glueMatch }} --- {{ cueSelectRel }}8888
      <button id="glue-type-button" @click="mapGlue">Glue relationship</button>
    </div>
    <div id="beebee-feedback" v-if="feedbackCount > 0">
      {{ feedbackBeeBee }}
    </div>
  </div>
</template>

<script setup>
import hashObject from 'object-hash'
import { ref, computed } from 'vue'
import CuesPrepared from '@/components/bentocues/prepareCues.vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { cuesStore } from '@/stores/cuesStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  const storeCues = cuesStore()

  let columnA = ref(false)
  let columnB = ref(false)
  let matchType = ref('cue')
  let cSegment = ref('')
  let wheelActive = ref([])
  let cuePrimary = ref('')
  let glueMatch = ref('')
  let cueSelect = ref({})
  let cueSelectRel = ref({})
  let primeCue = ref('')
  let feedbackBeeBee = ref({})
  let feedbackCount = ref(0)

  /*  computed  */
  const cuesColA = computed(() => {
    return storeCues.cueColumnA
  })

  const cuesColB = computed(() => {
    return storeCues.cueColumnB
  })

  const cuesList = computed(() => {
    return storeCues.cuesList // cuesmenuList
  })

  const secondWheel = computed(() => {
    return storeCues.activeDougnnutData
  })


  /* methods */
  const cueSelectAdd = (type, seg) => {
    console.log('select label')
    console.log(type)
    console.log(seg.chart.$context.chart.tooltip.dataPoints[0])
    let labelA = seg.chart.$context.chart.tooltip.dataPoints[0].label
  }

  const mapGlue = () => {
    // loop over to extract keys of mappings
    feedbackCount.value = 0
    feedbackBeeBee.value = {}
    // check three parts exist
    if (Object.keys(primeCue.value).length === 0) {
      feedbackBeeBee.value.primecue = 'Please select a primary cue'
      feedbackCount.value++
    }
    if (glueMatch.value === '') {
      feedbackBeeBee.value.glue = 'Please select a glue'
      feedbackCount.value++
    }
    if (Object.keys(cueSelectRel.value).length === 0) {
      feedbackBeeBee.value.cueRel = 'Please cues to map a relationship with'
      feedbackCount.value++
    }
    if (feedbackCount.value === 0) {
      let relCueActive = []
      let keyCues = Object.keys(cueSelectRel.value)
      for (let mcue of keyCues) {
        if (cueSelectRel.value[mcue].active === true) {
          relCueActive.push(mcue)
        }
      }
      let relTriplet = {}
      relTriplet.contract = primeCue.value
      let glueRel = {}
      glueRel[glueMatch.value] = relCueActive
      relTriplet.relationships = glueRel // { glue: glueMatch.value, cues: relCueActive }
      const cueContract = {}
      cueContract.type = 'library'
      cueContract.action = 'cues'
      cueContract.reftype = 'relationship'
      cueContract.task = 'UPDATE'
      cueContract.privacy = 'public'
      cueContract.data = relTriplet
      console.log(cueContract)
      storeLibrary.sendMessage(cueContract)
      // need to update rel cue contract with opposite relationship, e.g  down to up  
      // reset the form
      primeCue.value = {}
      glueMatch.value = ''
      cueSelectRel.value = {}
    }
  }

  const expandWheel = (wheel) => {
    cSegment.value = wheel.name
    wheelActive = wheel.relationship.labels
  }

  const matchStyle = (mstyle) => {
    matchType.value = mstyle
  }

  const selectCue = (cueKey) => {
    if (cueSelect.value[cueKey.key] === undefined) {
      cueSelect.value[cueKey.key] = { active: false}
    }
    primeCue.value = cueKey
    cueSelect.value[cueKey.key].active = !cueSelect.value[cueKey.key].active
    if (cueSelect.value[cueKey.key].active === false) {
      // clear the pie wheel
      storeCues.cueColumnB = {}
      // reset rel cues to false
      let relCues = Object.keys(cueSelectRel.value)
      for (let rc of relCues) {
        cueSelectRel.value[rc].active = false
      }
      // reset glue to empty
      glueMatch.value = {}
    } else {
      // loook up for existing cue relationships and form cue wheel
      let cueRelDisplay = storeCues.cueDisplayBuilder(cueKey.key, cueKey, storeCues.cueColumnB)
      storeCues.cueColumnB = cueRelDisplay
      columnB.value = true
    }
  }

  const selectCueRel = (cueKey) => {
    if (cueSelectRel.value[cueKey.key] === undefined) {
      cueSelectRel.value[cueKey] = { active: false}
    }
    cueSelectRel.value[cueKey].active = !cueSelectRel.value[cueKey].active
    // add to data for pie-chart
    let cueContract = {}
    for (let c of storeCues.cuesList) {
      if (c.key === cueKey) {
        cueContract = c
      }
    }
    // first time add or existing?
    if (storeCues.cueColumnB.length > 0) {
      let cueRelDisplay = storeCues.cueDisplayBuilder(primeCue.value.key, cueContract, storeCues.cueColumnB[0])
      storeCues.cueColumnB = cueRelDisplay
    } else {
      let cueRelDisplay = storeCues.cueDisplayBuilder(primeCue.value.key, cueContract, storeCues.cueColumnB)
      storeCues.cueColumnB = cueRelDisplay
    }
    columnB.value = true
  }

  const selectCueMatch= (cue) => {
    // make this cue color green ie active
    cuePrimary.value = cue
  }

  const glueType = (glue) => {
    glueMatch.value = glue
  }

</script>

<style scoped>

#cue-relationships {
  display: grid;
  grid-template-columns: 1fr;
  margin: 2em;
}

#rel-columns {
  display: grid;
  grid-template-columns: 1fr;  
}

#relationship-glue {
  display: grid;
}

#connection-glue {
  display: grid;
  grid-template-columns: 1fr;
}

#glue-relationship {
  border: 2px solid green;
  justify-self: center;
}

#glue-type-button {
  margin-top: 1em;
  font-size: 1.2em;
}

#match-type {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  margin-bottom: 1em;
}

.match-source {
  border: 1px solid lightblue;
  margin-left: .6em;
  margin-right: .6em;
  padding-left: .6em;
  padding-right: .6em;
}

.expand-wheel {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid lightblue;
  margin-left: 1em;
  margin-bottom: .4em;
  cursor: pointer;
}


.active {
  background-color: rgb(113, 172, 114);
}

@media (min-width: 1024px) {

  #rel-columns {
    display: grid;
    grid-template-columns: 4fr 1fr 4fr;
    border: 2px solid red;
    min-height: 200px;
  }

  #rel-one {
    border: 1px solid blue;
  }

  #relationship-glue {
    display: grid;
    grid-template-columns: 1fr;
    border: 2px solid purple;
  }

}
</style>
