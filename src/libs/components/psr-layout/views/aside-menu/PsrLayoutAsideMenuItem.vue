<template>
  <el-menu-item
      v-if="routePath"
      :index="menuItem.id"
      :route="{path:routePath}"
  >
    <el-icon :class="iconCls"/>
    <template #title>{{ title }}</template>
  </el-menu-item>
  <el-sub-menu
      v-else
      :index="id"
  >
    <template #title>
      <el-icon :class="iconCls"/>
      <span>{{ title }}</span>
    </template>
    <psr-layout-aside-menu-item
        v-for="child in children" :key="child.id"
        :menu-item="child"
    />
  </el-sub-menu>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {AppNavigationMenuItem} from "psr-app-context/plugins/navigation-menu";
import {useAppContext} from "psr-app-context/";

export default defineComponent({
  name: "psr-layout-aside-menu-item",
  props: {
    menuItem: {
      type: Object as PropType<AppNavigationMenuItem>,
      required: true
    }
  },
  setup(props) {
    const {meta: layoutMeta} = useAppContext().currentLayout
    const {id, title, iconCls, route, children} = props.menuItem
    let routePath: string | undefined
    if (route) {
      console.log('layout') //todo
      routePath = layoutMeta.value?.path
      if (route.path) {
        routePath += '/' + route.path
      }
    }
    return {
      id,
      title,
      iconCls,
      children,
      routePath
    }
  }
})
</script>

<style scoped>

</style>