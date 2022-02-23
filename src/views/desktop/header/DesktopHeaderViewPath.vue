<template>
  <el-breadcrumb separator="/" class="breadcrumb left">
    <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
    <el-breadcrumb-item
    ><a href="/">promotion management</a></el-breadcrumb-item
    >
    <el-breadcrumb-item>promotion list</el-breadcrumb-item>
    <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "DesktopHeaderViewPath"
}
</script>

<style scoped>

</style>