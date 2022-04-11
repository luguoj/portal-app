<template>
  <el-tag
      class="tag"
      :class="{checked: checked}"
      :closable="closable"
      :size="size"
      :effect="!checked?'plain':'light'"
  >
    <slot></slot>
  </el-tag>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "psr-view-part-header-tag",
  props: {
    checked: {
      type: Boolean,
      default: true
    },
    closable: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'default'
    }
  }
})
</script>

<style scoped>
.tag {
  cursor: pointer;
  transition: background-color var(--el-transition-duration) linear, border-color var(--el-transition-duration) linear, color var(--el-transition-duration) linear;
}
</style>