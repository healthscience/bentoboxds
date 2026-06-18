'use strict'
/**
 * ExperienceOrchestrator
 *
 * Centralized "Brain" for cross-store transitions.
 * Manages the visibility and state of:
 * - Left Panel (LifeTools)
 * - Right Panel (Beebee Chat)
 * - Bottom Panel (Lens / HUD)
 *
 * @class ExperienceOrchestrator
 */

export class ExperienceOrchestrator {
  constructor(stores) {
    this.stores = stores; // Expects { ai, besearch, library, chat, loom, lifestrap }
  }

  /**
   * Internal helper to sync the three main UI zones
   * @param {Object} config - { left, right, bottom, mode, context }
   */
  syncLayout({ left, right, bottom, mode, context, world = 'orbit' }) {
    const { ai, chat, besearch, library } = this.stores;

    // 1. Mode & World
    if (mode) ai.currentMode = mode;
    if (context) ai.beebeeContext = context;
    ai.activeWorld = world;

    // 2. Left Panel (LifeTools)
    if (library) library.isLifeToolsOpen = !!left;

    // 3. Right Panel (Chat)
    if (right) {
      chat.isChatOpen = true;
      chat.chatWidth = 380;
      chat.isUnrolled = true;
      ai.bentochatState = true;
    } else {
      chat.isChatOpen = false;
      chat.chatWidth = 0;
    }

    // 4. Bottom Panel (HUD/Lens)
    if (bottom) {
      besearch.showBottomPanel = true;
      besearch.bottomHeight = 400;
      besearch.setHUUDState(bottom === true ? 'lens' : bottom);
    } else {
      besearch.showBottomPanel = false;
      besearch.setHUUDState('default');
    }
  }

  /**
   * Called when a lifestrap contract arrives (Genesis or Load)
   */
  onLifestrapArrived(strap) {
    const { ai } = this.stores;
    const isNew = ai.newLifestrap || strap.key === 'prime-life-strap' || strap.key === 'new-ls';
    const wasZen = ai.currentMode === 'zen' || ai.isInitialState;

    this.activateLifestrapState(strap.key);

    if (isNew) {
      ai.currentMode = 'extracting';
      ai.isInitialState = false;
    } else if (wasZen) {
      this.syncLayout({ left: false, right: false, bottom: false, mode: 'active', world: 'orbit' });
    }
  }

  /**
   * Called when the Loom has finished weaving the texture (Final trigger for Lens)
   */
  onTextureWeaved(texture) {
    const { ai } = this.stores;
    ai.isInitialState = false; 
    const isNew = ai.newLifestrap || texture.key === 'prime-life-strap' || texture.key === 'new-ls';
    
    // Ensure the key is active
    if (texture.key) {
      this.activateLifestrapState(texture.key);
    }

    if (isNew) {
      this.syncLayout({
        left: false,
        right: true,
        bottom: 'lens',
        mode: 'extracting',
        context: 'extraction'
      });
      
      this.orchestrateExtraction(texture.story, texture.key);
      
      ai.newLifestrap = false;
    } else {
      this.syncLayout({
        left: false,
        right: true,
        bottom: 'lens',
        mode: 'active',
        context: 'lifestrap'
      });
    }
  }

  /**
   * Orchestrate the extraction dialogue messages
   */
  orchestrateExtraction(peerInput, lsKey) {
    const { chat, ai } = this.stores;
    
    if (!ai.historyPair[lsKey]) ai.historyPair[lsKey] = [];
    if (!chat.chatHistory[lsKey]) chat.chatHistory[lsKey] = [];

    const peerMessage = {
      role: "peer",
      type: "peer",
      content: peerInput || "Story extraction initiated...",
      context: "extraction",
      conversationId: lsKey,
      contract_key: lsKey,
      lifeStrapID: lsKey,
      timestamp: new Date(),
    };

    const agentMessage = {
      role: "beebee",
      type: "agent",
      content: "beebee is digesting the story.",
      context: "extraction",
      conversationId: lsKey,
      contract_key: lsKey,
      lifeStrapID: lsKey,
      status: "complete",
      timestamp: new Date(),
    };

    chat.addMessage(peerMessage);
    chat.addMessage(agentMessage);

    // Also populate historyPair for safety, as some components might still use it
    ai.historyPair[lsKey].push({
      question: { bbid: `q_${Date.now()}`, data: { text: peerMessage.content, active: true } },
      reply: { time: agentMessage.timestamp, type: "extraction", data: { text: agentMessage.content } }
    });
    
    chat.beginChat = true;
  }

  /**
   * Centralized method to set active lifestrap keys
   */
  activateLifestrapState(lsKey) {
    const { ai } = this.stores;
    ai.activeLifestrapKey = lsKey;
    ai.activeLifeStrapID = lsKey;
    ai.activeContractKey = lsKey;
    ai.chatAttention = lsKey;
    ai.lifeStrapID = lsKey;
  }

  /**
   * Handle manual user selection of a story
   */
  handleLifestrapSelection(strapData) {
    const { ai, besearch, loom } = this.stores;
    const lsKey = strapData.key || strapData.id;
    
    besearch.loadCyclesForLifestrap(lsKey);
    this.activateLifestrapState(lsKey);
    ai.setActiveLifeStrap(strapData); 
    ai.liveBspace = null; // Clear space context when selecting lifestrap

    if (loom && typeof loom.applyStrapTexture === 'function') {
      loom.applyStrapTexture(lsKey, strapData);
    }

    this.syncLayout({
      left: false,
      right: true,
      bottom: 'lens',
      mode: 'active',
      context: 'lifestrap'
    });
  }

  resetToZen() {
    this.syncLayout({ left: false, right: false, bottom: false, mode: 'zen', world: 'orbit' });
    this.stores.ai.isInitialState = true;
  }
}

export default ExperienceOrchestrator;
