<template>
  <div
    class="bbnexus-toolbar"
    :class="{ open: isOpen, dragging: isDragging }"
    :style="{ top: position.y + 'px', left: position.x + 'px' }"
  >
    <button
      class="bbnexus-toggle"
      @mousedown="startDrag"
      @click="toggle"
    >
      <img class="bbnexus-icon" :src="bbNexusIcon" alt="bbNexus" />
      <span class="bbnexus-label">bbNexus</span>
      <span class="bbnexus-grab">↔</span>
    </button>
    <div class="bbnexus-panels" v-if="isOpen">
      <div class="bbnexus-section">
        <div class="bbnexus-title">Worlds</div>
        <div class="bbnexus-buttons">
          <button class="bbnexus-btn" :class="activeClass('body')" @click="emitAction('world:body')">
            <span class="bbnexus-btn-icon">🫀</span>
            Body
          </button>
          <button class="bbnexus-btn" :class="activeClass('cues')" @click="emitAction('world:cue')">
            <span class="bbnexus-btn-icon">🧩</span>
            Cue
          </button>
          <button class="bbnexus-btn" :class="activeClass('earth')" @click="emitAction('world:earth')">
            <span class="bbnexus-btn-icon">🌍</span>
            Earth
          </button>
        </div>
      </div>
      <div class="bbnexus-section">
        <div class="bbnexus-title">Context</div>
        <div class="bbnexus-buttons">
          <button class="bbnexus-btn" @click="emitAction('context:cues')">
            <span class="bbnexus-btn-icon">🧠</span>
            Cues
          </button>
          <button class="bbnexus-btn" @click="emitAction('context:library')">
            <span class="bbnexus-btn-icon">📚</span>
            Library
          </button>
          <button class="bbnexus-btn" @click="emitAction('context:space')">
            <span class="bbnexus-btn-icon">🧭</span>
            Cue Space
          </button>
        </div>
      </div>
      <div class="bbnexus-section">
        <div class="bbnexus-title">Data</div>
        <div class="bbnexus-buttons">
          <button class="bbnexus-btn" @click="emitAction('data:devices')">
            <span class="bbnexus-btn-icon">📟</span>
            Devices
          </button>
          <button class="bbnexus-btn" @click="emitAction('data:network')">
            <span class="bbnexus-btn-icon">🕸️</span>
            Network
          </button>
          <button class="bbnexus-btn" @click="emitAction('data:tables')">
            <span class="bbnexus-btn-icon">📊</span>
            Tables
          </button>
        </div>
      </div>
      <div class="bbnexus-section">
        <div class="bbnexus-title">Peers</div>
        <div class="bbnexus-buttons">
          <button class="bbnexus-btn" @click="emitAction('peers:add')">
            <span class="bbnexus-btn-icon">➕</span>
            Add
          </button>
          <button class="bbnexus-btn" @click="emitAction('peers:share')">
            <span class="bbnexus-btn-icon">🔗</span>
            Share
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import bbNexusIcon from '@/assets/bbNexus-icon.png'

const emit = defineEmits(['action'])

const props = defineProps({
  activeWorld: {
    type: String,
    default: null
  }
})

const isOpen = ref(false)
const isDragging = ref(false)
const position = ref({ x: 120, y: 12 })
const dragOffset = ref({ x: 0, y: 0 })

const toggle = () => {
  isOpen.value = !isOpen.value
}

const emitAction = (action) => {
  emit('action', action)
}

const activeClass = (target) => {
  return props.activeWorld === target ? 'active' : ''
}

const startDrag = (event) => {
  isDragging.value = true
  dragOffset.value = {
    x: event.clientX - position.value.x,
    y: event.clientY - position.value.y
  }
  window.addEventListener('mousemove', handleDrag)
  window.addEventListener('mouseup', stopDrag)
}

const handleDrag = (event) => {
  if (!isDragging.value) return
  position.value = {
    x: Math.max(0, event.clientX - dragOffset.value.x),
    y: Math.max(0, event.clientY - dragOffset.value.y)
  }
}

const stopDrag = () => {
  isDragging.value = false
  window.removeEventListener('mousemove', handleDrag)
  window.removeEventListener('mouseup', stopDrag)
}

onBeforeUnmount(() => {
  window.removeEventListener('mousemove', handleDrag)
  window.removeEventListener('mouseup', stopDrag)
})
</script>

<style scoped>
.bbnexus-toolbar {
  position: absolute;
  z-index: 25;
  display: grid;
  gap: 8px;
  align-content: start;
}

.bbnexus-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #d7d7e5;
  border-radius: 999px;
  padding: 6px 12px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.bbnexus-grab {
  font-size: 12px;
  color: #6b6b88;
}

.bbnexus-icon {
  width: 20px;
  height: 20px;
}

.bbnexus-label {
  font-size: 12px;
  font-weight: 600;
  color: #2b2b55;
}

.bbnexus-panels {
  display: grid;
  gap: 8px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e2e2f0;
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.1);
  min-width: 220px;
}

.bbnexus-section {
  display: grid;
  gap: 6px;
}

.bbnexus-title {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b6b88;
}

.bbnexus-buttons {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
}

.bbnexus-btn {
  font-size: 12px;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #d6d6ea;
  background: #f6f6ff;
  color: #26264f;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}

.bbnexus-btn-icon {
  font-size: 14px;
}

.bbnexus-btn.active {
  background: #dfe1ff;
  border-color: #9fa6ff;
}

.bbnexus-btn:hover {
  background: #e8e8ff;
}
</style>
