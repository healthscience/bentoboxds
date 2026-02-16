<template>
  <aside 
    class="right-panel-container overlay-blur"
    :style="{ width: width + 'px' }"
  >
    <button
      @mousedown.stop="$emit('startDrag')"
      @click="handleToggle"
      class="thought-bubble-button"
    >
      <div class="bubble-core">
        <div class="bubble-lines">
          <span class="line short"></span>
          <span class="line long"></span>
          <span class="line medium"></span>
        </div>
        <div class="bubble-tail"></div>
      </div>
    </button>

    <div v-show="width > 50" class="panel-content-wrapper">
      <div id="dialogue-zone" class="header-text">beebee dialogue</div>
      <div class="panel-content-area">
        <transition name="fade-slide" mode="out-in">
          <div v-if="mode === 'chat' && !isInitialState" class="chat-zone" key="chat">
            <LifeDialogue :context="data" />
          </div>
        </transition>
      </div>
    </div>
  </aside>
</template>

<script setup>
import LifeDialogue from '@/components/orbit/dialogue/lifeDialogue.vue'

const props = defineProps({
  width: Number,
  mode: String,
  isInitialState: Boolean,
  isOpen: Boolean,
  data: Object
});

const emit = defineEmits(['startDrag', 'update:mode', 'update:width', 'update:isOpen']);

const handleToggle = () => {
  const nextState = !props.isOpen;
  emit('update:isOpen', nextState);
  emit('update:width', nextState ? 380 : 0); 
};
</script>

<style scoped>
.right-panel-container {
  height: 100vh;
  position: relative;
  /* Allow bubble to sit outside the aside */
  overflow: visible !important; 
  border-left: 1px solid rgba(185, 173, 207, 0.15);
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(15px);
}

.thought-bubble-button {
  position: absolute;
  top: 50%;
  left: -45px; /* Sits completely outside the panel */
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  z-index: 999;
}

.bubble-core {
  display: grid;
  grid-template-rows: repeat(3, 4px);
  gap: 4px;
  padding: 8px;
  width: 42px;
  height: 34px;
  background: #38205f;
  border-radius: 14px 14px 2px 14px;
  position: relative;
}

.bubble-tail {
  position: absolute;
  bottom: -4px;
  right: 4px;
  width: 10px;
  height: 10px;
  background: #38205f;
  border-radius: 50%;
}

.line { background: rgba(255, 255, 255, 0.4); border-radius: 2px; height: 3px; }
.line:nth-child(1) { width: 50%; }
.line:nth-child(2) { width: 90%; }
.line:nth-child(3) { width: 70%; }

.panel-content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.header-text { padding: 20px; opacity: 0.6; font-size: 0.7rem; font-weight: bold; }
.panel-content-area { flex: 1; overflow-y: auto; padding: 0 20px; }
</style>