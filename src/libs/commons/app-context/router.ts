import {createRouter, createWebHashHistory, RouteRecordRaw} from "vue-router";

declare const NProgress: any

export function buildRouter(
    layoutRoutes: RouteRecordRaw[]
) {
    const router = createRouter({
        history: createWebHashHistory(),
        routes: layoutRoutes
    })
    router.beforeEach(() => {
        NProgress.start()
    })
    router.afterEach(() => {
        NProgress.done()
    })
    return router
}