import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'
import CuesUtilty from '@/stores/hopUtility/cuesUtility.js'
import FlakeUtilty from '@/stores/hopUtility/flakeUtility.js'
import { transformGeometryWithOptions } from 'ol/format/Feature'

export const cuesStore = defineStore('cues', {
  state: () => ({
    cueUtil: new CuesUtilty(),
    flakeUtil: new FlakeUtilty(),
    sendSocket: useSocketStore(),
    bentopathState: false,
    pathListActive: true,
    cuesList: [],
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
    cueGluePrepare (glueType) {
      // match cue to its contract
      this.glueRelActive = glueType
      let cueContract = this.cueUtil.cueMatch(this.activeCue, this.cuesList)
      let cueWheel = this.cueUtil.prepareGlueWheel(glueType, cueContract, this.cuesList)
      return cueWheel
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
      console.log(this.flakeCues)
    },
    prepareFlakeExpanded (cueKey) {
      this.flakeCues[cueKey] = this.flakeUtil.prepareFlakeCues(cueKey)
    },
    prepareGaia () {
      // get gaia datatype contract info.
      // let listDatatypes = this.cueUtil.prepareDTgaiaMessage()
      let listDatatypes = this.cueUtil.prepareDTnatureMessage()
      // let listDatatypes1 = this.cueUtil.prepareDTenvironmentMessage()
      // let listDatatypes2 = this.cueUtil.prepareDTcultureMessage()
      // let listDatatypes3 = this.cueUtil.prepareDTlifeMessage()

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
    }
  }
})