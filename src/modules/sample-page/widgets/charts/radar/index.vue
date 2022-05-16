<template>
  <psr-antv-g2plot-radar-chart
      style="height: 100%;width:100%"
      :data="data" :options="options"
  />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import PsrAntvG2plotRadarChart from "@/libs/components/psr/widgets/charts/antv-g2plot/radar/index.vue";

export default defineComponent({
  name: "sample-dashboard-widget-chart-radar",
  components: {PsrAntvG2plotRadarChart},
  setup() {
    return {
      data: [
        {"item": "Design", "user": "a", "score": 70},
        {"item": "Design", "user": "b", "score": 30},
        {"item": "Development", "user": "a", "score": 60},
        {"item": "Development", "user": "b", "score": 70},
        {"item": "Marketing", "user": "a", "score": 50},
        {"item": "Marketing", "user": "b", "score": 60},
        {"item": "Users", "user": "a", "score": 40},
        {"item": "Users", "user": "b", "score": 50},
        {"item": "Test", "user": "a", "score": 60},
        {"item": "Test", "user": "b", "score": 70},
        {"item": "Language", "user": "a", "score": 70},
        {"item": "Language", "user": "b", "score": 50},
        {"item": "Technology", "user": "a", "score": 50},
        {"item": "Technology", "user": "b", "score": 40},
        {"item": "Support", "user": "a", "score": 30},
        {"item": "Support", "user": "b", "score": 40},
        {"item": "Sales", "user": "a", "score": 60},
        {"item": "Sales", "user": "b", "score": 40},
        {"item": "UX", "user": "a", "score": 50},
        {"item": "UX", "user": "b", "score": 60}
      ],
      options: {
        xField: 'item',
        yField: 'score',
        seriesField: 'user',
        meta: {
          score: {
            alias: '分数',
            min: 0,
            max: 80,
          },
        },
        xAxis: {
          line: null,
          tickLine: null,
          grid: {
            line: {
              style: {
                lineDash: null,
              },
            },
          },
        },
        yAxis: {
          line: null,
          tickLine: null,
          grid: {
            line: {
              type: 'line',
              style: {
                lineDash: null,
              },
            },
            alternateColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
        // 开启面积
        area: {},
        // 开启辅助点
        point: {
          size: 2,
        },
      }
    }
  }
})
</script>

<style scoped>

</style>