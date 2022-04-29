<template>
  <router-view v-slot="{Component}">
    <keep-alive :include="['admin-console-authorization-user-list']">
      <component :is="Component"/>
    </keep-alive>
  </router-view>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "admin-console-authorization-user"
})
</script>

<style lang="scss" scoped>

</style>