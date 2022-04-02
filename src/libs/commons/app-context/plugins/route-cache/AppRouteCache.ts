import {RouteLocationNormalizedLoaded, Router} from "vue-router";
import {UnwrapNestedRefs} from "@vue/reactivity";
import {App, reactive, ref, Ref, watch} from "vue";
import {PSRRouteMetaTag} from "@/libs/commons/router/psr-router-interface";
import {AppRouteCacheItem} from "./AppRouteCacheItem";
import {AppPlugin} from "../../AppPlugin";
import {AppContext} from "../../AppContext";
import {moduleRouteMatched} from "../../router";

export class AppRouteCache extends AppPlugin {
    cachedRoutes: UnwrapNestedRefs<AppRouteCacheItem[]> = reactive([] as AppRouteCacheItem[])
    cachedRouteByName: Record<string | symbol, AppRouteCacheItem> = {}
    activeRouteName: Ref<string | symbol | null> = ref(null as string | symbol | null)

    install(app: App, appContext: AppContext) {
        super.install(app, appContext);
        watch(() => appContext.store.state.username, () => this.init(appContext.router), {immediate: true})
        appContext.router.beforeEach((to, from) => {
            // TODO 切换布局时初始化路由缓存
        })
        watch(appContext.router.currentRoute, (route) => this.onRoute(route))
    }

    init(router: Router) {
        this.cachedRoutes.splice(0, this.cachedRoutes.length)
        this.cachedRouteByName = {}
        const affixRoutes = router.getRoutes().filter(route => {
            if (route.meta.tag) {
                const tag = route.meta.tag as PSRRouteMetaTag
                return tag!.isAffix
            }
            return false
        })
        for (const {name, path, components, meta} of affixRoutes) {
            const cachedRoute = this.cachedRouteByName[name!] = reactive({
                name: name!,
                componentName: components['default'].name!,
                tag: meta.tag as PSRRouteMetaTag,
                path
            })
            this.cachedRoutes.push(cachedRoute)
        }
        this.onRoute(router.currentRoute.value)
    }

    onRoute(newRoute: RouteLocationNormalizedLoaded) {
        const _moduleRouteMatched = moduleRouteMatched(newRoute)
        if (_moduleRouteMatched) {
            const {name, components, meta} = _moduleRouteMatched
            if (meta.tag) {
                const tag = meta.tag as PSRRouteMetaTag
                if (!this.cachedRouteByName[name!]) {
                    const cachedRoute = this.cachedRouteByName[name!] = reactive({
                        name: name!,
                        componentName: components['default'].name!,
                        tag,
                        path: newRoute.fullPath
                    })
                    this.cachedRoutes.push(cachedRoute)
                } else {
                    this.cachedRouteByName[name!].path = newRoute.fullPath
                }
            }
            this.activeRouteName.value = name!
        } else {
            this.activeRouteName.value = null
        }
    }

    delete(cachedRoute: AppRouteCacheItem) {
        const index = this.cachedRoutes.indexOf(cachedRoute)
        this.cachedRoutes.splice(index, 1)
        delete this.cachedRouteByName[cachedRoute.name]
        if (this.activeRouteName.value === cachedRoute.name) {
            this.appContext!.router.push(this.cachedRoutes[index - 1].path)
        }
    }
}