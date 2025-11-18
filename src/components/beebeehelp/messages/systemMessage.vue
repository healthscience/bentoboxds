<template>
  <div class="system-message-container">
    <div class="system-message-content">
      <p>{{ message }}</p>
    </div>
    <div class="system-message-time">{{ formattedTime }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: () => new Date()
  }
})

const formattedTime = computed(() => {
  return props.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>

<style scoped>
.system-message-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.system-message-content {
  background-color: #e9ecef;
  color: #495057;
  padding: 5px 10px;
  border-radius: 12px;
  max-width: 80%;
  word-wrap: break-word;
  font-size: 0.8em;
}

.system-message-time {
  font-size: 0.6em;
  color: #6c757d;
  margin-top: 2px;
}
</style>