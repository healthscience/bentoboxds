<template>
  <div 
    id="bento-frame" 
    :class="['bento-frame', activeClass]"
  >
    <div 
      v-for="quad in quadrants" 
      :key="quad.id"
      :id="quad.id"
      class="bento-quadrant"
      :class="{ 'focused': activeQuadrants.includes(quad.id) }"
      @click="toggleQuadrant(quad.id)"
    >
      {{ quad.label }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  activeQuadrants: {
    type: Array,
    default: () => ['now-me']
  }
});

const emit = defineEmits(['update:activeQuadrants']);

const quadrants = [
  { id: 'now-me', label: 'NOW ME' },
  { id: 'future-me', label: 'FUTURE ME' },
  { id: 'now-us', label: 'NOW US' },
  { id: 'future-us', label: 'FUTURE US' }
];

const activeClass = computed(() => {
  if (props.activeQuadrants.length === 0) return '';
  // Use the last selected quadrant for the border color
  const lastActive = props.activeQuadrants[props.activeQuadrants.length - 1];
  return `active-${lastActive}`;
});

const toggleQuadrant = (id) => {
  let newActive = [...props.activeQuadrants];
  if (newActive.includes(id)) {
    // Don't allow deselecting if it's the only one
    if (newActive.length > 1) {
      newActive = newActive.filter(q => q !== id);
    }
  } else {
    newActive.push(id);
  }
  emit('update:activeQuadrants', newActive);
};
</script>

<style scoped>
.bento-frame {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  border: 4px solid transparent;
  transition: border-color 0.5s ease;
  width: 160px;
  height: 160px;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  overflow: hidden;
  pointer-events: auto;
}

/* Dynamic Border Shifts */
.active-now-me { border-color: #00f2ff; }
.active-future-me { border-color: #4b0082; }
.active-now-us { border-color: #ffbf00; }
.active-future-us { border-color: #8a2be2; }

.bento-quadrant {
  display: grid;
  place-items: center;
  font-size: 10px;
  font-weight: bold;
  color: #00f2ff;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  padding: 4px;
}

.bento-quadrant.focused {
  opacity: 1.0;
  transform: scale(1.02);
  background: #003366;
  color: white;
}

.bento-quadrant:hover {
  opacity: 0.8;
}
</style>
