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
import {computed, defineComponent} from "vue";
import {useStore} from "vuex";
import {useAppContext} from "@/libs/commons/app-context/";

export default defineComponent({
  name: "psr-layout-title",
  setup() {
    const store = useStore()
    const currentRoute = useAppContext().router.current
    const showTitle = computed(() => {
      if (currentRoute.value.layout) {
        return !store.state[currentRoute.value.layout.name].asideCollapsed
      } else {
        return true
      }
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