<template>
  <div class="ct-root">
    <div class="icon"/>
    <transition name="text">
      <div v-show="showTitle" class="text">
        {{ title }}
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {State} from "../../store/State";
import {useLayoutStoreProxy} from "@/libs/commons/psr/app-context/LayoutStoreProxyProvider";

export default defineComponent({
  name: "psr-view-part-title",
  setup() {
    const layoutStore = useLayoutStoreProxy<State>()
    const showTitle = computed(() => {
      return !layoutStore?.value?.state.asideCollapsed
    })
    return {
      titleIconUrl: './favicon.ico',
      title: process.env.VUE_APP_TITLE,
      showTitle
    }
  }
})
</script>

<style lang="scss" scoped>
.ct-root {
  height: 50px;
  line-height: 50px;

  .icon {
    float: left;
    width: 64px;
    height: 50px;
    background-image: url("~@/assets/logo.png");
    background-size: 40px;
    background-repeat: no-repeat;
    background-position: center;
  }

  .text {
    float: left;
    font-size: var(--el-font-size-extra-large);
    font-weight: bolder;
    white-space: nowrap;
    margin-right: 10px;
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
    margin-right: 0;
  }
}
</style>