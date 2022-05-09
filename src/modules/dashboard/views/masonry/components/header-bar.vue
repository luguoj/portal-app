<template>
  <psr-toolbar>
    <el-check-tag :checked="editing" @change="$emit('update:editing',$event)">编辑布局</el-check-tag>
    <el-select :model-value="breakpoint" @change="$emit('update:breakpoint',$event)">
      <el-option
          v-for="item in breakpointSelections" :key=item.value
          :label="item.title"
          :value="item.breakpoint"
      />
    </el-select>
  </psr-toolbar>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import PsrToolbar from "@/libs/components/psr/widgets/toolbar/base/index.vue";

export default defineComponent({
  name: "header-bar",
  components: {
    PsrToolbar,
  },
  props: {
    editing: {
      type: Boolean,
      default: false
    },
    breakpoint: {
      type: String,
      default: 'lg'
    }
  },
  emits: ['update:editing', 'update:breakpoint'],
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

<style scoped>

</style>