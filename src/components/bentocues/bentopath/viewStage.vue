<template>
  <div class="stage-story-holder">
    <div id="stage-display">
      <div id="stage-reference">
        {{ stageID.refcontract }}
      </div>
      <div id="stage-name">
        {{ stageID.name }}
      </div>
      <div v-if="stageID.text" id="stage-text">
       {{ stageID.text }}
      </div>

      <div v-if="stageID.data" id="stage-data">
       {{ stageID.data }} <a href="" class="data-vis" @click.prevent="viewOnmap(stageID)">view to map</a>
      </div>

    </div>
  </div>
</template>

<script setup>
  const props = defineProps({
    stageID: Object
  })

  
  /* methods */
  const viewOnmap = (stage) => {
    // this.$store.dispatch('actionStageID', stage)
  }

</script>

<style scoped>
#stage-story-holder {
  float: left;
}

#setup-tools {

}

#stage-display {
  float: left;
  min-height: 100px;
  width: 200px;
  border: 2px solid lightgrey;
}

@media (min-width: 1024px) {

  
}

</style>
