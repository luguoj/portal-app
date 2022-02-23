<template>
  <el-container class="ct-desktop">
    <el-aside width="auto">
      <el-container class="ct-navigation">
        <el-header class="ct-title">
          <DesktopNavigationTitle
              :navigation-expanded="navigationExpanded"
          />
        </el-header>
        <el-main class="ct-menu">
          <el-scrollbar>
            <DesktopNavigationMenu
                :navigation-expanded="navigationExpanded"
            />
          </el-scrollbar>
        </el-main>
      </el-container>
    </el-aside>
    <el-container>
      <el-header class="ct-header-bar">
        <desktop-header
            :navigation-expanded="navigationExpanded"
            @toggle-navigation-expansion="toggleNavigationExpansion"
        />
      </el-header>
      <el-main class="ct-workspace">
        <DesktopWorkspace/>
      </el-main>
    </el-container>
  </el-container>
  <DesktopSignIn v-if="!authorized" @sign-in="onSignIn"/>
</template>

<script>
import DesktopWorkspace from "@/views/desktop/workspace/DesktopWorkspace";
import DesktopSignIn from "@/views/desktop/sign-in/DesktopSignIn";
import DesktopNavigationMenu from "@/views/desktop/navigation/DesktopNavigationMenu";
import DesktopHeader from "@/views/desktop/header/DesktopHeader";
import DesktopNavigationTitle from "@/views/desktop/navigation/DesktopNavigationTitle";
import {computed, provide} from "vue";
import {useStore} from "vuex";
import Authorize from "@/views/Authorize";

export default {
  name: "Desktop",
  components: {DesktopNavigationTitle, DesktopHeader, DesktopNavigationMenu, DesktopSignIn, DesktopWorkspace},
  setup() {
    const store = useStore()
    const authorize = Authorize()
    provide('logout', authorize.logout)
    return {
      navigationExpanded: computed(() => store.state.desktop.navigationExpanded),
      toggleNavigationExpansion: () => store.commit('desktop/toggleNavigationExpansion'),
      ...authorize
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