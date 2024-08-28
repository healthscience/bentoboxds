<template>


<Teleport to="body">
    <modal-cues :show="bentoCuesStatus" @close="closeBentoCues">
      Cues
      <template #header>
        <div id="cues-modal-header">
          <button
            type="button"
            class="btn-green"
            @cdivck="closeBentoCues"
            aria-label="Close modal"
          >
            Close
          </button>
          <h3>Cues</h3>
          <div id="return-modal-close" @click="closeBentoCues">return</div>
        </div>
      </template>
      <template #body>
        <div id="bento-cues">
          <div id="cues-wheel">
            <div id="wheel-tools">
              <button id="simple-wheel" @click="selectWheel('simple')">Simple</button>
              <button id="simple-segments" @click="selectWheel('segments')">Segments</button>
              <button id="simple-segments" @click="selectWheel('aging')">Aging</button>
            </div>
            <div class="pie" v-if="wheelType === 'simple'">
              <pie-chartcues :chartData="cuesHolistic" :options="{}" ></pie-chartcues>
              <!--<button style="transform: rotate(0deg) skewY(0deg)" @click="cueSelect('environment')">
                <span style="transform: skewY(0deg) rotate(0deg)" class="text">Environment</span>    
              </button>
              <button style="transform: rotate(90deg) skewY(30deg)" @click="cueSelect('human')">
                <span style="transform: skewY(-30deg) rotate(270deg)" class="text">Body</span>
              </button>
              <button style="transform: rotate(180deg) skewY(30deg)" @click="cueSelect('mind')">
                <span style="transform: skewY(-30deg) rotate(60deg)"class="text">Social</span>
              </button>
              <button style="transform: rotate(270deg) skewY(30deg)" @click="cueSelect('nature')">
                <span style="transform: skewY(-30deg) rotate(60deg)"class="text">Nature</span>
              </button>-->
            </div>
            <div class="pie-segments" v-if="wheelType === 'segments'">
              <pie-chartcues :chartData="cuesSegments" :options="{}" ></pie-chartcues>
              <!--<div class="circle">
                <div class="cue-seg"><div class="text" @click="cueSelect('farming')">Farming</div></div>
                <div class="cue-seg"><div class="text" @click="cueSelect('buildings')">Buildings</div></div>
                <div class="cue-seg"><div class="text" @click="cueSelect('money')">Money</div></div>
                <div class="cue-seg"><div class="text" @click="cueSelect('work')">Work</div></div>
                <div class="cue-seg"><div class="text" @click="cueSelect('lifestyle')">Lifestle/social</div></div>
                <div class="cue-seg"><div class="text" @click="cueSelect('food')">Food</div></div>
                <div class="cue-seg"><div class="text" @click="cueSelect('movement')">Movement</div></div>
                <div class="cue-seg"><div class="text" @click="cueSelect('body')">Body</div></div>
                <div class="cue-seg"><div class="text" @click="cueSelect('sleep')">Sleep/Mind</div></div>
                <div class="cue-seg"><div class="text" @click="cueSelect('universe')">Universe</div></div>
                <div class="cue-seg"><div class="text" @click="cueSelect('weather')">Climate/weather</div></div>
                <div class="cue-seg"><div class="text" @click="cueSelect('water')">Water/Air quality</div></div>
              </div>-->
            </div>
            <div class="pie-segments" v-if="wheelType === 'aging'">
              <pie-chartcues :chartData="cuesData" :options="{}" ></pie-chartcues>
              Source: <a href="https://peterattiamd.com/the-challenges-of-defining-aging/" target="_blank">All marks of aging</a>
            </div>
          </div>
          <div id="filter-cues">
            <header>Filters</header>
            <div id="slider-holder">
              <div class="container" style="margin-left: 0px">
                <br><br>
                <input class="range vertical-lowest-first" type="range" min="0" max="1" step="0.1" value="1">
                <br><br><br>
                Motivation
              </div>
              <div class="container">
                <br><br>
                <input class="range vertical-heighest-first" type="range" min="0" max="1" step="0.1" value="1">
                <br><br><br>
                Price
              </div>
              <div class="container">
                <br><br>
                <input class="range vertical-lowest-first round" type="range" min="0" max="1" step="0.1" value="1">
                <br><br><br>
                Biomarkers
              </div>
              <div class="container" style="margin-right: 0px">
                <br><br>
                <input class="range vertical-heighest-first round" type="range" min="0" max="1" step="0.1" value="1">
                <br><br><br>
                Devices
              </div>
              <div class="container" style="margin-right: 0px">
                <br><br>
                <input class="range vertical-heighest-first round" type="range" min="0" max="1" step="0.1" value="1">
                <br><br><br>
                Science
              </div>
            </div>
          </div>
          <div id="cue-bentobox">
            Expand cue -- {{ cueActive }}
            <div id="cue-type" v-if="cueActive === 'body'">
              <pie-chartcues :chartData="cuesBody" :options="{}" ></pie-chartcues>
              <!--<div class="pie-segments">
                <div class="circle-human">
                  <div class="cue-seg-human"><div class="text">Brain</div></div>
                  <div class="cue-seg-human"><div class="text"@click="spaceSelect('')">Skin</div></div>
                  <div class="cue-seg-human"><div class="text">Heart</div></div>
                  <div class="cue-seg-human"><div class="text">Immune system</div></div>
                  <div class="cue-seg-human"><div class="text"></div></div>
                  <div class="cue-seg-human"><div class="text">Muscle mass</div></div>
                  <div class="cue-seg-human"><div class="text">Inflamation</div></div>
                  <div class="cue-seg-human"><div class="text" @click="spaceSelect('b6e81d8bed9758b538aa25c13239968813b17f5a')">Blood</div></div>
                  <div class="cue-seg-human"><div class="text">hormones</div></div>
                  <div class="cue-seg-human"><div class="text">Epigenomics</div></div>
                  <div class="cue-seg-human"><div class="text">Cellular</div></div>
                  <div class="cue-seg-human"><div class="text">Telomere</div></div>
                </div>
              </div>-->
            </div>
          </div>
        </div>

      </template>
      <template #footer>
      </template>
    </modal-cues>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalCues from '@/components/bentocues/cuesModal.vue'
import PieChartcues from '@/components/visualisation/charts/doughnutChart.vue'  // pieChart.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let wheelType = ref('simple')
  let cueActive = ref('whole')

  const bentoCuesStatus = computed(() => {
    return storeAI.bentocuesState
  })

  const cuesHolistic = computed(() => {
    let testPie = {
      labels: ['Nature', 'Environment', 'Social', 'Self'],
      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992'],
        data: [90, 90, 90, 90]
        }
      ]}
    return testPie
  })


  const cuesSegments = computed(() => {
    let testPie = {
      labels: ['Farming', 'Buildings', 'Money', 'Work', 'Lifestyle', 'Food', 'Movement', 'Body', 'Sleep', 'Sleep/mind', 'Universe', 'Climate/weather'],
      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992', '#17c8d1', '#f08113', '#61819c', '#e66553', '#8bf5b0', '#999999', '#999999' ,'#999999', '#999999'],
        data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
        }
      ]}
    return testPie
  })

  const cuesBody = computed(() => {
    let testPie = {
      labels: ['Brain', 'Skin', 'Heart', 'Immunesystem', 'Cardio', 'Muscle mass', 'Inflamation', 'Blood', 'Hormones', 'Sight', 'Mouth/teeth'],

      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992', '#17c8d1', '#f08113', '#61819c', '#e66553', '#8bf5b0', '#999999' ,'#999999', '#999999'],
        data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
        }
      ]}
    return testPie
  })

  const cuesData = computed(() => {
    let testPie = {
      labels: ['Genomic instability', 'Telomere attrition', 'Epigenetic alterations', 'Loss of proteostasis', 'Deregulated nutrient-sensing', 'Mitochondrial dysfunction', 'Cellular senescence', 'Stem cell exhaustion', 'Altered intercellular communication', 'besearch'],
      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992', '#17c8d1', '#f08113', '#61819c', '#e66553', '#8bf5b0', '#999999'],
        data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36]
        }
      ]}
    return testPie
  })

  /* methods */

  const closeBentoCues = () => {
    storeAI.bentocuesState = !storeAI.bentocuesState
  }

  const cueSelect = (cueID) => {
    console.log('cue' + cueID)
    cueActive.value = cueID
  }

  const spaceSelect = (spaceID) => {
    console.log('spaceid' + spaceID)
    storeAI.bentospaceState = !storeAI.bentospaceState
    storeAI.liveBspace = {name: 'blood', spaceid: spaceID}
  }

  const selectWheel = (type) => {
    console.log('wheel' + type)
    wheelType.value = type
  }

</script>

<style scoped>



  @media (min-width: 1024px) {

    #bento-cues {
      display: grid;
      grid-template-columns: 3fr 1fr;
      border: 1px solid green;
    }

    /* four basic quadrants */
    .pie {
      background-color: rgba(0, 0, 0, 0.5);
      position: relative;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      overflow: hidden;
      margin: 100px;

      button,
      button:focus {
        outline: none;
        background-color: lightgreen;
        border: thin solid white;
        position: absolute;
        cursor: pointer;
        width: 100%;
        height: 100%;
        left: 50%;
        bottom: 50%;
        transform-origin: bottom left;
        /*transition: all 200ms ease-out;*/
        &:hover {
          box-shadow: 0px 0px 10px 5px #515151;
          z-index: 1;
        }
        .text {
          position: absolute;
          bottom: 0px;
          padding: 0px;
          color: #333;
          left: 30px;
        }
      }
    }

    /** pie segments */
    .circle {
      position: relative;
      border: 1px solid black;
      padding: 0;
      margin: 1em auto;
      width: 440px;
      height: 440px;
      border-radius: 50%;
      list-style: none;
      overflow: hidden;
    }
    .cue-seg {
      overflow: hidden;
      position: absolute;
      top: 0; right: 0;
      width: 50%; height: 50%;
      transform-origin: 0% 100%;      
    }
    .text {
      position: absolute;
      left: -100%;
      width: 200%; height: 200%;
      text-align: center;
        -webkit-transform: skewY(60deg) rotate(15deg);
        -ms-transform: skewY(60deg) rotate(15deg);
        transform: skewY(60deg) rotate(15deg);
        padding-top: 20px;
    }

    .cue-seg:first-child {
        -webkit-transform: rotate(0deg) skewY(-60deg);
        -ms-transform: rotate(0deg) skewY(-60deg);
      transform: rotate(0deg) skewY(-60deg);     
    }
    .cue-seg:nth-child(2) {
        -webkit-transform: rotate(30deg) skewY(-60deg);
        -ms-transform: rotate(30deg) skewY(-60deg);
      transform: rotate(30deg) skewY(-60deg);     
    }
    .cue-seg:nth-child(3) {
        -webkit-transform: rotate(60deg) skewY(-60deg);
        -ms-transform: rotate(60deg) skewY(-60deg);
      transform: rotate(60deg) skewY(-60deg);    
    }
    .cue-seg:nth-child(4) {
        -webkit-transform: rotate(90deg) skewY(-60deg);
        -ms-transform: rotate(90deg) skewY(-60deg);
      transform: rotate(90deg) skewY(-60deg);    
    }
    .cue-seg:nth-child(5) {
        -webkit-transform: rotate(120deg) skewY(-60deg);
        -ms-transform: rotate(120deg) skewY(-60deg);
      transform: rotate(120deg) skewY(-60deg);    
    }
    .cue-seg:nth-child(6) {
        -webkit-transform: rotate(150deg) skewY(-60deg);
        -ms-transform: rotate(150deg) skewY(-60deg);
      transform: rotate(150deg) skewY(-60deg);    
    }
    .cue-seg:nth-child(7) {
        -webkit-transform: rotate(180deg) skewY(-60deg);
        -ms-transform: rotate(180deg) skewY(-60deg);
      transform: rotate(180deg) skewY(-60deg);    
    }
    .cue-seg:nth-child(8) {
        -webkit-transform: rotate(210deg) skewY(-60deg);
        -ms-transform: rotate(210deg) skewY(-60deg);
      transform: rotate(210deg) skewY(-60deg);    
    }
    .cue-seg:nth-child(9) {
        -webkit-transform: rotate(240deg) skewY(-60deg);
        -ms-transform: rotate(240deg) skewY(-60deg);
      transform: rotate(240deg) skewY(-60deg);    
    }
    .cue-seg:nth-child(10) {
        -webkit-transform: rotate(270deg) skewY(-60deg);
        -ms-transform: rotate(270deg) skewY(-60deg);
      transform: rotate(270deg) skewY(-60deg);    
    }
    .cue-seg:nth-child(11) {
        -webkit-transform: rotate(300deg) skewY(-60deg);
        -ms-transform: rotate(300deg) skewY(-60deg);
      transform: rotate(300deg) skewY(-60deg);    
    }
    .cue-seg:nth-child(12) {
        -webkit-transform: rotate(330deg) skewY(-60deg);
        -ms-transform: rotate(330deg) skewY(-60deg);
      transform: rotate(330deg) skewY(-60deg);    
    }
    /** colors  https://meinwordpress-ho-maei0r3bcn.live-website.com */

    .cue-seg:first-child .text {
        background: green; 
    }
    .cue-seg:nth-child(2) .text {
      background: tomato; 
    }
    .cue-seg:nth-child(3) .text {
      background: aqua; 
    }
    .cue-seg:nth-child(4) .text {
      background: yellow;  
    }
    .cue-seg:nth-child(5) .text {
      background: orange;  
    }
    .cue-seg:nth-child(6) .text {
      background: rgb(121, 230, 144);  
    }
    .cue-seg:nth-child(7) .text {
      background: cyan;  
    }
    .cue-seg:nth-child(8) .text {
      background: brown;  
    }
    .cue-seg:nth-child(9) .text {
      background: gray;  
    }
    .cue-seg:nth-child(10) .text {
      background: #191970;
      color: white;  
    }
    .cue-seg:nth-child(11) .text {
      background: #B0C4DE;
      color: white;
    }
    .cue-seg:nth-child(12) .text {
      background: #0000CD;
      color: white;  
    }

    /** colors body*/

    /** body wheel */
    .circle-human {
      position: relative;
      border: 1px solid black;
      padding: 0;
      margin: 1em auto;
      width: 440px;
      height: 440px;
      border-radius: 50%;
      list-style: none;
      overflow: hidden;
    }
    .cue-seg-human {
      overflow: hidden;
      position: absolute;
      top: 0; right: 0;
      width: 50%; height: 50%;
      transform-origin: 0% 100%;      
    }
    .text-human {
      position: absolute;
      left: -100%;
      width: 200%; height: 200%;
      text-align: center;
        -webkit-transform: skewY(60deg) rotate(15deg);
        -ms-transform: skewY(60deg) rotate(15deg);
        transform: skewY(60deg) rotate(15deg);
        padding-top: 20px;
    }

    .cue-seg-human:first-child {
        -webkit-transform: rotate(0deg) skewY(-60deg);
        -ms-transform: rotate(0deg) skewY(-60deg);
      transform: rotate(0deg) skewY(-60deg);     
    }
    .cue-seg-human:nth-child(2) {
        -webkit-transform: rotate(30deg) skewY(-60deg);
        -ms-transform: rotate(30deg) skewY(-60deg);
      transform: rotate(30deg) skewY(-60deg);     
    }
    .cue-seg-human:nth-child(3) {
        -webkit-transform: rotate(60deg) skewY(-60deg);
        -ms-transform: rotate(60deg) skewY(-60deg);
      transform: rotate(60deg) skewY(-60deg);    
    }
    .cue-seg-human:nth-child(4) {
        -webkit-transform: rotate(90deg) skewY(-60deg);
        -ms-transform: rotate(90deg) skewY(-60deg);
      transform: rotate(90deg) skewY(-60deg);    
    }
    .cue-seg-human:nth-child(5) {
        -webkit-transform: rotate(120deg) skewY(-60deg);
        -ms-transform: rotate(120deg) skewY(-60deg);
      transform: rotate(120deg) skewY(-60deg);    
    }
    .cue-seg-human:nth-child(6) {
        -webkit-transform: rotate(150deg) skewY(-60deg);
        -ms-transform: rotate(150deg) skewY(-60deg);
      transform: rotate(150deg) skewY(-60deg);    
    }
    .cue-seg-human:nth-child(7) {
        -webkit-transform: rotate(180deg) skewY(-60deg);
        -ms-transform: rotate(180deg) skewY(-60deg);
      transform: rotate(180deg) skewY(-60deg);    
    }
    .cue-seg-human:nth-child(8) {
        -webkit-transform: rotate(210deg) skewY(-60deg);
        -ms-transform: rotate(210deg) skewY(-60deg);
      transform: rotate(210deg) skewY(-60deg);    
    }
    .cue-seg-human:nth-child(9) {
        -webkit-transform: rotate(240deg) skewY(-60deg);
        -ms-transform: rotate(240deg) skewY(-60deg);
      transform: rotate(240deg) skewY(-60deg);    
    }
    .cue-seg-human:nth-child(10) {
        -webkit-transform: rotate(270deg) skewY(-60deg);
        -ms-transform: rotate(270deg) skewY(-60deg);
      transform: rotate(270deg) skewY(-60deg);    
    }
    .cue-seg-human:nth-child(11) {
        -webkit-transform: rotate(300deg) skewY(-60deg);
        -ms-transform: rotate(300deg) skewY(-60deg);
      transform: rotate(300deg) skewY(-60deg);    
    }
    .cue-seg-human:nth-child(12) {
        -webkit-transform: rotate(330deg) skewY(-60deg);
        -ms-transform: rotate(330deg) skewY(-60deg);
      transform: rotate(330deg) skewY(-60deg);    
    }
    
    /* body colors */
    .cue-seg-human:first-child .text {
      background: #FC6C85;
    }
    .cue-seg-human:nth-child(2) .text {
      background: #FC8EAC; 
    }
    .cue-seg-human:nth-child(3) .text {
      background:  #F88379; 
    }
    .cue-seg-human:nth-child(4) .text {
      background: #FF9999;  
    }
    .cue-seg-human:nth-child(5) .text {
      background: #FFD1DC;  
    }
    .cue-seg-human:nth-child(6) .text {
      background: #FFB6C1;  
    }
    .cue-seg-human:nth-child(7) .text {
      background: #FFB7C5;  
    }
    .cue-seg-human:nth-child(8) .text {
      background: #FFC1CC;  
    }
    .cue-seg-human:nth-child(9) .text {
      background: #F4C2C2;  
    }
    .cue-seg-human:nth-child(10) .text {
      background: #E75480;
    }
    .cue-seg-human:nth-child(11) .text {
      background: #FF007F;
    }
    .cue-seg-human:nth-child(12) .text {
      background: #A94064;
    }


      /*customised range*/
      input[type="range"].range
      {
          cursor: pointer;
          width: 100px !important;
          -webkit-appearance: none;
          z-index: 200;
          width:50px;
          border: 1px solid #e6e6e6;
          background-color: #e6e6e6;
          background-image: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#e6e6e6), to(#d2d2d2));
          background-image: -webkit-linear-gradient(right, #e6e6e6, #d2d2d2);
          background-image: -moz-linear-gradient(right, #e6e6e6, #d2d2d2);
          background-image: -ms-linear-gradient(right, #e6e6e6, #d2d2d2);
          background-image: -o-linear-gradient(right, #e6e6e6, #d2d2d2);
      }

      /*customised range when focusing on input */
    #slider-holder {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
    }

    .container {
      border: 1px solid #eee;
      margin: 10px;
      padding: 10px;
      text-align: center;
    }

    input[type=range].range {
        cursor: pointer;
        width: 100px !important;
        -webkit-appearance: none;
        z-index: 200;
        width: 50px;
        border: 1px solid #e6e6e6;
        background-color: #e6e6e6;
        background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#e6e6e6), to(#d2d2d2));
        background-image: -webkit-linear-gradient(right, #e6e6e6, #d2d2d2);
        background-image: -moz-linear-gradient(right, #e6e6e6, #d2d2d2);
        background-image: -ms-linear-gradient(right, #e6e6e6, #d2d2d2);
        background-image: -o-linear-gradient(right, #e6e6e6, #d2d2d2)
    }

    input[type=range].range:focus {
        border: 0 !important;
        outline: 0 !important
    }

    input[type=range].range::-webkit-silder-thumb {
        -webkit-appearance: none;
        width: 10px;
        height: 10px;
        background-color: #555;
        background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#4ddbff), to(#0cf));
        background-image: -webkit-linear-gradient(right, #4ddbff, #0cf);
        background-image: -moz-linear-gradient(right, #4ddbff, #0cf);
        background-image: -ms-linear-gradient(right, #4ddbff, #0cf);
        background-image: -o-linear-gradient(right, #4ddbff, #0cf)
    }

    input[type=range].round {
        -webkit-border-radius: 20px;
        -moz-border-radius: 20px;
        border-radius: 20px
    }

    input[type=range].round::-webkit-silder-thumb {
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        -o-border-radius: 5px
    }

    .vertical-lowest-first {
        -webkit-transform: rotate(90deg);
        -moz-transform: rotate(90deg);
        -o-transform: rotate(90deg);
        -ms-transform: rotate(90deg);
        transform: rotate(90deg)
    }

    .vertical-heighest-first {
        -webkit-transform: rotate(270deg);
        -moz-transform: rotate(270deg);
        -o-transform: rotate(270deg);
        -ms-transform: rotate(270deg);
        transform: rotate(270deg)
    }

  }

</style>