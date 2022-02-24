<template>
  <el-menu
      class="menu"
      :collapse="!navigationExpanded"
      :default-active="activeMenuId"
      router
  >
    <desktop-aside-menu-item
        v-for="navigationItem in navigationItems" :key="navigationItem.id"
        :navigation-item="navigationItem"
    />
  </el-menu>
</template>

<script>
import DesktopAsideMenuItem from "@/views/desktop/aside/DesktopAsideMenuItem";
import {computed, nextTick, ref, watchEffect} from "vue";
import {useRoute} from "vue-router";
import {loadNavigationItems} from "@/views/desktop/aside/LoadNavigationItems";

export default {
  name: "DesktopAsideMenu",
  components: {DesktopAsideMenuItem},
  props: {
    navigationExpanded: Boolean,
    navigationItems: Array
  },
  setup() {
    const route = useRoute()
    const activeMenuId = ref(null)
    const {navigationItems, navigationItemById, refreshNavigationItems} = loadNavigationItems(() => {
      activeMenuId.value = null
      nextTick(() => activeMenuId.value = route.fullPath)
    })
    watchEffect(() => {
      activeMenuId.value = route.fullPath
    })
    return {
      navigationItems,
      activeMenuId
    }
  }
}
</script>

<style scoped>
.menu {
  border: none;
}
</style>