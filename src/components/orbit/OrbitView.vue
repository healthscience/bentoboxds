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

    <main class="orbit-stage" @mousemove="handleGlobalDrag" @mouseup="stopDragging">
      <div class="hud-top">
        <div class="metric"><span>BESEARCH</span><strong>3</strong></div>
        <div class="metric"><span>DIALOGUE</span><strong>234</strong></div>
        <div class="metric"><span>CUES</span><strong>345</strong></div>
      </div>

      <div class="interface-layer">
        <transition name="sov-fade" mode="out-in">
          <div v-if="isInitialState" class="launchpad-stack">
            <div class="avatar-zone"><BeeBeeAvatar /></div>
            <div class="input-zone">
              <div class="input-constraint"><inputBox/></div>
            </div>
            <div class="demo-zone">
              <button class="sov-demo-btn" @click="launchDemo('sport')">🏊 Experience 400IM</button>
              <button class="sov-demo-btn" @click="launchDemo('water')">Water</button>
              <button class="sov-demo-btn" @click="launchDemo('earth')">Earth</button>
            </div>
          </div>
          
          <div v-else class="active-resonance">
            <BesearchLens :lenses="extractedData" />
            <div class="meta-actions-zone">
              <button class="sov-btn exit" @click="exitDemo">Exit Demo</button>
              <button class="sov-btn clone" @click="cloneExperience">📁 Clone & Personalize</button>
            </div>
          </div>
        </transition>
      </div>

      <div class="fuse-container">
        <BesearchFuse />
      </div>

      <div 
        class="world-canvas" 
        :class="{ 'dragging-active': draggingToolId }"
      >
        <div 
          v-if="tools.pulse"
          class="tool-grab-wrapper"
          :style="{ left: tools.pulse.x + '%', top: tools.pulse.y + '%', zIndex: draggingToolId === 'pulse' ? 300 : 100 }"
          @mousedown.stop="startToolDrag('pulse')"
        >
          <ResonancePulse />
        </div>

        <div 
          v-if="tools.heli"
          class="tool-grab-wrapper"
          :style="{ left: tools.heli.x + '%', top: tools.heli.y + '%', zIndex: draggingToolId === 'heli' ? 300 : 100 }"
          @mousedown.stop="startToolDrag('heli')"
        >
          <HeliClock />
        </div>
      </div>

      <transition name="slide-up">
        <footer v-if="!isInitialState && showBesearchDrawer" class="besearch-drawer">
          <BesearchPanel :activeData="extractedData" />
        </footer>
      </transition>
    </main>

    <aside class="side-panel right-panel overlay-blur">
      <div class="chat-drag-handle" @mousedown.stop="startChatDrag"></div>
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
import BesearchFuse from '@/components/orbit/besearch/BesearchFuse.vue'
import BesearchPanel from '@/components/orbit/besearch/besearchPanel.vue'
import inputBox from '@/components/beebeehelp/inputBox.vue';
import ProjectionHeli from '@/components/orbit/clock/projectionHeli.vue'
import ResonancePulse from '@/components/orbit/resonance/ResonancePulse.vue' // Fixed Import

import { aiInterfaceStore } from '@/stores/aiInterface.js'

const storeAI = aiInterfaceStore();
const showBesearchDrawer = ref(true);

/* Computed Logic */
const isInitialState = computed(() => storeAI.isInitialState);
const extractedData = computed(() => storeAI.digestInput);

/* ORBIT TOOL POSITIONS */
const tools = ref({
  pulse: { x: 50, y: 50 },
  heli: { x: 80, y: 20 }
});
let draggingToolId = ref(null);

/* LEFT PANEL (LIFE TOOLS) DRAG */
const panelWidth = ref(80);
const isLifeToolsOpen = ref(false);
const isDragging = ref(false);
const dragMoved = ref(false); 
const startX = ref(0);
const startWidth = ref(80);

/* RIGHT PANEL (DIALOGUE) DRAG */
const chatWidth = ref(380);
const isChatDragging = ref(false);
const startChatX = ref(0);
const startChatWidth = ref(380);
const rightPanelMode = ref('chat');

/* CORE DRAG ENGINE */
const startToolDrag = (id) => {
  draggingToolId.value = id;
  document.body.style.cursor = 'move';
};

const startDragging = (e) => {
  isDragging.value = true;
  dragMoved.value = false;
  startX.value = e.clientX;
  startWidth.value = panelWidth.value;
  document.body.style.cursor = 'ew-resize';
};

const startChatDrag = (e) => {
  isChatDragging.value = true;
  startChatX.value = e.clientX;
  startChatWidth.value = chatWidth.value;
  document.body.style.cursor = 'ew-resize';
};

const handleGlobalDrag = (e) => {
  // 1. Sidebar Left
  if (isDragging.value) {
    dragMoved.value = true;
    let newWidth = startWidth.value + (e.clientX - startX.value);
    panelWidth.value = Math.max(80, Math.min(newWidth, window.innerWidth * 0.5));
    isLifeToolsOpen.value = panelWidth.value > 120;
    return;
  }

  // 2. Sidebar Right
  if (isChatDragging.value) {
    const delta = startChatX.value - e.clientX; 
    chatWidth.value = Math.max(280, Math.min(startChatWidth.value + delta, window.innerWidth * 0.9));
    return;
  }

  // 3. Tool Movement (Relative to Orbit Stage)
  if (draggingToolId.value) {
    const stage = document.querySelector('.orbit-stage');
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    let xPerc = ((e.clientX - bounds.left) / bounds.width) * 100;
    let yPerc = ((e.clientY - bounds.top) / bounds.height) * 100;
    tools.value[draggingToolId.value].x = Math.max(2, Math.min(xPerc, 98));
    tools.value[draggingToolId.value].y = Math.max(2, Math.min(yPerc, 98));
  }
};

const stopDragging = () => {
  isDragging.value = false;
  isChatDragging.value = false;
  draggingToolId.value = null;
  document.body.style.cursor = 'default';
};

/* LAYOUT HELPERS */
const dynamicGridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `${panelWidth.value}px 1fr ${chatWidth.value}px`,
  gridTemplateRows: '100vh',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  gridTemplateAreas: '"tools stage chat"'
}));

const handleButtonClick = () => {
  if (dragMoved.value) return;
  isLifeToolsOpen.value = !isLifeToolsOpen.value;
  panelWidth.value = isLifeToolsOpen.value ? window.innerWidth * 0.3 : 80;
};

const launchDemo = (demo) => {
  if (demo === 'sport') {
    storeAI.beebeeDigest("I want to swim 400m in 10 orbits, but chlorine makes my skin itchy.", true);
  }
};

const exitDemo = () => {
  storeAI.isInitialState = true;
  showBesearchDrawer.value = false;
};

const cloneExperience = () => {
  alert("Protocol Cloned!");
};
</script>

<style scoped>
/* 1. CONTAINER: GRID LOCK */
.prime-interface {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f9f9f9;
}

/* 2. CENTER STAGE: 3-Row Vertical Logic */
.orbit-stage {
  grid-area: stage;
  position: relative;
  display: grid;
  grid-template-rows: 80px 1fr 60px; /* HUD | CONTENT | FUSE */
  height: 100vh;
  z-index: 10;
}

/* WORLD CANVAS: Overlay for draggable tools */
.world-canvas {
  position: absolute;
  top: 0; left: 0;
  width: 100%;
  height: calc(100% - 60px); /* Leave room for the Fuse footer */
  z-index: 100;
  pointer-events: none; /* Let clicks hit the launchpad buttons */
}

.tool-grab-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: auto; /* Tools themselves ARE clickable */
  cursor: grab;
  min-width: 50px;
  min-height: 50px;
  display: grid;
  place-items: center;
}

.world-canvas.dragging-active {
  pointer-events: auto; /* Catch mousemoves during active drag */
}

/* FUSE: The bottom interactive row */
.fuse-container {
  grid-row: 3;
  z-index: 150; /* Ensure Fuse is above the canvas plane */
  height: 60px;
  position: relative;
  background: rgba(255,255,255,0.05);
}

.hud-top {
  position: absolute;
  top: 0; width: 100%; height: 80px;
  z-index: 110;
  display: flex;
  justify-content: space-around;
  pointer-events: none;
}
.hud-top .metric { pointer-events: auto; }

/* INTERFACE: Launchpad and Lenses */
.interface-layer {
  grid-row: 2;
  position: relative;
  z-index: 20;
  display: grid;
  place-items: center;
}

.launchpad-stack {
  display: grid;
  grid-template-rows: repeat(12, 1fr);
  height: 100%;
  width: 100%;
}

.avatar-zone { grid-row: 2 / 5; display: grid; place-items: center; }
.input-zone { grid-row: 6 / 9; display: grid; place-items: center; }
.demo-zone { grid-row: 10; display: flex; justify-content: center; gap: 20px; }

/* LEFT PANEL */
.left-rail {
  grid-area: tools;
  z-index: 200;
  border-right: 1px solid rgba(0,0,0,0.05);
}

.rail-faded { opacity: 0.4; }

/* RIGHT PANEL */
.right-panel {
  grid-area: chat;
  z-index: 200;
  border-left: 1px solid rgba(185, 173, 207, 0.15);
  position: relative;
}

.chat-drag-handle {
  position: absolute;
  left: 0; top: 0; bottom: 0; width: 10px;
  cursor: ew-resize;
  z-index: 210;
}

/* DRAWER */
.besearch-drawer {
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  height: 40vh;
  background: white;
  z-index: 160;
  border-top: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0 -10px 40px rgba(0,0,0,0.05);
}

.overlay-blur {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(15px);
}

.toggle-life-tools-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px; height: 50px;
  background: none; border: none;
  z-index: 250;
  cursor: ew-resize;
}

.tear {
  width: 38px; height: 38px;
  border-radius: 0 50% 50% 50%;
  background: #3b82f6;
  transform: rotate(45deg);
}

.sov-fade-enter-active, .sov-fade-leave-active { transition: opacity 0.5s ease; }
.sov-fade-enter-from, .sov-fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>