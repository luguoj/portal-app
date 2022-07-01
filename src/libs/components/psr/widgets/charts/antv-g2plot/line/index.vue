<template>
  <div ref="chartRef"></div>
</template>

<script lang="ts">
import {defineComponent, onMounted, PropType, ref, watch} from "vue";
import {Line, LineOptions} from '@antv/g2plot';

export default defineComponent({
  name: "psr-antv-g2plot-line-chart",
  props: {
    options: {
      type: Object as PropType<LineOptions>,
      required: true
    },
    data: {
      type: Object as PropType<Record<string, any>[]>,
      default: []
    }
  },
  setup(props) {
    const chartRef = ref<HTMLElement>()
    onMounted(() => {
      if (chartRef.value !== undefined) {
        const plot = new Line(chartRef.value, {
          ...props.options,
          data: props.data
        });
        plot.render();
        watch(() => props.options, options => {
          plot.update(options)
        })
        watch(() => props.data, data => {
          plot.changeData(data)
        })
      }
    })
    return {
      chartRef
    }
  }
})
</script>

<style scoped>

</style>