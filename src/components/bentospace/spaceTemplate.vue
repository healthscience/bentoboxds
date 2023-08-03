<template>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal-space :show="bentspaceStatus" @close="closeBentoSpace">
      <template #header>
        <!-- The code below goes into the header slot -->
        <button
          type="button"
          class="btn-green"
          @click="closeBentoSpace"
          aria-label="Close modal"
        >
          Close
        </button>
        <a href="#" id="return-bentospace" @click="closeBentoSpace">return</a>
        <h3>BentoSpace #</h3>
      </template>
      <template #body>
        <div id="space-toolbar">
          <div id="beebee-help">beebee help</div>
          <div id="space-bar">space bar</div>
        </div>
        <div id="bento-space" @drop="drop" @dragover="allowDrop">
          <!-- location for bentobox - es -->
          <bento-box></bento-box>
        </div>
        <div id="drop-zone" ></div>
      </template>
      <template #footer>
      </template>
    </modal-space>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalSpace from '@/components/bentospace/spaceModal.vue'
import BentoBox from '@/components/bentobox/baseBox.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'

  const storeAI = aiInterfaceStore()
  const bboxStore = bentoboxStore()
  const bentospaceLive = ref(true)
  const showModal = ref(false)

  const allowDrop = (ev) => {
    console.log('penny droped')
    ev.preventDefault()
  }

  const dragBB = (ev) => {
    ev.dataTransfer.setData("text", ev.target.id)
  }

  const drop = (ev) => {
    console.log('drop')
    ev.preventDefault()
    console.log(ev)
    var data = ev.dataTransfer.getData("text")
    console.log(data)
    let locNew = {}
    locNew.x = ev.clientX - 127
    locNew.y = ev.clientY - 40
    // ev.target.appendChild(document.getElementById(data))
    bboxStore.setBoxlocation(locNew)
  }
  
  const bentspaceStatus = computed(() => {
    return storeAI.bentospaceState
  })

  function closeBentoSpace () {
    storeAI.bentospaceState = !storeAI.bentospaceState
  }
</script>

<style scoped>

#space-toolbar {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: antiquewhite;
}

#bento-space {
  display: grid;
  grid-template-columns: 1fr;
  border: 2px solid green;
  height: 70vh;
  width: 100%;
  margin-top: 0.1em;
  transform-origin: left top;
  border: 1px solid orange;
  background-color: #fff4f4;
  background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px;
}

#drop-zone {
  border: 2px dashed red;
  height: 10vh;
}

  @media (min-width: 1024px) {

  }

</style>
