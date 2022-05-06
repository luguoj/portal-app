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
import {breakpointSelections} from "@/modules/dashboard/types/TemplateConfig";

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
      breakpointSelections
    }
  }
})
</script>

<style scoped>

</style>