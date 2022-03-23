<template>
  <el-scrollbar class="ct-scrollbar" ref="vmScrollbar.ref" @wheel.prevent="vmScrollbar.handleScroll">
    <div class="ct-scrollbar-inner">
      <slot></slot>
    </div>
  </el-scrollbar>
</template>

<script lang="ts">
import {defineComponent, Ref, ref} from "vue";

class ScrollbarViewModel {
  ref: Ref = ref()

  handleScroll(e: any) {
    const wheelDelta = e.wheelDelta || -e.deltaY * 40
    const scrollbar = this.ref.value
    scrollbar.setScrollLeft(scrollbar.wrap$.scrollLeft - wheelDelta)
  }
}

export default defineComponent({
  name: "PsrElHorizontalScrollBar",
  setup() {
    return {
      vmScrollbar: new ScrollbarViewModel()
    }
  }
})
</script>

<style lang="scss" scoped>
.ct-scrollbar {

  .ct-scrollbar-inner {
    display: flex;
    width: fit-content;
    padding: 0 10px;
  }
}
</style>