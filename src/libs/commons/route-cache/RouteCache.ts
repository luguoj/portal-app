import {RouteLocationNormalizedLoaded, Router} from "vue-router";
import {UnwrapNestedRefs} from "@vue/reactivity";
import {reactive, ref, Ref} from "vue";
import {PSRRouteMetaTag} from "@/libs/commons/router/psr-router-interface";
import {CachedRoute} from "./CachedRoute";

export class RouteCache {
    private _router: Router
    cachedRoutes: UnwrapNestedRefs<CachedRoute[]> = reactive([] as CachedRoute[])
    cachedRouteByName: Record<string | symbol, CachedRoute> = {}
    activeRouteName: Ref<string | symbol | null> = ref(null as string | symbol | null)

    constructor(router: Router) {
        this._router = router
    }

    init() {
        this.cachedRoutes.splice(0, this.cachedRoutes.length)
        const affixRoutes = this._router.getRoutes().filter(route => {
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
        this.onRoute(this._router.currentRoute.value)
    }

    onRoute(newRoute: RouteLocationNormalizedLoaded) {
        if (newRoute.matched.length > 0) {
            const {name, components, meta} = newRoute.matched[0]
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

    delete(cachedRoute: CachedRoute) {
        const index = this.cachedRoutes.indexOf(cachedRoute)
        this.cachedRoutes.splice(index, 1)
        delete this.cachedRouteByName[cachedRoute.name]
        if (this.activeRouteName.value === cachedRoute.name) {
            this._router.push(this.cachedRoutes[index - 1].path)
        }
    }
}