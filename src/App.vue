<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { computed, watchEffect } from 'vue'
import { Line } from 'vue-chartjs'
import 'chartjs-adapter-date-fns'

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  TimeSeriesScale,
  ChartData
} from 'chart.js'
import { TChartOptions } from 'vue-chartjs/dist/types'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  TimeSeriesScale,
  LinearScale,
  PointElement,

)

type Record = { time: string, avg: number }
type Records = Array<Record>

const { result } = useQuery<{ temperatureRecap: Records }>(gql`
  query values {
    temperatureRecap {
      time
      avg
    }
  }
`)


const chartData = computed<ChartData<'line', Array<any>>>(() => ({
  datasets: [{
    label: "Temperature",
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1,
    fill: false,

    data: result.value?.temperatureRecap || []
  }],
}))

const chartOptions: TChartOptions<'line'> = {
  maintainAspectRatio: false,
  parsing: {
    xAxisKey: 'time',
    yAxisKey: 'avg'
  },
  scales: {

    x: {
      type: 'time'
    }
  }
}
</script>

<template>
  <Line :chart-data="chartData" :chart-options="chartOptions"></Line>
</template>
