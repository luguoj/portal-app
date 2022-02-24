<template>
  <el-container class="ct-workspace">
    <el-header class="ct-tags">
      <el-scrollbar ref="refScrollbar" @wheel.prevent="handleScroll">
        <div class="ct-scrollbar">
          <router-link
              v-for="view in openedViews"
              :to="view.route"
              custom
              v-slot="{navigate}"
          >
            <desktop-main-view-tag
                class="tag"
                :checked="activeView==view"
                @click="navigate"
            >
              {{ view.title }}
            </desktop-main-view-tag>
          </router-link>
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
import {reactive, ref, watch} from "vue";
import {useRouter} from "vue-router";

export default {
  name: "DesktopWorkspace",
  components: {DesktopMainViewTag},
  setup() {
    const openedViews = reactive([])
    const viewsByPath = {}
    const refScrollbar = ref(null)
    const activeView = ref(null)
    const router = useRouter()
    watch(router.currentRoute, (currentRoute) => {
      if (currentRoute.name === 'blank' || currentRoute.name === 'error-not-found') {
        activeView.value = null
      } else {
        if (!viewsByPath[currentRoute.fullPath]) {
          activeView.value = {
            route: currentRoute
          }
          viewsByPath[currentRoute.fullPath] = activeView.value
          openedViews.push(activeView.value)
        } else {
          activeView.value = viewsByPath[currentRoute.fullPath]
        }
      }
    })
    return {
      openedViews,
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