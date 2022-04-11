<template>
  <div class="ct-path">
    <el-button type="text" @click="toggleNavigationExpansion" class="button icon-only">
      <template #icon>
        <el-icon class="pi pi-bars"/>
      </template>
    </el-button>
    <psr-el-horizontal-scroll-bar v-show="!showSearcher" class="view-path">
      <psr-view-part-header-route-path/>
    </psr-el-horizontal-scroll-bar>
    <el-button type="text" @click.stop="handleShowSearcher" v-show="!showSearcher" class="button icon-only">
      <template #icon>
        <el-icon class="pi pi-search"/>
      </template>
    </el-button>
    <psr-view-part-header-searcher
        v-show="showSearcher"
        ref="refSearcher"
        class="searcher"
        :class="{show:showSearcher}"
    />
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
  <div class="ct-tags">
    <psr-view-part-header-tag-bar/>
  </div>
</template>

<script lang="ts">
import PsrElHorizontalScrollBar from "@/libs/components/psr/element-plus/horizontal-scroll-bar/PsrElHorizontalScrollBar.vue";
import PsrViewPartHeaderUserPopover from "./PsrViewPartHeaderUserPopover.vue";
import PsrViewPartHeaderRoutePath from "./PsrViewPartHeaderRoutePath.vue";
import PsrViewPartHeaderSearcher from "./PsrViewPartHeaderSearcher.vue";
import PsrViewPartHeaderTagBar from "./PsrViewPartHeaderTagBar.vue";
import {defineComponent, nextTick, ref, watch} from "vue"
import {useStore} from "vuex";
import {useAppContext} from "@/libs/commons/app-context";

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

    watch(currentRoute, hideSearcher)
    return {
      refSearcher,
      toggleNavigationExpansion,
      handleShowSearcher: () => {
        showSearcher.value = true
        nextTick(() => refSearcher.value.focus())
      },
      userPopoverVisible: ref(false),
      showSearcher
    }
  }
})
</script>

<style lang="scss" scoped>
.ct-path {
  height: 32px;

  .button {
    display: inline-block;
    vertical-align: middle;

    &.icon-only {
      width: 32px;

      i {
        font-size: var(--el-font-size-extra-large);
      }
    }
  }

  .view-path {
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 32px - 32px - 32px);
    height: 20px;
    margin-top: 6px;
  }

  .searcher {
    display: inline-block;
    vertical-align: middle;
    width: calc(100% - 32px - 32px);
  }

}

.ct-tags {
  height: 28px;
}
</style>