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

<script>
export default {
  name: "DesktopWorkspaceViewTag",
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
}
</script>

<style scoped>
.tag {
  cursor: pointer;
  transition: background-color var(--el-transition-duration) linear, border-color var(--el-transition-duration) linear, color var(--el-transition-duration) linear;
}
</style>