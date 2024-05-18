<template>
  <div id="bentobox-quants" ref="bentoboxQuants" @mouseup.prevent="EndDrag()" @mousemove.prevent="OnDrag($event)">
    <div id="bentobox-tools">
      <box-tools :bboxid="props.bboxid"></box-tools>
      <div id="network-bentobox">
        <div id="bb-network-graph">Network graph</div>
        <div id="bb-world-map">map open street</div>
      </div>
      <!--<div class="drag-container-1">
        <div id="bb-toolbar">
          <div class="bb-bar-main">a bentobox active</div>
          <bb-tools v-if="boxToolsShow" :bboxid="props.bboxid"></bb-tools>
          <div class="bb-bar-main"><button id="network-vis">social</button></div>
          <div class="bb-bar-main"><button id="network-map">map</button></div>
          <div class="bb-bar-main"><button id="bb-copy">copy</button></div>
        </div>
      </div> -->
      <div id="bentobox-mini"> <!-- switch on of bentobox quants -->
        <div id="bentobox-row">
          <div id="bentobox-now" class="mini-quant-off" @click="bentoboxQuant('n')"  v-bind:class="{ active: quantSelect['now'] }">
            n
          </div>
          <div id="bentobox-future" class="mini-quant-off"  @click="bentoboxQuant('f')" v-bind:class="{ active: quantSelect['future'] }">
            f
          </div>
        </div>
        <div id="bentobox-row">
          <div id="network-bentobox-now" class="mini-quant-off"  @click="bentoboxQuant('nn')" v-bind:class="{ active: quantSelect['nnow'] }">
            nn
          </div>
          <div id="network-bentobox-future" class="mini-quant-off"  @click="bentoboxQuant('nf')" v-bind:class="{ active: quantSelect['nfuture'] }">
            nf
          </div>
        </div>
      </div>
    </div>
    <div id="box-now" ref="nowBBox" class="bentobox-cell">
      <div id="bentobox-network">
        <div id="bb-network-graph">Network</div>
        <div id="bb-world-map">map</div>
        <div id="bentobox-holder">
          <div id="network-bentobox">
            network bentobox
          </div>
        </div>
      </div>
      <div id="bento-past" v-if="quantSelect['now']">
        <!--<div id="past-box">past toolbar <button id="full-past-toolbar">Tools</button></div>-->
        <bar-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'bar'" :chartData="chartData"></bar-chart>-
        <line-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'line'" :chartData="chartData"></line-chart>

      </div>
    </div>
    <div id="vertdragbar" @mousedown="StartRightDrag()"></div> <!-- vertical slider -->
    <div  id="box-future" ref="futureBBox" class="bentobox-cell">
      <div id="bentobox-network">
        <div id="bb-network-graph">Network</div>
        <div id="bb-world-map">map</div>
        <div id="bentobox-holder">
          <div id="network-bentobox">
            network bentobox
          </div>
        </div>
      </div>
      <div id="bento-future" v-if="quantSelect['future']">
        <!--<button id="full-future-toolbar" @click="predictFuture()">Predict</button>-->
        <!-- <div id="future-box">future toolbar <button id="full-future-toolbar">full</button></div>-->
        <bar-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'bar'" :chartData="chartfutureData" ></bar-chart>
        <line-chart v-if="storeBentobox.chartStyle[props.bboxid] === 'line'" :chartData="chartfutureData"></line-chart>
      </div>
    </div>
    <div id="expand" @mousedown="StartExpandDrag()"></div>
    <div id="bentobox-modules">
      <div id="bb-expand-size" @click="expandModules">modules v</div>
      <modules-list v-if="modulesShow" :bboxid="props.bboxid"></modules-list>
    </div>
  </div>
</template>

<script setup>
import { now, useToString } from '@vueuse/core'
import BoxTools from '@/components/bentobox/tools/boxTools.vue'
import barChart from '@/components/visualisation/charts/barChart.vue'
import lineChart from '@/components/visualisation/charts/lineChart.vue'
import ModulesList from '@/components/bentobox/modules/modulesList.vue'
import { ref, computed, onMounted, nextTick } from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeLibrary = libraryStore()
  
  let bentoboxQuants = ref(null)
  let nowBBox = ref(null)
  let futureBBox = ref(null)
  let modulesShow = ref(false)
  let modelFuture = ref('')
  let quantSelect = ref(
    { now: true, future: false, nnow: false, nfuture: false })
  let isRightDragging = ref(false)
  let isExpandDragging = ref(false)

  const props = defineProps({
    bboxid: String
  })

  let event = ref('')
  let timerPress = ref(0)

  /* methods */
  const bentoboxQuant = (quant) => {
    if (quant === 'n') {
      quantSelect.value.now = !quantSelect.value.now
    } else if (quant === 'f') {
      quantSelect.value.future = !quantSelect.value.future
    } else if (quant === 'nn') {
      quantSelect.value.nnow = !quantSelect.value.nnow
    } else if (quant === 'nf') {
      quantSelect.value.nfuture = !quantSelect.value.nfuture
    }
  }

  const SetCursor = (cursor) => {
      let page = bentoboxQuants.value
      page.style.cursor = cursor
    }

    const StartRightDrag = () => {
      isRightDragging.value = true
      SetCursor("ew-resize")
    }

    const StartExpandDrag = () => {
      isExpandDragging.value = true
      SetCursor("ns-resize")
    }

    const EndDrag = () => {
      isRightDragging.value = false
      isExpandDragging.value = false
      SetCursor("default")
    }

    const OnDrag = async (event) => {
      if(isExpandDragging.value) {
        let page = bentoboxQuants.value
        let leftcol = nowBBox.value
        let rightcol = futureBBox.value
      

        let leftColHeight = isExpandDragging ? event.clientY : event.clientY
        let rightColHeight = isExpandDragging ? event.clientY : event.clientY
        console.log(event.clientY)
        let dragbarHeight = 6
        
        let rows = [
          '20',
          leftColHeight,
          '6',
          '20'
        ]
        
        let updateString = ''
        let newColDefn = rows.map(c => {
          let pv = useToString(c)
          let newPv = (pv.value + "px")
          updateString = updateString + ' ' + newPv
          return updateString
        })
        console.log(newColDefn)
        page.style.gridTemplateRows = newColDefn.pop()
        // chart.canvas.parentNode.style.height = leftColHeight
        event.preventDefault()
      }

      if(isRightDragging.value) {
        let page = bentoboxQuants.value
        let leftcol = nowBBox.value
        let rightcol = futureBBox.value	

        let leftColWidth = isRightDragging ? event.clientX : leftcol.clientWidth
        let rightColWidth = isRightDragging ? page.clientWidth - (6) - leftColWidth : 500
        
        let dragbarWidth = 6
        
        let cols = [
          leftColWidth,
          dragbarWidth,
          rightColWidth // calc of left size for grid
        ]

        let updateString = ''
        let newColDefn = cols.map(c => {
          let pv = useToString(c)
          let newPv = (pv.value + "px")
          updateString = updateString + ' ' + newPv
          return updateString
        })
        page.style.gridTemplateColumns = newColDefn.pop()
        // chart.canvas.parentNode.style.width = leftColWidth
        event.preventDefault()
      }
    }


  /* computed */
  const checkEmpty = computed((value) => {
    return typeof value !== "number" ? 0 : value
  })

  /* data flow work */
    // const dataValues = ref([2, 4, 7])
    const dataValues = computed(() => {
    return storeAI.tempNumberData[props.bboxid]
  })

  const dataLabel = computed(() => {
    return storeAI.tempLabelData[props.bboxid]
  })

   const chartData = computed(() => {
    return storeAI.visData[props.bboxid]
    /* {
      // labels: dataLabel.value, // [ 'January', 'February', 'March' ],
      // datasets: [ { data: dataValues.value } ]
    } */
   })

   const boxToolsShow = computed(() => {
    return storeBentobox.boxtoolsShow[props.bboxid]
  })

  const computeList = computed(() => {
    return storeLibrary.publicLibrary.referenceContracts.compute
  })
  
  /*
  * predict future
  */
  const predictFuture = () => {
    console.log(modelFuture.value)
    storeAI.prepareFuture(props.bboxid)
  }

  const futureBox = computed(() => {
    return storeAI.activeFuture[props.bboxid]
  })

  const futuredataValues = computed(() => {
    return storeAI.futureNumberData[props.bboxid]
  })

  const futuredataLabel = computed(() => {
    return storeAI.futureLabelData[props.bboxid]
  })

  const chartfutureData = computed(() => {
    return {
      labels: futuredataLabel.value,
      datasets: [ { data: futuredataValues.value } ]
    }
  })

  const expandModules = () => {
    modulesShow.value = !modulesShow.value
  }

</script>

<style scoped>

.bentobox-cell {
  display: grid;
}

#bb-toolbar {
  display: grid;
  grid-template-columns: 1fr;
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

#bentobox-quants {
  display: grid;
  grid-template-areas:
  'bentobox-tools bentobox-tools bentobox-tools'
  'boxnow vertdragbar boxfuture'
  'expand expand expand'
  'bbmodules bbmodules bbmodules';
  grid-template-rows: min-content 1fr 9fr 6px 1fr;
  grid-template-columns: 2fr 6px 2fr;
  width: 98vw;   
}

#bentobox-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

#bento-past {
  position: relative;
  margin: 2em;
  border: 2px solid orange;
}

#bento-future {
  position: relative;
  margin: 2em;
  border: 2px solid orange;
}


#bb-expand-size {
  display: block;
  width: 100%;
  background-color:  rgb(141, 145, 226);
}

.active {
  background-color: darblue;
  border: 1px solid lightblue;
}


@media (min-width: 1024px) {

  #bentobox-quants {
    display: grid;
    grid-template-areas:
    'bentobox-tools bentobox-tools bentobox-tools'
    'boxnow vertdragbar boxfuture'
    'expand expand expand'
    'bbmodules bbmodules bbmodules';
    grid-template-rows: min-content 1fr 9fr 6px 2fr;
    grid-template-columns: 2fr 6px 2fr;
    height: 96vh;
    width: 94vw;
    border: 2px solid rgb(141, 145, 226);
  }

  #bentobox-tools {
    background-color: rgb(224, 227, 243);
    grid-area: bentobox-tools;
    border: 0px solid red;
  }

  #bentobox-mini {
    display: grid;
    position: absolute;
    top: 0px;
    left: 200;
    background-color: blue;
    border: 1px solid darkblue;
    width: 64px;
    z-index: 12;
  }

  #bentobox-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  #bentobox-now {
    width: 31px;
    color: antiquewhite;
  }

  #network-bentobox-now {
    width: 31px;
    color: antiquewhite;
  }

  #bentobox-future {
    width: 31px;
    color: antiquewhite;
  }

  #network-bentobox-future {
    width: 31px;
    color: antiquewhite;    
  }

  .mini-quant-off {
    background-color: rgb(141, 145, 226);
    border: 1px solid darkblue;
    text-align: center;
  }

  .active {
    background-color: darkblue;
    border: 1px solid lightblue;
  }

  #box-now {
    background-color: rgb(245, 247, 245);
    grid-area: boxnow;
    overflow: hidden;
    min-height: 30vh;
  }

  #vertdragbar {
    background-color: darkblue;
    grid-area: vertdragbar;
    cursor: ew-resize;
  }

  #box-future {
    background-color: rgb(241, 238, 231);
    grid-area: boxfuture;
    overflow: hidden;
    min-height: 30vh;
  }

  #expand {
    background-color: darkblue;
    grid-area: expand;
    cursor: ns-resize;
    height: 6px;
  }

  #bentobox-modules {
    display: grid;
    grid-template-columns: 1fr;
    grid-area: bbmodules;
    cursor: default;
  }

  .bentobox-cell {
    display: grid;
  }

  #bb-toolbar {
    display: grid;
    grid-template-columns: 1fr;
    height: 400px;
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

  #network-bentobox {
    border: 1px solid grey;
    display: none;
    grid-template-columns: 1fr 1fr;
    margin: 1em;
  }

  #past-box, #future-box {
    position: relative;
  }
  
  #past-box {
    background-color: rgb(236, 236, 243);
  }

  #future-box {
    background-color:#fff4f4;
  }

  #bento-past {
    position: relative;
    min-height: 40vh;
    min-width: 20vw;
    margin: 2em;
    border: 2px solid orange;
  }

  #bento-future {
    position: relative;
    min-height: 40vh;
    min-width: 20vw;
    margin: 2em;
    border: 2px solid orange;
  }

  #bb-expand-size {
    position: relative;
    width: 100%;
    background-color: rgb(141, 145, 226);
  }

}

</style>