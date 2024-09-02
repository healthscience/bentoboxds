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

  const emit = defineEmits(['segmentClick'])
  
  const props = defineProps({
    cueType: String,
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
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          display: true,
        },
        datalabels: {
          formatter: function(value, context) {
            return 1
          },
          color: 'white',
          font: {
            weight: 'bold',
            size: 18
          },
          padding: 4,
         }
      },
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
        emit('segmentClick', props.cueType, chartspace.value.chart.$context.chart.tooltip.dataPoints[0])
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