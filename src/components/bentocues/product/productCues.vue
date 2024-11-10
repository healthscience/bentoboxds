<template>
  <h3>product tools</h3>
  <div id="bento-product-cues">
    <form id="add-product-form" @submit.prevent="productAdd()">
      <label for="product"></label>
      <input type="input" id="product-add" name="product" placeholder="add product" v-model="productURLadd" autofocus>
      <input type="input" id="product-add" name="product" placeholder="add test source" v-model="productTest" autofocus>
    </form>
    <button id="bento-product-task" type="submit" @click.prevent="productAdd()">
      + add product
    </button>
  </div>
  <div id="product-paper-list">
    <div id="product-paper-select" v-for="product in productMatch" :value="product.id">
      <button class="product-paper-item" @click="viewproduct(product)">
        {{ product }}
      </button>
      <button class="product-paper-source" @click="viewSourceproduct(product)">
        View source
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed} from 'vue'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { cuesStore } from '@/stores/cuesStore.js'
import { libraryStore } from '@/stores/libraryStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeAI = aiInterfaceStore()
  const storeLibrary = libraryStore()
  const storeCues = cuesStore()
  const storeBentobox = bentoboxStore()

  let productURLadd = ref('')
  let productTest = ref('')
  let spaceproduct = ref(false)


  /* computed */
  const productMatch= computed(() => {
    return storeCues.productMatch
  })

  /* methods */
  const productAdd = () => {
    // assume youtube and extract id
    if (productURLadd.value.length > 0) {
      storeCues.productMatch.push({ product: productURLadd.value, lab: productTest.value })
      // save and add to space ledger
      const cueMContract = {}
      cueMContract.type = 'library'
      cueMContract.action = 'product'
      cueMContract.reftype = 'product-cues'
      cueMContract.task = 'PUT'
      cueMContract.privacy = 'public'
      cueMContract.data = storeCues.productMatch
      storeLibrary.sendMessage(cueMContract)
      productURLadd.value = ''
    }
  }

  const viewproduct = (product) => {
    console.log(product)
    if (product.product.length > 0) {
      // check if holder setup
      if (storeBentobox.locationproductbox[storeAI.liveBspace.spaceid] === undefined) {
        storeBentobox.locationproductbox[storeAI.liveBspace.spaceid] = {}
      }
      storeBentobox.setLocationproductbox(storeAI.liveBspace.spaceid, product)
      if (storeBentobox.productMedia[storeAI.liveBspace.spaceid]) {
        storeBentobox.productMedia[storeAI.liveBspace.spaceid].push({ tag: 'product', id: product })
      } else {
        storeBentobox.productMedia[storeAI.liveBspace.spaceid] = []
        storeBentobox.productMedia[storeAI.liveBspace.spaceid].push({ tag: 'product', id: product })
      }
    } else {
      console.log('empty product')
    }
    //  need to emit to close one component up
    // spaceproduct.value = false
  }

  const viewSourceproduct = (paper) => {
    // visit source in new tab
    window.open(paper, '_blank')
  }

</script>

<style scoped>

#bento-product-task {
  margin-top: 1em;
}


#product-paper-list {
  height: 200px;
  border: 1px solid red;
}
@media (min-width: 1024px) {


}

</style>