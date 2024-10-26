<template>
  <div id="bento-product">
    <form id="add-product-form" @submit.prevent="productAdd()">
      <label for="product"></label>
      <input type="input" id="product-add" name="product" placeholder="add product" v-model="storeLibrary.productURLadd" autofocus>
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
