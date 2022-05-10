<template>
  <div class="ct-path">
    <el-tooltip content="折叠/展开菜单" effect="light">
      <el-button type="text" @click="toggleNavigationExpansion" class="button icon-only">
        <template #icon>
          <el-icon class="pi pi-bars"/>
        </template>
      </el-button>
    </el-tooltip>
    <div class="ct-middle">
      <transition name="searcher">
        <psr-horizontal-scroll-bar v-show="!showSearcher" class="view-path">
          <route-path/>
        </psr-horizontal-scroll-bar>
      </transition>
      <el-tooltip content="菜单搜索" effect="light">
        <el-button type="text" @click.stop="handleShowSearcher" class="button icon-only">
          <template #icon>
            <el-icon class="pi pi-search"/>
          </template>
        </el-button>
      </el-tooltip>
      <transition name="searcher">
        <menu-searcher
            v-show="showSearcher"
            ref="refSearcher"
            class="searcher"
            :class="{show:showSearcher}"
        />
      </transition>
    </div>
    <el-tooltip content="视图标签栏" effect="light">
      <el-button type="text" @click="toggleTagBarExpansion" class="button icon-only">
        <template #icon>
          <el-badge :value="cachedRouteCount" :hidden="!tagBarCollapsed||cachedRouteCount===0" type="primary">
            <el-icon class="pi pi-paperclip"/>
          </el-badge>
        </template>
      </el-button>
    </el-tooltip>
    <el-tooltip content="沉浸模式" effect="light">
      <el-button type="text" @click="toggleImmersive" class="button icon-only">
        <template #icon>
          <el-icon class="pi pi-window-maximize"/>
        </template>
      </el-button>
    </el-tooltip>
    <el-popover v-if="username" placement="bottom" trigger="hover">
      <template #reference>
        <el-button type="text" class="button icon-only">
          <template #icon>
            <el-icon class="pi pi-user"/>
          </template>
        </el-button>
      </template>
      <user-popover/>
    </el-popover>
    <router-link v-else :to="{name:'sign-in'}" custom v-slot="{navigate}">
      <el-tooltip content="登入" effect="light">
        <el-button type="text" class="button icon-only" @click="navigate">
          <template #icon>
            <el-icon class="pi pi-sign-in"/>
          </template>
        </el-button>
      </el-tooltip>
    </router-link>
  </div>
  <div class="ct-tag-bar" v-show="!tagBarCollapsed">
    <tag-bar/>
  </div>
</template>

<script lang="ts">
import PsrHorizontalScrollBar from "@/libs/components/psr/widgets/scrollbar/horizontal/index.vue";
import UserPopover from "./user-popover.vue";
import RoutePath from "./route-path.vue";
import MenuSearcher from "./menu-searcher.vue";
import TagBar from "./tag-bar.vue";
import {computed, defineComponent, inject, nextTick, ref, watch} from "vue"
import {useAppContext} from "@/libs/commons/psr/app-context";
import {useFullscreen} from "@vueuse/core";
import {useAppRouteCache} from "@/libs/commons/psr/app-context/plugins/route-cache";
import {useLayoutStoreProxy} from "@/libs/commons/psr/app-context/LayoutStoreProxyProvider";
import {PsrLayoutDesktopConsoleState} from "@/libs/layouts/psr/desktop-console/store";
import {useStore} from "vuex";

export default defineComponent({
  name: "header-bar",
  components: {
    PsrHorizontalScrollBar,
    MenuSearcher,
    RoutePath,
    UserPopover,
    TagBar
  },
  setup() {
    const store = useStore()
    const layoutStore = useLayoutStoreProxy<PsrLayoutDesktopConsoleState>()
    const refSearcher = ref()
    const showSearcher = ref(false)
    const currentRoute = useAppContext().router.current
    const mainRef = inject<HTMLElement | null>("main-ref")
    const tagBarCollapsed = computed<boolean>(() => {
      return !!layoutStore?.value?.state.tagBarCollapsed
    })

    function hideSearcher() {
      showSearcher.value = false
      refSearcher.value && refSearcher.value.clean()
    }

    watch(showSearcher, newValue => {
      if (newValue) {
        document.body.addEventListener('click', hideSearcher)
      } else {
        document.body.removeEventListener('click', hideSearcher)
      }
    })

    function toggleNavigationExpansion() {
      layoutStore?.value?.commit('toggleAside')
    }

    function toggleTagBarExpansion() {
      layoutStore?.value?.commit('toggleTagBar')
    }

    function handleShowSearcher() {
      showSearcher.value = true
      nextTick(() => refSearcher.value.focus())
    }

    function toggleImmersive() {
      useFullscreen(mainRef).toggle()
    }

    const routeCache = useAppRouteCache()
    watch(currentRoute, hideSearcher)
    return {
      cachedRouteCount: computed(() => {
        return routeCache.cachedRoutes.value.filter(item => item.tag.title).length
      }),
      tagBarCollapsed,
      refSearcher,
      toggleNavigationExpansion,
      toggleTagBarExpansion,
      toggleImmersive,
      handleShowSearcher,
      userPopoverVisible: ref(false),
      showSearcher,
      username: computed(() => store.state.username),
    }
  }
})
</script>

<style lang="scss" scoped>
.ct-path {
  --button-width: 32px;

  height: 50px;
  line-height: 50px;

  .button {
    display: inline-block;
    vertical-align: middle;
    margin-left: 0;

    &.icon-only {
      width: var(--button-width);

      i {
        font-size: var(--el-font-size-extra-large);
      }
    }
  }

  .ct-middle {
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - var(--button-width) * 4);

    .view-path {
      display: inline-block;
      vertical-align: middle;
      width: calc(100% - var(--button-width));
      height: 16px;
    }

    .searcher {
      display: inline-block;
      vertical-align: middle;
      width: calc(100% - var(--button-width));
    }
  }
}


.ct-tag-bar {
  height: 28px;
  border-top: var(--psr-border);
}

.searcher-enter-active {
  animation: searcher-show-ani var(--el-transition-duration) linear;
}

.searcher-leave-active {
  animation: searcher-show-ani reverse var(--el-transition-duration) linear;
}

@keyframes searcher-show-ani {
  from {
    width: 0;
  }
}
</style>