<template>
  <div class="ct-root">
    <div class="icon">
      <el-image style="width: 40px;height: 40px" fit="fill" :src="titleIconUrl"></el-image>
    </div>
    <transition name="text">
      <div v-show="showTitle" class="text">
        {{ title }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import {defineComponent, computed} from "vue";
import {useStore} from "vuex";

export default defineComponent({
  name: "psr-layout-title",
  setup() {
    const store = useStore()
    return {
      titleIconUrl: './favicon.ico',
      title: process.env.VUE_APP_TITLE,
      showTitle: computed(() => !store.state.desktop.asideCollapsed)
    }
  }
})
</script>

<style lang="scss" scoped>
.ct-root {
  line-height: var(--el-header-height);

  .icon {
    float: left;

    .el-image {
      vertical-align: middle;
    }

    margin: 0 12px;
  }

  .text {
    float: left;
    font-size: var(--el-font-size-extra-large);
    font-weight: bolder;
    white-space: nowrap;
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
    width: 0;
  }
}
</style>