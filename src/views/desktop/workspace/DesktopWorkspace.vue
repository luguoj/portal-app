<template>
  <el-tabs
      v-model="activeName"
      type="card"
      closable
      class="tabs"
      @tab-click="handleClick"
  >
    <el-tab-pane label="User" name="first">User</el-tab-pane>
    <el-tab-pane label="Config" name="second">Config</el-tab-pane>
    <el-tab-pane label="Role" name="third">Role</el-tab-pane>
    <el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
  </el-tabs>
</template>

<script>
import {Edit} from "@element-plus/icons-vue";

export default {
  name: "DesktopWorkspace",
  components: {Edit}
}
</script>

<style scoped>
.tabs > .el-tabs__content {
  padding: 32px;
  background-color: #f4f5f7;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>