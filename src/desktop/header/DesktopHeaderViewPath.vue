<template>
  <el-breadcrumb separator="/" class="breadcrumb">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
          v-for="(viewPathItem,index) in viewPath" :key="index+viewPathItem.title"
          :to="viewPathItem.path?{ path: viewPathItem.path }:null"
      >{{ viewPathItem.title }}
      </el-breadcrumb-item>
    </transition-group>
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
          result.push({title: route.meta.menuItem.title, path: route.meta.menuItem.route.path})
          if (route.meta.menuItem.route !== route.matched[route.matched.length - 1]) {
            result.push({title: route.meta.title, path: route.path})
          }
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
.breadcrumb-enter-from,
.breadcrumb-leave-to {
  opacity: 0;
}

.breadcrumb-leave-active {
  position: absolute;
}

.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all var(--el-transition-duration);
}

.breadcrumb-move {
  transition: all var(--el-transition-duration);
}

</style>