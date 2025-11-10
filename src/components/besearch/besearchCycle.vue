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
          <canvas id="besearch-cycles" :width="canvasWidth" :height="canvasHeight" ref="canvasbe" @click="handleBesearchClick($event)"></canvas>
        </div>
        <div id="beebee-agent">
          <button id="open-beebee" @click.prevent="setShowBeeBee">
            beebee
          </button>
         <beebee-ai></beebee-ai>
        </div>
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
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)

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
    peer.value.x = peerData.x
    peer.value.y = peerData.y
    peer.value.direction = peerData.direction
    peer.value.isMoving = peerData.isMoving || peer.value.isMoving

    // Update canvas
    updateCanvas()
  }

  const handlePeerIntervention = () => {
    // Implement intervention logic here
    console.log('Peer intervention initiated on canvas')
    // You can add more specific intervention logic as needed

    // Update canvas to show intervention effect
    updateCanvas()
  }

  // Add this new function to draw the peer
  const drawPeer = (ctx) => {
    const image = new Image()
    image.src = peerLogo

    // Create a function to draw the peer
    const drawImage = () => {
      // Clear a slightly larger area around the peer to ensure visibility
      ctx.clearRect(
        peer.value.x - 10,
        peer.value.y - 10,
        peer.value.width + 20,
        peer.value.height + 20
      )

      // Draw the peer
      ctx.drawImage(
        image,
        peer.value.x,
        peer.value.y,
        peer.value.width,
        peer.value.height
      )
    }

    // If the image is already loaded, draw it immediately
    if (image.complete) {
      drawImage()
    } else {
      // Otherwise, set up the onload event
      image.onload = drawImage
    }
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
    if (peer.value.isMoving) {
      // Update peer position
      peer.value.x += peer.value.direction.x * peer.value.speed
      peer.value.y += peer.value.direction.y * peer.value.speed

      // Keep peer within canvas bounds
      peer.value.x = Math.max(0, Math.min(canvas.value.width - peer.value.width, peer.value.x))
      peer.value.y = Math.max(0, Math.min(canvas.value.height - peer.value.height, peer.value.y))

      // Redraw canvas
      updateCanvas()
    }

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
    // Draw cues space content without background color
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.fillStyle = '#140d6b'
    ctx.font = '24px Arial'
    ctx.fillText('Cues Space Mode', 50, 50)

    // Draw all besearch cycles
    storeBesearch.besearchCyles.forEach(bes => {
      // drawBeeCycle(ctx, bes)
    })
    // Draw the peer
    drawPeer(ctx)
  }

  const renderBodyMode = (ctx) => {
    // Draw body content without background color
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.fillStyle = '#140d6b'
    ctx.font = '24px Arial'
    ctx.fillText('Body Mode', 50, 50)
  }

  const renderEarthMode = (ctx) => {
    // Draw earth content without background color
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
    ctx.fillStyle = '#140d6b'
    ctx.font = '24px Arial'
    ctx.fillText('Earth Mode', 50, 50)
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

  const drawText = (ctx) => {
    ctx.beginPath()
    ctx.font = '20px Arial'
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.fillText('Besearch cycles coming soon', 200, 100)
  }

  /* besearch cycles location on canvas */
  const drawBeeCycle = (ctx, bes) => {
    const image = new Image()
    image.src = beeCycle

    // Store the previous position to clear it in the next frame
    let prevX = null
    let prevY = null

    const animate = () => {
      // Calculate the position for the image
      const centerX = bes.cueSpace.location.width
      const centerY = bes.cueSpace.location.height
      const x = centerX + radius.value * Math.cos(angle.value)
      const y = centerY + radius.value * Math.sin(angle.value)

      // Clear the previous position if it exists
      if (prevX !== null && prevY !== null) {
        const clearRadius = radius.value + 50
        ctx.clearRect(
          prevX - clearRadius,
          prevY - clearRadius,
          clearRadius * 2,
          clearRadius * 2
        )
      }

      // Draw the text for the besearch cycle
      ctx.beginPath()
      ctx.font = '20px Arial'
      ctx.fillStyle = 'black'
      ctx.textAlign = 'center'
      ctx.fillText(bes.name, centerX, centerY)

      // Draw the image at the calculated position
      ctx.drawImage(image, x, y, image.width, image.height)

      // Store the current position for the next frame
      prevX = x
      prevY = y

      // Update the angle for the next frame
      angle.value += 0.05

      // Check if a full cycle has been completed
      if (angle.value >= 2 * Math.PI) {
        angle.value = 0
        cyclesCompleted++
      }

      // Continue animation if not all cycles are completed
      if (cyclesCompleted < totalCycles) {
        requestAnimationFrame(animate)
      } else {
        drawText(ctx)
      }
    }

    // Start the animation once the image is loaded
    image.onload = () => {
      animate()
    }
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