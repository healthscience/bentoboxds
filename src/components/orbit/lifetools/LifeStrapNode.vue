<template>
  <div 
    class="life-strap-node" 
    :class="{ 'is-active': active }"
    @click="$emit('select', strap.id)"
  >
    <header>LIFE-STRAP</header>
    <div class="strap-orb-wrap">
      <div class="orb-core" :style="{ '--orb-color': strap.color }"></div>
      <svg class="orb-progress" viewBox="0 0 40 40">
        <circle cx="20" cy="20" r="18" />
      </svg>
    </div>

    <div class="strap-info" v-if="expanded">
      <span class="strap-label">{{ strap.name }}</span>
      <span class="strap-meta">{{ strap.activeCues }} Cues Active</span>
    </div>
    
    <button v-if="expanded" class="strap-settings">···</button>
  </div>
</template>

<script>
export default {
  name: 'LifeStrapNode',
  props: {
    strap: Object,
    active: Boolean,
    expanded: Boolean
  }
}
</script>

<style scoped>
.life-strap-node {
  display: grid;
  align-items: center;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &.is-active {
    background-color: rgba(255, 255, 255, 0.15);
  }

  .strap-orb-wrap {
    position: relative;
    width: 30px;
    height: 30px;
  }

  .orb-core {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: var(--orb-color);
    z-index: 1;
  }

  .orb-progress {
    position: absolute;
  }

}
</style>