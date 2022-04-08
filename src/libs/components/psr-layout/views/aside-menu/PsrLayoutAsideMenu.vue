<template>
  <el-menu
      class="menu"
      :collapse="menuCollapse"
      :default-active="activeMenuItemId"
      router
  >
    <psr-layout-aside-menu-item
        v-for="menuItem in menuItems" :key="menuItem.id"
        :menu-item="menuItem"
    />
  </el-menu>
</template>

<script lang="ts">
import {computed, defineComponent, nextTick, onMounted, Ref, ref, watch} from "vue";
import PsrLayoutAsideMenuItem from "@/libs/components/psr-layout/views/aside-menu/PsrLayoutAsideMenuItem.vue";
import {useStore} from "vuex";
import {useAppContext} from "psr-app-context/";
import {AppNavigationMenuItem} from "psr-app-context/navigation-menu";
import {State} from "../../store/State";

export default defineComponent({
  name: "psr-layout-aside-menu",
  components: {
    PsrLayoutAsideMenuItem
  },
  setup() {
    const activeMenuItemId = ref()
    const store = useStore()
    const appContext = useAppContext();
    const currentRoute = appContext.currentRoute
    const menuItems: Ref<AppNavigationMenuItem[]> = appContext.navigationMenu.currentLayoutMenuItems
    const menuCollapse = computed<boolean>(() => {
      if (currentRoute.value.layout) {
        const state = store.state[currentRoute.value.layout.name] as State
        return state.asideCollapsed
      } else {
        return false
      }
    })

    function updateActiveMenuItem() {
      if (currentRoute.value.module) {
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
      menuCollapse,
      menuItems,
      activeMenuItemId
    }
  }
})
</script>