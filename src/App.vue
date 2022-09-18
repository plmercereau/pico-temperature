<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable'
import gql from 'graphql-tag'
import { sub } from 'date-fns'

import { computed } from 'vue'
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
  PointElement
)

type Record = { time: string; avg: number }
type Records = Array<Record>

const tick = sub(new Date(), { minutes: 10 }).toISOString()
const QUERY = gql`
  query previousValues($tick: timestamptz!) {
    temperatureRecap(where: { time: { _lte: $tick } }) {
      time
      avg
    }
  }
`

const NEW_VALUES = gql`
  subscription newValues($tick: timestamptz!) {
    temperatureRecap(where: { time: { _gt: $tick } }) {
      time
      avg
    }
  }
`

const { result, subscribeToMore } = useQuery<{ temperatureRecap: Records }>(
  QUERY,
  { tick }
)

subscribeToMore({
  document: NEW_VALUES,
  variables: { tick },
  updateQuery: (previousResult, { subscriptionData }) => {
    const previous: Records = previousResult?.temperatureRecap || []
    const next: Records = subscriptionData.data.temperatureRecap || []
    return { temperatureRecap: [...previous.filter((r) => !next.find((n) => n.time === r.time)), ...next] }
  }
})

const chartData = computed<ChartData<'line', Array<any>>>(() => ({
  datasets: [
    {
      label: 'Temperature',
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
      fill: false,

      data: result.value?.temperatureRecap || []
    }
  ]
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
