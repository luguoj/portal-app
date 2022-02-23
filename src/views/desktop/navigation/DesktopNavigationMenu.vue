<template>
  <el-menu
      :collapse="!navigationExpanded"
      :default-active="activeMenuId"
      router
  >
    <desktop-navigation-menu-item
        v-for="navigationItem in navigationItems" :key="navigationItem.id"
        :navigation-item="navigationItem"
    />
  </el-menu>
</template>

<script>
import DesktopNavigationMenuItem from "@/views/desktop/navigation/DesktopNavigationMenuItem";
import {computed} from "vue";
import {useRoute} from "vue-router";
import {loadNavigationItems} from "@/views/desktop/navigation/LoadNavigationItems";

export default {
  name: "DesktopNavigationMenu",
  components: {DesktopNavigationMenuItem},
  props: {
    navigationExpanded: Boolean
  },
  setup() {
    const route = useRoute()
    const navigationItems = loadNavigationItems()
    const activeMenuId = computed(() => {
      return route.fullPath
    })
    return {
      navigationItems,
      activeMenuId
    }
  }
}
</script>

<style scoped>
.el-menu {
  border: none;
}
</style>