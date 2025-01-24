<template>
  <div id="space-menu">
    <button class="create-space" @click="newSpacemenu">
      + create space
    </button>
    <div id="space-form-save" v-if="saveSpace">
      <form id="ask-ai-form" @submit.prevent="saveSpacename()">
        <label for="spacename"></label>
        <input type="input" id="newspace" name="newspace" placeholder="space name" v-model="newSpacename">
        <button id="save-space-name" type="submit">
          add
        </button>
      </form>
    </div>
    <div class="history-list" v-for="sis in spaceList">
      <button
          class="flat-history"  v-bind:class="{ active: sis?.active }" @click="bentoSpaceOpen(sis)" @mouseover="hoverCheck(sis)" @mousemove="moveCheck(sis)"> {{ sis.name }}
        </button> <!--@mouseup="dropBBox"-->
      <button class="save-chat-history" @click="saveSpaceHistory(sis)">save</button>
      <button class="delete-chat-history" @click="deleteSpaceHistory(sis)">Del</button>
    </div>
    <div id="cues-holder" @click="showExpandCues()" v-bind:class="{ active: expandCues }">
      Cues 
    </div>
    <div id="show-cues" v-if="expandCues === true">
      <div class="cues-list" v-for="cue in cuesList">
        <div id="cue-holistic">
          <button class="flat-history"  v-bind:class="{ active: cue?.active }" @click="bentoSpaceOpen(cue)" @mouseover="hoverCheck(cue)" @mousemove="moveCheck(cue)"> {{ cue.name }}
          </button>
          <span id="drill-cue" v-if="cue.expand === true">
            <button class="drill-cue-history" @click="drillCue(cue)">c-></button>     
          </span>
          <button class="save-chat-history" @click="saveSpaceHistory(cue)">save</button>
          <button class="delete-chat-history" @click="deleteSpaceHistory(cue)">Del</button>
        </div>
        ---------
        <div id="gule-cues" v-if="glueTarget[cue.cueid] === true">
          <div class="cues-list" v-for="cues in selectCuesActive[cue.cueid]">
            <div id="cue-holistic" v-if="cue.gluedown === glueName">
              <button class="flat-history"  v-bind:class="{ active: cues?.active }" @click="bentoSpaceOpen(cues)" @mouseover="hoverCheck(cues)" @mousemove="moveCheck(cues)"> {{ cues.name }}
              </button>
              <span id="drill-cue" v-if="cues.expand === true">
                <!--<button class="drill-cue-history" @click="drillCue(cues)">c-></button>-->     
              </span>
              <button class="save-chat-history" @click="saveSpaceHistory(cues)">save</button>
              <button class="delete-chat-history" @click="deleteSpaceHistory(cues)">Del</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="marker-holder" @click="showExpandMarkers()" v-bind:class="{ active: expandMarkers }">
      Markers
    </div>
    <div id="show-markers" v-if="expandMarkers === true">
      Coming soon
    </div>
  </div>
</template>

<script setup>
import hashObject from 'object-hash'
import { cuesStore } from '@/stores/cuesStore.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { ref, computed, onMounted } from 'vue'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeBentobox = bentoboxStore()

  let saveSpace = ref(false)
  let newSpacename = ref('')
  let glueTarget = ref({})
  let glueName = ref('')
  let expandCues = ref(false)
  let expandMarkers = ref(false)

  /* on mount */
  onMounted(() => {
   
  })


  /*  computed  */
  const spaceList = computed(() => {
    return storeBentobox.spaceList
  })

  const startCuesList = computed(() => {
    return storeCues.cuesList
  })

  const cuesList = computed(() => {
    // take curent cues filter for down cogGlue SHOULD BE DONE on start TODO
    let menuPrep = []
    for (let cue of storeCues.cuesList) {
      // does the cues the top of its path?
      if (cue.value.computational?.relationships !== undefined) {
         // what type of relationship
         let matchType = Object.keys(cue.value.computational?.relationships)
         for (let match of matchType) {
          if (match === 'down') {
            if (Object.keys(cue.value.computational?.relationships).length > 0 && cue.value.computational?.relationships?.down.length > 0) {
          menuPrep.push(
            {
              name: cue.value.concept.name,
              cueid: cue.key,
              gluedown: 'down',
              active: false,
              expand: true
            })
            } else {
            }
          } else if (match === 'up') {
          } else if (match === 'equal') {
          } else if (match === 'measure') {
          } else if (match === 'compute') {
          }
        }

      } else {
      }
    }
    return menuPrep
  })

  const selectCuesActive = computed(() => {
    return storeCues.selectCues
  })

  const cuesLongevity = computed(() => {
    return storeCues.cuesLongevity.labels
  })

  const cuesBiomarkers = computed(() => {
    return storeCues.cuesBiomarkers.labels
  })

  /* cuesBiomarkers */

  /* methods */
  const hoverCheck = (sis) => {
    // console.log('hover id')
    // console.log(sis)
  }

  const moveCheck = (sis) => {
    // console.log('move id')
    // console.log(sis)
  }

  const newSpacemenu = () => {
    saveSpace.value = !saveSpace.value
  }

  const showExpandCues = () => {
    expandCues.value = !expandCues.value
  }

  const showExpandMarkers = () => {
    expandMarkers.value = !expandMarkers.value
  }

  const drillCue = (cuem) => {
    let downCuesList = []
    // match to cues contract and loop over relationships
    for (let cue of storeCues.cuesList) {
      if (cue.key === cuem.cueid) {
        for (let rel of cue.value.computational.relationships['down']) {
          // match to cue contract
          let cueContract = storeCues.cueUtil.cueMatch(rel, storeCues.cuesList)
          downCuesList.push(
            {
              name: cueContract.value.concept.name,
              cueid: cueContract.key,
              gluedown: 'down',
              active: false,
              expand: true
            }
          )
        }
      }
    }
    storeCues.selectCues[cuem.cueid] = downCuesList
    if (glueTarget.value[cuem.cueid] === undefined) {
      glueTarget.value[cuem.cueid] = true
    } else {
      glueTarget.value[cuem.cueid] = !glueTarget.value[cuem.cueid]
    }
    glueName.value = cuem.gluedown
  }

  const bentoSpaceOpen = (spaceID) => {
    storeAI.beebeeContext = 'chatspace'
    storeAI.bentospaceState = !storeAI.bentospaceState
    storeAI.liveBspace = spaceID
    // make button green
    let spaceLiveList = []
    for (let spi of storeBentobox.spaceList) {
      if (spi.spaceid === spaceID.spaceid) {
        spi.active = true
        spaceLiveList.push(spi)
      } else {
        spi.active = false
        spaceLiveList.push(spi)
      }
    }
    storeBentobox.spaceList = spaceLiveList
    // look for cogGlue e.g. measure to marker
    storeCues.cogGlueSpace(spaceID)
  }

  const saveSpacename = () => {
    saveSpace.value = !saveSpace.value
    let spaceID = hashObject(newSpacename.value + new Date())
    let newSpaceItem = {}
    newSpaceItem.name = newSpacename.value
    newSpaceItem.spaceid = spaceID
    newSpaceItem.active = false
    storeBentobox.spaceList.push(newSpaceItem)
    storeAI.bentoboxList[spaceID] = []
    newSpacename.value = ''
    // make this the active space
    storeAI.liveBspace = newSpaceItem
    let spaceLiveList = []
    for (let spi of storeBentobox.spaceList) {
      if (spi.spaceid === spaceID) {
        spi.active = true
        spaceLiveList.push(spi)
      } else {
        spi.active = false
        spaceLiveList.push(spi)
      }
    }
    storeBentobox.spaceList = spaceLiveList
    storeBentobox.locationBbox[spaceID] = {}
    // check and update product boxes 
    // storeBentobox.locationProductbox
  }

  const saveSpaceHistory = (space) => {
    let saveBentoBoxsetting = {}
    saveBentoBoxsetting.type = 'bentobox'
    saveBentoBoxsetting.reftype = 'space-history'
    saveBentoBoxsetting.action = 'save'
    saveBentoBoxsetting.task = 'save'
    saveBentoBoxsetting.data = space
    saveBentoBoxsetting.bbid = ''
    storeAI.prepareSpaceSave(saveBentoBoxsetting)
  }

  const deleteSpaceHistory = (space) => {
    // remove form chat list and delete message
    let updateSpacelist = []
    for (let sp of storeBentobox.spaceList) {
      if (sp.spaceid !== space.spaceid) {
        updateSpacelist.push(sp)
      }
    }
    storeBentobox.spaceList = updateSpacelist
    let delBentoBoxsetting = {}
    delBentoBoxsetting.type = 'bentobox'
    delBentoBoxsetting.reftype = 'space-history'
    delBentoBoxsetting.action = 'delete'
    delBentoBoxsetting.task = 'delete'
    delBentoBoxsetting.data = space
    delBentoBoxsetting.bbid = ''
    storeAI.sendMessageHOP(delBentoBoxsetting)
  }

</script>

<style scoped>
#space-menu {
  display: grid;
  grid-template-columns: 1fr;
  height: auto;
  overflow-y: scroll;
  overflow-x: visible;
  align-self: start;
}

.create-space {
  margin-top: 1em;
  background-color: white;
  border: 1px dashed grey;
  margin-bottom: 1em;
  height: 40px;
  border: 1px dashed lightblue;
}

#ask-ai-form {
  border: 1px solid lightblue;
}

#space-form-save {
  border: 1px dashed lightblue;
  height: 120px;
}

.flat-history {
  background-color: rgb(178, 188, 227);
  border: 0px;
  margin: .4em;
  padding: .5em;
}

#cues-holder, #marker-holder {
  margin-top: 1em;
  cursor: pointer;
  padding-top: .2em;
  border-top: 1px solid lightblue;
  border-bottom: 1px solid lightblue;
  height: 30px;
  font-weight: bold;
}

.active {
  background-color: rgb(113, 172, 114);
}

.history-list {
  height: 42px;
}

/* .history-list:first-child {
  background-color: green;
} */

.live-drop-zone {
  display: block;
  height: 2em;
}

  @media (min-width: 1024px) {

    .menulive {
      background-color: 1px solid green;
    }

    .live-drop-zone {
      height: 100%;
      border: 0px dashed rgb(228, 137, 39);
    }

    .live-drop-zone:hover {
      background-color: rgb(244, 245, 246);
    }

    #gule-cues {
      position: relative;
      background-color: rgb(238, 242, 243);
    }

    .cues-list {
      position: relative;
    }


  }
</style>