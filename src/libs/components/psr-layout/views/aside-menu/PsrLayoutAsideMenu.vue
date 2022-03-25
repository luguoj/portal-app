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
import {computed, inject, nextTick, onMounted, ref, watch, defineComponent, Ref} from "vue";
import {useStore} from "vuex";
import {useRoute} from "vue-router";
import {MenuItem} from "@/navigation-menu/NavigationMenuItem";

export default defineComponent({
  name: "psr-layout-aside-menu",
  components: {
    PsrLayoutAsideMenuItem
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const activeMenuItemId = ref()
    const menuItems = inject('navigationMenuItems') as Ref<MenuItem[]>

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
      menuCollapse: computed(() => store.state.layout.asideCollapsed),
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