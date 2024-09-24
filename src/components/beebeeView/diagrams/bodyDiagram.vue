<template>
  <div id="body-diagram-parts">
    Body please
    <!--<img class="right-display-menu" src="@/assets/human-diagram.png" alt="human body">-->
    <canvas id="body-canvas" ref="bodycanvas" @click="bodypartSelect($event)"></canvas>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import picBody from '@/assets/human-diagram.png'

  let bodycanvas = ref(null)

  /* on mount */
  onMounted(() => {
    drawBodyImage()
  })


  const drawBodyImage = () => {
    let canvas = document.getElementById('body-canvas')
    console.log(canvas)
    let ctx = canvas.getContext("2d")
    const image = new Image()
    let imageD = picBody
    image.src = imageD // 'https://www.bentoboxds.org/assets/logo-CQ0an4it.png'
    image.onload = () => {
       // ctx.drawImage(image, 0, 0, image.width * .1, image.height * .5)
    }
  }

  const bodypartSelect = (ev) => {
    console.log(ev)
  }

</script>


<style scoped>

  #body-canvas {
    width: 400px;
    height: 800px;
    border: 2px solid blue;
    background-image: url("@/assets/human-diagram.png");
    background-repeat: no-repeat;
  }


</style>