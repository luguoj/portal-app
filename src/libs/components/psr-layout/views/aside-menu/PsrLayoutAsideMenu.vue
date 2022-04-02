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
import PsrLayoutAsideMenuItem from "@/libs/components/psr-layout/views/aside-menu/PsrLayoutAsideMenuItem.vue";
import {computed, nextTick, onMounted, ref, watch, defineComponent} from "vue";
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {moduleRouteMatched} from "psr-app-context/router";
import {useAppContext} from "psr-app-context/";

export default defineComponent({
  name: "psr-layout-aside-menu",
  components: {
    PsrLayoutAsideMenuItem
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const activeMenuItemId = ref()
    const {meta: layoutMeta, navigationMenuItems: menuItems} = useAppContext().currentLayout

    function updateActiveMenuItem() {
      const _moduleRouteMatched = moduleRouteMatched(route)
      if (_moduleRouteMatched && layoutMeta.value) {
        activeMenuItemId.value = _moduleRouteMatched.name!.toString().substring(layoutMeta.value.name.length + 1)
      } else {
        activeMenuItemId.value = ''
      }
    }

    onMounted(() => {
      watch(route, updateActiveMenuItem, {immediate: true})
      watch(menuItems, () => {
        activeMenuItemId.value = null
        nextTick(updateActiveMenuItem)
      })
    })
    const menuCollapse = computed(() => {
      if (layoutMeta.value) {
        return store.state[layoutMeta.value.name].asideCollapsed
      } else {
        return false
      }
    })
    return {
      menuCollapse,
      menuItems,
      activeMenuItemId
    }
  }
})
</script>

<style scoped>
.menu {
  border: none;
}
</style>