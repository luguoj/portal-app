<template>
  <div class="ct-inner">
    <el-button @click="toggleNavigationExpansion" class="button-icon-only left">
      <el-icon class="pi pi-bars"></el-icon>
    </el-button>
    <el-popover
        placement="bottom"
        trigger="click"
    >
      <template #reference>
        <el-button class="button-icon-only right">
          <el-icon class="pi pi-user"></el-icon>
        </el-button>
      </template>
      <DesktopHeaderBarUserPopover></DesktopHeaderBarUserPopover>
    </el-popover>
    <el-breadcrumb separator="/" class="breadcrumb left">
      <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
      <el-breadcrumb-item
      ><a href="/">promotion management</a></el-breadcrumb-item
      >
      <el-breadcrumb-item>promotion list</el-breadcrumb-item>
      <el-breadcrumb-item>promotion detail</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
import DesktopHeaderBarUserPopover from "@/views/desktop/header-bar/DesktopHeaderBarUserPopover";
import {ElMessageBox} from "element-plus";

export default {
  name: "DesktopHeaderBar",
  components: {DesktopHeaderBarUserPopover},
  props: ['navigationExpanded'],
  emits: ['toggle-navigation-expansion', 'logout'],
  setup(props, context) {
    return {
      toggleNavigationExpansion: () => {
        context.emit('toggle-navigation-expansion')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ct-inner {
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