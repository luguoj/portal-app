<template>
  <div class="ct-root">
    <el-button @click="toggleNavigationExpansion" class="button icon-only left">
      <el-icon class="pi pi-bars"/>
    </el-button>
    <el-popover
        placement="bottom"
        :visible="userPopoverVisible"
    >
      <template #reference>
        <el-button class="button icon-only right" @click="userPopoverVisible=!userPopoverVisible">
          <el-icon class="pi pi-user"/>
        </el-button>
      </template>
      <desktop-header-user-popover @close-popover="userPopoverVisible=false"/>
    </el-popover>
    <div class="ct-path">
      <desktop-header-view-path v-show="!showSearcher" class="view-path"/>
      <el-button v-show="!showSearcher" @click.stop="handleShowSearcher" class="button icon-only right">
        <el-icon class="pi pi-search"/>
      </el-button>
      <desktop-header-searcher ref="refSearcher" v-show="showSearcher"/>
    </div>
  </div>
</template>

<script>
import DesktopHeaderUserPopover from "@/desktop/header/DesktopHeaderUserPopover";
import DesktopHeaderViewPath from "@/desktop/header/DesktopHeaderViewPath";
import {useStore} from "vuex";
import {nextTick, ref, watch} from "vue"
import PsrElHorizontalScrollBar from "@/components/psr-element-plus/horizontal-scroll-bar/PsrElHorizontalScrollBar";
import DesktopHeaderSearcher from "@/desktop/header/DesktopHeaderSearcher";
import {useRoute} from "vue-router";

export default {
  name: "DesktopHeader",
  components: {DesktopHeaderSearcher, PsrElHorizontalScrollBar, DesktopHeaderViewPath, DesktopHeaderUserPopover},
  setup() {
    const store = useStore()
    const route = useRoute()
    const refSearcher = ref()
    const showSearcher = ref(false)

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

    watch(route, hideSearcher)
    return {
      refSearcher,
      toggleNavigationExpansion: () => {
        store.commit('desktop/toggleAside')
      },
      handleShowSearcher: () => {
        showSearcher.value = true
        nextTick(() => refSearcher.value.focus())
      },
      userPopoverVisible: ref(false),
      showSearcher
    }
  }
}
</script>

<style lang="scss" scoped>
.ct-root {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .button {
    margin: 14px 0;

    &.icon-only {
      width: 32px;

      i {
        font-size: var(--el-font-size-extra-large);
      }
    }

    &.left {
      float: left;
      margin-right: 12px;
    }

    &.right {
      float: right;
      margin-left: 12px;
    }
  }

  .ct-path {
    float: left;
    width: calc(100% - 44px - 44px);
    min-width: fit-content;

    .view-path {
      margin: 23px 0;
      float: left;
    }

    .searcher {
      margin: 14px 0;
      float: left;
      width: 100%;
    }
  }


}


</style>