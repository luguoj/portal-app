<template>
  <el-container class="ct-desktop">
    <el-aside width="auto">
      <el-container class="ct-aside">
        <el-header class="ct-title">
          <desktop-title/>
        </el-header>
        <el-main class="ct-menu">
          <desktop-aside-menu/>
        </el-main>
      </el-container>
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
import {provide, ref} from "vue";
import {initAsideMenuItems} from "@/desktop/initAsideMenuItems";
import DesktopTitle from "@/desktop/title/DesktopTitle";
import DesktopAsideMenu from "@/desktop/aside-menu/DesktopAsideMenu";

export default {
  name: "Desktop",
  components: {
    DesktopTitle,
    DesktopAsideMenu,
    DesktopHeader,
    DesktopMain
  },
  setup() {
    provide('asideMenuItems', initAsideMenuItems())
    provide('cachedRoutes', ref([]))
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
  border-bottom: 1px solid var(--el-border-color);
  padding: 0;
}

.ct-main {
  background-color: var(--el-color-white);
  padding: 0;
}

.ct-aside {
  height: 100%;

  .ct-title {
    background-color: var(--el-color-white);
    padding: 0;
    border-bottom: 1px solid var(--el-border-color);
  }

  .ct-menu {
    background-color: var(--el-color-white);
    padding: 0;
    border-right: 1px solid var(--el-border-color);
  }
}
</style>