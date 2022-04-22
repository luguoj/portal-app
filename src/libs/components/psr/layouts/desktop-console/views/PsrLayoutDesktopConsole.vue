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
        <div class="ct-main-inner" ref="mainRef">
          <psr-view-part-main/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import PsrViewPartHeader from "./header/PsrViewPartHeader.vue";
import PsrViewPartMain from "./main/PsrViewPartMain.vue";
import PsrViewPartTitle from "./title/PsrViewPartTitle.vue";
import PsrViewPartAsideMenu from "./aside-menu/PsrViewPartAsideMenu.vue";
import {defineComponent, provide, ref, watchEffect} from "vue";
import {useAppContext} from "@/libs/commons/app-context";
import {State} from "../store/State";

export default defineComponent({
  name: "psr-layout-desktop-console",
  components: {
    PsrViewPartTitle,
    PsrViewPartAsideMenu,
    PsrViewPartHeader,
    PsrViewPartMain
  },
  setup() {
    const mainRef = ref<HTMLElement | null>()
    provide("main-ref", mainRef)

    const appContext = useAppContext()
    const router = appContext.router
    const currentRoute = router.current
    const store = appContext.store.store
    watchEffect(() => {
      if (
          currentRoute.value?.layout
          && (
              currentRoute.value?.route.path === currentRoute.value.layout.path
              || currentRoute.value?.route.path === currentRoute.value.layout.path + '/'
          )
      ) {
        const state = store.state[currentRoute.value.layout.name] as State
        if (state.defaultNavigationRoute) {
          router.router.push({path: '/' + state.defaultNavigationRoute})
        }
      }
    })
    return {
      mainRef
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
  background-color: var(--el-color-white);
  padding: 0;
  height: fit-content;
}

.ct-main {
  background-color: var(--el-border-color-extra-light);
  padding: 6px;
  box-shadow: 3px 3px 3px 0 rgb(0 0 0 / 12%) inset;
}

.ct-main-inner {
  background-color: var(--el-color-white);
  height: 100%;
  box-shadow: 3px 3px 3px 0 rgb(0 0 0 / 12%);
}

.ct-aside {
  height: 100%;

  .ct-title {
    background-color: var(--el-color-white);
    padding: 0;
    border-bottom: var(--psr-border);
    height: fit-content;
  }

  .ct-menu {
    background-color: var(--el-color-white);
    padding: 0;
  }
}
</style>