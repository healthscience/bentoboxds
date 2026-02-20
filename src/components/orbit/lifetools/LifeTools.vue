<template>
<div id="life-tools-nav" v-bind:class="{ border: props.isExpanded === true }">
  <div class="spiral-container">
    <div class="spiral"></div>
  </div>
  <div id="mode-selector">
    <h3>Worlds</h3>
    <div class="world-switcher">
      <div 
        v-for="world in worlds" 
        :key="world.id"
        class="world-icon"
        :class="{ active: modelValue === world.id }"
        @click="selectWorld(world.id)"
      >
        {{ world.icon }}
      </div>
    </div>
    <div id="world-tools">
      <div class="orbit-tools" v-if="activeWorld === 'orbit'">
        Orbit tools please
      </div>
      <div class="orbit-tools" v-if="activeWorld === 'body'">
        Body tools please
      </div>
      <div class="orbit-tools" v-if="activeWorld === 'earth'">
        Earth tools please
      </div>
    </div>
  </div>
  <!-- Life-Strap -->
   <LifeStrapNode 
    v-for="strap in storeLibrary.straps" 
    :key="strap.id" 
    :strap="strap"
    :expanded="props.isExpanded"
    @select="handleWorldPivot"
  />
  <!-- Besearch Navigation Controls -->
  <!-- besearch create start stop delete -->
  <besearch-controls />
  <intervention-type></intervention-type>
  <div id="peer-navigation">
    <h3>Navigation</h3>
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
  <div id="time-cycles">
    <button id="besearch-cycles-time" @click="besearchTime()">time</button>
    <div id="cycle-periods" v-if="btoolsTime === true">
      <div class="cycle-period">1 cycles</div>
      <div class="cycle-period">10 cycles</div>
      <div class="cycle-period">20 cycles</div>
      <div class="cycle-period">30 cycles</div>
      <div class="cycle-period">1 orbit year</div>
    </div>
  </div>
</div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'
import LifeStrapNode from '@/components/orbit/lifetools/LifeStrapNode.vue'
import BesearchControls from './besearchControls.vue'
import InterventionType from '@/components/besearch/interventions/interventionType.vue'

import { libraryStore } from '@/stores/libraryStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { besearchStore } from '@/stores/besearchStore.js'

const storeLibrary = libraryStore()
const storeAI = aiInterfaceStore()
const storeBesearch = besearchStore()

/* props */
const props = defineProps({
  modelValue: String,  // Active World
  isExpanded: Boolean,
  currentWidth: Number
});

// EMITS: Notify PrimeInterface
const emit = defineEmits([
  'mode-selected',
  'peer-moved',
  'update:modelValue', 
  'update:width', 
  'update:isOpen', 
  'startDrag'
]);


let btoolsTime = ref(false)
let selectedMode = ref('cues')

const worlds = [
  { id: 'orbit', label: 'Standard Orbit', icon: '🌌' },
  { id: 'body', label: 'Human Body', icon: '👤' },
  { id: 'earth', label: 'Earth Context', icon: '🌍' }
];

  /* computed */
  const activeWorld =  computed(() => {
    return storeAI.activeWorld
  });

  /** methods */
  const besearchTime = () => {
    btoolsTime.value = !btoolsTime.value
  }

  const selectMode = (mode) => {
    selectedMode.value = mode
    // Emit event to parent component to update canvas
    emit('mode-selected', mode)
  }

  const handleWorldPivot = () => {
    console.log('World pivot')
  }

  const selectWorld = (worldId) => {
    emit('update:modelValue', worldId)
    storeAI.currentMode = false
    if (worldId === 'body') {
      storeBesearch.setNexusWorld('body')
    } else if (worldId === 'orbit') {
      console.log('orbit')
      storeAI.currentMode = 'zen'
    }
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

</script>

<style scoped>

#life-tools-nav {
  height: auto;
  min-height: 100%;
}

.active {
  background-color: #4a6fa5;
  color: white;
  font: 1.2em;
}

@media (min-width: 1024px) {
    #life-tools-nav {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1rem;
        background-color: #f0f4f8;
        position: relative;
        height: auto;
        min-height: 100%;
    }

    .border {
      border-top: 1px solid rgb(210, 210, 238);
      border-right: 1px solid rgb(210, 210, 238);
      border-bottom: 1px solid rgb(210, 210, 238);
      box-shadow: 5px 0 10px rgba(17, 11, 65, 0.5);
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
    display: grid;
    grid-template-rows: auto auto auto;
    margin-top: 0px;
    margin-bottom: 1rem;
  }

  .mode-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .mode-button {
    display: grid;
    grid-template-rows: auto auto;
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

.world-switcher {
  display: grid;
  grid-template-columns: auto auto auto;
  padding: 10px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  margin: 1rem 0;
}

}
</style>
