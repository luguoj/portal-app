<template>
  <el-container class="ct-root">
    <el-header class="ct-tags">
      <psr-el-horizontal-scroll-bar class="psr-shadow">
        <router-link
            v-for="cachedRoute in cachedRoutes"
            :to="cachedRoute.path"
            custom
            v-slot="{navigate}"
        >
          <desktop-main-view-tag
              class="tag"
              :checked="activeRouteName===cachedRoute.name"
              @click="navigate"
              :closable="!cachedRoute.meta.isAffix"
              @close="handleTagClose(cachedRoute)"
          >
            <el-icon
                class="tag-icon"
                :class="cachedRoute.meta.iconCls"
            />
            {{ cachedRoute.meta.title }}
          </desktop-main-view-tag>
        </router-link>
      </psr-el-horizontal-scroll-bar>
    </el-header>
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

import DesktopMainViewTag from "@/desktop/main/DesktopMainViewTag";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import PsrElHorizontalScrollBar from "@/components/psr-element-plus/horizontal-scroll-bar/PsrElHorizontalScrollBar";
import {useStore} from "vuex";

export default {
  name: "DesktopWorkspace",
  components: {PsrElHorizontalScrollBar, DesktopMainViewTag},
  setup() {
    const cachedRoutes = reactive([])
    const cachedRouteByName = {}
    const activeRouteName = ref(null)
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    function activeTagOnRoute(newRoute) {
      if (newRoute.matched.length > 0) {
        const {name, components, meta} = newRoute.matched[0]
        if (meta.title) {
          if (!cachedRouteByName[name]) {
            const cachedRoute = cachedRouteByName[name] = reactive({
              name,
              component: components['default'],
              meta,
              path: newRoute.fullPath
            })
            cachedRoutes.push(cachedRoute)
          } else {
            cachedRouteByName[name].path = newRoute.fullPath
          }
        }
        activeRouteName.value = name
      } else {
        activeRouteName.value = null
      }
    }

    function initTags() {
      cachedRoutes.splice(0, cachedRoutes.length)
      const affixRoutes = router.getRoutes().filter(route => route.meta.isAffix)
      for (const {name, path, components, meta} of affixRoutes) {
        const cachedRoute = cachedRouteByName[name] = {
          name,
          component: components['default'],
          meta,
          path
        }
        cachedRoutes.push(cachedRoute)
      }
      activeTagOnRoute(route)
    }

    watch(() => store.state.username, initTags, {immediate: true})

    onMounted(() => {
      watch(route, activeTagOnRoute)
    })
    return {
      cachedRoutes,
      keepAliveComponentNames: computed(() => cachedRoutes.map(route => route.component.name)),
      activeRouteName,
      handleTagClose: (cachedRoute) => {
        const index = cachedRoutes.indexOf(cachedRoute)
        cachedRoutes.splice(index, 1)
        delete cachedRouteByName[cachedRoute.name]
        if (activeRouteName.value === cachedRoute.name) {
          router.push(cachedRoutes[index - 1].path)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ct-root {
  height: 100%;

  .ct-tags {
    background-color: var(--el-color-white);
    height: auto;
    padding: 0;
  }

  .ct-view {
    background-color: var(--el-color-white);
    height: 100%;
    padding: 0;
  }
}

.tag {
  margin: 4px 2px;
}

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