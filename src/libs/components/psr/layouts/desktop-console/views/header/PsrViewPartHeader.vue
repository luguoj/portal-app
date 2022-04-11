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
        <psr-el-horizontal-scroll-bar v-show="!showSearcher" class="view-path">
          <psr-view-part-header-route-path/>
        </psr-el-horizontal-scroll-bar>
      </transition>
      <el-tooltip content="菜单搜索" effect="light">
        <el-button type="text" @click.stop="handleShowSearcher" class="button icon-only">
          <template #icon>
            <el-icon class="pi pi-search"/>
          </template>
        </el-button>
      </el-tooltip>
      <transition name="searcher">
        <psr-view-part-header-searcher
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
          <el-icon class="pi pi-paperclip"/>
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
    <el-popover placement="bottom" trigger="hover">
      <template #reference>
        <el-button type="text" class="button icon-only">
          <template #icon>
            <el-icon class="pi pi-user"/>
          </template>
        </el-button>
      </template>
      <psr-view-part-header-user-popover/>
    </el-popover>
  </div>
  <div class="ct-tag-bar" v-show="tagBarCollapsed">
    <psr-view-part-header-tag-bar/>
  </div>
</template>

<script lang="ts">
import PsrElHorizontalScrollBar from "@/libs/components/psr/element-plus/horizontal-scroll-bar/PsrElHorizontalScrollBar.vue";
import PsrViewPartHeaderUserPopover from "./PsrViewPartHeaderUserPopover.vue";
import PsrViewPartHeaderRoutePath from "./PsrViewPartHeaderRoutePath.vue";
import PsrViewPartHeaderSearcher from "./PsrViewPartHeaderSearcher.vue";
import PsrViewPartHeaderTagBar from "./PsrViewPartHeaderTagBar.vue";
import {computed, defineComponent, inject, nextTick, ref, watch} from "vue"
import {useStore} from "vuex";
import {useAppContext} from "@/libs/commons/app-context";
import {State} from "../../store/State";
import {useFullscreen} from "@vueuse/core";

export default defineComponent({
  name: "psr-view-part-header",
  components: {
    PsrElHorizontalScrollBar,
    PsrViewPartHeaderSearcher,
    PsrViewPartHeaderRoutePath,
    PsrViewPartHeaderUserPopover,
    PsrViewPartHeaderTagBar
  },
  setup() {
    const store = useStore()
    const refSearcher = ref()
    const showSearcher = ref(false)
    const currentRoute = useAppContext().router.current
    const mainRef = inject<HTMLElement | null>("main-ref")
    const tagBarCollapsed = computed<boolean>(() => {
      if (currentRoute.value.layout) {
        const state = store.state[currentRoute.value.layout.name] as State
        return state.tagBarCollapsed
      } else {
        return false
      }
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
      if (currentRoute.value.layout) {
        store.commit(`${currentRoute.value.layout.name}/toggleAside`)
      }
    }

    function toggleTagBarExpansion() {
      if (currentRoute.value.layout) {
        store.commit(`${currentRoute.value.layout.name}/toggleTagBar`)
      }
    }

    function handleShowSearcher() {
      showSearcher.value = true
      nextTick(() => refSearcher.value.focus())
    }

    function toggleImmersive() {
      useFullscreen(mainRef).toggle()
    }

    watch(currentRoute, hideSearcher)
    return {
      tagBarCollapsed,
      refSearcher,
      toggleNavigationExpansion,
      toggleTagBarExpansion,
      toggleImmersive,
      handleShowSearcher,
      userPopoverVisible: ref(false),
      showSearcher
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