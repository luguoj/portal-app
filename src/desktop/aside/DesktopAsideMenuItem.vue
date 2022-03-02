<template>
  <el-menu-item
      v-if="menuItem.route"
      :index="menuItem.id"
      :route="menuItem.route"
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
    <desktop-aside-menu-item
        v-for="child in menuItem.children" :key="child.id"
        :menu-item="child"
    />
  </el-sub-menu>
</template>

<script>
export default {
  name: "DesktopAsideMenuItem",
  props: ['menuItem']
}
</script>

<style scoped>

</style>