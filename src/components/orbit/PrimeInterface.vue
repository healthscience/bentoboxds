<template>
  <div 
    class="prime-interface" 
    :style="dynamicGridStyle"
    @mousemove="handleGlobalDrag"
    @mouseup="stopDragging"
    @mouseleave="stopDragging"
  >

  <LeftPanel
    v-model="activeWorld"
    :width="panelWidth"
    :isOpen="isLifeToolsOpen"
    @update:width="val => panelWidth = val"
    @update:isOpen="val => isLifeToolsOpen = val"
    @startDrag="startDraggingLeft"
  />

  <WorldCanvas 
    :tools="tools" 
    :draggingId="draggingToolId"
    :activeWorld="activeWorld"
    @startToolDrag="startToolDrag"
  />

    <main class="orbit-stage">
      <OrbitHUD />

      <div class="interface-layer">
        <transition name="sov-fade" mode="out-in">
          <LaunchpadStack v-if="isInitialState" @launch="launchDemo" />
          <ActiveResonance v-else :data="extractedData" @exit="exitDemo" />
        </transition>
      </div>

      <div class="fuse-container">
        <BesearchFuse />
      </div>

      <BesearchDrawer v-if="!isInitialState" :data="extractedData" />
    </main>

<RightPanel 
  v-model:mode="rightPanelMode"
  :width="chatWidth"
  :isOpen="isChatOpen"         @update:isOpen="val => isChatOpen = val" @update:width="val => chatWidth = val"   :isInitialState="isInitialState"
  :data="extractedData"
  @startDrag="startChatDrag"
  style="position: fixed; right: 0; top: 0; bottom: 0; z-index: 99999;"
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
import ActiveResonance from '@/components/orbit/resonance/ResonancePulse.vue';
import BesearchFuse from '@/components/orbit/besearch/BesearchFuse.vue';
import BesearchDrawer from '@/components/orbit/besearch/BesearchPanel.vue';

const storeAI = aiInterfaceStore();
const isInitialState = computed(() => storeAI.isInitialState);
const extractedData = computed(() => storeAI.digestInput);
const isChatOpen = ref(true);
const rightPanelMode = ref('chat');

/** WORLD STATE **/
  const activeWorld = computed(() => {
    return storeAI.activeWorld
  })

/** DRAG ENGINE STATE **/
const panelWidth = ref(20);
const chatWidth = ref(20);
const isLifeToolsOpen = ref(false);
const draggingMode = ref(null); // 'left', 'right', or 'tool'

const tools = ref({
  pulse: { x: 50, y: 50 },
  heli: { x: 80, y: 20 }
});

let draggingToolId = ref(null);

/** DRAG ENGINE HANDLERS **/
const startDraggingLeft = () => {
  draggingMode.value = 'left';
  document.body.style.cursor = 'ew-resize';
  // Prevent text selection during drag
  document.body.style.userSelect = 'none';
};

const startChatDrag = () => { draggingMode.value = 'right'; document.body.style.cursor = 'ew-resize'; };

const startToolDrag = (id) => { draggingMode.value = 'tool'; draggingToolId.value = id; };

const handleGlobalDrag = (e) => {
  if (!draggingMode.value) return;

  if (draggingMode.value === 'left') {

    const newWidth = e.clientX; 
    // Constraints: Min 80px, Max 50% of screen
    if (newWidth >= 80 && newWidth <= window.innerWidth / 2) {
      panelWidth.value = newWidth;
      // Auto-toggle the "Open" state based on a threshold
      isLifeToolsOpen.value = panelWidth.value > 150;
    }
  } 
  else if (draggingMode.value === 'right') {
    const delta = window.innerWidth - e.clientX;
    chatWidth.value = Math.max(280, Math.min(delta, window.innerWidth * 0.6));
  } 
  else if (draggingMode.value === 'tool') {
    const stage = document.querySelector('.orbit-stage');
    const bounds = stage.getBoundingClientRect();
    tools.value[draggingToolId.value].x = ((e.clientX - bounds.left) / bounds.width) * 100;
    tools.value[draggingToolId.value].y = ((e.clientY - bounds.top) / bounds.height) * 100;
  }
};

const stopDragging = () => {
  draggingMode.value = null;
  draggingToolId.value = null;
  document.body.style.cursor = 'default';
  document.body.style.userSelect = 'auto';
};

const dynamicGridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `${panelWidth.value}px 1fr ${chatWidth.value}px`,
  gridTemplateRows: '100vh',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden'
}));

const launchDemo = (type) => storeAI.beebeeDigest(`Demo ${type} active`, true);
const exitDemo = () => storeAI.isInitialState = true;
</script>

<style scoped>

.prime-interface {
  display: grid;
  /* Columns: LeftRail | Stage | RightPanel */
  grid-template-columns: v-bind('panelWidth + "px"') 1fr v-bind('chatWidth + "px"');
  grid-template-rows: 100vh;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* Contextual color shifts using the activeWorld class */
.prime-interface.body { background-color: #fff9f9; }
.prime-interface.earth { background-color: #f9fbff; }
.prime-interface.orbit { background-color: #fafafa; }

.orbit-stage {
  grid-column: 2; /* Center column */
  display: grid;
  /* Row 1: HUD (80px), Row 2: World Content (Auto), Row 3: Fuse (60px) */
  grid-template-rows: 80px 1fr 60px;
  height: 100%;
  min-width: 0; /* Prevent grid blowout */
}
</style>