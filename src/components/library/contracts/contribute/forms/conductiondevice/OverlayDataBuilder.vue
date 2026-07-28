<template>
  <div class="conduction-mapper">
    <div class="workspace">
      
      <!-- Left: The Visual Structure -->
      <div class="tree-pane">
        <h4>Extracted Device Structure</h4>
        <p class="hint" v-if="focusedAnnotationTarget">
          Click a node below to assign it to <strong>{{ focusedAnnotationTarget }}</strong>.
        </p>
        <p class="hint" v-else>
          Select a field on the right to manually annotate its path.
        </p>
        
        <ul class="tree-root">
          <TreeNode 
            :node="extractedData" 
            path="" 
            :selectedPath="activeMapping[focusedAnnotationTarget]"
            @select-root="handleNodeSelected" 
          />
        </ul>
      </div>

      <!-- Right: The Suggested/Editable Mapping -->
      <div class="annotation-pane">
        <h4>Conduction Rule Mapping</h4>
        <p class="hint">Review the auto-extracted suggestions for this gifted device.</p>
        
        <div class="mapping-fields">
          <div 
            class="field-row" 
            :class="{ active: focusedAnnotationTarget === 'primaryDataPath' }"
            @click="setFocus('primaryDataPath')"
          >
            <label>Primary Data Path</label>
            <input v-model="activeMapping.primaryDataPath" type="text" placeholder="e.g., payload.data" />
          </div>

          <div 
            class="field-row" 
            :class="{ active: focusedAnnotationTarget === 'timeAnchorPath' }"
            @click="setFocus('timeAnchorPath')"
          >
            <label>Time Anchor Path</label>
            <input v-model="activeMapping.timeAnchorPath" type="text" placeholder="e.g., meta.timestamp" />
          </div>

          <div 
            class="field-row" 
            :class="{ active: focusedAnnotationTarget === 'valuePath' }"
            @click="setFocus('valuePath')"
          >
            <label>Value Path</label>
            <input v-model="activeMapping.valuePath" type="text" placeholder="e.g., payload.reading" />
          </div>
        </div>

        <div class="action-row">
          <button class="accept-btn" @click="acceptMapping">
            Accept & Mint Rule
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import TreeNode from './TreeNode.vue'

const props = defineProps({
  // The pre-extracted JSON structure passed down from safeflow-ecs
  extractedData: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['mapping-accepted'])

// The working contract that the peer is annotating
const activeMapping = reactive({
  deviceClass: 'tiny-conduction-node',
  primaryDataPath: '',
  timeAnchorPath: '',
  valuePath: ''
})

// Tracks which field the peer is currently trying to assign via the tree
const focusedAnnotationTarget = ref(null)

// Zero-Draft Mode: Auto-extract structure and suggest a mapping
const autoSuggestMapping = (data) => {
  // Basic heuristic to guess the paths - easily expanded for the orrery's needs
  const flatKeys = JSON.stringify(data).toLowerCase()
  
  activeMapping.primaryDataPath = flatKeys.includes('payload') ? 'payload' : 'data'
  
  if (flatKeys.includes('timestamp') || flatKeys.includes('time')) {
    activeMapping.timeAnchorPath = 'timestamp'
  }
  
  if (flatKeys.includes('value') || flatKeys.includes('reading')) {
    activeMapping.valuePath = 'value'
  }
}

watch(() => props.extractedData, (newData) => {
  if (newData) {
    autoSuggestMapping(newData)
  }
}, { immediate: true })

// When a peer clicks a field in the contract to edit it
const setFocus = (field) => {
  focusedAnnotationTarget.value = field
}

// When a peer clicks a node in the tree to assign a path to the focused field
const handleNodeSelected = (path) => {
  if (focusedAnnotationTarget.value) {
    activeMapping[focusedAnnotationTarget.value] = path
    focusedAnnotationTarget.value = null // drop focus after assignment
  }
}

const acceptMapping = () => {
  // Passes the finalized mapping forward into the Story -> Interplay -> Emulation pipeline
  emit('mapping-accepted', { ...activeMapping })
}
</script>

<style scoped>
.conduction-mapper {
  font-family: monospace;
}
.workspace {
  display: flex;
  gap: 2rem;
}
.tree-pane, .annotation-pane {
  flex: 1;
  border: 1px solid #444;
  padding: 1.5rem;
  background: #181818;
  color: #ddd;
  border-radius: 6px;
}
.hint {
  color: #88a;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}
.tree-root {
  list-style-type: none;
  padding-left: 0;
  max-height: 400px;
  overflow-y: auto;
}
.mapping-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}
.field-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  border: 1px solid #333;
  border-radius: 4px;
  cursor: pointer;
  background: #222;
  transition: all 0.2s ease;
}
.field-row:hover {
  border-color: #555;
}
.field-row.active {
  border-color: #74c7ec;
  background: #1a2b3c;
  box-shadow: 0 0 8px rgba(116, 199, 236, 0.2);
}
.field-row label {
  font-size: 0.85rem;
  color: #aaa;
  pointer-events: none;
}
.field-row input {
  background: transparent;
  border: none;
  color: #fff;
  font-family: monospace;
  font-size: 1rem;
  outline: none;
}
.action-row {
  display: flex;
  justify-content: flex-end;
}
.accept-btn {
  background: #4e9a06;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-family: monospace;
  border-radius: 4px;
  font-size: 1rem;
}
.accept-btn:hover {
  background: #5cac08;
}
</style>