<template>


<Teleport to="body">
    <modal-cues :show="bentoCuesStatus" @close="closeBentoCues">
      <div id="simpleblock" ref="simpleblock">Cues</div>
      Cues
      <template #header>
        <div id="cues-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeBentoDiary"
            aria-label="Close modal"
          >
            Close
          </button>
          <h3>Cues</h3>
          <div id="return-modal-close" @click="closeBentoCues">return</div>
        </div>
      </template>
      <template #body>
        <div class="pie">
          <button style="transform: rotate(0deg) skewY(30deg)">
            <span style="transform: skewY(-30deg) rotate(60deg)" class="text">1</span>    
          </button>
          <button style="transform: rotate(120deg) skewY(30deg)">
            <span style="transform: skewY(-30deg) rotate(60deg)" class="text">2</span>
          </button>
          <button style="transform: rotate(240deg) skewY(30deg)">
            <span style="transform: skewY(-30deg) rotate(60deg)"class="text">3</span>
          </button>
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

</script>

<style scoped>



  @media (min-width: 1024px) {

    .pie {
      background-color: rgba(0, 0, 0, 0.5);
      position: relative;
      width: 150px;
      height: 150px;
      border-radius: 50%;
      overflow: hidden;

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
          padding: 0px;
          color: #333;
          left: 30px;
        }
      }
    }


  }

</style>