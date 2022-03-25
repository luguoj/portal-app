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

<script lang="ts">
import {useRoute} from "vue-router";
import {computed, defineComponent, inject, Ref} from "vue";
import {HOME_TITLE, ROUTE_PATH_DESKTOP} from "@/libs/components/psr-layout/route";
import {MenuItem} from "@/navigation-menu/NavigationMenuItem";
import {PSRRouteRecordRaw, PSRRouteMeta} from "@/libs/commons/router";

interface RoutePathItem {
  key: string | symbol,
  title: string,
  iconCls?: string,
  path?: string
}

function buildRoutePathByNameUseRoute(routePathByName: Record<string, RoutePathItem[]>, route: PSRRouteRecordRaw, basePath: RoutePathItem[]) {
  const path = [...basePath]
  if (route.meta?.tag) {
    path.push({
      key: route.name,
      title: route.meta.tag.title,
      iconCls: route.meta.tag.iconCls,
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

function buildRoutePathByNameUseNavigationMenuItem(routePathByName: Record<string, RoutePathItem[]>, navigationMenuItem: MenuItem, basePath: RoutePathItem[]) {
  const {route, children} = navigationMenuItem
  if (route) {
    buildRoutePathByNameUseRoute(routePathByName, route, basePath)
  } else {
    const path: RoutePathItem[] = [...basePath, {
      key: navigationMenuItem.id,
      title: navigationMenuItem.title,
      iconCls: navigationMenuItem.iconCls
    }]
    if (children) {
      for (const child of children) {
        buildRoutePathByNameUseNavigationMenuItem(routePathByName, child, path)
      }
    }
  }
}


export default defineComponent({
  name: "psr-layout-header-route-path",
  setup() {
    const route = useRoute()
    const navigationMenuItems = inject('navigationMenuItems') as Ref<MenuItem[]>
    const navigationMenuItemRoutePathByName = computed(() => {
      const result: Record<string | symbol, RoutePathItem[]> = {}
      for (const navigationMenuItem of navigationMenuItems.value) {
        buildRoutePathByNameUseNavigationMenuItem(result, navigationMenuItem, [])
      }
      return result
    })
    const routePath = computed(() => {
      const result: RoutePathItem[] = []
      if (route.fullPath !== ROUTE_PATH_DESKTOP.HOME) {
        if (navigationMenuItemRoutePathByName.value && navigationMenuItemRoutePathByName.value[route.name!]) {
          // 如果关联菜单项目，则追加菜单路径
          result.push(...navigationMenuItemRoutePathByName.value[route.name!])
        } else {
          // 否则直接追加匹配的路由标题
          for (const routeMatched of route.matched) {
            const meta = routeMatched.meta as PSRRouteMeta
            if (meta?.tag?.title) {
              result.push({
                key: routeMatched.name!,
                title: meta.tag.title,
                iconCls: meta.tag.iconCls,
                path: route.path
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