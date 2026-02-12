<template>
  <toolbar-main></toolbar-main>
  <data-box></data-box>
  <router-view/>
</template>

<script setup>
import ToolbarMain from '@/components/toolbars/mainTools.vue'
import DataBox from '@/components/dataspace/dataBox.vue'
import { RouterView } from 'vue-router'
import { useSocketStore } from '@/stores/socket.js'

  const storeWebsocket = useSocketStore()
  storeWebsocket.init_chat()

</script>

<style scoped>
  /* Ensure the root doesn't allow scrolling */
  html, body {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden; 
  }
</style>
