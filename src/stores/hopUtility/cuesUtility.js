'use strict'
import { Info } from 'luxon'
/**
*  CuesUtility
*
*
* @class CuesUtility
* @package    CuesUtility
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'
import hashObject from 'object-hash'

class CuesUtility {

  constructor() {
    // super()
    this.trackGaia = []
  }

  /**
  * match cue to another
  * @method cueMatch
  *
  */
  cueMatch = function (cueIn) {
    let matchC = {}
    return matchC
  }

  /**
   * offer default cues
   * @method cuesDefaults
  */
  cuesDefault = function () {
    // build data cue holder
    let cueHolder = {}
    cueHolder.cuid = cueID // ask LLM to prepare ref contract next release tiny LLM
    cueHolder.name = cueName.value
    cueHolder.relationship = cuesNew.value
    // storeLibrary.sendMessage(refContract)
    // save cues & relationship(s)
    const cueContract = {}
    cueContract.type = 'library'
    cueContract.action = 'cues'
    cueContract.reftype = 'new-cues'
    cueContract.task = 'PUT'
    cueContract.privacy = 'public'
    cueContract.data = cueHolder
    storeLibrary.sendMessage(cueContract)
  }

  /**
  * test cues wheels
  * @method cueTestWheels
  *
  */
  cueTestWheels = function (testID) {

    let testCues = {}
    testCues.cuesNature = {
      labels: [
        { name:'Universe', spaceid:'000981111', active: false, expand: true, glueup: 'Nature', gluedown: 'cuesNature' },
        { name:'Climate/weather', spaceid:'000982111', active: false, expand: true, glueup: 'Nature', gluedown: 'cuesNature' },
        { name:'Biodiversity', spaceid:'000983111', active: false, expand: true, glueup: 'Nature', gluedown: 'cuesNature' }
      ],
      datasets: [
        {
        backgroundColor: ['#098133', '#6aee63', '#09921c'],
        data: [30, 30, 30]
        }
      ]
    }

    testCues.cuesEnvironment = {
      labels: [
        { name:'Farming', spaceid:'003981111', active: false, expand: true, glueup: 'Environment', gluedown: 'cuesEnvironment' },
        { name:'Buildings', spaceid:'003981112', active: false, expand: true, glueup: 'Environment', gluedown: 'cuesEnvironment' },
        { name:'Travel', spaceid:'003981113', active: false, expand: true, glueup: 'Environment', gluedown: 'cuesEnvironment' }
      ],
      datasets: [
        {
        backgroundColor: ['#098133', '#6aee63', '#09921c'],
        data: [30, 30, 30]
        }
      ]
    },
    testCues.cuesCulture = {
      labels: [
        { name:'Money', spaceid:'003981111', active: false, expand: true, glueup: 'Culture', gluedown: 'cuesCulture' },
        { name:'Work', spaceid:'000381112', active: false, expand: true, glueup: 'Culture', gluedown: 'cuesCulture' },
        { name:'Music/Arts', spaceid:'000381113', active: false, expand: true, glueup: 'Culture', gluedown: 'cuesCulture' }
      ],
      datasets: [
        {
        backgroundColor: ['#0a22e8', '#838ddc', '#d2d7f8'],
        data: [30, 30, 30]
        }
      ]
    }

    testCues.cuesLife = {
      labels: [
        { name:'Food', spaceid:'004981111', active: false, expand: true, glueup: 'Life', gluedown: 'cuesLife' },
        { name:'Movement', spaceid:'004981112', active: false, expand: true, glueup: 'Life', gluedown: 'cuesLife' },
        { name:'Sleep/mind', spaceid:'004981113', active: false, expand: true, glueup: 'Life', gluedown: 'cuesLife' }
      ],
      datasets: [
        {
        backgroundColor: ['#d642cc' ,'#fa03ea', '#999999'],
        data: [30, 30, 30]
        }
      ]
    }

    testCues.cuesBody = {
      labels: [
        { name:'Heart', spaceid:'024981111', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Brain', spaceid:'024981112', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Liver', spaceid:'024981113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Thyroid', spaceid:'024981111', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Immune sytem', spaceid:'024981112', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Autoimmunity', spaceid:'024981113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Metabolic', spaceid:'024981111', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Nutrients', spaceid:'024981112', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Stress', spaceid:'024981113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Pancreas', spaceid:'024982113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Blood', spaceid:'024983113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Electrolytes', spaceid:'024984113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Urine', spaceid:'024985113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Allergies', spaceid:'024986113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Sexual health', spaceid:'024987113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Epigenetic clock', spaceid:'024988113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Muscle', spaceid:'224911113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Bones', spaceid:'324981113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Fat', spaceid:'424982113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Genes', spaceid:'524983113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },
        { name:'Epigenomics', spaceid:'624984113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },{ name:'Gastro. guts', spaceid:'624985113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },{ name:'Hair', spaceid:'624984113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },{ name:'Skin', spaceid:'624984113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },{ name:'Joints', spaceid:'624984113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },{ name:'Ears', spaceid:'624984113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },{ name:'Eyes', spaceid:'624984113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },{ name:'Mouth/teeth', spaceid:'624984113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },{ name:'', spaceid:'624984113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' },{ name:'', spaceid:'624984113', active: false, expand: true, glueup: 'Body', gluedown: 'cuesBody' }
      ],
      datasets: [
        {
        backgroundColor: ['#d642cc' ,'#fa03ea', '#999999'],
        data: [30, 30, 30]
        }
      ]
    }

    return testCues[testID]
  }

  /**
  * prepare save cue contract
  * @method prepareCuesContractPrime
  *
  */
  prepareCuesContractPrime = function (cueInfo) {
    console.log('prepareCuesContractPrime')
    console.log(cueInfo)
    // structure inputs for cue contract
    const cueContract = {}
    cueContract.type = 'library'
    cueContract.action = 'cues'
    cueContract.reftype = 'new-cues'
    cueContract.task = 'PUT'
    cueContract.privacy = 'public'
    let cueHolder = {}
    let concept = {}
    concept.name = cueInfo.name
    concept.settings = { glue: 'prime', datatype: cueInfo.contract.key, backgroundColor: cueInfo.color }
    cueHolder.concept = concept
    cueHolder.computational = { relationship: [] } 
    cueContract.data = cueHolder
    return cueContract
  }

  /**
  * take four down cues and add to gaia cue contract
  * @method updataGaiaRelationships
  *
  */
  updataGaiaRelationships = function (contract) {
    const cueContract = {}
    cueContract.type = 'library'
    cueContract.action = 'cues'
    cueContract.reftype = 'new-cues'
    cueContract.task = 'PUT'
    cueContract.privacy = 'public'
    let cueHolder = {}
    cueHolder.refdatatype = contract.key // ask LLM to prepare ref contract next release tiny LLM
    cueHolder.name = contract.concept.name
    for (let cue of this.trackGaia) {
      cueHolder.relationship.push({ glue: 'down', datatype: cue, display: { labels: [''], datasets: [{ backgroundColor: [ 'blue' ], data: [ 360 ] }] } })
    }
    cueContract.data = cueHolder
    return cueContract
  }

  /**
   * parepare cue display data structure
   * @method cueDisplayMake
  */
  cueDisplayMake = function (cueKey, cueRel, existingRels) {
    console.log('make cue how many to dispay based on relationship selected')
    console.log(cueKey)
    console.log(cueRel)
    console.log(existingRels)
    let existingLabels = []
    let existingDatasets = []
    // first time add?
    if (Object.keys(existingRels).length === 0 ) {
      existingRels = {
        labels: [],
        datasets: {
          backgroundColor: [],
          data: []
        }
      }
    }
    // capture existing label and dataset arrays
    existingLabels = existingRels.labels
    existingDatasets = existingRels.datasets
    // is a prime or relationship structure coming in?
    
    // add new label and dataset
    existingLabels.push(cueRel.value.concept.name)
    existingDatasets.backgroundColor.push(cueRel.value.concept.settings.backgroundColor)
    // size of each segment
    let segUpdate = this.prepareSegmentSize(existingLabels.length)
    existingDatasets.data = segUpdate
    // structure needed{ labels: [ dataCue.contract.value.concept.name], datasets: [{ backgroundColor: [colorCue], data: [ 360 ] }] }
    let displayData = {}
    displayData = { labels: existingLabels, datasets: [{ backgroundColor: existingDatasets.backgroundColor, data: existingDatasets.data }] }
    return displayData
  }

  /* look at relationship type and update cue wheel
  * @method prepareGlueWheel
  *
  */
  prepareGlueWheel = function (glueType, cueData) {
    console.log('build wheel based on glue type')
    console.log(glueType)
    console.log(cueData)
    let glueClueData = {}
    let beebeeFeedback = ''
    let glueWheel = []
    for (let cl of cueData.value.computational) {
      console.log(cl)
      if (cl) {
        if (cl.glue === glueType) {
          console.log(cl)
          glueWheel.push(cl)
          // prepare data label and dataset for wheel do maths for segments radius
          // match datatype key to contract info to get name
        } else {
          console.log('no match')
          beebeeFeedback = 'no match'
        }
      } else {
        console.log('no relationship')
      }
    }
    // prepare segment size
    console.log(glueWheel)
    let segmentSize = 0
    let segmentNumber = guleWheel.length
    if (segmentNumber > 0) {
      segmentSize = 360 / segmentNumber
    }
    // loop over and prepare display data structure
    let wheelDisplay = {}
    let cueLabels = []
    let cueDatasets = {}
    let cueColors = []
    let segList = []
    for (let cue of glueWheel) {
      // look up datatype contract
      cueLabels.push(cue.name)
      cueColors.push(cue.color)
      segList.push(segmentSize)
    }
    cueDatasets = { backgroundColor: cueColors, data: segList }
    wheelDisplay = { labels: cueLabels, datasets: cueDatasets }
    glueClueData = {}
    glueClueData.wheeldata = wheelDisplay
    glueClueData.feedback = beebeeFeedback
    return glueClueData
  }


  /* prepare segment size
  * @method prepareSegmentSize
  *
  */
  prepareSegmentSize = function (noSegs) {
    let segArray = []
    let segmentSize = 360 / noSegs
    for (let i = 0; i < noSegs; i++) {
      segArray.push(segmentSize)
    }
    return segArray
  }

  /* prepare save contract message
  * @method prepareDTgaiaMessage
  *
  */
  prepareDTgaiaMessage = function (contract) {
    let gaiaJack = []
    // gaia
    const refContract = {}
    refContract.type = 'library'
    refContract.action = 'contracts'
    refContract.reftype = 'datatype'
    refContract.task = 'PUT'
    refContract.privacy = 'public'
    let dtSettings = {}
    dtSettings.primary =  true
    dtSettings.name = 'gaia'
    dtSettings.description = 'sovereign intelligence'
    dtSettings.wiki = 'https://en.wikipedia.org/wiki/Gaia_hypothesis'
    dtSettings.rdf = 'https://dbpedia.org/page/Gaia_hypothesis'
    dtSettings.measurement = 'Integer' 
    dtSettings.datatypeType = 'datatype'
    refContract.data = dtSettings
    gaiaJack.push(refContract)
    // nature
    const refContract1 = {}
    refContract1.type = 'library'
    refContract1.action = 'contracts'
    refContract1.reftype = 'datatype'
    refContract1.task = 'PUT'
    refContract1.privacy = 'public'
    let dtSettings1 = {}
    dtSettings1.primary =  true
    dtSettings1.name = 'nature'
    dtSettings1.description = 'rolling out of universe'
    dtSettings1.wiki = 'https://en.wikipedia.org/wiki/Nature'
    dtSettings1.rdf = 'https://dbpedia.org/page/Nature'
    dtSettings1.measurement = 'Integer' 
    dtSettings1.datatypeType = 'datatype'
    refContract1.data = dtSettings1
    gaiaJack.push(refContract1)
    // environment
    const refContract2 = {}
    refContract2.type = 'library'
    refContract2.action = 'contracts'
    refContract2.reftype = 'datatype'
    refContract2.task = 'PUT'
    refContract2.privacy = 'public'
    let dtSettings2 = {}
    dtSettings2.primary =  true
    dtSettings2.name = 'environment'
    dtSettings2.description = ''
    dtSettings2.wiki = 'https://en.wikipedia.org/wiki/Built_environment'
    dtSettings2.rdf = 'https://dbpedia.org/page/Built_environment'
    dtSettings2.measurement = 'Integer' 
    dtSettings2.datatypeType = 'datatype'
    refContract2.data = dtSettings2
    gaiaJack.push(refContract2)
    // culture
    const refContract3 = {}
    refContract3.type = 'library'
    refContract3.action = 'contracts'
    refContract3.reftype = 'datatype'
    refContract3.task = 'PUT'
    refContract3.privacy = 'public'
    let dtSettings3 = {}
    dtSettings3.primary =  true
    dtSettings3.name = 'culture'
    dtSettings3.description = 'humanity invention'
    dtSettings3.wiki = 'https://en.wikipedia.org/wiki/Culture'
    dtSettings3.rdf = 'https://dbpedia.org/page/Culture'
    dtSettings3.measurement = 'Integer' 
    dtSettings3.datatypeType = 'datatype'
    refContract3.data = dtSettings3
    gaiaJack.push(refContract3)
    // life
    const refContract4 = {}
    refContract4.type = 'library'
    refContract4.action = 'contracts'
    refContract4.reftype ='datatype'
    refContract4.task = 'PUT'
    refContract4.privacy = 'public'
    let dtSettings4 = {}
    dtSettings4.primary =  true
    dtSettings4.name = 'life'
    dtSettings4.description = 'be alive'
    dtSettings4.wiki = 'https://en.wikipedia.org/wiki/Life'
    dtSettings4.rdf = 'https://dbpedia.org/page/Life'
    dtSettings4.measurement = 'Integer' 
    dtSettings4.datatypeType = 'datatype'
    refContract4.data = dtSettings4
    gaiaJack.push(refContract4)

    return gaiaJack
  }


}

  export default CuesUtility