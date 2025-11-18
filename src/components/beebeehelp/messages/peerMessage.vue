<template>
  <div class="peer-ask">ppp--
    <img class="left-chat-peer" src="../../../assets/peerlogo.png" alt="Avatar">
    <div v-if="message" class="peer-message-container">
      <div class="peer-message-bubble">
        <p>{{ message }}</p>
        <div v-if="tools && tools.length > 0" class="tools-used">
          <span v-for="tool in tools" :key="tool" class="tool-tag">@{{ tool }}</span>
        </div>
      </div>
      <div class="peer-message-time">{{ formattedTime }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: Object,
  tools: {
    type: Array,
    default: () => []
  }
})


console.log(' peer  Message props:', props) // Add this line


const formattedTime = computed(() => {
  if (props.message.time) {
    const date = new Date(props.message.data.time)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return ''
})
</script>

<style scoped>
.peer-ask {
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
  background-color: pink;
  border-radius: 25px;
  width: 80%;
}

.left-chat-peer {
  width: 50px;
}

.peer-message-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: .8em;
}

.peer-message-bubble {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border-radius: 18px 18px 18px 0;
  max-width: 70%;
  word-wrap: break-word;
  margin-bottom: 2px;
}

.peer-message-time {
  font-size: 0.7em;
  color: #6c757d;
  margin-left: 5px;
}

.tools-used {
  margin-top: 5px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.tool-tag {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 5px;
  border-radius: 3px;
  font-size: 0.8em;
}
</style>