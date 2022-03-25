<template>
  <router-view v-slot="{Component}">
    <keep-alive include="admin-console-group-ist,admin-console-group-permission">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "admin-console-group"
})
</script>

<style scoped>

</style>