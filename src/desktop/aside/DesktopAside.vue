<template>
  <el-container class="ct-root">
    <el-header class="ct-title">
      <desktop-aside-title/>
    </el-header>
    <el-main class="ct-menu">
      <el-scrollbar>
        <desktop-aside-menu/>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import DesktopAsideTitle from "@/desktop/aside/DesktopAsideTitle";
import DesktopAsideMenu from "@/desktop/aside/DesktopAsideMenu";

export default {
  name: "DesktopAside",
  components: {
    DesktopAsideTitle,
    DesktopAsideMenu,
  }
}
</script>

<style lang="scss" scoped>

.ct-root {
  height: 100%;

  .ct-title {
    background-color: var(--el-color-white);
    padding: 0;
    border-bottom: 1px solid var(--el-border-color-base);
  }

  .ct-menu {
    background-color: var(--el-color-white);
    padding: 0;
    border-right: 1px solid var(--el-border-color-base);
  }
}
</style>