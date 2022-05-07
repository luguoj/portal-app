<template>
  <router-view v-slot="{Component}">
    <keep-alive :include="['psr-dashboard-list']">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "psr-dashboard"
})
</script>

<style scoped>

</style>