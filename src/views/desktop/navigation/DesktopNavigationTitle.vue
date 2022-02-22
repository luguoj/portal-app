<template>
  <div class="ct-inner">
    <div class="icon">
      <el-image style="width: 40px;height: 40px" fit="fill" :src="titleIconUrl"></el-image>
    </div>
    <transition name="text">
      <div v-show="navigationExpanded" class="text">
        {{ title }}
      </div>
    </transition>
  </div>
</template>

<script>
import {ElCollapseTransition} from "element-plus";

ElCollapseTransition
export default {
  name: "DesktopNavigationTitle",
  props: ['navigationExpanded'],
  setup(props, context) {
    return {
      titleIconUrl: './favicon.ico',
      title: process.env.VUE_APP_TITLE,
    }
  }
}
</script>

<style lang="scss" scoped>
.ct-inner {
  padding: 0px 12px;
  line-height: var(--el-header-height);

  .icon {
    float: left;

    .el-image {
      vertical-align: middle;
    }
  }

  .text {
    float: left;
    font-size: var(--el-font-size-extra-large);
    font-weight: bolder;
    white-space: nowrap;
    padding-left: 12px;
  }
}

.text-enter-active {
  animation: text-show-ani var(--el-transition-duration) ease-in;
}

.text-leave-active {
  animation: text-show-ani reverse var(--el-transition-duration) ease-in;
}

@keyframes text-show-ani {
  from {
    width: 0px;
  }
}
</style>