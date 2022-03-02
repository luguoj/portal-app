<template>
  <div class="ct-root">
    <el-button @click="toggleNavigationExpansion" class="button-icon-only left">
      <el-icon class="pi pi-bars"/>
    </el-button>
    <el-popover
        placement="bottom"
        :visible="userPopoverVisible"
    >
      <template #reference>
        <el-button class="button-icon-only right" @click="userPopoverVisible=!userPopoverVisible">
          <el-icon class="pi pi-user"/>
        </el-button>
      </template>
      <desktop-header-user-popover @close-popover="userPopoverVisible=false"/>
    </el-popover>
    <desktop-header-view-path/>
  </div>
</template>

<script>
import DesktopHeaderUserPopover from "@/desktop/header/DesktopHeaderUserPopover";
import DesktopHeaderViewPath from "@/desktop/header/DesktopHeaderViewPath";
import {useStore} from "vuex";
import {ref} from "vue"

export default {
  name: "DesktopHeader",
  components: {DesktopHeaderViewPath, DesktopHeaderUserPopover},
  setup() {
    const store = useStore()
    return {
      toggleNavigationExpansion: () => {
        store.commit('desktop/toggleAside')
      },
      userPopoverVisible: ref(false)
    }
  }
}
</script>

<style lang="scss" scoped>
.ct-root {
  width: 100%;
  height: 100%;
  overflow: hidden;

  .el-button {
    margin-top: 14px;
    margin-bottom: 14px;
  }

  .el-breadcrumb {
    //height: var(--el-font-size-base);
    margin-top: 23px;
    margin-bottom: 23px;
  }

  .left {
    float: left;
    margin-right: 12px;
  }

  .right {
    float: right;
    margin-left: 12px;
  }

  .button-icon-only {
    width: 32px;

    i {
      font-size: var(--el-font-size-extra-large);
    }
  }
}


</style>