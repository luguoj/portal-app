<template>
  <el-breadcrumb separator="/" class="breadcrumb path">
    <el-breadcrumb-item :to="HOME_PATH" class="path-item">{{ HOME_TITLE }}</el-breadcrumb-item>
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
          v-for="routePathItem in routePath" :key="routePathItem.key"
          :to="routePathItem.path?{ path: routePathItem.path }:null"
          class="path-item"
      >{{ routePathItem.title }}
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import {useRoute} from "vue-router";
import {computed, defineComponent, inject} from "vue";
import {HOME_TITLE, ROUTE_PATH_DESKTOP} from "@/router/desktop";

function buildRoutePathByNameUseRoute(routePathByName, route, basePath) {
  const path = [...basePath]
  if (route.meta?.title) {
    path.push({
      key: route.name,
      title: route.meta.title,
      iconCls: route.meta.iconCls,
      path: route.path
    })
  }
  routePathByName[route.name] = path
  if (route.children) {
    for (const child of route.children) {
      buildRoutePathByNameUseRoute(routePathByName, child, path)
    }
  }
}

function buildRoutePathByNameUseAsideMenuItem(routePathByName, asideMenuItem, basePath) {
  const {route, children} = asideMenuItem
  if (route) {
    buildRoutePathByNameUseRoute(routePathByName, route, basePath)
  } else {
    const path = [...basePath, {
      key: asideMenuItem.id,
      title: asideMenuItem.title,
      iconCls: asideMenuItem.iconCls
    }]
    if (children) {
      for (const child of children) {
        buildRoutePathByNameUseAsideMenuItem(routePathByName, child, path)
      }
    }
  }
}


export default defineComponent({
  name: "DesktopHeaderRoutePath",
  setup() {
    const route = useRoute()
    const asideMenuItems = inject('asideMenuItems')
    const asideMenuItemRoutePathByName = computed(() => {
      const result = {}
      for (const asideMenuItem of asideMenuItems) {
        buildRoutePathByNameUseAsideMenuItem(result, asideMenuItem, [])
      }
      return result
    })
    const routePath = computed(() => {
      const result = []
      if (route.fullPath !== ROUTE_PATH_DESKTOP.HOME) {
        if (asideMenuItemRoutePathByName.value
            && asideMenuItemRoutePathByName.value[route.name]) {
          // 如果关联菜单项目，则追加菜单路径
          result.push(...asideMenuItemRoutePathByName.value[route.name])
        } else {
          // 否则直接追加匹配的路由标题
          for (const routeMatched of route.matched) {
            if (routeMatched.meta?.title) {
              result.push({
                key: routeMatched.name,
                title: routeMatched.meta.title,
                iconCls: routeMatched.meta.iconCls,
                patch: route.path
              })
            }
          }
        }
      }
      return result
    })
    return {
      HOME_PATH: ROUTE_PATH_DESKTOP.HOME,
      HOME_TITLE,
      routePath
    }
  }
})
</script>

<style scoped>
.path {
  width: fit-content;
  white-space: nowrap;
}

.path-item {
  display: inline-block;
  float: none;
}

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