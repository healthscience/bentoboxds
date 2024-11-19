<template>
  <h3>product tools</h3>
  <div id="bento-product-cues">
    <form id="add-product-form" @submit.prevent="productAdd()">
      <!-- product category-->
      <select class="select-product-cat" id="product-cat" v-model="productCategory">
        <option selected="" v-for="sp in prodCatList" :value="sp.prodid">
          {{ sp.name }}
        </option>
      </select>
      <label for="product"></label>
      <input type="input" id="product-add" name="product" placeholder="add product" v-model="productTest" autofocus>
      <input type="input" id="product-ecomm" name="ecomm" placeholder="add url" v-model="productURLadd" autofocus>
    </form>
    <button id="bento-product-task" type="submit" @click.prevent="productAdd()">
      + add product
    </button>
  </div>
  <div id="product-paper-list">
    <div id="product-paper-select" v-for="product in productMatch" :value="product.prodid">
      <button class="product-paper-item" @click="viewproduct(product)">
        {{ product.value.concept.product }}
      </button>
      <button class="product-paper-source" @click="viewSourceproduct(product.ecomm)">
        View source
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed} from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'
import { bentoboxStore } from '@/stores/bentoboxStore.js'
import { cuesStore } from '@/stores/cuesStore.js'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

  const storeAI = aiInterfaceStore()
  const storeLibrary = libraryStore()
  const storeCues = cuesStore()
  const storeBentobox = bentoboxStore()

  let productURLadd = ref('')
  let productTest = ref('')
  let productCategory = ref('')

  /* computed */
  const prodCatList = computed(() => {
    let testCategories = [{ name: 'product', prodid: 223 }, { name: 'supplement', prodid: 723 }, { name: 'treatment', prodid: 323 }, { name: 'therapy', prodid: 423 }, { name: 'device', prodid: 523 }, { name: 'prescription', prodid: 623 }]
    return testCategories
  })

  const productMatch = computed(() => {
    return storeCues.productMatch
  })

  /* methods */
  const selectProdCat = () => {
    console.log(productCategory.value)
  }

  const productAdd = () => {
    // assume youtube and extract id
    if (productURLadd.value.length > 0) {
      let newProduct = { spaceid: storeAI.liveBspace.spaceid, pcategory: productCategory.value, product: productTest.value, ecomm: productURLadd.value }
      storeCues.productMatch.push({ key: 'testpro', value: { concept: { spaceid: storeAI.liveBspace.spaceid, pcategory: productCategory.value, product: productTest.value, ecomm: productURLadd.value }}})
      // save and add to space ledger
      const cueMContract = {}
      cueMContract.type = 'library'
      cueMContract.action = 'product'
      cueMContract.reftype = 'product-cues'
      cueMContract.task = 'PUT'
      cueMContract.privacy = 'public'
      cueMContract.data = newProduct
      storeLibrary.sendMessage(cueMContract)
      productTest.value = ''
      productURLadd.value = ''
    }
  }

  const viewproduct = (product) => {
    console.log(product)
    let productID = product.product
    if (product.product.length > 0) {
      // check if holder setup
      if (storeBentobox.locationProductbox[storeAI.liveBspace.spaceid] === undefined) {
        storeBentobox.locationProductbox[storeAI.liveBspace.spaceid] = {}
      }
      storeBentobox.setLocationProductbox(storeAI.liveBspace.spaceid, productID)
      if (storeBentobox.productMedia[storeAI.liveBspace.spaceid]) {
        storeBentobox.productMedia[storeAI.liveBspace.spaceid].push({ key: productID, tag: 'product', id: productID })
      } else {
        storeBentobox.productMedia[storeAI.liveBspace.spaceid] = []
        storeBentobox.productMedia[storeAI.liveBspace.spaceid].push({ key: productID, tag: 'product', id: productID })
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

#product-cat {
  margin-bottom: .6em;
}


@media (min-width: 1024px) {


}

</style>