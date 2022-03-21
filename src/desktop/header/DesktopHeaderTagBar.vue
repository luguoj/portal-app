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
          :closable="!cachedRoute.meta.isAffix"
          @close="handleTagClose(cachedRoute)"
      >
        <el-icon
            class="tag-icon"
            :class="cachedRoute.meta.iconCls"
        />
        {{ cachedRoute.meta.title }}
      </desktop-header-tag>
    </router-link>
  </psr-el-horizontal-scroll-bar>
</template>

<script>
import DesktopHeaderTag from "@/desktop/header/DesktopHeaderTag";
import PsrElHorizontalScrollBar from "@/components/psr-element-plus/horizontal-scroll-bar/PsrElHorizontalScrollBar";
import {inject, onMounted, reactive, watch, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";

export default {
  name: "DesktopHeaderTagBar",
  components: {
    PsrElHorizontalScrollBar,
    DesktopHeaderTag
  },
  setup() {
    const cachedRoutes = inject('cachedRoutes')
    const cachedRouteByName = {}
    const activeRouteName = ref(null)
    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    function activeTagOnRoute(newRoute) {
      if (newRoute.matched.length > 0) {
        const {name, components, meta} = newRoute.matched[0]
        if (meta.title) {
          if (!cachedRouteByName[name]) {
            const cachedRoute = cachedRouteByName[name] = reactive({
              name,
              component: components['default'],
              meta,
              path: newRoute.fullPath
            })
            cachedRoutes.value.push(cachedRoute)
          } else {
            cachedRouteByName[name].path = newRoute.fullPath
          }
        }
        activeRouteName.value = name
      } else {
        activeRouteName.value = null
      }
    }

    function initTags() {
      cachedRoutes.value = []
      const affixRoutes = router.getRoutes().filter(route => route.meta.isAffix)
      for (const {name, path, components, meta} of affixRoutes) {
        const cachedRoute = cachedRouteByName[name] = {
          name,
          component: components['default'],
          meta,
          path
        }
        cachedRoutes.value.push(cachedRoute)
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
      handleTagClose: (cachedRoute) => {
        const index = cachedRoutes.value.indexOf(cachedRoute)
        cachedRoutes.value.splice(index, 1)
        delete cachedRouteByName[cachedRoute.name]
        if (activeRouteName.value === cachedRoute.name) {
          router.push(cachedRoutes.value[index - 1].path)
        }
      }
    }
  }
}
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