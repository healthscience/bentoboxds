<template>
    <div id="cues-holistic">
    <button class="cue-select-btn" id="simple-wheel" @click="selectCue('simple')" v-bind:class="{ active: wheelType === 'simple' }">Holistic</button>
    <button class="cue-select-btn" id="simple-segments" @click="selectCue('segments')" v-bind:class="{ active: wheelType === 'segments' }">Segments</button>
    <button class="cue-select-btn" id="simple-segments" @click="selectCue('aging')" v-bind:class="{ active: wheelType === 'aging' }">Longevity</button>
  </div>
  <div id="view-cues">
    <div class="pie" v-if="cueType === 'simple'">
      <pie-chartcues :cueType="'simple'" :chartData="cuesHolistic" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
    </div>
    <div class="pie-segments" v-if="cueType === 'segments'">
      <pie-chartcues :cueType="'segments'" :chartData="cuesSegments" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
    </div>
    <div class="pie-segments" v-if="cueType === 'aging'">
      <pie-chartcues :cueType="'aging'" :chartData="cuesData" :options="{}" @segmentClick="cueSelect"></pie-chartcues>
      Source: <a href="https://peterattiamd.com/the-challenges-of-defining-aging/" target="_blank">All marks of aging</a>
    </div>
  </div>
</template>

<script setup>
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'
import { ref, computed } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'

  const storeCues = cuesStore()

  let cueType = ref('')
  let pathCues = ref(false)
  let stagesLive = ref([])
  let wheelType = ref('')
  let cueActive = ref('')


  const cuesHolistic = computed(() => {
    return storeCues.hopCues
  })

  const cuesSegments = computed(() => {
    return storeCues.cuesSegments
  })

  const cuesData = computed(() => {
    return storeCues.longevityCues
  })

  /* methods */
  const selectCue = (type) => {
    console.log('wheel' + type)
    cueType.value = type
  }

  const cueSelect = async (segType, segInfo) => {
    console.log('event from cue seg')
    // match seg to data set
    cueActive.value = 'segdown'
    if (segInfo.label === 'Nature') {
      storeCues.activeDougnnutData = cuesNature
    } else if (segInfo.label === 'Environment') {
      storeCues.activeDougnnutData = cuesNature
    } else if (segInfo.label === 'Culture') {
      storeCues.activeDougnnutData = cuesNature
    } else if (segInfo.label === 'Life') {
      storeCues.activeDougnnutData = cuesLife
    }
  }

</script>


<style scoped>

@media (min-width: 1024px) {


}

</style>