<template>
  <div id="describe-data-structure">
    Please select a source table:
    <div id="tables-available">
      <select class="select-table-db" id="" v-model="tableChoice" @change="selectdbTable()">
        <option class="tables-options" selected=""  v-for="tab in dbTables" :value="tab">
          {{ tab.name }}
          </option>
      </select>
      <button id="" @click="showTables">Show columns</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  let tableChoice = ref('')

  /* computed */
  const dbTables = computed(() => {
    return storeLibrary.describeSource.tables
  })

  /*  methods */
  const selectdbTable = () => {
    console.log('table select')
  }

  const showTables = () => {
    // send message to HOP to get columsn for this table
    let messageHOP = {}
    messageHOP.type = 'library'
    messageHOP.action = 'source'
    messageHOP.reftype = storeLibrary.newPackagingForm.type
    messageHOP.privacy = 'private'
    messageHOP.task = 'GET'
    messageHOP.data = { query: 'tables', db: storeLibrary.describeSource.path, table: tableChoice.value.name }
    console.log(messageHOP)
    storeLibrary.sendMessage(messageHOP)
  }

</script>

<style scoped>

@media (min-width: 1024px) {
  #describe-data-structure {
    display: grid;
    grid-template-columns: 1fr;
  }

  #tables-available {
    display: grid;
    grid-template-columns: 2fr 1fr;
    margin: 1em;
    background-color: bisque;
  }

  .tables-option {
    background-color: bisque;
  }
}
</style>