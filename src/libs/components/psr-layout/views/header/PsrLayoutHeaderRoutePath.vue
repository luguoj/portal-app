<template>
  <el-breadcrumb separator="/" class="breadcrumb path">
    <el-breadcrumb-item
        :to="layoutRoutePath.path?{ path: layoutRoutePath.path }:null"
        class="path-item"
    >
      <el-dropdown>
        <div class="el-dropdown-link">
          <el-icon v-if="layoutRoutePath.iconCls" :class="layoutRoutePath.iconCls"/>
          {{ layoutRoutePath.title }}
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Action 1</el-dropdown-item>
            <el-dropdown-item>Action 2</el-dropdown-item>
            <el-dropdown-item>Action 3</el-dropdown-item>
            <el-dropdown-item disabled>Action 4</el-dropdown-item>
            <el-dropdown-item divided>Action 5</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </el-breadcrumb-item>
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
          v-for="routePathItem in routePath" :key="routePathItem.key"
          :to="routePathItem.path?{ path: routePathItem.path }:null"
          class="path-item"
      >
        <el-icon v-if="routePathItem.iconCls" :class="routePathItem.iconCls"/>
        {{ routePathItem.title }}
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import {useRoute} from "vue-router";
import {computed, defineComponent} from "vue";
import {PSRRouteRecordRaw, PSRRouteMeta} from "@/libs/commons/router/psr-router-interface";
import {AppNavigationMenuItem} from "psr-app-context/plugins/navigation-menu";
import {useAppContext} from "psr-app-context/";

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

function buildRoutePathByNameUseMenuItem(routePathByName: Record<string, RoutePathItem[]>, menuItem: AppNavigationMenuItem, basePath: RoutePathItem[]) {
  const {route, children} = menuItem
  if (route) {
    buildRoutePathByNameUseRoute(routePathByName, route, basePath)
  } else {
    const path: RoutePathItem[] = [...basePath, {
      key: menuItem.id,
      title: menuItem.title,
      iconCls: menuItem.iconCls
    }]
    if (children) {
      for (const child of children) {
        buildRoutePathByNameUseMenuItem(routePathByName, child, path)
      }
    }
  }
}

export default defineComponent({
  name: "psr-layout-header-route-path",
  setup() {
    const route = useRoute()
    const {meta: layoutMeta, navigationMenuItems: menuItems} = useAppContext().currentLayout
    const layoutRoutePath = computed(() => {
      if (layoutMeta.value) {
        const {name, path, meta: {tag: {title, iconCls}}} = layoutMeta.value
        return {
          key: name,
          title: title,
          iconCls: iconCls,
          path: path
        }
      } else {
        return null
      }
    })
    const menuItemRoutePathByName = computed(() => {
      const result: Record<string | symbol, RoutePathItem[]> = {}
      if (menuItems.value) {
        for (const menuItem of menuItems.value) {
          buildRoutePathByNameUseMenuItem(result, menuItem, [])
        }
      }
      return result
    })
    const routePath = computed(() => {
      const result: RoutePathItem[] = []
      if (layoutRoutePath.value && route.fullPath !== layoutRoutePath.value.path) {
        if (menuItemRoutePathByName.value && menuItemRoutePathByName.value[route.name!]) {
          // 如果关联菜单项目，则追加菜单路径
          result.push(...menuItemRoutePathByName.value[route.name!])
        } else {
          // 否则直接追加匹配的路由标题
          for (let i = 1; i < route.matched.length; i++) {
            const routeMatched = route.matched[i];
            const meta = routeMatched.meta as PSRRouteMeta
            if (meta?.tag) {
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
      layoutRoutePath,
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