<template>
  <el-container>
    <el-header><h1>This is parent page.</h1></el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "SampleParentPage"
}
</script>

<style scoped>

</style>