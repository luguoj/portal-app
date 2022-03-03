<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <el-breadcrumb-item
        v-for="viewPathItem in viewPath"
        :to="viewPathItem.path?{ path: viewPathItem.path }:null"
    >{{ viewPathItem.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
import {useRoute} from "vue-router";
import {computed} from "vue";
import {HOME} from "@/router/desktop";

export default {
  name: "DesktopHeaderViewPath",
  setup() {
    const route = useRoute()
    const viewPath = computed(() => {
      const result = [{
        title: HOME.meta.title,
        path: HOME.path
      }]
      if (route.fullPath !== HOME.path) {
        if (route.meta.menuItem) {
          // 如果关联菜单项目，则追加菜单路径
          result.push(...route.meta.menuItem.allParents.map(parent => ({
            title: parent.title,
            path: parent.route ? parent.route.path : ''
          })))
          result.push({title: route.meta.menuItem.title, path: route.path})
        } else if (route.meta.title) {
          // 否则直接追加匹配的路由标题
          result.push({title: route.meta.title, path: route.path})
        }
      }
      return result
    })
    return {viewPath}
  }
}
</script>

<style scoped>
</style>