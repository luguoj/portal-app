<template>
  <router-view v-slot="{Component}">
    <keep-alive>
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "admin-console-portal-user",
})
</script>

<style scoped>

</style>