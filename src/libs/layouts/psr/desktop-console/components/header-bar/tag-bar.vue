<template>
  <psr-horizontal-scroll-bar class="ct-tags">
    <router-link
        v-for="cachedRoute in cachedRoutes" :key="cachedRoute.componentName"
        :to="cachedRoute.path"
        custom
        v-slot="{navigate}"
    >
      <tag-bar-item
          class="tag"
          :checked="activeRouteName===cachedRoute.name"
          @click="navigate"
          :closable="!cachedRoute.tag.isAffix"
          @close="handleTagClose(cachedRoute)"
      >
        <el-icon
            class="tag-icon"
            :class="cachedRoute.tag.iconCls"
        />
        {{ cachedRoute.tag.title }}
      </tag-bar-item>
    </router-link>
  </psr-horizontal-scroll-bar>
</template>

<script lang="ts">
import TagBarItem from "./tag-bar-item.vue";
import PsrHorizontalScrollBar from "@/libs/components/psr/widgets/scrollbar/horizontal/index.vue";
import {computed, defineComponent} from "vue";
import {useAppRouteCache} from "@/libs/commons/psr/app-context/plugins/route-cache/PsrAppRouteCacheProvider";
import {PsrAppRouteCacheItem} from "@/libs/commons/psr/app-context/plugins/route-cache";


export default defineComponent({
  name: "tag-bar",
  components: {
    PsrHorizontalScrollBar,
    TagBarItem
  },
  setup() {
    const routeCache = useAppRouteCache()
    return {
      cachedRoutes: computed(() => {
        return routeCache.cachedRoutes.value.filter(item => item.tag.title)
      }),
      activeRouteName: routeCache.activeRouteName,
      handleTagClose: (cachedRoute: PsrAppRouteCacheItem) => {
        routeCache.delete(cachedRoute)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.ct-tags {
  background-color: var(--el-bg-color);
  height: auto;
  padding: 2px 0;
}

.tag {
  margin: 0 2px;
}
</style>