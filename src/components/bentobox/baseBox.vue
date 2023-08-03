<template>
  <div id="bentobox-cell" draggable="true" @dragstart="dragBB">
    <div id="bb-toolbar">A bentobox</div> <!-- :style="{ 'left': boxLocX, 'top': boxLocY }" -->
    <div id="bentobox-holder">
      <div id="bento-past">
        <div id="past-box">past toolbar</div>
        <bar-chart v-if="bbliveStore.chartStyle === 'bar'"></bar-chart>
        <line-chart v-if="bbliveStore.chartStyle === 'line'"></line-chart>
      </div>
      <div id="bento-future">
        <div id="future-box">future toolbar</div>
        <div id="future-live" v-if="futureStatus === true">
          <bar-chart v-if="bbliveStore.chartStyle === 'bar'"></bar-chart>
          <line-chart v-if="bbliveStore.chartStyle === 'line'"></line-chart>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import barChart from '@/components/visualisation/charts/barChart.vue'
import lineChart from '@/components/visualisation/charts/lineChart.vue'
import { ref } from 'vue'
import { computed } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const bbliveStore = bentoboxStore()
  const futureStatus = ref(true)

  let boxLocX = bbliveStore.boxLocation.x + 'px' // bbliveStore.boxLocation.x + 'px'
  const boxLocY = bbliveStore.boxLocation.y + 'px'
  console.log(boxLocX)
  console.log(boxLocY)

  const boxX = computed(() => {
    console.log('uipdated')
    console.log(bbliveStore.boxLocation.x)
    return bbliveStore.boxLocation.x + 'px'
  })

  const boxT = computed(() => {
    console.log('uipdated')
    console.log(bbliveStore.boxLocation.y)
    return bbliveStore.boxLocation.y + 'px'
  })

  const allowDrop = (ev) => {
    ev.preventDefault()
  }

  const dragBB = (ev) => {
    ev.dataTransfer.setData("text", ev.target.id);
  }

  const drop = (ev) => {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }

</script>

<style scoped>

#bentobox-cell {
  border: 2px solid grey;
  width: 40vw;
  height: 40vh;
  left: 0;
  /* top: v-bind(boxLocX);
  left: v-bind(boxLocY); */
}

#bb-toolbar {
  
}

#bentobox-holder {
  border: 1px solid grey;
}

@media (min-width: 1024px) {

  #bentobox-cell {
    display: block;
    width: min-content;
    height: min-content;
    top: v-bind(boxT);
    left: v-bind(boxX);
  }

  #bb-toolbar {
    display: block;
    width: 100%;
    background-color: #fff4f4;
  }

  #bentobox-holder {
    border: 1px solid grey;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  #past-box, #future-box {
    display: block;
  }

  #past-box {
    background-color: rgb(236, 236, 243);
  }

  #future-box {
    background-color:#fff4f4;
  }

  #bento-past {
    border:1px dashed blue;
  }

  #bento-future {
    border:1px dashed orange;
  }

}


</style>