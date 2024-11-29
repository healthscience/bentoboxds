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


}

  export default CuesUtility