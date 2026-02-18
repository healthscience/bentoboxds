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
          <LaunchpadStack
            v-if="isInitialState || isExtracting || isDemoMode" 
            :mode="currentMode" 
            :extractedData="mappedLenses"
            @launch="launchDemo" 
            @reset="exitToZen"
          />
        </transition>
      </div>

      <WorldCanvas 
        :tools="tools" 
        :activeWorld="isInitialState ? 'void' : activeWorld"
        :showTools="!isInitialState"
        @startToolDrag="startToolDrag"
      />

      <div class="fuse-container">
        <BesearchFuse v-if="!isInitialState" />
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
import { ref, computed, watch } from 'vue';
import { aiInterfaceStore } from '@/stores/aiInterface.js';
import { useChatStore } from '@/stores/chatStore.js';

// Sub-components
import LeftPanel from '@/components/orbit/parts/LeftPanel.vue';
import RightPanel from '@/components/orbit/parts/RightPanel.vue';
import WorldCanvas from '@/components/orbit/parts/WorldCanvas.vue';
import OrbitHUD from '@/components/orbit/parts/OrbitHUD.vue';
import LaunchpadStack from '@/components/orbit/parts/LaunchpadStack.vue';
import BesearchLens from '@/components/orbit/BesearchLens.vue';
import BesearchFuse from '@/components/orbit/besearch/BesearchFuse.vue';

const storeAI = aiInterfaceStore();
const storeChat = useChatStore();

/* computed */
const extractedData = computed(() => storeAI.digestInput);
const activeWorld = computed({
  get: () => storeAI.activeWorld,
  set: (val) => storeAI.activeWorld = val
});

// Watch for store changes to trigger the "Extracting" state automatically
watch(() => storeAI.digestInput, (newData) => {
  if (newData && currentMode.value === 'zen') {
    // handleUserInput();
  }
}, { deep: true });

/* panel settins */
// const isChatOpen = ref(false);
const isLifeToolsOpen = ref(false);
const rightPanelMode = ref('chat');

const panelWidth = ref(20);
// const chatWidth = ref(10); // Start at 0 to see if bubble shows
const draggingMode = ref(null);
let draggingToolId = ref(null);

const tools = ref({
  pulse: { x: 50, y: 50 },
  heli: { x: 80, y: 20 }
});

// 1. Add 'extracting' to the modes
// const currentMode = ref('zen'); // 'zen', 'demo', 'extracting', or 'active'

/* computed */
const isInitialState = computed(() => storeAI.currentMode === 'zen');
const isDemoMode = computed(() => storeAI.currentMode === 'demo');
const isExtracting = computed(() => storeAI.currentMode === 'extracting');
const currentMode = computed(() => storeAI.currentMode);

const chatWidth = computed(() => storeChat.chatWidth)
const isChatOpen = computed(() => storeChat.isChatOpen)

/* methods */
const launchDemo = (type) => {
  storeAI.currentMode = 'demo'; // This triggers the "Three Cs" in Launchpad
  activeWorld.value = type;
  
  // Also push the demo text into the store so the Lenses have data
  if (type === 'sport') {
    storeAI.beebeeDigest("I want to swim 400m in 10 orbits...", true);
  }
};

// 3. Update the Reset handler
const exitToZen = () => {
  storeAI.currentMode = 'zen';
  activeWorld.value = 'orbit';
  storeChat.chatWidth = 10;
  storeChat.isChatOpen = false;
  panelWidth.value = 20;
  // Clear the store input if needed
  storeAI.digestInput = null; 
};

// Inside PrimeInterface.vue <script setup>
const extractionLenses = computed(() => {
  return {
    capacity: storeAI.digestInput?.constraints ? [storeAI.digestInput.constraints] : [],
    coherence: storeAI.digestInput?.content ? [storeAI.digestInput.content] : [],
    context: storeAI.digestInput?.context ? [storeAI.digestInput.context] : []
  };
});

// Map the 3 Cs to the Lenses
const mappedLenses = computed(() => ({
  capacity: storeAI.digestInput?.capacity ? storeAI.digestInput.capacity : [],
  coherence: storeAI.digestInput?.coherence ? storeAI.digestInput.coherence : [],
  context: storeAI.digestInput?.context ? storeAI.digestInput.context : []
}));

/* drag handlers */
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
    storeChat.chatWidth = Math.max(0, Math.min(newWidth, window.innerWidth * 0.5));
    storeChat.isChatOpen = storeChat.chatWidth > 150;
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
  gridTemplateColumns: `${panelWidth.value}px 1fr ${storeChat.chatWidth}px`,
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

.extraction-lens-wrap {
  display: grid;
  grid-template-rows: auto auto; 
  gap: 40px;
  width: 90%;
  max-width: 1000px;
  pointer-events: auto;
}

.extraction-footer-grid {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
  align-items: center;
  gap: 80px;
  padding-top: 20px;
}

.manifest-nudge {
  font-weight: 800;
  color: #38205f;
  letter-spacing: 0.05em;
  /* Visual cue to look right */
  animation: pulse-right 2s infinite ease-in-out;
}

@keyframes pulse-right {
  0%, 100% { transform: translateX(0); opacity: 0.7; }
  50% { transform: translateX(15px); opacity: 1; }
}

.reset-btn {
  background: white;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 10px 24px;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #ef4444;
  color: white;
  transform: translateY(-2px);
}

.demo-controls {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  pointer-events: auto;
}
</style>