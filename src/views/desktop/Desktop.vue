<template>
  <el-container class="ct-desktop">
    <el-aside width="auto">
      <desktop-aside/>
    </el-aside>
    <el-container>
      <el-header class="ct-header-bar">
        <desktop-header/>
      </el-header>
      <el-main class="ct-workspace">
        <desktop-main/>
      </el-main>
    </el-container>
  </el-container>
  <desktop-sign-in/>
</template>

<script>
import DesktopSignIn from "@/views/desktop/sign-in/DesktopSignIn";
import DesktopHeader from "@/views/desktop/header/DesktopHeader";
import DesktopMain from "@/views/desktop/main/DesktopMain";
import {provide} from "vue";
import {useStore} from "vuex";
import {loadNavigationItems} from "@/views/desktop/LoadNavigationItems";
import DesktopAside from "@/views/desktop/aside/DesktopAside";

export default {
  name: "Desktop",
  components: {
    DesktopAside,
    DesktopSignIn,
    DesktopHeader,
    DesktopMain
  },
  setup() {
    const store = useStore()
    const navigationItems = loadNavigationItems()
    provide('navigationItems', navigationItems)
    return {
      navigationItems
    }
  }
}
</script>

<style lang="scss" scoped>
.ct-desktop {
  height: 100%;
  width: 100%;
}

.ct-navigation {
  height: 100%;

  .ct-title {
    background-color: var(--el-color-white);
    padding: 0;
    //border-bottom: 1px solid var(--el-border-color-base);
  }

  .ct-menu {
    background-color: var(--el-color-white);
    padding: 0;
    //border-right: 1px solid var(--el-border-color-base);
  }
}

.ct-header-bar {
  background-color: var(--el-color-white);
  //border-bottom: 1px solid var(--el-border-color-base);
}

.ct-workspace {
  background-color: var(--el-color-white);
  padding: 0;
}
</style>