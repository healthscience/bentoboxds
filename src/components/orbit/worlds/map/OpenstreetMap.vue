<template>
  <div class="earth-world">
    <ol-map style="width: 100%; height: 100%;">
        <ol-view ref="viewRef" :center="[center[1], center[0]]" :zoom="zoom" projection="EPSG:4326" />
        <ol-tile-layer>
          <ol-source-osm />
        </ol-tile-layer>

        <!-- Genesis Marker -->
        <ol-vector-layer v-if="center">
          <ol-source-vector>
            <ol-feature>
              <ol-geom-point :coordinates="[center[1], center[0]]" />
              <ol-style>
                <ol-style-circle :radius="8">
                  <ol-style-fill color="#00ffc8"></ol-style-fill>
                  <ol-style-stroke color="#000" :width="2"></ol-style-stroke>
                </ol-style-circle>
                <ol-style-text 
                  v-if="locationName"
                  :text="locationName" 
                  :offsetY="-30" 
                  font="bold 14px sans-serif"
                >
                  <ol-style-fill color="#00ffc8"></ol-style-fill>
                  <ol-style-stroke color="#000" :width="3"></ol-style-stroke>
                </ol-style-text>
              </ol-style>
            </ol-feature>
          </ol-source-vector>
        </ol-vector-layer>
      </ol-map>
  </div>
</template>

<script setup>
 import { ref } from 'vue'

 const props = defineProps({
   center: {
     type: Array,
     default: () => [-160, 0]
   },
   zoom: {
     type: Number,
     default: 3
   },
   locationName: {
     type: String,
     default: ''
   }
 });

 const markerIcon = ref('https://openlayers.org/en/latest/examples/data/icon.png');

 const viewRef = ref(null);

 const panTo = (coords) => {
   if (viewRef.value) {
     // OpenLayers uses [lon, lat] for EPSG:4326
     // Input coords is [lat, lon] from EarthEnvironment.vue
     const lonLat = [coords[1], coords[0]];
     viewRef.value.setCenter(lonLat);
   }
 };

 defineExpose({ panTo });

</script>

<style scoped>
.earth-world {
  width: 100%;
  height: 100%;
}
</style>
