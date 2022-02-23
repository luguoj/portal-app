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
import {computed} from "vue";
import {useRoute} from "vue-router";
import {inject} from "vue";

export default {
  name: "DesktopAsideMenu",
  components: {DesktopAsideMenuItem},
  props: {
    navigationExpanded: Boolean,
    navigationItems: Array
  },
  setup() {
    const route = useRoute()
    const navigationItems = inject('navigationItems')
    const activeMenuId = computed(() => {
      return '.' + route.fullPath
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