<template>
  <vue-resizable
    class="resizable"
    ref="resizableComponent"
    :dragSelector="dragSelector"
    :active="handlers"
    :fit-parent="fit"
    :max-width="maxW | checkEmpty"
    :max-height="maxH | checkEmpty"
    :min-width="minW | checkEmpty"
    :min-height="minH | checkEmpty"
    :width="width"
    :height="height"
    :left="left"
    :top="top"
    @mount="eHandler"
    @resize:move="eHandler"
    @resize:start="eHandler"
    @resize:end="eHandler"
    @drag:move="eHandler"
    @drag:start="eHandler"
    @drag:end="eHandler"
  >
    <div class="drag-container-1">
      <div id="bb-toolbar">
        <div class="bb-bar-main">a bentobox active</div>
        <div class="bb-bar-main"><button id="network-vis">social</button></div>
        <div class="bb-bar-main"><button id="network-map">map</button></div>
        <div class="bb-bar-main"><button id="bb-copy">copy</button></div>
      </div> 
    </div>
    <div id="bentobox-cell">
      <div id="bb-network-graph">Network</div>
      <div id="bb-world-map">map</div>
      <div id="bentobox-holder">
        <div id="network-bentobox">
          network bentobox
        </div>
        <div id="peer-bentobox">
          <div id="bento-past">past
            <div id="past-box">past toolbar <button id="full-past-toolbar">full</button></div>
            <bar-chart v-if="bbliveStore.chartStyle === 'bar'"></bar-chart>
            <line-chart v-if="bbliveStore.chartStyle === 'line'"></line-chart>
          </div>
          <div id="bento-future">future
            <div id="future-box">future toolbar <button id="full-future-toolbar">full</button></div>
            <bar-chart v-if="bbliveStore.chartStyle === 'bar'"></bar-chart>
            <line-chart v-if="bbliveStore.chartStyle === 'line'"></line-chart>
          </div>
        </div>
      </div>
    </div>
    <div id="bb-expand-size">modules ^</div>
  </vue-resizable>
</template>

<script setup>
import VueResizable from 'vue-resizable'
import barChart from '@/components/visualisation/charts/barChart.vue'
import lineChart from '@/components/visualisation/charts/lineChart.vue'
import { ref, computed, onMounted } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const bbliveStore = bentoboxStore()
  const futureStatus = ref(true)

  /* drag drop move resize */
  const tW = 440
  const tH = 440
  const handlers = ref(["r", "rb", "b", "lb", "l", "lt", "t", "rt"])
  let left = ref(`calc( 50% - ${tW / 2}px)`)
  let top = ref(`calc(50% - ${tH / 2}px)`)
  let height = ref('fit-content')
  let width = ref('fit-content')
  let maxW = ref('100%')
  let maxH = ref('100%')
  let minW = ref('20vw')
  let minH = ref('20vh')
  let fit = ref(true)
  let event = ref('')
  const dragSelector = ref('.drag-container-1, .drag-container-2')

  const eHandler = (data) => {
    width = data.width;
    height = data.height;
    left = data.left;
    top = data.top;
    event = data.eventName;
  }

  const checkEmpty = computed((value) => {
    return typeof value !== "number" ? 0 : value;
  })


  const boxLocX = bbliveStore.boxLocation.x + 'px' // bbliveStore.boxLocation.x + 'px'
  const boxLocY = bbliveStore.boxLocation.y + 'px'

  const boxX = computed(() => {
    return bbliveStore.boxLocation.x + 'px'
  })

  const boxT = computed(() => {
    return bbliveStore.boxLocation.y + 'px'
  })

  const dragBB = (ev) => {
    ev.dataTransfer.setData("text", ev.target.id)
  }

</script>

<style scoped>

#bentobox-cell {
  display: block;
  border: 0px solid grey;
}

#bb-toolbar {
  display: grid;
  grid-template-columns: 5fr 1fr 1fr 1fr;
}

#bb-network-graph {
  display: none;
}

#bb-world-map {
  display: none;
}

#bentobox-holder {
  position: relative;
  border: 1px solid rgb(128, 128, 128);
}

#peer-bentobox {
  position: relative;
  border: 1px solid grey;
  display: grid;
  grid-template-columns: 1fr;
  margin: 1em;
}

#bento-past {
  position: relative;
  border: 2px dashed blue;
  min-width: 10vw;
  min-height: 10vh;
}

#bento-future {
  position: relative;
  border:1px dashed orange;
  min-width: 10vw;
  min-height: 10vh;
}


#bb-expand-size {
  display: block;
  width: 100%;
  background-color: red;
}

@media (min-width: 1024px) {

  .resizable {
    background-position: top left;
    width: 150px;
    height: 150px;
    padding: 0;
    border: 4px solid #a6ff00;
    font-weight: normal;
    color: #0d0d0d;
    position: relative;
  }

  .drag-container-1,
  .drag-container-2 {
    width: 100%;
    height: 40px;
    background: rgb(141, 145, 226);
    color: white;
    text-align: center;
    cursor: pointer;
  }

  #bentobox-cell {
    display: block;
    min-height: inherit;
    min-width: inherit;
  }

  #bb-toolbar {
    display: grid;
    grid-template-columns: 5fr 1fr 1fr 1fr;
    width: 100%;
    background-color:rgb(141, 145, 226);
  }

  #bb-network-graph {
    display: none;
  }

  #bb-world-map {
   display: none;
  }

  #bentobox-holder {
    position: relative;
    border: 1px solid blue;
    display: grid;
    grid-template-columns: 1fr;
    background-color: beige;
    /* min-height: inherit;
    min-width: inherit; */
  }

  #peer-bentobox {
    position: relative;
    border: 1px solid grey;
    display: grid;
    grid-template-columns: 1fr 1fr;
    margin: 1em;
  }

  #network-bentobox {
    border: 1px solid grey;
    display: none;
    grid-template-columns: 1fr 1fr;
    margin: 1em;
  }

  #past-box, #future-box {
    position: relative;
    border:1px dashed blue;
  }
  
  #past-box {
    background-color: rgb(236, 236, 243);
  }

  #future-box {
    background-color:#fff4f4;
  }

  #bento-past {
    position: relative;
    border:1px dashed blue;
    height: auto;
    width: auto;
  }

  #bento-future {
    position: relative;
    border: 2px dashed orange;
    height: auto;
    width: auto;
  }

  #bb-expand-size {
    position: relative;
    width: 100%;
    height: 40px;
    background-color: rgb(141, 145, 226);
  }

}


</style>