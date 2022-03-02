<template>
  <h1>This is child page {{ pageNo }}.</h1>
</template>

<script>
export default {
  name: "SampleChildPage",
  props: {
    pageNo: Number
  }
}
</script>

<style scoped>

</style>