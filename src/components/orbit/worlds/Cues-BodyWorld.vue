<template>
  <div id="world-holder">
    <div id="canvas-container" ref="canvasContainer">
    <div id="mode-display">{{ storeBesearch.canvasState.currentMode }}</div>
      <div id="zoom-controls">
        <button @click="zoomIn" class="zoom-btn">+</button>
        <span class="zoom-display">{{ zoomPercentage }}%</span>
        <button @click="zoomOut" class="zoom-btn">-</button>
      </div>
      <!-- canvas for besearch worlds -->
      <canvas id="besearch-world" ref="canvasbe"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, onUpdated, reactive, watch, nextTick } from 'vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { accountStore } from '@/stores/accountStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { besearchStore } from '@/stores/besearchStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { useBesearchCanvas } from '@/composables/useBesearchCanvas.js'

  const storeCues = cuesStore()
  const storeAI = aiInterfaceStore()
  const storeAccount = accountStore()
  const storeBentobox = bentoboxStore()
  const storeBesearch = besearchStore()
  const storeLibrary = libraryStore()


  // Canvas references
  const canvasbe = ref(null)
  const canvasContainer = ref(null)

  // Panel management
  const isLifeToolsOpen = ref(false)
  const isDragging = ref(false)
  const startX = ref(0)
  const currentX = ref(0)
  const panelWidth = ref(300) // Default panel width

  // Zoom display
  const zoomPercentage = ref(100)

  // Intervention toolbar refs
  const showInterventionToolbar = ref(false)
  const interventionToolbarRef = ref(null)

  // ResizeObserver reference for cleanup
  let resizeObserver = null
  let lastKnownSize = { width: 0, height: 0 }
  let isResizing = false

  // Use the new canvas composable
  const {
    canvasState,
    setMode,
    updatePeerPosition,
    updatePeerDirection,
    addIntervention,
    getCanvasManager,
    initializeCanvas,
    destroy
  } = useBesearchCanvas(canvasbe, (zoom) => {
    // Callback to update zoom percentage when zoom changes from any source
    zoomPercentage.value = Math.round(zoom * 100)
  }, false)

  defineExpose({ canvasbe })

  /* on mount */
  onMounted(async () => {
    // Canvas initialization is now handled by the useBesearchCanvas composable
    // Add ResizeObserver to handle window resize
    // Watch the canvas container instead of the canvas itself
    // This ensures we detect when the container grows/shrinks
    if (canvasContainer.value) {
      resizeObserver = new ResizeObserver((entries) => {
        if (isResizing) {
          return
        }
        for (const entry of entries) {
          const newWidth = entry.contentRect.width
          const newHeight = entry.contentRect.height
          
          // Only resize if dimensions actually changed significantly (more than 5px)
          // This prevents the feedback loop from setupCanvas
          if (Math.abs(newWidth - lastKnownSize.width) > 5 ||
              Math.abs(newHeight - lastKnownSize.height) > 5) {
            lastKnownSize = { width: newWidth, height: newHeight }
            isResizing = true
            const manager = getCanvasManager()
            if (manager) {
              // Call the full handleResize method which includes re-centering
              manager.handleResize()
            }
            // Reset flag after a delay
            setTimeout(() => {
              isResizing = false
            }, 200)
          }
        }
      })
      resizeObserver.observe(canvasContainer.value)
      // Store initial size
      const rect = canvasContainer.value.getBoundingClientRect()
      lastKnownSize = { width: rect.width, height: rect.height }
    }

    // Initialize canvas if activeWorld is body
    if (storeAI.activeWorld === 'body') {
      console.log('Initializing body world canvas on mount');
      await nextTick();
      await initializeCanvas();
    }
  })

  /* on unmount */
  onUnmounted(() => {
    // Disconnect ResizeObserver
    /* if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    } */
  })

  /* computed */
  const bentochatStatus = computed(() => {
    return storeAI.bentochatState
  })

  const bentoBesearchStatus = computed(() => {
    return storeAI.bentobesearchState
  })

  const currentZIndex = computed(() => {
    return storeBentobox.isBentospaceActive ? 1100 : 1300
  })

  const selectedIntervention = computed(() => storeBesearch.selectedIntervention)
  const selectedCategory = computed(() => storeBesearch.selectedCategory)
  const nexusWorld = computed(() => storeBesearch.nexusContext.world)
  const storeCanvasMode = computed(() => storeBesearch.canvasState.currentMode)
  const activeWorld = computed(() => {
    const mode = canvasState.currentMode
    if (mode === 'cues') return 'cues'
    if (mode === 'body') return 'body'
    if (mode === 'earth') return 'earth'
    return null
  })


  // Watch for activeWorld changes to initialize canvas
  watch(() => storeAI.activeWorld, async (newWorld) => {
    console.log('activeWorld changed to:', newWorld);
    if (newWorld === 'body') {
      console.log('Active world changed to body, initializing canvas');
      await nextTick();
      await nextTick();
      await initializeCanvas();
    } else {
      console.log('Active world is not body, destroying canvas');
      destroy();
    }
  }, { immediate: true })

  // Watch for modal visibility to ensure canvas is properly initialized
  watch(bentoBesearchStatus, async (isOpen) => {
    if (isOpen) {
      // Wait a bit for the modal to fully render
      await nextTick()
      await nextTick() // Double nextTick to ensure DOM is fully updated
      await initializeCanvas()
      if (canvasbe.value) {
        const rect = canvasbe.value.getBoundingClientRect()
      }
      // Log the current canvas state when modal opens
      const manager = getCanvasManager()
      if (manager && manager.stateManager) {
        // Restore saved canvas state
        const canvasState = storeBesearch.canvasState;
        // Update manager state
        manager.stateManager.setMode(canvasState.currentMode);
        manager.stateManager.zoom = canvasState.zoom;
        manager.stateManager.panOffset = { ...canvasState.panOffset };
        manager.stateManager.setViewport(canvasState.viewport.x, canvasState.viewport.y);
        // Restore peer position
        if (manager.peer) {
          const peerPosition = storeBesearch.getPeerPosition();
          manager.peer.setPosition(peerPosition.x, peerPosition.y);
          manager.stateManager.centerOn(manager.peer);
        }
        // Ensure renderer has fresh dimensions after modal open
        manager.handleResize()
        manager.render()
      }
    } else {
      destroy()
    }
  })

  // Watch for intervention selections from store
  watch(selectedIntervention, (newIntervention) => {
    if (newIntervention) {
      if (newIntervention.type === 'create') {
        // Handle create new intervention
      } else {
        // Show intervention in toolbar
        showInterventionToolbar.value = true
        interventionToolbarRef.value?.showIntervention(newIntervention)
      }
    }
  })

  watch(selectedCategory, (newCategory) => {
    if (newCategory) {
      // Show category in toolbar
      showInterventionToolbar.value = true
      interventionToolbarRef.value?.showCategory(newCategory)
    }
  })

  watch(nexusWorld, (newWorld) => {
    if (newWorld && canvasState.currentMode !== newWorld) {
      setMode(newWorld)
    }
  })

  watch(storeCanvasMode, (newMode) => {
    if (newMode && canvasState.currentMode !== newMode) {
      canvasState.currentMode = newMode
      setMode(newMode)
    }
  })

  // Canvas initialization is now handled by useBesearchCanvas composable
  /* methods */
  const setShowBeeBee = () => {
    storeAI.bentochatState = !storeAI.bentochatState
  }

  /** peer nav in canvas space **/
  // Handle peer movement events from life tools
  const handlePeerMoved = (peerData) => {
    // Delegate to canvas manager
    updatePeerDirection(peerData.direction)
  }

  // Handle mode changes from life tools
  const handleModeChange = (mode) => {
    setMode(mode)
    // close the lifetools
    isLifeToolsOpen.value = false
  }

   /* zoom controls */
  const zoomIn = () => {
    const manager = getCanvasManager()
    if (manager && manager.stateManager) {
      manager.stateManager.zoomIn()
      // Update zoom percentage display
      zoomPercentage.value = Math.round(manager.stateManager.zoom * 100)
      canvasState.zoom = manager.stateManager.zoom
    }
  }

  const zoomOut = () => {
    const manager = getCanvasManager()
    if (manager && manager.stateManager) {
      manager.stateManager.zoomOut()
      // Update zoom percentage display
      zoomPercentage.value = Math.round(manager.stateManager.zoom * 100)
      canvasState.zoom = manager.stateManager.zoom
    }
  }

  /* methods */


</script>

<style scoped>
#world-holder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

#besearch-holder {
  display: grid;
  grid-template-columns: auto 1fr !important; /* Force responsive columns */
  grid-row: 1; /* First row in modal-body grid */
  width: 100% !important;
  height: 100% !important;
  overflow: hidden;
  position: relative;
  min-height: 0; /* Critical for grid children to shrink properly */
  min-width: 0;
}

#cycle-periods {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  justify-items: center;
  margin-bottom: 1em;
}

#canvas-container {
  position: relative;
  width: 100% !important;
  height: 100% !important;
  overflow: visible; /* Ensure zoom controls stay visible */
  min-height: 0; /* Critical for grid children to shrink properly */
  min-width: 0; /* Critical for grid children to shrink properly */
  max-width: 100%;
  max-height: 100%;
}

#mode-display {
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  z-index: 15;
  text-transform: capitalize;
}

#zoom-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  align-items: center;
  z-index: 15;
}

.zoom-btn {
  width: 30px;
  height: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.zoom-btn:hover {
  background-color: rgba(255, 255, 255, 1);
}

.zoom-display {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  min-width: 50px;
  text-align: center;
}

#besearch-world {
  display: block !important; /* Force block display, override any global grid styles */
  border: 1px solid rgb(163, 155, 201);
  border-radius: 2%;
  position: relative;
  z-index: 10;
  background-color: white;
  width: 100% !important;
  height: 100% !important;
  box-sizing: border-box; /* Include border in dimensions */
  max-width: 100%;
  max-height: 100%;
}

#besearch-modal-header {
  display: grid;
  grid-template-columns: 1fr 8fr 1fr;
}

.btn-green {
  display: inline-grid;
  height: 28px;
  margin-right: .4em;
  background-color: #b8cde2;
  color: #140d6b;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

#life-tools-container {
  position: relative;
  height: 100%;
  min-width: 50px;
  grid-column: 1; /* Explicitly place in first column */
  z-index: 20; /* Higher than canvas */
}

#life-tools-besearch {
  position: absolute;
  top: 0;
  left: -300px;
  width: 300px;
  height: 100%;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;
  z-index: 60; /* Higher than toggle button */
  overflow-y: auto;
  max-height: 100%;
}

#life-tools-besearch.open {
  left: 0;
}

.toggle-life-tools-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 40;
  cursor: pointer;
  transition: all 0.3s ease;
  display: grid;
  align-items: center;
  justify-content: center;
}


.toggle-life-tools-button.panel-open {
  background-color: rgba(59, 130, 246, 0.9);
}

.toggle-life-tools-button.panel-open .tear {
  background-color: #1e40af;
  border-color: #1e40af;
}

.key-to-life {
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.tear {
  width: 40px;
  height: 40px;
  border-radius: 0 50% 50% 50%;
  border: 3px solid #3b82f6;
  transform: rotate(45deg);
  background-color: #3b82f6;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.key-head {
  position: absolute;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  display: grid;
  place-items: center;
  z-index: 10;
}

.transparent {
  background-color: rgba(255, 255, 255, 0.4);
}

#beebee-agent {
  grid-row: 2; /* Second row in modal-body grid */
  border: 2px solid rgb(202, 199, 241);
}


  @media (min-width: 1024px) {
    #besearch-holder {
      display: grid;
      width: 100%;
      height: 100%;
      position: relative;
    }

    #cycle-periods {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      justify-items: center;
      margin-bottom: 1em;
    }

    #canvas-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    #mode-display {
      position: absolute;
      top: 10px;
      left: 10px;
      background-color: rgba(255, 255, 255, 0.9);
      padding: 5px 10px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      color: #333;
      z-index: 15;
      text-transform: capitalize;
    }

    #besearch-world {
      display: grid;
      grid-template-columns: 1fr;
      border: 1px solid rgb(205, 218, 243); /* Make border more visible for debugging */
      border-radius: 2%;
      width: 100%;
      height: 100%;
    }

    #besearch-modal-header {
      display: grid;
      grid-template-columns: 1fr 8fr 1fr;
    }

    .btn-green {
      display: inline-grid;
      height: 28px;
      margin-right: .4em;
      background-color: #b8cde2;
      color: #140d6b;
      border: none;
      border-radius: 4px;
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    #life-tools-container {
      position: relative;
    }

    #life-tools-besearch {
      position: absolute;
      top: 0;
      left: -520px;
      width: 540px;
      height: 100%;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 -2px 4px rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      transition: left 0.3s ease;
      z-index: 60;
      overflow-y: auto;
      max-height: 100%;
    }

    #life-tools-besearch.open {
      left: 0;
    }

    .toggle-life-tools-button {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 60px;
      height: 60px;
      background-color: transparent;
      border: none;
      border-radius: 50%;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 40;
      cursor: pointer;
      transition: all 0.3s ease;
      display: grid;
      align-items: center;
      justify-content: center;
    }

    .toggle-life-tools-button.panel-open {
      background-color: rgba(59, 130, 246, 0.9);
    }
    
    .toggle-life-tools-button.panel-open .tear {
      background-color: #1e40af;
      border-color: #1e40af;
    }

    .key-to-life {
      position: relative;
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
    }

    .tear {
      width: 40px;
      height: 40px;
      border-radius: 0 50% 50% 50%;
      border: 3px solid #3b82f6;
      transform: rotate(45deg);
      background-color: #3b82f6;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .key-head {
      position: absolute;
      font-size: 12px;
      font-weight: bold;
      color: white;
      text-transform: uppercase;
      display: grid;
      place-items: center;
      z-index: 10;
    }

    .transparent {
      background-color: rgba(255, 255, 255, 0.9) !important;
      background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px) !important;
      background-size: 20px 20px !important;
    }

    #open-beebee {
      position: fixed;
      bottom: 10px;
      right: 120px;
      z-index: 31;
      display: grid;
      justify-content: center;
      place-self: start;
      align-self: start;
      height: 2em;
      width: 5em;
      background-color: white;
    }
  }

</style>
