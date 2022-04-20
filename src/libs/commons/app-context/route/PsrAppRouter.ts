import {createRouter, createWebHashHistory, isNavigationFailure, RouteLocationNormalized, RouteLocationNormalizedLoaded, Router} from "vue-router";
import {PsrAppRouteRecord} from "./types/PsrAppRouteRecord";
import {ref, Ref} from "vue";
import {PsrAppRouteChangeEvent, PsrAppRouteStatus} from "@/libs/commons/app-context/route/types/PsrAppRouteStatus";
import {createEventHook} from "@vueuse/core"
import {PsrAppRouteError} from "@/libs/commons/app-context/route/types/PsrAppRouteError";

declare const NProgress: any

export class PsrAppRouter {
    private readonly _beforeLayoutChangeEvent = createEventHook<PsrAppRouteChangeEvent>()
    private readonly _beforeModuleChangeEvent = createEventHook<PsrAppRouteChangeEvent>()
    private readonly _beforeRouteChangeEvent = createEventHook<PsrAppRouteChangeEvent>()
    private readonly _layoutChangeEvent = createEventHook<PsrAppRouteChangeEvent>()
    private readonly _moduleChangeEvent = createEventHook<PsrAppRouteChangeEvent>()
    private readonly _routeChangeEvent = createEventHook<PsrAppRouteChangeEvent>()
    readonly beforeLayoutChange = this._beforeLayoutChangeEvent.on
    readonly beforeModuleChange = this._beforeModuleChangeEvent.on
    readonly beforeRouteChange = this._beforeRouteChangeEvent.on
    readonly onLayoutChange = this._layoutChangeEvent.on
    readonly onModuleChange = this._moduleChangeEvent.on
    readonly onRouteChange = this._routeChangeEvent.on
    readonly router: Router
    readonly current: Ref<PsrAppRouteStatus | null> = ref(null)

    constructor(routeRecords: PsrAppRouteRecord[]) {
        this.router = createRouter({
            history: createWebHashHistory(),
            routes: routeRecords
        })
        this.router.beforeEach((to, from) => {
            console.log('PsrAppRouter.beforeEach(to:%O,from:%O)', to, from)
            NProgress.start()
            try {
                const newRoute = extractRoute(to)
                const oldRoute = extractRoute(from)
                if (newRoute.layout?.name !== oldRoute.layout?.name || oldRoute.route.matched.length == 0) {
                    this._beforeLayoutChangeEvent.trigger({newRoute, oldRoute})
                }
                if (newRoute.module?.name !== oldRoute.module?.name || oldRoute.route.matched.length == 0) {
                    this._beforeModuleChangeEvent.trigger({newRoute, oldRoute})
                }
                this._beforeRouteChangeEvent.trigger({newRoute, oldRoute})
                console.log('PsrAppRouter.beforeEach 成功')
                return true
            } catch (err) {
                console.warn('PsrAppRouter.beforeEach 异常', err)
                if (err instanceof PsrAppRouteError && err.redirect) {
                    return err.redirect
                } else {
                    return false
                }
            }
        })
        this.router.afterEach((to, from, failure) => {
            console.log('PsrAppRouter.afterEach(to:%O, from:%O, failure:%O)', to, from, failure)
            if (!isNavigationFailure(failure)) {
                const newRoute = extractRoute(to)
                const oldRoute = extractRoute(from)
                let layoutChange = false
                let moduleChange = false
                if (newRoute.layout?.name !== oldRoute.layout?.name || oldRoute.route.matched.length == 0) {
                    layoutChange = true
                }
                if (newRoute.module?.name !== oldRoute.module?.name || oldRoute.route.matched.length == 0) {
                    moduleChange = true
                }
                this.current.value = newRoute
                const layoutTitle = newRoute.layout?.meta.tag.title || '初始化中...'
                document.title = `${process.env.VUE_APP_TITLE} - ${layoutTitle}`
                console.log('PsrAppRouter.afterEach 更新当前路由信息:%O', newRoute)
                try {
                    if (layoutChange) {
                        this._layoutChangeEvent.trigger({newRoute, oldRoute})
                    }
                    if (moduleChange) {
                        this._moduleChangeEvent.trigger({newRoute, oldRoute})
                    }
                    this._routeChangeEvent.trigger({newRoute, oldRoute})
                } catch (err) {
                    console.warn('PsrAppRouter.afterEach 导航后处理异常:%O', err)
                }
            }
            NProgress.done()
        })
    }


    computeModuleRouteName(name: string) {
        if (this.current.value !== null) {
            return this.current.value.layout?.name + '/' + name
        } else {
            return name
        }
    }
}

export function extractLayoutRoute(route: RouteLocationNormalized): PsrAppRouteRecord | null {
    if (route.matched.length > 0 && route.fullPath !== '/') {
        return route.matched[0] as unknown as PsrAppRouteRecord
    }
    return null
}

export function extractModuleRoute(route: RouteLocationNormalized): PsrAppRouteRecord | null {
    if (route.matched.length > 1 && route.fullPath !== '/') {
        return route.matched[1] as unknown as PsrAppRouteRecord
    }
    return null
}

export function extractRoute(route: RouteLocationNormalized): {
    layout: PsrAppRouteRecord | null
    module: PsrAppRouteRecord | null
    route: RouteLocationNormalizedLoaded
} {
    return {
        layout: extractLayoutRoute(route),
        module: extractModuleRoute(route),
        route
    }
}