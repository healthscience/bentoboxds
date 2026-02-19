<template>
  <div class="earth-world">
    <ol-map style="width: 100%; height: 100%;">
        <ol-view :center="[-160, 0]" :zoom="3" projection="EPSG:4326" />
        <ol-tile-layer>
          <ol-source-osm />
        </ol-tile-layer>
      </ol-map>
  </div>
</template>

<script setup>
 import { ref } from 'vue'

</script>

<style scoped>
.earth-world {
  width: 100%;
  height: 100%;
}
</style>
