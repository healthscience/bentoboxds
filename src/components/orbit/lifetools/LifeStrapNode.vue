<template>
  <div 
    class="life-strap-node" 
    :class="{ 'is-active': active }"
    @click="handleLSelect(strap.id)"
  >
    <header>LIFE-STRAP</header>
    <div class="strap-orb-wrap">
      <div class="orb-core" :style="{ '--orb-color': strap.color }"></div>
      <svg class="orb-progress" viewBox="0 0 40 40">
        <circle cx="12" cy="12" r="8" />
      </svg>
    </div>

    <div class="strap-info" v-if="expanded">
      <span class="strap-label">{{ strap.name }}</span>
      <span class="strap-meta">{{ strap.activeCues }} Cues Active</span>
      <button v-if="expanded" class="strap-settings">...</button>
    </div>    
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  strap: Object,
  active: Boolean,
  expanded: Boolean
})

const emit = defineEmits(['select'])

/* Compute an ID that includes name words */
const strapIdWithName = computed(() => {
  const s = props.strap
  if (!s) return ''
  // Generate ID: ls_{first_two_words}_{year}
  const nameWords = s.name ? s.name.split(' ').slice(0, 2).join('_').toLowerCase() : 'unnamed'
  const year = s.id ? s.id.match(/\d{4}/)?.[0] || '2026' : '2026'
  return `ls_${nameWords}_${year}`
})

/* methods */
const handleLSelect = (strapData) => {
  console.log('active life strap')
  console.log(strapData)
  // Emit full strap data including the name-enhanced ID
  emit('select', {
    id: strapIdWithName.value,
    originalId: props.strap.id,
    name: props.strap.name,
    contractKey: props.strap.contract_key,
    activeCues: props.strap.active_cues,
    color: props.strap.color
  })
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