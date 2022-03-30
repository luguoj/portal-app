<template>
  <router-view v-slot="{Component}">
    <!-- TODO 使用过渡动画时，会导致切换失败，待解决 -->
    <!--        <transition name="page" mode="out-in">-->
    <keep-alive :include="keepAliveComponentNames">
      <component
          :is="Component"
          :key="$route.fullPath"
      />
    </keep-alive>
    <!--        </transition>-->
  </router-view>
</template>

<script lang="ts">
import {defineComponent, computed} from "vue";
import {useAppRouteCache} from "@/libs/commons/app-context/plugins/route-cache/AppRouteCacheProvider";

export default defineComponent({
  name: "psr-layout-main",
  setup() {
    const routeCache = useAppRouteCache()
    return {
      keepAliveComponentNames: computed(() => {
        const names: string[] = []
        for (const cachedRoute of routeCache.cachedRoutes) {
          names.push(cachedRoute.componentName)
        }
        return names
      })
    }
  }
})
</script>

<style lang="scss" scoped>
.view-enter-active {
  animation: view-ani var(--el-transition-duration);
}

.view-leave-active {
  animation: view-ani reverse var(--el-transition-duration);
}

@keyframes view-ani {
  from {
    opacity: 0;
  }
}
</style>