<template>
  <el-menu-item
      v-if="menuItem.route"
      :index="menuItem.id"
      :route="{path:menuItem.route.path}"
  >
    <el-icon :class="menuItem.iconCls"/>
    <template #title>{{ menuItem.title }}</template>
  </el-menu-item>
  <el-sub-menu
      v-else
      :index="menuItem.id"
  >
    <template #title>
      <el-icon :class="menuItem.iconCls"/>
      <span>{{ menuItem.title }}</span>
    </template>
    <psr-layout-aside-menu-item
        v-for="child in menuItem.children" :key="child.id"
        :menu-item="child"
    />
  </el-sub-menu>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {PsrAppNavigationMenuItem} from "@/libs/commons/app-context/navigation-menu";

export default defineComponent({
  name: "psr-layout-aside-menu-item",
  props: {
    menuItem: {
      type: Object as PropType<PsrAppNavigationMenuItem>,
      required: true
    }
  }
})
</script>

<style scoped>

</style>