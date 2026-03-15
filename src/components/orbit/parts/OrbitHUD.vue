<template>
  <div id="orbit-hud">
    <div class="hud-top">
      <div class="metric"><span>LIFE-STRAP</span><strong>1</strong></div>
      <div class="metric"><span>BESEARCH</span><strong>0</strong></div>
      <div class="metric"><span>DIALOGUE</span><strong>0</strong></div>
      <div class="metric"><span>CUES</span><strong>0</strong></div>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.hud-top {
  display: flex;
  justify-content: center;
  gap: 4rem;
  padding: 2rem;
  z-index: 10;
}

.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric span {
  font-size: 0.6rem;
  font-weight: 800;
  color: var(--sov-accent);
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}

.metric strong {
  font-size: 1.1rem;
  color: rgb(34, 13, 228);
  font-family: 'Space Mono', monospace;
}
</style>