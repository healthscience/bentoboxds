<template>
  <div id="inprogress-view" v-if="progressMessage">
    <section v-if="progressMessage.active === true" id="safeflow-status">
      --- {{ progressMessage.text }} --
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

  /* computed */
  const progressMessage = computed(() => {
    return true
  })
</script>

<style>
#safeflow-status {
  width: 540px;
  height: 30px;
  background-color: pink;
  /*-webkit-animation-name: example; /* Safari 4.0 - 8.0 */
  /*-webkit-animation-duration: 12s; /* Safari 4.0 - 8.0 */
  /*animation-name: example;
  animation-duration: 12s;*/
  animation: example 1s linear infinite;
}

/* Safari 4.0 - 8.0 */
@-webkit-keyframes example {
  from {background-color: red;}
  to {background-color: yellow;}
}

/* Standard syntax */
@keyframes example {
  from {background-color: pink;}
  to {background-color: yellow;}
}
</style>