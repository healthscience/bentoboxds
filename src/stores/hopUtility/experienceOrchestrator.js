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
    this.stores = stores; // Expects { ai, besearch, library, chat, loom }
  }

  /**
   * Orchestrate state based on lifestrap data return
   * @param {Object} data - The received lifestrap data
   * @param {Boolean} isNew - Whether this was explicitly triggered as a "new" story
   * @param {Boolean} wasZen - Whether the application was in Zen mode before orchestration
   */
  orchestrateLifestrapReturn(data, isNew = false, wasZen = false) {
    const { ai, besearch, loom } = this.stores;

    console.log('Orchestrating Lifestrap Return. isNew:', isNew, 'wasZen:', wasZen);

    // Sync cycles for this strap
    const strapId = data.id || data.key;
    if (strapId) {
      besearch.loadCyclesForLifestrap(strapId);
    }

    if (isNew) {
      // Brand new story - open the lens
      this.openLens();
      ai.currentMode = 'extracting';
    } else {
      // Returning story - load data but stay in Zen/Current world
      // Ensure we don't force open the lens UI
      console.log('Returning story loaded silently');
      if (wasZen) {
        this.resetToZen();
      }
    }
  }

  /**
   * Transition to Lens view (Sieve)
   */
  openLens() {
    const { ai, besearch } = this.stores;
    besearch.setHUUDState('lens');
  }

  /**
   * Transition to Attunement view
   */
  openAttunement() {
    const { ai, besearch } = this.stores;
    besearch.setHUUDState('attunement');
  }

  /**
   * Transition to Lab view (Sculpting)
   */
  openLab() {
    const { besearch } = this.stores;
    besearch.setHUUDState('besearch');
  }

  /**
   * Transition to Heli Projection
   */
  openHeli() {
    const { besearch } = this.stores;
    besearch.setHUUDLayer('heli');
  }

  /**
   * Orchestrate World transition
   * @param {String} worldId - orbit, body, earth
   */
  orchestrateWorldChange(worldId) {
    const { ai, besearch } = this.stores;
    ai.activeWorld = worldId;
    // When changing world manually, we usually want to be in world layer
    besearch.setHUUDState('default');
  }

  /**
   * Orchestrate explicit user selection of a lifestrap
   * @param {Object} strapData 
   */
  handleLifestrapSelection(strapData) {
    const { ai, besearch, chat } = this.stores;
    const strapId = strapData.id || strapData.key || 'unknown';
    console.log('Orchestrating Lifestrap Selection:', strapId);
    
    // 1. Load cycles for this specific lifestrap
    besearch.loadCyclesForLifestrap(strapId);

    // 2. Clear the world and set for new lifestrap story
    ai.activeWorld = 'orbit';
    ai.isInitialState = false;
    ai.setActiveLifeStrap(strapData);
    ai.currentMode = 'extracting';

    // 3. HUD should stay in World mode when selecting from lifetools
    besearch.setHUUDState('default');

    // 4. Ensure panels are closed
    besearch.showBottomPanel = false;
    chat.isChatOpen = false;
    chat.chatWidth = 0;
    
    // We don't call openLens() here because we want the panels closed initially
    // as per the requirement "close the panels and just present the world".
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
    const { ai, besearch, chat, loom } = this.stores;
    
    ai.currentMode = 'zen';
    ai.activeWorld = 'orbit';
    ai.showLifestapLens = false;
    if (loom) loom.digestInput = null;
    ai.isInitialState = true;
    
    chat.chatWidth = 0;
    chat.isChatOpen = false;
    chat.isUnrolled = false; // Collapse Beebee ribbon
    chat.isInterplayActive = false;
    
    besearch.showBottomPanel = false;
    besearch.setHUUDState('default');
    
    chat.chatWidth = 0;
    chat.isChatOpen = false;
  }
}

export default ExperienceOrchestrator;
