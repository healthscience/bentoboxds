<template>
  <div id="aiagents-lists">
    <div class="list-space" id="agent-list">
      <div class="ai-agent-introduction">
        beebee orchestrates and learns from AI agents.
      </div>
      <div id="evolutionary-agent" class="agent-header">Evolutionary</div>
      <div class="ai-agent-list" v-for="agent of agentList">
        <div class="agent-name">{{ agent.name }} </div>
        <div class="agent-description">Evolutionary Learning Agent</div>
        <div class="agent-active" v-bind:class="{ active: agent.active }">
          <div v-if="agent.loading === true">
            <div class="loading-agent blink_me">Loading</div>
          </div>
          <div id="status-agent  blink_me">Status: {{ agent.active }}</div>
          <button v-if="agent.active === false" id="start-agent-learn" @click="startAgentlearn(agent.name, 'start')">Begin</button>
          <button v-else="agent.active === true" id="start-agent-learn" @click="startAgentlearn(agent.name, 'stop')">Stop</button>
          <div class="onstart-agent">
            Load on start:<input type="checkbox" v-model="agent.onstart" :id="agent.onstart"/>
          </div>
        </div>
      </div>
    </div>
    <div class="llm-model-agent">
      <div id="llm-models" class="agent-header">Large Language Model</div>
      <div class="ai-agent-list">
        <div class="agent-name">
          {{ defaultLLM.model }}
          <button id="change-default-model" @click="updateDefaultModel()">Change</button>
        </div>
        <div class="agent-description">Chat agent</div>
        <div class="agent-active" v-bind:class="{ active: defaultLLM.active }">
          <div v-if="defaultLLM.loading === true">
            <div class="loading-agent blink_me">Loading</div>
          </div>
          <div id="status-agent  blink_me">Status: {{ defaultLLM.active }}</div>
          <button v-if="defaultLLM.active === false" id="start-agent-learn" @click="startAgentlearn(defaultLLM.model, 'start')">Begin</button>
          <button v-else="defaultLLM.active === true" id="start-agent-learn" @click="startAgentlearn(defaultLLM.model, 'stop')">Stop</button>
          <div class="onstart-agent">
            Load on start:<input type="checkbox" v-model="defaultLLM.onstart" :id="defaultLLM.onstart"/>
          </div>
        </div>
      </div>
      <div id="select-default-model" v-if="changeLLM === true">
        <div id="select-new-model">
          <div class="agent-description">LLM models available:</div>
          <div class="model-chosen-custom">
            <select v-model="modelInfo">
              <option v-for="model of LLMsAvailable"  :value="model">{{ model.model }}</option>
            </select>
          </div>
          <button id="change-default-model" @click="changeDefaultModel()">Set this model as default</button>
        </div>
        <div id="modal-description">
          <div id="model-description-summary">{{ modelInfo }}</div>
          <div id="model-install-info">
            Running a Large Language Model requires a relative new computer, with a GPU performace will be better.  Installing a model involves downloading a large file, which may take some time.
          </div>
        </div>
      </div>
    </div>
    <div class="select-agent-type">
      <div id="llm-models" class="agent-header">Time series</div>
      Coming soon
    </div>
    <div class="select-agent-type">
      <div id="llm-models" class="agent-header">Media</div>
      Coming soon
    </div>
    <div class="select-agent-type">
      <div id="llm-models" class="agent-header">Research</div>
      Coming soon
    </div>
    <div class="select-agent-type">
      <div id="llm-models" class="agent-header">Markers</div>
      Coming soon
    </div>
    <div class="select-agent-type">
      <div id="llm-models" class="agent-header">Product</div>
      Coming soon
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeAI = aiInterfaceStore()

  let defaultLLM = ref({
    agent: 'cale-gpt4all', active: false, loading: false, model: 'orca-mini-3b-gguf2-q4_0.gguf', onstart: true
  })
  let changeLLM = ref(false)
  let modelInfo = ref(defaultLLM)
  /* computed */
  const agentList = computed(() => {
    return storeAI.agentList
  })

  const LLMsAvailable = computed(() => {
    return storeAI.llmModelsList
  })

  /* methods */
  let startAgentlearn = (agentChoice, action) => {
    if (action === 'start') {
      // display loading animation
      for (let agent of storeAI.agentList) {
        if (agent.name === agentChoice) {
          agent.loading = true
        }
      }
      let learnMessage = {}
      learnMessage.type = 'bbai'
      learnMessage.reftype = 'ignore'
      learnMessage.action = 'learn-agent-start'
      learnMessage.data = { agent: modelInfo.value.agent, model: modelInfo.value.model}
      learnMessage.bbid = ''
      storeAI.sendMessageHOP(learnMessage)
    } else if (action === 'stop') {
      for (let agent of storeAI.agentList) {
        if (agent.name === 'cale-gpt4all') {
          agent.loading = false
        }
      }
      let learnMessage = {}
      learnMessage.type = 'bbai'
      learnMessage.reftype = 'ignore'
      learnMessage.action = 'learn-agent-stop'
      learnMessage.data = { agent: modelInfo.value.agent, model: modelInfo.value.model }
      learnMessage.bbid = ''
      storeAI.sendMessageHOP(learnMessage)
    }
  }

  const changeDefaultModel = () => {
    changeLLM.value = !changeLLM.value 
  }

  const updateDefaultModel = () => {
    changeLLM.value = !changeLLM.value
    defaultLLM.value = { name: modelInfo.value.name, active: false, loading: false, model: modelInfo.value.model, onstart: true}
  }


</script>

<style scoped>
#agents-lists {
  display: block;
  height: auto;
}

.select-agent-type {
  display: grid;
  grid-template-columns: 1fr;
  margin: .6em;
  border-bottom: 1px solid lightgrey;
}

.agent-header {
  font-weight: bold;
}

#select-default-model {
  display: grid;
  grid-template-columns: 1fr;
  width: 80%;
  padding-left: 2em;
  border-bottom: 1px solid lightgrey;
  padding-bottom: 1em;
}

#modal-description {
  border: 1px solid lightgrey;
  width: 80%;
  padding: 1em;
  margin: 1em;
}

#model-description-summary {
  padding-top: 1em;
}

.active {
  background-color: green;
}
@media (min-width: 1024px) {

  .ai-agent-introduction {
    width: 80%;
    text-wrap: wrap;
    padding: 2em;
  }

  .ai-agent-list {
    display: grid;
    width: 90%;
    grid-template-columns: 2fr 2fr 1fr;
    border-bottom: 1px solid lightgrey;
    margin-bottom: 1em;
    padding-left: 1em;
  }

  .active {
    background-color: green;
    color: white;
    font-weight: bold;
  }

  .blink_me {
    animation: blinker 2s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
}

</style>
