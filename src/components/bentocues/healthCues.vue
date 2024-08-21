<template>


<Teleport to="body">
    <modal-cues :show="bentoCuesStatus" @close="closeBentoCues">
      Cues
      <template #header>
        <div id="cues-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeBentoCues"
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
            <div class="pie">
              <button style="transform: rotate(0deg) skewY(30deg)" @click="cueSelect('environment')">
                <span style="transform: skewY(-30deg) rotate(0deg)" class="text">Environment</span>    
              </button>
              <button style="transform: rotate(90deg) skewY(30deg)" @click="cueSelect('body')">
                <span style="transform: skewY(-30deg) rotate(270deg)" class="text">Body</span>
              </button>
              <button style="transform: rotate(180deg) skewY(30deg)" @click="cueSelect('mind')">
                <span style="transform: skewY(-30deg) rotate(60deg)"class="text">Mind</span>
              </button>
              <button style="transform: rotate(270deg) skewY(30deg)" @click="cueSelect('nature')">
                <span style="transform: skewY(-30deg) rotate(60deg)"class="text">Nature</span>
              </button>
            </div>
          </div>
          <div id="filter-cues">
            Filters: price, biomarkers, devices (home, clinic), Motivation etc.
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
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()


  const bentoCuesStatus = computed(() => {
    return storeAI.bentocuesState
  })


  /* methods */

  const closeBentoCues = () => {
    storeAI.bentocuesState = !storeAI.bentocuesState
  }

  const cueSelect = (cue) => {
    console.log('cue' + cue)
  }
</script>

<style scoped>



  @media (min-width: 1024px) {

    #bento-cues {
      display: grid;
      grid-template-columns: 3fr 2fr;
      border: 1px solid green;
    }

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
        transition: all 200ms ease-out;
        &:hover {
          box-shadow: 0px 0px 10px 5px #515151;
          z-index: 1;
        }
        .text {
          position: absolute;
          bottom: 30px;
          padding: 20px;
          color: #333;
          left: 30px;
        }
      }
    }


  }

</style>