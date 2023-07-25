<template>
  <div id="beebee-shaper">
    <div class="bento-history">
      <div class="">
        Questions
      </div>
      <div class="">
        Spaces
      </div>
    </div>
    <div class="bentospace">
      <div class="beebee-home">
        <beebee-chat></beebee-chat>
       </div>
    </div>
  </div>
</template>

<script setup>
import BeebeeChat from '@/components/beebeehelp/chatInterface.vue'
// import BentoBox from '@/components/bentobox/baseBox.vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'
import { ref } from 'vue'

const storeAI = aiInterfaceStore()

const startChat = ref(true)


</script>

<style scoped>
#beebee-shaper {
  width: 90vw;
  border: 0px dashed green;
}

.bentospace {
  display: grid;
  grid-template-columns: 1fr;
  border: 2px solid green;
  height: 90vh;
  padding-top: 2px;
  margin: auto;
  transform-origin: left top;
  border: 1px solid orange;
  background-color: #fff4f4;
  background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px;
  border:1px green;
}

#bb-features {
  display: grid;
  grid-template-columns: 1fr;
}

.message-bb {
  border: 0px solid purple;
}

.beebee-home {
  display: grid;
  border: 0px dashed red;
}
  @media (min-width: 1024px) {

    #beebee-shaper {
      display: grid;
      grid-template-columns: 1fr 7fr;
      border: 2px dashed green;
    }

    .bento-history {
      border: 3px solid red;
      display: grid;
      grid-template-columns: 1fr;
      margin-top: 8.5em;
    }

    .bentospace {
      display: grid;
      grid-template-columns: 1fr;
      border: 2px solid green;
      height: 80vh;
      width: 100%;
      margin-top: 8.5em;
      transform-origin: left top;
      border: 1px solid orange;
      background-color: #fff4f4;
      background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
      background-size: 60px 60px, 60px 60px;
    }

    #message-question {
      text-align: center;
    }

    #bb-features {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
    }

    .message-bb {
      border: 0px solid purple;
    }
    .beebee-home {
      display: grid;
      grid-template-columns: 1fr;
      border: 3px dashed rgb(24, 207, 21);
    }
  }
</style>