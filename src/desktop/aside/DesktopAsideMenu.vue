<template>
  <el-menu
      class="menu"
      :collapse="menuCollapse"
      :default-active="activeMenuItemId"
      router
  >
    <desktop-aside-menu-item
        v-for="menuItem in menuItems" :key="menuItem.id||menuItem.route.name"
        :menu-item="menuItem"
    />
  </el-menu>
</template>

<script>
import DesktopAsideMenuItem from "@/desktop/aside/DesktopAsideMenuItem";
import {computed, inject, nextTick, onMounted, ref, watch} from "vue";
import {useStore} from "vuex";
import {useRoute} from "vue-router";

export default {
  name: "DesktopAsideMenu",
  components: {DesktopAsideMenuItem},
  setup() {
    const store = useStore()
    const route = useRoute()
    const activeMenuItemId = ref()
    const menuItems = inject('asideMenuItems')

    function updateActiveMenuItem() {
      if (route.matched.length > 0) {
        activeMenuItemId.value = route.matched[0].name
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
    return {
      menuCollapse: computed(() => store.state.desktop.asideCollapsed),
      menuItems,
      activeMenuItemId
    }
  }
}
</script>

<style scoped>
.menu {
  border: none;
}
</style>