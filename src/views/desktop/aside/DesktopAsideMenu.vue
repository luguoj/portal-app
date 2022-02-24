<template>
  <el-menu
      class="menu"
      :collapse="!navigationExpanded"
      :default-active="activeMenuId"
      router
  >
    <desktop-aside-menu-item
        v-for="navigationItem in navigationItems" :key="navigationItem.id"
        :navigation-item="navigationItem"
    />
  </el-menu>
</template>

<script>
import DesktopAsideMenuItem from "@/views/desktop/aside/DesktopAsideMenuItem";
import {nextTick, onMounted, ref, watch, watchEffect} from "vue";
import {useRoute} from "vue-router";
import {navigationItems, refreshNavigationItems} from "@/views/desktop/aside/LoadNavigationItems";
import {tokenService} from "@/services/Authorization";
import {AUTHENTICATED} from "@/modules/psr-oauth/context";

export default {
  name: "DesktopAsideMenu",
  components: {DesktopAsideMenuItem},
  props: {
    navigationExpanded: Boolean,
    navigationItems: Array
  },
  setup() {
    const route = useRoute()
    const activeMenuId = ref(null)
    onMounted(() => {
      watchEffect(() => {
        activeMenuId.value = route.fullPath
      })
    })
    let currentUsername = null
    onMounted(() => {
      watchEffect(() => {
        if (tokenService.context().tokenInfo().username
            && tokenService.context().tokenInfo().username != currentUsername
            && tokenService.context().tokenInfo().authenticateState === AUTHENTICATED) {
          currentUsername = tokenService.context().tokenInfo().username
          refreshNavigationItems().then(() => {
            activeMenuId.value = null
            nextTick(() => activeMenuId.value = route.fullPath)
          })
        }
      })
    })
    return {
      navigationItems,
      activeMenuId
    }
  }
}
</script>

<style scoped>
.menu {
  border: none;
}
</style>