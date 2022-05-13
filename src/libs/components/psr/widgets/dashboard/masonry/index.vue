<template>
  <el-scrollbar
      ref="gridLayoutRef"
      :style="{
        height:editing?'fit-content':'100%'
      }"
  >
    <grid-layout
        v-if="!preparing&&activated"
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
        <div class="vue-draggable-handle-background" v-show="editing">
          {{ item.i }}.{{ item.title }}
        </div>
        <div class="no-drag" style="height:100%;width:100%;">
          <component v-if="layoutCompleted" :is="item.component"></component>
        </div>
        <div class="vue-draggable-handle" v-show="editing"/>
      </grid-item>
    </grid-layout>
  </el-scrollbar>
</template>

<script lang="ts">
import {defineComponent, nextTick, onActivated, onDeactivated, onMounted, PropType, ref, watchEffect} from "vue";
import {BlankLayoutOptions, BREAKPOINT_KEYS, BreakpointKey, colNumByBreakpoint, ItemOptions, LayoutOptions, widthByBreakpoint} from "./types/LayoutOptions";

const VueGridLayout = require('vue3-grid-layout/dist/vue-grid-layout.common.js')

export default defineComponent({
  name: "psr-masonry-dashboard",
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem
  },
  props: {
    editing: {
      type: Boolean,
      default: false
    },
    layoutOptions: {
      type: Object as PropType<LayoutOptions>,
      default: () => BlankLayoutOptions
    },
    responsive: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const preparing = ref(false)
    const activated = ref(false)
    const layoutCompleted = ref(false)
    let layoutTimer: NodeJS.Timeout | null = null
    const gridLayoutRef = ref()
    const width = ref(0)
    onMounted(() => {
      const resizeObserver = new ResizeObserver(entries => {
        if (entries && entries.length > 0) {
          width.value = entries[0].contentRect.width
        } else {
          width.value = 0
        }
      })
      resizeObserver.observe(gridLayoutRef.value.$el)
    })
    const colNum = ref(1)
    const layout = ref<ItemOptions[]>([])

    function redraw(layoutOptions: LayoutOptions, responsive: boolean, width: number) {
      let breakpoint: BreakpointKey | undefined
      let lastAvailableBreakpoint: BreakpointKey | undefined
      for (let i = 0; i < BREAKPOINT_KEYS.length; i++) {
        const breakpointKey = BREAKPOINT_KEYS[i]
        if (width >= widthByBreakpoint[breakpointKey] && (layoutOptions[breakpointKey].length > 0 || !responsive)) {
          breakpoint = breakpointKey
          break
        }
        if (layoutOptions[breakpointKey].length > 0) {
          lastAvailableBreakpoint = breakpointKey
        }
      }
      if (breakpoint === undefined) {
        breakpoint = lastAvailableBreakpoint
      }
      console.log('width:%d,breakpoint:%s', width, breakpoint)
      if (breakpoint && (colNum.value !== colNumByBreakpoint[breakpoint] || layout.value !== layoutOptions[breakpoint])) {
        console.log('draw masonry', width, breakpoint)
        preparing.value = true
        layoutCompleted.value = false
        colNum.value = colNumByBreakpoint[breakpoint]
        layout.value = layoutOptions[breakpoint]
        nextTick(() => {
          preparing.value = false
        })
      }
    }

    watchEffect(() => {
      if (!activated.value || preparing.value) {
        layoutCompleted.value = false
      } else {
        if (layoutTimer) {
          clearTimeout(layoutTimer)
        }
        layoutTimer = setTimeout(() => {
          layoutCompleted.value = true
        })
      }
    })

    onActivated(() => {
      activated.value = true
    })

    onDeactivated(() => {
      activated.value = false
    })

    onMounted(() => {
      watchEffect(() => {
        if (activated.value === true && width.value > 0) {
          redraw(props.layoutOptions, props.responsive, width.value)
        }
      })
    })
    return {
      gridLayoutRef,
      activated,
      preparing,
      layoutCompleted,
      colNum,
      layout,
      breakpointCol: colNumByBreakpoint
    }
  }
})
</script>

<style lang="scss" scoped>
.vue-grid-item:not(.vue-grid-placeholder) {
}

.vue-grid-item.resizing {
  opacity: 1;
}

.vue-draggable-handle {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}

.vue-draggable-handle-background {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: var(--el-border-color-extra-light);
  opacity: 0.8;
  border: var(--psr-border)
}
</style>