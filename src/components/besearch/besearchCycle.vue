<template>
  <Teleport to="body">
    <modal-besearch :show="bentoBesearchStatus" @close="closeBentoBesearch">
      Besearch
      <template #header>
        <div id="besearch-modal-header">
          <button
            type="button"
            class="btn-green"
            @click="closeBentoBesearch"
            aria-label="Close modal"
          >
            Close
          </button>
          <div id="cues-context">Besearch</div>
          <div id="return-modal-close" @click="closeBentoBesearch">return</div>
        </div>
      </template>
      <template #body>
        <div id="besearch-holder">
          <div id="life-tools-container">
            <div
              id="life-tools-besearch"
              :class="{ 'open': isLifeToolsOpen, 'transparent': true }"
              class="life-tools-besearch"
            >
              <button
                @click="toggleLifeTools()"
                @mousedown="startDrag"
                @mousemove="drag"
                @mouseup="endDrag"
                @mouseleave="endDrag"
                class="toggle-life-tools-button"
              >
                <div class="key-to-life">
                  <div class="tear"></div>
                  <div class="key-head">be</div>
                </div>
              </button>
              <life-tools @mode-selected="handleModeChange" @peer-moved="handlePeerMoved"  @peer-intervention="handlePeerIntervention"></life-tools>
            </div>
          </div>
          <canvas id="besearch-cycles" :width="canvasWidth" :height="canvasHeight" ref="canvasbe" 
            @click="handleBesearchClick($event)"
            @mousedown="handleCanvasMouseDown($event)"
            @mousemove="handleCanvasMouseMove($event)"
            @mouseup="handleCanvasMouseUp($event)"
            @mouseleave="handleCanvasMouseUp($event)"
          ></canvas>
        </div>
        <div id="beebee-agent">
          <button id="open-beebee" @click.prevent="setShowBeeBee">
            beebee
          </button>
         <beebee-ai></beebee-ai>
        </div>
        
        <!-- Intervention Toolbar -->
        <intervention-toolbar 
          ref="interventionToolbarRef"
          :show="showInterventionToolbar"
          @close="closeInterventionToolbar"
          @select-intervention="handleInterventionSelect"
          @edit="handleInterventionEdit"
          @delete="handleInterventionDelete"
          @link-cycle="handleLinkCycle"
          @add-intervention-to-canvas="handleAddInterventionToCanvas"
        />
      </template>
      <template #footer>
        Besearch
      </template>
    </modal-besearch>
  </Teleport>
</template>

<script setup>
import peerLogo from '@/assets/peerlogo.png'
import LifeTools from '@/components/besearch/lifetools/lifeNavtools.vue'
import InterventionToolbar from '@/components/besearch/interventionToolbar.vue'
import beeCycle from '@/assets/besearch-cycle.png'
import { ref, computed, onMounted } from 'vue'
import BeebeeAi from '@/components/beebeehelp/spaceChat.vue'
import ModalBesearch from '@/components/besearch/besearchModal.vue'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { besearchStore } from '@/stores/besearchStore.js'

const storeCues = cuesStore()
const storeAI = aiInterfaceStore()
const storeBentobox = bentoboxStore()
const storeBesearch = besearchStore()

const canvas = ref(null)
const currentMode = ref('cues')
const canvasWidth = ref(1400)
const canvasHeight = ref(900)
const isLifeToolsOpen = ref(false)
const canvasbe = ref(null)
const ctx = ref(null)
const angle = ref(0)
const radius = ref(100)
let cyclesCompleted = 0
const totalCycles = 3
const beeCycleImage = ref(null)
const peerImage = ref(null)
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)

// Intervention toolbar refs
const showInterventionToolbar = ref(false)
const interventionToolbarRef = ref(null)

// Canvas interventions
const canvasInterventions = ref([])
const draggingIntervention = ref(null)
const dragOffset = ref({ x: 0, y: 0 })

// Add these variables to your existing refs
const peer = ref({
  x: 100,
  y: 100,
  width: 30,
  height: 30,
  speed: 5,
  isMoving: false,
  direction: { x: 0, y: 0 }
})

defineExpose({ canvasbe })

/* on mount */
onMounted(() => {
  canvas.value = document.getElementById('besearch-cycles')
  if (canvas.value) {
    ctx.value = canvas.value.getContext('2d')
    
    // Load images once
    beeCycleImage.value = new Image()
    beeCycleImage.value.src = beeCycle
    
    peerImage.value = new Image()
    peerImage.value.src = peerLogo
    
    updateCanvas()
    // Set up keyboard event listeners
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    // Start the game loop
    gameLoop()
  } else {
    console.error('Canvas element not found')
  }
})

  /* computed */
  const bentochatStatus = computed(() => {
    return storeAI.bentochatState
  })

  const bentoBesearchStatus = computed(() => {
    return storeAI.bentobesearchState
  })

  const liveBesearch = computed(() => {
    return storeBesearch.besearchCyles
  })

  /* methods */
  const setShowBeeBee = () => {
    storeAI.bentochatState = !storeAI.bentochatState
  }

  /** peer nav in canvas space **/
  // Add these methods to handle peer movement events
  const handlePeerMoved = (peerData) => {
    // Update direction and movement state
    peer.value.direction = peerData.direction
    peer.value.isMoving = peerData.isMoving

    // Update canvas
    updateCanvas()
  }

  const handlePeerIntervention = (event) => {
    console.log('Intervention event:', event)
    
    if (event.type === 'select' && event.intervention) {
      // When a specific intervention is selected from the list
      showInterventionToolbar.value = true
      interventionToolbarRef.value?.showIntervention(event.intervention)
    } else if (event.type === 'create') {
      // Handle create new intervention
      console.log('Creating new intervention')
    } else if (typeof event === 'string') {
      // When a category is clicked
      const categories = ['prevention', 'repair', 'rejuvenation']
      if (categories.includes(event)) {
        showInterventionToolbar.value = true
        interventionToolbarRef.value?.showCategory(event)
      }
    }

    // Update canvas to show intervention effect
    updateCanvas()
  }

  // Intervention toolbar handlers
  const closeInterventionToolbar = () => {
    showInterventionToolbar.value = false
  }

  const handleInterventionSelect = (intervention) => {
    console.log('Intervention selected:', intervention)
    // Handle intervention selection
  }

  const handleInterventionEdit = (intervention) => {
    console.log('Edit intervention:', intervention)
    // Handle intervention edit
  }

  const handleInterventionDelete = (intervention) => {
    console.log('Delete intervention:', intervention)
    // Handle intervention delete
  }

  const handleLinkCycle = (intervention) => {
    console.log('Link intervention to cycle:', intervention)
    // Handle linking intervention to besearch cycle
  }

  const handleAddInterventionToCanvas = (data) => {
    console.log('Adding intervention to canvas:', data)
    const { intervention, position } = data
    
    // Create a new intervention object on the canvas
    const canvasIntervention = {
      id: `canvas-${intervention.id}-${Date.now()}`,
      interventionId: intervention.id,
      name: intervention.name,
      description: intervention.description,
      status: intervention.status,
      biomarkers: intervention.biomarkers,
      position: position,
      isDragging: false,
      linkedCycles: []
    }
    
    // Add to canvas interventions array (we'll need to create this)
    if (!canvasInterventions.value) {
      canvasInterventions.value = []
    }
    canvasInterventions.value.push(canvasIntervention)
    
    // Redraw canvas to show the new intervention
    updateCanvas()
    
    // Auto-close the life tools panel
    isLifeToolsOpen.value = false
  }

  // Draw interventions on canvas
  const drawInterventions = (ctx) => {
    canvasInterventions.value.forEach(intervention => {
      // Draw intervention box
      ctx.save()
      
      // Apply opacity if being dragged
      if (draggingIntervention.value && draggingIntervention.value.id === intervention.id) {
        ctx.globalAlpha = 0.7
      }
      
      // Box background
      ctx.fillStyle = '#ffffff'
      ctx.strokeStyle = getStatusColor(intervention.status)
      ctx.lineWidth = 3
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)'
      ctx.shadowBlur = 5
      ctx.shadowOffsetX = 2
      ctx.shadowOffsetY = 2
      
      const boxWidth = 250
      const boxHeight = 120
      
      // Draw rounded rectangle
      ctx.beginPath()
      ctx.roundRect(intervention.position.x, intervention.position.y, boxWidth, boxHeight, 10)
      ctx.fill()
      ctx.stroke()
      
      // Draw drag bar at top
      ctx.fillStyle = '#e0e0e0'
      ctx.fillRect(intervention.position.x, intervention.position.y, boxWidth, 25)
      
      // Draw intervention name
      ctx.fillStyle = '#333'
      ctx.font = 'bold 14px Arial'
      ctx.fillText(intervention.name, intervention.position.x + 10, intervention.position.y + 18)
      
      // Draw remove button (X) on the right side of drag bar
      ctx.fillStyle = '#666'
      ctx.font = 'bold 16px Arial'
      ctx.fillText('×', intervention.position.x + boxWidth - 20, intervention.position.y + 18)
      
      // Draw status badge
      const statusX = intervention.position.x + boxWidth - 80
      ctx.fillStyle = getStatusColor(intervention.status)
      ctx.font = '12px Arial'
      ctx.fillText(intervention.status, statusX, intervention.position.y + 18)
      
      // Draw description
      ctx.fillStyle = '#666'
      ctx.font = '12px Arial'
      const lines = wrapText(ctx, intervention.description, boxWidth - 20)
      lines.forEach((line, index) => {
        if (index < 2) { // Max 2 lines
          ctx.fillText(line, intervention.position.x + 10, intervention.position.y + 45 + (index * 15))
        }
      })
      
      // Draw biomarker count
      ctx.fillStyle = '#999'
      ctx.font = '11px Arial'
      ctx.fillText(`${intervention.biomarkers.length} biomarkers`, intervention.position.x + 10, intervention.position.y + 100)
      
      ctx.restore()
    })
  }
  
  const getStatusColor = (status) => {
    const colors = {
      'working': '#4CAF50',
      'experimentation': '#FF9800',
      'no effect': '#F44336',
      'pending': '#9E9E9E'
    }
    return colors[status] || '#9E9E9E'
  }
  
  const wrapText = (ctx, text, maxWidth) => {
    const words = text.split(' ')
    const lines = []
    let currentLine = words[0]
    
    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width = ctx.measureText(currentLine + ' ' + word).width
      if (width < maxWidth) {
        currentLine += ' ' + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
    return lines
  }

  // Add this new function to draw the peer
  const drawPeer = (ctx) => {
    if (!peerImage.value || !peerImage.value.complete) {
      return // Image not loaded yet
    }
    
    // Draw the peer without clearing (since we clear the whole canvas each frame)
    ctx.drawImage(
      peerImage.value,
      peer.value.x,
      peer.value.y,
      peer.value.width,
      peer.value.height
    )
  }

  // Add these keyboard control methods
const handleKeyDown = (e) => {
  switch(e.key) {
    case 'ArrowUp':
      peer.value.direction.y = -1
      break
    case 'ArrowDown':
      peer.value.direction.y = 1
      break
    case 'ArrowLeft':
      peer.value.direction.x = -1
      break
    case 'ArrowRight':
      peer.value.direction.x = 1
      break
  }
  peer.value.isMoving = true
}

const handleKeyUp = (e) => {
  switch(e.key) {
    case 'ArrowUp':
    case 'ArrowDown':
      peer.value.direction.y = 0
      break
    case 'ArrowLeft':
    case 'ArrowRight':
      peer.value.direction.x = 0
      break
  }

  // Check if any direction key is still pressed
  if (peer.value.direction.x === 0 && peer.value.direction.y === 0) {
    peer.value.isMoving = false
  }
}

  const gameLoop = () => {
    // Update angle for besearch cycles animation
    angle.value += 0.02
    if (angle.value >= 2 * Math.PI) {
      angle.value = 0
    }
    
    if (peer.value.isMoving) {
      // Update peer position
      peer.value.x += peer.value.direction.x * peer.value.speed
      peer.value.y += peer.value.direction.y * peer.value.speed

      // Keep peer within canvas bounds
      peer.value.x = Math.max(0, Math.min(canvas.value.width - peer.value.width, peer.value.x))
      peer.value.y = Math.max(0, Math.min(canvas.value.height - peer.value.height, peer.value.y))
    }
    
    // Always update canvas to show animations
    updateCanvas()

    requestAnimationFrame(gameLoop)
  }

  // canvas mode
  const handleModeChange = (mode) => {
    currentMode.value = mode
    updateCanvas()
  }

  const updateCanvas = () => {
    if (!ctx.value) return

    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height)

    switch(currentMode.value) {
      case 'cues':
        renderCuesMode(ctx.value)
        break
      case 'body':
        renderBodyMode(ctx.value)
        break
      case 'earth':
        renderEarthMode(ctx.value)
        break
    }
  }

  const renderCuesMode = (ctx) => {
    // Clear the entire canvas first
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    
    // Draw title
    ctx.fillStyle = '#140d6b'
    ctx.font = '24px Arial'
    ctx.fillText('Cues Space Mode', 50, 50)

    // Draw all besearch cycles first (background layer)
    storeBesearch.besearchCyles.forEach(bes => {
      drawBeeCycle(ctx, bes)
    })
    
    // Draw interventions
    drawInterventions(ctx)
    
    // Draw the peer last (foreground layer)
    drawPeer(ctx)
  }

  const renderBodyMode = (ctx) => {
    // Draw body content without background color
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.fillStyle = '#140d6b'
    ctx.font = '24px Arial'
    ctx.fillText('Body Mode', 50, 50)
    
    // Draw interventions
    drawInterventions(ctx)
  }

  const renderEarthMode = (ctx) => {
    // Draw earth content without background color
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.fillStyle = '#140d6b'
    ctx.font = '24px Arial'
    ctx.fillText('Earth Mode', 50, 50)
    
    // Draw interventions
    drawInterventions(ctx)
  }

  /* life tools */
  const toggleLifeTools = () => {
    isLifeToolsOpen.value = !isLifeToolsOpen.value
  }

  const startDrag = (event) => {
    isDragging.value = true
    startX.value = event.clientX
    currentX.value = event.clientX
  }

  const drag = (event) => {
    if (!isDragging.value) return
    currentX.value = event.clientX
    const deltaX = currentX.value - startX.value
    if (deltaX > 50) {
      isLifeToolsOpen.value = true
      isDragging.value = false
    } else if (deltaX < -50) {
      isLifeToolsOpen.value = false
      isDragging.value = false
    }
  }

  const endDrag = () => {
    isDragging.value = false
  }
  
  // Canvas mouse event handlers for intervention dragging
  const handleCanvasMouseDown = (event) => {
    const rect = canvasbe.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    // Check if click is on any intervention
    for (const intervention of canvasInterventions.value) {
      const boxWidth = 250
      const dragBarHeight = 25
      
      // Check if click is on drag bar
      if (x >= intervention.position.x && 
          x <= intervention.position.x + boxWidth &&
          y >= intervention.position.y && 
          y <= intervention.position.y + dragBarHeight) {
        
        // Check if click is on remove button (X)
        if (x >= intervention.position.x + boxWidth - 30 && 
            x <= intervention.position.x + boxWidth - 10) {
          // Remove intervention
          const index = canvasInterventions.value.findIndex(i => i.id === intervention.id)
          if (index !== -1) {
            canvasInterventions.value.splice(index, 1)
            updateCanvas()
          }
        } else {
          // Start dragging this intervention
          draggingIntervention.value = intervention
          dragOffset.value = {
            x: x - intervention.position.x,
            y: y - intervention.position.y
          }
        }
        event.preventDefault()
        break
      }
    }
  }
  
  const handleCanvasMouseMove = (event) => {
    const rect = canvasbe.value.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    
    if (draggingIntervention.value) {
      // Update intervention position
      draggingIntervention.value.position.x = x - dragOffset.value.x
      draggingIntervention.value.position.y = y - dragOffset.value.y
      
      // Redraw canvas
      updateCanvas()
    } else {
      // Check if hovering over drag bar or remove button for cursor change
      let cursor = 'default'
      for (const intervention of canvasInterventions.value) {
        const boxWidth = 250
        const dragBarHeight = 25
        
        if (x >= intervention.position.x && 
            x <= intervention.position.x + boxWidth &&
            y >= intervention.position.y && 
            y <= intervention.position.y + dragBarHeight) {
          
          // Check if over remove button
          if (x >= intervention.position.x + boxWidth - 30 && 
              x <= intervention.position.x + boxWidth - 10) {
            cursor = 'pointer'
          } else {
            cursor = 'move'
          }
          break
        }
      }
      
      canvasbe.value.style.cursor = cursor
    }
  }
  
  const handleCanvasMouseUp = (event) => {
    if (draggingIntervention.value) {
      // Check if intervention is near any besearch cycle for linking
      const interventionCenterX = draggingIntervention.value.position.x + 125 // half of box width
      const interventionCenterY = draggingIntervention.value.position.y + 60 // half of box height
      
      // Clear existing links for this intervention
      draggingIntervention.value.linkedCycles = []
      
      // Check proximity to each besearch cycle
      storeBesearch.besearchCyles.forEach(cycle => {
        const distance = Math.sqrt(
          Math.pow(interventionCenterX - cycle.x, 2) + 
          Math.pow(interventionCenterY - cycle.y, 2)
        )
        
        // If within 150 pixels, link them
        if (distance < 150) {
          draggingIntervention.value.linkedCycles.push(cycle.id)
        }
      })
      
      draggingIntervention.value = null
      dragOffset.value = { x: 0, y: 0 }
      updateCanvas() // Redraw to show any new links
    }
  }

  const drawText = (ctx) => {
    ctx.beginPath()
    ctx.font = '20px Arial'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.fillText('Besearch cycles coming soon', 200, 100)
  }

  /* besearch cycles location on canvas */
  const drawBeeCycle = (ctx, bes) => {
    if (!beeCycleImage.value || !beeCycleImage.value.complete) {
      return // Image not loaded yet
    }

    // Calculate the position for the image
    const centerX = bes.cueSpace.location.width
    const centerY = bes.cueSpace.location.height
    const x = centerX + radius.value * Math.cos(angle.value)
    const y = centerY + radius.value * Math.sin(angle.value)
    
    // Check if this cycle has linked interventions
    const linkedInterventions = canvasInterventions.value.filter(intervention => 
      intervention.linkedCycles.includes(bes.id)
    )
    
    // Draw colored ring if there are linked interventions
    if (linkedInterventions.length > 0) {
      ctx.save()
      
      // Draw multiple rings for multiple interventions
      linkedInterventions.forEach((intervention, index) => {
        ctx.strokeStyle = getStatusColor(intervention.status)
        ctx.lineWidth = 3
        ctx.globalAlpha = 0.6
        ctx.beginPath()
        ctx.arc(centerX, centerY, 60 + (index * 10), 0, 2 * Math.PI)
        ctx.stroke()
      })
      
      // Draw connection lines
      ctx.globalAlpha = 0.3
      linkedInterventions.forEach(intervention => {
        const interventionCenterX = intervention.position.x + 125
        const interventionCenterY = intervention.position.y + 60
        
        ctx.strokeStyle = getStatusColor(intervention.status)
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.lineTo(interventionCenterX, interventionCenterY)
        ctx.stroke()
      })
      ctx.setLineDash([])
      
      ctx.restore()
    }

    // Draw the text for the besearch cycle
    ctx.save()
    ctx.font = '20px Arial'
    ctx.fillStyle = '#140d6b'
    ctx.textAlign = 'center'
    ctx.fillText(bes.name, centerX, centerY)
    
    // Draw the image at the calculated position
    const imageSize = 40 // Fixed size for the cycle image
    ctx.drawImage(beeCycleImage.value, x - imageSize/2, y - imageSize/2, imageSize, imageSize)
    ctx.restore()
  }

  /* methods */
  const closeBentoBesearch = () => {
    storeAI.bentobesearchState = !storeAI.bentobesearchState
  }

  const handleBesearchClick = (event) => {
    // Handle canvas click events here
  }
</script>

<style scoped>
#besearch-holder {
  display: grid;
  grid-template-columns: 1fr 7fr;
}

#cycle-periods {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  justify-items: center;
  margin-bottom: 1em;
}

#besearch-cycles {
  display: block;
  border: 1px solid rgb(128, 122, 180);
  border-radius: 2%;
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
  left: -300px;
  width: 300px;
  height: 100%;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;
  z-index: 10;
}

#life-tools-besearch.open {
  left: 0;
}

.toggle-life-tools-button {
  position: absolute;
  top: 50%;
  right: -20px;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 40;
  cursor: pointer;
  transition: transform 0.3s ease;
  display: grid;
  align-items: center;
  justify-content: center;
}

.toggle-life-tools-button:hover {
  transform: scale(1.1);
}

.toggle-life-tools-button:active {
  transform: scale(0.9);
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
  border: 2px solid red;
}

@media (min-width: 1024px) {
  #besearch-holder {
    display: grid;
    grid-template-columns: .1fr 9fr;
  }

  #cycle-periods {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;
    margin-bottom: 1em;
  }

  #besearch-cycles {
    display: block;
    border: 1px solid rgb(128, 122, 180);
    border-radius: 2%;
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
    z-index: 10;
  }

  #life-tools-besearch.open {
    left: 0;
  }

  .toggle-life-tools-button {
    position: absolute;
    top: 50%;
    right: -20px;
    transform: translateY(-50%);
    width: 60px;
    height: 60px;
    background-color: transparent;
    border: none;
    border-radius: 50%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 40;
    cursor: pointer;
    transition: transform 0.3s ease;
    display: grid;
    align-items: center;
    justify-content: center;
  }

  .toggle-life-tools-button:hover {
    transform: scale(1.1);
  }

  .toggle-life-tools-button:active {
    transform: scale(0.9);
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