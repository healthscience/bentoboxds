<template>
  <div id="bento-marker">
    <form id="add-marker-form" @submit.prevent="markerAdd()">
      <label for="marker"></label>
      <input type="input" id="research-add" name="research" placeholder="add marker" v-model="storeLibrary.markerURLadd" autofocus>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

const storeLibrary = libraryStore()

</script>

<style scoped>


  @media (min-width: 1024px) {


  }
  
</style>
