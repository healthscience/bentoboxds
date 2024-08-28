<template>
  <div id="interact-cue">
    <Pie  v-if="loaded" id="inter-chart-id"  ref="chartspace" :data="chartData" :options="options" />
  </div>
</template>

<script setup>
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'vue-chartjs'
import { ref, onMounted } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)
  
  const props = defineProps({
    chartData: Object
  })

const chartspace = ref(null)
  let options = ref({})
  let loaded = ref(false)

  onMounted(() => {

    options = {
      cutout: '40%',
      responsive: true,
      maintainAspectRatio: false,
      onClick: (e) => {
        console.log('click pie')
        // console.log(Object.keys(chartspace.value.chart.$context.chart.tooltip))
        // console.log(chartspace)
        const chart = chartspace
        console.log(
          chartspace.value.chart.$context.chart.tooltip.dataPoints
          /*chart.getElementsAtEventForMode(
            e,
            'nearest',
            { intersect: true },
            false
          ) */
        ) 
      },
    }

    loaded.value = true

  })

</script>

<style scoped>

#interact-cue {
  height: 50vh;
  width: 50vw;
  border: 1px solid red;
}

</style>