<template>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal-space :show="bentospaceStatus" @close="closeBentoSpace">
      <template #header>
        <!-- The code below goes into the header slot -->
        <div id="space-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeBentoSpace"
            aria-label="Close modal"
          >
            Close
          </button>
          <h3>BentoSpace # {{ storeAI.liveBspace.name }}</h3>
          <div id="return-modal-close" @click="closeBentoSpace">return</div>
        </div>
      </template>
      <template #body>
        <beebee-ai v-if="beebeeSpace"></beebee-ai>
        <button id="open-beebee" @click.prevent="setShowBeeBee">beebee</button>
        <div id="space-toolbar">
          <div id="beebee-help"></div>
          <div id="media-tools">
            <button @click="addBentoMedia()">+ media</button>
            <div id="bento-media" v-if="spaceMedia === true">
              <h3>Bento Media tools</h3>
              <div id="bento-media-video">
                <form id="add-video-form" @submit.prevent="videoAdd()">
                  <label for="video"></label>
                  <input type="input" id="video-add" name="video" placeholder="add video url" v-model="videoURLadd" autofocus>
                </form>
                <button id="bento-media-task" type="submit" @click.prevent="videoAdd()">
                  + add
                </button>
              </div>
          </div>
        </div>
          <div id="space-bar">space bar</div>
          <div class="scale-item scalebuttons">
            <label>Scale</label>
            <!--<input type="range" min="0.1" max="2" step="0.1" v-model.number="scalelocal" @change="setzoomScale">-->
            <button class="point-change" @click="setzoomScale(-0.05)">-</button>
            {{ Math.round(zoomscaleValue * 100) }} %
            <button class="point-change" @click="setzoomScale(0.05)">+</button>
          </div>
        </div>
        <div id="bentospace-holder" v-dragscroll.noleft.noright="true" @click="whereMinmap($event)">
          <div id="bento-space" v-bind:style="{ transform: 'scale(' + zoomscaleValue + ')' }">
            <!-- location for bentobox - es -->
            <div id="space-bento-items">
              <div id="bento-layout" v-for="bbox in storeAI.bentoboxList[storeAI.liveBspace.spaceid]">
                <bento-boxspace :bboxid="bbox.bboxid" :contractid="bbox.contract"></bento-boxspace>
              </div>
              <!--video / image /  decision  / cues etc  to compliment bentobox-->
              <div id="bento-media-space" v-for="bmedia in storeBentobox.videoMedia[storeAI.liveBspace.spaceid]">
                <media-space :bstag="bmedia.tag" :bsmedia="bmedia.id"></media-space>
              </div>
            </div>
          </div>
        </div>
        <mininav-map :spaceid="storeAI.liveBspace.spaceid" :bboxid="'null'"></mininav-map>
      </template>
      <template #footer>
      </template>
    </modal-space>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModalSpace from '@/components/bentospace/spaceModal.vue'
import BentoBoxspace from '@/components/bentobox/bentoboxSpace.vue'
import MediaSpace from '@/components/bentospace/video/mediaSpace.vue'
import BeebeeAi from '@/components/beebeehelp/inputBox.vue'
import MininavMap from '@/components/bentospace/map/mininavMap.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { mapminiStore } from '@/stores/mapStore.js'

  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()
  const storeMmap = mapminiStore()
  
  let beebeeSpace = ref(false)
  let mouseLive = ref(
    {
      x: 10,
      y: 10
    }
  )
  let spaceMedia = ref(false)
  let videoURLadd = ref('')

  /* computed */
  const bentospaceStatus = computed(() => {
    return storeAI.bentospaceState
  })

  const zoomscaleValue = computed(() => {
    return storeBentobox.scaleZoom
  })

  /* methods */
  const setShowBeeBee = () => {
    beebeeSpace.value = !beebeeSpace.value
  }

  const closeBentoSpace = () => {
    storeAI.bentospaceState = !storeAI.bentospaceState
    // save the current layout on close
    storeBentobox.saveLayoutSpace(storeAI.liveBspace.spaceid)
  }

  const setzoomScale = (change) => {
    storeBentobox.scaleZoom = storeBentobox.scaleZoom + change
  }

  const whereMinmap = (mo) => {
    mouseLive.x = mo.offsetX
    mouseLive.y = mo.offsetY
    // if click on minimap do not send
    if (mo.target.id !== 'minimap') {
      storeMmap.actionPostionCoordMouse(mouseLive)
    }
  }

  const addBentoMedia = () => {
    spaceMedia.value = !spaceMedia.value
  }

  const videoAdd = () => {
    // assume youtube and extract id
    if (videoURLadd.value.length > 0) {
      let videoSplit = videoURLadd.value.split('/')
      // console.log(videoSplit)
      // set mbox in boxstore and add to media list
      // check if holder setup
      if (storeBentobox.locationMbox[storeAI.liveBspace.spaceid] === undefined) {
        storeBentobox.locationMbox[storeAI.liveBspace.spaceid] = {}
      }
      storeBentobox.setLocationMbox(storeAI.liveBspace.spaceid, videoSplit[3])
      if (storeBentobox.videoMedia[storeAI.liveBspace.spaceid]) {
        storeBentobox.videoMedia[storeAI.liveBspace.spaceid].push({ tag: 'video', id: videoSplit[3]})
      } else {
        storeBentobox.videoMedia[storeAI.liveBspace.spaceid] = []
        storeBentobox.videoMedia[storeAI.liveBspace.spaceid].push({ tag: 'video', id: videoSplit[3]})
      }
    } else {
      console.log('empty URL')
    }
    spaceMedia.value = false
    videoURLadd.value = ''
  }

</script>

<style scoped>

#space-toolbar {
  display: grid;
  grid-template-columns: 1fr 1fr 3fr 1fr;
  background-color: antiquewhite;
}

#bentospace-holder {
  border: 0px solid red;;
}

#bento-space {
  display: grid;
  grid-template-columns: 1fr;
  border: 2px solid green;
  height: 80vh;
  width: 100%;
  margin-top: 0.1em;
  transform-origin: left top;
  border: 1px solid orange;
  background-color: #fff4f4;
  background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px;
}

#return-modal-close {
  text-align: right;
}

  @media (min-width: 1024px) {

    #space-modal-header {
      display: grid;
      grid-template-columns: 1fr 8fr 1fr;
    }

    #bentospace-holder {
      height: 80vh;
      width: 100%;
      overflow: scroll;
    }

    #bento-space {
      height: 998vh;
      width: 998vw;
      z-index: 2;
    }

    #space-bento-items {
      position: relative;
    }

    #space-modal-header {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
    }

    #return-modal-close {
      justify-content: right;
    }

    #open-beebee {
    position: fixed;
    bottom: 10px;
    right: 120px;
    z-index: 31;
    display: grid;
    justify-content: center;
    place-self: start;
    align-self: start;
    height: 2em;
    width: 5em;
    background-color: white;
  }

  .scale-item {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    justify-self: end;
  }

  #bento-layout {
    position: relative;
    border: 3px solid purple;
    height: 1px;
    width: 1px;
  }

  #bento-media-space {
    position: relative;
    border: 2px solid green;
    height: 1px;
    width: 1px;
  }

  /*  media bar  */
  #bento-media {
    position: absolute;
    z-index: 33;
    top: 10;
    left: 20;
    border-bottom: 1px solid lightgrey;
    border-left: 1px solid lightgrey;
    border-right: 1px solid lightgrey;
    padding: 1em;
    background: rgb(176, 176, 204);
    width: 300px;
    opacity: .8;
  }


}

</style>
