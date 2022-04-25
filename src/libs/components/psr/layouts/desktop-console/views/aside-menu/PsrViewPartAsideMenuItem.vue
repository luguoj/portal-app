<template>
  <el-menu-item
      class="menu-item"
      v-if="menuItem.route"
      :index="menuItem.id"
      :route="{path:menuItem.route.path}"
  >
    <el-icon :class="menuItem.iconCls"/>
    <template #title>
      <div class="menu-item-title">
        {{ menuItem.title }}
      </div>
      <el-tooltip content="设为默认" effect="light" placement="right">
        <el-icon
            class="icon-default-navigation-route"
            :class="menuItem.route.name===defaultNavigationRoute?'pi pi-bookmark-fill':'pi pi-bookmark'"
            @click.stop="updateDefaultNavigationRoute(menuItem.route.name)"
        />
      </el-tooltip>
    </template>
  </el-menu-item>
  <el-sub-menu
      v-else
      :index="menuItem.id"
  >
    <template #title>
      <el-icon :class="menuItem.iconCls"/>
      <span>{{ menuItem.title }}</span>
    </template>
    <psr-view-part-aside-menu-item
        v-for="child in menuItem.children" :key="child.id"
        :menu-item="child"
    />
  </el-sub-menu>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from "vue";
import {PsrAppNavigationMenuItem} from "@/libs/commons/app-context/navigation-menu";
import {State} from "@/libs/components/psr/layouts/desktop-console/store/State";
import {useLayoutStoreProxy} from "@/libs/commons/app-context/LayoutStoreProxyProvider";

export default defineComponent({
  name: "psr-view-part-aside-menu-item",
  props: {
    menuItem: {
      type: Object as PropType<PsrAppNavigationMenuItem>,
      required: true
    }
  },
  setup() {
    const layoutStore = useLayoutStoreProxy<State>()
    const defaultNavigationRoute = computed(() => {
      return layoutStore?.value?.state.defaultNavigationRoute || ''
    })

    function updateDefaultNavigationRoute(navigationRoute: string) {
      if (defaultNavigationRoute.value == navigationRoute) {
        layoutStore?.value?.commit('updateDefaultNavigationRoute', '')
      } else {
        layoutStore?.value?.commit('updateDefaultNavigationRoute', navigationRoute)
      }
    }

    return {
      defaultNavigationRoute,
      updateDefaultNavigationRoute
    }
  }
})
</script>

<style lang="scss" scoped>
.menu-item {
  padding-right: 0;

}

.menu-item-title {
  flex: 1
}

.icon-default-navigation-route {
  margin: 0 1rem;
  color: var(--el-color-warning-light-5) !important;

  &:hover {
    cursor: pointer;
    color: var(--el-color-warning) !important;
  }
}
</style>