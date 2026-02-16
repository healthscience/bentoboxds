<template>
  <div 
    class="prime-interface" 
    :class="[activeWorld, { 'is-zen': isInitialState }]" 
    :style="dynamicGridStyle"
    @mousemove="handleGlobalDrag"
    @mouseup="stopDragging"
    @mouseleave="stopDragging"
  >
    <LeftPanel
      v-model="activeWorld"
      class="left-rail-area"
      :width="panelWidth"
      :isOpen="isLifeToolsOpen"
      @update:width="val => panelWidth = val"
      @update:isOpen="val => isLifeToolsOpen = val"
      @startDrag="startDraggingLeft"
    />

    <main class="orbit-stage">
      <OrbitHUD v-if="!isInitialState" />

      <div class="interface-layer">
        <transition name="sov-fade">
          <LaunchpadStack v-if="isInitialState" @launch="launchDemo" />
        </transition>

        <transition name="sov-fade">
          <div v-if="isDemoMode" class="demo-controls">
            <div class="swim-experience-label">Swim Peer Experience</div>
            <div class="button-group">
                <button @click="exitToZen" class="exit-btn">Exit</button>
                <button @click="handleClone" class="clone-btn">Clone</button>
            </div>
          </div>
        </transition>
      </div>

      <WorldCanvas 
        :tools="tools" 
        :activeWorld="isInitialState ? 'void' : activeWorld"
        :showTools="!isInitialState"
        @startToolDrag="startToolDrag"
      />

      <div class="fuse-container">
        <BesearchFuse @submit="handleUserInput" />
      </div>
    </main>

    <RightPanel 
      v-model:mode="rightPanelMode"
      class="right-panel-area"
      :width="chatWidth"
      :isOpen="isChatOpen"
      :isInitialState="isInitialState"
      :data="extractedData"
      @update:isOpen="val => isChatOpen = val" 
      @update:width="val => chatWidth = val"
      @startDrag="startChatDrag"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { aiInterfaceStore } from '@/stores/aiInterface.js';

// Sub-components
import LeftPanel from '@/components/orbit/parts/LeftPanel.vue';
import RightPanel from '@/components/orbit/parts/RightPanel.vue';
import WorldCanvas from '@/components/orbit/parts/WorldCanvas.vue';
import OrbitHUD from '@/components/orbit/parts/OrbitHUD.vue';
import LaunchpadStack from '@/components/orbit/parts/LaunchpadStack.vue';
import BesearchFuse from '@/components/orbit/besearch/BesearchFuse.vue';

const storeAI = aiInterfaceStore();

const extractedData = computed(() => storeAI.digestInput);
const activeWorld = computed({
  get: () => storeAI.activeWorld,
  set: (val) => storeAI.activeWorld = val
});

const isChatOpen = ref(false);
const isLifeToolsOpen = ref(false);
const rightPanelMode = ref('chat');

const panelWidth = ref(80);
const chatWidth = ref(0); // Start at 0 to see if bubble shows
const draggingMode = ref(null);
let draggingToolId = ref(null);

const tools = ref({
  pulse: { x: 50, y: 50 },
  heli: { x: 80, y: 20 }
});

const currentMode = ref('zen'); 
const isInitialState = computed(() => currentMode.value === 'zen');
const isDemoMode = computed(() => currentMode.value === 'demo');

const launchDemo = () => {
  currentMode.value = 'demo';
  activeWorld.value = 'earth';
  chatWidth.value = 380; 
  isChatOpen.value = true;
};

const handleUserInput = (input) => {
  currentMode.value = 'active';
  activeWorld.value = 'body';
};

const exitToZen = () => {
  currentMode.value = 'zen';
  activeWorld.value = 'orbit';
  chatWidth.value = 0;
  isChatOpen.value = false;
  panelWidth.value = 80;
};

const startDraggingLeft = () => { draggingMode.value = 'left'; document.body.style.cursor = 'ew-resize'; };
const startChatDrag = () => { draggingMode.value = 'right'; document.body.style.cursor = 'ew-resize'; };
const startToolDrag = (id) => { draggingMode.value = 'tool'; draggingToolId.value = id; };

const handleGlobalDrag = (e) => {
  if (!draggingMode.value) return;
  if (draggingMode.value === 'left') {
    panelWidth.value = Math.max(80, Math.min(e.clientX, window.innerWidth * 0.4));
    isLifeToolsOpen.value = panelWidth.value > 150;
  } 
  else if (draggingMode.value === 'right') {
    const newWidth = window.innerWidth - e.clientX;
    chatWidth.value = Math.max(0, Math.min(newWidth, window.innerWidth * 0.5));
    isChatOpen.value = chatWidth.value > 150;
  }
  else if (draggingMode.value === 'tool') {
    const stage = document.querySelector('.orbit-stage');
    const bounds = stage.getBoundingClientRect();
    tools.value[draggingToolId.value].x = ((e.clientX - bounds.left) / bounds.width) * 100;
    tools.value[draggingToolId.value].y = ((e.clientY - bounds.top) / bounds.height) * 100;
  }
};

const stopDragging = () => { draggingMode.value = null; document.body.style.cursor = 'default'; };

const dynamicGridStyle = computed(() => ({
  gridTemplateColumns: `${panelWidth.value}px 1fr ${chatWidth.value}px`,
  gridTemplateAreas: '"tools stage chat"'
}));
</script>

<style scoped>
.prime-interface {
  display: grid;
  grid-template-rows: 100vh;
  width: 100vw;
  height: 100vh;
  /* CRITICAL: Changed from hidden to clip or visible so bubble can leak out */
  overflow: visible; 
  position: relative;
  background-color: #f8f9fa;
}

.left-rail-area { grid-area: tools; z-index: 500; }
.right-panel-area { grid-area: chat; z-index: 500; }

.orbit-stage {
  grid-area: stage;
  display: grid;
  grid-template-rows: 80px 1fr 60px;
  height: 100%;
  position: relative;
  z-index: 100;
}

.interface-layer {
  grid-row: 2;
  z-index: 400;
  display: grid;
  place-items: center;
  pointer-events: none;
}
.interface-layer > * { pointer-events: auto; }

.demo-controls {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  pointer-events: auto;
}
</style>