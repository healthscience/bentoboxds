<template>
  <div v-if="show" class="besearch-create-form-overlay" @click="closeForm">
    <div class="besearch-create-form" @click.stop>
      <div class="form-header">
        <h3>Create New Besearch Cycle</h3>
        <button class="close-btn" @click="closeForm">✕</button>
      </div>

      <form @submit.prevent="handleSubmit" class="create-form">
        <div class="form-group">
          <label for="cycleName">Besearch Cycle Name</label>
          <input
            id="cycleName"
            v-model="formData.name"
            type="text"
            placeholder="Enter cycle name"
            required
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="besearch type">type</label>
          <select
            id="besearch-type"
            v-model="formData.besearchType"
            required
            class="form-select"
          >
            <option value="">Select type</option>
            <option value="prevention">Prevention</option>
            <option value="repair">Repair</option>
            <option value="rejuvenation">Rejuvenation</option>
            <option value="experimental">Experimental</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div class="form-group">
          <label for="besearch intervention">intervention</label>
          <select
            id="besearch-type"
            v-model="formData.besearchIntervention"
            required
            class="form-select"
          >
            <option value="">Select</option>
            <option value="mind">mind</option>
            <option value="exercise">exercise</option>
            <option value="sleep">sleep</option>
            <option value="food">food</option>
            <option value="supplement">supplement</option>
            <option value="therapy">therapy</option>
          </select>
        </div>
        <div class="form-group">
          <label for="networkExperiment">Network Experiment</label>
          <select
            id="networkExperiment"
            v-model="formData.networkExperiment"
            required
            class="form-select"
          >
            <option value="">Select experiment type</option>
            <option value="Experiment1">Experiment1</option>
            <option value="Experiment2">Experiment2</option>
            <option value="Experiment3">Experiment3</option>
            <option value="Experiment4">Experiment4</option>
            <option value="Experiment5">Experiment5</option>
          </select>
        </div>
        <div class="form-group">
          <label for="besearch type">marker</label>
          <select
            id="besearch-type"
            v-model="formData.besearchMarker"
            required
            class="form-select"
          >
            <option value="">Select marker</option>
            <option value="marker1">marker1</option>
           </select>
        </div>
        <div class="form-group">
          <label for="frequency">Frequency of Cycle</label>
          <select
            id="frequency"
            v-model="formData.frequency"
            required
            class="form-select"
          >
            <option value="">Select frequency</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="closeForm">Cancel</button>
          <button type="submit" class="save-btn" :disabled="!isFormValid">Create Cycle</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'save'])

const formData = ref({
  name: '',
  networkExperiment: '',
  frequency: ''
})

const isFormValid = computed(() => {
  return formData.value.name.trim() &&
         formData.value.networkExperiment &&
         formData.value.frequency
})

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('save', { ...formData.value })
    emit('close') // Close the overlay after successful submission
    resetForm()
  }
}

const closeForm = () => {
  emit('close')
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    networkExperiment: '',
    frequency: ''
  }
}
</script>

<style scoped>
.besearch-create-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.besearch-create-form {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
}

.form-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #333;
}

.create-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-select {
  cursor: pointer;
}

.form-actions {
  display: grid;
  grid-template-columns: auto auto;
  gap: 12px;
  justify-content: end;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.cancel-btn,
.save-btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #ddd;
}

.cancel-btn {
  background: white;
  color: #666;
}

.cancel-btn:hover {
  background: #f8f9fa;
  color: #333;
}

.save-btn {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.save-btn:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
}

.save-btn:disabled {
  background: #ccc;
  border-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

@media (max-width: 768px) {
  .besearch-create-form {
    width: 95%;
    margin: 20px;
  }

  .form-header,
  .create-form {
    padding: 16px;
  }

  .form-actions {
    grid-template-columns: 1fr;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
  }
}
</style>