<template>
  <section>
    <h1>This is child page {{ pageNo }}.</h1>
    <router-view></router-view>
  </section>
</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  name: "SampleChildPage",
  props: {
    pageNo: String
  }
})
</script>

<style scoped>

</style>