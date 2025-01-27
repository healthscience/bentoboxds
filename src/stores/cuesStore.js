import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import CuesUtilty from '@/stores/hopUtility/cuesUtility.js'
import MarkersUtilty from '@/stores/hopUtility/biomarkerUtility.js'
import FlakeUtilty from '@/stores/hopUtility/flakeUtility.js'

export const cuesStore = defineStore('cues', {
  state: () => ({
    storeAI: aiInterfaceStore(),
    cueUtil: new CuesUtilty(),
    flakeUtil: new FlakeUtilty(),
    markerUtil: new MarkersUtilty(),
    sendSocket: useSocketStore(),
    bentopathState: false,
    pathListActive: true,
    cuesList: [],
    markerList: [],
    cueMatchMarkersLive: [],
    gaiaStart: false,
    gaiaCount: 0,
    pathName: '',
    activeCueSegment: {},
    activeCue: '',
    activeDougnnutData: {},
    bentopathLive: [],
    bentopathStages: [],
    stageCount: 0,
    pathRefContracts: {},
    cueColumnA: {},
    cueColumnB: {},
    cuesmenuList: [],
    hopCues: {},
    cuesLongevity: {},
    selectCues: {},
    natureBoundries: {},
    mediaMatch: {},
    researchPapers: {},
    markerMatch: {},
    productMatch: {},
    oracleAttention: [], // [{ spaceid: 123221, name: 'cueOne', oracle: 'let me show you . . .'}, { spaceid: 223221, name: 'cueTwo', oracle: 'take a look at'}]
    waitingCues: [],
    liveCueContext: 'menu',
    flakeCues: {},
    cueContext: 'cueall',
    cueKnowledge: 'concept',
    cuesFlakeList: [],
    cuesFlakeCount: 0,
    glueRelActive: ''
  }),
  actions: {
    processReply (received) {
      // console.log('oracle replies coming in, update bentobox')
      // console.log(received)
    },
    prepareCueContract (cueInfo) {
      let cueContract = this.cueUtil.prepareCuesContractPrime(cueInfo)
      this.sendSocket.send_message(cueContract)
    },
    cueDisplayBuilder (cueKey, cueRel, liveWheel) {
      let cueDisplay = this.cueUtil.cueDisplayMake(cueKey, cueRel, liveWheel)
      return cueDisplay
    },
    cogGlueSpace (spaceID) {
      let spaceContract = this.cueUtil.cueMatch(spaceID, this.cuesList)
      this.markerMatch[spaceID] = []
      if (spaceContract?.value?.computational?.relationships?.measure !== undefined) {
        for (let relc of spaceContract.value.computational.relationships['measure']) {
          let matchMarker = this.markerUtil.markerMatch(relc, this.markerList)
          this.markerMatch[spaceID].push(matchMarker)
        }
      }
    }, 
    cueGluePrepare (glueType) {
      // match cue to its contract
      this.glueRelActive = glueType
      if (glueType === 'down') {
        let cueContract = this.cueUtil.cueMatch(this.activeCue, this.cuesList)
        let cueWheel = this.cueUtil.prepareGlueWheel(glueType, cueContract, this.cuesList)
        this.activeCueExpanded = cueWheel.expandedcues
        if (cueWheel?.wheeldata?.labels.length > 0) {
          this.activeDougnnutData = cueWheel.wheeldata
          this.checkCueContext()
        }
        this.storeAI.cuesFeedback = cueWheel.feedback
      } else if (glueType === 'measure') {
        let cueContract = this.cueUtil.cueMatch(this.activeCue, this.cuesList)
        if (cueContract.value.computational.relationships[glueType].length > 0) {
          let markerContract = this.markerUtil.markerMatch(cueContract.value.computational.relationships[glueType], this.markerList)
          // double check for empty element
          let cleanList = []
          for (let marker of markerContract) {
            if (marker.length > 0) {
              cleanList.push(marker)
            }
          }
          this.cueMatchMarkersLive = cleanList
        }
      }
    },
    matchCueContract (cueInfo) {
      this.cueUtil.cueMatch(this.activeCue, this.cuesList)

    },
    matchCueContractLabel (cueInfo) {
      // what wheel is active itterate over to match on label name
      let matchLabel = {}
      for (let cue of this.cuesList) {
        if (cue.value.concept.name === cueInfo.label) {
          matchLabel = cue
        }
      }
      return matchLabel
    },
    checkCueContext () {
      // what cue context is active, menu, space, flake
      if (this.liveCueContext === 'menu') {
        // what cue is active
        this.flakeCuesList()
      } else if (this.liveCueContext === 'space') {

      } else if (this.liveCueContext === 'flake') {
        // any relationships active?
        if (this.glueRelActive === 'down') {
          this.cuesFlakeCount = 0
          for (let cueE of this.activeCueExpanded) {
            this.flakeCuesListGlue(cueE.key)
            this.prepareFlakeExpanded(cueE.key)
          }
        } else {
          // need to prepare/ map to sub cues and then to N=1/decisions to show boundry state ie. low just right  concern
          this.cuesFlakeList = []
          this.flakeCuesList()
          this.prepareFlake()
        }
      }
    },
    flakeCuesList () {
      // need to add rotation
      // let branchItems = { nature: { transform: 'rotate('  + '30' + 'deg)'} }
      // how many cues in flake?
      let cueRadian = 360 / this.cuesFlakeList.length
      let flakePosition = { transform: 'rotate(' + cueRadian + 'deg)'} 
      this.cuesFlakeList.push({ cue: this.activeCue, style: flakePosition })
    },
    flakeCuesListGlue (cueKey) {
      // need to add rotation
      // let branchItems = { nature: { transform: 'rotate('  + '30' + 'deg)'} }
      // how many cues in flake?
      this.cuesFlakeCount++
      let cueRadian = 360 / this.activeCueExpanded.length
      let flakePosition = { transform: 'rotate(' + (cueRadian * this.cuesFlakeCount) + 'deg)'} 
      this.cuesFlakeList.push({ cue: cueKey, style: flakePosition })
    },
    prepareFlake () {
      // let cueContract = this.cueUtil.cueMatch(this.activeCue, this.cuesList)
      this.flakeCues[this.activeCue] = this.flakeUtil.prepareFlakeCues(this.activeCue)
    },
    prepareFlakeExpanded (cueKey) {
      this.flakeCues[cueKey] = this.flakeUtil.prepareFlakeCues(cueKey)
    },
    prepareGaia () {
      // get gaia datatype contract info.
      let listDatatypes = this.cueUtil.prepareDTnatureMessage()

      for (let dtg of listDatatypes) {
        this.sendSocket.send_message(dtg)
      }
     /* for (let dtg of listDatatypes1) {
        this.sendSocket.send_message(dtg)
      }
      for (let dtg of listDatatypes2) {
        this.sendSocket.send_message(dtg)
      }
      for (let dtg of listDatatypes3) {
        this.sendSocket.send_message(dtg)
      } */
      // need to listen save success and then prepare cue contracts
      // this.gaiaStart = true
    },
    prepareAging () {
      // hallmarks of aging
      let listDatatypes = this.cueUtil.prepareDTagingMessage()
      for (let dtg of listDatatypes) {
        this.sendSocket.send_message(dtg)
      }
    },
    preparePlanet () {
      // planet boundries
      let listDatatypes = this.cueUtil.prepareDTplanetMessage()
      for (let dtg of listDatatypes) {
        this.sendSocket.send_message(dtg)
      }
    },
    prepareBody () {
      // body datatypes
      let listDatatypes = this.cueUtil.prepareDTbodyMessage()
      for (let dtg of listDatatypes) {
        this.sendSocket.send_message(dtg)
      }
    },
    prepareBodyBiomarkers () {
      // body biomarkers
      let listDatatypes = this.markerUtil.prepareContractbiomarkersMessage()
      for (let dtg of listDatatypes) {
        this.sendSocket.send_message(dtg)
      }
    }
  }
})