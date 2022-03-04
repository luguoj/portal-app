<template>
  <section>
    <h1>This is child page {{ pageNo }}.</h1>
    <router-view></router-view>
  </section>
</template>

<script>

export default {
  name: "SampleChildPage",
  props: {
    pageNo: String
  }
}
</script>

<style scoped>

</style>