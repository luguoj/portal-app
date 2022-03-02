<template>
  <h1>Error. Page '{{ pathMatch }}' not found</h1>
</template>

<script>
export default {
  name: "DesktopViewErrorNotFound",
  props: {
    pathMatch: String
  }
}
</script>

<style scoped>

</style>