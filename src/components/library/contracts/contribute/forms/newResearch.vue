<template>
  <div id="bento-research">
    <form id="add-research-form" @submit.prevent="researchAdd()">
      <label for="research"></label>
      <input type="input" id="research-add" name="research" placeholder="add research url" v-model="storeLibrary.researchURLadd" autofocus>
    </form>
  </div>
</template>

<script setup>
import { libraryStore } from '@/stores/libraryStore.js'

const storeLibrary = libraryStore()

</script>

<style scoped>


  @media (min-width: 1024px) {


  }
  
</style>
