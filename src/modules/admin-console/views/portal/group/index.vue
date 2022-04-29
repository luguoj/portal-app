<template>
  <router-view v-slot="{Component}">
    <keep-alive :include="['admin-console-portal-group-list']">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "admin-console-portal-group"
})
</script>

<style scoped>

</style>