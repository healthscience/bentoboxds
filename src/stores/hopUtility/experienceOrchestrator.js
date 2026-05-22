'use strict'
/**
 * ExperienceOrchestrator
 *
 * Handles cross-store "Experience" transitions (panels, layers, world settings)
 * triggered by incoming data or user actions.
 *
 * @class ExperienceOrchestrator
 * @package    BeeBeeParse
 * @copyright  Copyright (c) 2026 James Littlejohn
 */

export class ExperienceOrchestrator {
  constructor(stores) {
    this.stores = stores; // Expects { ai, besearch, library, chat }
  }

  /**
   * Orchestrate state based on lifestrap data return
   * @param {Object} data - The received lifestrap data
   * @param {Boolean} isNew - Whether this was explicitly triggered as a "new" story
   * @param {Boolean} wasZen - Whether the application was in Zen mode before orchestration
   */
  orchestrateLifestrapReturn(data, isNew = false, wasZen = false) {
    const { ai, besearch } = this.stores;

    console.log('Orchestrating Lifestrap Return. isNew:', isNew, 'wasZen:', wasZen);

    if (isNew) {
      // Brand new story or explicit "new" action - open the lens
      besearch.setHUUDState('lens');
      ai.showLifestapLens = true;
      besearch.showBottomPanel = true;
      besearch.bottomHeight = window.innerHeight * 0.82;
      ai.currentMode = 'extracting';
    } else {
      // Peer return / background load - load silently
      // Ensure panels are closed if we were in Zen mode
      if (wasZen) {
        console.log('Zen load detected, ensuring panels closed');
        besearch.showBottomPanel = false;
        ai.showLifestapLens = false;
        besearch.setHUUDState('default');
        ai.currentMode = 'zen'; // Force back to Zen if it was changed
      }
    }
  }

  /**
   * Orchestrate explicit user selection of a lifestrap
   * @param {Object} strapData 
   */
  handleLifestrapSelection(strapData) {
    const { ai, besearch } = this.stores;
    
    console.log('Orchestrating Lifestrap Selection:', strapData.id);
    
    // Explicit selection always opens the lens
    ai.setActiveLifeStrap(strapData);
    ai.currentMode = 'extracting';
    besearch.setHUUDState('lens');
    besearch.showBottomPanel = true;
    besearch.bottomHeight = window.innerHeight * 0.82;
  }

  /**
   * Orchestrate Sculpting Lab transitions
   * @param {Object} data 
   */
  orchestrateSculpting(data) {
    const { besearch } = this.stores;
    besearch.openSculptingLayer();
  }

  /**
   * Reset all panels to initial state
   */
  resetToZen() {
    const { ai, besearch, chat } = this.stores;
    
    ai.currentMode = 'zen';
    ai.activeWorld = 'orbit';
    ai.showLifestapLens = false;
    ai.digestInput = null;
    ai.isInitialState = true;
    
    chat.chatWidth = 0;
    chat.isChatOpen = false;
    chat.isUnrolled = false; // Collapse Beebee ribbon
    
    besearch.showBottomPanel = false;

    besearch.besearchMode = 'default';
    besearch.setHUUDState('default');
    
    chat.chatWidth = 0;
    chat.isChatOpen = false;
  }
}

export default ExperienceOrchestrator;
