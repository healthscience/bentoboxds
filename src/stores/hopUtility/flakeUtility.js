'use strict'
import { Info } from 'luxon'
/**
*  FlakeUtility
*
*
* @class FlakeUtility
* @package    FlakeUtility
* @copyright  Copyright (c) 2025 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'
import hashObject from 'object-hash'

class FlakeUtility {

  constructor() {
    // super()
    this.trackGaia = []
  }

  /**
  * match flake to another
  * @method flakeMatch
  *
  */
  cueMatch = function (cueIn) {
    let matchC = {}
    return matchC
  }

  /**
  * prepare flake given cue active
  * @method prepareFlakeCues
  *
  */
  prepareFlakeCues = function (cueInfo) {
    let flakeCues = {}
    let flakesListTest = [ { cue: 1, name: 'posture', cuecolor: 'red' }, { cue: 2, name: 'sleep', cuecolor: 'orange' },{ cue: 3, name: 'heart', cuecolor: 'green' }, { cue: 4, name: 'courage', cuecolor: 'green' }, { cue: 5, name: 'sleep', cuecolor: 'orange' }, { cue: 6, name: 'posture', cuecolor: 'red' }]
    // how many cues and how many bentoboxes per cue?  How to rate bentoboxes or besearch within?  Use SafeFlowECS or summaary saved.  Need to check state of besearch cyccles and state in done, inprogress or ongoing
    flakeCues = flakesListTest
    console.log(flakeCues)
    return flakeCues
  } 

}

  export default FlakeUtility