<template>
  <el-container class="ct-navigation">
    <el-header class="ct-title">
      <desktop-aside-title
          :navigation-expanded="navigationExpanded"
      />
    </el-header>
    <el-main class="ct-menu">
      <el-scrollbar>
        <desktop-aside-menu
            :navigation-expanded="navigationExpanded"
        />
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import DesktopAsideTitle from "@/views/desktop/aside/DesktopAsideTitle";
import DesktopAsideMenu from "@/views/desktop/aside/DesktopAsideMenu";
import {computed} from "vue";
import {useStore} from "vuex";

export default {
  name: "DesktopAside",
  components: {
    DesktopAsideTitle,
    DesktopAsideMenu,
  },
  setup() {
    const store = useStore()
    return {
      navigationExpanded: computed(() => store.state.desktop.navigationExpanded)
    }
  }
}
</script>

<style scoped>

</style>