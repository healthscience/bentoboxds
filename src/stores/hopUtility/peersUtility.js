'use strict'
/**
*  PeersUtility
*
*
* @class PeersUtility
* @package    PeersUtility
* @copyright  Copyright (c) 2024 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
// import EventEmitter from 'events'

class PeersUtility {

  constructor() {
    // super()
  }

  /**
  * check match if already a connection
  * @method checkPeerMatch
  *
  *
  */
  checkPeerMatch = function (warmPeers, peerDetails) {
    let peerMatch = {}
    if (warmPeers.length > 0) {
      for (let wp of warmPeers) {
        if (wp.key === peerDetails) {
          peerMatch = wp
        }
      }
    }
    return peerMatch
  }

  /**
  *  prepare matched bentobox with layout to share
  * @method n1Match
  *
  *
  */
  n1Match = function (cueID, bboxes, peerLibrary, layoutBBoxes) {
    let peerBBMatch = {}

    let publicN1contracts = []
    // match private nxp to genesis public contract
    for (let bbox of bboxes) {
     for (let n1contract of peerLibrary) {
        if (bbox.contract = n1contract.key) {
          publicN1contracts.push({ boardID: n1contract.value.genesis })
        }
      }
    }
    // layout of boxes
    let bboxLayout = []
    for (let bboxsp of bboxes) {
      bboxLayout.push({ bboxid: bboxsp.bboxid, layout: layoutBBoxes[bboxsp.bboxid] })       
    }

    peerBBMatch.publicN1contracts = publicN1contracts
    peerBBMatch.bLayout = bboxLayout
    return peerBBMatch
  }

}

export default PeersUtility
