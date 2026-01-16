<template>
  <div id="besearch-tools">
    <h3>Besearch</h3>
    <div class="besearch-control-buttons">
      <button @click="handleCreate" class="control-button" aria-label="Create new besearch">Create</button>
      <button @click="handleStart" class="control-button" aria-label="Start besearch">Start</button>
      <button @click="handleStop" class="control-button" aria-label="Stop besearch">Stop</button>
    </div>

    <!-- Create Form Modal -->
    <besearch-create-form
      :show="showCreateForm"
      @close="handleCloseCreateForm"
      @save="handleCreateBesearchCycle"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BesearchCreateForm from './besearchCreateForm.vue'
import { besearchStore } from '@/stores/besearchStore.js'

// No emits needed - component is fully self-contained

const storeBesearch = besearchStore()
const showCreateForm = ref(false)

const handleCreate = () => {
  showCreateForm.value = true
}

const handleCloseCreateForm = () => {
  showCreateForm.value = false
}

const handleCreateBesearchCycle = async (formData) => {
  console.log('Creating besearch cycle:', formData)
  // Create new besearch cycle object
  const newCycle = {
    id: `cycle-${Date.now()}`,
    name: formData.name,
    besearchid: Date.now().toString(),
    x: Math.random() * 400 + 100, // Random position on canvas
    y: Math.random() * 300 + 100,
    cueSpace: { location: { width: 200, height: 200 }},
    active: true,
    isDragging: false,
    networkExperiment: formData.networkExperiment,
    frequency: formData.frequency,
    createdAt: new Date().toISOString()
  }
  // Save to HOP
  storeBesearch.saveToHOP(newCycle)
}

const handleStart = async () => {
  console.log('Besearch start action')
  const result = await storeBesearch.startBesearch()
  if (result.success) {
    console.log('Besearch started successfully:', result.message)
  } else {
    console.error('Failed to start besearch:', result.message)
  }
}

const handleStop = async () => {
  console.log('Besearch stop action')
  const result = await storeBesearch.stopBesearch()
  if (result.success) {
    console.log('Besearch stopped successfully:', result.message)
  } else {
    console.error('Failed to stop besearch:', result.message)
  }
}
</script>

<style scoped>
@media (min-width: 1024px) {
  .control-button {
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .control-button:hover {
    background-color: #9fb8d4;
  }

  .besearch-control-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }
}
</style>