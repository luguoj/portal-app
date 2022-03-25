<template>
  <psr-el-horizontal-scroll-bar>
    <router-link
        v-for="cachedRoute in cachedRoutes"
        :to="cachedRoute.path"
        custom
        v-slot="{navigate}"
    >
      <desktop-header-tag
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
      </desktop-header-tag>
    </router-link>
  </psr-el-horizontal-scroll-bar>
</template>

<script lang="ts">
import DesktopHeaderTag from "@/desktop/header/DesktopHeaderTag.vue";
import PsrElHorizontalScrollBar from "@/components/psr-element-plus/horizontal-scroll-bar/PsrElHorizontalScrollBar.vue";
import {inject, onMounted, watch, ref, defineComponent, reactive} from "vue";
import {RouteLocationNormalizedLoaded, useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {PSRRouteMetaTag} from "@/router/RouteMeta";
import {CachedRoute} from "@/desktop/Desktop.vue";
import {UnwrapNestedRefs} from "@vue/reactivity";


export default defineComponent({
  name: "DesktopHeaderTagBar",
  components: {
    PsrElHorizontalScrollBar,
    DesktopHeaderTag
  },
  setup() {
    const cachedRoutes = inject('cachedRoutes') as UnwrapNestedRefs<CachedRoute[]>
    const cachedRouteByName: Record<string | symbol, CachedRoute> = {}
    const activeRouteName = ref(null as string | symbol | null)
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    function activeTagOnRoute(newRoute: RouteLocationNormalizedLoaded) {
      if (newRoute.matched.length > 0) {
        const {name, components, meta} = newRoute.matched[0]
        if (meta.tag) {
          const tag = meta.tag as PSRRouteMetaTag
          if (!cachedRouteByName[name!]) {
            const cachedRoute = cachedRouteByName[name!] = reactive({
              name: name!,
              componentName: components['default'].name!,
              tag,
              path: newRoute.fullPath
            })
            cachedRoutes.push(cachedRoute)
          } else {
            cachedRouteByName[name!].path = newRoute.fullPath
          }
        }
        activeRouteName.value = name!
      } else {
        activeRouteName.value = null
      }
    }

    function initTags() {
      cachedRoutes.slice(0, cachedRoutes.length)
      const affixRoutes = router.getRoutes().filter(route => {
        if (route.meta.tag) {
          const tag = route.meta.tag as PSRRouteMetaTag
          return tag!.isAffix
        }
        return false
      })
      for (const {name, path, components, meta} of affixRoutes) {
        const cachedRoute = cachedRouteByName[name!] = reactive({
          name: name!,
          componentName: components['default'].name!,
          tag: meta.tag as PSRRouteMetaTag,
          path
        })
        cachedRoutes.push(cachedRoute)
      }
      activeTagOnRoute(route)
    }

    watch(() => store.state.username, initTags, {immediate: true})

    onMounted(() => {
      watch(route, activeTagOnRoute)
    })
    return {
      cachedRoutes,
      activeRouteName,
      handleTagClose: (cachedRoute: CachedRoute) => {
        const index = cachedRoutes.indexOf(cachedRoute)
        cachedRoutes.splice(index, 1)
        delete cachedRouteByName[cachedRoute.name]
        if (activeRouteName.value === cachedRoute.name) {
          router.push(cachedRoutes[index - 1].path)
        }
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.ct-tags {
  background-color: var(--el-color-white);
  height: auto;
  padding: 0 0 4px 0;
}

.tag {
  margin: 0 2px;
}
</style>