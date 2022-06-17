<template>
  <el-menu
      class="menu"
      :collapse="asideCollapsed"
      :default-active="activeMenuItemId"
      router
  >
    <menu-item
        v-for="menuItem in menuItems" :key="menuItem.id"
        :menu-item="menuItem"
    />
  </el-menu>
</template>

<script lang="ts">
import {computed, defineComponent, nextTick, onMounted, Ref, ref, watch} from "vue";
import MenuItem from "./menu-item.vue";
import {useAppContext} from "@/libs/commons/psr/app-context";
import {useLayoutStoreProxy} from "@/libs/commons/psr/app-context/LayoutStoreProxyProvider";
import {PsrLayoutDesktopConsoleState} from "@/libs/layouts/psr/desktop-console/store";
import {PsrAppNavigationMenuItem} from "@/libs/commons/psr/app-context/navigation-menu";

export default defineComponent({
  name: "aside-menu",
  components: {
    MenuItem
  },
  setup() {
    const layoutStore = useLayoutStoreProxy<PsrLayoutDesktopConsoleState>()
    const activeMenuItemId = ref()
    const appContext = useAppContext();
    const currentRoute = appContext.router.current
    const menuItems: Ref<PsrAppNavigationMenuItem[]> = computed(() => appContext.navigationMenu.currentLayoutMenuItems.value?.aside || [])
    const asideCollapsed = computed<boolean>(() => {
      return !!layoutStore?.value?.state.asideCollapsed
    })

    function updateActiveMenuItem() {
      if (currentRoute.value?.module) {
        activeMenuItemId.value = currentRoute.value.module.name
      } else {
        activeMenuItemId.value = ''
      }
    }

    onMounted(() => {
      watch(currentRoute, updateActiveMenuItem, {immediate: true})
      watch(menuItems, () => {
        activeMenuItemId.value = null
        nextTick(updateActiveMenuItem)
      })
    })
    return {
      asideCollapsed,
      menuItems,
      activeMenuItemId
    }
  }
})
</script>

<style lang="scss">
.menu {
  border-right: unset;
}
</style>