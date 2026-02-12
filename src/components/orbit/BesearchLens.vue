<template>
  <div class="besearch-lens-grid">
    <div v-for="(data, lens) in lenses" :key="lens" :class="['lens-box', lens]">
      <header class="lens-header">
        <span class="pulse-dot"></span>
        <h3>{{ lens }}</h3>
      </header>
      <div class="variable-list">
        <div v-for="tag in data" :key="tag" class="variable-tag">
          {{ tag }}
        </div>
        <div v-if="!data.length" class="empty-state">Initialize...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  lenses: {
    type: Object,
    default: () => ({ capacity: [], coherence: [], context: [] })
  }
});
</script>

<style scoped>
.besearch-lens-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
}

.lens-box {
  padding: 20px;
  border-radius: var(--sov-border-radius);
  border-top: 4px solid #ccc;
  background: var(--sov-bg-soft);
}

.capacity { border-top-color: var(--sov-capacity); }
.coherence { border-top-color: var(--sov-coherence); }
.context { border-top-color: var(--sov-context); }

.lens-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 15px;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

/* Stagger the appearance of tags */
.variable-tag:nth-child(1) { animation-delay: 0.1s; }
.variable-tag:nth-child(2) { animation-delay: 0.2s; }
.variable-tag:nth-child(3) { animation-delay: 0.3s; }

@keyframes tag-pop {
  0% { opacity: 0; transform: scale(0.8) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}
</style>


