import {App, reactive, ref, Ref, watch} from "vue";
import {PSRRouteMetaTag} from "psr-app-context/route";
import {AppRouteCacheItem} from "./AppRouteCacheItem";
import {AppPlugin} from "../../AppPlugin";
import {AppContext, AppRoute} from "../../AppContext";

export class AppRouteCache extends AppPlugin {
    cachedRoutes: Ref<AppRouteCacheItem[]> = ref([] as AppRouteCacheItem[])
    cachedRouteByName: Record<string | symbol, AppRouteCacheItem> = {}
    activeRouteName: Ref<string | symbol | null> = ref(null as string | symbol | null)

    install(app: App, appContext: AppContext) {
        super.install(app, appContext);
        watch(() => appContext.store.state.username, () => this.init(), {immediate: true})
        watch(appContext.currentRoute, (route) => this.onRoute(route))
    }

    init() {
        const {router, currentRoute} = this.appContext!
        this.cachedRoutes.value = []
        this.cachedRouteByName = {}
        const affixRoutes = router.getRoutes().filter(route => {
            if (currentRoute.value.layout != null) {
                if (route.name!.toString().startsWith(currentRoute.value.layout.name) && route.meta.tag) {
                    const tag = route.meta.tag as PSRRouteMetaTag
                    return tag!.isAffix
                }
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
            this.cachedRoutes.value.push(cachedRoute)
        }
        this.onRoute(currentRoute.value)
    }

    onRoute({module, route}: AppRoute) {
        if (module) {
            const {name, components, meta} = module
            if (meta.tag) {
                const tag = meta.tag as PSRRouteMetaTag
                if (!this.cachedRouteByName[name!]) {
                    const cachedRoute = this.cachedRouteByName[name!] = reactive({
                        name: name!,
                        componentName: components!['default'].name!,
                        tag,
                        path: route!.fullPath
                    })
                    this.cachedRoutes.value.push(cachedRoute)
                } else {
                    this.cachedRouteByName[name!].path = route!.fullPath
                }
            }
            this.activeRouteName.value = name!
        } else {
            this.activeRouteName.value = null
        }
    }

    delete(cachedRoute: AppRouteCacheItem) {
        const index = this.cachedRoutes.value.indexOf(cachedRoute)
        this.cachedRoutes.value.splice(index, 1)
        delete this.cachedRouteByName[cachedRoute.name]
        if (this.activeRouteName.value === cachedRoute.name) {
            this.appContext!.router.push(this.cachedRoutes.value[index - 1].path)
        }
    }

    onLayoutChange() {
        this.init()
    }
}