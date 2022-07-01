<template>
  <el-select :model-value="breakpoint" @change="$emit('update:breakpoint',$event)">
    <el-option
        v-for="item in breakpointSelections" :key=item.value
        :label="item.title"
        :value="item.breakpoint"
    />
  </el-select>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "header-bar-tools-masonry",
  props: {
    breakpoint: {
      type: String,
      default: 'lg'
    }
  },
  emits: ['update:breakpoint'],
  setup() {
    return {
      breakpointSelections: [{
        title: '大屏 > 1200px',
        breakpoint: 'lg',
      }, {
        title: '中屏 992px ~ 1200px',
        breakpoint: 'md',
      }, {
        title: '小屏 678px ~ 992px',
        breakpoint: 'sm',
      }, {
        title: '超小屏 480px ~ 678px',
        breakpoint: 'xs',
      }, {
        title: '特小屏 0 ~ 480px',
        breakpoint: 'xxs',
      }]
    }
  }
})
</script>

<style lang="scss" scoped>
</style>