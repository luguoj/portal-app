<template>
  <router-view v-slot="{Component}">
    <keep-alive include="AdminGroupList">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<script>
export default {
  name: "AdminGroup"
}
</script>

<style scoped>

</style>