<template>
  <el-menu
      class="menu"
      :collapse="!navigationExpanded"
      :default-active="activeMenuId"
      router
  >
    <desktop-aside-menu-item
        v-for="menuItem in menuItems" :key="menuItem.id"
        :menu-item="menuItem"
    />
  </el-menu>
</template>

<script>
import DesktopAsideMenuItem from "@/views/desktop/aside/DesktopAsideMenuItem";
import {initMenu} from "@/views/desktop/aside/initMenu";

export default {
  name: "DesktopAsideMenu",
  components: {DesktopAsideMenuItem},
  props: {
    navigationExpanded: Boolean,
  },
  setup() {
    return {
      ...initMenu()
    }
  }
}
</script>

<style scoped>
.menu {
  border: none;
}
</style>