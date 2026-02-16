<template>
  <aside 
    class="side-panel right-panel-container overlay-blur"
    :style="{ width: width + 'px' }"
  >

    <button
      @mousedown.stop="$emit('startDrag')"
      @click="handleToggle"
      class="thought-bubble-button"
      :style="{ left: '-35px' }" 
    >
      <div class="bubble-core">
        <div class="bubble-lines">
          <span class="line short">-</span>
          <span class="line long">--</span>
          <span class="line medium">-</span>
        </div>
        <div class="bubble-tail"></div>
      </div>
    </button>
    <div 
      class="chat-drag-handle" 
      @mousedown.stop="$emit('startDrag')"
    ></div>

    <div id="dialogue-zone" class="header-text">beebee dialogue</div>

    <div class="panel-content-area">
      <transition name="fade-slide" mode="out-in">
        <div v-if="mode === 'chat' && !isInitialState" class="chat-zone" key="chat">
          <LifeDialogue :context="data" />
        </div>
        
        <div v-else-if="mode === 'heli'" class="heli-zone" key="heli">
          <div class="heli-projection">Projection Active</div>
        </div>
      </transition>
    </div>

    <button class="mode-toggle" @click="handleModeToggle">
      Switch to {{ mode === 'chat' ? 'Heli' : 'Chat' }}
    </button>
  </aside>
</template>

<script setup>
import LifeDialogue from '@/components/orbit/dialogue/lifeDialogue.vue'

const props = defineProps({
  width: Number,
  mode: {
    type: String,
    default: 'chat'
  },
  isInitialState: Boolean,
  isOpen: Boolean,
  data: Object
});

const emit = defineEmits([
  'startDrag', 
  'update:mode',
  'update:width',
  'update:isOpen', 
  'panelClick'
]);

const handleToggle = () => {
  const nextState = !props.isOpen;
  emit('update:isOpen', nextState);
  // If opening, go to a usable width (e.g. 380px). If closing, go to 0.
  emit('update:width', nextState ? 380 : 0); 
};

</script>

<style scoped>
.right-panel-container {
  grid-column: 3;
  z-index: 200;
  border-left: 1px solid rgba(185, 173, 207, 0.15);
  position: relative;
  height: 100vh;
  /* display: grid;  <-- Remove this or change to block if it causes issues */
  overflow: visible !important; /* Ensure the bubble can hang outside the panel */
  background: linear-gradient(145deg, rgba(123, 123, 211, 0.9), rgba(40, 40, 80, 0.8));
    border-left: 2px solid rgba(63, 89, 206, 0.7);
    border-top: 2px solid rgba(78, 98, 214, 0.7);
    box-shadow:
        0 0 20px rgba(87, 122, 219, 0.5),
        inset -5px 5px 15px rgba(107, 116, 238, 0.2),
        inset 5px -5px 15px rgba(0, 0, 0, 0.5);
    transition: right 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    z-index: 99;
    backdrop-filter: blur(10px);
}

/* Ensure the panel content doesn't bleed out when collapsed */
.panel-content-area {
  overflow-x: hidden;
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  background: linear-gradient(to bottom, rgba(120, 120, 214, 0.7), rgba(61, 61, 121, 0.7));
  border: 1px solid rgba(111, 103, 231, 0.3);
  border-radius: 0 0 0 8px;
}

.overlay-blur {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(15px);
}

 /* Thought bubble button styling */
.thought-bubble-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 45px;
  background: none;
  border: none;
  cursor: ew-resize;
  z-index: 300;
  display: grid;
  place-items: center;
}

.bubble-core {
  display: grid;
  /* 3 rows for the 3 lines of 'text' */
  grid-template-rows: repeat(3, 4px);
  gap: 4px;
  padding: 8px;
  width: 40px;
  height: 32px;
  background: #38205f;
  border-radius: 14px 14px 2px 14px;
  align-content: center; /* Vertically center the text block */
}

/* The "tail" of the thought bubble */
.bubble-tail {
  position: absolute;
  bottom: -4px;
  right: 2px;
  width: 10px;
  height: 10px;
  background: #38205f;
  border-radius: 50%;
}

.line {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2px;
}

/* Using Grid to define the 'personality' of the lines */
.line:nth-child(1) { width: 60%; justify-self: start; background: white;}
.line:nth-child(2) { width: 90%; justify-self: center; }
.line:nth-child(3) { width: 40%; justify-self: end; }

/* Animation for when dragging or active */
.thought-bubble-button:active .bubble-core {
  transform: scale(0.9);
  background: #c3c6d1;
}

.thought-bubble-button:hover .bubble-core {
  transform: translateY(-2px);
}

.chat-drag-handle {
  position: absolute;
  left: 0; 
  top: 0; 
  bottom: 0; 
  width: 10px;
  cursor: ew-resize;
  z-index: 210;
  transition: background 0.2s;
}

.chat-drag-handle:hover {
  background: rgba(59, 130, 246, 0.1);
}

.header-text {
  padding: 20px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.8rem;
  opacity: 0.6;
}

.mode-toggle {
  margin: 20px;
  padding: 10px;
  border: 1px solid rgba(0,0,0,0.1);
  background: white;
  border-radius: 8px;
  cursor: pointer;
}

/* Transitions */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from { opacity: 0; transform: translateX(20px); }
.fade-slide-leave-to { opacity: 0; transform: translateX(-20px); }
</style>