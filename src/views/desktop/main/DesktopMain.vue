<template>
  <el-container class="ct-workspace">
    <el-header class="ct-tags">
      <el-scrollbar ref="refScrollbar" @wheel.prevent="handleScroll">
        <div class="ct-scrollbar">
          <desktop-main-view-tag
              class="tag"
              v-for="view in views"
              :checked="activeView==view"
              @click="activeView=view"
          >
            {{ view.title }}
          </desktop-main-view-tag>
        </div>
      </el-scrollbar>
    </el-header>
    <el-main class="ct-work">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>

import DesktopMainViewTag from "@/views/desktop/main/DesktopMainViewTag";
import {reactive, ref} from "vue";

export default {
  name: "DesktopWorkspace",
  components: {DesktopMainViewTag},
  setup() {
    const views = reactive([])
    const refScrollbar = ref(null)
    const activeView = ref(null)
    for (let i = 0; i < 20; i++) {
      views.push({
        title: 'page' + i,

      })
    }
    return {
      views,
      refScrollbar,
      activeView,
      handleScroll: (e) => {
        const wheelDelta = e.wheelDelta || -e.deltaY * 40
        const scrollbar = refScrollbar.value
        scrollbar.setScrollLeft(scrollbar.wrap$.scrollLeft - wheelDelta)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ct-workspace {
  height: 100%;
}

.ct-tags {
  background-color: var(--el-color-white);
  height: auto;
  padding: 0;
}

.ct-work {
  background-color: var(--el-color-white);
  height: 100%;
}


.ct-scrollbar {
  display: flex;
  width: fit-content;
  padding: 0 20px;
}

.tag {
  margin: 1px 2px;
}
</style>