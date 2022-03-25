<template>
  <h1>Error. Page '{{ pathMatch }}' not found</h1>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "DesktopViewErrorNotFound",
  props: {
    pathMatch: String
  }
})
</script>

<style scoped>

</style>