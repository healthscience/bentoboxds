<template>
  <div id="describe-data">
    <div id="library-datatypes"
      v-on:dragover.prevent
      v-on:drop="handleDrop($event, 'library-datatypes', null)"
    >
      <h3>Datatypes available</h3>
      <div class="list-dt-item" 
          v-for="(element) in storeLibrary?.publicLibrary?.referenceContracts?.datatype"
          :key="element.key"
          draggable="true"
          v-on:dragstart="handleDragStart($event, element)"
        >
          {{ element.value.concept.name }}
      </div>
    </div>
    <div id="match-datatypes">
      <header>Drag datatype to column name</header>
      <div
        v-for='col in storeLibrary?.newDatafile?.columns'
        :key='col.id'
      >
        <div class="col-name">
          <h3>{{ col.name }}</h3>
          <div class="list-group" :list="storeLibrary.newLists[col.cid]" group="matchdt" 
            v-on:dragover.prevent
            v-on:drop="handleDrop($event, 'match-column', col.cid)"
          >
            <div class="list-match-item"  draggable="true"
              v-on:dragstart="handleDragStart($event, col.cid)"
            >
              {{ storeLibrary.newLists[col.cid]?.value?.concept?.name }}
            </div>
          </div>
        </div>
      </div>
    </div>match == {{ storeLibrary.newLists }} dt----- {{ storeLibrary.newDatafile }}
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { libraryStore } from '@/stores/libraryStore.js'

  const storeLibrary = libraryStore()

  let libraryDatatypes = ref(storeLibrary.publicLibrary.datatype)

  /* computed */
  const dtcolumns = computed(() => {
    return storeLibrary.newPackingForm.apicolHolder
  })

  const handleDragStart = (event, itemData) => {
    event.dataTransfer.setData('application/json', JSON.stringify(itemData))
  }

  const handleDrop = (event, targetContainer, dti) => {
    const itemData = JSON.parse(event.dataTransfer.getData('application/json'))
    // make pair of column source name and ref DT contract hash ie key
    console.log(itemData)

    if (targetContainer === 'match-column') {
      // the reference contract
      let matchRefDT =  storeLibrary.newLists[dti]
      console.log('matchdt')
      console.log(matchRefDT)
      console.log(dti)
      // the column name
      let columnName = storeLibrary.newDatafile.columns[dti]
      console.log(columnName)
      // match id to datatype
      let matchDatatype = itemData
      storeLibrary.newListsave[columnName.name] = {}
      storeLibrary.newListsave[columnName.name] = matchDatatype.key
      storeLibrary.newLists[dti] = {}
      storeLibrary.newLists[dti] = matchDatatype
    } else if (targetContainer === 'library-datatypes') {
      // remove the match by column name
      let columnName = storeLibrary.newDatafile.columns[itemData]
      console.log(columnName)
      delete storeLibrary.newListsave[columnName.name]
      delete storeLibrary.newLists[itemData]
    }
    console.log(storeLibrary.newListsave)
    console.log(storeLibrary.newLists)
  }

</script>

<style scoped>

@media (min-width: 1024px) {
  #describe-data {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  #library-datatypes {
    border: 2px solid blue;
  }

  #match-datatypes {
    border: 2px solid green;
  }

  .col-name {
    display: inline-block;
    vertical-align: text-top;
    width: 60%;
  }

  #data-columns {
    border: 1px solid orange;
    min-height: 400px;
    vertical-align: text-top;
    display: inline-block;
    width: 40%;
  }

  .list-group {
    border: 1px solid lightgrey;
    background-color: white;
    min-height: 4em;
  }

  .list-group-item {
    display: block;
    width: 80%;
    padding: .5em;
    margin: 1em;
    border: 1px solid lightgrey;
    background-color: #E6ECEC;
  }

  .list-dt-item {
    display: block;
    width: 200px;
    padding: .5em;
    margin: 1em;
    border: 2px solid orange;
    background-color: #E6ECEC;
  }

  .list-match-item {
    display: block;
    width: 200px;
    padding: .5em;
    margin: 1em;
    border: 2px solid orange;
    background-color: #E6ECEC;
  }
}
</style>
