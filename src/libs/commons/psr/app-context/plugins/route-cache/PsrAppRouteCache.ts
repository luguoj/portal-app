import {App, reactive, ref, Ref, watch} from "vue";
import {PsrAppRouteMetaTag, PsrAppRouteStatus} from "../../route";
import {PsrAppRouteCacheItem} from "./types/PsrAppRouteCacheItem";
import {PsrAppPlugin} from "../../types/PsrAppPlugin";
import {PsrAppContext} from "../../PsrAppContext";
import {isNavigationFailure} from "vue-router";

export class PsrAppRouteCache extends PsrAppPlugin {
    cachedRoutes: Ref<PsrAppRouteCacheItem[]> = ref([] as PsrAppRouteCacheItem[])
    cachedRouteByName: Record<string | symbol, PsrAppRouteCacheItem> = {}
    activeRouteName: Ref<string | symbol | null> = ref(null as string | symbol | null)

    install(app: App, appContext: PsrAppContext) {
        super.install(app, appContext);
        watch(() => this.appContext().store.store.state.username, () => this.init(), {immediate: true})
        this.appContext().router.onRouteChange(event => this.onRoute(event.newRoute))
        this.appContext().router.onLayoutChange(() => this.init())
    }

    init() {
        const router = this.appContext().router
        const currentRoute = router.current
        this.cachedRoutes.value = []
        this.cachedRouteByName = {}
        if (currentRoute.value != null && currentRoute.value.layout != null) {
            const {layout} = currentRoute.value
            const affixRoutes = router.router.getRoutes().filter(route => {
                if (route.name!.toString().startsWith(layout.name) && route.meta.tag) {
                    const tag = route.meta.tag as PsrAppRouteMetaTag
                    return tag!.isAffix
                }
                return false
            })
            for (const {name, path, components, meta} of affixRoutes) {
                const cachedRoute = this.cachedRouteByName[name!] = reactive({
                    name: name!,
                    componentName: components!['default'].name!,
                    tag: meta.tag as PsrAppRouteMetaTag,
                    path
                })
                this.cachedRoutes.value.push(cachedRoute)
            }
        }
    }

    onRoute({module, route}: PsrAppRouteStatus) {
        if (module) {
            const {name, components, meta} = module
            if (meta.tag) {
                const tag = meta.tag as PsrAppRouteMetaTag
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

    delete(cachedRoute: PsrAppRouteCacheItem) {
        if (this.cachedRoutes.value.length > 1) {
            const index = this.cachedRoutes.value.indexOf(cachedRoute)
            new Promise((resolve, reject) => {
                if (this.activeRouteName.value === cachedRoute.name) {
                    if (this.cachedRoutes.value.length === index + 1) {
                        this.appContext().router.router.push(this.cachedRoutes.value[index - 1].path).then(resolve).catch(reject)
                    } else {
                        this.appContext().router.router.push(this.cachedRoutes.value[index + 1].path).then(resolve).catch(reject)
                    }
                } else {
                    resolve(undefined)
                }
            }).then((failure) => {
                if (!isNavigationFailure(failure)) {
                    if (this.activeRouteName.value !== cachedRoute.name) {
                        this.cachedRoutes.value.splice(index, 1)
                        delete this.cachedRouteByName[cachedRoute.name]
                    }
                }
            })
        }
    }
}