import { defineStore } from 'pinia'
import CuesUtilty from '@/stores/hopUtility/cuesUtility.js'

export const cuesStore = defineStore('cues', {
  state: () => ({
    cueUtil: new CuesUtilty(),
    bentopathState: false,
    pathListActive: true,
    cuesList: [],
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
    oracleAttention: [] // [{ spaceid: 123221, name: 'cueOne', oracle: 'let me show you . . .'}, { spaceid: 223221, name: 'cueTwo', oracle: 'take a look at'}]
  }),
  actions: {
    processReply (received) {
      // console.log('oracle replies coming in, update bentobox')
      // console.log(received)
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
    }
  }
})