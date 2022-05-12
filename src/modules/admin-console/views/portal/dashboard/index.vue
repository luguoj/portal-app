<template>
  <router-view v-slot="{Component}">
    <keep-alive :include="['admin-console-portal-dashboard-list']">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "admin-console-portal-dashboard"
})
</script>

<style scoped>

</style>