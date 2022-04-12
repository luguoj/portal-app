import {createRouter, createWebHashHistory, isNavigationFailure, Router} from "vue-router";
import {PsrAppRouteRecord} from "./types/PsrAppRouteRecord";
import {ref, Ref} from "vue";
import {PsrAppCurrentRoute} from "@/libs/commons/app-context/route/types/PsrAppCurrentRoute";
import {createEventHook} from "@vueuse/core"

declare const NProgress: any

export class PsrAppRouter {
    private readonly _layoutChangeEvent = createEventHook<PsrAppCurrentRoute>()
    private readonly _moduleChangeEvent = createEventHook<PsrAppCurrentRoute>()
    private readonly _routeChangeEvent = createEventHook<PsrAppCurrentRoute>()
    readonly onLayoutChange = this._layoutChangeEvent.on
    readonly onModuleChange = this._moduleChangeEvent.on
    readonly onRouteChange = this._routeChangeEvent.on
    readonly router: Router
    readonly current: Ref<PsrAppCurrentRoute> = ref({layout: null, module: null, route: null})

    constructor(routeRecords: PsrAppRouteRecord[]) {
        this.router = createRouter({
            history: createWebHashHistory(),
            routes: routeRecords
        })
        this.router.beforeEach(() => {
            NProgress.start()
        })
        this.router.afterEach((to, from, failure) => {
            if (!isNavigationFailure(failure)) {
                // 成功导航，切换布局信息
                const route = to
                let layoutChange = false
                let moduleChange = false
                const newRoute: PsrAppCurrentRoute = {
                    layout: null,
                    module: null,
                    route
                }
                if (route.matched.length > 0 && route.name !== 'root') {
                    newRoute.layout = route.matched[0] as unknown as PsrAppRouteRecord
                    if (route.matched[0].name !== this.current.value.layout?.name) {
                        console.log('切换应用布局')
                        layoutChange = true
                    }
                    if (route.matched.length > 1) {
                        newRoute.module = route.matched[1] as unknown as PsrAppRouteRecord
                        if (this.current.value.module?.name !== route.matched[1].name) {
                            console.log('切换应用模块')
                            moduleChange = true
                        }
                    }
                }
                this.current.value = newRoute
                if (layoutChange) {
                    this._layoutChangeEvent.trigger(newRoute)
                }
                if (moduleChange) {
                    this._moduleChangeEvent.trigger(newRoute)
                }
                this._routeChangeEvent.trigger(newRoute)
            }
            NProgress.done()
        })
    }

    computeModuleRouteName(name: string) {
        return this.current.value.layout?.name + '/' + name
    }
}