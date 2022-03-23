<template>
  <el-menu-item
      v-if="menuItem.route"
      :index="menuItem.id"
      :route="{path: menuItem.route.path}"
  >
    <el-icon :class="menuItem.iconCls || menuItem.route?.meta.iconCls"/>
    <template #title>{{ menuItem.title || menuItem.route?.meta.title }}</template>
  </el-menu-item>
  <el-sub-menu
      v-else
      :index="menuItem.id"
  >
    <template #title>
      <el-icon :class="menuItem.iconCls"/>
      <span>{{ menuItem.title }}</span>
    </template>
    <desktop-aside-menu-item
        v-for="child in menuItem.children" :key="child.id"
        :menu-item="child"
    />
  </el-sub-menu>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: "DesktopAsideMenuItem",
  props: ['menuItem']
})
</script>

<style scoped>

</style>