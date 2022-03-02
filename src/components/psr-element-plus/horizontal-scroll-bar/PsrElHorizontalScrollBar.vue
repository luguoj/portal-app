<template>
  <el-scrollbar class="ct-scrollbar" ref="refScrollbar" @wheel.prevent="handleScroll">
    <div class="ct-scrollbar-inner">
      <slot></slot>
    </div>
  </el-scrollbar>
</template>

<script>
import {ref} from "vue";

export default {
  name: "PsrElHorizontalScrollBar",
  setup() {
    const refScrollbar = ref(null)

    function handleScroll(e) {
      const wheelDelta = e.wheelDelta || -e.deltaY * 40
      const scrollbar = refScrollbar.value
      scrollbar.setScrollLeft(scrollbar.wrap$.scrollLeft - wheelDelta)
    }

    return {refScrollbar, handleScroll}
  }
}
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