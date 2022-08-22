<template>
  <el-container class="ct-desktop">
    <el-aside width="auto">
      <el-container class="ct-aside">
        <el-header class="ct-title">
          <app-title/>
        </el-header>
        <el-main class="ct-menu">
          <aside-menu/>
        </el-main>
      </el-container>
    </el-aside>
    <el-container>
      <el-header class="ct-header-bar">
        <header-bar/>
      </el-header>
      <el-main class="ct-main">
        <div class="ct-main-inner" ref="mainRef">
          <work-space/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import HeaderBar from "./components/header-bar/index.vue";
import WorkSpace from "./components/work-space/index.vue";
import AppTitle from "./components/app-title/index.vue";
import AsideMenu from "./components/aside-menu/index.vue";
import {defineComponent, provide, ref, watchEffect} from "vue";
import {useAppContext} from "@/libs/commons/psr/app-context";
import {createLayoutStoreProxy} from "@/libs/commons/psr/app-context/LayoutStoreProxyProvider";
import {PsrLayoutDesktopConsoleState} from "@/libs/layouts/psr/desktop-console/store";

export default defineComponent({
  name: "psr-layout-desktop-console",
  components: {
    HeaderBar,
    WorkSpace,
    AsideMenu,
    AppTitle
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      (vm as any).layoutPath = to.matched[0].path
    })
  },
  setup() {
    const mainRef = ref<HTMLElement | null>()
    provide("main-ref", mainRef)
    const layoutPath = ref<string | undefined>()
    const layoutStore = createLayoutStoreProxy<PsrLayoutDesktopConsoleState>()
    const {router} = useAppContext()
    watchEffect(() => {
      if (router.current.value?.route.fullPath === layoutPath.value && layoutStore.value?.state.defaultNavigationRoute) {
        router.router.replace({path: '/' + layoutStore.value.state.defaultNavigationRoute})
      }
    })
    return {
      mainRef,
      layoutPath
    }
  }
})
</script>

<style lang="scss" scoped>
.ct-desktop {
  height: 100%;
  width: 100%;
}

.ct-header-bar {
  background-color: var(--el-bg-color);
  padding: 0;
  height: fit-content;
}

.ct-main {
  background-color: var(--el-border-color-extra-light);
  padding: 6px;
  box-shadow: 3px 3px 3px 0 rgb(0 0 0 / 12%) inset;
}

.ct-main-inner {
  background-color: var(--el-bg-color);
  height: 100%;
  box-shadow: 3px 3px 3px 0 rgb(0 0 0 / 12%);
}

.ct-aside {
  height: 100%;

  .ct-title {
    background-color: var(--el-bg-color);
    padding: 0;
    border-bottom: var(--psr-border);
    height: fit-content;
  }

  .ct-menu {
    background-color: var(--el-bg-color);
    padding: 0;
  }
}
</style>