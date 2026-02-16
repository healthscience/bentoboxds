<template>
  <div id="life-tools-panel">
    <aside 
      class="side-rail left-rail overlay-blur"
      :class="{ 'rail-faded': !isOpen }"
      :style="{ width: width + 'px' }"
    >
      <LifeTools :is-expanded="isOpen" :current-width="width" />
      
      <button
        @mousedown.stop="$emit('startDrag')"
        @click="handleButtonClick"
        :class="['toggle-life-tools-button', { 'panel-open': isOpen }]"
        :style="{ left: (width - 20) + 'px' }"
      >
        <div class="key-to-life">
          <div class="tear"></div>
          <div class="key-head"></div>
        </div>
      </button>
    </aside>

    <div class="context-switcher">
      <button 
        v-for="world in worlds" 
        :key="world.id"
        :class="['switch-btn', { active: modelValue === world.id }]"
        @click="$emit('update:modelValue', world.id)"
        :title="world.label"
      >
        <span class="icon">{{ world.icon }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LifeTools from '@/components/orbit/lifetools/LifeTools.vue'

// PROPS: Controlled by PrimeInterface
const props = defineProps({ 
  modelValue: String,  // Active World
  width: Number,       // Current Panel Width
  isOpen: Boolean      // Toggle State
});

// EMITS: Notify PrimeInterface
const emit = defineEmits([
  'update:modelValue', 
  'update:width', 
  'update:isOpen', 
  'startDrag'
]);

const worlds = [
  { id: 'orbit', label: 'Standard Orbit', icon: '🌌' },
  { id: 'body', label: 'Human Body', icon: '👤' },
  { id: 'earth', label: 'Earth Context', icon: '🌍' }
];

const handleButtonClick = () => {
  // Toggle logic: notify parent to change values
  const nextState = !props.isOpen;
  emit('update:isOpen', nextState);
  
  // Snap to specific widths on click
  const nextWidth = nextState ? 300 : 80; 
  emit('update:width', nextWidth);
}

</script>

<style scoped>

/* LEFT PANEL */
.left-rail {
  grid-area: tools;
  z-index: 200;
  border-right: 1px solid rgba(0,0,0,0.05);
}

.rail-faded { opacity: 0.4; }

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


.context-switcher {
  display: flex;
  gap: 8px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.03);
  border-radius: 12px;
  margin: 1rem 0;
}

.switch-btn {
  flex: 1;
  border: none;
  background: white;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  font-size: 1.2rem;
}

.switch-btn.active {
  background: #3b82f6;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}
</style>