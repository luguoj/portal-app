<template>
  <el-container class="ct-desktop">
    <el-aside width="auto">
      <el-container class="ct-aside">
        <el-header class="ct-title">
          <psr-view-part-title/>
        </el-header>
        <el-main class="ct-menu">
          <psr-view-part-aside-menu/>
        </el-main>
      </el-container>
    </el-aside>
    <el-container>
      <el-header class="ct-header-bar">
        <psr-view-part-header/>
      </el-header>
      <el-main class="ct-main">
        <psr-view-part-main/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import PsrViewPartHeader from "./header/PsrViewPartHeader.vue";
import PsrViewPartMain from "./main/PsrViewPartMain.vue";
import PsrViewPartTitle from "./title/PsrViewPartTitle.vue";
import PsrViewPartAsideMenu from "./aside-menu/PsrViewPartAsideMenu.vue";
import {defineComponent} from "vue";

export default defineComponent({
  name: "psr-layout-desktop-console",
  components: {
    PsrViewPartTitle,
    PsrViewPartAsideMenu,
    PsrViewPartHeader,
    PsrViewPartMain
  }
})
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
    border-bottom: var(--psr-border);
  }

  .ct-menu {
    background-color: var(--el-color-white);
    padding: 0;
    border-right: var(--psr-border);
  }
}
</style>