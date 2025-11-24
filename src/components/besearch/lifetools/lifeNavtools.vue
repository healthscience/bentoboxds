<template>
  <div id="life-tools-nav">
    Life tools
    <div class="spiral-container">
      <div class="spiral"></div>
    </div>
    <div id="mode-selector">
      <h3>Modes</h3>
      <div class="mode-buttons">
        <button class="mode-button" @click="selectMode('cues')">
          <span class="mode-icon"></span>
          <span>Cues</span>
        </button>
        <button class="mode-button" @click="selectMode('body')">
          <span class="mode-icon">🧠</span>
          <span>Body</span>
        </button>
        <button class="mode-button" @click="selectMode('earth')">
          <span class="mode-icon">🌍</span>
          <span>Earth</span>
        </button>
      </div>
    </div>

    <!-- besearch create start stop delete -->
    <div id="besearch-tools">
      <h3>Besearch tools</h3>
      <div class="besearch-control-buttons">
        <button @click="besearchTool('create')" class="control-button">Create</button>
        <button @click="besearchTool('start')" class="control-button">Start</button>
        <button @click="besearchTool('stop')" class="control-button">Stop</button>
      </div>
    </div>
    <!-- Besearch Navigation Controls -->
    <div id="peer-navigation">
      <h3>Besearch Navigation</h3>
      <div class="directional-buttons">
        <button @click="movePeer('up')" class="direction-button up">↑</button>
        <div class="horizontal-buttons">
          <button @click="movePeer('left')" class="direction-button left">←</button>
          <button @click="movePeer('right')" class="direction-button right">→</button>
        </div>
        <button @click="movePeer('down')" class="direction-button down">↓</button>
      </div>
      <div class="control-buttons">
        <button @click="startPeer" class="control-button">Start</button>
        <button @click="stopPeer" class="control-button">Stop</button>
        <button @click="intervene" class="control-button">Intervene</button>
      </div>
      <div class="navigation-instructions">
        <p>Use arrow keys or buttons to navigate the peer</p>
      </div>
    </div>
    <div id="interventions">
      <h3>Interventions</h3>
      <div class="intervention-buttons">
        <button class="intervention-button" @click="selectIntervention('prevention')">
          <span class="intervention-icon">🛡️</span>
          <span>Prevention</span>
        </button>
        <button class="intervention-button" @click="selectIntervention('repair')">
          <span class="intervention-icon">🔧</span>
          <span>Repair</span>
        </button>
        <button class="intervention-button" @click="selectIntervention('rejuvenation')">
          <span class="intervention-icon">✨</span>
          <span>Rejuvenation</span>
        </button>
      </div>
      <div class="intervention-actions">
        <button class="action-button" @click="createIntervention" title="Create new intervention">
          <span>➕ Add</span>
        </button>
        <button class="action-button" @click="manageInterventions" title="Manage interventions">
          <span>📋 Manage</span>
        </button>
      </div>
    </div>
    <div id="time-cycles">
      <button id="besearch-cycles-time" @click="besearchTime()">time</button>
      <div id="cycle-periods" v-if="btoolsTime === true">
        <div class="cycle-period">1 day</div>
        <div class="cycle-period">1 week</div>
        <div class="cycle-period">1 month</div>
        <div class="cycle-period">3 months</div>
        <div class="cycle-period">1 year</div>
      </div>
      </div>
    </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['mode-selected', 'peer-moved', 'peer-intervention'])


let btoolsTime = ref(false)
let selectedMode = ref('cues')
let selectedIntervention = ref(false)

  /** methods */
  const besearchTime = () => {
    btoolsTime.value = !btoolsTime.value
  }

  const selectMode = (mode) => {
    selectedMode.value = mode
    // Emit event to parent component to update canvas
    emit('mode-selected', mode)
  }

  const besearchTool = (action) => {
    // Handle besearch tool actions
    console.log('Besearch tool action:', action)
    // You can emit events or handle actions here
  }

  // Peer navigation methods
  const movePeer = (direction) => {
    let peerDirection = { x: 0, y: 0 }
    
    switch(direction) {
      case 'up':
        peerDirection.y = -1
        break
      case 'down':
        peerDirection.y = 1
        break
      case 'left':
        peerDirection.x = -1
        break
      case 'right':
        peerDirection.x = 1
        break
    }

    // Emit event with direction
    emit('peer-moved', {
      direction: peerDirection,
      isMoving: true
    })

    // Reset direction after a short delay to simulate button press
    setTimeout(() => {
      emit('peer-moved', {
        direction: { x: 0, y: 0 },
        isMoving: false
      })
    }, 100)
  }

  const startPeer = () => {
    // Start peer movement with current direction (if any)
    emit('peer-moved', {
      direction: { x: 0, y: 0 }, // No specific direction, just start
      isMoving: true
    })
  }

  const stopPeer = () => {
    // Stop peer movement
    emit('peer-moved', {
      direction: { x: 0, y: 0 },
      isMoving: false
    })
  }

  const intervene = () => {
    // Implement intervention logic here
    console.log('Peer intervention initiated')
    // You can add more specific intervention logic as needed
    emit('peer-intervention')
  }

  const selectIntervention = (intervention) => {
    selectedIntervention.value = intervention
    // Emit event to parent component to update canvas
    emit('peer-intervention', intervention)
  }

  const createIntervention = () => {
    // Emit event to open intervention creation panel
    emit('peer-intervention', 'create-new')
  }

  const manageInterventions = () => {
    // Emit event to open intervention management panel
    emit('peer-intervention', 'manage')
  }

</script>

<style scoped>



@media (min-width: 1024px) {
    #life-tools-nav {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem;
        background-color: #f0f4f8;
        position: relative;
        overflow: hidden;
    }

    .spiral-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
    }

    .spiral {
        --b: 15px;  /* border thickness */
        --s: 500px; /* preferred size shape */
        --c: rgba(228, 237, 247, 0.2); /* faint blue color */
        width: round(var(--s),4*var(--b));
        aspect-ratio: 1;
        border-radius: 50%;
        background:
            repeating-radial-gradient(calc(2*var(--b)) at top,#0000 -1px,var(--c) 0 calc(50% - 1px),#0000 50% calc(100% - 1px)) calc(50% + var(--b)) 100%,
            repeating-radial-gradient(calc(2*var(--b)) at bottom,var(--c) -1px,#0000 0 calc(50% - 1px),var(--c) 50% calc(100% - 1px)) 50% 0;
        background-size: 150% 50%;
        background-repeat: no-repeat;
        mask:
            radial-gradient(calc(1.5*var(--b)) at calc(100% - var(--b)/2) 0, #0000 calc(100%/3), #000 calc(100%/3 + 1px) 110%, #0000 0) calc(50% + var(--b)/2)
            100%/calc(3*var(--b)) 50% exclude no-repeat,
            conic-gradient(#000 0 0);
    }

  #mode-selector {
    margin-bottom: 1rem;
  }

  .mode-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .mode-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 10px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .mode-button:hover {
    background-color: #9fb8d4;
  }

  .mode-icon {
    font-size: 24px;
    margin-bottom: 5px;
  }

  /* Peer Navigation Styles */
  #peer-navigation {
    margin-bottom: 1rem;
  }

  .directional-buttons {
    display: grid;
    grid-template-rows: auto auto auto;
    justify-items: center;
    margin-bottom: 1rem;
  }

  .horizontal-buttons {
    display: grid;
    grid-template-columns: auto auto;
    gap: 0.5rem;
  }

  .direction-button {
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .direction-button:hover {
    background-color: #9fb8d4;
  }

  .control-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .control-button {
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .control-button:hover {
    background-color: #9fb8d4;
  }

  .navigation-instructions {
    font-size: 12px;
    color: #666;
    text-align: center;
  }

  #time-cycles {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  #besearch-cycles-time {
    display: inline-grid;
    height: 28px;
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

  #cycle-periods {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;
    margin-bottom: 1em;
  }

  .cycle-period {
    display: inline-grid;
    height: 28px;
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
  /* Interventions Styles */
  #interventions {
   margin-bottom: 1rem;
  }
  .intervention-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
  .intervention-button {
    display: grid;
    grid-template-columns: 1fr;
    align-items: center;
    justify-content: center;
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 10px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  .intervention-button:hover {
    background-color: #9fb8d4;
  }
  .intervention-icon {
    font-size: 24px;
    margin-bottom: 5px;
  }

  .intervention-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .action-button {
    flex: 1;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .action-button:hover {
    background-color: #45a049;
  }
}
</style>