<template>
  <el-menu
      class="menu"
      :collapse="asideCollapsed"
      :default-active="activeMenuItemId"
      router
  >
    <psr-view-part-aside-menu-item
        v-for="menuItem in menuItems" :key="menuItem.id"
        :menu-item="menuItem"
    />
  </el-menu>
</template>

<script lang="ts">
import {computed, defineComponent, nextTick, onMounted, Ref, ref, watch} from "vue";
import PsrViewPartAsideMenuItem from "./PsrViewPartAsideMenuItem.vue";
import {useAppContext} from "@/libs/commons/psr/app-context";
import {PsrAppNavigationMenuItem} from "@/libs/commons/psr/app-context/navigation-menu";
import {State} from "../../store/State";
import {useLayoutStoreProxy} from "@/libs/commons/psr/app-context/LayoutStoreProxyProvider";

export default defineComponent({
  name: "psr-view-part-aside-menu",
  components: {
    PsrViewPartAsideMenuItem
  },
  setup() {
    const layoutStore = useLayoutStoreProxy<State>()
    const activeMenuItemId = ref()
    const appContext = useAppContext();
    const currentRoute = appContext.router.current
    const menuItems: Ref<PsrAppNavigationMenuItem[]> = appContext.navigationMenu.currentLayoutMenuItems
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