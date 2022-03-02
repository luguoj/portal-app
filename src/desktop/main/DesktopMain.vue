<template>
  <el-container class="ct-root">
    <el-header class="ct-tags">
      <psr-el-horizontal-scroll-bar class="psr-shadow">
        <router-link
            v-for="view in openedViews"
            :to="view.fullPath"
            custom
            v-slot="{navigate}"
        >
          <desktop-main-view-tag
              class="tag"
              :checked="activeViewId===view.meta.menuItem.id"
              @click="navigate"
              :closable="!view.meta.isAffix"
          >
            <el-icon class="tag-icon" :class="view.meta.menuItem?view.meta.menuItem.iconCls:view.meta.iconCls"/>
            {{ view.meta.menuItem ? view.meta.menuItem.title : view.meta.title }}
          </desktop-main-view-tag>
        </router-link>
      </psr-el-horizontal-scroll-bar>
    </el-header>
    <el-main class="ct-view">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>

import DesktopMainViewTag from "@/desktop/main/DesktopMainViewTag";
import {onMounted, reactive, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import PsrElHorizontalScrollBar from "@/components/psr-element-plus/horizontal-scroll-bar/PsrElHorizontalScrollBar";
import {useStore} from "vuex";

export default {
  name: "DesktopWorkspace",
  components: {PsrElHorizontalScrollBar, DesktopMainViewTag},
  setup() {
    const openedViews = reactive([])
    const viewByMenuItemId = {}
    const activeViewId = ref(null)
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    function activeTagOnRoute(newRoute) {
      const {fullPath, meta} = newRoute
      if (meta.menuItem) {
        if (!viewByMenuItemId[meta.menuItem.id]) {
          const view = viewByMenuItemId[meta.menuItem.id] = reactive({fullPath, meta})
          openedViews.push(view)
        } else {
          viewByMenuItemId[meta.menuItem.id].fullPath = fullPath
        }
        activeViewId.value = meta.menuItem.id
      } else {
        activeViewId.value = null
      }
    }

    function initTags() {
      openedViews.splice(0, openedViews.length)
      const affixRoutes = router.getRoutes().filter(item => item.meta.isAffix)
      for (let i = 0; i < affixRoutes.length; i++) {
        const {path, meta} = affixRoutes[i]
        const view = reactive({fullPath: path, meta})
        viewByMenuItemId[meta.menuItem.id] = view
        openedViews.push(view)
      }
      activeTagOnRoute(route)
    }

    watch(() => store.state.desktop.username, initTags, {immediate: true})

    onMounted(() => {
      watch(route, activeTagOnRoute)
    })
    return {
      openedViews,
      activeViewId
    }
  }
}
</script>

<style lang="scss" scoped>
.ct-root {
  height: 100%;

  .ct-tags {
    background-color: var(--el-color-white);
    height: auto;
    padding: 0;
  }

  .ct-view {
    background-color: var(--el-color-white);
    height: 100%;
    padding: 10px;
  }
}

.tag {
  margin: 4px 2px;
}
</style>