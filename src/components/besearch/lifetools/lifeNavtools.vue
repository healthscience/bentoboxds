<template>
  <div id="life-tools-nav">
    Life tools
    <div id="mode-selector">
      <h3>Modes</h3>
      <div class="mode-buttons">
        <button class="mode-button" @click="selectMode('cues')">
          <span class="mode-icon"></span>
          <span>Cues</span>
        </button>
        <button class="mode-button" @click="selectMode('body')">
          <span class="mode-icon">🧠</span>
          <span>Body</span>
        </button>
        <button class="mode-button" @click="selectMode('earth')">
          <span class="mode-icon">🌍</span>
          <span>Earth</span>
        </button>
      </div>
    </div>
  <div id="time-cycles">
    <button id="besearch-cycles-time" @click="besearchTime()">time</button>
    <div id="cycle-periods" v-if="btoolsTime === true">
      <div class="cycle-period">1 day</div>
      <div class="cycle-period">1 week</div>
      <div class="cycle-period">1 month</div>
      <div class="cycle-period">3 months</div>
      <div class="cycle-period">1 year</div>
  </div>
  </div>
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue'

const emit = defineEmits(['mode-selected'])

let btoolsTime = ref(false)
let selectedMode = ref('cues') 

/** methods */
const besearchTime = () => {
  btoolsTime.value = !btoolsTime.value
}

const selectMode = (mode) => {
  selectedMode.value = mode
  // Emit event to parent component to update canvas
  emit('mode-selected', mode)
}

</script>

<style scoped>
@media (min-width: 1024px) {
  #life-tools-nav {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  #mode-selector {
    margin-bottom: 1rem;
  }

  .mode-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .mode-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 10px;
    font-size: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .mode-button:hover {
    background-color: #9fb8d4;
  }

  .mode-icon {
    font-size: 24px;
    margin-bottom: 5px;
  }

  #time-cycles {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  #besearch-cycles-time {
    display: inline-grid;
    height: 28px;
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  #cycle-periods {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;
    margin-bottom: 1em;
  }

  .cycle-period {
    display: inline-grid;
    height: 28px;
    background-color: #b8cde2;
    color: #140d6b;
    border: none;
    border-radius: 4px;
    padding: 10px 20px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
}

</style>