<template>
  <el-container class="ct-root">
    <el-main class="ct-view">
      <router-view v-slot="{Component}">
        <!-- TODO 使用过渡动画时，会导致切换失败，待解决 -->
        <!--        <transition name="view" mode="out-in">-->
        <keep-alive :include="keepAliveComponentNames">
          <component
              :is="Component"
              :key="$route.fullPath"
          />
        </keep-alive>
        <!--        </transition>-->
      </router-view>
    </el-main>
  </el-container>
</template>

<script>
import {defineComponent, computed, inject} from "vue";

export default defineComponent({
  name: "DesktopWorkspace",
  setup() {
    const cachedRoutes = inject('cachedRoutes')
    return {
      keepAliveComponentNames: computed(() => cachedRoutes.value.map(route => route.component.name))
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