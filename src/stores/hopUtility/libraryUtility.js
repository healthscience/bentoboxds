'use strict'
/**
*  LibraryUtility
*
*
* @class LibraryUtility
* @package    LibraryUtility
* @copyright  Copyright (c) 2023 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'

class LibraryUtility { //  extends EventEmitter {

  constructor() {
    // super()
  }

  /**
  * Prepare table for public experiment list available
  * @method preparePublicNXPlist
  *
  *
  */
  preparePublicNXPlist = function (pubExpModules) {
    let gridColumns = ['id', 'name', 'description', 'time', 'device', 'action']
    let gridDatapeer = this.expandModulesrefs(pubExpModules)
    let gridPublic = {}
    gridPublic.columns = gridColumns
    gridPublic.data = gridDatapeer
    return gridPublic
  }

  /**
  * expand moudle reference to reference contract
  * @method expandModulesrefs
  *
  *
  */
  expandModulesrefs = function (pubExpModules) {
    let expandRF = []
    let expandSafeFlowStructure = []
    for (let pubex of pubExpModules.experiment) {
      // now expand out modlues
      for (let modr of pubex.value.modules) {
        // match to module contract
        let modMatch = {}
        for (let modc of pubExpModules.module) {
          if (modc.key === modr) {
            modMatch = modc
          }
        }
        // match ref to ref contract
        let refTypes = ['question', 'packaging', 'compute', 'visualise']
        for (let reft of refTypes) {
          for (let refi of pubExpModules[reft]) {
            if (modMatch?.value?.info?.key === refi?.key) {
              expandRF.push(refi)
            }
          }
        }
      }
      for (let exrc of expandRF) {
        if (exrc.value.refcontract  === 'question') {
          expandSafeFlowStructure.push({ id: pubex.key, name: exrc.value.concept.name, description: '--', time: Infinity, device: 'Yes', action: 'Join' })
        }
      }
    }
    return expandSafeFlowStructure
  }

  /**
  * Prepare table from bentospace saved list
  * @method prepareBentoSpaceJoinedNXPlist
  *
  */
  prepareBentoSpaceJoinedNXPlist = function (peerExpModules, publicRefContracts) {
    let gridColumns = ['id', 'name', 'description', 'time', 'device', 'action']
    let gridDatapeer = []
    for (let expMods of peerExpModules) {
      let gridExp = this.prepareBentoSpaceExperimentSummary(expMods, publicRefContracts)
      gridDatapeer.push(gridExp)
    }
     let gridPeer = {}
    gridPeer.columns = gridColumns
    gridPeer.data = gridDatapeer
    return gridPeer
  }

  /**
  * 
  * extract info. from contracts for display in list format
  * @method prepareBentoSpaceExperimentSummary
  *
  */
  prepareBentoSpaceExperimentSummary = function (peerExpModules, refContractsPublic) {
    let gridDatapeer = {}
    let question2 = {}
    for (let mod of peerExpModules.modules) {
      // look up question
      if (typeof mod.value.info === 'object' && Object.keys(mod.value.info).length > 0) {
        if (mod.value.style === 'question') {
          // get full ref contract
          let fullRef = this.matchRefContract(mod.value.info.key, refContractsPublic, 'question')
          question2 = fullRef.value.concept.name
        } else {
          question2 = 'none'
        }
      }
      if (question2 !== 'none') {
        gridDatapeer = { id: peerExpModules.exp.key, name: question2, description: '--', time: Infinity, dapps: 'Yes', device: 'Yes', action: 'View' }
      }
    }
    return gridDatapeer
  }

  /**
  * 
  * select the network public experiment contract for HOP
  * @method matchPublicNXPcontract
  *
  */
  matchPublicNXPcontract = function (contractID, nxpList) {
    let contractNXP = {}
    for (let nxp of nxpList) {
      if (nxp.exp.key === contractID) {
        contractNXP = nxp
      }
    }
    return contractNXP
  }

  /**
  * 
  * update reference contract settings for join nxp contract
  * @method updateSettings
  *
  */
  updateSettings = function (contract, updates) {
    console.log('update date for compute contract')
    console.log(contract)
    console.log(updates)
    let updateNXPjoinContract = {}

    return updateNXPjoinContract
  }

  /**
  * 
  * select the network experiment contract for HOP
  * @method matchNXPcontract
  *
  */
  matchNXPcontract = function (contractID, nxpList) {
    console.log('match nxp contract')
    console.log(contractID)
    console.log(nxpList)
    let contractNXP = {}
    for (let nxp of nxpList) {
      console.log(nxp)
      if (nxp.exp.key === contractID) {
        contractNXP = nxp
      }
    }
    return contractNXP
  }

  /**
  * 
  * match ref contract id to full ref contract
  * @method matchRefContract
  *
  */
  matchRefContract = function (contractID, refList, reftype) {
    let refContract = {}
    for (let ref of refList[reftype]) {
      if (ref.key === contractID) {
        refContract = ref
      }
    }
    return refContract
  }

}

export default LibraryUtility