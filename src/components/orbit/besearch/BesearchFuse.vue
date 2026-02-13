<template>
  <footer class="status-fuse">
    <div 
      v-for="(stage, key) in stages" 
      :key="key"
      class="fuse-segment" 
      :class="status[key] ? 'fuse-active' : 'fuse-hollow'"
      @click="$emit('switch-world', stage.worldTarget)"
    >
      <div class="segment-content">
        <span class="label">{{ stage.label }}</span>
        <span class="status-indicator">{{ stage.subText }}</span>
      </div>
      <div v-if="status[key]" class="glow-line"></div>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  status: {
    type: Object,
    default: () => ({ context: false, research: false, models: false, emulation: false })
  },
  cueCount: { type: Number, default: 0 }
});

const stages = {
  context: { label: 'Context', subText: 'EARTH / GENESIS', worldTarget: 'earth' },
  research: { label: 'Research', subText: 'CUE SPACE', worldTarget: 'orbit' },
  models: { label: 'Models', subText: 'BODY / BIO-LOGIC', worldTarget: 'body' },
  emulation: { label: 'Emulation', subText: 'RESONANCE', worldTarget: 'orbit' }
};
</script>

<style scoped>
.status-fuse {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  background: #000;
  padding: 4px;
  height: 100%; /* Parent controls the 50px-60px height */
  border-top: 1px solid rgba(255,255,255,0.1);
}

.fuse-segment {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 2px;
}

.fuse-hollow {
  background: rgba(255, 255, 255, 0.02);
  color: rgba(255, 255, 255, 0.2);
}

.fuse-active {
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.02) 100%);
  color: #3b82f6;
}

.glow-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background: #3b82f6;
  box-shadow: 0 0 10px #3b82f6;
}

.segment-content {
  text-align: center;
  z-index: 2;
}

.label {
  display: block;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.status-indicator {
  display: block;
  font-size: 0.5rem;
  margin-top: 2px;
  opacity: 0.5;
  font-family: 'Inter', sans-serif;
}

.fuse-segment:hover {
  background: rgba(255, 255, 255, 0.05);
}
</style>