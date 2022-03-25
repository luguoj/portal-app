<template>
  <router-view v-slot="{Component}">
    <keep-alive include="AdminGroupList,AdminGroupPermission">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "AdminGroup"
})
</script>

<style scoped>

</style>