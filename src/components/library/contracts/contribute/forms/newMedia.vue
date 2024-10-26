<template>
  <div id="bento-media">
    <div id="bento-media-video">
      <form id="add-video-form" @submit.prevent="videoAdd()">
        <label for="video"></label>
        <input type="input" id="video-add" name="video" placeholder="add video url" v-model="storeLibrary.videoURLadd" autofocus>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  /* methods */

</script>

<style scoped>


  @media (min-width: 1024px) {


  }
  
</style>
