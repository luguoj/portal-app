<template>
  <el-menu-item
      v-if="navigationItem.route"
      :index="navigationItem.id"
      :route="navigationItem.route.path?navigationItem.route:null"
  >
    <el-icon :class="navigationItem.iconCls"/>
    <template #title>{{ navigationItem.text }}</template>
  </el-menu-item>
  <el-sub-menu
      v-else
      :index="navigationItem.id"
  >
    <template #title>
      <el-icon :class="navigationItem.iconCls"/>
      <span>{{ navigationItem.text }}</span>
    </template>
    <desktop-aside-menu-item
        v-for="child in navigationItem.children" :key="child.id"
        :navigation-item="child"
    />
  </el-sub-menu>
</template>

<script>
export default {
  name: "DesktopAsideMenuItem",
  props: ['navigationItem']
}
</script>

<style scoped>

</style>