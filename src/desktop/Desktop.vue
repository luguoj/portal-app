<template>
  <el-container class="ct-desktop">
    <el-aside width="auto">
      <desktop-aside/>
    </el-aside>
    <el-container>
      <el-header class="ct-header-bar">
        <desktop-header/>
      </el-header>
      <el-main class="ct-main">
        <desktop-main/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import DesktopHeader from "@/desktop/header/DesktopHeader";
import DesktopMain from "@/desktop/main/DesktopMain";
import DesktopAside from "@/desktop/aside/DesktopAside";
import {provide} from "vue";
import {useAuthorization} from "@/desktop/useAuthorization";
import {menuItems} from "@/router";

export default {
  name: "Desktop",
  components: {
    DesktopAside,
    DesktopHeader,
    DesktopMain
  },
  setup() {
    useAuthorization()
    provide('asideMenuItems', menuItems)
  }
}
</script>

<style lang="scss" scoped>
.ct-desktop {
  height: 100%;
  width: 100%;
}

.ct-header-bar {
  background-color: var(--el-color-white);
  border-bottom: 1px solid var(--el-border-color-base);
}

.ct-main {
  background-color: var(--el-color-white);
  padding: 0;
}
</style>