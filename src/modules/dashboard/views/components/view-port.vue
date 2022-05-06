<template>
  <div>
    <el-alert title="暂时无法支持当前屏幕尺寸" type="error" v-show="!editing && layout.length===0" :closable="false"/>
    <grid-layout
        ref="gridLayoutRef"
        :layout.sync="layout"
        :colNum="colNum"
        :row-height="30"
        :is-draggable="editing"
        :is-resizable="editing"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
    >
      <grid-item v-for="item in layout"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :key="item.i"
                 drag-allow-from=".vue-draggable-handle"
                 drag-ignore-from=".no-drag"
      >
        <div class="no-drag" style="height:100%;width:100%;">
          <el-skeleton style="height:100%;width:100%;">
            <template #template>
              <el-skeleton-item variant="image" style="height:100%;width:100%;"/>
            </template>
          </el-skeleton>
        </div>
        <div class="vue-draggable-handle" style="position:absolute;left:0;top:0;width:100%;background:grey;color:white;" v-show="editing">
          {{ item.i }}.{{ item.widget.name }}
        </div>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue";
import VueGridLayout from "vue3-grid-layout";
import {breakpointCol, breakpointWidth} from "@/modules/dashboard/types/TemplateConfig";

export default defineComponent({
  name: "view-port",
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  props: {
    editing: {
      type: Boolean,
      default: false
    },
    templateConfig: {
      type: Object,
      default: {}
    }
  },
  setup(props) {
    const gridLayoutRef = ref()
    const colNum = ref(12)
    const layout = ref([])
    onMounted(() => {
      console.log(gridLayoutRef)
      const resizeObserver = new ResizeObserver(entries => {
        if (entries && entries.length > 0) {
          if (entries[0].contentRect.width >= breakpointWidth.lg) {
            colNum.value = breakpointCol.lg
            layout.value = props.templateConfig.lg
          } else if (entries[0].contentRect.width >= breakpointWidth.md) {
            colNum.value = breakpointCol.md
            layout.value = props.templateConfig.md
          } else if (entries[0].contentRect.width >= breakpointWidth.sm) {
            colNum.value = breakpointCol.sm
            layout.value = props.templateConfig.sm
          } else if (entries[0].contentRect.width >= breakpointWidth.xs) {
            colNum.value = breakpointCol.xs
            layout.value = props.templateConfig.xs
          } else {
            colNum.value = breakpointCol.xxs
            layout.value = props.templateConfig.xxs
          }
        }
      })
      resizeObserver.observe(gridLayoutRef.value.$el)
    })
    return {
      gridLayoutRef,
      colNum,
      layout,
      breakpointCol
    }
  }
})
</script>

<style scoped>

.vue-grid-item:not(.vue-grid-placeholder) {
  background: #ccc;
  border: 1px solid black;
}

.vue-grid-item .resizing {
  opacity: 0.1;
}

.vue-draggable-handle {

}
</style>