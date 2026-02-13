<template>
  <div 
    class="prime-interface" 
    :style="dynamicGridStyle"
    @mousemove="handleGlobalDrag"
    @mouseup="stopDragging"
    @mouseleave="stopDragging"
  >
    <aside 
      class="side-rail left-rail overlay-blur"
      :class="{ 'rail-faded': !isLifeToolsOpen }"
    >
      <LifeTools :is-expanded="isLifeToolsOpen" :current-width="panelWidth" />
      
      <button
        @mousedown.stop="startDragging"
        @click="handleButtonClick"
        :class="['toggle-life-tools-button', { 'panel-open': isLifeToolsOpen }]"
        :style="{ left: (panelWidth - 20) + 'px' }"
      >
        <div class="key-to-life">
          <div class="tear"></div>
          <div class="key-head"></div>
        </div>
      </button>
    </aside>

    <main class="orbit-center">
      <transition name="sov-fade" mode="out-in">
        <div v-if="isInitialState" class="launchpad-stack">
          <div class="avatar-zone"><BeeBeeAvatar /></div>
          
          <div class="input-zone">
            <p class="invite-text">What resonance shall we track today?</p>
            <div class="input-constraint">
              <inputBox/>
            </div>
          </div>

          <div class="demo-zone">
            <button class="sov-demo-btn" @click="launchDemo('sport')">🏊 Experience 400IM</button>
            <button class="sov-demo-btn" @click="launchDemo('water')">Water</button>
            <button class="sov-demo-btn" @click="launchDemo('earth')">Earth</button>
          </div>
        </div>
        
        <div v-else class="active-resonance">
          <BesearchLens :lenses="extractedData" />
          <div v-if="!isInitialState" class="meta-actions-zone">
            <button class="sov-btn exit" @click="exitDemo">Exit Demo</button>
            <button class="sov-btn clone" @click="cloneExperience">
              <span class="icon">📁</span> Clone & Personalize
            </button>
          </div>
        </div>
      </transition>

      <transition name="slide-up">
        <footer v-if="!isInitialState && showBesearchDrawer" class="besearch-drawer">
          <BesearchPanel :activeData="extractedData" />
        </footer>
      </transition>
    </main>
    <!-- right panel beebee dialogue & heli clock -->
    <aside class="side-panel right-panel overlay-blur">
      <div class="chat-drag-handle" @mousedown.stop="startChatDrag"></div>

      <!--<div class="clock-zone">
        <HeliClock 
          :mini="rightPanelMode === 'chat'" 
          @click="toggleClockExpansion" 
        />
      </div>-->
      <div id="dialogue-zone">beebee dialogue</div>

      <div class="panel-content-area">
        <transition name="fade-slide" mode="out-in">
          
          <div v-if="rightPanelMode === 'chat' && !isInitialState" class="chat-zone" key="chat">
            <LifeDialogue :context="extractedData" />
          </div>

          <div v-else-if="rightPanelMode === 'heli'" class="heli-projection-zone" key="heli">
            <ProjectionHeli :resonanceData="extractedData" />
            
            <div class="heli-actions">
              <button class="sov-btn mini">Invite Peer</button>
              <button class="sov-btn mini">Send Orbit</button>
            </div>
          </div>

        </transition>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import HeliClock from '@/components/orbit/clock/HeliClock.vue';
import BesearchLens from '@/components/orbit/BesearchLens.vue';
import BeeBeeAvatar from '@/components/agents/BeeBeeAvatar.vue';
import LifeTools from '@/components/orbit/lifetools/LifeTools.vue'
import LifeDialogue from '@/components/orbit/dialogue/lifeDialogue.vue'
import BesearchPanel from '@/components/orbit/besearch/besearchPanel.vue'
import inputBox from '@/components/beebeehelp/inputBox.vue';
import ProjectionHeli from '@/components/orbit/clock/projectionHeli.vue'

import { aiInterfaceStore } from '@/stores/aiInterface.js'

const storeAI = aiInterfaceStore();

const clockExpanded = ref(false);
const showBesearchDrawer = ref(true);

/* computed */
const isInitialState = computed(() => {
  return storeAI.isInitialState;
});

const extractedData = computed(() => {
  return storeAI.digestInput;
});

// DRAG LOGIC
const panelWidth = ref(20);
const isLifeToolsOpen = ref(false);
const isDragging = ref(false);
const dragMoved = ref(false); 
const startX = ref(0);
const startWidth = ref(20);
const rightPanelMode = ref('chat'); // 'chat' or 'heli'

const startDragging = (e) => {
  isDragging.value = true;
  dragMoved.value = false;
  startX.value = e.clientX;
  startWidth.value = panelWidth.value;
  document.body.style.cursor = 'ew-resize';
};

/* right panel drag logic */
// --- DIALOGUE PANEL DRAG LOGIC ---
const chatWidth = ref(60); // Default width
const isChatDragging = ref(false);
const startChatX = ref(0);
const startChatWidth = ref(60);

const startChatDrag = (e) => {
  isChatDragging.value = true;
  startChatX.value = e.clientX;
  startChatWidth.value = chatWidth.value;
  document.body.style.cursor = 'ew-resize';
};

const handleGlobalDrag = (e) => {
  // Handle Left Rail Drag (existing logic)
  if (isDragging.value) {
    dragMoved.value = true;
    let newWidth = startWidth.value + (e.clientX - startX.value);
    panelWidth.value = Math.max(80, Math.min(newWidth, window.innerWidth * 0.5));
    isLifeToolsOpen.value = panelWidth.value > 120;
  }

  // Handle Right Chat Drag
  if (isChatDragging.value) {
    // Note: Moving mouse LEFT (negative delta) increases the width of a right-pinned panel
    const delta = startChatX.value - e.clientX; 
    let newWidth = startChatWidth.value + delta;
    
    // Clamp: Min 300px, Max 70% of screen (for deep reading)
    chatWidth.value = Math.max(60, Math.min(newWidth, window.innerWidth * 0.9));
  }
};

const stopDragging = () => {
  isDragging.value = false;
  isChatDragging.value = false;
  document.body.style.cursor = 'default';
};

// Updated Grid computed
const dynamicGridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `${panelWidth.value}px 1fr ${chatWidth.value}px`,
  gridTemplateRows: '100vh',
  height: '100vh',
  width: '100vw',
  overflow: 'hidden'
}));


const handleButtonClick = () => {
  if (dragMoved.value) return; // Don't toggle if we were dragging
  if (isLifeToolsOpen.value) {
    panelWidth.value = 80;
    isLifeToolsOpen.value = false;
  } else {
    panelWidth.value = window.innerWidth * 0.3;
    isLifeToolsOpen.value = true;
  }
};

/* switch betwen beebee chat and heli clock */
const toggleClockExpansion = () => {
  if (rightPanelMode.value === 'heli') {
    rightPanelMode.value = 'chat';
    chatWidth.value = 380; // Snap back to standard chat width
  } else {
    rightPanelMode.value = 'heli';
    // MATH: Screen width minus the left rail width (panelWidth)
    // This makes the clock panel "kiss" the life tools button
    chatWidth.value = window.innerWidth - panelWidth.value;
  }
};

/*  demo mode */
const launchDemo = (demo) => {
  if (demo === 'sport') {
    storeAI.beebeeDigest("I want to swim 400m in 10 orbits, but chlorine makes my skin itchy.", true);
  }
};

const exitDemo = () => {
  // Clear the extraction and return to launchpad
  storeAI.isInitialState = true;
  extractedData.value = { capacity: [], coherence: [], context: [] };
  showBesearchDrawer.value = false;
};

const cloneExperience = () => {
  // 1. Commit extractedData to the Peer's permanent store
  // 2. Set "isInitialState" to false but keep the data
  // 3. Perhaps trigger a "BeeBee" message: "This protocol is now yours. Adjust the targets as needed."
  alert("Protocol Cloned! This 400IM setup is now saved to your Sovereign Profile.");
};

</script>

<style scoped>
/* 1. THE MAIN CONTAINER: The Sovereign Cockpit */
.prime-interface {
  position: relative; /* Relative works better if header is in flow; use Fixed if it's an overlay */
  width: 100vw;
  height: 100vh; /* LOCK VIEWPORT: Use calc(100vh - 60px) if header exists */
  overflow: hidden; /* KILL SCROLLBARS */
  display: grid;
  /* Col 1: Tools, Col 2: Liquid Space, Col 3: Dialogue */
  grid-template-columns: v-bind('panelWidth + "px"') 1fr 380px;
  grid-template-rows: 100%; /* Ensure row takes full height */
  grid-template-areas: "tools stage chat";
  background: var(--sov-white-bg, #f9f9f9);
}

/* 2. THE ORBIT STAGE (CENTER): Behind the side panels */
.orbit-center {
  grid-area: stage;
  grid-column: 1 / 4; /* SPAN ENTIRE GRID to show resonance under transparency */
  grid-row: 1;
  position: relative;
  display: grid;
  grid-template-rows: repeat(12, 1fr); /* 12-Row Vertical Logic */
  grid-template-columns: repeat(12, 1fr); /* 12-Col Horizontal Logic */
  z-index: 1;
}

/* 3. THE LAUNCHPAD: Spaced-out vertical alignment */
.launchpad-stack {
  grid-row: 1 / 13;
  grid-column: 1 / 13;
  display: grid;
  grid-template-rows: subgrid;
  grid-template-columns: subgrid;
}

.avatar-zone {
  grid-row: 2 / 5; /* Avatar takes top third */
  grid-column: 1 / 13;
  display: grid;
  place-items: center;
}

.input-zone {
  grid-row: 6 / 9; /* Input takes middle third - NO BUNCHING */
  grid-column: 4 / 10; /* THE 60% CONSTRAINT */
  display: grid;
  align-items: center;
  text-align: center;
}

.invite-text {
  margin-bottom: 2.5rem; /* Space between text and bar */
  font-size: 1.1rem;
  font-weight: 300;
  color: var(--sov-text-muted);
}

.active-resonance {
  grid-row: 2 / 11; /* Occupies the middle of the screen vertical */
  grid-column: 2 / 12; /* Stays within the 100vw but respects margins */
  display: grid;
  place-items: center;
}

.demo-zone {
  grid-row: 10;
  grid-column: 1 / 13;
  display: grid;
  place-items: center; /* This forces the button to the horizontal and vertical center of Row 10 */
  width: 100%;
}

/* demo besearch */
.meta-actions-zone {
  grid-row: 11; /* Just above the drawer */
  grid-column: 4 / 10; /* Centered 60% */
  display: grid;
  grid-template-columns: 1fr 2fr; /* Exit is small, Clone is the main action */
  gap: 1rem;
  place-items: center;
  z-index: 120;
}

.sov-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.1);
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.sov-btn.exit {
  background: rgba(255, 255, 255, 0.8);
  color: #666;
}

.sov-btn.clone {
  background: #3b82f6;
  color: white;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.sov-btn:hover {
  transform: translateY(-2px);
}

.sov-demo-btn {
  /* Optional: give it a fixed or min-width so it looks like a solid game button */
  min-width: 240px;
  padding: 1rem 2rem;
  cursor: pointer;
  /* Add your game-style branding here */
}

/* 4. OVERLAYS (Side Panels) */
.overlay-blur {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  pointer-events: auto;
}

.left-rail {
  grid-area: tools;
  grid-row: 1;
  z-index: 100;
  border-right: 1px solid rgba(0,0,0,0.05);
  transition: opacity 0.3s ease, width 0.1s linear;
}

.rail-faded {
  opacity: 0.35; /* Ghostly tools until expanded */
}

.rail-faded:hover {
  opacity: 0.8;
}

/* RIGHT PANEL: Chat + Clock */
.right-panel {
  grid-area: chat;
  grid-row: 1;
  z-index: 150;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(25px);
  position: relative;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  
  /* THE INVERSE BEVEL EFFECT */
  box-shadow: 
    -15px 0 35px rgba(0,0,0,0.12), /* Deep outer drop shadow for layering */
    inset 8px 0 15px -10px rgba(0,0,0,0.3); /* Inner shadow: Light to Dark on the left edge */
  
  border-left: 1px solid rgba(0, 0, 0, 0.08); /* A sharp, dark "cut" line */
}

/* THE LEADING EDGE GRADIENT: Light (Stage side) to Dark (Panel side) */
.right-panel::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  /* Light to Dark transition on the bevel */
  background: linear-gradient(
    to right, 
    rgba(0,0,0,0.02) 0%, 
    rgba(0,0,0,0.1) 100%
  );
  z-index: 151;
}

/* THE GRIP: Darkening the visual indicator */
.chat-drag-handle::after {
  content: ":::"; 
  color: rgba(0,0,0,0.4); /* Stronger contrast for the handle */
  font-weight: 900;
  letter-spacing: 2px;
  transform: rotate(90deg);
  text-shadow: 0 1px 0 rgba(255,255,255,0.5); /* Bevel effect on the dots themselves */
}
/* Optional: Add a "grip" texture to the drag handle area */
.chat-drag-handle {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  cursor: ew-resize;
  z-index: 160;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-drag-handle:hover {
  background: rgba(59, 130, 246, 0.1); /* Subtle hint */
}

/* HELICLOCK: Top-Right Anchor */
.clock-zone {
  display: grid;
  place-items: start end;
  padding: 1rem;
  height: 80px; /* Consistent height for the top anchor */
}

.chat-zone {
  grid-row: 2;
  overflow-y: auto; /* Let the chat scroll internally */
  padding: 10px;
}

/* 6. BESEARCH DRAWER: Overlaying the bottom stage */
.besearch-drawer {
  position: absolute;
  bottom: 0;
  left: 80px; /* Offset for rail */
  right: 380px; /* Offset for chat */
  height: 40vh;
  background: white;
  z-index: 110;
  border-top: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 -10px 40px rgba(0,0,0,0.05);
}

/* 7. DRAG HANDLE BUTTON */
.toggle-life-tools-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background-color: transparent;
  border: none;
  z-index: 200;
  cursor: ew-resize;
  display: grid;
  place-items: center;
}

.tear {
  width: 38px;
  height: 38px;
  border-radius: 0 50% 50% 50%;
  border: 3px solid #3b82f6;
  transform: rotate(45deg);
  background-color: #3b82f6;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

/* TRANSITIONS */
.sov-fade-enter-active, .sov-fade-leave-active { transition: opacity 0.5s ease; }
.sov-fade-enter-from, .sov-fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

/* right side panel, heli clock / beebee chat */
.panel-content-area {
  grid-row: 2;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 1rem;
}

.heli-projection-zone {
  display: grid;
  grid-template-columns: 1fr;
  height: 100%;
}

.heli-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding-top: 2rem;
  border-top: 1px solid rgba(0,0,0,0.05);
}

/* Transitions for a "slick" OS feel */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}




</style>