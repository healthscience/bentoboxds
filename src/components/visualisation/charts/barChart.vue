<template>
  <Bar
    id="my-chart-id"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { ref, computed } from 'vue'
import { aiInterfaceStore } from '@/stores/aiInterface.js'

const storeAI = aiInterfaceStore()


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

  // const dataValues = ref([2, 4, 7])
  const dataValues = computed(() => {
    console.log(storeAI.tempNumberData)
    return storeAI.tempNumberData
  })

  const dataLabel = computed(() => {
    console.log(storeAI.tempLabelData)
    return storeAI.tempLabelData
  })

  const chartData = computed(() => {
    return {
      labels: dataLabel.value, // [ 'January', 'February', 'March' ],
      datasets: [ { data: dataValues.value } ]
    }
   })

  const chartOptions = computed(() => {
    return {
      responsive: true,
      maintainAspectRatio: true
    }
  })
</script>

<style scoped>

</style>