<template>
  <div class="authoring-workspace">
    <header class="author-header">
      <h6>Author New Orgo Seed</h6>
      <button class="close-btn" @click="cancelAuthoring">✕</button>
    </header>

    <div class="author-form">
      <!-- CONCEPT IDENTITY SECTION -->
      <div class="form-group-header">Concept Identity</div>
      
      <div class="form-section">
        <label>ID</label>
        <input v-model="newSeed.concept.id" type="text" placeholder="e.g., appendage_left_arm_01" />
      </div>

      <div class="form-section">
        <label>Name</label>
        <input v-model="newSeed.concept.name" type="text" placeholder="e.g., Left Arm Structure" />
      </div>

      <div class="form-grid-row">
        <div class="form-section">
          <label>Icon</label>
          <input v-model="newSeed.concept.icon" type="text" placeholder="🦾" class="center-text" />
        </div>
        <div class="form-section">
          <label>Type</label>
          <input v-model="newSeed.concept.type" type="text" placeholder="structural_appendage" />
        </div>
      </div>

      <!-- RELATIONSHIP ANCHORS SECTION -->
      <div class="form-group-header">Relationship Anchors</div>

      <div class="form-section">
        <label>Parent Orgo ID</label>
        <input v-model="newSeed.concept.anchors.parentOrgoId" type="text" placeholder="e.g., root_torso_01" />
      </div>

      <div class="form-grid-row">
        <div class="form-section">
          <label>Socket</label>
          <input v-model="newSeed.concept.anchors.connectionPoint" type="text" placeholder="e.g., left_shoulder" />
        </div>
        <div class="form-section">
          <label>Coupling</label>
          <input v-model="newSeed.concept.anchors.coupling" type="text" placeholder="e.g., ball_and_socket" />
        </div>
      </div>

      <!-- COMPUTATIONAL SYSTEM SECTION -->
      <div class="form-group-header">Computational Properties</div>

      <div class="form-section">
        <label>Instance ID</label>
        <input v-model="newSeed.computational.instanceId" type="text" placeholder="e.g., orgo_inst_left_arm_88x" />
      </div>

      <div class="form-grid-row triple">
        <div class="form-section">
          <label>DOF</label>
          <input v-model.number="newSeed.computational.kinematics.degreesOfFreedom" type="number" min="0" max="6" />
        </div>
        <div class="form-section">
          <label>Flexion Limit</label>
          <input v-model.number="newSeed.computational.kinematics.flexionLimit" type="number" />
        </div>
        <div class="form-section">
          <label>Extension</label>
          <input v-model.number="newSeed.computational.kinematics.extensionLimit" type="number" />
        </div>
      </div>

      <div class="form-grid-row">
        <div class="form-section">
          <label>Idle Energy</label>
          <input v-model.number="newSeed.computational.energyCost.idle" type="number" step="0.1" />
        </div>
        <div class="form-section">
          <label>Active Energy</label>
          <input v-model.number="newSeed.computational.energyCost.active" type="number" step="0.1" />
        </div>
      </div>

      <button class="sculpt-btn primary small full-width" @click="saveCreatedSeed">
        Confirm
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emit = defineEmits(["close", "save"]);

const getCleanContractState = () => ({
  refcontract: 'orgo',
  concept: {
    id: '',
    name: '',
    icon: '🦾',
    type: 'structural_appendage',
    anchors: {
      parentOrgoId: '',
      connectionPoint: '',
      coupling: 'ball_and_socket'
    }
  },
  computational: {
    instanceId: '',
    kinematics: {
      degreesOfFreedom: 3,
      flexionLimit: 180,
      extensionLimit: 45,
      currentAngle: { x: 0, y: 0, z: 0 }
    },
    energyCost: {
      idle: 1.2,
      active: 8.5
    }
  }
});

const newSeed = ref(getCleanContractState());

const cancelAuthoring = () => {
  emit("close");
  resetForm();
};

const resetForm = () => {
  newSeed.value = getCleanContractState();
};

const saveCreatedSeed = () => {
  if (!newSeed.value.concept.id.trim()) {
    return alert('Unique ID required');
  }
  if (!newSeed.value.concept.name.trim()) {
    return alert('Seed identity name required');
  }
  
  // Clone the raw contract state deeply to avoid reactive mutations in the backing Hyperbee store
  emit("save", JSON.parse(JSON.stringify(newSeed.value)));
  resetForm();
};
</script>

<style scoped>
  .authoring-workspace {
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 15px;
    margin: 15px 0;
    display: grid;
    gap: 12px;
  }

  .dark-theme .authoring-workspace {
    background: rgba(255, 255, 255, 0.02);
    border-color: rgba(255, 255, 255, 0.08);
  }

  .author-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }

  .form-group-header {
    font-family: "Space Mono", monospace;
    font-size: 0.7rem;
    font-weight: bold;
    text-transform: uppercase;
    opacity: 0.9;
    margin: 14px 0 6px 0;
    padding-bottom: 2px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  .dark-theme .form-group-header {
    border-bottom-color: rgba(255, 255, 255, 0.05);
  }

  .form-grid-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .form-grid-row.triple {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .center-text {
    text-align: center;
  }

  .author-form label {
    font-family: "Space Mono", monospace;
    font-size: 0.65rem;
    text-transform: uppercase;
    opacity: 0.7;
    margin-top: 8px;
    display: block;
  }

  .author-form input, .author-form textarea {
    width: 100%;
    background: white;
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 8px;
    border-radius: 6px;
    font-size: 0.8rem;
    margin-bottom: 5px;
    color: inherit;
  }

  .dark-theme .author-form input, .dark-theme .author-form textarea {
    background: rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .seed-item.manageable {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: center;
  }

  .seed-click-zone {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 12px;
    cursor: grab;
  }

  .seed-mgmt-actions {
    display: flex;
    gap: 4px;
  }

  .mgmt-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px 6px;
    font-size: 0.75rem;
    opacity: 0.4;
    transition: opacity 0.2s, color 0.2s;
  }

  .mgmt-btn:hover {
    opacity: 1;
  }

  .mgmt-btn.delete:hover {
    color: #ef5350;
  }

  .full-width {
    width: 100%;
    margin-top: 10px;
  }
</style>