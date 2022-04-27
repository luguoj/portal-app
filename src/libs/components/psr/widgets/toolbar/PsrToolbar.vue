<template>
  <div class="ct-root">
    <el-space wrap>
      <slot/>
    </el-space>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "PsrToolbar"
})
</script>

<style lang="scss" scoped>
.ct-root {
  height: auto;
  padding: 0.5rem;
  background-color: var(--el-border-color-extra-light);
  border-bottom: var(--psr-border);
}
</style>