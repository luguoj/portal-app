<template>
  <psr-antv-g2plot-line-chart
      style="height: 100%;width:100%"
      :data="data" :options="options"
  />
</template>

<script lang="ts">
import {defineComponent} from "vue";
import PsrAntvG2plotLineChart from "@/libs/components/psr/widgets/charts/antv-g2plot/line/index.vue";

export default defineComponent({
  name: "sample-dashboard-widget-chart-line",
  components: {PsrAntvG2plotLineChart},
  setup() {
    return {
      data: [
        {
          "date": "2018/8/1",
          "type": "download",
          "value": 4623
        },
        {
          "date": "2018/8/1",
          "type": "register",
          "value": 2208
        },
        {
          "date": "2018/8/1",
          "type": "bill",
          "value": 182
        },
        {
          "date": "2018/8/2",
          "type": "download",
          "value": 6145
        },
        {
          "date": "2018/8/2",
          "type": "register",
          "value": 2016
        },
        {
          "date": "2018/8/2",
          "type": "bill",
          "value": 257
        },
        {
          "date": "2018/8/3",
          "type": "download",
          "value": 508
        },
        {
          "date": "2018/8/3",
          "type": "register",
          "value": 2916
        },
        {
          "date": "2018/8/3",
          "type": "bill",
          "value": 289
        },
        {
          "date": "2018/8/4",
          "type": "download",
          "value": 6268
        },
        {
          "date": "2018/8/4",
          "type": "register",
          "value": 4512
        },
        {
          "date": "2018/8/4",
          "type": "bill",
          "value": 428
        },
        {
          "date": "2018/8/5",
          "type": "download",
          "value": 6411
        },
        {
          "date": "2018/8/5",
          "type": "register",
          "value": 8281
        },
        {
          "date": "2018/8/5",
          "type": "bill",
          "value": 619
        },
        {
          "date": "2018/8/6",
          "type": "download",
          "value": 1890
        },
        {
          "date": "2018/8/6",
          "type": "register",
          "value": 2008
        },
        {
          "date": "2018/8/6",
          "type": "bill",
          "value": 87
        },
        {
          "date": "2018/8/7",
          "type": "download",
          "value": 4251
        },
        {
          "date": "2018/8/7",
          "type": "register",
          "value": 1963
        },
        {
          "date": "2018/8/7",
          "type": "bill",
          "value": 706
        },
        {
          "date": "2018/8/8",
          "type": "download",
          "value": 2978
        },
        {
          "date": "2018/8/8",
          "type": "register",
          "value": 2367
        },
        {
          "date": "2018/8/8",
          "type": "bill",
          "value": 387
        },
        {
          "date": "2018/8/9",
          "type": "download",
          "value": 3880
        },
        {
          "date": "2018/8/9",
          "type": "register",
          "value": 2956
        },
        {
          "date": "2018/8/9",
          "type": "bill",
          "value": 488
        },
        {
          "date": "2018/8/10",
          "type": "download",
          "value": 3606
        },
        {
          "date": "2018/8/10",
          "type": "register",
          "value": 678
        },
        {
          "date": "2018/8/10",
          "type": "bill",
          "value": 507
        },
        {
          "date": "2018/8/11",
          "type": "download",
          "value": 4311
        },
        {
          "date": "2018/8/11",
          "type": "register",
          "value": 3188
        },
        {
          "date": "2018/8/11",
          "type": "bill",
          "value": 548
        },
        {
          "date": "2018/8/12",
          "type": "download",
          "value": 4116
        },
        {
          "date": "2018/8/12",
          "type": "register",
          "value": 3491
        },
        {
          "date": "2018/8/12",
          "type": "bill",
          "value": 456
        },
        {
          "date": "2018/8/13",
          "type": "download",
          "value": 6419
        },
        {
          "date": "2018/8/13",
          "type": "register",
          "value": 2852
        },
        {
          "date": "2018/8/13",
          "type": "bill",
          "value": 689
        },
        {
          "date": "2018/8/14",
          "type": "download",
          "value": 1643
        },
        {
          "date": "2018/8/14",
          "type": "register",
          "value": 4788
        },
        {
          "date": "2018/8/14",
          "type": "bill",
          "value": 280
        },
        {
          "date": "2018/8/15",
          "type": "download",
          "value": 445
        },
        {
          "date": "2018/8/15",
          "type": "register",
          "value": 4319
        },
        {
          "date": "2018/8/15",
          "type": "bill",
          "value": 176
        }
      ],
      options: {
        xField: 'date',
        yField: 'value',
        yAxis: {
          label: {
            // 数值格式化为千分位
            formatter: (v:any) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
          },
        },
        seriesField: 'type',
        color: ({ type }:any) => {
          return type === 'register' ? '#F4664A' : type === 'download' ? '#30BF78' : '#FAAD14';
        },
        lineStyle: ({ type }:any) => {
          if (type === 'register') {
            return {
              lineDash: [4, 4],
              opacity: 1,
            };
          }
          return {
            opacity: 0.5,
          };
        },
      }
    }
  }
})
</script>

<style scoped>

</style>