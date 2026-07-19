<template>
  <div class="orgo-contract-author">
    <header class="author-header">
      <h6>Orgo Reference Contract: {{ activeCue }}</h6>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </header>

    <div class="author-form">
      <!-- cue -->
      <div class="form-section">
        <div id="orgo-cues-tools">
          <label>Cue</label>
          <button class="cues-toggle-btn" @click.prevent="$emit('toggle-cues')">Cues</button>
        </div>
        <div class="cue-input-wrapper">
          <input v-model="newSeed.cue" type="text" placeholder="e.g., Central Torso Core" @drop.prevent="onDropCue" @dragover.prevent />

        </div>
      </div>
      <!-- DYNAMIC METRIC REGISTRY -->
      <div class="form-group-header">Computational Metric Registry</div>
      <p class="meta-note">Define metrics by cue (e.g., #Flexion). Logic & meaning are bound to each.</p>

      <div v-for="(metric, index) in metrics" :key="index" class="metric-row">
        <div class="form-grid-row">
          <input v-model="metric.cue" placeholder="Cue (e.g., #Flexion)" class="cue-input" @drop.prevent="onDropMetricCue($event, index)" @dragover.prevent />
          <input v-model.number="metric.value" type="number" placeholder="Value" />
        </div>
        <textarea v-model="metric.meaning" placeholder="Meaning / Rule explanation..." class="meaning-input"></textarea>
        <textarea v-model="metric.driver" placeholder="JS Logic for this metric..." class="code-input"></textarea>
      </div>

      <button class="add-metric-btn" @click="addMetric">+ Add Metric Cue</button>

      <button class="commit-btn" @click="commitContract">COMMIT TO HOP LIBRARY</button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  incomingCue: {
    type: String,
    default: ""
  }
});

const activeCue = ref("#torso");
const metrics = ref([]);
let newSeed = ref({ cue: '', metrics: []})

watch(() => props.incomingCue, (newVal) => {
  if (newVal) {
    newSeed.value.cue = newVal;
  }
});

const onDropCue = (e) => {
  const cueStr = e.dataTransfer.getData("application/besearch-cue");
  if (cueStr) {
    newSeed.value.cue = cueStr;
  }
};

const onDropMetricCue = (e, index) => {
  const cueStr = e.dataTransfer.getData("application/besearch-cue");
  if (cueStr && metrics.value[index]) {
    metrics.value[index].cue = cueStr;
  }
};

const addMetric = () => {
  metrics.value.push({ cue: '', value: 0, meaning: '', driver: '' });
};

const commitContract = () => {
  const contract = {
    refcontract: 'orgo',
    cue: activeCue.value,
    metrics: metrics.value.map(m => ({
      ...m,
      hash: btoa(m.driver) // Basic proof-of-code placeholder
    }))
  };
  emit("save", contract);
};


const emit = defineEmits(["close", "save", "toggle-cues"]);

const getCleanContractState = () => ({
  refcontract: 'orgo',
  concept: {
    id: 'core_torso_01',
    name: 'Central Torso Core',
    icon: '👤',
    type: 'structural_torso',
    anchors: {
      parentOrgoId: 'self',
      connectionPoint: 'ground_coherence_base',
      coupling: 'rigid_graft'
    }
  },
  // The local dictionary that explains the metrics to any peer or SafeFlow engine
  semanticCues: {
    torsoLength: {
      tag: '#torsoLength',
      value: 1.20,
      meaning: 'Defines the absolute skeletal distance in meters along the Y-axis. Used by adjacent limb Orgos to compute cumulative height standing tall.'
    },
    weightRatio: {
      tag: '#torsoMassFraction',
      value: 0.48,
      meaning: 'Represents the torso mass as a fractional percentage of total peer body weight (0.48 = 48%). Influences ResonAgent balance calculations.'
    }
  },
  computational: {
    instanceId: 'orgo_inst_torso_01',
    kinematics: {
      degreesOfFreedom: 1, // Torso core is rigid, perhaps only allowing minor sway
      flexionLimit: 15,
      extensionLimit: 15,
      currentAngle: { x: 0, y: 0, z: 0 }
    },
    energyCost: {
      idle: 0.5,
      active: 2.0
    },
    // SafeFlow-ECS can evaluate this string using local sandbox isolation
    driverCode: `/**\n * Torso Kinematics Driver\n */\nexport function update(state, dt) {\n  // Calculates basic torso mechanical sway\n  if (state.swayActive) {\n    state.angle.z = Math.sin(Date.now() * 0.001) * 0.1;\n  }\n}`
  }
});

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
.orgo-contract-author { padding: 15px; border: 1px solid #ccc; border-radius: 8px; }
.form-group-header { font-weight: bold; margin: 10px 0; border-bottom: 1px solid #eee; }
.cue-input-wrapper { display: grid; grid-template-columns: 1fr auto; gap: 8px; align-items: stretch; margin-bottom: 5px; }

.cues-toggle-btn {
   padding: 8px 12px; background: rgba(0, 0, 0, 0.05); border: 1px solid rgba(0, 0, 0, 0.1); border-radius: 6px; font-size: 0.75rem; font-family: "Space Mono", monospace; cursor: pointer; transition: all 0.2s; }

.cues-toggle-btn:hover { background: rgba(0, 0, 0, 0.1); }

.dark-theme .cues-toggle-btn { background: rgba(255, 255, 255, 0.05); border-color: rgba(255, 255, 255, 0.1); color: #fff; }

.dark-theme .cues-toggle-btn:hover { background: rgba(255, 255, 255, 0.1); }

.metric-row { border: 1px solid #ddd; padding: 10px; margin-bottom: 10px; border-radius: 4px; }
.cue-input { font-family: monospace; }
.meaning-input, .code-input { width: 100%; height: 50px; margin-top: 5px; font-family: monospace; }
.commit-btn { width: 100%; margin-top: 20px; padding: 10px; background: #000; color: #fff; }


  .authoring-workspace {
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    padding: 15px;
    margin: 15px 0;
    display: grid;
    width: 100%;
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

  #orgo-cues-tools {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .section-explanation {
    font-size: 0.75rem;
    opacity: 0.65;
    margin-top: -4px;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  .cue-definition-block {
    background: rgba(0, 0, 0, 0.01);
    border: 1px dashed rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 8px;
  }

  .dark-theme .cue-definition-block {
    background: rgba(255, 255, 255, 0.01);
    border-color: rgba(255, 255, 255, 0.1);
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

  .author-form textarea {
    height: 60px;
    resize: vertical;
  }

  .author-form textarea.code-editor {
    font-family: "Space Mono", monospace;
    height: 120px;
    font-size: 0.75rem;
    background: #1e1e1e;
    color: #a9b7c6;
    border-color: #2b2b2b;
  }

  .full-width {
    width: 100%;
    margin-top: 10px;
  }
</style>