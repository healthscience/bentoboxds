<template>
  <div id="space-shaper" >
    <div class="beebee-space">
      <div class="bentospace">
        space
      </div>
    </div>
  </div>
    <div class="beebee-home">
      <beebee-chat></beebee-chat>
    </div>
  <div class="beebee-welcome">
    <div id="message-question">What can you do?</div>
    <div id="bb-features">
      <div class="message-bb">Ask</div>
      <div class="message-bb">Chart</div>
      <div class="message-bb">Share</div>
    </div>
  </div>
</template>

<script setup>
  import BeebeeChat from '@/components/beebeehelp/chatInterface.vue'
</script>

<style scoped>
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
  height: 100%;
  width: 100%;
  padding-top: 2px;
  margin: auto;
  transform-origin: left top;
  border: 1px solid orange;
  background-color: #fff4f4;
  background: linear-gradient(-90deg, rgba(0, 0, 0, .1) 1px, transparent 1px), linear-gradient(rgba(0, 0, 0, .1) 1px, transparent 1px);
  background-size: 60px 60px, 60px 60px;
  border:1px green;
}

.beebee-home {
  position: fixed;
  top: 280px;
  left: 18px;
  z-index: 2;
  border: 2px dashed red;
  width: 640px;
}

.beebee-welcome {
  position: fixed;
  top: 340px;
  left: 14px;
  z-index: 2;
  border: 1px dashed blue;
  width: 80%;
}

#bb-features {
  display: grid;
  grid-template-columns: 1fr;
}

.message-bb {
  border: 1px solid purple;
}

  @media (min-width: 1024px) {
    .space-shaper {
      position: static;
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

    .beebee-home {
      position: fixed;
      top: 180px;
      left: 180px;
      z-index: 2;
      border: 2px dashed red;
      width: 640px;
    }

    .beebee-welcome {
      position: fixed;
      top: 240px;
      left: 140px;
      z-index: 2;
      border: 1px dashed blue;
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
      border: 1px solid purple;
    }
  }
</style>