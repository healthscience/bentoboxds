<template>
  <transition name="slide-up">
    <div v-if="show" class="intervention-toolbar">
      <!-- List View - Shows when category is selected -->
      <div v-if="viewMode === 'list'" class="toolbar-list-view">
        <div class="toolbar-header">
          <h3>
            <span class="category-icon">{{ getCategoryIcon(selectedCategory) }}</span>
            {{ getCategoryTitle(selectedCategory) }} Interventions
          </h3>
          <button class="close-btn" @click="closeToolbar">✕</button>
        </div>
        
        <div class="interventions-grid">
          <div 
            v-for="intervention in categoryInterventions" 
            :key="intervention.id"
            class="intervention-card"
            @click="selectIntervention(intervention)"
          >
            <div class="card-header">
              <h4>{{ intervention.name }}</h4>
              <span class="status-badge" :class="getStatusClass(intervention.status)">
                {{ intervention.status }}
              </span>
            </div>
            <p class="card-description">{{ intervention.description }}</p>
            <div class="card-footer">
              <span class="cycles-count">
                {{ intervention.besearchCycles?.length || 0 }} cycles
              </span>
              <span class="view-details">View Details →</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail View - Shows when specific intervention is selected -->
      <div v-if="viewMode === 'detail'" class="toolbar-detail-view">
        <div class="toolbar-header">
          <button class="back-btn" @click="backToList">← Back</button>
          <h3>{{ selectedIntervention.name }}</h3>
          <button class="close-btn" @click="closeToolbar">✕</button>
        </div>
        
        <div class="detail-content-wrapper">
          <div class="detail-content">
            <div class="detail-section">
              <h4>Description</h4>
              <p>{{ selectedIntervention.description }}</p>
              <div class="status-info">
                <span>Status: </span>
                <span class="status-badge" :class="getStatusClass(selectedIntervention.status)">
                  {{ selectedIntervention.status }}
                </span>
              </div>
            </div>

            <div class="detail-section">
              <h4>Baseline Biomarkers</h4>
              <div class="biomarkers-list">
                <span 
                  v-for="biomarker in selectedIntervention.biomarkers" 
                  :key="biomarker"
                  class="biomarker-tag"
                >
                  {{ biomarker }}
                </span>
              </div>
            </div>

            <div class="detail-section">
              <h4>Linked Besearch Cycles ({{ selectedIntervention.besearchCycles?.length || 0 }})</h4>
              <div v-if="selectedIntervention.besearchCycles?.length" class="cycles-list">
                <div 
                  v-for="cycleId in selectedIntervention.besearchCycles" 
                  :key="cycleId"
                  class="cycle-item"
                >
                  <span class="cycle-icon">🔄</span>
                  <span>{{ cycleId }}</span>
                </div>
              </div>
              <div v-else class="no-cycles">
                No besearch cycles linked yet
              </div>
            </div>
          </div>
          
          <div class="detail-actions">
            <button class="action-btn primary" @click="addToCanvas">Add to Canvas</button>
            <button class="action-btn" @click="editIntervention">Edit</button>
            <button class="action-btn" @click="linkToCycle">Link to Cycle</button>
            <button class="action-btn danger" @click="deleteIntervention">Delete</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  show: Boolean,
  category: String,
  interventions: Array,
  intervention: Object
})

const emit = defineEmits(['close', 'select-intervention', 'edit', 'delete', 'link-cycle', 'add-intervention-to-canvas'])

const viewMode = ref('list') // 'list' or 'detail'
const selectedCategory = ref('')
const selectedIntervention = ref(null)

// Sample data with status - this would come from props/store
const sampleInterventions = {
  prevention: [
    // Human Health
    {
      id: 'prev-1',
      name: 'Fasting Mimicking Diet',
      description: '5-day low calorie plant-based diet that mimics fasting',
      status: 'working',
      biomarkers: ['IGF-1', 'Glucose', 'Ketones', 'CRP'],
      besearchCycles: ['cycle-1', 'cycle-3']
    },
    {
      id: 'prev-2',
      name: 'Intermittent Fasting 16:8',
      description: 'Daily 16-hour fasting window',
      status: 'experimentation',
      biomarkers: ['Insulin', 'Glucose', 'HbA1c'],
      besearchCycles: ['cycle-2']
    },
    {
      id: 'prev-3',
      name: 'Caloric Restriction',
      description: '20% reduction in daily calories',
      status: 'no effect',
      biomarkers: ['Weight', 'BMI', 'Leptin'],
      besearchCycles: []
    },
    // Built Environment
    {
      id: 'prev-4',
      name: 'Home Insulation Upgrade',
      description: 'Improve thermal insulation to reduce energy loss and maintain healthy indoor temperature',
      status: 'working',
      biomarkers: ['Indoor Air Quality', 'Temperature Stability', 'Energy Usage', 'Respiratory Health'],
      besearchCycles: ['cycle-7']
    },
    // Nature
    {
      id: 'prev-5',
      name: 'Stop Sewage Pollution',
      description: 'Prevent local sewage discharge into river system',
      status: 'experimentation',
      biomarkers: ['Water Quality Index', 'E.coli Levels', 'Dissolved Oxygen', 'Biodiversity Index'],
      besearchCycles: ['cycle-8', 'cycle-9']
    }
  ],
  repair: [
    // Human Health
    {
      id: 'repair-1',
      name: 'PEMF Joint Therapy',
      description: 'Pulsed electromagnetic field for joints',
      status: 'working',
      biomarkers: ['CRP', 'IL-6', 'Range of Motion'],
      besearchCycles: ['cycle-4']
    },
    {
      id: 'repair-2',
      name: 'Red Light Therapy',
      description: 'Near-infrared light treatment',
      status: 'experimentation',
      biomarkers: ['Collagen', 'Wound Healing Rate'],
      besearchCycles: []
    },
    // Built Environment
    {
      id: 'repair-3',
      name: 'Roof Tile Restoration',
      description: 'Fix and improve roofing tiles to prevent leaks and improve weather resistance',
      status: 'working',
      biomarkers: ['Structural Integrity', 'Water Damage Prevention', 'Indoor Humidity', 'Mold Risk'],
      besearchCycles: ['cycle-10']
    },
    // Nature
    {
      id: 'repair-4',
      name: 'Dam Removal Project',
      description: 'Remove obsolete dams from river basin to restore natural water flow',
      status: 'pending',
      biomarkers: ['Fish Migration Routes', 'Sediment Flow', 'River Temperature', 'Aquatic Biodiversity'],
      besearchCycles: ['cycle-11', 'cycle-12']
    }
  ],
  rejuvenation: [
    // Human Health
    {
      id: 'rejuv-1',
      name: 'Exosome Therapy',
      description: 'Stem cell-derived exosomes',
      status: 'experimentation',
      biomarkers: ['Telomere Length', 'Senescent Cells', 'NAD+'],
      besearchCycles: ['cycle-5', 'cycle-6']
    },
    {
      id: 'rejuv-2',
      name: 'NAD+ IV Therapy',
      description: 'Intravenous NAD+ infusion',
      status: 'working',
      biomarkers: ['NAD+ Levels', 'ATP', 'Mitochondrial Function'],
      besearchCycles: []
    },
    // Built Environment
    {
      id: 'rejuv-3',
      name: 'Solar Panel Installation',
      description: 'Add solar panels to old home for renewable energy generation',
      status: 'working',
      biomarkers: ['Carbon Footprint', 'Energy Independence', 'Air Quality Impact', 'Grid Resilience'],
      besearchCycles: ['cycle-13']
    },
    // Nature
    {
      id: 'rejuv-4',
      name: 'River Valley Rewilding',
      description: 'Restore upper river basin valley to natural ecosystem',
      status: 'experimentation',
      biomarkers: ['Species Diversity', 'Carbon Sequestration', 'Soil Health', 'Watershed Function'],
      besearchCycles: ['cycle-14', 'cycle-15', 'cycle-16']
    }
  ]
}

const categoryInterventions = computed(() => {
  return sampleInterventions[selectedCategory.value] || []
})

const getCategoryIcon = (category) => {
  const icons = {
    prevention: '🛡️',
    repair: '🔧',
    rejuvenation: '✨'
  }
  return icons[category] || ''
}

const getCategoryTitle = (category) => {
  const titles = {
    prevention: 'Prevention',
    repair: 'Repair',
    rejuvenation: 'Rejuvenation'
  }
  return titles[category] || ''
}

const getStatusClass = (status) => {
  const classes = {
    'working': 'status-working',
    'experimentation': 'status-experimental',
    'no effect': 'status-no-effect',
    'pending': 'status-pending'
  }
  return classes[status] || 'status-pending'
}

const selectIntervention = (intervention) => {
  selectedIntervention.value = intervention
  viewMode.value = 'detail'
  emit('select-intervention', intervention)
}

const backToList = () => {
  viewMode.value = 'list'
  selectedIntervention.value = null
}

const closeToolbar = () => {
  emit('close')
}

const addToCanvas = () => {
  if (selectedIntervention.value) {
    // Emit event with intervention data and suggested position (top-right)
    emit('add-intervention-to-canvas', {
      intervention: selectedIntervention.value,
      position: {
        x: window.innerWidth - 300, // 300px from right edge
        y: 100 // 100px from top
      }
    })
    // Close the toolbar after adding
    emit('close')
  }
}

const editIntervention = () => {
  emit('edit', selectedIntervention.value)
}

const deleteIntervention = () => {
  emit('delete', selectedIntervention.value)
}

const linkToCycle = () => {
  emit('link-cycle', selectedIntervention.value)
}

// Watch for category changes
const showCategory = (category) => {
  selectedCategory.value = category
  viewMode.value = 'list'
  selectedIntervention.value = null
}

// Watch for direct intervention selection
const showIntervention = (intervention) => {
  selectedIntervention.value = intervention
  viewMode.value = 'detail'
}

// Expose methods for parent component
defineExpose({
  showCategory,
  showIntervention
})
</script>

<style scoped>
.intervention-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 2px solid #e0e0e0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-height: 50vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto 1fr;
}

.toolbar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.toolbar-header h3 {
  margin: 0;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-icon {
  font-size: 24px;
}

.close-btn, .back-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover, .back-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

/* List View Styles */
.toolbar-list-view {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.interventions-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  padding: 24px;
  overflow-y: auto;
}

.intervention-card {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.intervention-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.card-header h4 {
  margin: 0;
  font-size: 16px;
  flex: 1;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.status-working {
  background: #d4edda;
  color: #155724;
}

.status-experimental {
  background: #fff3cd;
  color: #856404;
}

.status-no-effect {
  background: #f8d7da;
  color: #721c24;
}

.status-pending {
  background: #e2e3e5;
  color: #383d41;
}

.card-description {
  font-size: 14px;
  color: #666;
  margin: 8px 0;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  font-size: 12px;
}

.cycles-count {
  color: #666;
}

.view-details {
  color: #007bff;
  font-weight: 500;
}

/* Detail View Styles */
.toolbar-detail-view {
  display: grid;
  grid-template-rows: auto 1fr auto;
  overflow: hidden;
}

.detail-content-wrapper {
  overflow: hidden;
  min-height: 0; /* Important for grid overflow */
}

.detail-content {
  padding: 24px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100%;
  gap: 24px;
}

.detail-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.detail-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  text-transform: uppercase;
  color: #666;
}

.status-info {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.biomarkers-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.biomarker-tag {
  background: #e9ecef;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
}

.cycles-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cycle-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 4px;
}

.no-cycles {
  color: #666;
  font-style: italic;
}

.detail-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  padding: 16px 24px;
  background: #f8f9fa;
  border-top: 1px solid #e0e0e0;
}

.action-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f8f9fa;
}

.action-btn.primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.action-btn.primary:hover {
  background: #0056b3;
}

.action-btn.danger {
  color: #dc3545;
  border-color: #dc3545;
}

.action-btn.danger:hover {
  background: #dc3545;
  color: white;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

/* Responsive */
@media (max-width: 768px) {
  .interventions-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-content {
    grid-template-columns: 1fr;
  }
}
</style>