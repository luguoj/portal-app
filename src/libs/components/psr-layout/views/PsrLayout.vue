<template>
  <el-container class="ct-desktop">
    <el-aside width="auto">
      <el-container class="ct-aside">
        <el-header class="ct-title">
          <psr-layout-title/>
        </el-header>
        <el-main class="ct-menu">
          <psr-layout-aside-menu/>
        </el-main>
      </el-container>
    </el-aside>
    <el-container>
      <el-header class="ct-header-bar">
        <psr-layout-header/>
      </el-header>
      <el-main class="ct-main">
        <psr-layout-main/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import PsrLayoutHeader from "@/libs/components/psr-layout/views/header/PsrLayoutHeader.vue";
import PsrLayoutMain from "@/libs/components/psr-layout/views/main/PsrLayoutMain.vue";
import PsrLayoutTitle from "@/libs/components/psr-layout/views/title/PsrLayoutTitle.vue";
import PsrLayoutAsideMenu from "@/libs/components/psr-layout/views/aside-menu/PsrLayoutAsideMenu.vue";
import {defineComponent} from "vue";
import {provideRouteCache} from "@/libs/commons/route-cache/RouteCacheProvider";

export default defineComponent({
  name: "psr-layout",
  components: {
    PsrLayoutTitle,
    PsrLayoutAsideMenu,
    PsrLayoutHeader,
    PsrLayoutMain
  },
  setup() {
    provideRouteCache()
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
    border-bottom: 1px solid var(--el-border-color);
  }

  .ct-menu {
    background-color: var(--el-color-white);
    padding: 0;
    border-right: 1px solid var(--el-border-color);
  }
}
</style>