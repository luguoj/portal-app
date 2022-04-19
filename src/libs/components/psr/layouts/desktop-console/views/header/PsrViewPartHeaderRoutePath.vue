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
            <router-link
                v-for="layoutItem in layoutItems" :key="layoutItem.name"
                :to="layoutItem.path"
                custom
                v-slot="{navigate}"
            >
              <el-dropdown-item :disabled="layoutItem.name===layoutRoutePath.key" @click="navigate">
                <el-icon :class="layoutItem.iconCls"/>
                {{ layoutItem.title }}
              </el-dropdown-item>
            </router-link>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-breadcrumb-item>
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
          v-for="routePathItem in routePath" :key="routePathItem.key"
          :to="routePathItem.route?{ path: routePathItem.route.path }:null"
          class="path-item"
      >
        <el-icon v-if="routePathItem.iconCls" :class="routePathItem.iconCls"/>
        {{ routePathItem.title }}
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {PsrAppRouteRecord} from "@/libs/commons/app-context/route";
import {PsrAppNavigationMenuItem} from "@/libs/commons/app-context/navigation-menu";
import {PsrAppRouteMeta} from "@/libs/commons/app-context/route/types/PsrAppRouteMeta";
import {useAppContext} from "@/libs/commons/app-context";

interface RoutePathItem {
  key: string | symbol,
  title: string,
  iconCls?: string,
  route?: PsrAppRouteRecord
}

function buildRoutePathByNameUseRoute(routePathByName: Record<string, RoutePathItem[]>, route: PsrAppRouteRecord, basePath: RoutePathItem[], layoutName: string) {
  const path = [...basePath]
  path.push({
    key: route.name,
    title: route.meta.tag.title,
    iconCls: route.meta.tag.iconCls,
    route
  })
  routePathByName[route.name] = path
  if (route.children) {
    for (const child of route.children) {
      buildRoutePathByNameUseRoute(routePathByName, child, path, layoutName)
    }
  }
}

function buildRoutePathByNameUseMenuItem(routePathByName: Record<string, RoutePathItem[]>, menuItem: PsrAppNavigationMenuItem, basePath: RoutePathItem[]) {
  const {route, children} = menuItem
  if (route) {
    buildRoutePathByNameUseRoute(routePathByName, route, basePath, menuItem.layoutName)
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
  name: "psr-view-part-header-route-path",
  setup() {
    const appContext = useAppContext()
    const currentRoute = appContext.router.current
    const menuItems = appContext.navigationMenu.menuItems
    const layoutItems = appContext.navigationMenu.layoutItems
    const layoutRoutePath = computed(() => {
      if (currentRoute.value?.layout) {
        const {name, path, meta: {tag: {title, iconCls}}} = currentRoute.value.layout
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
      if (currentRoute.value && layoutRoutePath.value !== null) {
        const route = currentRoute.value.route!
        if (route.fullPath !== layoutRoutePath.value.path) {
          if (menuItemRoutePathByName.value && menuItemRoutePathByName.value[route.name!]) {
            // 如果关联菜单项目，则追加菜单路径
            result.push(...menuItemRoutePathByName.value[route.name!])
          } else {
            // 否则直接追加匹配的路由标题
            for (let i = 1; i < route.matched.length; i++) {
              const routeMatched = route.matched[i];
              const meta = routeMatched.meta as PsrAppRouteMeta
              if (meta.tag) {
                result.push({
                  key: routeMatched.name!,
                  title: meta.tag.title,
                  iconCls: meta.tag.iconCls,
                })
              }
            }
          }
        }
      }
      return result
    })
    return {
      layoutItems,
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