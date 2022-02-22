<template>
  <el-tag
      class="tag"
      :class="checked?'checked':''"
      :closable="closable"
      :size="size"
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
      default: 'large'
    }
  }
}
</script>

<style scoped>
.tag {
  cursor: pointer;
  background-color: var(--el-bg-color);
  color: var(--el-color-info)
}

.tag:hover {
  background-color: #dcdfe6;
}

.tag.checked {
  background-color: #deedfc;
  color: #53a8ff;
}

.tag.checked:hover {
  background-color: #c6e2ff;
}
</style>