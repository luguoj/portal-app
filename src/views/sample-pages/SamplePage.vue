<template>
  <h1>This is sample-page-2 no:{{ pageNo }}</h1>
  <el-icon class="icon pi pi-book"></el-icon>
</template>

<script>
export default {
  name: "SamplePage",
  props: {
    pageNo: String
  }
}
</script>

<style scoped>

</style>