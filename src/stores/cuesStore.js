import { defineStore } from 'pinia'
import { useSocketStore } from '@/stores/socket.js'
import CuesUtilty from '@/stores/hopUtility/cuesUtility.js'
import FlakeUtilty from '@/stores/hopUtility/flakeUtility.js'

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
    cuesmenuList: [
      { name:'Nature', spaceid:'000988111', active: false, expand: true, glueup: '', gluedown: 'cuesNature' },{ name:'Environment', spaceid:'000988112', active: false, expand: true, glueup: '', gluedown: 'cuesEnvironment' },
      { name:'Culture', spaceid:'000988113', active: false, expand: true, glueup: '', gluedown: 'cuesCulture' },
      { name:'Life', spaceid:'000988114', active: false, expand: true, glueup: '', gluedown: 'cuesLife'},
      { name:'Body', spaceid:'002988114', active: false, expand: true, glueup: '', gluedown: 'cuesBody'},
      { name:'Longevity', spaceid:'000988115', active: false, expand: true, glueup: '', gluedown: 'cuesLongevity'},
      { name:'Biomarkers', spaceid:'000988116', active: false, expand: true, glueup: '', gluedown: 'cuesBiomarkers'}
    ],
    hopCues: {
      labels: ['Nature', 'Environment', 'Culture', 'Life'],
      datasets: [
        {
        backgroundColor: ['#09921c', '#920914', '#191fe7', '#560992'],
        data: [90, 90, 90, 90]
        }
      ]
    },
    cuesSegments: {
      labels: ['Universe', 'Climate/weather', 'Biodiversity', 'Farming', 'Buildings', 'Travel', 'Money', 'Work', 'Music/Arts', 'Food', 'Movement', 'Sleep/mind'],
      datasets: [
        {
        backgroundColor: ['#098133', '#6aee63', '#09921c', '#f44613', '#cc4119', '#99391d', '#0a22e8', '#838ddc', '#d2d7f8', '#8e4f8a', '#d642cc' ,'#fa03ea', '#999999'],
        data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
        }
      ]
    },
    cuesLongevity: {
      labels: [
        { name:'Genomic instability', spaceid:'0704981111', active: false, expand: true, glueup: 'Longevity', gluedown: 'cuesLongevity' },
        { name:'Telomere attrition', spaceid:'0704981112', active: false, expand: true, glueup: 'Longevity', gluedown: 'cuesLongevity' },
        { name:'Epigenetic alterations', spaceid:'0704981113', active: false, expand: true, glueup: 'Longevity', gluedown: 'cuesLongevity' },
        { name:'Loss of proteostasis', spaceid:'0704981114', active: false, expand: true, glueup: 'Longevity', gluedown: 'cuesLongevity' },
        { name:'Deregulated nutrient-sensing', spaceid:'0704981115', active: false, expand: true, glueup: 'Longevity', gluedown: 'cuesLongevity' },
        { name:'Mitochondrial dysfunction', spaceid:'0704981116', active: false, expand: true, glueup: 'Longevity', gluedown: 'cuesLongevity' },
        { name:'Cellular senescence', spaceid:'0704981117', active: false, expand: true, glueup: 'Longevity', gluedown: 'cuesLongevity' },
        { name:'Stem cell exhaustion', spaceid:'0704981118', active: false, expand: true, glueup: 'Longevity', gluedown: 'cuesLongevity' },
        { name:'Altered intercellular communication', spaceid:'0704981119', active: false, expand: true, glueup: 'Longevity', gluedown: 'cuesLongevity' },
        { name:'besearch', spaceid:'0704981120', active: false, expand: true, glueup: 'Longevity', gluedown: 'cuesLongevity' }
      ],
      datasets: [
        {
        backgroundColor: ['#d642cc' ,'#fa03ea', '#999999'],
        data: [30, 30, 30]
        }
      ]
    },
    selectCues: {
    },
    natureBoundries: {
      labels: ['Novel entities', 'Ozone depletion', 'Aresol loading', 'Ocean acidification', 'Bio geochemical flows', 'Freshwater change', 'Landsystem change', 'Biosphere integrity', 'Climate change CO2', 'Climate radiating forcing', 'Besearch', 'Besearch'],
      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992', '#17c8d1', '#f08113', '#61819c', '#e66553', '#8bf5b0', '#181fe7' ,'#174fe7', '#999999'],
        data: [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30]
        }
      ]
    },
    longevityCues: {
      labels: [
        'Genomic instability',
        'Telomere attrition',
        'Epigenetic alterations',
        'Loss of proteostasis',
        'Deregulated nutrient-sensing',
        'Mitochondrial dysfunction',
        'Cellular senescence',
        'Stem cell exhaustion',
        'Altered intercellular communication',
        'besearch'
      ],
      datasets: [
        {
        backgroundColor: ['#191fe7', '#920914', '#09921c', '#560992', '#17c8d1', '#f08113', '#61819c', '#e66553', '#8bf5b0', '#999999'],
        data: [36, 36, 36, 36, 36, 36, 36, 36, 36, 36]
        }
      ]
    },
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
    setSpaceGlue () {
      // get data from library and use cue utility to prepare data for context
      this.selectCues = {
        cuesNature: this.cueUtil.cueTestWheels('cuesNature'),
        cuesEnvironment: this.cueUtil.cueTestWheels('cuesEnvironment'),
        cuesCulture: this.cueUtil.cueTestWheels('cuesCulture'),
        cuesLife: this.cueUtil.cueTestWheels('cuesLife'),
        cuesLongevity: this.cuesLongevity,
        cuesBody: this.cueUtil.cueTestWheels('cuesBody')
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
        console.log('flake is active prepare cues')
        // any relationships active?
        if (this.glueRelActive === 'down') {
          console.log('glue down relationshiop in flake mode')
          console.log(this.activeCueExpanded)
          this.cuesFlakeCount = 0
          for (let cueE of this.activeCueExpanded) {
            this.flakeCuesListGlue(cueE.key)
            this.prepareFlakeExpanded(cueE.key)
          }
        } else {
          // need to prepare/ map to sub cues and then to N=1/decisions to show boundry state ie. low just right  concern
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
    }    
  }
})