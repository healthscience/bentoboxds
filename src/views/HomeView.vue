<template>
  <div id="space-shaper">
    <div class="bentospace">
      <bento-box></bento-box>
    </div>
  </div>
  <div class="beebee-welcome">
    <div id="message-question">What can you do?</div>
    <div id="bb-features">
      <div class="message-bb">Ask</div>
      <div class="message-bb">Chart</div>
      <div class="message-bb">Share</div>
    </div>
  </div>
  <div class="beebee-home">
    <beebee-chat></beebee-chat>
  </div>
</template>

<script setup>
  import BeebeeChat from '@/components/beebeehelp/chatInterface.vue'
  import BentoBox from '@/components/bentobox/baseBox.vue'
</script>

<style scoped>
#space-shaper {
  width: 90vw;
  border: 0px dashed green;
}

.beebee-space {
  height: 92vh;
  width: 92vw;
  overflow: scroll;
  border: 0px dashed blue;
}

.bentospace {
  display: grid;
  grid-template-columns: 1fr;
  border: 2px solid green;
  height: 98vh;
  width: 98vw;
  padding-top: 2px;
  margin: auto;
  transform-origin: left top;
  border: 1px solid orange;
  background-color: #fff4f4;
  background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px;
  border:1px green;
}

.beebee-welcome {
  position: fixed;
  top: 80%;
  left: 14px;
  z-index: 2;
  border: 0px dashed blue;
  width: 80%;
}

#bb-features {
  display: grid;
  grid-template-columns: 1fr;
}

.message-bb {
  border: 0px solid purple;
}

.beebee-home {
  position: fixed;
  top:30%;
  left: 50%;
  transform: translate(-50%, 50%);
  z-index: 2;
  border: 0px dashed red;
}
  @media (min-width: 1024px) {
    #space-shaper {
      border: 0px dashed green;
    }

    .beebee-space {
      height: 90vh;
      width: 90vw;
      overflow: hidden;
      border: 0px dashed blue;
    }

    .bentospace {
      display: grid;
      grid-template-columns: 1fr;
      border: 2px solid green;
      height: 900vh;
      width: 900vw;
      padding-top: 60px;
      margin: auto;
      transform-origin: left top;
      border: 1px solid orange;
      background-color: #fff4f4;
      background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
      background-size: 60px 60px, 60px 60px;
    }

    .beebee-welcome {
      position: fixed;
      top: 80vh;
      left: 140px;
      z-index: 2;
      border: 0px dashed blue;
      width: 80%;
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
      position: fixed;
      top: 30%;
      left: 50%;
      transform: translate(-50%, 50%);
      z-index: 2;
      border: 0px dashed rgb(27, 23, 130);
    }
  }
</style>