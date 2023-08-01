<template>
  <div id="bentobox-cell">
    <header>A bentobox</header>
    <div id="bentobox-holder">
      <div id="bento-past">
        <header>past</header>
        <bar-chart v-if="bbliveStore.chartStyle === 'bar'"></bar-chart>
        <line-chart v-if="bbliveStore.chartStyle === 'line'"></line-chart>
      </div>
      <div id="bento-future">
        <header>future</header>
      </div>
    </div>
  </div>
</template>

<script setup>
import barChart from '@/components/visualisation/charts/barChart.vue'
import lineChart from '@/components/visualisation/charts/lineChart.vue'
// import { ref } from 'vue'
// import { computed } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

 const bbliveStore = bentoboxStore()

</script>

<style scoped>
#bentobox-cell {
  border: 2px solid grey;
  width: 20vw;
  height: 20vh;
}

#bentobox-holder {
  border: 1px solid grey;
}

@media (min-width: 1024px) {

  #bentobox-cell {
    border: 2px solid grey;
  }

  #bentobox-holder {
    border: 1px solid grey;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  #bento-past {
    border:1px solid blue;
  }

  #bento-future {
    border:1px solid orange;
  }

}


</style>